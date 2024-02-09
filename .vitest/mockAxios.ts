import { axios, configFormData } from '../src/api/api.config'
import { vi } from 'vitest'
// fix unhnadled rejection due to invalid url
vi.mock('@/api/api.config', () => {
    return {
        axios: {
            get: vi.fn().mockResolvedValue({ data: { results: [] } }),
        },
    }
})
