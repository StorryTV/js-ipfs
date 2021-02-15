import type { AbortOptions } from '../basic'

export interface API {
  gen: (name: string, options?: GenOptions) => Promise<Key>
  list: (options?: AbortOptions) => Promise<Key[]>
  rm: (name: string, options?: AbortOptions) => Promise<Key>
  rename: (oldName: string, newName: string, options?: AbortOptions) => Promise<RenameKeyResult>
  export: (name: string, password: string, options?: AbortOptions) => Promise<string>
  import: (name: string, pem: string, password: string, options?: AbortOptions) => Promise<Key>
  info: (name: string, options?: AbortOptions) => Promise<Key>
}

export interface GenOptions extends AbortOptions {
  type: string
  size: number
}

export interface Key {
  id: string
  name: key
}

export interface RenameKeyResult {
  id: string
  was: string
  now: string
  overwrite: boolean
}
