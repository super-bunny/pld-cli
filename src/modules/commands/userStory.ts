import commander from 'commander'
import listCommand from './userStory/list'

export default commander.createCommand('user-story')
  .aliases(['us', 'story'])
  .description('user stories related commands')
  .addCommand(listCommand)
