import type { BuildResult, CNAMEBuildResult, CNAMEConfig } from "./types";

const DEFAULT_FILE_NAME = 'CNAME'

const normalizePath = (path: string): string =>
  path?.startsWith('/') ? path.slice(1) : path

const createConfig = (content: string, filePath: string): CNAMEBuildResult =>
  Object.freeze({
    content,
    filePath,
    fileName: DEFAULT_FILE_NAME,
  })

const handleConfig = {
  object: (
    config: { customHostname?: string; path?: string },
    defaultPath: string,
    hostname: string,
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

    const result = createConfig(
      config.customHostname ?? hostname,
      normalizePath(config.path ?? defaultPath),
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

    const result = createConfig(hostname, defaultPath)
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
  if (typeof config === 'object' && config !== null) {
    return handleConfig.object(config, defaultPath, hostname)
  }

  return handleConfig.boolean(config, defaultPath, hostname)
}
