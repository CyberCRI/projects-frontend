import { describe, it, expect } from 'vitest'
import { computed } from 'vue'
import useAsyncPaginationAPI from '@/composables/useAsyncPaginationAPI'
import flushPromises from 'flush-promises'

// all other tests is on "useAsyncAPI"

describe('useAsyncPaginationAPI composable', () => {
  it('default', async () => {
    const { pagination, data } = useAsyncPaginationAPI(
      'default',
      async ({ config }) => {
        return {
          count: 66,
          current_page: config.query.offset / config.query.limit + 1,
          results: [config.query],
        }
      },
      {
        paginationConfig: {
          limit: 7,
        },
      }
    )

    await flushPromises()
    expect(data.value).toStrictEqual([
      {
        limit: 7,
        offset: 0, // current page 1
      },
    ])

    pagination.next()
    await flushPromises()

    expect(data.value).toStrictEqual([
      {
        limit: 7,
        offset: 7, // current page 2
      },
    ])
  })

  it('translate', async () => {
    const translate = (results) => {
      return computed(() => `${results.value[0]}--translate`)
    }

    const { pagination, data } = useAsyncPaginationAPI(
      'translate',
      async ({ config }) => {
        return {
          count: 66,
          current_page: config.query.offset / config.query.limit + 1,
          results: [`result:${config.query.offset}:${config.query.limit}`],
        }
      },
      {
        translate,
        paginationConfig: {
          limit: 7,
        },
      }
    )

    await flushPromises()
    expect(data.value).toEqual(`result:0:7--translate`)

    pagination.next()
    await flushPromises()

    expect(data.value).toEqual(`result:7:7--translate`)
  })
})
