import anyTest, { TestInterface } from 'ava'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Context {}

const test = anyTest as TestInterface<Context>

test('Example test', (t) => {
  t.pass()
})
