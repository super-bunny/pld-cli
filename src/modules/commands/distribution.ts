import commander from 'commander'
import { Table } from 'console-table-printer'
import chalk from 'chalk'
import getPld from '../getPld'
import logger from '../logger'
import { scriptMode } from '../globals'
import { Pld } from '../../lib'

function printDistribution(distribution: Pld['distribution']) {
  const objArr = Object.entries(distribution)
    .map(([user, duration]) => ({ user, duration }))
    .sort((a, b) => b.duration - a.duration)
    .map(({ user, duration }) => ({
      user: chalk.green(user),
      duration: chalk.yellow(duration.toFixed(1)),
    }))

  console.info()

  const table = new Table({
    title: 'Distribution',
    columns: [
      {
        name: 'user',
        title: 'User',
        alignment: 'left',
      },
      {
        name: 'duration',
        title: 'Man-days',
      },
    ],
  })
  table.addRows(objArr)
  table.printTable()
}

export default commander.createCommand('distribution')
  .description('get user stories duration distribution')
  .action((options, command) => getPld(command.parent?.opts())
    .then(pld => {
      if (scriptMode()) {
        logger.log(JSON.stringify({ distribution: pld.distribution }, undefined, 2))
      } else {
        printDistribution(pld.distribution)
      }
    })
    .catch((error: AggregateError) => {
      logger.error(error.message)
      process.exit(1)
    }))
