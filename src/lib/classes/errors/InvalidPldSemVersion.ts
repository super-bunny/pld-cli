import { Version } from '../../types/Pld'

export default class InvalidPldSemVersion extends Error {
  name = 'INVALID_PLD_SEM_VERSION'

  constructor(message: string, readonly version?: Version) {
    super(message)
  }
}
