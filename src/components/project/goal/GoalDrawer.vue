<template>
  <BaseDrawer
    :title="$t('goal.add')"
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="!isValid"
    :is-opened="isOpened"
    class="medium"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="submit"
  >
    <div class="form">
      <TextInput
        v-model="form.title"
        :label="`${$t('goal.title')}:`"
        :placeholder="$t('goal.title')"
        :errors="errors.title"
      />

      <div class="goal-description-section">
        <span class="goal-label">{{ $t('goal.description') }}:</span>
        <TipTapEditor v-model="form.description" class="goal-description" />
        <FieldErrors :errors="errors.description" />
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
    v-if="stateModal"
    :title="$t('description.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModal"
    @confirm="clear"
  />
</template>

<script setup lang="ts">
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'

import type { TranslatedProject } from '@/models/project.model'
import DateField from '@/components/base/form/DateField.vue'
import { createGoal, patchGoal } from '@/api/goals.service'
import { defaultForm, useGoalForm } from '@/form/goal'
import type { GoalModel } from '@/models/goal.model'
import { fullYearDateFormat } from '@/functs/date'
import useToasterStore from '@/stores/useToaster'
import { textIsEmpty } from '@/functs/string'
import { isEqual } from 'es-toolkit'
import analytics from '@/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    isOpened?: boolean
    goal?: GoalModel
  }>(),
  {
    isOpened: false,
    goal: null,
  }
)

const emit = defineEmits<{
  close: []
  reload: []
}>()

const toaster = useToasterStore()
const { t } = useNuxtI18n()

const defaultGoalForm = () => {
  const baseForm = defaultForm()
  const newForm = { ...baseForm }

  const goal = props.goal
  if (goal) {
    newForm.id = goal.id
    newForm.title = goal.title
    newForm.status = goal.status
    newForm.description = goal.description
    newForm.deadline_at = goal.deadline_at
  }

  newForm.project_id = props.project.id

  const template = props.project.template
  if (template) {
    if (textIsEmpty(newForm.title)) {
      newForm.title = template.goal_title
    }
    if (textIsEmpty(newForm.description)) {
      newForm.description = template.goal_description
    }
  }

  newForm.title ??= baseForm.title
  newForm.description ??= baseForm.description

  return newForm
}

const { form, isValid, errors, cleanedData, v$ } = useGoalForm({ lazy: true })

watch(
  () => [props.isOpened, props.goal],
  () => {
    form.value = defaultGoalForm()
    v$.value.$reset()
  },
  { immediate: true }
)

const { stateModal, openModal, closeModal } = useModal()
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

const clear = () => {
  closeModal()
  emit('close')
}

const submit = async () => {
  if (!isValid.value) {
    return
  }

  asyncing.value = true
  const payload = {
    ...cleanedData.value,
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

      emit('reload')

      toaster.pushSuccess(t('toasts.goal-update.success'))
    } catch (error) {
      toaster.pushError(`${t('toasts.goal-update.error')} (${error})`)
      console.error(error)
    } finally {
      asyncing.value = false
      clear()
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

      emit('reload')

      toaster.pushSuccess(t('toasts.goal-create.success'))
    } catch (error) {
      toaster.pushError(`${t('toasts.goal-create.error')} (${error})`)
      console.error(error)
    } finally {
      asyncing.value = false
      clear()
    }
  }
}

const checkClose = () => {
  if (isEqual(form.value, defaultGoalForm())) {
    clear()
  } else {
    openModal()
  }
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
