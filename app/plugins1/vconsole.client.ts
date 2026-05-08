import VConsole from 'vconsole'

export default defineNuxtPlugin(() => {
  console.log('vconsole plugin loaded, NODE_ENV:', process.env.NODE_ENV)
  
  const vConsole = new VConsole({
    defaultPlugins: ['system', 'network', 'element', 'storage', 'console']
  })
  
  console.log('vconsole initialized:', vConsole)
  
  return {
    provide: {
      vConsole
    }
  }
})
