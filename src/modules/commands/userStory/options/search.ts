import { Option } from 'commander'

export interface SearchOption {
  search: string[]
}

export default new Option('--search <search...>', 'search user stories by name')
