import * as core from '@actions/core'

function evaluateCondition({ cond, ifTrue, ifFalse }:
  { cond: string, ifTrue: string|Object, ifFalse: string|Object }): string {
  const evaluatedIfTrue: string = typeof ifTrue === Object ? evaluateCondition({
    cond: ifTrue.cond,
    ifTrue: ifTrue.ifTrue,
    ifFalse: ifTrue.ifFalse,
  }) : ifTrue

  const evaluatedIfFalse: string = typeof ifFalse === Object ? evaluateCondition({
    cond: ifFalse.cond,
    ifTrue: ifFalse.ifTrue,
    ifFalse: ifFalse.ifFalse,
  }) : ifFalse
  
  return cond === 'true' ? evaluatedIfTrue : evaluatedIfFalse
}

async function run(): Promise<void> {
  try {
    const cond: string = core.getInput('cond', { required: true })
    const ifTrue: string|Object = core.getInput('if_true')
    const ifFalse: string|Object = core.getInput('if_false')
    core.setOutput('value', evaluateCondition({ cond, ifTrue, ifFalse }))
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(JSON.stringify(error))
    }
  }
}

run()
