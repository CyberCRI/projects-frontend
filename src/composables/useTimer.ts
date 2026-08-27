type ReturnInterval = ReturnType<typeof setInterval>

export const useInterval = (fn: () => unknown, delay: number) => {
  const intervalCounter = ref<ReturnInterval | null>(null)

  onMounted(() => {
    clearInterval(intervalCounter.value)
    intervalCounter.value = setInterval(fn, delay)
  })

  onUnmounted(() => {
    clearInterval(intervalCounter.value)
  })
}

type ReturnTimeout = ReturnType<typeof setTimeout>
export const useTimeout = (fn: () => unknown, delay: number) => {
  const timeoutCounter = ref<ReturnTimeout | null>(null)

  onMounted(() => {
    clearTimeout(timeoutCounter.value)
    timeoutCounter.value = setTimeout(fn, delay)
  })

  onUnmounted(() => {
    clearTimeout(timeoutCounter.value)
  })
}
