import chalk from 'chalk'
import boxen from 'boxen'
import { Version } from '../../lib/types/Pld'
import wrapLine from './wrapLine'

const newLine = '\n'

export interface PrintVersionCardOptions {
  title?: string
}

export default function printVersionCard(version: Version, { title }: PrintVersionCardOptions) {
  const lines: Array<string> = [
    title ?? `Version    ${ chalk.greenBright(`v${ version.version }`) }`,
    '',
    `Date:      ${ chalk.magenta(version.date) }`,
    `Authors:   ${ chalk.green(version.authors.join(chalk.white(', '))) }`,
    `Sections:  ${ chalk.blueBright(version.sections) }`,
    `Comment:   ${ chalk.yellowBright(wrapLine(version.comment, { continuationIndent: 11 }).join(newLine)) }`,
  ]

  console.info(boxen(lines.join(newLine), {
    padding: 1,
    borderStyle: 'round',
  }))
}
