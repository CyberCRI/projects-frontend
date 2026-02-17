import { describe, it, expect } from 'vitest'
import { ref, computed } from 'vue'
import useAsyncAPI from '@/composables/useAsyncAPI'
import flushPromises from 'flush-promises'

describe('useAsyncAPI composable', () => {
  it('default', async () => {
    const { isLoading, data } = useAsyncAPI('default', async () => 'data')

    expect(isLoading.value).toBe(true)
    await flushPromises()

    expect(isLoading.value).toBe(false)
    expect(data.value).toBe('data')
  })

  it('watch query', async () => {
    const query = ref({ page: 0 })

    const { data } = useAsyncAPI(
      'watch query',
      async ({ config }) => {
        return `data-${config.query.page}`
      },
      { query }
    )

    await flushPromises()
    expect(data.value).toBe('data-0')

    query.value = { page: 666 }
    await flushPromises()
    expect(data.value).toBe('data-666')
  })

  it('watch with undefined', async () => {
    const query = ref(null)

    const { data } = useAsyncAPI(
      'watch with undefined',
      async ({ config }) => {
        return `data-${config.query.page}`
      },
      { query }
    )

    await flushPromises()
    // query is null we dont run async function
    expect(data.value).toBeNull()

    query.value = { page: 666 }
    await flushPromises()
    expect(data.value).toBe('data-666')
  })

  it('watch with multiple undefined', async () => {
    const query = ref(null)
    const groupId = ref(undefined)

    const { data } = useAsyncAPI(
      'watch with multiple undefined',
      async ({ config }) => {
        console.log('test3')
        return `data-${config.query.page}`
      },
      { query, watch: [groupId] }
    )

    await flushPromises()
    // query is null we dont run async function
    expect(data.value).toBeNull()

    query.value = { page: 666 }
    await flushPromises()
    expect(data.value).toBeNull()

    groupId.value = '55'
    await flushPromises()
    expect(data.value).toBe('data-666')
  })

  it('with translate', async () => {
    const translate = (result) => {
      return computed(() => `${result.value}--translate`)
    }

    const query = reactive({ page: 0 })
    const { data } = useAsyncAPI(
      'with translate',
      async ({ config }) => {
        return `data-${config.query.page}`
      },
      { query, translate }
    )

    expect(data.value).toBe('null--translate')

    await flushPromises()
    expect(data.value).toBe('data-0--translate')

    query.page = 666
    await flushPromises()
    expect(data.value).toBe('data-666--translate')
  })
})
