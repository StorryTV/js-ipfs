import CID from 'cids';
import type { AbortOptions } from '../../basic'

export interface API {
  cancel: (name: string, options?: AbortOptions) => Promise<PubsubCancelResult>
  state: (options?: AbortOptions) => Promise<PubsubStateResult>
  subs: (options?: AbortOptions) => Promise<string[]>
}

export interface PubsubCancelResult {
  canceled: boolean
}

export interface PubsubStateResult {
  enabled: boolean
}
