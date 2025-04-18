<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="v$.$invalid"
    :is-opened="isOpened"
    :title="$t('group.form.add-description')"
    class="group-drawer"
    @close="close"
    @confirm="saveDescription"
  >
    <ConfirmModal
      v-if="confirmModalIsOpen"
      content=""
      :title="$t('description.quit-without-saving-title')"
      confirm-button-label="common.continue"
      @cancel="confirmModalIsOpen = false"
      @confirm="closeDrawer"
    />

    <div class="editor-ctn">
      <TipTapEditor
        ref="tiptapEditor"
        v-model="description"
        class="input-field content-editor no-max-height min-height-100"
        mode="medium"
        @image="handleImage"
      />
    </div>
  </BaseDrawer>
</template>

<script>
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import useVuelidate from '@vuelidate/core'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'

export default {
  name: 'GroupDescriptionDrawer',

  components: {
    TipTapEditor,
    BaseDrawer,
    ConfirmModal,
  },

  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
    // TODO this will set the collaborative
    // when the HocusPocus server is updated
    // eslint-disable-next-line
    isAddMode: {
      type: Boolean,
      default: true,
    },

    originalDescription: {
      type: String,
      default: null,
    },
  },

  emits: ['close', 'update-description'],

  data() {
    return {
      v$: useVuelidate(),
      description: '<p></p>',
      addedImages: [],
      confirmModalIsOpen: false,

      room: null, // TODO: set to something when socket is enabled and we are in add mode
    }
  },

  watch: {
    isOpened: {
      handler: function (neo) {
        if (neo) {
          this.description = this.originalDescription || '<p></p>'
        }
        this.$nextTick(() => {
          if (this.v$) this.v$.$reset()
        })
      },
      immediate: true,
    },
  },

  methods: {
    closeDrawer() {
      this.confirmModalIsOpen = false
      this.v$.$reset()
      this.$emit('close')
    },

    saveDescription() {
      this.$emit('update-description', this.description)
      this.close()
    },

    handleImage(img) {
      this.addedImages.push(img.id)
    },

    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.group-drawer {
  height: 100%;

  .input-field {
    margin: $space-l;
    margin-bottom: $space-xs;
  }

  .content-editor {
    flex-grow: 1;
    min-height: pxToRem(300px);
  }
}

.editor-ctn {
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  justify-content: stretch;
  overflow: hidden;
}
</style>
