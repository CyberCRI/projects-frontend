<script setup lang="ts">
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'

import { createProjectGoal, patchProjectGoal } from '@/api/goals.service'
import { useBlockNavigation } from '~/composables/useBlockNavigation'
import type { TranslatedProject } from '@/models/project.model'
import DateField from '@/components/base/form/DateField.vue'
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

const { stateModals, closeModals, openModals } = useModals({ saveChange: false })

const { form, isValid, errors, cleanedData, reset } = useGoalForm({ lazy: true })
watch(
  () => [props.goal, props.isOpened, props.project],
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)

const isFormEqual = useBlockNavigation(() => isEqual(form.value, defaultLocalForm()))

const asyncing = ref(false)

// TODO changes this shit (whit do this ???)
const statusColor = computed(() => {
  return `;
  background-color: var(--goal-${form.value.status}-background);
  color: var(--goal-${form.value.status}-text);
  `
})

const statusOptions = computed(() => [
  {
    value: 'na',
    label: t('status.na'),
    selected: form.value.status === 'na',
    classSelected: 'goal-na',
  },
  {
    value: 'ongoing',
    label: t('status.ongoing'),
    selected: form.value.status === 'ongoing',
    classSelected: 'goal-ongoing',
  },
  {
    value: 'complete',
    label: t('status.completed'),
    selected: form.value.status === 'complete',
    classSelected: 'goal-complete',
  },
  {
    value: 'cancel',
    label: t('status.canceled'),
    selected: form.value.status === 'cancel',
    classSelected: 'goal-cancel',
  },
])

const close = () => {
  emit('close')
  closeModals('saveChange')
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
    patchProjectGoal(props.project.id, form.value.id, payload)
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
        close()
      })
  } else {
    // Update goal
    createProjectGoal(props.project.id, payload)
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
        close()
      })
  }
}

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
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
    @close="checkClose"
    @confirm="submit"
  >
    <div class="list-container">
      <Field :label="$t('goal.status-title')">
        <GroupButton
          v-model="form.status"
          class="group-button-labels"
          :options="statusOptions"
          :custom-color="statusColor"
        />
      </Field>

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
          class="goal-description w-full"
        />
      </Field>

      <DateField
        v-model="form.deadline_at"
        :errors="errors.deadline_at"
        :label="$t('common.set-deadline')"
      />
    </div>

    <!-- drawer/modal -->
    <ConfirmModal
      v-if="stateModals.saveChange"
      :title="$t('form.quit-without-saving-title')"
      :content="$t('common.confirm-close')"
      @cancel="closeModals('saveChange')"
      @confirm="close"
    />
  </BaseDrawer>
</template>
