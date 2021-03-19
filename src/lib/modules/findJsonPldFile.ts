import fsPromise from 'fs/promises'
import path from 'path'
import { is } from 'typescript-is'
import chalk from 'chalk'
import IPld from '../types/Pld'

export default async function findJsonPldFile(dirPath: string): Promise<{ path: string, content: IPld }> {
  const jsonFiles = await fsPromise.readdir(dirPath)
    .then(files => files.filter(file => file.toLowerCase().endsWith('.json')))

  return await Promise.any(jsonFiles
    .map(filePath => fsPromise.readFile(path.resolve(dirPath, filePath))
      .then(jsonContent => JSON.parse(jsonContent.toString()))
      .then(content => {
        if (!is<IPld>(content)) {
          throw new Error(`Invalid Pld content : ${ path.resolve(dirPath, filePath) }`)
        }
        return {
          path: filePath,
          content,
        }
      })))
    .catch((error: AggregateError) => Promise.reject(
      new AggregateError(error.errors, `Can not find pld file in: ${ chalk.yellow(dirPath) }`),
    ))
}
