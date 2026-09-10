<script setup lang="ts">
import type {
  TranslatedUserModel,
  SkillCleanedForm,
  SkillForm as SkillFormType,
} from 'shared-projects-frontend/models'
import type { SkillType } from '~/components/people/skill/SkillEditor.vue'
import SkillForm from '~/components/profile/modules/Skills/SkillForm.vue'
import { defaultSkillForm, useSkillForm } from '~/form/skill'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    user: TranslatedUserModel
    skillType: SkillType
    skill?: SkillFormType
    asyncing?: boolean
  }>(),
  {
    skill: () => null,
    asyncing: false,
  }
)

const emit = defineEmits<{
  close: []
  confirm: [SkillCleanedForm]
}>()

const defaultLocalForm = (): SkillFormType => {
  const form = defaultSkillForm()
  return {
    ...form,
    ...(props.skill || {}),
    user: props.user.id,
  }
}

const { form, reset, isValid, cleanedData } = useSkillForm({
  default: defaultLocalForm(),
})

const onConfirm = () => {
  emit('confirm', cleanedData.value)
}

watch(
  () => [props.skill, props.isOpen],
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)
</script>

<template>
  <BaseDrawer
    ref="root"
    :confirm-action-disabled="asyncing || !isValid"
    :confirm-action-name="$t('common.save')"
    :is-opened="isOpen"
    :title="$t(`profile.edit.skills.${skillType}.drawer.title`)"
    class="medium"
    @close="$emit('close')"
    @confirm="onConfirm"
  >
    <SkillForm v-model="form" @close="$emit('close')" />
  </BaseDrawer>
</template>
