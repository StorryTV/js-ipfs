import type BigInteger from 'bignumber.js'
import type PeerId from 'peer-id'
import type CID from 'cids'
import type { AbortOptions } from '../basic'

export interface API {
  wantlist: (options?: AbortOptions) => Promise<CID[]>
  wantlistForPeer: (peerId, options?: AbortOptions) => Promise<CID[]>
  unwant: (cids: CID | CID[], options?: AbortOptions) => Promise<void>
  stat: (options?: AbortOptions) => Promise<Stats>
}

export interface Stats {
  provideBufLen: number
  wantlist: CID[]
  peers: CID[]
  blocksReceived: BigInteger
  dataReceived: BigInteger
  blocksSent: BigInteger
  dataSent: BigInteger
  dupBlksReceived: BigInteger
  dupDataReceived: BigInteger
}
