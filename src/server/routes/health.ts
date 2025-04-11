export default defineEventHandler((event) => {
  let healthcheck

  try {
    healthcheck = {
      uptime: process.uptime(),
      responsetime: process.hrtime(),
      message: `OK`,
      timestamp: Date.now(),
    }
  } catch (error) {
    healthcheck = { message: error?.message || error }
    setResponseStatus(event, 503)
  }

  return healthcheck
})
