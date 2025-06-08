import type { RobotsOptions } from './shared/types'
import { makeBuildResult } from './shared/utils'
import type { BuildResult } from './types'

const NEW_LINE = '\n' as const

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

/**
 * TODO: переписать на функцию, чтобы избежать непредвиденных багов
 */
const policyMap = {
  comment: (rule: string | string[]) => addLine('#', rule),
  userAgent: (rule: string) => addLine('User-agent', rule),
  disallow: (rule: string | string[]) => addLine('Disallow', rule),
  allow: (rule: string | string[]) => addLine('Allow', rule),
  crawlDelay: (rule: number) => addLine('Crawl-delay', rule),
  sitemap: (rule: string | string[]) => addLine('Sitemap', rule),
  host: (rule: string) => addLine('Host', rule),
} as const

const buildUserAgentPolicies = (
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

const composeContent = (config: Omit<RobotsOptions, 'path'>): string => {
  const sections = [
    config.comment ? policyMap.comment(config.comment) : '',
    config.policy ? buildUserAgentPolicies(config.policy) : '',
    config.host ? policyMap.host(config.host) : '',
    config.sitemap ? policyMap.sitemap(config.sitemap) : '',
  ]
    .filter(Boolean)
    .join(NEW_LINE)

  return sections
}

const buildResult = {
  object: (
    config: RobotsOptions,
    defaultPath: string,
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

    const { comment, policy, host, sitemap, path } = config
    const content = composeContent({ comment, policy, host, sitemap })
    const result = makeBuildResult(content, path ?? defaultPath, fileName)

    return {
      type: 'SUCCESS',
      ...result,
    }
  },

  boolean: (
    config: boolean,
    defaultPath: string,
    fileName: string,
  ): BuildResult => {
    if (!config) {
      return {
        type: 'ERROR',
        error: {
          code: 'DISABLED',
          message: 'Robots is disabled',
        },
      }
    }

    const content = composeContent({
      policy: [{ userAgent: '*', allow: ['/'] }],
    })
    const result = makeBuildResult(content, defaultPath, fileName)

    return {
      type: 'SUCCESS',
      ...result,
    }
  },
}

export const buildRobots = (config: RobotsOptions | boolean): BuildResult => {
  const fileName = 'robots.txt'
  const defaultPath = 'public'

  if (typeof config === 'object' && config !== null) {
    return buildResult.object(config, defaultPath, fileName)
  }

  return buildResult.boolean(config, defaultPath, fileName)
}
