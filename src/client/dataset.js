/**
 * Represents a PekDataset instance that interacts with a PekClient to retrieve dataset information.
 */
import { PekDatasetError } from './error'

export default class PekDataset {
  /**
   * @private {PekClient} #client - Private field to store the PekClient instance.
   * @private {Object} _data - Private field to cache retrieved data.
   * @param {string} name - The name of the dataset.
   * @param {PekClient} client - An instance of PekClient to interact with the server.
   */
  #client = null

  constructor (name, client) {
    this.#client = client
    this.name = name
    this._data = {}
  }

  /**
   * Retrieves data for the specified key from the dataset.
   * @param {string} key - The key for the data to retrieve. Allowed keys are: 'features', 'original', 'scaled', 'isomap', 'mds', 'pca', 'tsne', 'umap'.
   * @returns {Promise<Object>} - A Promise that resolves with the retrieved data.
   * @throws {PekDatasetError} - Throws an error if an invalid key is provided.
   */
  async get (key) {
    const availableKeys = ['features', 'original', 'scaled', 'isomap', 'mds', 'pca', 'tsne', 'umap']
    if (!availableKeys.includes(key)) {
      throw new PekDatasetError(`Invalid key='${key}'. Must be in ${availableKeys}.`)
    }
    if (this._data[key] === undefined) {
      const payload = { name: this.name }
      payload[key] = true

      const response = await this.#client._send('dataset', payload)
      this._data[key] = response[key]
    }
    return this._data[key]
  }

  /**
   * Shortcut method to retrieve features data.
   * @returns {Promise<Object>} - A Promise that resolves with the retrieved features data.
   */
  async getFeatures () {
    return this.get('features')
  }

  /**
   * Shortcut method to retrieve original data.
   * @returns {Promise<Object>} - A Promise that resolves with the retrieved original data.
   */
  async getOriginalData () {
    return this.get('original')
  }

  /**
   * Shortcut method to retrieve scaled data.
   * @returns {Promise<Object>} - A Promise that resolves with the retrieved scaled data.
   */
  async getScaledData () {
    return this.get('scaled')
  }

  /**
   * Shortcut method to retrieve ISOMAP data.
   * @returns {Promise<Object>} - A Promise that resolves with the retrieved ISOMAP data.
   */
  async getISOMAP () {
    return this.get('isomap')
  }

  /**
   * Shortcut method to retrieve MDS data.
   * @returns {Promise<Object>} - A Promise that resolves with the retrieved MDS data.
   */
  async getMDS () {
    return this.get('mds')
  }

  /**
   * Shortcut method to retrieve PCA data.
   * @returns {Promise<Object>} - A Promise that resolves with the retrieved PCA data.
   */
  async getPCA () {
    return this.get('pca')
  }

  /**
   * Shortcut method to retrieve TSNE data.
   * @returns {Promise<Object>} - A Promise that resolves with the retrieved TSNE data.
   */
  async getTSNE () {
    return this.get('tsne')
  }

  /**
   * Shortcut method to retrieve UMAP data.
   * @returns {Promise<Object>} - A Promise that resolves with the retrieved UMAP data.
   */
  async getUMAP () {
    return this.get('umap')
  }
}
