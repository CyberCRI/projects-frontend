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
  let intervalResult

  const intervalTime = INTERVAL[interval]

  onMounted(() => {
    intervalResult = setInterval(() => {
      now.value = new Date()
    }, intervalTime)
  })

  onUnmounted(() => {
    clearInterval(intervalResult)
  })

  return now
}
