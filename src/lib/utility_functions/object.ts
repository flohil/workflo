import * as _ from 'lodash'

/**
 * Iterates over all properties in an object and executes
 * func on each.
 * 
 * Returns a new object with the same keys as the input
 * object and the values as result of the func.
 * 
 * @param input 
 * @param func 
 */
export function mapProperties<T, O, K extends string>(input: {[key in K] : T}, func: (value: T, key?: string) => O) : {[key in K] : O} {
  if (_.isArray(input)) {
    throw new Error(`Input must be an object: ${input}`)
  } else {
    let resultObj: {[key in K] : O} = Object.create(Object.prototype)

    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        const propRes: O = func(input[key], key)

        resultObj[key] = func(input[key], key)
      }
    }

    return resultObj
  }
}

/**
 * Iterates over all properties in an object and executes func on each.
 * 
 * @param input 
 * @param func 
 */
export function forEachProperty<T, K extends string>(input: {[key in K] : T}, func: (value: T, key?: string) => void): {[key in K] : T} {
  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      func(input[key], key)
    }
  }

  return this
}

interface IPageElementMapIdentifier {
  mappingObject: {[key: string] : string}
}

const test = {
  mappingObject: {
    test: "asdf",
    test1: "asdf2"
  }
}

const bla = mapProperties(test.mappingObject, (value, key) => {
  return "asdf" + value
})

// inverts an object's keys and values.

/**
 * Returns a new object with the original object's keys and values inverted.
 * The original object's values must therefore be implicitly convertable to type string.
 * 
 * @param obj 
 */
export function invert(obj: {[key: string] : string}) : {[key: string] : string} {
  const new_obj: {[key: string] : string} = {}

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop
    }
  }

  return new_obj
}

/**
 * Returns a new filtered object that only contains those
 * properties of the initial object where func returned true.
 * 
 * Does not traverse nested objects!
 * 
 * @param obj 
 * @param func 
 */
export function filter<T>(obj: {[key: string] : T}, func: (value: T, key?: string) => boolean) : {[key: string] : T} {
  const resultObj: {[key: string] : T} = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (func(obj[key], key)) {
        resultObj[key] = obj[key]
      }
    }
  }

  return resultObj
}

/**
 * If key already exists in obj, turns respective value
 * into array and pushes value onto the array.
 * Else, adds "normal" key-value pair as property.
 * If overwrite is true, always overwrites existing value
 * with new value without turning it into array.
 *
 * @param obj 
 * @param key 
 * @param value 
 * @param overwrite 
 */
export function addToProp<T, K extends string>(obj: {[key in K] : T | T[]}, key: string, value: T, overwrite: boolean = false): {[key in K] : T | T[]} {
  if (obj[key] && !overwrite) {
    let valueArr: T[] = []
    valueArr = valueArr.concat(obj[key])
    valueArr.push(value)

    obj[key] = valueArr
  } else {
    obj[key] = value
  }

  return this
}

/**
 * Creates a copy of original object in which all
 * key-value pairs matching the passed props are removed.
 * 
 * @param obj 
 * @param props 
 */
export function stripProps<T>(obj: {[key: string] : T}, props: string[]): {[key: string] : T} {
  const resObj: {[key: string] : T} = _.cloneDeep(obj)

  for (const prop of props) {
    delete resObj[prop]
  }

  return resObj
}

/**
 * Returns properties of obj whose keys are also present in 
 * subsetObj as a new object.
 * 
 * Does not traverse nested objects!
 * 
 * @param obj 
 * @param matchingObject 
 */
export function subset<T, O>(obj: {[key: string] : T}, maskObject: {[key: string] : O}): {[key: string] : T} {
  return filter(obj, (value, key) => {
    return key in maskObject
  })
}

/**
 * Returns a new object where all properties with a boolean value of false are stripped recursively.
 * @param obj
 */
export function stripMaskDeep(obj: Workflo.IRecObj<boolean>) {
  const res = _.cloneDeep(obj)

  function stripMaskRec(obj: Workflo.IRecObj<boolean>) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === false) {
          delete obj[key]
        } else if (_.isObject(obj[key])) {
          obj[key] = stripMaskRec(<Workflo.IRecObj<boolean>>obj[key])
        }
      }
    }

    return obj
  }

  return stripMaskRec(res)
}