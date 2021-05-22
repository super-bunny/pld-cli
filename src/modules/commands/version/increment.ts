import commander from 'commander'
import getPld from '../../getPld'
import logger from '../../logger'
import { scriptMode } from '../../globals'
import printVersionCard from '../../print/version'
import { VersionNumberLevel } from '../../../lib/classes/Pld'
import chalk from 'chalk'

export interface Options {
  level?: VersionNumberLevel
  date?: Array<string>
  authors?: Array<string>
  comment?: Array<string>
  sections?: Array<string>
}

export default commander.createCommand('increment')
  .aliases(['inc'])
  .description('create new version incremented by given level from latest pld version')
  .option('-l --level <level>', 'version number level to increment')
  .option('--date <date...>', 'version date')
  .requiredOption('-a --authors <authors...>', 'version authors')
  .requiredOption('-s --sections <sections...>', 'sections modified by the version')
  .requiredOption('-c --comment <comment...>', 'version comment')
  .action((options: Options, command) => getPld(command.parent?.parent?.opts())
    .then(pld => {
      const date = options.date ? new Date(options.date?.join(' ')!) : new Date()

      if (Number.isNaN(date.valueOf())) {
        throw new Error('Invalid date format provided')
      }

      const previousLatestVersion = pld.lastVersion
      const newVersion = pld.incrementPldVersion({
        date,
        authors: options.authors ?? [],
        comment: options.comment?.join(' ') ?? '',
        sections: options.sections?.join(' ') ?? '',
      }, options.level)

      const previousVersionMessage = previousLatestVersion
        ? chalk.gray(`(v${ previousLatestVersion.version } -> v${ newVersion.version })`)
        : ''

      if (scriptMode()) {
        logger.log(JSON.stringify({ newVersion, pld: pld.content }, undefined, 2))
      } else {
        printVersionCard(newVersion, {
          title: `Version ${ chalk.greenBright(`v${ newVersion.version }`) } added! ${ previousVersionMessage }`,
        })
        logger.success(`Modifications written to pld file: ${ chalk.yellow(pld.filePath) }`)
      }
    })
    .catch((error: AggregateError) => {
      logger.error(error.message)
      process.exit(1)
    }))
