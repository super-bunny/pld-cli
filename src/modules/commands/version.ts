import commander from 'commander'
import latestCommand from './version/latest'
import incrementCommand from './version/increment'

export default commander.createCommand('version')
  .description('pld versions related commands')
  .addCommand(latestCommand, { isDefault: true })
  .addCommand(incrementCommand)
