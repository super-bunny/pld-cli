import commander from 'commander'
import generateIds from './edit/generateIds'

export default commander.createCommand('utils')
  .description('group utility commands for pld file')
  .addCommand(generateIds)
