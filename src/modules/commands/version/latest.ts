import commander from 'commander'
import getPld from '../../getPld'
import logger from '../../logger'
import { scriptMode } from '../../globals'

export type Options = {}

export default commander.createCommand('latest')
  .description('get pld latest version number')
  .action((options: Options, command) => getPld(command.parent?.parent?.opts())
    .then(pld => {
      if (scriptMode()) {
        logger.log(JSON.stringify({ version: pld.lastVersion?.version ?? null }))
      } else {
        logger.log(`v${ pld.lastVersion?.version }`)
      }
    })
    .catch((error: AggregateError) => {
      logger.error(error.message)
      process.exit(1)
    }))
