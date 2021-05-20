import commander from 'commander'
import getPld from '../getPld'
import logger from '../logger'
import printPldTree from '../print/pldTree'

export default commander.createCommand('tree')
  .description('print pld as tree (deliverables, subsets and user stories title)')
  .action((options, command) => getPld(command.parent?.opts())
    .then(pld => {
      printPldTree(pld)
    })
    .catch((error: AggregateError) => {
      logger.error(error.message)
      process.exit(1)
    }))
