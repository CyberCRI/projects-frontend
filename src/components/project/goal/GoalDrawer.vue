<template>
  <BaseDrawer
    :title="$t('goal.add')"
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="v$.$invalid"
    :is-opened="isOpened"
    class="medium"
    :asyncing="asyncing"
    @close="closeModal"
    @confirm="submit"
  >
    <div class="form">
      <TextInput
        v-model="form.title"
        :label="`${$t('goal.title')}:`"
        :placeholder="$t('goal.title')"
        @blur="v$.form.title.$touch"
      />
      <FieldErrors :errors="v$.form.title.$errors" />

      <div class="goal-description-section">
        <span class="goal-label">{{ $t('goal.description') }}:</span>
        <TipTapEditor
          v-model="form.description"
          class="goal-description"
          @blur="v$.form.description.$touch"
        />
        <FieldErrors :errors="v$.form.description.$errors" />
      </div>

      <SwitchInput
        v-model="deadlineVisible"
        class="deadline-switch"
        :label="`${$t('common.set-deadline')}:`"
      />

      <VueDatePicker
        v-if="deadlineVisible"
        v-model="form.deadline_at"
        class="goal-deadline"
        position="top"
      />

      <div class="status-ctn">
        <span class="goal-label">{{ $t('goal.status-title') }}:</span>
        <GroupButton
          v-model="form.status"
          class="group-button-labels"
          :options="statusOptions"
          :custom-color="statusColor"
        />
      </div>
    </div>
  </BaseDrawer>
  <ConfirmModal
    v-if="showConfirmModal"
    :title="$t('description.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="showConfirmModal = false"
    @confirm="closeModalAndDrawer"
  />
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'

import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import SwitchInput from '@/components/base/form/SwitchInput.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'

import utils from '@/functs/functions.ts'

import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'

import { createGoal, patchGoal } from '@/api/goals.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster.ts'

export default {
  name: 'GoalDrawer',

  components: {
    ConfirmModal,
    BaseDrawer,
    TextInput,
    TipTapEditor,
    SwitchInput,
    GroupButton,
    FieldErrors,
    VueDatePicker,
  },

  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
    isOpened: {
      type: Boolean,
      default: false,
    },

    editedGoal: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['close', 'reload-goals'],
  setup() {
    const toaster = useToasterStore()
    return {
      toaster,
    }
  },

  data() {
    return {
      v$: useVuelidate(),
      form: {
        title: '',
        description: '<p></p>',
        deadline_at: new Date(),
        status: 'na',
      },
      deadlineVisible: false,
      showConfirmModal: false,
      asyncing: false,
    }
  },

  validations() {
    return {
      form: {
        title: {
          required: helpers.withMessage(this.$t('form.goal.title'), required),
        },
        description: {
          required: helpers.withMessage(this.$t('form.goal.description'), required),
        },
      },
    }
  },

  computed: {
    statusColor() {
      if (this.form.status === 'ongoing') return '#99FFE7'
      else if (this.form.status === 'complete') return '#00DBA7'
      else if (this.form.status === 'cancel') return '#D4D4D4'
      return '#F0FFFB' /* for "na" */
    },

    statusOptions() {
      return [
        {
          value: 'na',
          label: this.$t('status.na'),
          selected: this.form.status === 'na',
        },
        {
          value: 'ongoing',
          label: this.$t('status.ongoing'),
          selected: this.form.status === 'ongoing',
        },
        {
          value: 'complete',
          label: this.$t('status.completed'),
          selected: this.form.status === 'complete',
        },
        {
          value: 'cancel',
          label: this.$t('status.canceled'),
          selected: this.form.status === 'cancel',
        },
      ]
    },

    isEdited() {
      return this.editedGoal
        ? this.editedGoal.description != this.form.description ||
            this.editedGoal.title != this.form.title
        : this.form.description != '<p></p>' || this.form.title != ''
    },
  },

  watch: {
    deadlineVisible: function (val) {
      if (!val) this.form.deadline_at = null
    },

    isOpened: {
      handler: function () {
        if (this.editedGoal?.id) this.fillForm()
        else this.resetForm()
      },
      immediate: true,
    },
  },

  methods: {
    fillForm() {
      this.form.id = this.editedGoal.id
      this.form.title = this.editedGoal.title
      this.form.description = this.editedGoal.description
      this.form.deadline_at = this.editedGoal.deadline_at
      this.form.status = this.editedGoal.status
      this.deadlineVisible = !!this.editedGoal.deadline_at
    },

    resetForm() {
      this.form = {
        title: this.project.template?.$t?.goal_title || '',
        description: this.project.template?.$t?.goal_description || '<p></p>',
        deadline_at: new Date(),
        status: 'na',
      }
      this.deadlineVisible = false
    },

    async submit() {
      const isValid = await this.v$.$validate()

      if (isValid) {
        this.asyncing = true
        const payload = {
          ...this.form,
          project_id: this.project.id,
          description: this.form.description,
          deadline_at: this.form.deadline_at
            ? utils.fullYearDateFormat(this.form.deadline_at)
            : null,
        }
        if (this.form.id) {
          // Update goal
          try {
            const result = await patchGoal({
              goal: payload,
              project_id: this.project.id,
            })

            analytics.goal.updateGoalProject({
              project: {
                id: this.project.id,
              },
              goal: result,
            })

            this.$emit('reload-goals')

            this.toaster.pushSuccess(this.$t('toasts.goal-update.success'))
          } catch (error) {
            this.toaster.pushError(`${this.$t('toasts.goal-update.error')} (${error})`)
            console.error(error)
          } finally {
            this.asyncing = false
            this.closeModalNoConfirm()
          }
        } else {
          // Create goal
          try {
            const result = await createGoal({
              goal: payload,
              project_id: this.project.id,
            })

            analytics.goal.addGoalProject({
              project: {
                id: this.project.id,
              },
              goal: result,
            })

            this.$emit('reload-goals')

            this.toaster.pushSuccess(this.$t('toasts.goal-create.success'))

            if (this.$route.name !== 'projectGoals') {
              this.$router.push({
                name: 'projectGoals',
                params: { slugOrId: this.project.slug || this.project.id },
              })
            }
          } catch (error) {
            this.toaster.pushError(`${this.$t('toasts.goal-create.error')} (${error})`)
            console.error(error)
          } finally {
            this.asyncing = false
            this.closeModalNoConfirm()
          }
        }
      }
    },

    openConfirmModal() {
      this.showConfirmModal = !this.showConfirmModal
    },

    closeModal() {
      if (this.asyncing) return
      if (this.isEdited) this.openConfirmModal()
      else {
        this.closeModalNoConfirm()
      }
    },

    closeModalNoConfirm() {
      if (this.asyncing) return
      this.v$.$reset()
      this.$emit('close')
    },

    closeModalAndDrawer() {
      this.openConfirmModal()
      this.closeModalNoConfirm()
    },
  },
}
</script>

<style lang="scss" scoped>
.goal-description-section {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
  overflow: hidden;
}

.goal-title,
.goal-description,
.deadline-switch,
.goal-deadline {
  margin-bottom: $space-m;
}

.goal-description {
  flex-grow: 1;
}

.status-ctn {
  display: flex;
  align-items: center;

  > span {
    margin-right: $space-m;
  }
}

.goal-label {
  font-size: $font-size-s;
  color: $primary-dark;
  font-weight: bold;
  margin-bottom: $space-2xs;
}

// This is an overwrite on a co-existing style that is only here
:deep(.label-selected) {
  color: $black;
}
</style>
