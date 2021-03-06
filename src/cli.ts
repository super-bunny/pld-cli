import { Command } from 'commander'
import updateNotifier from './modules/updateNotifier'
import versionCommand from './modules/commands/version'
import durationCommand from './modules/commands/duration'
import assigneesCommand from './modules/commands/assignees'
import distributionCommand from './modules/commands/distribution'
import userStoryCommand from './modules/commands/userStory'
import globalOptions from './modules/globalCmdOptions'
import { version } from '../package.json'
import logger from './modules/logger'

export default async function cli(argv: string[]) {
  const program = new Command()

  program.version(version)
    .description('Command line utility for pld file')
    .addOption(globalOptions.file)
    .addOption(globalOptions.dir)
    .addOption(globalOptions.script)

  program.addCommand(versionCommand)
  program.addCommand(durationCommand)
  program.addCommand(assigneesCommand)
  program.addCommand(distributionCommand)
  program.addCommand(userStoryCommand)

  try {
    updateNotifier()

    await program.parseAsync(argv)
  } catch (e) {
    logger.error(e.message)
    process.exit(1)
  }
}
