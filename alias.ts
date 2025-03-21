import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

// from https://github.com/nuxt/nuxt/discussions/15908

const r = (p: string) => resolve(__dirname, p)

const filename = fileURLToPath(import.meta.url)
const pathSegments = path.dirname(filename)

export const alias: Record<string, string> = {
  // nuxt aliases
  '~~': r('.'),
  '~~/': r('./'),
  '@@': r('.'),
  '@@/': r('./'),
  // project aliases
  '@': path.resolve(pathSegments, './src'),
  '~': path.resolve(pathSegments, './node_modules'),
}
