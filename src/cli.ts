import { Command } from 'commander'
import { version } from '../package.json'

export default async function cli(argv: string[]) {
  const program = new Command()

  program.version(version)
    .description('Command line utility for pld file')

  await program.parseAsync(argv)
}
