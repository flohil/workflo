import { XPathBuilder } from './XPathBuilder'
import { PageElement, PageElementList } from '../page_elements'
import { PageElementStore, CloneFunc } from '../stores'

export interface IWhereBuilderOpts<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> {
  store: Store
  elementStoreFunc: (selector: string, options: PageElementOptions) => PageElementType
  elementOptions: PageElementOptions,
  cloneFunc: CloneFunc<ListType>
}

export class ListWhereBuilder<
  Store extends PageElementStore,
  PageElementType extends PageElement<Store>,
  PageElementOptions,
  ListType extends PageElementList<Store, PageElementType, PageElementOptions>
> {
  protected _selector: string

  protected _store: Store
  protected _elementStoreFunc: (selector: string, opts: PageElementOptions) => PageElementType
  protected _elementOptions: PageElementOptions
  protected _cloneFunc: CloneFunc<ListType>

  protected _xPathBuilder: XPathBuilder

  constructor(selector: string, opts: IWhereBuilderOpts<Store, PageElementType, PageElementOptions, ListType>) {
    this._selector = selector
    this._store = opts.store
    this._elementStoreFunc = opts.elementStoreFunc
    this._elementOptions = opts.elementOptions
    this._cloneFunc = opts.cloneFunc

    this._xPathBuilder = XPathBuilder.getInstance()
  }

// XPathBuilder facade

  reset() {
    this._xPathBuilder.reset(this._selector)
    return this
  }

  /**
   * Appends plain xPath string to current selector.
   * @param appendedSelector
   */
  append(appendedSelector: string) {
    this._xPathBuilder.append(appendedSelector)
    return this
  }

  /**
   * Adds plain xPath constraint to current selector.
   * @param constraintSelector
   * @param builderFunc optional -> can be used to apply XPathSelector API to constraintSelector
   */
  constraint(constraintSelector: string, builderFunc?: (xPath: XPathBuilder) => XPathBuilder) {
    this._xPathBuilder.constraint(constraintSelector)
    return this
  }

  text(text: string) {
    this._xPathBuilder.text(text)
    return this
  }

  containsText(text: string) {
    this._xPathBuilder.containsText(text)
    return this
  }

  attr(key: string, value: string) {
    this._xPathBuilder.attr(key, value)
    return this
  }

  containsAttr(key: string, value: string) {
    this._xPathBuilder.containsAttr(key, value)
    return this
  }

  id(value: string) {
    return this.attr('id', value)
  }

  class(value: string) {
    return this.attr('class', value)
  }

  containsClass(value: string) {
    return this.containsAttr('class', value)
  }

  /**
   * Finds element by index of accurence on a single "level" of the DOM.
   * Eg.: If index === 3, there must be 3 siblings on the same DOM level that match the current selector
   * and the third one will be selected.
   * @param index starts at 1
   */
  levelIndex(level: number) {
    this._xPathBuilder.levelIndex(level)
    return this
  }

  /**
   * Finds element by index of accurence accross all "levels/depths" of the DOM.
   * @param index starts at 1
   */
  index(index: number) {
    this._xPathBuilder.index( index )
    return this
  }

// Result retrieval functions

  getFirst(): PageElementType {
    return this._elementStoreFunc.apply(
      this._store, [ this._xPathBuilder.build(), this._elementOptions ]
    )
  }

  /**
   *
   * @param index starts with 0
   */
  getAt( index: number ) {
    this.index( index + 1)

    return this.getFirst()
  }

  getAll() {
    return this.getList().all
  }

  getList() {
    return this._cloneFunc( this._xPathBuilder.build() )
  }
}