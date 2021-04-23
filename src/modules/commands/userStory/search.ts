import commander from 'commander'
import status, { StatusOption } from './options/status'
import commandHandler from './utils/commandHandler'
import assignments, { AssignmentsOption } from './options/assignments'

export type Options = AssignmentsOption & StatusOption

export default commander.createCommand('search')
  .description('search user stories')
  .addOption(assignments)
  .addOption(status)
  .arguments('<search...>')
  .action((searchArr: string[], options: Options, command) => commandHandler(command.parent?.parent?.opts(), {
    ...options,
    search: searchArr,
  }))
