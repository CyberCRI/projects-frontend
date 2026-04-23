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
        @blur="v$.title.$touch"
      />
      <FieldErrors :errors="v$.title.$errors" />

      <div class="goal-description-section">
        <span class="goal-label">{{ $t('goal.description') }}:</span>
        <TipTapEditor
          v-model="form.description"
          class="goal-description"
          @blur="v$.description.$touch"
        />
        <FieldErrors :errors="v$.description.$errors" />
      </div>

      <DateField v-model="form.deadline_at" :label="$t('common.set-deadline')" />

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

<script setup lang="ts">
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'

import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'

import { createGoal, patchGoal } from '@/api/goals.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster'
import DateField from '@/components/base/form/DateField.vue'
import { fullYearDateFormat } from '@/functs/date'
import { textIsEmpty } from '@/functs/string'
import { TranslatedProject } from '@/models/project.model'
import { GoalModel } from '@/models/goal.model'
import { defaultForm } from '@/form/goal'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    isOpened?: boolean
    editedGoal?: GoalModel
  }>(),
  {
    isOpened: false,
    editedGoal: null,
  }
)

const emit = defineEmits<{
  close: []
  'reload-goals': []
}>()
const toaster = useToasterStore()
const { t } = useNuxtI18n()
const route = useRoute()
const router = useRouter()

const form = ref(defaultForm())

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(t('form.goal.title'), required),
  },
  description: {
    required: helpers.withMessage(t('form.goal.description'), required),
  },
}))
const v$ = useVuelidate(rules, form)

const showConfirmModal = ref(false)
const asyncing = ref(false)

const statusColor = computed(() => {
  if (form.value.status === 'ongoing') return '#99FFE7'
  else if (form.value.status === 'complete') return '#00DBA7'
  else if (form.value.status === 'cancel') return '#D4D4D4'
  return '#F0FFFB' /* for "na" */
})

const statusOptions = computed(() => [
  {
    value: 'na',
    label: t('status.na'),
    selected: form.value.status === 'na',
  },
  {
    value: 'ongoing',
    label: t('status.ongoing'),
    selected: form.value.status === 'ongoing',
  },
  {
    value: 'complete',
    label: t('status.completed'),
    selected: form.value.status === 'complete',
  },
  {
    value: 'cancel',
    label: t('status.canceled'),
    selected: form.value.status === 'cancel',
  },
])

const isEdited = computed(() => {
  if (props.editedGoal) {
    return (
      props.editedGoal.description != form.value.description ||
      props.editedGoal.title != form.value.title
    )
  }
  return !textIsEmpty(form.value.title) || !textIsEmpty(form.value.description)
})

const fillForm = () => {
  if (props.editedGoal) {
    form.value.id = props.editedGoal.id
    form.value.title = props.editedGoal.title
    form.value.description = props.editedGoal.description
    form.value.deadline_at = props.editedGoal.deadline_at
    form.value.status = props.editedGoal.status
  }
}

const resetForm = () => {
  form.value = {
    title: props.project.template?.$t?.goal_title || '',
    description: props.project.template?.$t?.goal_description || '<p></p>',
    deadline_at: null,
    status: 'na',
  }
}

const submit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    return
  }

  asyncing.value = true
  const payload = {
    ...form.value,
    project_id: props.project.id,
    description: form.value.description,
    deadline_at: form.value.deadline_at ? fullYearDateFormat(form.value.deadline_at) : null,
  }
  if (form.value.id) {
    // Update goal
    try {
      const result = await patchGoal(props.project.id, form.value.id, payload)

      analytics.goal.updateGoalProject({
        project: {
          id: props.project.id,
        },
        goal: result,
      })

      emit('reload-goals')

      toaster.pushSuccess(t('toasts.goal-update.success'))
    } catch (error) {
      toaster.pushError(`${t('toasts.goal-update.error')} (${error})`)
      console.error(error)
    } finally {
      asyncing.value = false
      closeModalNoConfirm()
    }
  } else {
    // Create goal
    try {
      const result = await createGoal(props.project.id, payload)
      analytics.goal.addGoalProject({
        project: {
          id: props.project.id,
        },
        goal: result,
      })

      emit('reload-goals')

      toaster.pushSuccess(t('toasts.goal-create.success'))

      if (route.name !== 'projectGoals') {
        router.push({
          name: 'projectGoals',
          params: { slugOrId: props.project.slug || props.project.id },
        })
      }
    } catch (error) {
      toaster.pushError(`${t('toasts.goal-create.error')} (${error})`)
      console.error(error)
    } finally {
      asyncing.value = false
      closeModalNoConfirm()
    }
  }
}

const openConfirmModal = () => {
  showConfirmModal.value = !showConfirmModal.value
}

const closeModal = () => {
  if (asyncing.value) return
  if (isEdited.value) openConfirmModal()
  else {
    closeModalNoConfirm()
  }
}

const closeModalNoConfirm = () => {
  if (asyncing.value) return
  v$.value.$reset()
  emit('close')
}

const closeModalAndDrawer = () => {
  openConfirmModal()
  closeModalNoConfirm()
}

watch(
  () => props.isOpened,
  () => {
    if (props.editedGoal?.id) {
      fillForm()
    } else {
      resetForm()
    }
  },
  { immediate: true }
)
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
