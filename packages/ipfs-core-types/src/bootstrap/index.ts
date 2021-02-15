import type { AbortOptions } from '../basic'
import type Multiaddr from 'multiaddr'

export interface API {
  add: (addr: Multiaddr, options?: AbortOptions) => Promise<{ Peers: Multiaddr[] }>
  reset: (options?: AbortOptions) => Promise<{ Peers: Multiaddr[] }>
  list: (options?: AbortOptions) => Promise<{ Peers: Multiaddr[] }>
  rm: (addr: Multiaddr, options?: AbortOptions) => Promise<{ Peers: Multiaddr[] }>
  clear: (options?: AbortOptions) => Promise<{ Peers: Multiaddr[] }>
}
