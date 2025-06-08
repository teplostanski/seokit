import type { MakeBuildResult } from './shared/types'

export type CNAMEOptions = {
  customHostname?: string
  path?: string
}

export type CNAMEConfig = boolean | CNAMEOptions

export type BuildError = {
  code: 'EMPTY_CONFIG' | 'DISABLED' | 'INVALID_CONFIG'
  message: string
}

export type BuildResult =
  | (MakeBuildResult & { type: 'SUCCESS' })
  | {
      type: 'ERROR'
      error: BuildError
    }
