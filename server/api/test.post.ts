export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  return {
    message: 'Data received successfully',
    receivedData: body,
    timestamp: new Date().toISOString(),
    status: 'success'
  }
})
