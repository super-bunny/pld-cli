import { Option } from 'commander'

export interface AssignmentsOption {
  assignments: string[]
}

export default new Option('-a --assignments <assignments...>', 'filter user stories by assignments')
