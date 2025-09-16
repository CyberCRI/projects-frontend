import fs from 'node:fs/promises'
import path from 'node:path'

/*
    script to find duplicates icons in IconImage components
    we grep v-if/v-else-if and get the name of icons
*/

const iconPath = `${path.dirname(import.meta.dirname)}/src/components/base/media/IconImage.vue`

const REGEX = /(v-(?:else-)?if="\s*name\s*===?\s*'.*?'\s*")/gi
const REGEX_ICON_NAME = /'.*?'/gi
const REGEX_QUOTES = /['"]/gi

fs.readFile(iconPath).then((buff) => {
  const value = buff.toString()
  const allIcons = []
  value.split(REGEX).forEach((el) => {
    // no a v-if value
    if (!el.startsWith('v-')) {
      return
    }
    const name = el.match(REGEX_ICON_NAME).toString().trim().replaceAll(REGEX_QUOTES, '')
    allIcons.push(name)
  })

  const exists = new Set()
  const duplicates = []
  allIcons.forEach((icon) => {
    if (exists.has(icon)) {
      duplicates.push(icon)
    } else {
      exists.add(icon)
    }
  })
  if (duplicates.length !== 0) {
    console.error(`❌ duplicate icons: ${duplicates}`)
  } else {
    console.info(`✅ no duplicate icons`)
  }
  console.log(`total icons: ${exists.size - duplicates.length}`)
})
