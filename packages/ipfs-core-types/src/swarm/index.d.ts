import type { AbortOptions } from '../basic'
import { API as BitswapAPI } from '../bitswap'
import { API as RepoAPI } from '../repo'
import type PeerId from 'peer-id'
import type CID from 'cid'
import type BigInteger from 'bignumber.js'
import type Multiaddr from 'multiaddr'

export interface API {
  addrs: (options?: AbortOptions) => Promise<AddrsResult[]>
  connect: (addr: Multiaddr, options?: AbortOptions) => Promise<void>
  disconnect: (addr: Multiaddr, options?: AbortOptions) => Promise<void>
  localAddrs: (options?: AbortOptions) => Promise<Multiaddr[]>
  peers: (options?: PeersOptions) => Promise<PeersResult[]>
}

export interface AddrsResult {
  id: string
  addrs: Multiaddr[]
}

export interface PeersOptions extends AbortOptions {
  direction?: boolean
  streams?: boolean
  verbose?: boolean
  latency?: boolean
}

export enum PeerDirection {
  Inbound = 0,
  Outbound
}

export interface PeersResult {
  addr: Multiaddr
  peer: string
  latency?: string
  muxer?: string
  streams?: string[]
  direction?: PeerDirection
}
