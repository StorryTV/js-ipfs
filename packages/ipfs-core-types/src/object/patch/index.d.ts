import type CID from 'cids';
import type { AbortOptions } from '../../basic'
import type { DAGLink } from 'ipld-dag-pb'

export interface API {
  addLink: (cid: CID, link: DAGLink, options?: AbortOptions) => Promise<CID>
  rmLink: (cid: CID, link: DAGLink, options?: AbortOptions) => Promise<CID>
  appendData: (cid: CID, data: Uint8Array, options?: AbortOptions) => Promise<CID>
  setData: (cid: CID, data: Uint8Array, options?: AbortOptions) => Promise<CID>
}
