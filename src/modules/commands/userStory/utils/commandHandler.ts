import getPld from '../../../getPld'
import logger from '../../../logger'
import { scriptMode } from '../../../globals'
import printUserStoryCard from '../../../printUserStoryCard'
import GlobalOptions from '../../../../types/GlobalCmdOptions'
import { UserStoryFilters } from '../../../../lib/classes/Pld'

export default async function commandHandler<T extends UserStoryFilters>(
  globalOptions: GlobalOptions,
  commandOptions: T,
) {
  return getPld(globalOptions)
    .then(pld => {
      const userStories = pld.getUserStories(commandOptions)

      if (userStories.length === 0) {
        logger.warn('No user story found')
        return
      }

      if (scriptMode()) {
        logger.log(JSON.stringify({ userStories }, undefined, 2))
      } else {
        userStories.forEach(userStory => printUserStoryCard(userStory))
        logger.info(`${ userStories.length } user stories found`)
      }
    })
    .catch((error: AggregateError) => {
      logger.error(error.message)
      process.exit(1)
    })
}
