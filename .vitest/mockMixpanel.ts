import Mixpanel from 'mixpanel-browser'
import { vi } from 'vitest'
// fix unhnadled rejection due to invalid url
vi.mock('mixpanel-browser', async (importOriginal) => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    default: {
      init: vi.fn(),
      track: vi.fn(),
      identify: vi.fn(),
      people: {
        set: vi.fn(),
        set_once: vi.fn(),
      },
    },
  }
})
