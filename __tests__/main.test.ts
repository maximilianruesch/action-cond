import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import ProcessEnv = NodeJS.ProcessEnv;

const executeActionWithEnv = ({ env }: { env: ProcessEnv }) => {
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = { env }

  return cp.execSync(`node ${ip}`, options).toString().trim()
}
const getExpectedActionOutput = ({ expectedValue }: { expectedValue: string }): string => {
  return `::set-output name=value::${expectedValue}`
}

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs (true)', () => {
  expect.assertions(1)

  process.env['INPUT_COND'] = 'true'
  process.env['INPUT_IF_TRUE'] = 'value-if-true'
  process.env['INPUT_IF_FALSE'] = 'value-if-false'

  expect(executeActionWithEnv({ env: process.env }))
      .toBe(getExpectedActionOutput({ expectedValue: 'value-if-true' }));
})

test('test runs (false)', () => {
  expect.assertions(1)

  process.env['INPUT_COND'] = 'false'
  process.env['INPUT_IF_TRUE'] = 'value-if-true'
  process.env['INPUT_IF_FALSE'] = 'value-if-false'

  expect(executeActionWithEnv({ env: process.env }))
      .toBe(getExpectedActionOutput({ expectedValue: 'value-if-false' }));
})

test('test runs (empty)', () => {
  expect.assertions(1)

  process.env['INPUT_COND'] = 'true'
  process.env['INPUT_IF_TRUE'] = ''
  process.env['INPUT_IF_FALSE'] = 'value-if-false'

  expect(executeActionWithEnv({ env: process.env }))
      .toBe(getExpectedActionOutput({ expectedValue: '' }));
})
