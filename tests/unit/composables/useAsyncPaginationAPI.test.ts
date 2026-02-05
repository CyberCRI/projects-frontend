import { describe, it, expect, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import useAsyncPaginationAPI from '@/composables/useAsyncPaginationAPI'
import flushPromises from 'flush-promises'

// all other tests is on "useAsyncAPI"
describe('useAsyncPaginationAPI composable', () => {
  it('default', async () => {
    const { pagination, data } = useAsyncPaginationAPI('default', async ({ config }) => {
      return {
        count: 66,
        current_page: 2,
        results: [config.query],
      }
    })

    expect(data.value).toBeNull()
    await flushPromises()

    expect(data.value).toBe

    expect(isLoading.value).toBe(false)
    expect(data.value).toBe('data')
  })
})
