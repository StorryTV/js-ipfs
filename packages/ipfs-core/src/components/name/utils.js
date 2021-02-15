'use strict'

const isIPFS = require('is-ipfs')
const CID = require('cids')

/**
 * resolves the given path by parsing out protocol-specific entries
 * (e.g. /ipns/<node-key>) and then going through the /ipfs/ entries and returning the final node
 *
 * @param {Object} context
 * @param {import('../ipns')} context.ipns
 * @param {import('ipld')} context.ipld
 * @param {string} name
 */
exports.resolvePath = ({ ipns, ipld }, name) => {
  // ipns path
  if (isIPFS.ipnsPath(name)) {
    return ipns.resolve(name)
  }

  const cid = new CID(name.substring('/ipfs/'.length))

  // ipfs path
  return ipld.get(cid)
}
