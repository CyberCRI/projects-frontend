import { describe, it, expect } from 'vitest'
import { usePagination, PaginationResult } from '@/composables/usePagination'

describe('usePagination', () => {
  it('methods', async () => {
    const results = ref<PaginationResult>({
      count: 10,
      total_page: 20,
      current_page: 1,
      results: Array.from(Array(10)),
    })
    const { current, setPage, total, count, prev, canPrev, next, canNext, first, last, query } =
      usePagination(results, { limit: 10 })

    expect(current.value).toEqual(1)
    expect(count.value).toEqual(10)
    expect(total.value).toEqual(20)
    expect(query()).toEqual({ limit: 10, offset: 0 })

    expect(canNext.value).toEqual(true)
    expect(canPrev.value).toEqual(false)

    expect(next()).toEqual(true)
    expect(current.value).toEqual(2)
    expect(canNext.value).toEqual(true)
    expect(canPrev.value).toEqual(true)
    expect(query()).toEqual({ limit: 10, offset: 10 })

    expect(last()).toEqual(true)
    expect(current.value).toEqual(20)
    expect(canNext.value).toEqual(false)
    expect(canPrev.value).toEqual(true)
    expect(query()).toEqual({ limit: 10, offset: 190 })

    expect(prev()).toEqual(true)
    expect(current.value).toEqual(19)
    expect(canNext.value).toEqual(true)
    expect(canPrev.value).toEqual(true)
    expect(query()).toEqual({ limit: 10, offset: 180 })

    expect(first()).toEqual(true)
    expect(current.value).toEqual(1)
    expect(canNext.value).toEqual(true)
    expect(canPrev.value).toEqual(false)
    expect(query()).toEqual({ limit: 10, offset: 0 })

    // already on first page, so return is false
    expect(first()).toEqual(false)
    expect(setPage(1)).toEqual(false)
    expect(query()).toEqual({ limit: 10, offset: 0 })
  })
})
