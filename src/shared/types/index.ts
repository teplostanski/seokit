export interface RobotsConfig {
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

export interface UserConfig {
  hostname: string
  cname?:
    | boolean
    | {
        customHostname?: string
        path?: string
      }
  robots?: boolean | RobotsConfig
}

export interface ConfigOptions {
  configPath?: string
}
