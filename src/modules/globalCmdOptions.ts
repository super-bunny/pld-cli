import commander from 'commander'
import { setScriptMode } from './globals'

const globalCmdOptions = {
  file: commander.createOption('-f, --file <pld_file_path>', 'pld file the cli will use'),
  dir: commander.createOption('-d, --dir <pld_dir_path>', 'directory where cli will search for pld file'),
  script: commander.createOption('--script', 'will print command outputs in JSON and without any logs')
    .argParser(value => {
      setScriptMode(true)
      return value
    }),
}

export default globalCmdOptions
