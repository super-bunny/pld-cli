import ora, { Options } from 'ora'
import chalk from 'chalk'
import figures from 'figures'
import { scriptMode } from './globals'

export const Spinner = (options?: Options | string) => (!scriptMode() ? ora(options) : undefined)

export default {
  log: (message: string) => console.info(message),
  info: (message: string) => console.info(chalk.cyanBright(`${ figures.info } ${ message }`)),
  warn: (message: string) => console.warn(chalk.yellowBright(`${ figures.warning } ${ message }`)),
  error: (message: string) => console.error(chalk.redBright(`${ figures.cross } ${ message }`)),
}
