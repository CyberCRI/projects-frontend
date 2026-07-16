import { flushPromises } from '@vue/test-utils'

export const flushTick = async (loop: number = 1) => {
  let start = 0
  for (; start < loop; start += 1) {
    await nextTick()
    await flushPromises()
  }
}
