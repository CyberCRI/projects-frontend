import useAPI from '../src/composables/useAPI'
import { vi } from 'vitest'
// fix unhnadled rejection due to invalid url
vi.mock('../src/composables/useAPI', () => {
    return {
        useAPI: vi.fn().mockResolvedValue({ data: { results: [] } }),
    }
})
