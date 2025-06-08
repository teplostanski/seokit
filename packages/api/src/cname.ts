import { makeBuildResult } from './shared/utils'
import type { BuildResult, CNAMEConfig, CNAMEOptions } from './types'

const normalizePath = (path: string): string =>
  path?.startsWith('/') ? path.slice(1) : path

const buildResult = {
  object: (
    config: CNAMEOptions,
    defaultPath: string,
    hostname: string,
    fileName: string,
  ): BuildResult => {
    if (Object.keys(config).length === 0) {
      return {
        type: 'ERROR',
        error: {
          code: 'EMPTY_CONFIG',
          message: 'Empty config',
        },
      }
    }

    const result = makeBuildResult(
      config.customHostname ?? hostname,
      normalizePath(config.path ?? defaultPath),
      fileName,
    )

    return {
      type: 'SUCCESS',
      ...result,
    }
  },

  boolean: (
    config: boolean,
    defaultPath: string,
    hostname: string,
    fileName: string,
  ): BuildResult => {
    if (!config) {
      return {
        type: 'ERROR',
        error: {
          code: 'DISABLED',
          message: 'CNAME is disabled',
        },
      }
    }

    const result = makeBuildResult(hostname, defaultPath, fileName)
    return {
      type: 'SUCCESS',
      ...result,
    }
  },
}

export const buildCNAME = (
  config: CNAMEConfig,
  defaultPath: string,
  hostname: string,
): BuildResult => {
  const fileName = 'CNAME'

  if (typeof config === 'object' && config !== null) {
    return buildResult.object(config, defaultPath, hostname, fileName)
  }

  return buildResult.boolean(config, defaultPath, hostname, fileName)
}
