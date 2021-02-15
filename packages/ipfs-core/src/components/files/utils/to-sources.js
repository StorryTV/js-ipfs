'use strict'

const toMfsPath = require('./to-mfs-path')
const mergeOptions = require('merge-options').bind({ ignoreUndefined: true })

/**
 * @typedef {import('../').MfsContext} MfsContext
 */

/**
 * @template O
 *
 * @param {MfsContext} context
 * @param {*} args
 * @param {O} defaultOptions
 */
async function toSources (context, args, defaultOptions) {
  /** @type {string[]} */
  const sources = []
  /** @type {O} */
  let options = defaultOptions

  // takes string arguments and a final optional non-string argument
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'string' || args[i] instanceof String) {
      sources.push(args[i].trim())
    } else if (i === args.length - 1) {
      options = args[i]
    }
  }

  options = mergeOptions(defaultOptions, options)

  return {
    sources: await Promise.all(sources.map(source => toMfsPath(context, source, options))),
    options
  }
}

module.exports = toSources
