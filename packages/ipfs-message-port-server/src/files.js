'use strict'

/* eslint-env browser */

const { encodeCID } = require('ipfs-message-port-protocol/src/cid')

/**
 * @typedef {import('ipfs-message-port-protocol/src/dag').EncodedCID} EncodedCID
 */
/**
 * @typedef {import('ipfs-message-port-protocol/src/data').HashAlg} HashAlg
 * @typedef {import('ipfs-message-port-protocol/src/data').Mode} Mode
 * @typedef {import('ipfs-core-types').IPFS} IPFS
 * @typedef {Stat} EncodedStat
 * @typedef {import('ipfs-core-types/src/mfs').StatOptions} StatOptions
 */

exports.FilesService = class FilesService {
  /**
   *
   * @param {IPFS} ipfs
   */
  constructor (ipfs) {
    this.ipfs = ipfs
  }

  /**
   * @typedef {Object} StatQuery
   * @property {string} path
   *
   * @typedef {Object} Stat
   * @property {EncodedCID} cid
   * @property {number} size
   * @property {number} cumulativeSize
   * @property {'file'|'directory'} type
   * @property {number} blocks
   * @property {boolean} withLocality
   * @property {boolean} local
   * @property {number} sizeLocal
   *
   * @typedef {Object} StatResult
   * @property {Stat} stat
   * @property {Transferable[]} transfer
   *
   * @param {StatOptions & StatQuery} input
   * @returns {Promise<StatResult>}
   */
  async stat (input) {
    const stat = await this.ipfs.files.stat(input.path, input)
    /** @type {Transferable[]} */
    const transfer = []
    return { stat: { ...stat, cid: encodeCID(stat.cid, transfer) }, transfer }
  }
}
