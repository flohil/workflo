import * as _ from 'lodash'

import { compare, comparatorStr } from '../../utility_functions/util'
import {
  PageNode,
  IPageNodeOpts,
  PageElement,
  IPageElementOpts,
  IPageElementBaseOpts,
  PageElementGroup
} from '.'
import { PageElementStore } from '../stores'
import { ListWhereBuilder, XPathBuilder } from '../builders'
import { DEFAULT_INTERVAL } from '../'
import { isArray } from 'util';
import { PageNodeEventually, PageNodeWait, PageNodeCurrently } from './PageNode';

export type WdioElements = WebdriverIO.Client<WebdriverIO.RawResult<WebdriverIO.Element[]>> & WebdriverIO.RawResult<WebdriverIO.Element[]>

export interface IPageElementListIdentifier<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>
> {
  mappingObject: {[key: string] : string},
  func: ( element: PageElementType ) => string
}

export interface IPageElementListWaitEmptyReverseParams extends Workflo.IWDIOParamsInterval {
  reverse?: boolean,
}

export interface IPageElementListWaitLengthParams extends Workflo.IWDIOParamsInterval {
  comparator?: Workflo.Comparator,
}

export interface IPageElementListWaitLengthReverseParams extends IPageElementListWaitLengthParams {
  reverse?: boolean,
}

// use disableCache for a "dynamic" list whose structure changes over time
// alternatively, call refresh() when the times of structure changes are known
export interface IPageElementListOpts<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>
> extends IPageNodeOpts<Store>, Workflo.IWDIOParamsInterval {
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  elementOptions: PageElementOptions
  waitType?: Workflo.WaitType
  disableCache?: boolean
  identifier?: IPageElementListIdentifier<Store, PageElementType>
}

// holds several PageElement instances of the same type
export class PageElementList<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
> extends PageNode<Store>
implements Workflo.PageNode.IElementNode<string[], boolean[], true> {

  protected _$: Store
  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected _elementOptions: PageElementOptions
  protected _waitType: Workflo.WaitType

  protected _interval: number
  protected _disableCache: boolean
  protected _identifier: IPageElementListIdentifier<Store, PageElementType>
  protected _identifiedObjCache: {[key: string] : {[key: string] : PageElementType}}
  protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, this>

  readonly currently: PageElementListCurrently<
    Store, PageElementType, PageElementOptions, this
  >
  readonly wait: PageElementListWait<
    Store, PageElementType, PageElementOptions, this
  >
  readonly eventually: PageElementListEventually<
    Store, PageElementType, PageElementOptions, this
  >

  constructor(
    protected selector: string,
    opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>
  ) {
    super(selector, opts)

    this._waitType = opts.waitType || Workflo.WaitType.visible
    this._disableCache = opts.disableCache || false

    this._elementOptions = opts.elementOptions
    this._elementStoreFunc = opts.elementStoreFunc
    this._identifier = opts.identifier
    this._identifiedObjCache = {}
    this._interval = opts.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || DEFAULT_INTERVAL

    this.currently = new PageElementListCurrently<
      Store, PageElementType, PageElementOptions, this
    >(this, opts)
    this.wait = new PageElementListWait<
      Store, PageElementType, PageElementOptions, this
    >(this)
    this.eventually = new PageElementListEventually<
      Store, PageElementType, PageElementOptions, this
    >(this)

    this._$ = Object.create(null)

    for (const method of Workflo.Class.getAllMethods(this._store)) {
      if (method.indexOf('_') !== 0 && /^[A-Z]/.test(method)) {
        this._$[method] = <Options extends IPageElementBaseOpts<Store>>(_selector: Workflo.XPath, _options: Options) => {

          if (_selector instanceof XPathBuilder) {
            _selector = XPathBuilder.getInstance().build()
          }

          // chain selectors
          _selector = `${selector}${_selector}`

          return this._store[method].apply(this._store, [_selector, _options])
        }
      }
    }
  }

  /**
   * Use this method to initialize properties that rely on the this type
   * which is not available in the constructor.
   *
   * Make sure that this method is invoked immediatly after construction.
   *
   * @param cloneFunc
   */
  init(cloneFunc: (selector: Workflo.XPath) => this) {
    this._whereBuilder = new ListWhereBuilder(this._selector, {
      store: this._store,
      elementStoreFunc: this._elementStoreFunc,
      elementOptions: this._elementOptions,
      cloneFunc: cloneFunc,
      getAllFunc: list => list.all
    })

    this.currently.init(cloneFunc)
  }

  initialWait() {
    switch(this._waitType) {
      case Workflo.WaitType.exist:
      this.wait.any.exists()
      break
      case Workflo.WaitType.visible:
      this.wait.any.isVisible()
      break
      case Workflo.WaitType.text:
      this.wait.any.hasAnyText()
      break
      default:
        throw Error(`${this.constructor.name}: Unknown initial wait type '${this._waitType}'`)
    }
  }

// RETRIEVAL FUNCTIONS for wdio or list elements

  get $() { // Omit<Store, FilteredKeysByReturnType<Store, PageElementGroup<any, any>>> {
    return this._$
  }

  get elements() {
    this.initialWait()

    return browser.elements( this._selector )
  }

  get where() {
    this.initialWait()

    return this._whereBuilder.reset()
  }

  /**
   * Returns the first page element found in the DOM that matches the list selector.
   */
  get first() {
    return this.where.getFirst()
  }

  /**
   * @param index starts at 0
   */
  at( index: number ) {
    return this.where.getAt( index )
  }

  /**
   * Returns all page elements found in the DOM that match the list selector after initial wait.
   */
  get all() {
    const _elements: PageElementType[] = []

    try {
      const value = this.elements.value

      if (value && value.length) {
        // create list elements
        for ( let i = 0; i < value.length; i++ ) {
          // make each list element individually selectable via xpath
          const selector = `(${this._selector})[${i + 1}]`

          const listElement = this._elementStoreFunc.apply( this._store, [ selector, this._elementOptions ] )

          _elements.push( listElement )
        }
      }

      return _elements
    } catch(error) {
      // this.elements will throw error if no elements were found
      return _elements
    }
  }

// INTERACTION functions

  setIdentifier(identifier: IPageElementListIdentifier<Store, PageElementType>) {
    this._identifier = identifier

    return this
  }

  /**
   * Returns an object consisting of this._identifier.object's keys
   * as keys and the elements mapped by this._identifier.func()
   * as values.
   *
   * If this.identifier is undefined, the mapped object's keys will be defined
   * by the index of an element's occurence in the element list (first element -> 0, seconed element -> 1...)
   *
   * If cached option is set to true, returns cached identified elements object
   * if it exists and otherwise fetches new identified elements object.
   * Per default, returns a cached version of this identifier was already
   * used unless resetCache is set to true.
   * This means that the returned structure of the list may reflect an earlier state,
   * while its contents are still guaranteed to be refreshed on each access!
   *
   * Attention: this may take a long time, try to avoid: if only single elements of list
   * are needed, use get() or where instead.
   **/
  identify(
    {identifier = this._identifier, resetCache = false}:
    {identifier?: IPageElementListIdentifier<Store, PageElementType>, resetCache?: boolean} = {}
  ) {
    const cacheKey = (identifier) ? `${identifier.mappingObject.toString()}|||${identifier.func.toString()}` : 'index'

    if (this._disableCache || resetCache || !(cacheKey in this._identifiedObjCache)) {
      const listElements = this.all

      const mappedObj: {[key: string] : PageElementType} = {}

      if (identifier) { // manually set identifier
        const queryResults: {[key:string]:PageElementType} = {}

        // create hash where result of identifier func is key
        // and list element is value
        listElements.forEach(
          ( element ) => {
            const resultKey = identifier.func( element )
            queryResults[ resultKey ] = element
          }
        )

        // Assign each key in identifier's object a list element by
        // mapping queryResult's keys to identifier mapObject's values
        for ( const key in identifier.mappingObject ) {
          if ( identifier.mappingObject.hasOwnProperty( key ) ) {
            mappedObj[ key ] = queryResults[ identifier.mappingObject[ key ] ]
          }
        }
      } else { // default identifier -> mapped by index of results
        for(let i = 0; i < listElements.length; ++i) {
          mappedObj[i] = listElements[i]
        }
      }

      this._identifiedObjCache[cacheKey] = mappedObj
    }

    return this._identifiedObjCache[cacheKey]
  }

// PUBLIC GETTER FUNCTIONS

  getSelector() {
    return this._selector
  }

  getInterval() {
    return this._interval
  }

  getLength() {
    try {
      const value = this.elements.value

      if (value && value.length) {
        return value.length
      } else {
        return 0
      }
    } catch(error) {
      // this.elements will throw error if no elements were found
      return 0
    }
  }

  __getTrue(): true {
    return true
  }

  getText() {
    return this.eachGet(this.all, element => element.getText())
  }

  getDirectText() {
    return this.eachGet(this.all, element => element.getDirectText())
  }

  getIsEnabled() {
    return this.eachGet(this.all, element => {
      element.initialWait()
      return element.currently.isEnabled()
    })
  }

  // HELPER FUNCTIONS

  /**
   * If the list is empty (no elements could be located matching the list selector),
   * this function will always return true.
   *
   * @param elements
   * @param checkFunc
   * @param expected
   */
  eachCheck<T>(
    elements: PageElementType[],
    checkFunc: (element: PageElementType, expected?: T) => boolean,
    expected?: T | T[],
  ): boolean {
    const diffs: Workflo.IDiffTree = {}

    if (isArray(expected) && expected.length !== elements.length) {
      throw new Error(
        `${this.constructor.name}: ` +
        `Length of expected (${expected.length}) did not match length of list (${elements.length})!\n` +
        `( ${this._selector} )`
      )
    }

    for (let i = 0; i < elements.length; ++i) {
      const _expected: T = isArray(expected) ? expected[i] : expected
      const element = elements[i]

      if (!checkFunc(element, _expected)) {
        diffs[`[${i + 1}]`] = element.__lastDiff
      }
    }

    this._lastDiff = {
      tree: diffs
    }

    return Object.keys(diffs).length === 0
  }

  eachGet<T>(
    elements: PageElementType[],
    getFunc: (element: PageElementType) => T
  ): T[] {
    return elements.map(element => getFunc(element))
  }

  /**
   * Uses default interval and default timeout of each element contained in this list.
   *
   * @param elements
   * @param waitFunc
   * @param expected
   */
  eachWait<T>(
    elements: PageElementType[],
    waitFunc: (element: PageElementType, expected: T) => PageElementType,
    expected?: T | T[],
  ): this {
    if (isArray(expected) && expected.length !== elements.length) {
      throw new Error(
        `${this.constructor.name}: ` +
        `Length of expected (${expected.length}) did not match length of list (${elements.length})!\n` +
        `( ${this._selector} )`
      )
    }

    for (let i = 0; i < elements.length; ++i) {
      const _expected: T = isArray(expected) ? expected[i] : expected
      const element = elements[i]

      waitFunc(element, _expected)
    }

    return this
  }

  eachDo(
    elements: PageElementType[],
    doFunc: (element: PageElementType) => PageElementType,
  ) {
    return elements.map(element => doFunc(element))
  }

  eachSet<T>(
    elements: PageElementType[],
    setFunc: (element: PageElementType, value: T) => PageElementType,
    values?: T | T[],
  ) {
    if (_.isArray(values)) {
      if (elements.length !== values.length) {
        throw new Error(
          `Length of values array (${values.length}) did not match length of list page elements (${elements.length})!\n` +
          `( ${this._selector} )`
        )
      } else {
        for ( let i = 0; i < elements.length; i++) {
          setFunc(elements[i], values[i])
        }
      }
    } else {
      for ( let i = 0; i < elements.length; i++) {
        setFunc(elements[i], values)
      }
    }

    return this
  }
}

export class PageElementListCurrently<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> extends PageNodeCurrently<Store, ListType> {

  protected readonly _node: ListType

  protected _selector: string
  protected _store: Store
  protected _elementOptions: PageElementOptions
  protected _elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  protected _whereBuilder: ListWhereBuilder<Store, PageElementType, PageElementOptions, ListType>

  constructor(
    node: ListType,
    opts: IPageElementListOpts<Store, PageElementType, PageElementOptions>,
  ) {
    super(node)

    this._selector = node.getSelector()
    this._store = opts.store
    this._elementOptions = opts.elementOptions
    this._elementStoreFunc = opts.elementStoreFunc

    this._node = node
  }

  /**
   * Use this method to initialize properties that rely on the this type
   * which is not available in the constructor.
   *
   * Make sure that this method is invoked immediatly after construction.
   *
   * @param cloneFunc
   */
  init(cloneFunc: (selector: Workflo.XPath) => ListType) {
    this._whereBuilder = new ListWhereBuilder(this._selector, {
      store: this._store,
      elementStoreFunc: this._elementStoreFunc,
      elementOptions: this._elementOptions,
      cloneFunc: cloneFunc,
      getAllFunc: list => list.all
    })
  }

// RETRIEVAL FUNCTIONS for wdio or list elements

  get elements() {
    return browser.elements( this._selector )
  }

  get where() {
    return this._whereBuilder.reset()
  }

  /**
   * Returns the first page element found in the DOM that matches the list selector.
   */
  get first() {
    return this.where.getFirst()
  }

  /**
   * @param index starts at 0
   */
  at( index: number ) {
    return this.where.getAt( index )
  }

  /**
   * Returns all page elements found in the DOM that match the list selector after initial wait.
   */
  get all() {
    const elements: PageElementType[] = []
    const value = this.elements.value

    if (value && value.length) {
      // create list elements
      for ( let i = 0; i < value.length; i++ ) {
        // make each list element individually selectable via xpath
        const selector = `(${this._selector})[${i + 1}]`

        const listElement = this._elementStoreFunc.apply( this._store, [ selector, this._elementOptions ] )

        elements.push( listElement )
      }
    }

    return elements
  }

// PUBLIC GETTER FUNCTIONS

  getLength() {
    try {
      const value = this.elements.value

      if (value && value.length) {
        return value.length
      } else {
        return 0
      }
    } catch(error) {
      // this.elements will throw error if no elements were found
      return 0
    }
  }

  getText() {
    return this._node.eachGet(this.all, element => element.currently.getText())
  }

  getDirectText() {
    return this._node.eachGet(this.all, element => element.currently.getDirectText())
  }

  getExists() {
    return this._node.eachGet(this.all, element => element.currently.exists())
  }

  getIsVisible() {
    return this._node.eachGet(this.all, element => element.currently.isVisible())
  }

  getIsEnabled() {
    return this._node.eachGet(this.all, element => element.currently.isEnabled())
  }

// CHECK STATE FUNCTIONS

  isEmpty() {
    return !browser.isExisting(this._selector)
  }

  hasLength(
    length: number, comparator: Workflo.Comparator = Workflo.Comparator.equalTo
  ) {
    const actualLength = this.getLength()

    this._node.__setLastDiff({
      actual: actualLength.toString()
    })

    return compare(actualLength, length, comparator)
  }

  exists() {
    return this._node.eachCheck(this.all, element => element.currently.exists())
  }

  isVisible() {
    return this._node.eachCheck(this.all, element => element.currently.isVisible())
  }

  isEnabled() {
    return this._node.eachCheck(this.all, element => element.currently.isEnabled())
  }

  hasText(text: string | string[]) {
    return this._node.eachCheck(this.all, (element, expected) => element.currently.hasText(expected), text)
  }

  hasAnyText() {
    return this._node.eachCheck(this.all, (element) => element.currently.hasAnyText())
  }

  containsText(text: string | string[]) {
    return this._node.eachCheck(this.all, (element, expected) => element.currently.containsText(expected), text)
  }

  hasDirectText(directText: string | string[]) {
    return this._node.eachCheck(
      this.all, (element, expected) => element.currently.hasDirectText(expected), directText
    )
  }

  hasAnyDirectText() {
    return this._node.eachCheck(this.all, (element) => element.currently.hasAnyDirectText())
  }

  containsDirectText(directText: string | string[]) {
    return this._node.eachCheck(
      this.all, (element, expected) => element.currently.containsDirectText(expected), directText
    )
  }

  get not() {
    return {
      isEmpty: () => !this.isEmpty(),
      hasLength: (
        length: number, comparator: Workflo.Comparator = Workflo.Comparator.equalTo
      ) => !this.hasLength(length, comparator),
      exists: () => {
        return this._node.eachCheck(this.all, element => element.currently.not.exists())
      },
      isVisible: () => {
        return this._node.eachCheck(this.all, element => element.currently.not.isVisible())
      },
      isEnabled: () => {
        return this._node.eachCheck(this.all, element => element.currently.not.isEnabled())
      },
      hasText: (text: string | string[]) => {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.not.hasText(expected), text)
      },
      hasAnyText: () => {
        return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyText())
      },
      containsText: (text: string | string[]) => {
        return this._node.eachCheck(this.all, (element, expected) => element.currently.not.containsText(expected), text)
      },
      hasDirectText: (directText: string | string[]) => {
        return this._node.eachCheck(
          this.all, (element, expected) => element.currently.not.hasDirectText(expected), directText
        )
      },
      hasAnyDirectText: () => {
        return this._node.eachCheck(this.all, (element) => element.currently.not.hasAnyDirectText())
      },
      containsDirectText: (directText: string | string[]) => {
        return this._node.eachCheck(
          this.all, (element, expected) => element.currently.not.containsDirectText(expected), directText
        )
      }
    }
  }
}

export class PageElementListWait<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> extends PageNodeWait<Store, ListType> {

  // waits until list has given length
  hasLength( length: number, {
    timeout = this._node.getTimeout(),
    comparator = Workflo.Comparator.equalTo,
    interval = this._node.getInterval(),
    reverse
  }: IPageElementListWaitLengthReverseParams = {}) {
    const notStr = (reverse) ? 'not ' : ''

    return this._node.__waitUntil(
        () => {
          if (reverse) {
            return !this._node.currently.hasLength(length, comparator)
          } else {
            return this._node.currently.hasLength(length, comparator)
          }
        },
        () => `: Length never ${notStr}became${comparatorStr(comparator)} ${length}`,
        timeout,
        interval
    )
  }

  isEmpty({
    timeout = this._node.getTimeout(),
    interval = this._node.getInterval(),
    reverse
  } : IPageElementListWaitEmptyReverseParams = {}) {
    const notStr = (reverse) ? 'not ' : ''

    return this._node.__waitUntil(
      () => {
        if (reverse) {
          return this._node.currently.not.isEmpty()
        } else {
          return this._node.currently.isEmpty()
        }
      },
      () => ` never ${notStr}became empty`,
      timeout,
      interval
    )
  }

  get any() {
    return this._node.currently.first.wait as any as PageElementType['wait']
  }

  // Typescript has a bug that prevents Exclude from working with generic extended types:
  // https://github.com/Microsoft/TypeScript/issues/24791
  // Bug will be fixed in Typescript 3.3.0
  // get any() {
  //   return excludeNot(this._list.currently.first.wait)
  // }

  get none(): PageElementType['wait']['not'] {
    return this._node.currently.first.wait.not
  }

  exists(opts?: Workflo.IWDIOParams) {
    this._node.currently.first.wait.exists()

    return this.not.isEmpty(opts)
  }

  isVisible(opts?: Workflo.IWDIOParams) {
    return this._node.eachWait(this._node.all, element => element.wait.isVisible(opts))
  }

  isEnabled(opts?: Workflo.IWDIOParams) {
    return this._node.eachWait(this._node.all, element => element.wait.isEnabled(opts))
  }

  hasText(text: string | string[], opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.hasText(expected, opts), text,
    )
  }

  hasAnyText(opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.all, (element) => element.wait.hasAnyText(opts),
    )
  }

  containsText(text: string | string[], opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.containsText(expected, opts), text,
    )
  }

  hasDirectText(directText: string | string[], opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.hasDirectText(expected, opts), directText,
    )
  }

  hasAnyDirectText(opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.all, (element) => element.wait.hasAnyDirectText(opts),
    )
  }

  containsDirectText(directText: string | string[], opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachWait(
      this._node.all, (element, expected) => element.wait.containsDirectText(expected, opts), directText,
    )
  }

  get not() {
    return {
      isEmpty: (opts: Workflo.IWDIOParamsInterval = {}) => this.isEmpty({
        timeout: opts.timeout, interval: opts.interval, reverse: true
      }),
      hasLength: (
        length: number, opts: IPageElementListWaitLengthParams = {}
      ) => this.hasLength(length, {
        timeout: opts.timeout, interval: opts.interval, reverse: true
      }),
      exists: (opts?: Workflo.IWDIOParams) => {
        return this.not.isEmpty(opts)
      },
      isVisible: (opts?: Workflo.IWDIOParams) => {
        return this._node.eachWait(this._node.all, element => element.wait.not.isVisible(opts))
      },
      isEnabled: (opts?: Workflo.IWDIOParams) => {
        return this._node.eachWait(this._node.all, element => element.wait.not.isEnabled(opts))
      },
      hasText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.hasText(expected, opts), text
        )
      },
      hasAnyText: (opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.all, (element) => element.wait.not.hasAnyText(opts)
        )
      },
      containsText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.containsText(expected, opts), text
        )
      },
      hasDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.hasDirectText(expected, opts), directText
        )
      },
      hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.all, (element) => element.wait.not.hasAnyDirectText(opts)
        )
      },
      containsDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachWait(
          this._node.all, (element, expected) => element.wait.not.containsDirectText(expected, opts), directText
        )
      }
    }
  }
}

export class PageElementListEventually<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions extends Partial<IPageElementOpts<Store>>,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> extends PageNodeEventually<Store, ListType> {

  // Typescript has a bug that prevents Exclude from working with generic extended types:
  // https://github.com/Microsoft/TypeScript/issues/24791
  // Bug will be fixed in Typescript 3.3.0
  // get any() {
  //   return excludeNot(this._list.currently.first.eventually)
  // }

  get any() {
    return this._node.currently.first.eventually as any as PageElementType['eventually']
  }

  get none(): PageElementType['eventually']['not'] {
    return this._node.currently.first.eventually.not
  }

  hasLength( length: number, {
    timeout = this._node.getTimeout(),
    comparator = Workflo.Comparator.equalTo,
    interval = this._node.getInterval(),
    reverse
  }: IPageElementListWaitLengthReverseParams = {} ) {
    return this._node.__eventually(
      () => this._node.wait.hasLength( length, { timeout, comparator, interval, reverse } )
    )
  }

  isEmpty({
    timeout = this._node.getTimeout(),
    interval = this._node.getInterval(),
    reverse
  }: IPageElementListWaitEmptyReverseParams = {}) {
    return this._node.__eventually( () => this._node.wait.isEmpty( { timeout, interval, reverse } ) )
  }

  exists(opts?: Workflo.IWDIOParams) {
    return this.not.isEmpty(opts)
  }

  isVisible(opts?: Workflo.IWDIOParams) {
    return this._node.eachCheck(this._node.all, element => element.eventually.isVisible(opts))
  }

  isEnabled(opts?: Workflo.IWDIOParams) {
    return this._node.eachCheck(this._node.all, element => element.eventually.isEnabled(opts))
  }

  hasText(text: string | string[], opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.hasText(expected, opts), text
    )
  }

  hasAnyText(opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.all, (element) => element.eventually.hasAnyText(opts)
    )
  }

  containsText(text: string | string[], opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.containsText(expected, opts), text
    )
  }

  hasDirectText(directText: string | string[], opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.hasDirectText(expected, opts), directText
    )
  }

  hasAnyDirectText(opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.all, (element) => element.eventually.hasAnyDirectText(opts)
    )
  }

  containsDirectText(directText: string | string[], opts?: Workflo.IWDIOParamsInterval) {
    return this._node.eachCheck(
      this._node.all, (element, expected) => element.eventually.containsDirectText(expected, opts), directText
    )
  }

  get not() {
    return {
      isEmpty: (opts: Workflo.IWDIOParamsInterval = {}) => this.isEmpty({
        timeout: opts.timeout, interval: opts.interval, reverse: true
      }),
      hasLength: (length: number, opts: IPageElementListWaitLengthParams = {}) => this.hasLength(length, {
        timeout: opts.timeout, interval: opts.interval, reverse: true
      }),
      exists: (opts?: Workflo.IWDIOParams) => {
        return this.isEmpty(opts)
      },
      isVisible: (opts?: Workflo.IWDIOParams) => {
        return this._node.eachCheck(this._node.all, element => element.eventually.not.isVisible(opts))
      },
      isEnabled: (opts?: Workflo.IWDIOParams) => {
        return this._node.eachCheck(this._node.all, element => element.eventually.not.isEnabled(opts))
      },
      hasText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.hasText(expected, opts), text
        )
      },
      hasAnyText: (opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.all, undefined, (element) => element.eventually.not.hasAnyText(opts)
        )
      },
      containsText: (text: string | string[], opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.containsText(expected, opts), text
        )
      },
      hasDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.hasDirectText(expected, opts), directText
        )
      },
      hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.all, undefined, (element) => element.eventually.not.hasAnyDirectText(opts)
        )
      },
      containsDirectText: (directText: string | string[], opts?: Workflo.IWDIOParamsInterval) => {
        return this._node.eachCheck(
          this._node.all, (element, expected) => element.eventually.not.containsDirectText(expected, opts), directText
        )
      }
    }
  }
}