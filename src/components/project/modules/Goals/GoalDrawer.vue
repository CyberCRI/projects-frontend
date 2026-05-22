<script setup lang="ts">
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'

import { useBlockNavigation } from '~/composables/useBlockNavigation'
import type { TranslatedProject } from '@/models/project.model'
import DateField from '@/components/base/form/DateField.vue'
import { createGoal, patchGoal } from '@/api/goals.service'
import { defaultGoalForm, useGoalForm } from '@/form/goal'
import { getFirstTextNotEmpty } from '@/functs/string'
import type { GoalModel } from '@/models/goal.model'
import { fullYearDateFormat } from '@/functs/date'
import useToasterStore from '@/stores/useToaster'
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

const defaultLocalForm = () => {
  const baseForm = defaultGoalForm()
  const newForm = { ...baseForm }

  const goal = props.goal
  const template = props.project.template
  if (goal) {
    newForm.id = goal.id
    newForm.status = goal.status
    newForm.deadline_at = goal.deadline_at
  }

  newForm.project_id = props.project.id

  newForm.title = getFirstTextNotEmpty([goal?.title, template?.goal_title]) || newForm.title
  newForm.description =
    getFirstTextNotEmpty([goal?.description, template?.goal_description]) || newForm.description

  return newForm
}

const { form, isValid, errors, cleanedData, reset } = useGoalForm({ lazy: true })
watch(
  () => [props.isOpened, props.goal],
  () => reset(defaultLocalForm()),
  { immediate: true }
)
const isFormEqual = useBlockNavigation(() => isEqual(form.value, defaultLocalForm()))

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
    patchGoal(props.project.id, form.value.id, payload)
      .then((goal) => {
        analytics.goal.updateGoalProject({
          project: {
            id: props.project.id,
          },
          goal,
        })
        emit('reload')
        toaster.pushSuccess(t('toasts.goal-update.success'))
      })
      .catch((error) => {
        toaster.pushError(t('toasts.goal-update.error'))
        console.error(error)
      })
      .finally(() => {
        asyncing.value = false
        emit('close')
      })
  } else {
    // Update goal
    createGoal(props.project.id, payload)
      .then((goal) => {
        analytics.goal.addGoalProject({
          project: {
            id: props.project.id,
          },
          goal,
        })
        emit('reload')
        toaster.pushSuccess(t('toasts.goal-create.success'))
      })
      .catch((error) => {
        toaster.pushError(t('toasts.goal-create.error'))
        console.error(error)
      })
      .finally(() => {
        asyncing.value = false
        emit('close')
      })
  }
}
</script>

<template>
  <BaseDrawer
    :title="$t('goal.add')"
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="!isValid || isFormEqual"
    :is-opened="isOpened"
    class="medium"
    :asyncing="asyncing"
    @close="emit('close')"
    @confirm="submit"
  >
    <div class="list-container">
      <TextInput
        v-model="form.title"
        :label="$t('goal.title')"
        :placeholder="$t('goal.title')"
        required
        :errors="errors.title"
      />

      <Field :label="$t('goal.description')" required>
        <TipTapEditor
          v-model="form.description"
          :errors="errors.description"
          class="goal-description"
        />
      </Field>

      <DateField
        v-model="form.deadline_at"
        :errors="errors.deadline_at"
        :label="$t('common.set-deadline')"
      />

      <Field :label="$t('goal.status-title')">
        <GroupButton
          v-model="form.status"
          class="group-button-labels"
          :options="statusOptions"
          :custom-color="statusColor"
        />
      </Field>
    </div>
  </BaseDrawer>
</template>
