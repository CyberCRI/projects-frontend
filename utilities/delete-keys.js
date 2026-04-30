import { argv } from 'node:process'
import path from 'node:path'
import fs from 'node:fs'

// dir for all locales
const directoryPath = path.join(path.dirname(import.meta.dirname), '/src/i18n/locales')

const readJson = (filename) => {
  return JSON.parse(fs.readFileSync(path.join(directoryPath, filename), 'utf8'))
}

const writeJson = (filename, content) => {
  fs.writeFileSync(filename, JSON.stringify(content, null, 2), 'utf8')
}

// list and generate info from locales (language code, content)
const ALL_LOCALES = {}
fs.readdirSync(directoryPath).map((file) => {
  const code = file.replace(/\.json$/, '')
  ALL_LOCALES[code] = {
    code,
    file,
    content: readJson(file),
  }
})

// slie 2 to remove "node" and "script file"
const needToRemoveKeys = argv.slice(2)

// pass the content, and a key like `profile.user.publications`
// and return the value
const removeKey = (content, key) => {
  let actual = content
  const keys = key.split('.')
  const lastKey = keys.at(-1)
  keys.slice()
  for (const k of keys.slice(0, -1)) {
    if (!(k in actual)) {
      return
    }
    actual = actual[k]
  }
  if (lastKey in actual) {
    delete actual[lastKey]
    return true
  }
  return false
}

const removed = {}

Object.values(ALL_LOCALES).forEach(({ content, code }) => {
  needToRemoveKeys.forEach((key) => {
    removed[key] ??= {}
    removed[key][code] = removeKey(content, key) ? '✅' : '❌'
  })
})
console.table(removed)

// save it
Object.values(ALL_LOCALES).forEach(({ file, content }) => {
  writeJson(path.join(directoryPath, file), content)
})

console.log('saved...')
