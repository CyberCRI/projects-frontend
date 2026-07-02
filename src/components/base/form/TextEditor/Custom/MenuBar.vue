<script setup lang="ts">
import type { IconImageChoice } from '~/functs/IconImage.js'
import type { PropsDefinitions } from '~/composables/tiptap'
import type { Editor } from '@tiptap/vue-3'
import MenuItem from './MenuItem.vue'

type Item = {
  type?: 'divider'
  icon: IconImageChoice
  title: string
  action: () => void
  isActive?: () => void
  isDisabled?: boolean
}

type Divider = {
  type: Required<Item['type']>
}

const props = withDefaults(
  defineProps<{
    editor: Editor
    mode?: PropsDefinitions['mode']
    openLinkModal: () => void
    openColorModal: () => void
    openVideoModal: () => void
    openImageModal: () => void
    saveIconVisible?: boolean
    disableSave?: boolean
  }>(),
  {
    mode: 'simple',
    saveIconVisible: true,
    disableSave: false,
  }
)

const emit = defineEmits<{
  saved: []
}>()

const { t } = useNuxtI18n()

const items = computed(() => {
  const items: (Divider | Item)[] = [
    {
      icon: 'bold' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.bold'),
      action: () => props.editor.chain().focus().toggleBold().run(),
      isActive: () => props.editor.isActive('bold'),
      isDisabled: false,
    },
    {
      icon: 'italic' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.italic'),
      action: () => props.editor.chain().focus().toggleItalic().run(),
      isActive: () => props.editor.isActive('italic'),
      isDisabled: false,
    },
    {
      icon: 'Underline' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.underline'),
      action: () => props.editor.chain().focus().toggleUnderline().run(),
      isActive: () => props.editor.isActive('underline'),
      isDisabled: false,
    },
    {
      type: 'divider',
    },
    {
      icon: 'Link' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.link'),
      action: () => props.openLinkModal(),
      isActive: () => props.editor.isActive('link'),
      isDisabled: false,
    },
  ]

  if (props.mode === 'simple') {
    return items
  }

  items.push(
    {
      icon: 'paletteLine' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.color.color'),
      action: () => props.openColorModal(),
      isActive: () => props.editor.isActive('textStyle'),
      isDisabled: false,
    },
    {
      type: 'divider',
    },
    {
      icon: 'H1' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.heading_1'),
      action: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => props.editor.isActive('heading', { level: 1 }),
      isDisabled: false,
    },
    {
      icon: 'H2' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.heading_2'),
      action: () => props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => props.editor.isActive('heading', { level: 2 }),
      isDisabled: false,
    },
    {
      icon: 'H3' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.heading_3'),
      action: () => props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => props.editor.isActive('heading', { level: 3 }),
      isDisabled: false,
    },
    {
      type: 'divider',
    },
    {
      icon: 'AlignLeft' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.text_align_left'),
      action: () =>
        props.editor.isActive('external-video')
          ? props.editor.commands.updateAttributes('external-video', {
              align: 'left',
            })
          : props.editor.chain().focus().setTextAlign('left').run(),
      isActive: () =>
        props.editor.isActive('external-video')
          ? props.editor.isActive({ align: 'left' })
          : props.editor.isActive({ textAlign: 'left' }),
      isDisabled: false,
    },
    {
      icon: 'AlignCenter' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.text_align_center'),
      action: () =>
        props.editor.isActive('external-video')
          ? props.editor.commands.updateAttributes('external-video', {
              align: 'center',
            })
          : props.editor.chain().focus().setTextAlign('center').run(),
      isActive: () =>
        props.editor.isActive('external-video')
          ? props.editor.isActive({ align: 'center' })
          : props.editor.isActive({ textAlign: 'center' }),
      isDisabled: false,
    },
    {
      icon: 'AlignRight' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.text_align_right'),
      action: () =>
        props.editor.isActive('external-video')
          ? props.editor.commands.updateAttributes('external-video', {
              align: 'right',
            })
          : props.editor.chain().focus().setTextAlign('right').run(),

      isActive: () =>
        props.editor.isActive('external-video')
          ? props.editor.isActive({ align: 'right' })
          : props.editor.isActive({ textAlign: 'right' }),
      isDisabled: false,
    },
    {
      type: 'divider',
    },

    {
      icon: 'ListUnordered' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.bullet_list'),
      action: () => props.editor.chain().focus().toggleBulletList().run(),
      isActive: () => props.editor.isActive('bulletList'),
      isDisabled: false,
    },
    {
      icon: 'Table' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.table'),
      action: () =>
        props.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      isActive: () => props.editor.isActive('table'),
      isDisabled: false,
    },
    {
      icon: 'DoubleQuotesL' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.blockquote'),
      action: () => props.editor.chain().focus().toggleBlockquote().run(),
      isActive: () => props.editor.isActive('blockquote'),
      isDisabled: false,
    },
    {
      icon: 'CodeSSlash' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.code.label'),
      action: () => props.editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => props.editor.isActive('codeBlock'),
      isDisabled: false,
    },
    {
      type: 'divider',
    }
  )

  if (props.mode === 'full') {
    items.push(
      {
        icon: 'Gallery' satisfies IconImageChoice as IconImageChoice,
        title: t('multieditor.image.image'),
        action: () => props.openImageModal(),
        isDisabled: false,
      },
      {
        icon: 'Movie' satisfies IconImageChoice as IconImageChoice,
        title: t('multieditor.video.label'),
        action: () => props.openVideoModal(),
        isDisabled: false,
      },
      {
        type: 'divider',
      }
    )
  }

  items.push(
    {
      icon: 'arrowGoBackLine' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.undo'),
      action: () => props.editor.chain().focus().undo().run(),
      isDisabled: false,
    },
    {
      icon: 'arrowGoForwardLine' satisfies IconImageChoice as IconImageChoice,
      title: t('multieditor.redo'),
      action: () => props.editor.chain().focus().redo().run(),
      isDisabled: false,
    }
  )

  if (props.saveIconVisible) {
    items.push(
      {
        type: 'divider',
      },
      {
        icon: 'saveLine' satisfies IconImageChoice as IconImageChoice,
        title: t('multieditor.save'),
        action: () => emit('saved'),
        isDisabled: props.disableSave,
      }
    )
  }

  return items
})
</script>

<template>
  <div>
    <div class="icons">
      <template v-for="(item, index) in items">
        <div v-if="item.type === 'divider'" :key="`divider${index}`" class="divider" />
        <MenuItem v-else v-bind="item as Item" :key="index" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.divider {
  width: 2px;
  height: 1.25rem;
  background: $black;
  opacity: 0.1;
  margin-left: 0.5rem;
  margin-right: 0.75rem;
}

.icons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.b-tooltip.is-primary .tooltip-content {
  color: $black !important;
  left: unset !important;
  width: auto !important;
}

:deep(.b-tooltip.is-primary .tooltip-content) {
  min-width: 0 !important;
  padding: 10px !important;
}
</style>
