import type { CNAMEConfig } from '../../types'

export interface RobotsOptions {
  comment?: string | string[]
  policy: Array<{
    userAgent: string
    disallow?: string | string[]
    allow?: string | string[]
    crawlDelay?: number
  }>
  host?: string
  sitemap?: string
  path?: string
}

export type RobotsConfig = boolean | RobotsOptions

export interface UserConfig {
  hostname: string
  cname?: CNAMEConfig
  robots?: RobotsConfig
}

export interface ConfigOptions {
  configPath?: string
}

export type MakeBuildResult = {
  content: string
  filePath: string
  fileName: string
}
