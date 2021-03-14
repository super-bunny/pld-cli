export interface Config {
  dateFormat: string;
}

export interface Version {
  version: string
  date: string
  authors: Array<string>
  sections: string
  comment: string
}

export interface UserStory {
  type: 'userStory'
  id?: string
  name: string
  user: string
  action: string
  description?: string
  definitionOfDone: string[]
  estimatedDuration: number
  status: 'To do' | 'WIP' | 'Done' | 'Abandoned'
  assignments?: string[]
  comments?: string | string[]
}

export interface Subset {
  type: 'subset'
  name: string
  description?: string
  userStories: UserStory[]
}

export interface Deliverable {
  type: 'deliverable'
  name: string
  description?: string
  subsets: Subset[]
}

export default interface Pld {
  config?: Config
  title: string
  subTitle?: string
  description?: string
  authors: string[]
  versions: Version[]
  deliverables: Deliverable[]
}
