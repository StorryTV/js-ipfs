import CID from 'cids';
import type { AbortOptions, PreloadOptions } from '../basic'
import type { DAGNode, DAGNodeLike, DAGLink } from 'ipld-dag-pb'
import type { API as PatchAPI } from './patch'

export interface API {
  new: (options?: NewObjectOptions) => Promise<CID>
  put: (obj: DAGNode | DAGNodeLike | Uint8Array, options?: PutOptions) => Promise<CID>
  get: (cid: CID, options?: AbortOptions & PreloadOptions) => Promise<DAGNode>
  data: (cid: CID, options?: AbortOptions & PreloadOptions) => Promise<Uint8Array>
  links: (cid, options?: AbortOptions & PreloadOptions) => Promise<DAGLink[]>
  stat: (cid, options?: AbortOptions & PreloadOptions) => Promise<StatResult>

  patch: PatchAPI
}

export interface NewObjectOptions extends AbortOptions, PreloadOptions {
  template?: 'unixfs-dir'
}

export interface PutOptions extends AbortOptions, PreloadOptions {
  enc?: PutEncoding
}

export interface StatResult {
  Hash: string
  NumLinks: number
  BlockSize: number
  LinksSize: number
  DataSize: number
  CumulativeSize: number
}

export type PutEncoding = 'json' | 'protobuf'