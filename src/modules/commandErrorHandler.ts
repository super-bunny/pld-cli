import logger from './logger'

export default function commandErrorHandler(error: Error): void {
  logger.error(error.message)
  process.exit(1)
}
