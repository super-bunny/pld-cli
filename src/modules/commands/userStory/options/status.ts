import commander, { Option } from 'commander'

const validStatus = ['to do', 'todo', 'wip', 'done', 'abandoned']

export default Object.assign(
  new Option('-s --status <status>', 'filter by user story status')
    .argParser(value => {
      const status = value.toLowerCase()

      if (!validStatus.includes(status)) {
        throw new commander.InvalidOptionArgumentError(`Valid status: ${ validStatus.join(', ') }`)
      }

      return status === 'todo' ? 'to do' : status
    }),
  { argChoices: validStatus },
)
