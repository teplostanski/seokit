export type CNAMEConfig =
  | boolean
  | {
      customHostname?: string
      path?: string
    }

export type CNAMEBuildResult = {
  content: string
  filePath: string
  fileName: string
}

export type BuildError = {
  code: 'EMPTY_CONFIG' | 'DISABLED' | 'INVALID_CONFIG'
  message: string
}

export type BuildResult =
  | {
      type: 'SUCCESS'
      content: string
      filePath: string
      fileName: string
    }
  | {
      type: 'ERROR'
      error: BuildError
    }

export type RobotsBuildResult = {
  content: string
  filePath: string
  fileName: string
}

