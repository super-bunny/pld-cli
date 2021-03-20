import fsPromise from 'fs/promises'
import compareVersions from 'compare-versions'
import { assertType } from 'typescript-is'
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
    const getValueOrZero = (key: string) => distribution[key] ?? 0

    this.userStories.forEach(userStory => userStory.assignments
      ?.forEach(user => {
        distribution[user] = getValueOrZero(user) + userStory.estimatedDuration
      }))

    return distribution
  }

  /**
   * Get all user stories assigned to given user
   */
  assignees(user: string, filters?: UserStoryFilters): UserStoryWithParents[] {
    return this.getUserStories(filters)
      .filter(userStory => userStory.assignments
        ?.map(assignment => assignment.toLowerCase())
        ?.includes(user.toLowerCase()))
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
    return this.userStories
      .filter(userStory => (
        filters?.status
          ? filters.status.includes(userStory.status.toLowerCase())
          : true
      ))
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
  status?: Array<UserStory['status'] | string>
}
