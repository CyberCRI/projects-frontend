const INTERVAL = Object.freeze({
  hour: 1_000 * 3600,
  minute: 1_000 * 60,
  second: 1_000,
})

/**
 * create interval loop to return date now
 *
 * @function
 * @name useIntervalNow
 * @kind variable
 * @param {"hour" | "minute" | "second"} interval
 * @returns {globalThis.Ref<Date, Date>}
 * @exports
 */
export const useIntervalNow = (interval: keyof typeof INTERVAL) => {
  const now = ref<Date>(new Date())
  let intervalResult, timeoutResult

  const intervalTime = INTERVAL[interval]

  const getInitialWaitTime = (): number => {
    const subNow = new Date()
    switch (interval) {
      case 'hour':
        return (3600 - subNow.getMinutes() * 60 - subNow.getSeconds()) * 1_000
      case 'minute':
        return (60 - subNow.getSeconds()) * 1_000
      case 'second':
        return 1_000 - subNow.getMilliseconds()
    }
  }

  onMounted(() => {
    const padding = getInitialWaitTime()
    timeoutResult = setTimeout(() => {
      now.value = new Date()
      intervalResult = setInterval(() => {
        now.value = new Date()
      }, intervalTime + 1_000)
    }, padding)
  })

  onUnmounted(() => {
    clearTimeout(timeoutResult)
    clearInterval(intervalResult)
  })

  return now
}
