const fs = require('fs')

const sourceFile = 'F:\\down\\player6\\明星.txt'
const targetFile = 'F:\\core\\tishici\\comfyui-sixgod_prompt-main\\json\\国外明星1003.json'

try {
  const content = fs.readFileSync(sourceFile, 'utf8')
  const lines = content.trim().split('\n')

  console.log(`共读取 ${lines.length} 行`)

  const result = {}

  lines.forEach((line, index) => {
    console.log(line)
    // var str = (line.split('，')[0] + "")
    var str = (line.split(' - ')[0] + "")
    var str1 = (line.split(' - ')[1] + "")

    var match = str.split('.')
    if (match) {
      const name = str1.trim()
      const value = match[1].trim()
      result[name] = value
      console.log(`第 ${index + 1} 行: ${name} -> ${value}`)
    } else {
      console.log(`第 ${index + 1} 行未匹配: ${line}`)
    }
  })

  fs.writeFileSync(targetFile, JSON.stringify(result, null, 2), 'utf8')

  console.log(`\n转换成功！共转换 ${Object.keys(result).length} 条数据`)
  console.log(`文件已保存到: ${targetFile}`)
} catch (error) {
  console.error('转换失败:', error)
}