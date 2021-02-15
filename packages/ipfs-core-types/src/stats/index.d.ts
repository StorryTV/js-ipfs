import type { AbortOptions } from '../basic'
import { API as BitswapAPI } from '../bitswap'
import { API as RepoAPI } from '../repo'
import type PeerId from 'peer-id'
import type CID from 'cid'
import type BigInteger from 'bignumber.js'

export interface API {
  bitswap: BitswapAPI["stat"]
  repo: RepoAPI["stat"]
  bw: (options?: BWOptions) => AsyncIterable<BWResult>
}

export interface BWOptions extends AbortOptions {
  peer?: PeerId | CID | string
  proto?: string
  poll?: boolean
  interval?: number
}

export interface BWResult {
  totalIn: BigInteger
  totalOut: BigInteger
  rateIn: BigInteger
  rateOut: BigInteger
}
