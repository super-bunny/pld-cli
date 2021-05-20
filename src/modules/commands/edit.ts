import commander from 'commander'
import generateIds from './edit/generateIds'

export default commander.createCommand('edit')
  .aliases(['e'])
  .description('group commands to edit pld file')
  .addCommand(generateIds)
