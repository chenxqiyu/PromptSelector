import { readFileSync } from 'node:fs'
import { exec } from 'node:child_process'
import { promptConfig } from '../config/promptConfig'

export default defineEventHandler(async () => {
  try {
    const results: Record<string, any> = {}

    for (const [key, item] of Object.entries(promptConfig)) {
      try {
        const jsonFilePath = item.source
        let jsonContent = readFileSync(jsonFilePath, 'utf-8')

        jsonContent = jsonContent
          .replace(/,\s*([\]}])/g, '$1')

        const data = JSON.parse(jsonContent)
        if (item.field) {
          results[key] = data[item.field]
        } else {
          for (const [nestedKey, nestedValue] of Object.entries(data)) {
            results[nestedKey] = nestedValue
          }
        }
      } catch (error) {
        console.error(`Error reading ${key}: ${error}`)
        results[key] = null
      }
    }

    const files = await new Promise<string[]>((resolve) => {
      exec(
        'pwsh -Command "chcp 65001 | Out-Null; ls * | % { $_.Name }"',
        { cwd: 'C:\\Users\\Administrator\\Desktop', encoding: 'utf8' },
        (error, stdout) => {
          if (error) {
            resolve([])
          } else {
            const lines = stdout.trim().split('\n').filter(line => line.trim())
            resolve(lines)
          }
        }
      )
    })

    return {
      message: 'Successfully read JSON file',
      data: results,
      files: files,
      timestamp: new Date().toISOString(),
      status: 'success'
    }
  } catch (error) {
    return {
      message: 'Failed to read JSON file',
      error: String(error),
      timestamp: new Date().toISOString(),
      status: 'error'
    }
  }
})
