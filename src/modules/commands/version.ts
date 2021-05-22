import commander from 'commander'
import latestCommand from './version/latest'

export default commander.createCommand('version')
  .description('pld versions related commands')
  .addCommand(latestCommand, { isDefault: true })
