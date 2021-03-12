'use strict'

const UnixFS = require('ipfs-unixfs')
const IpldBlock = require('ipld-block')
const dagPb = require('@ipld/dag-pb')
// @ts-ignore
const Block = require('multiformats/block')
// @ts-ignore
const { sha256 } = require('multiformats/hashes/sha2')
// NOTE vmx 2021-02-19: Not importet as CID to make the type checker happy
const CID = require('cids')
const mc = require('multicodec')
const mh = require('multihashing-async').multihash

const createNode = async (context, type, options) => {
  const hashAlg = mh.names[options.hashAlg]
  const metadata = new UnixFS({
    type,
    mode: options.mode,
    mtime: options.mtime
  })

      node = dagPb.prepare({ Data: metadata.marshal() })
      const block = await Block.encode({
        value: node,
        codec: dagPb,
        // TODO vmx 2021-02-23: support any hashalg as it used to be
        // hasher: hashAlg
        hasher: sha256
      })
      // Create an old style CID
      if (options.flush) {
        // TODO vmx 2021-020-23 Check if the cid version matters (as the old code uses `options.cidVersion`
        const legacyCid = new CID(block.cid.multihash.bytes)
        await context.blockService.put(new IpldBlock(block.bytes, legacyCid))
      }

  return {
    cid: block.cid,
    node
  }
}

module.exports = createNode
