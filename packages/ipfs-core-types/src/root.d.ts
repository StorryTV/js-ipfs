import type { AbortOptions, PreloadOptions, IPFSPath, ImportSource, ToEntry, IPFSEntry } from './basic'
import type CID, { CIDVersion } from 'cids'
import type { ImportResult } from 'ipfs-unixfs-importer'
import type PeerId from 'peer-id'
import type Multiaddr from 'multiaddr'
import type { BaseName } from 'multibase'

export interface API {
  add: (entry: ToEntry, options?: AddOptions) => Promise<ImportResult>
  addAll: (source: ImportSource, options?: AddAllOptions & AbortOptions) => AsyncIterable<ImportResult>
  cat: (ipfsPath: IPFSPath, options?: CatOptions) => AsyncIterable<Uint8Array>
  get: (ipfsPath: IPFSPath, options?: GetOptions) => AsyncIterable<IPFSEntry>
  ls: (ipfsPath: IPFSPath, options?: ListOptions) => AsyncIterable<IPFSEntry>

  id: (options?: AbortOptions) => Promise<IDResult>
  version: (options?: AbortOptions) => Promise<VersionResult>
  dns: (domain: string, options?: DNSOptions) => Promise<string>
  start: () => Promise<void>
  stop: (options?: AbortOptions) => Promise<void>
  ping: (peerId: PeerId | CID, options?: PingOptions) => AsyncIterable<PingResult>
  resolve: (name: string, options?: ResolveOptions) => Promise<string>
  isOnline: () => boolean
}

export interface File {
  readonly type: 'file'
  readonly cid: CID
  readonly name: string

  /**
   * File path
   */
  readonly path: string
  /**
   * File content
   */
  readonly content?: AsyncIterable<Uint8Array>
  mode?: number
  mtime?: Mtime
  size: number
  depth: number
}

export interface Directory {
  type: 'dir'
  cid: CID
  name: string
  /**
   * Directory path
   */
  path: string
  mode?: number
  mtime?: Mtime
  size: number
  depth: number
}

export type IPFSEntry = File | Directory

export type AddProgressFn = (bytes: number, path?: string) => void

export interface AddOptions extends AbortOptions {
  /**
   * Chunking algorithm used to build ipfs DAGs. (defaults to 'size-262144')
   */
  chunker?: string
  /**
   * The CID version to use when storing the data
   */
  cidVersion?: CIDVersion

  /**
   * Multihash hashing algorithm to use. (Defaults to 'sha2-256')
   */
  hashAlg?: string

  /**
   * If true, will not add blocks to the blockstore. (Defaults to `false`)
   */
  onlyHash?: boolean

  /**
   * Pin this object when adding. (Defaults to `true`)
   */
  pin?: boolean

  /**
   * A function that will be called with the number of bytes added as a file is
   * added to ipfs and the path of the file being added.
   *
   * **Note** It will not be called for directory entries.
   */
  progress?: AddProgressFn

  /**
   * If true, DAG leaves will contain raw file data and not be wrapped in a
   * protobuf. (Defaults to `false`)
   */
  rawLeaves?: boolean

  /**
   * If true will use the
   * [trickle DAG](https://godoc.org/github.com/ipsn/go-ipfs/gxlibs/github.com/ipfs/go-unixfs/importer/trickle)
   * format for DAG generation. (Defaults to `false`).
   */
  trickle?: boolean

  /**
   * Adds a wrapping node around the content. (Defaults to `false`)
   */
  wrapWithDirectory?: boolean

  /**
   * Whether to preload all blocks created during this operation
   */
  preload?: boolean
}

export interface AddAllOptions extends AddOptions {

  /**
   * Allows to create directories with an unlimited number of entries currently
   * size of unixfs directories is limited by the maximum block size.
   * ** Note ** that this is an experimental feature. (Defaults to `false`)
   */
  enableShardingExperiment?: boolean

  /**
   * Directories with more than this number of files will be created as HAMT -
   * sharded directories. (Defaults to 1000)
   */
  shardSplitThreshold?: number
}

export interface ShardingOptions {
  sharding?: boolean
}

export interface CatOptions extends AbortOptions, PreloadOptions {
  /**
   * An offset to start reading the file from
   */
  offset?: number
  /**
   * An optional max length to read from the file
   */
  length?: number
}

export interface GetOptions extends AbortOptions, PreloadOptions {}

export interface ListOptions extends AbortOptions, PreloadOptions {
  recursive?: boolean
  includeContent?: boolean
}

export interface IDResult {
  id: string
  publicKey: string
  addresses: Multiaddr[]
  agentVersion: string
  protocolVersion: string
  protocols: string[]
}

/**
 * An object with the version information for the implementation,
 * the commit and the Repo. `js-ipfs` instances will also return
 * the version of `interface-ipfs-core` and `ipfs-http-client`
 * supported by this node
 */
export interface VersionResult {
  version: string
  commit?: string
  repo?: string
  system?: string
  golang?: string
  'interface-ipfs-core'?: string
  'ipfs-http-client'?: string
}

export interface DNSOptions extends AbortOptions {
  recursive?: boolean
}

export interface PingOptions extends AbortOptions {
  count?: number
}

export interface PingResult {
  success: boolean
  time: number
  text: string
}

export interface ResolveOptions extends AbortOptions {
  recursive?: boolean
  cidBase?: BaseName
}
