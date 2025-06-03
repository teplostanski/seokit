export interface SeogenConfig {
  hostname: string
}

export type UserConfig = SeogenConfig
export type UserConfigFn = () => SeogenConfig | Promise<SeogenConfig>

export interface ConfigOptions {
  configPath?: string
}
