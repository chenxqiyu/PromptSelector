export default defineEventHandler((event) => {
  const countries = [
    { label: 'France', value: 'FR', icon: 'i-lucide-map-pin' },
    { label: 'Germany', value: 'DE', icon: 'i-lucide-map-pin' },
    { label: 'Italy', value: 'IT', icon: 'i-lucide-map-pin' },
    { label: 'Spain', value: 'ES', icon: 'i-lucide-map-pin' },
    { label: 'Netherlands', value: 'NL', icon: 'i-lucide-map-pin' }
  ]
  
  return {
    data: countries,
    count: countries.length,
    timestamp: new Date().toISOString()
  }
})
