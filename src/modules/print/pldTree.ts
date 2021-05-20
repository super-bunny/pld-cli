import chalk from 'chalk'
import { Pld } from '../../lib'
import { formatId, formatName } from './userStory'
import logger from '../logger'

export default function printPldTree({ deliverables }: Pld) {
  deliverables.forEach(deliverable => {
    logger.log(chalk.blueBright(deliverable.name))

    deliverable.subsets.forEach(subset => {
      logger.log(`⤷ ${ chalk.cyan(subset.name) }`)

      subset.userStories.forEach(userStory => logger
        .log(`  ⤷ ${ formatName(userStory.name) } ${ formatId(userStory.id) }`))
    })

    logger.log('')
  })
}
