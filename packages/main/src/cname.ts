import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { loadConfig } from './config'
import { buildCNAME } from '../../api/src'

export async function createCNAME(): Promise<void> {
  const config = await loadConfig()
  if (!config.cname) return

  try {
    const result = buildCNAME(config.cname, 'public', config.hostname)

    if (result.type === 'ERROR') {
      console.error(result.error.message)
      process.exit(1)
    }

    const { content, filePath, fileName } = result
    const targetPath = resolve(process.cwd(), join(filePath || '', fileName))
    await mkdir(dirname(targetPath), { recursive: true })
    await writeFile(targetPath, content)
    console.log(`Created ${fileName} in /${filePath} \n\n${content}`)
  } catch (error: unknown) {
    console.error(error)
    process.exit(1)
  }
}
