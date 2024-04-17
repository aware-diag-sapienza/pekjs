import { v4 as uuidv4 } from 'uuid'
import { PekTaskError } from './error'
import EarlyTermination from '../et'
import EnsemblePartialResult from './results'

const PekTaskStatus = {
  pending: 'pending',
  running: 'running',
  paused: 'paused',
  killed: 'killed',
  completed: 'completed'
}

/**
 * Represents a PekTask instance that interacts with a PekClient to manage task operations.
 * @typedef {Object} PekTask
 * @property {string} id - The ID of the task.
 * @property {string} dataset - The dataset associated with the task.
 * @property {PekClient} #client - Private field to store the PekClient instance.
 * @property {string} #status - Private field to store the current status of the task.
 * @property {Object} #args - Private field to store task arguments.
 * @property {Function} #onPartialResultCallback - Private field to store the partial result callback function.
 */
/**
 * Represents a task in the Pek system.
 */
export default class PekTask {
  #client = null
  #status = null

  #args = {
    taskId: null,
    data: null,
    n_clusters: 2,
    n_runs: 4,
    init: 'k-means++',
    max_iter: 300,
    tol: 1e-4,
    random_state: null,
    freq: null,
    ets: null,
    labelsValidationMetrics: null,
    labelsComparisonMetrics: null,
    labelsProgressionMetrics: null,
    partitionsValidationMetrics: null,
    partitionsComparisonMetrics: null,
    partitionsProgressionMetrics: null,
    adjustCentroids: true,
    adjustLabels: true,
    returnPartitions: false
  }

  #onPartialResultCallback = () => {}

  /**
   * Creates an instance of PekTask.
   * @param {string} id - The ID of the task.
   * @param {string} dataset - The dataset associated with the task.
   * @param {PekClient} client - An instance of PekClient to interact with the server.
   */
  constructor (client) {
    this.id = uuidv4()
    this.#client = client
    this.#status = PekTaskStatus.pending
    this.#args.taskId = this.id
  }

  notifyPartialResult (str) {
    const safeStr = str.replace(/Infinity/g, 'null').replace(/-Infinity/g, 'null').replace(/NaN/g, 'null')
    const d = JSON.parse(safeStr)
    const pr = new EnsemblePartialResult(d)
    this.#onPartialResultCallback(pr)
  }

  // Status control methods...

  /**
   * Retrieves the current status of the task.
   * @returns {string} - The current status of the task.
   */
  get status () {
    return this.#status
  }

  /**
   * Starts the task.
   * @throws {PekTaskError} - Throws an error if the task has already been started.
   */
  async start () {
    if (this.status !== PekTaskStatus.pending) throw PekTaskError(`${this.constructor.name} ${this.id} has already been started.`)
    await this.#client._send('start-task', { clientId: this.#client.id, taskId: this.id, args: this.#args })
    this.#status = PekTaskStatus.running
  }

  /**
   * Pauses the task.
   * @throws {PekTaskError} - Throws an error if the task is not running.
   */
  async pause () {
    if (this.status !== PekTaskStatus.running) throw PekTaskError(`${this.constructor.name} ${this.id} is not running.`)
    await this.#client._send('pause-task', { clientId: this.#client.id, taskId: this.id })
    this.#status = PekTaskStatus.paused
  }

  /**
   * Resumes the task.
   * @throws {PekTaskError} - Throws an error if the task is not paused.
   */
  async resume () {
    if (this.status !== PekTaskStatus.paused) throw PekTaskError(`${this.constructor.name} ${this.id} is not paused.`)
    await this.#client._send('resume-task', { clientId: this.#client.id, taskId: this.id })
    this.#status = PekTaskStatus.running
  }

  /**
   * Kills the task.
   * @throws {PekTaskError} - Throws an error if the task is not running.
   */
  async kill () {
    if (this.status !== PekTaskStatus.running) throw PekTaskError(`${this.constructor.name} ${this.id} is not running.`)
    await this.#client._send('kill-task', { clientId: this.#client.id, taskId: this.id })
    this.#status = PekTaskStatus.killed
  }

  /**
   * Kills a run of the task.
   * @throws {PekTaskError} - Throws an error if the task is not running.
   */
  async killRun (runId) {
    if (this.status !== PekTaskStatus.running) throw PekTaskError(`${this.constructor.name} ${this.id} is not running.`)
    await this.#client._send('kill-run', { clientId: this.#client.id, taskId: this.id, runId })
  }

  // Partial result listener method...

  onPartialResult (callback) {
    this.#onPartialResultCallback = callback
    return this
  }

  // Args getter and setter methods...

  get args () {
    return this.#args
  }

  data (value) {
    if (!arguments.length) return this.#args.data
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.data = (typeof (value) === 'function' ? value() : value)
    return this
  }

  n_clusters (value) {
    if (!arguments.length) return this.#args.n_clusters
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.n_clusters = (typeof (value) === 'function' ? value() : value)
    return this
  }

  n_runs (value) {
    if (!arguments.length) return this.#args.n_runs
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.n_runs = (typeof (value) === 'function' ? value() : value)
    return this
  }

  init (value) {
    if (!arguments.length) return this.#args.init
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.init = (typeof (value) === 'function' ? value() : value)
    return this
  }

  max_iter (value) {
    if (!arguments.length) return this.#args.max_iter
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.max_iter = (typeof (value) === 'function' ? value() : value)
    return this
  }

  tol (value) {
    if (!arguments.length) return this.#args.tol
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.tol = (typeof (value) === 'function' ? value() : value)
    return this
  }

  random_state (value) {
    if (!arguments.length) return this.#args.random_state
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.random_state = (typeof (value) === 'function' ? value() : value)
    return this
  }

  freq (value) {
    if (!arguments.length) return this.#args.freq
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.freq = (typeof (value) === 'function' ? value() : value)
    return this
  }

  ets (value) {
    if (!arguments.length) return this.#args.ets
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')

    const v = (typeof (value) === 'function' ? value() : value)
    if (v !== undefined && v !== null) {
      if (!Array.isArray(v)) throw new PekTaskError('Invalid value for early termination. Must be an array of EarlyTermination instances.')
      for (let i = 0; i < v.length; i++) {
        if (v[i] instanceof EarlyTermination.EarlyTerminator) continue
        else throw new PekTaskError('Invalid value for early termination. Must be an array of EarlyTermination instances.')
      }
      this.#args.ets = v
    }
    return this
  }

  labelsValidationMetrics (value) {
    if (!arguments.length) return this.#args.labelsValidationMetrics
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.labelsValidationMetrics = (typeof (value) === 'function' ? value() : value)
    return this
  }

  labelsComparisonMetrics (value) {
    if (!arguments.length) return this.#args.labelsComparisonMetrics
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.labelsComparisonMetrics = (typeof (value) === 'function' ? value() : value)
    return this
  }

  labelsProgressionMetrics (value) {
    if (!arguments.length) return this.#args.labelsProgressionMetrics
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.labelsProgressionMetrics = (typeof (value) === 'function' ? value() : value)
    return this
  }

  partitionsValidationMetrics (value) {
    if (!arguments.length) return this.#args.partitionsValidationMetrics
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.partitionsValidationMetrics = (typeof (value) === 'function' ? value() : value)
    return this
  }

  partitionsComparisonMetrics (value) {
    if (!arguments.length) return this.#args.partitionsComparisonMetrics
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.partitionsComparisonMetrics = (typeof (value) === 'function' ? value() : value)
    return this
  }

  partitionsProgressionMetrics (value) {
    if (!arguments.length) return this.#args.partitionsProgressionMetrics
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.partitionsProgressionMetrics = (typeof (value) === 'function' ? value() : value)
    return this
  }

  adjustCentroids (value) {
    if (!arguments.length) return this.#args.adjustCentroids
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.adjustCentroids = (typeof (value) === 'function' ? value() : value)
    return this
  }

  adjustLabels (value) {
    if (!arguments.length) return this.#args.adjustLabels
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.adjustLabels = (typeof (value) === 'function' ? value() : value)
    return this
  }

  returnPartitions (value) {
    if (!arguments.length) return this.#args.returnPartitions
    if (this.#status !== PekTaskStatus.pending) throw new PekTaskError('Cannot set args while the task is not pending.')
    this.#args.returnPartitions = (typeof (value) === 'function' ? value() : value)
    return this
  }
}
