import commander from 'commander'
import getPld from '../getPld'
import logger from '../logger'
import { scriptMode } from '../globals'

export default commander.createCommand('duration')
  .description('get estimated duration sum of pld user stories')
  .action((options, command) => getPld(command.parent?.opts())
    .then(pld => {
      if (scriptMode()) {
        logger.log(JSON.stringify({ duration: pld.duration }, undefined, 2))
      } else {
        logger.log(`${ pld.duration } man-days`)
      }
    }))
