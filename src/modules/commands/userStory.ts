import commander from 'commander'
import listCommand from './userStory/list'
import searchCommand from './userStory/search'

export default commander.createCommand('user-story')
  .aliases(['us', 'story'])
  .description('user stories related commands')
  .addCommand(listCommand)
  .addCommand(searchCommand)
