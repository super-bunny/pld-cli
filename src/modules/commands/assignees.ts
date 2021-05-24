import commander from 'commander'
import search, { SearchOption } from './userStory/options/search'
import status, { StatusOption } from './userStory/options/status'
import listCommandHandler from './userStory/utils/listCommandHandler'

export type Options = StatusOption & SearchOption

export default commander.createCommand('assignees')
  .arguments('<user...>')
  .description('list user stories assigned to specified user')
  .addOption(status)
  .addOption(search)
  .action((user: string[], options: Options, command) => listCommandHandler(command.parent?.opts(), {
    ...options,
    assignments: user,
  }))
