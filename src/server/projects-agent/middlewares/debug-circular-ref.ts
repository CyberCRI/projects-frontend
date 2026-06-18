import { createMiddleware } from 'langchain'

function findCircular(obj: any, path = '', seen = new WeakSet()): void {
  if (obj && typeof obj === 'object') {
    if (seen.has(obj)) {
      console.error('[DEBUG] Circular reference at:', path)
      return
    }
    seen.add(obj)
    for (const key of Object.keys(obj)) {
      findCircular(obj[key], `${path}.${key}`, seen)
    }
  }
}
const debugCircularRef = createMiddleware({
  name: 'DebugCircularRef',
  beforeModel: (state) => {
    console.log('[DEBUG] check circular ref')
    findCircular(state)
    return
  },
})

export default debugCircularRef
