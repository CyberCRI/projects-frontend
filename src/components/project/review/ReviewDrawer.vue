<template>
  <!-- TODO: Change disabled action -->
  <BaseDrawer
    :confirm-action-disabled="v$.$invalid"
    :confirm-action-name="$t('common.save')"
    :is-opened="isOpened"
    :title="$filters.capitalize(!rdata?.id ? $t('project.add-review') : $t('project.edit-review'))"
    class="review-drawer medium"
    :asyncing="asyncing"
    @close="closeDrawer"
    @confirm="saveReview"
  >
    <div class="review-form">
      <div class="review-entry">
        <label>{{ $filters.capitalize($t('common.title')) }}</label>
        <TextInput v-model="newReview.data.title" @blur="v$.newReview.data.title.$touch" />
        <FieldErrors :errors="v$.newReview.data.title.$errors" />
      </div>

      <div class="review-entry editor-entry">
        <label>{{ $t('form.description') }}</label>
        <TipTapEditor
          v-model="newReview.data.description"
          @update="updateContent"
          @blur="v$.newReview.data.description.$touch"
        />
        <FieldErrors :errors="v$.newReview.data.description.$errors" />
      </div>
      <div class="review-entry review-switch">
        <label>{{ $filters.capitalize($t('project.publish')) }}</label>
        <SwitchInput v-model="publish" />
      </div>
      <div class="review-entry review-switch">
        <label>{{ $filters.capitalize($t('project.lock')) }}</label>
        <SwitchInput v-model="lock" />
      </div>
    </div>
  </BaseDrawer>

  <ConfirmModal
    v-if="showConfirmModal"
    confirm-button-label="common.continue"
    :title="$t('description.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="showConfirmModal = false"
    @confirm="closeModalAndDrawer"
  />
</template>

<script>
import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import permissions from '@/mixins/permissions.ts'
import SwitchInput from '@/components/base/form/SwitchInput.vue'

import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'

import { postReview, patchReview } from '@/api/reviews.service'
import useToasterStore from '@/stores/useToaster.ts'
import useProjectsStore from '@/stores/useProjects.ts'
import useUsersStore from '@/stores/useUsers.ts'
export default {
  name: 'ReviewDrawer',

  components: {
    ConfirmModal,
    TipTapEditor,
    TextInput,
    BaseDrawer,
    SwitchInput,
    FieldErrors,
  },

  mixins: [permissions],

  props: {
    project: {
      type: Object,
      required: true,
    },

    rdata: {
      type: Object,
      default: () => {},
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['reload-reviews', 'close', 'reload-project'],
  setup() {
    const toaster = useToasterStore()
    const projectsStore = useProjectsStore()
    const usersStore = useUsersStore()
    return {
      toaster,
      projectsStore,
      usersStore,
    }
  },

  data() {
    return {
      asyncing: false,
      v$: useVuelidate(),
      showConfirmModal: false,
      editorOption: {
        modules: {
          toolbar: [['bold', 'italic', 'underline'], ['link']],
        },
      },
      publish: false,
      lock: true,
      newReview: {
        data: {
          title: '',
          description: '',
          reviewer: '',
        },
      },
      publishOptions: [
        {
          value: false,
          label: this.$t('common.no'),
        },
        {
          value: true,
          label: this.$t('common.yes'),
        },
      ],
      lockOptions: [
        {
          value: false,
          label: this.$t('common.no'),
        },
        {
          value: true,
          label: this.$t('common.yes'),
        },
      ],
    }
  },

  validations() {
    return {
      newReview: {
        data: {
          title: {
            required: helpers.withMessage(this.$t('form.review.title'), required),
            $autoDirty: true,
          },
          description: {
            required: helpers.withMessage(this.$t('form.review.message'), required),
            $autoDirty: true,
          },
        },
      },
    }
  },

  computed: {
    isEdited() {
      return this.rdata?.id
        ? this.rdata.title != this.newReview.data.title ||
            this.rdata.description != this.newReview.data.description
        : this.newReview.data.title != '' || this.newReview.data.description != '<p></p>'
    },
  },

  watch: {
    isOpened: {
      handler: function () {
        this.publish = false
        this.lock = true

        if (this.rdata?.id) {
          this.publish = this.project.publication_status === 'public'
          this.lock = this.project.is_locked

          this.newReview.id = this.rdata.id
          this.newReview.data = { ...this.rdata }
        } else {
          this.newReview = {
            data: {
              title: '',
              description: '<p></p>',
            },
          }
        }
        this.newReview.data.reviewer = this.usersStore.id
      },
      immediate: true,
    },
  },

  methods: {
    async saveReview() {
      const isValid = await this.v$.$validate()
      if (isValid) {
        this.asyncing = true
        if (!this.rdata?.id) {
          // add
          await this.createReview()
        } else {
          //edit
          await this.updateReview()
        }
        try {
          // Update other project properties
          const projectData = { life_status: 'private', is_locked: false }
          if (this.publish) projectData.publication_status = 'public'
          if (this.lock) {
            projectData.is_locked = true
            projectData.life_status = 'completed'
          } else {
            projectData.life_status = 'running'
          }
          await this.projectsStore.updateProject({
            id: this.project.id,
            project: projectData,
          })
        } catch (error) {
          console.error(error)
        }
        this.asyncing = false
        this.closeDrawerNoConfirm()
      }
    },

    async createReview() {
      const body = {
        description: this.newReview.data.description,
        title: this.newReview.data.title,
        project_id: this.project.id,
        reviewer_id: this.newReview.data.reviewer,
      }

      try {
        await postReview(body)
        this.$emit('reload-reviews')

        await this.projectsStore.lockUnlockProject({
          project_id: this.project.id,
          context: this.lock ? 'lock' : 'unlock',
        })
        await this.$nextTick()
        this.$emit('reload-project')

        this.toaster.pushSuccess(this.$t('toasts.review-create.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.review-create.error')} (${error})`)
        console.error(error)
      }
    },

    async updateReview() {
      let body = {
        description: this.newReview.data.description,
        title: this.newReview.data.title,
        project_id: this.project.id,
        reviewer_id: this.newReview.data.reviewer.id,
        id: this.newReview.id,
      }

      try {
        await patchReview(body)
        this.$emit('reload-reviews')
        this.toaster.pushSuccess(this.$t('toasts.review-update.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.review-update.error')} (${error})`)
        console.error(error)
      }
    },

    closeDrawer() {
      if (this.isEdited) this.openConfirmModal()
      else this.closeDrawerNoConfirm()
    },

    closeDrawerNoConfirm() {
      this.$emit('close')
    },

    closeModalAndDrawer() {
      this.openConfirmModal()
      this.closeDrawerNoConfirm()
    },

    openConfirmModal() {
      this.showConfirmModal = !this.showConfirmModal
    },
  },
}
</script>

<style lang="scss" scoped>
.review-form {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
}

.review-switch {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.review-entry {
  margin-bottom: $space-l;
  text-align: left;
  flex-shrink: 0;
}

.editor-entry {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .editor {
    flex-grow: 1;
  }
}

.review-entry:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  font-size: $font-size-l;
  color: $primary-dark;
  font-weight: bold;
  margin-bottom: $space-s;
  text-align: left;
}
</style>
