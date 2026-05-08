import { readFileSync, writeFileSync } from 'node:fs'
import { promptConfig } from '../config/promptConfig'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { category, label, value } = body

    if (!category || !label || !value) {
      return {
        message: 'Missing required parameters',
        status: 'error'
      }
    }

    let categoryConfig = promptConfig[category]

    if (!categoryConfig) {
      for (const [configKey, configItem] of Object.entries(promptConfig)) {
        if (!configItem.field) {
          const jsonFilePath = configItem.source
          let jsonContent = readFileSync(jsonFilePath, 'utf-8')
          jsonContent = jsonContent.replace(/,\s*([\]}])/g, '$1')
          const data = JSON.parse(jsonContent)
          
          if (data[category] !== undefined) {
            categoryConfig = {
              source: jsonFilePath,
              field: category
            }
            break
          }
        }
      }
    }

    if (!categoryConfig) {
      return {
        message: `Category "${category}" not found in config`,
        status: 'error'
      }
    }

    const jsonFilePath = categoryConfig.source
    
    let jsonContent = readFileSync(jsonFilePath, 'utf-8')
    jsonContent = jsonContent.replace(/,\s*([\]}])/g, '$1')
    const data = JSON.parse(jsonContent)

    if (categoryConfig.field) {
      if (!data[categoryConfig.field]) {
        data[categoryConfig.field] = {}
      }
      data[categoryConfig.field][label] = value
    } else {
      data[label] = value
    }

    writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8')

    return {
      message: 'Prompt saved successfully',
      category,
      label,
      value,
      status: 'success'
    }

  } catch (error) {
    console.error('Error saving prompt:', error)
    return {
      message: 'Failed to save prompt',
      error: String(error),
      status: 'error'
    }
  }
})
