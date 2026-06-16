import { safeParseInt } from '@/functs/string'

const runtimeConfig = useRuntimeConfig()
const { appAgentMemorySlidingWindowSize } = runtimeConfig

let _contextWindowSize = safeParseInt(appAgentMemorySlidingWindowSize)
if (_contextWindowSize < 0) _contextWindowSize *= -1 // ensure always positive
const contextWindowSize = _contextWindowSize

export default contextWindowSize
