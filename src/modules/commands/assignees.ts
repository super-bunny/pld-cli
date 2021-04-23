import commander from 'commander'
import search, { SearchOption } from './userStory/options/search'
import status, { StatusOption } from './userStory/options/status'
import commandHandler from './userStory/utils/commandHandler'

export type Options = StatusOption & SearchOption

export default commander.createCommand('assignees')
  .arguments('<user...>')
  .description('list user stories assigned to specified user')
  .addOption(status)
  .addOption(search)
  .action((user: string[], options: Options, command) => commandHandler(command.parent?.opts(), {
    ...options,
    assignments: user,
    search: options.search?.join(' '),
  }))
