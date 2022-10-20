import * as core from '@actions/core'

interface NestedConditionType {
  cond: string
  ifTrue: string | NestedConditionType
  ifFalse: string | NestedConditionType
}
function evaluateCondition({
  cond,
  ifTrue,
  ifFalse
}: NestedConditionType): string {
  const evaluatedIfTrue: string =
    typeof ifTrue === 'object'
      ? evaluateCondition({
          cond: ifTrue.cond,
          ifTrue: ifTrue.ifTrue,
          ifFalse: ifTrue.ifFalse
        })
      : ifTrue

  const evaluatedIfFalse: string =
    typeof ifFalse === 'object'
      ? evaluateCondition({
          cond: ifFalse.cond,
          ifTrue: ifFalse.ifTrue,
          ifFalse: ifFalse.ifFalse
        })
      : ifFalse

  return cond === 'true' ? evaluatedIfTrue : evaluatedIfFalse
}

async function run(): Promise<void> {
  try {
    const cond: string = core.getInput('cond', {required: true})
    const ifTrue: string | NestedConditionType = core.getInput('if_true')
    const ifFalse: string | NestedConditionType = core.getInput('if_false')
    core.setOutput('value', evaluateCondition({cond, ifTrue, ifFalse}))
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(JSON.stringify(error))
    }
  }
}

run()
