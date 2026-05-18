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

<script setup lang="ts">
import type { PropsDefinitions } from '~/components/base/form/TextEditor/useTipTap'
import type { Editor } from '@tiptap/vue-3'
import MenuItem from './MenuItem.vue'

type Item = {
  type?: 'divider'
  icon: string
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

const items = computed(() => {
  const items: (Divider | Item)[] = [
    {
      icon: 'bold',
      title: 'multieditor.bold',
      action: () => props.editor.chain().focus().toggleBold().run(),
      isActive: () => props.editor.isActive('bold'),
      isDisabled: false,
    },
    {
      icon: 'italic',
      title: 'multieditor.italic',
      action: () => props.editor.chain().focus().toggleItalic().run(),
      isActive: () => props.editor.isActive('italic'),
      isDisabled: false,
    },
    {
      icon: 'underline',
      title: 'multieditor.underline',
      action: () => props.editor.chain().focus().toggleUnderline().run(),
      isActive: () => props.editor.isActive('underline'),
      isDisabled: false,
    },
    {
      type: 'divider',
    },
    {
      icon: 'link',
      title: 'multieditor.link',
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
      icon: 'palette-line',
      title: 'multieditor.color.color',
      action: () => props.openColorModal(),
      isActive: () => props.editor.isActive('textStyle'),
      isDisabled: false,
    },
    {
      type: 'divider',
    },
    {
      icon: 'h-1',
      title: 'multieditor.heading_1',
      action: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => props.editor.isActive('heading', { level: 1 }),
      isDisabled: false,
    },
    {
      icon: 'h-2',
      title: 'multieditor.heading_2',
      action: () => props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => props.editor.isActive('heading', { level: 2 }),
      isDisabled: false,
    },
    {
      icon: 'h-3',
      title: 'multieditor.heading_3',
      action: () => props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => props.editor.isActive('heading', { level: 3 }),
      isDisabled: false,
    },
    {
      type: 'divider',
    },
    {
      icon: 'align-left',
      title: 'multieditor.text_align_left',
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
      icon: 'align-center',
      title: 'multieditor.text_align_center',
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
      icon: 'align-right',
      title: 'multieditor.text_align_right',
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
      icon: 'list-unordered',
      title: 'multieditor.bullet_list',
      action: () => props.editor.chain().focus().toggleBulletList().run(),
      isActive: () => props.editor.isActive('bulletList'),
      isDisabled: false,
    },
    {
      icon: 'table-2',
      title: 'multieditor.table',
      action: () =>
        props.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      isActive: () => props.editor.isActive('table'),
      isDisabled: false,
    },
    {
      icon: 'double-quotes-l',
      title: 'multieditor.blockquote',
      action: () => props.editor.chain().focus().toggleBlockquote().run(),
      isActive: () => props.editor.isActive('blockquote'),
      isDisabled: false,
    },
    {
      icon: 'code-s-slash-line',
      title: 'multieditor.code.label',
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
        icon: 'image-fill',
        title: 'multieditor.image.image',
        action: () => props.openImageModal(),
        isDisabled: false,
      },
      {
        icon: 'film-fill',
        title: 'multieditor.video',
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
      icon: 'arrow-go-back-line',
      title: 'multieditor.undo',
      action: () => props.editor.chain().focus().undo().run(),
      isDisabled: false,
    },
    {
      icon: 'arrow-go-forward-line',
      title: 'multieditor.redo',
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
        icon: 'save-line',
        title: 'multieditor.save',
        action: () => emit('saved'),
        isDisabled: props.disableSave,
      }
    )
  }

  return items
})
</script>

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
