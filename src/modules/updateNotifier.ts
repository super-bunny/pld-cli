import UpdateNotifier from 'update-notifier'
import boxen from 'boxen'
import chalk from 'chalk'
import { name, version } from '../../package.json'
import logger from './logger'

const CHECK_INTERVAL_MS = 1000 * 60 * 60 * 2 // 2 hours

export function printUpdateMessage(newVersion: string, type?: string) {
  const updateAvailableMsg = type ? `New ${ chalk.yellowBright(type) } version available` : 'Update available'
  const npmUpdateCommand = chalk.cyanBright(`npm i -g ${ name }`)
  const yarnUpdateCommand = chalk.cyanBright(`yarn global add ${ name }`)

  const messageLines = [
    `${ updateAvailableMsg }: ${ chalk.magentaBright(version) } ➡ ${ chalk.greenBright(newVersion) }`,
    `Run ${ npmUpdateCommand } to update`,
    `or ${ yarnUpdateCommand }`,
  ]

  const message = boxen(messageLines.join('\n'), {
    margin: 1,
    padding: 1,
    align: 'center',
    dimBorder: false,
    borderStyle: 'round',
    borderColor: 'yellow',
  })

  logger.log(message)
}

export default function updateNotifier() {
  const notifier = UpdateNotifier({
    pkg: { name, version },
    updateCheckInterval: CHECK_INTERVAL_MS,
  })

  if (notifier.update) {
    printUpdateMessage(notifier.update.latest)
  }
}
