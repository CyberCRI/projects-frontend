<script setup lang="ts">
import type {
  TranslatedSkill,
  TranslatedUserModel,
  SkillForm,
  SkillCleanedForm,
} from 'shared-projects-frontend/models'
import { deleteUserSkill, patchUserSkill, postUserSkill } from 'shared-projects-frontend/apis'
import SkillDrawer from '~/components/profile/modules/Skills/SkillDrawer.vue'
import type { SkillType } from '~/components/people/skill/SkillEditor.vue'
import SkillItem from '~/components/profile/modules/Skills/SkillItem.vue'
import NothingHere from '~/components/base/NothingHere.vue'
import type { MentorShip } from '~/interfaces/mengtorship'
import useToasterStore from '~/stores/useToaster'
import Title from '~/components/base/Title.vue'

const props = withDefaults(
  defineProps<{
    editable?: boolean
    preview?: boolean
    skills: TranslatedSkill[]
    skillType: SkillType
    user: TranslatedUserModel
    mentorShip: MentorShip
  }>(),
  {
    editable: false,
    preview: false,
  }
)

const emit = defineEmits<{
  refresh: []
  'mentorship-send': []
}>()

const { t } = useNuxtI18n()
const toaster = useToasterStore()

const addLabel = computed(() => t(`profile.edit.skills.${props.skillType}.add-item`))
const title = computed(() => t(`me.${props.skillType}`))

const { stateModals, openModals, closeAllModals } = useModals({
  edit: false,
  delete: false,
})

const asyncing = ref(false)
const selectedSkill = ref<TranslatedSkill>(null)
const editableSkill = ref<SkillForm>(null)

const clear = () => {
  closeAllModals()
  asyncing.value = false
  selectedSkill.value = null
}

const onConfirmDelete = () => {
  asyncing.value = true
  deleteUserSkill(props.user.id, selectedSkill.value.id)
    .then(() => {
      toaster.pushSuccess(t(`profile.edit.skills.${props.skillType}.delete-success`))
      emit('refresh')
      clear()
    })
    .catch(() => toaster.pushError(t(`profile.edit.skills.${props.skillType}.delete-error`)))
    .finally(() => (asyncing.value = false))
}

const onUpdate = (skill: SkillCleanedForm) => {
  asyncing.value = true
  patchUserSkill(props.user.id, skill.id, skill)
    .then(() => {
      toaster.pushSuccess(t(`profile.edit.skills.${props.skillType}.edit-success`))
      emit('refresh')
      clear()
    })
    .catch(() => toaster.pushError(t(`profile.edit.skills.${props.skillType}.edit-error`)))
    .finally(() => (asyncing.value = false))
}

const onCreate = (skill: SkillCleanedForm) => {
  asyncing.value = true
  postUserSkill(props.user.id, skill)
    .then(() => {
      toaster.pushSuccess(t(`profile.edit.skills.${props.skillType}.add-success`))
      emit('refresh')
      clear()
    })
    .catch(() => toaster.pushError(t(`profile.edit.skills.${props.skillType}.add-error`)))
    .finally(() => (asyncing.value = false))
}

const onConfirm = (skill: SkillCleanedForm) => {
  if (skill.id) {
    return onUpdate(skill)
  } else {
    return onCreate(skill)
  }
}

const onDelete = (skill: TranslatedSkill) => {
  selectedSkill.value = skill
  openModals('delete')
}

const onEdit = (skill: SkillForm) => {
  editableSkill.value = skill
  openModals('edit')
}

const onAdd = () => {
  onEdit({
    type: props.skillType === 'hobbies' ? 'hobby' : 'skill',
  })
}
</script>

<template>
  <div>
    <BaseModuleHeader v-if="!preview" :editable="editable" :add-label="addLabel" @add="onAdd" />
    <Title v-if="!preview" :title="title" :count="skills.length" />
    <div class="skills" :class="{ 'list-divider': !preview }">
      <SkillItem
        v-for="skill in skills"
        :key="skill.id"
        :user="user"
        :skill="skill"
        :can-delete="editable"
        :can-edit="editable"
        :mode="preview ? 'minimal' : editable ? 'medium' : 'full'"
        :show-extras="!editable"
        :user-mentoring="mentorShip[skill.id]"
        @delete="onDelete(skill)"
        @edit="onEdit(skill)"
        @mentorship-send="$emit('mentorship-send')"
      />
    </div>
    <NothingHere v-if="skills.length === 0" />

    <!-- drawer -->

    <ConfirmModal
      v-if="stateModals.delete"
      :title="$t('profile.edit.skills.delete')"
      :asyncing="asyncing"
      @cancel="clear"
      @confirm="onConfirmDelete"
    >
      <SkillItem
        :skill="selectedSkill"
        :user="user"
        :mentor-ship="mentorShip[selectedSkill.id]"
        mode="minimal"
      />
    </ConfirmModal>

    <SkillDrawer
      :is-open="stateModals.edit"
      :skill-type="skillType"
      :user="user"
      :skill="editableSkill"
      :skills="skills"
      :asyncing="asyncing"
      @close="clear"
      @confirm="onConfirm"
    />
  </div>
</template>

<style lang="scss" scoped>
.list-divider > :deep(*:not(:last-child)::after) {
  margin: 1rem;
}
</style>
