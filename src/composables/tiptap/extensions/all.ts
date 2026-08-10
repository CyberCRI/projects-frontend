import { getExtensions as sharedGetExtentions, lowlight } from 'shared-projects-frontend/lib'
import { LpiCodeBlock } from '~/composables/tiptap/extensions/LpiCodeBlock'
import type { StarterKitOptions } from '@tiptap/starter-kit'

/**
 * wrapper of default extentions for tiptap to change codBlock with "vue" compoenent
 *
 * @function
 * @name getExtensions
 * @kind variable
 * @param {Partial<StarterKitOptions>} options?
 * @returns {Extensions}
 * @exports
 */
export const getExtensions = (options?: Partial<StarterKitOptions>) => {
  const exts = sharedGetExtentions(options)

  // replace codeblock by new LpiCodeBlock
  const index = exts.findIndex((ext) => ext.name === LpiCodeBlock.name)
  if (index !== -1) {
    exts[index] = LpiCodeBlock.configure({
      lowlight,
    })
  }

  return exts
}
