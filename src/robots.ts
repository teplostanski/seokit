import { writeFile, mkdir } from 'fs/promises'
import { dirname, join, resolve } from 'node:path'
import { loadConfig } from './config'
import { buildRobots } from './api'

export const createRobots = async (): Promise<void> => {
  const config = await loadConfig()

  if (!config.robots) return

  const result = buildRobots(config.robots)

  if (result.type === 'ERROR') {
    console.error(`Failed to create robots.txt: ${result.error.message}`)
    return
  }

  try {
    const { content, filePath, fileName } = result
    const targetPath = resolve(process.cwd(), join(filePath, fileName))

    await mkdir(dirname(targetPath), { recursive: true })
    await writeFile(targetPath, content)
    console.log(`Created ${fileName} in /${filePath} \n\n${content}`)
  } catch (error: unknown) {
    console.error('Failed to create robots.txt:', error)
    process.exit(1)
  }
}
