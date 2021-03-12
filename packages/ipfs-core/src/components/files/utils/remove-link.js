'use strict'

const dagPb = require('@ipld/dag-pb')
const { sha256 } = require('multiformats/hashes/sha2')
const Block = require('multiformats/block')
const IpldBlock = require('ipld-block')
const CID = require('cids')
const log = require('debug')('ipfs:mfs:core:utils:remove-link')
const UnixFS = require('ipfs-unixfs')
const {
  generatePath,
  updateHamtDirectory
} = require('./hamt-utils')
const errCode = require('err-code')
const mc = require('multicodec')
const mh = require('multihashing-async').multihash

const removeLink = async (context, options) => {
  if (!options.parentCid && !options.parent) {
    throw errCode(new Error('No parent node or CID passed to removeLink'), 'EINVALIDPARENT')
  }

  if (options.parentCid && !CID.isCID(options.parentCid)) {
    throw errCode(new Error('Invalid CID passed to removeLink'), 'EINVALIDPARENTCID')
  }

  if (!options.parent) {
    log(`Loading parent node ${options.parentCid}`)

    const block = await context.blockService.get(options.parentCid)
    options.parent = dagPb.decode(block.data)
  }

  if (!options.name) {
    throw errCode(new Error('No child name passed to removeLink'), 'EINVALIDCHILDNAME')
  }

  const meta = UnixFS.unmarshal(options.parent.Data)

  if (meta.type === 'hamt-sharded-directory') {
    log(`Removing ${options.name} from sharded directory`)

    return removeFromShardedDirectory(context, options)
  }

  log(`Removing link ${options.name} regular directory`)

  return removeFromDirectory(context, options)
}

const removeFromDirectory = async (context, options) => {
  //const hashAlg = mh.names[options.hashAlg]

  // Remove existing link if it exists
  options.parent.Links = options.parent.Links.filter((link) => {
    link.name !== options.name
  })
  // TODO vmx 2021-03-04: Check if the CID version matters
  const parentBlock = await Block.encode({
    value: options.parent,
    codec: dagPb,
    // TODO vmx 2021-03-04: Check if support for other hash algs is needed
    hasher: sha256
  })

  const legacyCid = new CID(parentBlock.cid.multihash.bytes)
  await context.blockService.put(new IpldBlock(parentBlock.bytes, legacyCid))

  const cid = parentBlock.cid
  log(`Updated regular directory ${cid}`)

  return {
    node: options.parent,
    cid
  }
}

const removeFromShardedDirectory = async (context, options) => {
  const {
    rootBucket, path
  } = await generatePath(context, options.name, options.parent)

  await rootBucket.del(options.name)

  const {
    node
  } = await updateShard(context, path, {
    name: options.name,
    cid: options.cid,
    size: options.size,
    hashAlg: options.hashAlg,
    cidVersion: options.cidVersion,
    flush: options.flush
  }, options)

  return updateHamtDirectory(context, node.Links, rootBucket, options)
}

const updateShard = async (context, positions, child, options) => {
  const {
    bucket,
    prefix,
    node
  } = positions.pop()

  const link = node.Links
    .find(link => link.Name.substring(0, 2) === prefix)

  if (!link) {
    throw errCode(new Error(`No link found with prefix ${prefix} for file ${child.name}`), 'ERR_NOT_FOUND')
  }

  if (link.Name === `${prefix}${child.name}`) {
    log(`Removing existing link ${link.Name}`)

    node.rmLink(link.Name)

    await bucket.del(child.name)

    return updateHamtDirectory(context, node.Links, bucket, options)
  }

  log(`Descending into sub-shard ${link.Name} for ${prefix}${child.name}`)

  const result = await updateShard(context, positions, child, options)

  let newName = prefix

  if (result.node.Links.length === 1) {
    log(`Removing subshard for ${prefix}`)

    // convert shard back to normal dir
    result.cid = result.node.Links[0].Hash
    result.node = result.node.Links[0]

    newName = `${prefix}${result.node.Name.substring(2)}`
  }

  log(`Updating shard ${prefix} with name ${newName}`)

  // TODO vmx 2021-03-04: This might be wrong, does every node have a `Tsize`?
  const size = result.node.Tsize

  return updateShardParent(context, bucket, node, prefix, newName, size, result.cid, options)
}

const updateShardParent = (context, bucket, parent, oldName, newName, size, cid, options) => {
  // Remove existing link if it exists
  const parentLinks = parent.Links.filter((link) => {
    link.name !== oldName
  })
  parentLinks.push({
    Name: newName,
    Tsize: size,
    Hash: cid
  })

  return updateHamtDirectory(context, parentLinks, bucket, options)
}

module.exports = removeLink
