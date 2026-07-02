import type { LpiBubbleMenuPluginProps } from '~/composables/tiptap/tiptap-extensions/extension-lpi-bubble-menu'
import type { TemplateRef } from 'vue'

export default function (
  componentRef: TemplateRef<any>,
  selector?: string
): LpiBubbleMenuPluginProps['tippyOptions'] {
  return {
    inlinePositioning: true,
    popperOptions: {
      strategy: 'fixed',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: ({ popper }) => {
              const DEFAULT = [0, 0]
              // @ts-ignore do better typing
              if (!componentRef.value) {
                return DEFAULT
              }

              // compoenentRef is HTML compoenent or VueComponents
              const el: HTMLElement =
                '$el' in componentRef.value ? componentRef.value.$el : componentRef.value
              const element = el?.closest('.content-wrapper')
              if (!element) {
                return DEFAULT
              }

              const selection = element.querySelector(selector || '.ProseMirror-selectednode')
              if (!selection) {
                return DEFAULT
              }

              const wrapperBbox = element.getBoundingClientRect()
              const selectionBbox = selection.getBoundingClientRect()

              let topOffset = 0

              if (selectionBbox.top > wrapperBbox.top + wrapperBbox.height) {
                // si la target est hors conteneur vers le bas,
                // clamper pour que le tip reste à la limite basse
                topOffset = selectionBbox.top - (wrapperBbox.top + wrapperBbox.height)
                topOffset += popper.height
              } else {
                // sinon la target est  éventuellemnt hors conteneur vers le heut,
                // clamper pour que le tip reste à la limite haute
                topOffset = selectionBbox.top - popper.height - wrapperBbox.top
                topOffset = Math.min(topOffset, 0)
              }
              return [0, topOffset]
            },
          },
        },
      ],
    },
  }
}
