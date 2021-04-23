import commander from 'commander'
import search from './userStory/options/search'
import status from './userStory/options/status'
import commandHandler from './userStory/utils/commandHandler'

export default commander.createCommand('assignees')
  .arguments('<user>')
  .description('list user stories assigned to specified user')
  .addOption(status)
  .addOption(search)
  .action((user, options: Options, command) => commandHandler(command.parent?.opts(), {
    ...options,
    assignments: [user],
    status: options.status ? [options.status] : undefined,
    search: options.search?.join(' '),
  }))

export interface Options {
  status?: string
  search?: string[]
}
