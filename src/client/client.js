import { connect, send } from './network'
import PekDataset from './dataset'
import PekTask from './task'
import { PekClientError } from './error'

export default async function PekClient (serverUrl) {
  const _socket = await connect(serverUrl)
  const _info = await send(_socket, 'info')

  /* ***************************************************************** */

  return (new class PekClient {
    #id = null
    #socket = null
    #datasets = null

    constructor (serverUrl, socket, info) {
      this.#id = socket.id
      this.#socket = socket

      this.server = { url: serverUrl, version: info.data.serverVersion }

      // create dataset objects
      this.#datasets = new Map()
      info.data.datasets.forEach(name => {
        this.#datasets.set(name, new PekDataset(name, this))
      })
    }

    get id () { return this.#id }

    /**
     * Returns the list of dataset names.
     * @returns List od strings.
     */
    getDatasetNames () {
      return [...this.#datasets.keys()]
    }

    /**
     * Returns the dataset object.
     * @param {*} name Name of the dataset.
     * @returns A PekDataset instance.
     */
    getDataset (name) {
      if (!this.#datasets.has(name)) throw new PekClientError(`The dataset with name='${name}' does not exist.`)
      return this.#datasets.get(name)
    }

    async createTask () {
      const task = new PekTask(this)

      this.#socket.on(task.id, (str) => {
        task.notifyPartialResult(str)
      })

      return task
    }

    async _send (event, payload = null) {
      const response = await send(this.#socket, event, payload)
      if (response.error) throw new PekClientError(response.errorMessage)
      else {
        try {
          if (typeof response.data === 'string') {
            return JSON.parse(response.data)
          } else if (typeof response.data === 'object') {
            return response.data
          } else {
            console.warn(response)
            return response.data
          }
        } catch {
          console.warn(response)
          return response.data
        }
      }
    }
  }(serverUrl, _socket, _info))

  /* ***************************************************************** */
}
