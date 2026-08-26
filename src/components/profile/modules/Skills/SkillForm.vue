<script setup lang="ts">
import type { TranslatedTag, SkillForm } from 'shared-projects-frontend/models'
import type { GroupOption } from '~/components/base/button/GroupButton.vue'
import TagSelectDrawer from '~/components/drawer/Tag/TagSelectDrawer.vue'
import CardInlineTag from '~/components/drawer/Tag/CardInlineTag.vue'
import GroupButton from '~/components/base/button/GroupButton.vue'
import Field from '~/components/base/form/Field.vue'
import { useSkillForm } from '~/form/skill'

const model = defineModel<SkillForm>({ default: () => ({}) })

const { stateModals, openModals, closeModals } = useModals({
  chooseMentor: false,
  selectSkill: false,
})

const emit = defineEmits<{
  close: []
}>()
const { form, errors } = useSkillForm({ model })

const mouseOver = ref<number | null>(null)

const onMouseOver = (index: number) => {
  mouseOver.value = index
}

const onMouseLeave = () => {
  mouseOver.value = null
}

const onClick = (index: number) => {
  form.value.level = index
}

type MentorValue = 'none' | 'can-mentor' | 'need-mentor'
const options = computed(
  () =>
    [
      {
        value: 'none' satisfies MentorValue,
        label: $t('common.none'),
      },
      {
        value: 'can-mentor' satisfies MentorValue,
        label: $t('profile.edit.skills.mentorship.can-mentor'),
      },
      {
        value: 'need-mentor' satisfies MentorValue,
        label: $t('profile.edit.skills.mentorship.needs-mentor'),
      },
    ] satisfies GroupOption[]
)

const mentorValue = computed<MentorValue>(() => {
  return form.value.can_mentor ? 'can-mentor' : form.value.needs_mentor ? 'need-mentor' : 'none'
})

const onUpdateMentor = (value: MentorValue) => {
  switch (value) {
    case 'can-mentor': {
      form.value.can_mentor = true
      form.value.needs_mentor = false
      break
    }
    case 'need-mentor': {
      form.value.needs_mentor = true
      form.value.can_mentor = false
      break
    }
    case 'none':
    default: {
      form.value.needs_mentor = false
      form.value.can_mentor = false
      break
    }
  }
}

const onSelectedTag = (tags: TranslatedTag[]) => {
  closeModals('selectSkill')
  const tag = tags[0]
  form.value.tag = tag
}

const checkCloseTag = () => {
  if (!form.value.tag) {
    emit('close')
  }
  closeModals('selectSkill')
}

// force open drawer select skill
watchEffect(() => {
  if (!form.value.tag) {
    openModals('selectSkill')
  }
})
</script>

<template>
  <div class="list-container">
    <TagSelectDrawer
      classification-type="enabled-for-skills"
      :selected-tags="form.tag ? [form.tag] : []"
      :is-opened="stateModals.selectSkill"
      :max-selected="1"
      max-auto-confirm
      @close="checkCloseTag"
      @submit="onSelectedTag"
    />

    <CardInlineTag
      v-if="form.tag"
      class="skill-tag-card-form"
      :tag="form.tag"
      icon="Pen"
      @click="openModals('selectSkill')"
    />

    <Field
      :label="$t('profile.edit.skills.form.level.label')"
      class="skill-label-form"
      :errors="errors.level"
    >
      <template #in-label>
        <SkillLevelTip>
          <LinkButton
            label=""
            btn-icon="HelpCircle"
            data-test="skill-levels-help-button"
            secondary
            icon-only
          />
        </SkillLevelTip>
      </template>
      <div class="skill-level-inline">
        <SkillSteps
          class="skill-form"
          show-label
          :active-step="mouseOver || form.level"
          @click="onClick"
          @mouseleave="onMouseLeave"
          @mouseover="onMouseOver"
        />
      </div>
    </Field>

    <Field
      :label="$t('profile.edit.skills.mentorship.mentorship')"
      :help="$t('profile.edit.skills.mentorship.notice')"
      :errors="[...errors.needs_mentor, ...errors.can_mentor]"
    >
      <GroupButton
        :model-value="mentorValue"
        :options="options"
        @update:model-value="onUpdateMentor"
      />
    </Field>

    <TextInput
      v-if="form.needs_mentor || form.can_mentor"
      v-model="form.comment"
      :errors="errors.comment"
      class="my2"
      :label="$t('profile.edit.skills.mentorship.comment')"
      input-type="textarea"
      :placeholder="$t('profile.edit.skills.mentorship.comment-placeholder')"
    />
  </div>
</template>

<style lang="scss" scoped>
.skill-tag-card-form {
  width: 100%;
}
</style>

<style lang="scss">
.skill-form {
  svg {
    cursor: pointer;
  }
}

.skill-label-form {
  .label-form {
    justify-content: flex-start;
  }
}

.skill-level-inline {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
}
</style>
