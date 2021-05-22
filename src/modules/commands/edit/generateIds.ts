import commander from 'commander'
import chalk from 'chalk'
import getPld from '../../getPld'
import logger from '../../logger'
import { scriptMode } from '../../globals'

export interface Options {
  overwrite?: boolean
}

export default commander.createCommand('generate-ids')
  .aliases(['gen-ids'])
  .description('generate id for each user story and write it to the pld file')
  .option('-o --overwrite', 'overwrite existing ids')
  .action((options: Options, command) => getPld(command.parent?.opts())
    .then(async pld => {
      if (options.overwrite) {
        logger.warn('Overwriting ids!')
      }

      const generatedIdCount = pld.generateUserStoriesIds({
        overwrite: options.overwrite,
      })

      if (scriptMode()) {
        logger.log(JSON.stringify({ generatedIdCount, pld: pld.content }, undefined, 2))
        return
      }

      if (generatedIdCount > 0) {
        await pld.saveToJsonFile()
      }

      logger.info(`${ generatedIdCount } id(s) generated`)
      logger.success(`Modifications written to pld file: ${ chalk.yellow(pld.filePath) }`)
    }))
