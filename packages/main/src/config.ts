import { resolve } from 'path'
import type { ConfigOptions, UserConfig } from '../../api/shared/types'

const DEFAULT_CONFIG_PATHS = [
  'seokit.config.ts',
  'seokit.config.js',
  'seokit.config.cjs',
]

const DEFAULT_CONFIG: Partial<UserConfig> = {
  cname: false,
}

/**
 * Defines the configuration for seokit.
 */
export function defineConfig(config: UserConfig): UserConfig {
  return config
}

export async function loadConfig(
  options: ConfigOptions = {},
): Promise<UserConfig> {
  const paths = options.configPath ? [options.configPath] : DEFAULT_CONFIG_PATHS

  const searchPaths = [process.cwd(), resolve(process.cwd(), '..')]

  for (const basePath of searchPaths) {
    for (const path of paths) {
      const fullPath = resolve(basePath, path)
      try {
        const config = await import(fullPath)
        // ESM (default) и CommonJS (module.exports)
        const result =
          typeof config === 'function' ? config() : config.default || config
        if (!result.hostname) {
          console.error('Missing required field "hostname" in', path)
          process.exit(1)
        }
        return { ...DEFAULT_CONFIG, ...result } as UserConfig
      } catch {
        continue
      }
    }
  }

  console.error(
    'Config file not found. Please create seokit.config.ts, seokit.config.js or seokit.config.cjs',
  )
  process.exit(1)
}
