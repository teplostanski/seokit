import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { loadConfig } from './config'
import type { ConfigOptions } from './types'

export { defineConfig } from './config'
export type { SeogenConfig, ConfigOptions } from './types'

export const createCNAME = async (options: ConfigOptions = {}) => {
  const config = await loadConfig(options)
  const tempDir = '.seogen-temp'
  const cnamePath = join(tempDir, 'CNAME')

  try {
    await mkdir(tempDir, { recursive: true })
    await writeFile(cnamePath, config.hostname)
    console.log('CNAME file created successfully')
  } catch (error) {
    console.error('Error creating CNAME file:', error)
  }
}
