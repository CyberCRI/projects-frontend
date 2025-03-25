import {
  LpiBubbleMenuPlugin,
  LpiBubbleMenuPluginProps,
} from '@/components/base/form/TextEditor/tiptap-extensions/extension-lpi-bubble-menu'
import { defineComponent, h, onBeforeUnmount, onMounted, PropType, ref } from 'vue'

/**
 * This is a copy of ueberdosis/tiptap's BubbleMenu component (based on v2.0.3)
 * for the sake of using our own version of extension-bubble-menu (now extension-lpi-bubble-menu)
 * witch allow trigger the menu with empty selection (i.e. just a caret) and
 * based on editor' selection change event instead of blur
 * so we can do accurate check on current selection type
 */

export default defineComponent({
  name: 'LpiBubbleMenu',

  props: {
    pluginKey: {
      type: [String, Object] as PropType<LpiBubbleMenuPluginProps['pluginKey']>,
      default: 'lpiBubbleMenu',
    },

    editor: {
      type: Object as PropType<LpiBubbleMenuPluginProps['editor']>,
      required: true,
    },

    updateDelay: {
      type: Number as PropType<LpiBubbleMenuPluginProps['updateDelay']>,
      default: undefined,
    },

    tippyOptions: {
      type: Object as PropType<LpiBubbleMenuPluginProps['tippyOptions']>,
      default: () => ({}),
    },

    shouldShow: {
      type: Function as PropType<Exclude<Required<LpiBubbleMenuPluginProps>['shouldShow'], null>>,
      default: null,
    },

    deepSelector: {
      type: String as PropType<LpiBubbleMenuPluginProps['deepSelector']>,
      default: undefined,
    },
  },

  setup(props, { slots }) {
    const root = ref<HTMLElement | null>(null)

    onMounted(() => {
      const { updateDelay, editor, pluginKey, shouldShow, tippyOptions, deepSelector } = props

      editor.registerPlugin(
        LpiBubbleMenuPlugin({
          updateDelay,
          editor,
          element: root.value as HTMLElement,
          pluginKey,
          shouldShow,
          tippyOptions,
          deepSelector,
        })
      )
    })

    onBeforeUnmount(() => {
      const { pluginKey, editor } = props

      editor.unregisterPlugin(pluginKey)
    })

    return () => h('div', { ref: root }, slots.default?.())
  },
})
