import { flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('useLoadingFromStatus', () => {
  it('isLoading', async () => {
    const status = ref('success')
    const isLoading = useLoadingFromStatus(status)
    await flushPromises()
    expect(isLoading.value).toBe(false)

    status.value = 'error'
    await flushPromises()
    expect(isLoading.value).toBe(false)

    status.value = 'pending'
    await flushPromises()
    expect(isLoading.value).toBe(true)

    status.value = 'idle'
    await flushPromises()
    expect(isLoading.value).toBe(true)
  })
})
