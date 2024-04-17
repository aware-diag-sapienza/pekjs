import PekError from '../error'

export class PekClientError extends PekError {
  constructor (msg) {
    super(msg)
  }
}

export class PekDatasetError extends PekError {
  constructor (msg) {
    super(msg)
  }
}

export class PekTaskError extends PekError {
  constructor (msg) {
    super(msg)
  }
}
