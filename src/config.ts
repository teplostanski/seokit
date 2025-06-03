/**
 * Defines the configuration for seogen.
 */
import { resolve } from 'path'
import type {
  SeogenConfig,
  ConfigOptions,
  UserConfig,
  UserConfigFn,
} from './types'

const DEFAULT_CONFIG_PATHS = [
  'seogen.config.ts',
  'seogen.config.js',
  'seogen.config.cjs',
]

/**
 * Defines the configuration for seogen.
 * This function is used for type inference and IDE autocompletion.
 */
export function defineConfig(
  config: UserConfig | UserConfigFn,
): UserConfig | UserConfigFn {
  return config
}

export async function loadConfig(
  options: ConfigOptions = {},
): Promise<SeogenConfig> {
  const paths = options.configPath ? [options.configPath] : DEFAULT_CONFIG_PATHS

  // Ищем конфиг в текущей директории и в корне проекта
  const searchPaths = [process.cwd(), resolve(process.cwd(), '..')]

  for (const basePath of searchPaths) {
    for (const path of paths) {
      const fullPath = resolve(basePath, path)
      try {
        const config = require(fullPath)
        // Поддерживаем и ESM (default) и CommonJS (module.exports)
        const result =
          typeof config === 'function' ? config() : config.default || config
        if (!result.hostname) {
          console.error('Missing required field "hostname" in', path)
          process.exit(1)
        }
        return result
      } catch {
        continue
      }
    }
  }

  console.error(
    'Config file not found. Please create seogen.config.ts, seogen.config.js or seogen.config.cjs',
  )
  process.exit(1)
}
