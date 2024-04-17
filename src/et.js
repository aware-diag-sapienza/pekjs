import PekError from './error'

class PekEarlyTerminationError extends PekError {
  constructor (msg) {
    super(msg)
  }
}

class EarlyTerminator {
  constructor (name, threshold, action) {
    this.name = name
    this.threshold = threshold
    this.action = action

    const EARLY_TERMINATION_ACTIONS = ['notify', 'kill']
    if (action !== null && !EARLY_TERMINATION_ACTIONS.includes(action)) {
      throw new PekEarlyTerminationError(`Invalid action value: ${action}. Allowed values are [${EARLY_TERMINATION_ACTIONS.join(', ')}].`)
    }
  }
}

class EarlyTerminatorNotifier extends EarlyTerminator {
  constructor (name, threshold) {
    super(name, threshold, 'notify')
  }
}

class EarlyTerminatorKiller extends EarlyTerminator {
  constructor (name, threshold) {
    super(name, threshold, 'kill')
  }
}

const DefaultEarlyTerminator = {
  FAST_NOTIFY: new EarlyTerminatorNotifier('fast-notify', null),
  SLOW_NOTIFY: new EarlyTerminatorNotifier('slow-notify', null),

  FAST_KILL: new EarlyTerminatorKiller('fast-kill', null),
  SLOW_KILL: new EarlyTerminatorKiller('slow-kill', null)
}

const EarlyTermination = {
  EarlyTerminator,
  EarlyTerminatorNotifier,
  EarlyTerminatorKiller,
  DefaultEarlyTerminator,
  PekEarlyTerminationError
}

export default EarlyTermination
