import commander from 'commander'
import status, { StatusOption } from './options/status'
import listCommandHandler from './utils/listCommandHandler'
import assignments, { AssignmentsOption } from './options/assignments'

export type Options = AssignmentsOption & StatusOption

export default commander.createCommand('search')
  .description('search user stories')
  .addOption(assignments)
  .addOption(status)
  .arguments('<search...>')
  .action((searchArr: string[], options: Options, command) => listCommandHandler(command.parent?.parent?.opts(), {
    ...options,
    search: searchArr,
  }))
