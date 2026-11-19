export default function specialTagFilterFactory(tagName = 'evaluation') {
  const startTag = `<${tagName}>`
  const endTag = `</${tagName}>`

  let insideSpecialTag = false
  let buffer = ''

  return function filterSpecialTag(chunk: string) {
    let out = ''

    for (const char of chunk) {
      buffer += char

      const target = insideSpecialTag ? endTag : startTag

      // The buffer is still a possible prefix of the tag we seek.
      if (target.startsWith(buffer)) {
        // Full tag found: discard it and change mode.
        if (buffer === target) {
          buffer = ''
          insideSpecialTag = !insideSpecialTag
        }

        continue
      }

      // The candidate was not a tag. Release as much as is safe.
      while (buffer.length > 0 && !target.startsWith(buffer)) {
        const released = buffer[0]
        buffer = buffer.slice(1)

        if (!insideSpecialTag) {
          out += released
        }
      }
    }

    return out
  }
}
