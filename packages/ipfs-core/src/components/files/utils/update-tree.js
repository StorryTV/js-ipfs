'use strict'

const log = require('debug')('ipfs:mfs:utils:update-tree')
const addLink = require('./add-link')
const {
  decode
} = require('@ipld/dag-pb')

const defaultOptions = {
  shardSplitThreshold: 1000
}

// loop backwards through the trail, replacing links of all components to update CIDs
const updateTree = async (context, trail, options) => {
  options = Object.assign({}, defaultOptions, options)

  log('Trail', trail)
  trail = trail.slice().reverse()

  let index = 0
  let child

  for await (const block of context.blockService.getMany(trail.map(node => node.cid))) {
    const node = decode(block.data)
    const cid = trail[index].cid
    const name = trail[index].name
    index++

    if (!child) {
      child = {
        cid,
        name,
        // TODO vmx 2021-03-04: Check if the size should be 0 or the actual size
        size: block.data.length
      }

      continue
    }

    const result = await addLink(context, {
      parent: node,
      name: child.name,
      cid: child.cid,
      size: child.size,
      flush: options.flush,
      shardSplitThreshold: options.shardSplitThreshold,
      hashAlg: options.hashAlg,
      cidVersion: options.cidVersion
    })

    // new child for next loop
    child = {
      cid: result.cid,
      name,
      size: result.size
    }
  }

  // @ts-ignore - child is possibly undefined
  const { cid } = child
  log(`Final CID ${cid}`)

  return cid
}

module.exports = updateTree
