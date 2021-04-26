import commander, { Option } from 'commander'

const validStatus = ['to do', 'todo', 'wip', 'done', 'abandoned']

export interface StatusOption {
  status: string[]
}

export default Object.assign(
  new Option('-s --status <status...>', 'filter by user story status')
    .argParser((value, previous) => {
      const status = value.toLowerCase()

      if (!validStatus.includes(status)) {
        throw new commander.InvalidOptionArgumentError(`Valid status: ${ validStatus.join(', ') }`)
      }

      const processedArg = status === 'todo' ? 'to do' : status

      if (!previous) {
        return [processedArg]
      }

      if (Array.isArray(previous)) {
        return [...previous, processedArg]
      }

      return [previous, processedArg]
    }),
  { argChoices: validStatus },
)
