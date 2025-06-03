import { NEW_LINE } from '../shared/constants'
import type { RobotsConfig } from '../shared/types'
import type { BuildResult, RobotsBuildResult } from './types'

const DEFAULT_FILE_NAME = 'robots.txt'
const DEFAULT_FILE_PATH = 'public'

const addLine = (
  name: string,
  rule: string | number | Array<string | number>,
): string => {
  const formatRule = (r: string | number): string =>
    name === 'Allow' || name === 'Disallow'
      ? encodeURI(r.toString())
      : r.toString()

  const formatLine = (content: string): string =>
    `${name}${name === '#' ? '' : ':'} ${content}${NEW_LINE}`

  return Array.isArray(rule)
    ? rule.map(formatRule).map(formatLine).join('')
    : formatLine(formatRule(rule))
}

const policyMap = {
  comment: (rule: string | string[]) => addLine('#', rule),
  userAgent: (rule: string) => addLine('User-agent', rule),
  disallow: (rule: string | string[]) => addLine('Disallow', rule),
  allow: (rule: string | string[]) => addLine('Allow', rule),
  crawlDelay: (rule: number) => addLine('Crawl-delay', rule),
  sitemap: (rule: string | string[]) => addLine('Sitemap', rule),
  host: (rule: string) => addLine('Host', rule),
} as const

export const buildUserAgentPolicies = (
  policyArray: Array<{
    userAgent: string
    disallow?: string | string[]
    allow?: string | string[]
    crawlDelay?: number
  }>,
): string => {
  return policyArray
    .filter((policy) => policy.userAgent)
    .reduce((acc, policy, index) => {
      const content = [
        policyMap.userAgent(policy.userAgent),
        policy.disallow ? policyMap.disallow(policy.disallow) : '',
        policy.allow ? policyMap.allow(policy.allow) : '',
        policy.crawlDelay ? policyMap.crawlDelay(policy.crawlDelay) : '',
      ].join('')

      return index === 0 ? content : `${acc}${NEW_LINE}${content}`
    }, '')
}

export const composeContent = (
  comment?: string | string[],
  userAgentRules?: Array<{
    userAgent: string
    disallow?: string | string[]
    allow?: string | string[]
    crawlDelay?: number
  }>,
  host?: string,
  sitemap?: string,
): string => {
  const sections = [
    comment ? policyMap.comment(comment) : '',
    userAgentRules ? buildUserAgentPolicies(userAgentRules) : '',
    host ? policyMap.host(host) : '',
    sitemap ? policyMap.sitemap(sitemap) : '',
  ]
    .filter(Boolean)
    .join(NEW_LINE)

  return sections
}

const createBuildResult = (
  content: string,
  filePath: string,
): RobotsBuildResult =>
  Object.freeze({
    content,
    filePath,
    fileName: DEFAULT_FILE_NAME,
  })

const buildResult = {
  object: (config: RobotsConfig): BuildResult => {
    if (Object.keys(config).length === 0) {
      return {
        type: 'ERROR',
        error: {
          code: 'EMPTY_CONFIG',
          message: 'Empty config',
        },
      }
    }

    const { comment, policy, host, sitemap } = config
    const content = composeContent(comment, policy, host, sitemap)
    const result = createBuildResult(content, DEFAULT_FILE_PATH)

    return {
      type: 'SUCCESS',
      ...result,
    }
  },

  boolean: (config: boolean): BuildResult => {
    if (!config) {
      return {
        type: 'ERROR',
        error: {
          code: 'DISABLED',
          message: 'Robots is disabled',
        },
      }
    }

    const content = composeContent(undefined, [
      { userAgent: '*', allow: ['/'] },
    ])
    const result = createBuildResult(content, DEFAULT_FILE_PATH)

    return {
      type: 'SUCCESS',
      ...result,
    }
  },
}

export const buildRobots = (config: RobotsConfig | boolean): BuildResult => {
  if (typeof config === 'object' && config !== null) {
    return buildResult.object(config)
  }

  return buildResult.boolean(config)
}
