import type { AbortOptions, PreloadOptions } from '../basic'
import type CID from 'cids'

export type API = {
  refs: Refs
  local: Local
}

export type Refs = (ipfsPath: string | CID, options?: RefsOptions) => AsyncIterable<RefsResult>

export interface RefsOptions extends AbortOptions, PreloadOptions {
  recursive?: boolean
  unique?: boolean
  format?: string
  edges?: boolean
  maxDepth?: number
}

export type Local = (options?: AbortOptions) => AsyncIterable<RefsResult>

export interface RefsResult {
  ref: string
  error?: Error
}
