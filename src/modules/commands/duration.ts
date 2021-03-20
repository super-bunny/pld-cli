import commander from 'commander'
import getPld from '../getPld'
import logger from '../logger'
import { scriptMode } from '../globals'

export default commander.createCommand('duration')
  .action((options, command) => getPld(command.parent?.opts())
    .then(pld => {
      if (scriptMode()) {
        logger.log(JSON.stringify({ duration: pld.duration }))
      } else {
        logger.log(`${ pld.duration } man-days`)
      }
    })
    .catch((error: AggregateError) => {
      logger.error(error.message)
      process.exit(1)
    }))
