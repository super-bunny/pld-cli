import commander from 'commander'
import assignments, { AssignmentsOption } from './options/assignments'
import status, { StatusOption } from './options/status'
import search, { SearchOption } from './options/search'
import commandHandler from './utils/commandHandler'

export type Options = AssignmentsOption & StatusOption & SearchOption

export default commander.createCommand('list')
  .description('list user stories')
  .addOption(assignments)
  .addOption(status)
  .addOption(search)
  .action((options: Options, command) => commandHandler(command.parent?.parent?.opts(), options))
