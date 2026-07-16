import LpiCodeBlockNodeView from '~/components/base/form/TextEditor/Custom/Code/LpiCodeBlockNodeView.vue'
import { CodeBlock } from 'shared-projects-frontend/lib'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

/**
 * this extends the sharedLpiCodeBlock with vue3 componenets
 *
 * @constant
 * @name LpiCodeBlock
 * @kind variable
 * @type {Node<LpiBlockOptions, any>}
 * @exports
 */
export const LpiCodeBlock = CodeBlock.extend({
  addNodeView() {
    return VueNodeViewRenderer(LpiCodeBlockNodeView as any)
  },
})
