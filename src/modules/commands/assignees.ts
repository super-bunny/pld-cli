import commander, { Option } from 'commander'
import getPld from '../getPld'
import logger from '../logger'
import { scriptMode } from '../globals'

const validStatus = ['to do', 'todo', 'wip', 'done', 'abandoned']

const commandOptions = {
  status: Object.assign(
    new Option('-s --status <status>', 'Filter by user story status')
      .argParser(value => {
        const status = value.toLowerCase()

        if (!validStatus.includes(status)) {
          throw new commander.InvalidOptionArgumentError(`Valid status: ${ validStatus.join(', ') }`)
        }

        return status === 'todo' ? 'to do' : status
      }),
    { argChoices: validStatus },
  ),
}

export default commander.createCommand('assignees')
  .arguments('<user>')
  .addOption(commandOptions.status)
  .action((user, options: Options, command) => getPld(command.parent?.opts())
    .then(pld => {
      const assignees = pld.assignees(user, {
        status: options.status ? [options.status] : undefined,
      })
        .map(({ type, ...userStory }) => ({
          ...userStory,
          subset: userStory.subset.name,
          deliverable: userStory.deliverable.name,
        }))

      if (assignees.length === 0) {
        logger.warn('No user story found')
        return
      }

      if (scriptMode()) {
        logger.log(JSON.stringify({ assignees }, undefined, 2))
      } else {
        console.info(assignees)
        logger.info(`${ assignees.length } user stories found`)
      }
    })
    .catch((error: AggregateError) => {
      logger.error(error.message)
      process.exit(1)
    }))

export interface Options {
  status?: string
}
