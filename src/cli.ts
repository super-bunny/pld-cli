import { Command } from 'commander'
import versionCommand from './modules/commands/version'
import globalOptions from './modules/globalCmdOptions'
import { version } from '../package.json'

export default async function cli(argv: string[]) {
  const program = new Command()

  program.version(version)
    .description('Command line utility for pld file')
    .addOption(globalOptions.file)
    .addOption(globalOptions.dir)
    .addOption(globalOptions.script)

  program.addCommand(versionCommand)

  await program.parseAsync(argv)
}
