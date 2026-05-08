<template>
  <div class="p-6 space-y-6 pb-[20rem]" @contextmenu="handleRightClick">
    <h1 class="text-2xl font-bold">提示词选择器</h1>

    <UTabs v-model="selectedTab" :items="tabItems">
      <template #account>
        <div class="p-4 space-y-6">
          <UCard class="p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              </div>
              <div>
                <h3 class="font-bold text-lg">账号设置</h3>
                <p class="text-gray-500">管理您的个人信息</p>
              </div>
            </div>
            <div class="space-y-4">
              <UInput v-model="username" placeholder="用户名" />
              <UInput v-model="email" type="email" placeholder="邮箱地址" />
              <UButton>保存更改</UButton>
            </div>
          </UCard>
        </div>
      </template>

      <template #password>
        <div class="p-4 space-y-6">
          <UCard class="p-6">
            <h3 class="font-bold text-lg mb-4">修改密码</h3>
            <div class="space-y-4">
              <UInput v-model="oldPassword" type="password" placeholder="当前密码" />
              <UInput v-model="newPassword" type="password" placeholder="新密码" />
              <UInput v-model="confirmPassword" type="password" placeholder="确认新密码" />
              <UButton>更新密码</UButton>
            </div>
          </UCard>
        </div>
      </template>

      <template #api-test>
        <div class="p-4 space-y-6">
          <div class="flex gap-2">
            <UButton @click="testHelloApi" :loading="loading">
              测试 Hello API
            </UButton>
            <UButton @click="testCountriesApi" :loading="loading">
              测试 Countries API
            </UButton>
          </div>

          <UCard v-if="getResponse" class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-lg">API 响应数据</h3>
            </div>
            <pre
              class="text-sm overflow-y-auto max-h-96 bg-gray-50 p-4 rounded">{{ JSON.stringify(getResponse, null, 2) }}</pre>
          </UCard>
        </div>
      </template>

      <template #post-test>
        <div class="p-4 space-y-6">
          <UCard class="p-6">
            <h3 class="font-bold text-lg mb-4">POST 请求测试</h3>
            <div class="flex gap-2 mb-4">
              <UButton @click="testPostApi">发送 POST 请求</UButton>
            </div>
            <UCard v-if="postResponse" class="mt-4">
              <h4 class="font-semibold mb-2">POST 响应:</h4>
              <pre class="text-sm overflow-auto">{{ JSON.stringify(postResponse, null, 2) }}</pre>
            </UCard>
          </UCard>
        </div>
      </template>

      <template #about>
        <div class="p-4 space-y-6">
          <UCard class="p-6">
            <h3 class="font-bold text-lg mb-4">使用说明</h3>
            <p class="text-gray-500">修改promptConfig.ts中的source字段，指向您的提示词文件路径，可手动添加/删除提示词。</p>
          </UCard>
        </div>
      </template>
      <template #data-display>
        <div class="p-4 space-y-6">
          <div class="flex justify-center">
            <UButton @click="loadData" :loading="loading">
              加载数据
            </UButton>
          </div>

          <UCard v-if="apiData" class="p-6">
            <div class="mb-6">
              <h3 class="font-bold text-lg mb-4">总中文提示词</h3>
              <UTextarea :value="totalChinesePrompt" placeholder="中文提示词会在这里显示..."
                class="w-full min-h-[60px] max-h-[120px] overflow-y-auto mb-4" readonly />
              <h3 class="font-bold text-lg mb-4">总提示词</h3>
              <div class="flex items-center gap-4 mb-2">
                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="autoCopy" id="autoCopy" class="w-4 h-4 text-blue-600 rounded" />
                  <label for="autoCopy" class="text-sm text-gray-600">自动复制</label>
                </div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="autoSend" id="autoSend" class="w-4 h-4 text-blue-600 rounded" />
                  <label for="autoSend" class="text-sm text-gray-600">自动发送</label>
                </div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="manualSend" id="manualSend" class="w-4 h-4 text-blue-600 rounded" />
                  <label for="manualSend" class="text-sm text-gray-600">右键发送</label>
                </div>
              </div>
              <div class="flex gap-2">
                <UTextarea :value="totalPrompt" placeholder="点击下方提示词添加/取消选择..."
                  class="flex-1 min-h-[120px] max-h-[200px] overflow-y-auto" readonly />
                <div class="flex flex-col gap-2">
                  <UButton size="sm" @click="clearAll">清空全部</UButton>
                  <UButton size="sm" @click="copyPrompt" :disabled="!totalPrompt">复制提示词</UButton>
                  <UButton size="sm" @click="copyChinesePrompt" :disabled="!totalChinesePrompt">复制中文</UButton>
                </div>
              </div>
            </div>

            <h3 id="prompt-category-section" class="font-bold text-lg mb-4">提示词分类</h3>

            <div class="flex items-center gap-4 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">随机个数:</span>
                <UInput v-model="randomCount" type="number" min="1" max="20" class="w-24" placeholder="1" />
              </div>
              <UButton @click="randomPick" :disabled="selectedCategories.length === 0"
                class="bg-green-600 hover:bg-green-700">
                随机选择
              </UButton>
              <UButton @click="clearAllCategories" :disabled="selectedCategories.length === 0"
                class="bg-gray-500 hover:bg-gray-600">
                清空栏目选择
              </UButton>
            </div>

            <div class="space-y-6">
              <div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <UCard v-for="(items, category) in (apiData?.data || {})" :key="category" :id="`category-${category}`"
                    :class="[
                      'p-4 cursor-pointer transition-all',
                      selectedCategories.includes(category)
                        ? 'ring-2 ring-green-500 bg-green-50'
                        : 'hover:bg-gray-50'
                    ]" @click="toggleCategory(category)">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <input type="checkbox" :checked="multiSelectMode[category] === true"
                          @change="toggleMultiSelect(category)" @click.stop class="w-4 h-4 text-blue-600 rounded" />
                        <span class="text-sm text-gray-600">多选</span>
                        <span class="font-semibold">{{ category }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">{{ Object.keys(items).length }}
                          项</span>
                        <span :class="[
                          'text-xs px-2 py-1 rounded-full',
                          selectedCategories.includes(category)
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                        ]">
                          {{ selectedCategories.includes(category) ? '已选中' : '未选中' }}
                        </span>
                        <button
                          class="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                          @click.stop="clearCategory(category, items)">
                          清空
                        </button>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                      <span v-for="(value, name) in items" :key="`${category}-${name}`" :class="[
                        'px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors',
                        isSelected(category, name)
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                      ]" :title="value" @click.stop="togglePrompt(category, name)">
                        {{ name }}
                      </span>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200">
                      <div class="grid grid-cols-2 gap-2 mb-2">
                        <UInput v-model="newPromptLabels[category]" placeholder="标签名" class="text-sm" @click.stop />
                        <UInput v-model="newPromptValues[category]" placeholder="内容" class="text-sm" @click.stop />
                      </div>
                      <UButton size="sm" @click.stop="addPrompt(category)" class="w-full bg-gray-400 hover:bg-gray-500">
                        添加
                      </UButton>
                    </div>
                  </UCard>
                </div>
              </div>
              <!-- 
              <div v-if="apiData.files && apiData.files.length > 0">
                <h4 class="font-semibold mb-3">桌面文件列表</h4>
                <UListbox v-model="selectedFile" :items="fileItems" multiple placeholder="选择文件" class="w-full" />
              </div> -->
            </div>
          </UCard>
        </div>
      </template>
    </UTabs>

    <div class="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div class="space-y-3">
        <div>
          <div class="text-xs text-gray-500 mb-1">总中文提示词</div>
          <div class="text-sm text-gray-800 bg-gray-50 rounded p-2 max-h-24 overflow-y-auto">
            {{ totalChinesePrompt || '暂无' }}
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1">总提示词</div>
          <div class="text-sm text-gray-800 bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
            {{ totalPrompt || '暂无' }}
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-6 left-6 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 max-w-[200px]">
      <div class="space-y-2">
        <div class="text-xs text-gray-500 font-medium mb-1">栏目导航</div>
        <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
          <button v-for="(items, category) in (apiData?.data || {})" :key="category" @click="scrollToCategory(category)"
            @contextmenu.prevent="clearCategoryByNav(category, items)" :class="[
              'px-2 py-1 text-xs rounded-full transition-colors',
              (selectedCategories.includes(category) || hasSelectedPrompts(category))
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]">
            {{ category }}
          </button>
        </div>
        <div class="h-px bg-gray-200 my-1"></div>
        <UButton size="sm" @click="clearAll" :disabled="selectedPrompts.length === 0"
          class="w-full bg-red-500 hover:bg-red-600 text-xs">
          清空全部
        </UButton>
        <UButton size="sm" @click="clearAllCategories" :disabled="selectedCategories.length === 0"
          class="w-full bg-orange-500 hover:bg-orange-600 text-xs">
          清空栏目选择
        </UButton>
        <div class="h-px bg-gray-200 my-1"></div>
        <UButton size="sm" @click="scrollToTop" class="w-full bg-blue-500 hover:bg-blue-600 text-xs">
          🔝 顶部
        </UButton>
        <UButton size="sm" @click="scrollToMiddle" class="w-full bg-blue-500 hover:bg-blue-600 text-xs">
          ⬆️ 中间
        </UButton>
        <UButton size="sm" @click="scrollToBottom" class="w-full bg-blue-500 hover:bg-blue-600 text-xs">
          🔽 底部
        </UButton>
        <div class="h-px bg-gray-200 my-1"></div>
        <UButton size="sm" @click="sendManual" :disabled="!totalPrompt"
          class="w-full bg-purple-500 hover:bg-purple-600 text-xs">
          ✉️ 手动发送
        </UButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const username = ref('')
const email = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const selectedFile = ref<string[]>([])
const selectedPrompts = ref<string[]>([])
const selectedCategories = ref<string[]>([])
const randomCount = ref(1)
const newPromptLabels = ref<Record<string, string>>({})
const newPromptValues = ref<Record<string, string>>({})
const autoCopy = ref(true)
const autoSend = ref(false)
const manualSend = ref(false)
const multiSelectMode = ref<Record<string, boolean>>({})

const selectedTab = ref('data-display')
const loading = ref(false)
const getResponse = ref<any>(null)

let socket: WebSocket | null = null
let reconnectDelay = 1000
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

const initWebSocket = () => {
  if (socket) {
    socket.close()
  }

  socket = new WebSocket("ws://192.168.1.244:9998")

  socket.onopen = () => {
    console.log('connected', '已连接到服务器')
    reconnectDelay = 1000
  }

  socket.onclose = () => {
    console.log('disconnected', '已断开连接')
    socket = null

    if (autoSend.value) {
      scheduleReconnect()
    }
  }

  socket.onerror = (error) => {
    console.log('error', `错误: ${error}`)
    socket = null

    if (autoSend.value) {
      scheduleReconnect()
    }
  }

  socket.onmessage = (event) => {
    console.log(event.data)
    try {
      const message = JSON.parse(event.data)
      console.log(message.way)
      console.log(message.prompt)
    } catch (e) {
      console.error('解析消息失败:', e)
    }
  }
}

const scheduleReconnect = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
  }

  console.log(`尝试重新连接，延迟 ${reconnectDelay}ms`)

  reconnectTimer = setTimeout(() => {
    initWebSocket()
    reconnectDelay = Math.min(reconnectDelay * 2, 10000)
  }, reconnectDelay)
}

const sendPrompt = (prompt: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(prompt)
  } else if (autoSend.value) {
    console.log('WebSocket未连接，稍后发送')
  }
}

const handleRightClick = (event: MouseEvent) => {
  if (manualSend.value && totalPrompt.value) {
    event.preventDefault()

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      initWebSocket()

      const checkConnection = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          sendPrompt(totalPrompt.value)
          console.log('手动发送提示词:', totalPrompt.value)
        } else if (socket && socket.readyState === WebSocket.CONNECTING) {
          setTimeout(checkConnection, 100)
        }
      }
      checkConnection()
    } else {
      sendPrompt(totalPrompt.value)
      console.log('手动发送提示词:', totalPrompt.value)
    }
  }
}

watch(autoSend, (newVal) => {
  if (newVal) {
    reconnectDelay = 1000
    initWebSocket()
  } else {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (socket) {
      socket.close()
      socket = null
    }
  }
})
const postResponse = ref<any>(null)
const apiData = ref<any>(null)

var tabItems = [
  { label: '账号', slot: 'account' },
  { label: '密码', slot: 'password' },
  { label: 'GET测试', slot: 'api-test' },
  { label: 'POST测试', slot: 'post-test' },
  { label: '数据展示', slot: 'data-display' },
]
tabItems = [
  { label: '数据展示', slot: 'data-display' },
  { label: '关于', slot: 'about' },
]
const totalPrompt = computed(() => {
  if (!apiData.value?.data) return ''
  const prompts: string[] = []
  selectedPrompts.value.forEach(key => {
    const [category, name] = key.split('-', 2)
    if (apiData.value.data[category] && apiData.value.data[category][name]) {
      prompts.push(apiData.value.data[category][name])
    }
  })
  return prompts.join(', ')
})

const totalChinesePrompt = computed(() => {
  if (!apiData.value?.data) return ''
  const chineseNames: string[] = []
  selectedPrompts.value.forEach(key => {
    const [category, name] = key.split('-', 2)
    if (apiData.value.data[category] && apiData.value.data[category][name]) {
      chineseNames.push(name)
    }
  })
  return chineseNames.join(', ')
})

watch(totalPrompt, async (newVal) => {
  if (autoCopy.value && newVal) {
    try {
      await navigator.clipboard.writeText(newVal)
    } catch (err) {
      console.error('自动复制失败:', err)
    }
  }

  if (autoSend.value && newVal) {
    sendPrompt(newVal)
  }
})

const fileItems = computed(() => {
  if (!apiData.value?.files) return []
  return apiData.value.files.map((file: string) => ({
    label: file,
    value: file
  }))
})

const isSelected = (category: string, name: string) => {
  return selectedPrompts.value.includes(`${category}-${name}`)
}

const hasSelectedPrompts = (category: string) => {
  return selectedPrompts.value.some(key => key.startsWith(`${category}-`))
}

const toggleMultiSelect = (category: string) => {
  const currentMode = multiSelectMode.value[category] === true
  multiSelectMode.value[category] = !currentMode

  if (!multiSelectMode.value[category]) {
    selectedPrompts.value = selectedPrompts.value.filter(k => !k.startsWith(`${category}-`))
  }
}

const togglePrompt = (category: string, name: string) => {
  const key = `${category}-${name}`
  const index = selectedPrompts.value.indexOf(key)

  if (index > -1) {
    selectedPrompts.value.splice(index, 1)
  } else {
    if (multiSelectMode.value[category] !== true) {
      selectedPrompts.value = selectedPrompts.value.filter(k => !k.startsWith(`${category}-`))
    }
    selectedPrompts.value.push(key)
  }
}

const clearAll = () => {
  selectedPrompts.value = []
}

const clearCategory = (category: string, items: Record<string, string>) => {
  Object.keys(items).forEach(name => {
    const key = `${category}-${name}`
    const index = selectedPrompts.value.indexOf(key)
    if (index > -1) {
      selectedPrompts.value.splice(index, 1)
    }
  })
}

const clearCategoryByNav = (category: string, items: Record<string, string>) => {
  clearCategory(category, items)
  const catIndex = selectedCategories.value.indexOf(category)
  if (catIndex > -1) {
    selectedCategories.value.splice(catIndex, 1)
  }
}

const copyPrompt = async () => {
  try {
    await navigator.clipboard.writeText(totalPrompt.value)
    alert('提示词已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const copyChinesePrompt = async () => {
  try {
    await navigator.clipboard.writeText(totalChinesePrompt.value)
    alert('中文提示词已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const testHelloApi = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/hello')
    getResponse.value = data
    apiData.value = data
  } catch (error) {
    getResponse.value = { error: String(error) }
  }
  loading.value = false
}

const testCountriesApi = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/countries')
    getResponse.value = data
  } catch (error) {
    getResponse.value = { error: String(error) }
  }
  loading.value = false
}

const testPostApi = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/test', {
      method: 'POST',
      body: {
        message: 'Test data from frontend',
        timestamp: new Date().toISOString(),
        selectedFiles: selectedFile.value,
        prompt: totalPrompt.value
      }
    })
    postResponse.value = data
  } catch (error) {
    postResponse.value = { error: String(error) }
  }
  loading.value = false
}

const loadData = async () => {
  await testHelloApi()
}

const toggleCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category)
  }
}

const clearAllCategories = () => {
  selectedCategories.value = []
}

const scrollToTop = () => {
  const element = document.getElementById('prompt-category-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const scrollToMiddle = () => {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: totalHeight / 2, behavior: 'smooth' })
}

const scrollToBottom = () => {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
}

const scrollToCategory = (category: string) => {
  const element = document.getElementById(`category-${category}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const addPrompt = async (category: string) => {
  const label = newPromptLabels.value[category]
  const value = newPromptValues.value[category]

  if (!label || !value) {
    alert('请输入标签名和内容')
    return
  }

  if (!apiData.value?.data) {
    apiData.value = { data: {} }
  }

  if (!apiData.value.data[category]) {
    apiData.value.data[category] = {}
  }

  if (apiData.value.data[category][label]) {
    alert('该标签名已存在')
    return
  }

  try {
    const response = await $fetch('/api/save-prompt', {
      method: 'POST',
      body: {
        category,
        label,
        value
      }
    })

    if (response.status === 'success') {
      apiData.value.data[category][label] = value
      newPromptLabels.value[category] = ''
      newPromptValues.value[category] = ''
      alert('标签保存成功')
    } else {
      alert('保存失败: ' + response.message)
    }
  } catch (error) {
    console.error('保存标签失败:', error)
    alert('保存失败，请稍后重试')
  }
}

const sendManual = () => {
  if (!totalPrompt.value) return

  if (!socket || socket.readyState !== WebSocket.OPEN) {
    initWebSocket()

    const checkConnection = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        sendPrompt(totalPrompt.value)
        console.log('手动发送提示词:', totalPrompt.value)
        alert('提示词已发送')
      } else if (socket && socket.readyState === WebSocket.CONNECTING) {
        setTimeout(checkConnection, 100)
      }
    }

    setTimeout(checkConnection, 100)
  } else {
    sendPrompt(totalPrompt.value)
    console.log('手动发送提示词:', totalPrompt.value)
    // alert('提示词已发送')
  }
}

const randomPick = () => {
  if (selectedCategories.value.length === 0) return
  if (!apiData.value?.data) return

  const count = parseInt(randomCount.value.toString()) || 1
  const selected: string[] = []

  selectedCategories.value.forEach(category => {
    const items = apiData.value.data[category]
    if (items) {
      const categoryNames = Object.keys(items)
      if (categoryNames.length > 0) {
        const shuffled = categoryNames.sort(() => Math.random() - 0.5)
        const pickCount = Math.min(count, shuffled.length)
        selected.push(...shuffled.slice(0, pickCount).map(name => `${category}-${name}`))
      }
    }
  })

  selectedPrompts.value = selected
}
</script>
<style scoped>
@media (min-width: 1024px) {
  .fixed.bottom-6.right-6 {
    max-width: 25%;
  }

  .fixed.bottom-6.left-6 {
    max-width: 70%;
  }
}

@media (max-width: 640px) {
  .p-6 {
    padding: 1rem;
  }

  .space-y-6>*+* {
    margin-top: 0rem;
  }

  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .p-4 {
    padding: 0.75rem;
  }

  .gap-4 {
    gap: 0.75rem;
  }

  .gap-2 {
    gap: 0.5rem;
  }

  .w-24 {
    width: 5rem;
  }

  .min-h-\[120px\] {
    min-height: 80px;
  }

  .max-h-\[200px\] {
    max-height: 120px;
  }

  .max-h-\[64px\] {
    max-height: 48px;
  }

  .max-h-\[96px\] {
    max-height: 64px;
  }

  .fixed.bottom-6.right-6,
  .fixed.bottom-6.left-6 {
    position: fixed;
    left: 0;
    right: 0;
    max-width: none;
    border-radius: 0;
    border-left: none;
    border-right: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .fixed.bottom-6.right-6 {
    top: 0;
    bottom: auto;
    border-top: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .fixed.bottom-6.left-6 {
    top: auto;
    bottom: 0;
    border-bottom: none;
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .max-w-md {
    max-width: none;
  }

  .max-w-\[200px\] {
    max-width: none;
  }

  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  .flex-1 {
    flex: 1 1 100%;
  }

  .w-full {
    width: 100%;
  }

  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .px-3 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .py-1\.5 {
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
  }

  .h-12 {
    height: 2.5rem;
  }

  .w-12 {
    width: 2.5rem;
  }
}
</style>