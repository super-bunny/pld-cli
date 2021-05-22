import chalk from 'chalk'
import printVersionCard from './print/version'
import logger from './logger'
import InvalidPldSemVersion from '../lib/classes/errors/InvalidPldSemVersion'

export default function commandErrorHandler(error: Error): void {
  if (error instanceof InvalidPldSemVersion && error.version) {
    printVersionCard(error.version, {
      title: chalk.bgRedBright(`Invalid semantic version number: ${ error.version.version }`),
    })
  }

  logger.error(error.message)
  process.exit(1)
}
