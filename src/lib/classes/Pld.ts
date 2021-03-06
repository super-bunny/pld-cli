import fsPromise from 'fs/promises'
import compareVersions from 'compare-versions'
import { assertType } from 'typescript-is'
import Fuse from 'fuse.js'
import IPld, { Deliverable, Subset, UserStory, Version } from '../types/Pld'
import findJsonPldFile from '../modules/findJsonPldFile'

export type UserStoryWithParents = UserStory & { deliverable: Deliverable, subset: Subset }

export default class Pld {
  constructor(public content: IPld) {
  }

  /**
   * Return versions sorted by version number
   */
  get versions(): Version[] {
    return this.content.versions
      .sort((versionA, versionB) => compareVersions(versionA.version, versionB.version))
  }

  get lastVersion(): Version | undefined {
    return this.versions.pop()
  }

  get duration(): number {
    return this.userStories.reduce((duration, userStory) => duration + userStory.estimatedDuration, 0)
  }

  get distribution(): Record<string, number> {
    const distribution: Record<string, number> = {}

    this.userStories.forEach(userStory => userStory.assignments
      ?.forEach(user => {
        distribution[user] = (distribution[user] ?? 0) + userStory.estimatedDuration
      }))

    return distribution
  }

  /**
   * Get all PLD deliverables
   */
  get deliverables(): Deliverable[] {
    return this.content.deliverables
  }

  /**
   * Get all PLD subsets
   */
  get subsets(): Array<Subset & { deliverable: Deliverable }> {
    return this.deliverables
      .map(deliverable => deliverable.subsets
        .map(subset => ({
          ...subset,
          deliverable,
        })))
      .flat()
  }

  /**
   * Get all PLD user stories
   */
  get userStories(): Array<UserStoryWithParents> {
    return this.subsets
      .map(subset => subset.userStories
        .map(userStory => ({
          ...userStory,
          subset,
          deliverable: subset.deliverable,
        })))
      .flat()
  }

  /**
   * Get PLD user stories with optional filters
   */
  getUserStories(filters?: UserStoryFilters) {
    if (!filters) {
      return this.userStories
    }

    const assignmentsFilter = (userStory: UserStoryWithParents, users: string[] | string): boolean => {
      const assignments = userStory.assignments
        ?.map(assignment => assignment.toLowerCase())

      if (Array.isArray(users)) {
        return users.some(user => assignments?.includes(user))
      }

      return assignments?.includes(users) ?? false
    }

    const filteredUserStories = this.userStories
      .filter(userStory => (
        [
          filters?.status?.includes(userStory.status.toLowerCase()) ?? true,
          filters.assignments ? assignmentsFilter(userStory, filters.assignments) : true,
        ].every(filterResult => filterResult)
      ))

    if (!filters.search) {
      return filteredUserStories
    }

    return this.searchUserStories(filters.search, filteredUserStories)
  }

  searchUserStories(
    search: string[] | string,
    userStories: UserStoryWithParents[] = this.userStories,
  ): UserStoryWithParents[] {
    const fuse = new Fuse(userStories, {
      keys: ['name'],
      threshold: 0.3,
      minMatchCharLength: 3,
      ignoreLocation: true,
      useExtendedSearch: true,
    })

    return fuse.search(Array.isArray(search) ? search.join(' ') : search)
      .map(result => result.item)
  }

  /**
   * Return given content if is valid PLD content or throw an error
   */
  static verifyPldContent(content: object) {
    return assertType<IPld>(content)
  }

  static async fromJsonFile(path: string): Promise<Pld> {
    const fileContent = await fsPromise.readFile(path)
    const content = JSON.parse(fileContent.toString())

    return new Pld(content)
  }

  /**
   * Search for PLD file in given directory
   */
  static async fromDir(path: string): Promise<{ pld: Pld, path: string }> {
    const pld = await findJsonPldFile(path)
    return {
      pld: new Pld(pld.content),
      path: pld.path,
    }
  }
}

export interface UserStoryFilters {
  assignments?: UserStory['assignments'] | string
  status?: Array<UserStory['status'] | string>
  search?: string[] | string
}
