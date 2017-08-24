import Kiwi from './Kiwi'
import * as _ from 'lodash'

function censor(censor) {
  let i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
      return '[Circular]'; 

    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;  
  }
}

export function mergeStepDefaults<I, O>
( defaults: Partial<I>, params: IStepArgs<I, O> | IOptStepArgs<I, O>): IStepArgs<I, O> {
  const _params = <any>params

  const res: { arg?: { [ key: string ]: any }, cb?: any } = _params || {}
  res.arg = _.merge( defaults, res.arg )
  return _params
}

export function stepsGetter(target, name, receiver) {
  if (typeof name === "string") {
    const stepName: string = name
    const parameterizedStep: Workflo.StepImpl = target[stepName]

    if ( typeof parameterizedStep === "undefined" ) {
      throw new Error(`Step ${stepName} is not implemented`)
    }

    return <I, O>(stepCbArgs: IOptStepArgs<I, O> = {}) : IParameterizedStep => {
      stepCbArgs.description = stepName

      const stepArgs = mergeStepDefaults({}, stepCbArgs)

      return parameterizedStep(stepArgs)
    }
  } else {
    throw new Error("Property keys of Steps must be of type string: Step " + name.toString)
  }
}

export function stepsSetter(target, name, value) : boolean {
  throw new Error("Step implementations may not be changed: Tried to set Step " + name.toString() + " to value " + value.toString())
}

export class ParameterizedStep<I, O> implements IParameterizedStep {
  public description: string
  public execute: (prefix: string) => void

  constructor(params: IOptStepArgs<I, O>, stepFunc: (arg: I) => O) {
    if( typeof params.description !== "undefined" ) {
      this.description = Kiwi.compose(params.description, params.arg)
    }
    if ( typeof params.cb !== "undefined" ) {
      this.execute = prefix => {
        prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `
        process.send({event: 'step:start', title: `${prefix}${this.description}`, arg: JSON.stringify(params.arg, censor(params.arg))})
        const result: O = stepFunc(params.arg)
        process.send({event: 'step:start', title: `Callback`, arg: JSON.stringify(result, censor(result))})
        params.cb(result)
        process.send({event: 'step:end'})
        process.send({event: 'step:end', arg: JSON.stringify(result, censor(result))})
      }
    } else {
      this.execute = prefix => {
        prefix = (typeof prefix === 'undefined') ? '' : `${prefix} `
        process.send({event: 'step:start', title: `${prefix}${this.description}`, arg: JSON.stringify(params.arg, censor(params.arg))})
        const result: O = stepFunc(params.arg)
        process.send({event: 'step:end', arg: JSON.stringify(result, censor(result))})
      }
    }
  }
}