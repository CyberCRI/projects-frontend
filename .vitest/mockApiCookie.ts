import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/auth/cookie.service', function () {
    return {
        removeApiCookie: vi.fn(async function () {
            return await Promise.resolve({})
        }),
    }
})
