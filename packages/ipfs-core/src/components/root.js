'use strict'

const createAddAPI = require('./add')
const createAddAllAPI = require('./add-all')
const createCatAPI = require('./cat')
const createGetAPI = require('./get')
const createLsAPI = require('./ls')

/**
 * @typedef {AddAllContext & CatContext & GetContext & ListContext } Context
 * @typedef {import('./add-all').Context} AddAllContext
 * @typedef {import('./cat').Context} CatContext
 * @typedef {import('./get').Context} GetContext
 * @typedef {import('./ls').Context} ListContext
 * @typedef {import('ipfs-core-types/src').RootAPI} RootAPI
 * @implements {RootAPI}
 */
class Root {
  /**
   * @param {Context} context
   */
  constructor ({ preload, gcLock, pin, block, blockService, options }) {
    const addAll = createAddAllAPI({
      preload,
      gcLock,
      block,
      pin,
      options
    })

    this.addAll = addAll
    this.add = createAddAPI({ addAll })
    this.cat = createCatAPI({ blockService, preload })
    this.get = createGetAPI({ blockService, preload })
    this.ls = createLsAPI({ blockService, preload })
  }
}

module.exports = Root
