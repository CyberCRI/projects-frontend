import path from 'node:path'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { exit } from 'node:process'

const directoryPath = path.join(path.dirname(import.meta.dirname), '/src/i18n/locales')
let ALL_LOCALES = []
try {
  const files = fs.readdirSync(directoryPath)
  ALL_LOCALES = files.reduce((acc, file) => {
    const code = file.replace(/\.json$/, '')
    acc.push({ code, file: file })
    return acc
  }, [])
} catch (err) {
  console.error('Error listing tranlation files :', err)
}

const diffLocal = (obj1, obj2) => {
  let result = new Set()
  const diffRecusr = (key, o1, o2) => {
    return new Set([...diffLocal(o1, o2)].map((k) => `${key}.${k}`))
  }

  Object.keys(obj1).forEach((key) => {
    if (typeof obj1[key] === 'object') {
      result = new Set([...result, ...diffRecusr(key, obj1[key], obj2[key] ?? {})])
    } else if (!['object', 'number', 'string'].includes(typeof obj1[key])) {
      console.error(typeof obj1[key])
    } else if (!(key in obj2)) {
      result.add(key)
    }
  })

  return result
}

const readJson = (filename) => {
  return JSON.parse(fs.readFileSync(path.join(directoryPath, filename), 'utf8'))
}

const writeJson = (filename, content) => {
  fs.writeFileSync(filename, JSON.stringify(content, null, 2), 'utf8')
}

// content of files
const filesContent = {}
ALL_LOCALES.forEach((local) => {
  filesContent[local.code] = readJson(local.file)
})

const getValue = (content, key) => {
  let actual = content
  const keys = key.split('.')
  for (const k of keys) {
    if (!(k in actual)) {
      return
    }
    actual = actual[k]
  }
  return actual
}

const newFileContent = JSON.parse(JSON.stringify(filesContent))
const setValue = (content, key, value) => {
  let actual = content
  const keys = key.split('.')
  for (const k of keys.slice(0, keys.length - 1)) {
    if (!(k in actual)) {
      actual[k] = {}
    }
    actual = actual[k]
  }
  actual[keys.at(-1)] = value
}

// check and set diff
const missing = {}
const setDiff = (local, diff) => {
  if (!diff.size) {
    return
  }
  if (!missing[local.code]) {
    missing[local.code] = new Set()
  }
  missing[local.code] = new Set([...missing[local.code], ...diff])
}

let index = 0
for (const local of ALL_LOCALES) {
  index += 1
  const actualLocalContent = filesContent[local.code]
  ALL_LOCALES.slice(index).forEach((sublocal) => {
    const sublocalContent = filesContent[sublocal.code]
    const diffAcutal = diffLocal(actualLocalContent, sublocalContent)
    const diffSubAcutal = diffLocal(sublocalContent, actualLocalContent)
    // generate diff from both directions
    setDiff(sublocal, diffAcutal)
    setDiff(local, diffSubAcutal)
  })
}

const getBestValue = (key) => {
  const result = {}
  ALL_LOCALES.forEach((local) => {
    const value = getValue(filesContent[local.code], key)
    if (value !== undefined) {
      result[local.code] = value
    }
  })
  if (Object.keys(result).length === 0) {
    throw new Error(`can't translate ${key}, none of any languages are set`)
  }
  if (result.en) {
    return ['en', result.en]
  } else if (result.fr) {
    return ['fr', result.fr]
  } else {
    return Object.entries(result)[0]
  }
}

const needToTranslate = {}
Object.entries(missing).forEach(([code, diffs]) => {
  ;[...diffs].forEach((key) => {
    if (!(key in needToTranslate)) {
      needToTranslate[key] = {
        to: [],
      }
      const [lang, value] = getBestValue(key)
      needToTranslate[key].from = lang
      needToTranslate[key].value = value
    }
    needToTranslate[key].to.push(code)
  })
})

if (Object.keys(needToTranslate).length === 0) {
  console.log('all key are translated...')
  exit(0)
}

const toShow = JSON.parse(JSON.stringify(needToTranslate))
Object.values(toShow).forEach((e) => (e.to = e.to.join(' / ')))
console.table(toShow, ['from', 'to'])

const output = spawnSync(`${import.meta.dirname}/translate/run.sh`, [
  JSON.stringify(needToTranslate),
])

if (output.status) {
  console.log(output)
  exit(1)
}
const translated = JSON.parse(output.stdout)

const ignored = translated.__INGORED__
delete translated.__INGORED__
Object.entries(translated).forEach(([k, trad]) => {
  Object.entries(trad).forEach(([code, value]) => {
    setValue(newFileContent[code], k, value)
  })
})

ALL_LOCALES.forEach(({ code, file }) => {
  writeJson(path.join(directoryPath, file), newFileContent[code])
})

Object.entries(ignored).forEach(([from, to]) => {
  console.log(`ingored lang from ${from}: ${to}`)
})
console.log('saved...')
