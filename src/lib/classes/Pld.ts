import fsPromise from 'fs/promises'
import compareVersions from 'compare-versions'
import { assertType } from 'typescript-is'
import Fuse from 'fuse.js'
import { v4 as uuidV4 } from 'uuid'
import semver from 'semver'
import IPld, { Deliverable, Subset, UserStory, Version } from '../types/Pld'
import findJsonPldFile from '../modules/findJsonPldFile'

const TAB_SIZE = 2

export type UserStoryWithParents = UserStory & { deliverable: Deliverable, subset: Subset }

export interface UserStoryIdGenerationOption {
  overwrite?: boolean
  idGenerator?: (userStory: UserStory) => string
}

export type VersionNumberLevel = 'major' | 'minor' | 'patch'

export interface VersionInfo {
  version: string
  date: string | Date
  authors: Array<string>
  sections: string
  comment: string
}

export default class Pld {
  constructor(public content: IPld, public filePath?: string) {
  }

  /**
   * Return versions sorted by version number.
   * Will throw an error if invalid semantic version number is found in PLD content.
   */
  get versions(): Version[] {
    const invalidVersion = this.content.versions.find(version => !semver.valid(version.version))

    if (invalidVersion) {
      throw new Error(`Invalid semantic version number found in pld file versions: ${ invalidVersion.version }`)
    }

    return this.content.versions
      .sort((versionA, versionB) => compareVersions(versionA.version, versionB.version))
  }

  get lastVersion(): Version | undefined {
    return this.versions[this.content.versions.length - 1]
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
   * Add new version in PLD content
   */
  addVersion(versionInfo: VersionInfo): Version {
    if (!semver.valid(versionInfo.version)) {
      throw new Error('Invalid semantic version number in given Version object')
    }

    const { date } = versionInfo
    const newVersion: Version = {
      ...versionInfo,
      date: date instanceof Date ? date.toISOString() : date,
    }

    this.content.versions.push(newVersion)

    return newVersion
  }

  /**
   * Create new version incremented by given level from latest PLD version
   */
  incrementPldVersion(versionInfo: Omit<VersionInfo, 'version'>, level: VersionNumberLevel = 'patch'): Version {
    const lastVersionNumber = this.lastVersion?.version
    const parsedVersionNumber = semver.parse(lastVersionNumber)

    if (!parsedVersionNumber) {
      throw new Error('Invalid semantic version number in latest version from pld file')
    }

    return this.addVersion({
      ...versionInfo,
      version: parsedVersionNumber?.inc(level).raw,
    })
  }

  transformUserStories(callback: (userStory: UserStory, subset: Subset, deliverable: Deliverable) => UserStory): void {
    for (const deliverable of this.content.deliverables) {
      for (const subset of deliverable.subsets) {
        subset.userStories = subset.userStories.map(userStory => callback(userStory, subset, deliverable))
      }
    }
  }

  /**
   * Generate id for all user stories in the PLD.
   * Return number of new ids generated.
   */
  generateUserStoriesIds(options?: UserStoryIdGenerationOption): number {
    const { overwrite, idGenerator } = options ?? {}
    const currentIdList = overwrite ? [] : this.userStories.map(story => story.id)
    let generatedIdCount = 0

    const generateId = (userStory: UserStory, tryCount = 0, maxRetry = 6): string => {
      if (!overwrite && userStory.id) {
        return userStory.id
      }

      if (idGenerator) {
        const id = idGenerator(userStory)
        if (currentIdList.includes(id)) {
          throw new Error('Provided id generator return an already existing id')
        }
        return id
      }

      const id = uuidV4().slice(0, 6)
      if (currentIdList.includes(id)) {
        if (tryCount >= maxRetry) {
          throw new Error('Maximum id generation retry reached,'
            + ' seems somethings went wrong with the default id generator')
        }
        return generateId(userStory, tryCount + 1)
      }

      return id
    }

    this.transformUserStories(userStory => {
      const newId = generateId(userStory)

      if (newId !== userStory.id) {
        currentIdList.push(newId)
        generatedIdCount += 1
      }

      return {
        ...userStory,
        id: newId,
      }
    })

    return generatedIdCount
  }

  async saveToJsonFile(options?: { tabSize?: number, filePath?: string }) {
    const { tabSize = TAB_SIZE, filePath = this.filePath } = options ?? {}

    if (!filePath) {
      throw new Error('No pld file path provided')
    }

    const jsonPld = this.toJSON(tabSize)

    return fsPromise.writeFile(filePath, `${ jsonPld }\n`)
  }

  toJSON(tabSize: number = TAB_SIZE): string {
    return JSON.stringify(this.content, undefined, tabSize)
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

    return new Pld(content, path)
  }

  /**
   * Search for PLD file in given directory
   */
  static async fromDir(path: string): Promise<Pld> {
    const pld = await findJsonPldFile(path)
    return new Pld(pld.content, pld.path)
  }
}

export interface UserStoryFilters {
  assignments?: UserStory['assignments'] | string
  status?: Array<UserStory['status'] | string>
  search?: string[] | string
}
