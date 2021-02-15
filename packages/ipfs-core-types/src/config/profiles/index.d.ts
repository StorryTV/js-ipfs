import type { AbortOptions } from '../../basic'

export interface API {
  /**
   * List available config profiles
   */
  list: (options?: AbortOptions) => Promise<Profile[]>

  /**
   * Apply a profile to the current config.  Note that restarting the node
   * will be necessary for any change to take effect.
   */
  apply: (name: string, options?: ProfilesApplyOptions) => Promise<ProfilesApplyResult>
}

export interface Profile {
  name: string
  description: string
}

export interface ProfilesApplyOptions extends AbortOptions {
  dryRun?: boolean
}

export interface ProfilesApplyResult {
  original: object
  updated: object
}
