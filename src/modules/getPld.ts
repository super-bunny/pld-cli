import { resolve } from 'path'
import chalk from 'chalk'
import GlobalOptions from '../types/GlobalCmdOptions'
import Pld from '../lib/classes/Pld'
import { Spinner } from './logger'

export default async function getPld(options: GlobalOptions) {
  if (options.file) {
    return Pld.fromJsonFile(options.file)
  }

  const dir = options.dir ?? process.cwd()
  const spinner = Spinner(`Searching pld' file in: ${ chalk.yellow(dir) }`)?.start()
  const { pld, path } = await Pld.fromDir(dir)
    .catch(error => {
      spinner?.stop()
      throw error
    })

  spinner?.succeed(`Using pld file: ${ chalk.yellow(options.dir ? resolve(dir, path) : path) }`)

  return pld
}
