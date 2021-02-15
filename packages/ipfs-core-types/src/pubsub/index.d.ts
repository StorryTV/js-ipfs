import type { AbortOptions } from '../basic'

export interface API {
  subscribe: (topic: string, handler: MessageHandlerFn, options?: AbortOptions) => Promise<void>
  unsubscribe: (topic: string, handler: MessageHandlerFn, options?: AbortOptions) => Promise<void>
  publish: (topic: string, data: string | Uint8Array, options?: AbortOptions) => Promise<void>
  ls: (options?: AbortOptions) => Promise<string>
  peers: (topic: string, options?: AbortOptions) => Promise<string[]>
}

export interface Message {
  from: string
  seqno: Uint8Array
  data: Uint8Array
  topidIds: string[]
}

export type MessageHandlerFn = (message: Message) => void
