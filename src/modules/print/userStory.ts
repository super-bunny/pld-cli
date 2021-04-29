import chalk from 'chalk'
import boxen from 'boxen'
import { UserStoryWithParents } from '../../lib/classes/Pld'
import { UserStory } from '../../lib/types/Pld'
import wrapLine from './wrapLine'

const newLine = '\n'

export const formatName = (name: UserStory['name']): string => chalk.underline(chalk.yellowBright(name))

export const formatId = (id?: UserStory['id']): string => (id ? chalk.gray(`#${ id }`) : '')

export const formatDefinitionsOfDone = (definitionsOfDone: UserStory['definitionOfDone']): string => definitionsOfDone
  .map(definitionOfDone => ` ${ chalk.white('-') } ${ chalk.yellow(wrapLine(definitionOfDone, {
    continuationIndent: 3,
  }).join(newLine)) }`)
  .join(newLine)

export const formatEstimatedDuration = (estimatedDuration: UserStory['estimatedDuration']): string => (
  `${ chalk.yellow(estimatedDuration) } ${ chalk.white('man-day(s)') }`)

export const formatAssignments = (assignments: UserStory['assignments']): string | undefined => assignments
  ?.map(assignment => chalk.green(assignment))
  ?.join(', ')

export const formatStatus = (status: UserStory['status']): string => {
  switch (status) {
    case 'Abandoned':
      return chalk.redBright(status)
    case 'Done':
      return chalk.greenBright(status)
    case 'WIP':
      return chalk.yellowBright(status)
    case 'To do':
      return chalk.blueBright(status)
    default:
      return status
  }
}

function formatUserStory(userStory: UserStoryWithParents): string {
  return [
    `${ formatName(userStory.name) } ${ formatId(userStory.id) }`,
    userStory.description,
    newLine,
    chalk.white('Definition of done:'),
    formatDefinitionsOfDone(userStory.definitionOfDone),
    [
      formatEstimatedDuration(userStory.estimatedDuration),
      chalk.white('Status: ') + formatStatus(userStory.status),
      chalk.white('Assignments: ') + formatAssignments(userStory.assignments),
    ].join(chalk.grey(' | ')),
    newLine,
    `${ chalk.blueBright(userStory.deliverable.name) } ${ chalk.gray('/') } ${ chalk.cyan(userStory.subset.name) }`,
  ].join(newLine)
}

export default function printUserStoryCard(userStory: UserStoryWithParents) {
  console.info(boxen(formatUserStory(userStory), {
    padding: 1,
    borderStyle: 'round',
  }))
}
