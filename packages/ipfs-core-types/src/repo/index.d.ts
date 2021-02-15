import type { AbortOptions } from '../basic'
import type BigInteger from 'bignumber.js'
import CID from 'cids'

export interface API {
  gc: (options?: GCOptions) => AsyncIterable<GCResult>
  stat: (options?: StatOptions) => Promise<StatResult>
  version: (options?: AbortOptions) => Promise<number>
}

export interface GCOptions extends AbortOptions {
  quiet?: boolean
}

export interface GCError {
  err: Error
}

export interface GCSuccess {
  cid: CID
}

export type GCResult  = GCSuccess | GCError

export interface StatOptions extends AbortOptions {
  human: boolean
}

export interface StatResult {
  numObjects: BigInteger
  repoPath: string
  repoSize: BigInteger
  version: number
  storageMax: BigInteger
}
