import path from 'node:path'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { exit } from 'node:process'

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

// method to check all differance keys (nested key separate from dot)
const diffLocal = (obj1, obj2) => {
  let missing = new Set()
  let empty = new Set()
  const diffRecusr = (key, o1, o2) => {
    const [subMissing, subEmpty] = diffLocal(o1, o2)
    return [
      new Set([...subMissing].map((k) => `${key}.${k}`)),
      new Set([...subEmpty].map((k) => `${key}.${k}`)),
    ]
  }

  Object.keys(obj1).forEach((key) => {
    if (typeof obj1[key] === 'object') {
      const [subMissing, subEmpty] = diffRecusr(key, obj1[key], obj2[key] ?? {})
      missing = new Set([...missing, ...subMissing])
      empty = new Set([...empty, ...subEmpty])
    } else if (!['object', 'number', 'string'].includes(typeof obj1[key])) {
      console.error(typeof obj1[key])
    } else if (!(key in obj2)) {
      missing.add(key)
    } else if (
      typeof obj1[key] === 'string' &&
      typeof obj2[key] === 'string' &&
      obj2[key].trim() === ''
    ) {
      empty.add(key)
    }
  })

  return [missing, empty]
}

// pass the content, and a key like `profile.user.publications`
// and return the value
const getKeyValue = (content, key) => {
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

/*
    object of missing keys,
    like: {
        'en': ['user.profile', 'common.error', ...],
        'fr': ['error.msg', ...],
    }
*/
const missing = {}
const empty = {}
// check and set diff
const setDiff = (local, diff) => {
  if (!diff.size) {
    return
  }
  if (!missing[local.code]) {
    missing[local.code] = new Set()
  }
  missing[local.code] = new Set([...missing[local.code], ...diff])
}
const setEmpty = (local, diff) => {
  if (!diff.size) {
    return
  }
  if (!empty[local.code]) {
    empty[local.code] = new Set()
  }
  empty[local.code] = new Set([...empty[local.code], ...diff])
}

// iter on every languages and comparer of every local
// like diff('en', 'fr'),diff('en', 'cat'), diff('en', 'it') ...ect
const LOCAL_ARRAY = [...Object.values(ALL_LOCALES)]
LOCAL_ARRAY.forEach((local, index) => {
  LOCAL_ARRAY.slice(index).forEach((sublocal) => {
    // generate diff from both directions from 'en' => 'fr' and 'fr' => 'en'
    const [diffActual, emptyActual] = diffLocal(local.content, sublocal.content)
    const [diffSubActual, emptySubActual] = diffLocal(sublocal.content, local.content)
    setDiff(sublocal, diffActual)
    setDiff(local, diffSubActual)
    setEmpty(sublocal, emptyActual)
    setEmpty(local, emptySubActual)
  })
})

// return best text results
// we need to translate key 'user.profile.presentation'
// we get alls local for this key, and return 'en' or 'fr' or first occurence
const getBestValue = (key) => {
  const result = {}
  LOCAL_ARRAY.forEach((local) => {
    const value = getKeyValue(local.content, key)
    if (value != undefined) {
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

/*
    create object to all key need to translate to each languages
    like: {
        'user.profile.description': {
            'value': 'description',
            'from': 'fr',
            'to': ['en', 'cat', 'it']
        }
        ...
    }
*/
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

if (Object.keys(empty).length !== 0) {
  // only to show results
  // const toShow =
  console.log('Empty keys: ')
  Object.keys(empty).forEach((k) => (empty[k] = { empty: [...empty[k]] }))
  console.table(empty)
}

// no need to translate
if (Object.keys(needToTranslate).length === 0) {
  console.log('all keys are translated...')
  exit(0)
}

// only to show results
const toShow = JSON.parse(JSON.stringify(needToTranslate))
Object.values(toShow).forEach((e) => (e.to = e.to.join(' / ')))
console.table(toShow, ['from', 'to'])

// call python script to translate
console.log('\ncall python script (can be slower the first time (need to install python pkgs))...')
const output = spawnSync(`${import.meta.dirname}/translate/run.sh`, [
  JSON.stringify(needToTranslate),
])

if (output.status) {
  console.log(output)
  exit(1)
}
const translated = JSON.parse(output.stdout)

// get keys ignored (can't translate it)
const ignored = translated.__INGORED__
delete translated.__INGORED__

// set new the updated value to locales
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

// assign new translate to new values
Object.entries(translated).forEach(([k, trad]) => {
  Object.entries(trad).forEach(([code, value]) => {
    setValue(ALL_LOCALES[code].content, k, value)
  })
})

// save it
Object.values(ALL_LOCALES).forEach(({ file, content }) => {
  writeJson(path.join(directoryPath, file), content)
})

Object.entries(ignored).forEach(([from, to]) => {
  console.log(`ingored lang from ${from}: ${to}`)
})
console.log('saved...')
