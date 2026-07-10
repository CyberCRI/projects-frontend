<template>
  <div class="profile-edit-skills">
    <!--div class="header">
      <LinkButton
        class="edit-btn"
        btn-icon="Eye"
        :label="$t('profile.edit.back-to-profile')"
        :to="profileSkillLink"
        data-test="edit-bio"
      />
    </div-->
    <div v-if="isInitial" class="initial-screen">
      <p class="intro">
        {{ $t('profile.edit.skills.intro') }}
      </p>
      <div class="actions">
        <LpiButton
          :label="$t('profile.edit.skills.skills.add-item')"
          btn-icon="Plus"
          data-test="initial-add-skills-button"
          @click="openDrawer('skills')"
        />
        <LpiButton
          :label="$t('profile.edit.skills.hobbies.add-item')"
          btn-icon="Plus"
          data-test="initial-add-hobbies-button"
          @click="openDrawer('hobbies')"
        />
      </div>
    </div>
    <div v-else class="following-screen">
      <div
        v-for="key in ['skills', 'hobbies'] satisfies SkillType[]"
        :key="key"
        :class="key"
        class="following-screen-inner"
      >
        <template v-if="getSkillOfType(key).length">
          <TransitionGroup tag="div" name="skill" class="level-editor-list">
            <div :key="`${key}-header`" class="skill-columns-header">
              <div class="skill-name">
                <span class="column-label">{{ $t(`profile.edit.skills.${key}.selection`) }}</span>
              </div>
              <div class="skill-level">
                <span class="column-label">{{ $t(`profile.edit.skills.${key}.levels-help`) }}</span>
                <SkillLevelTip>
                  <LinkButton
                    label=""
                    btn-icon="HelpCircle"
                    data-test="skill-levels-help-button"
                    secondary
                    icon-only
                  />
                </SkillLevelTip>
              </div>
              <div class="mentorship">
                <span class="column-label">
                  {{ $t(`profile.edit.skills.mentorship.mentorship`) }}
                </span>
              </div>
              <div class="edit-action">&nbsp;</div>
              <div class="delete-action">&nbsp;</div>
            </div>
            <SkillEditor
              v-for="skill in getSkillOfType(key)"
              :key="skill.id"
              :skill="skill"
              :type="key"
              :data-skill-id="skill.id"
              :scroll-into-view="lastAddedTalent === skill.id"
              @set-level="setTalentLevel(key, $event.skill, $event.level)"
              @update-mentorship="updateMentorship(key, $event, skill)"
              @delete="removeTalent(key, $event)"
            />
          </TransitionGroup>
          <div class="actions">
            <LpiButton
              :label="$t(`profile.edit.skills.${key}.add-item`)"
              btn-icon="Plus"
              :data-test="`add-${key}-button`"
              @click="openDrawer(key)"
            />
          </div>
        </template>
        <div v-else class="add-action">
          <p class="intro">
            {{ $t(`profile.edit.skills.${key}.nothing-yet`) }}
          </p>
          <LpiButton
            :label="$t(`profile.edit.skills.${key}.add-item`)"
            btn-icon="Plus"
            :data-test="`initial-add-${key}-button`"
            @click="openDrawer(key)"
          />
        </div>
      </div>
    </div>
  </div>
  <SkillsEditDrawer
    :is-open="drawerIsOpen"
    :user="user"
    :type="drawerType"
    @close="closeDrawer"
    @switch-mode="drawerMode = $event"
    @skill-added="onSkillAdded"
  />
</template>

<script setup lang="ts">
import { deleteUserSkill, patchUserSkill } from 'shared-projects-frontend/apis'
import type { SkillType } from '~/components/people/skill/SkillEditor.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

import useToasterStore from '~/stores/useToaster'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const emit = defineEmits<{
  edited: []
  'profile-edited': []
}>()

const { t } = useNuxtI18n()

const skillTexts = useSkillTexts()
const toaster = useToasterStore()
const { clampLevel } = useSkillLevels()

const drawerType = ref<SkillType>('skills')
const drawerMode = ref<'add' | 'edit'>('add')
const drawerIsOpen = ref(false)
const lastAddedTalent = ref(null)

const allSkills = computed(() => props.user.skills || [])

const skills = computed(() => {
  return [
    ...(allSkills.value || []).filter((s) => s.type === 'skill').sort(skillTexts.compareTitles),
  ]
})

const hobbies = computed(() => {
  return (allSkills.value || []).filter((s) => s.type === 'hobby').sort(skillTexts.compareTitles)
})

const isInitial = computed(() => {
  return (
    !props.user ||
    ((!skills.value || skills.value.length === 0) && (!hobbies.value || hobbies.value.length === 0))
  )
})

const reloadUser = () => emit('profile-edited')

const onSkillAdded = (newSkill) => {
  lastAddedTalent.value = newSkill.id
  reloadUser()
}

const setTalentLevel = async (type, talent, newLevel) => {
  if (clampLevel(talent.level) !== newLevel) {
    try {
      await patchUserSkill(props.user.id, talent.id, {
        ...talent,
        level: newLevel,
        tag: talent.tag.id,
      })
      toaster.pushSuccess(
        t(`profile.edit.skills.${type}.edit-success`, {
          name: skillTexts.title(talent),
        })
      )
      reloadUser()
    } catch (error) {
      console.error(error)
      toaster.pushError(t('profile.edit.skills.save-error'))
    }
  }
}

const updateMentorship = async (type, data, talent) => {
  try {
    await patchUserSkill(props.user.id, data.id, {
      ...data,
    })
    toaster.pushSuccess(
      t(`profile.edit.skills.${type}.edit-success`, {
        name: skillTexts.title(talent),
      })
    )
    reloadUser()
  } catch (error) {
    console.error(error)
    toaster.pushError(t('profile.edit.skills.save-error'))
  }
}

const removeTalent = async (type, talent) => {
  try {
    await deleteUserSkill(props.user.id, talent.id)
    toaster.pushSuccess(
      t(`profile.edit.skills.${type}.delete-success`, {
        name: skillTexts.title(talent),
      })
    )
    reloadUser()
  } catch (error) {
    console.error(error)
    toaster.pushError(t('profile.edit.skills.save-error'))
  }
}

const openDrawer = (type: SkillType) => {
  drawerType.value = type
  drawerIsOpen.value = true
}

const closeDrawer = () => {
  drawerIsOpen.value = false
  emit('edited')
}

const getSkillOfType = (type: SkillType) => {
  switch (type) {
    case 'hobbies':
      return hobbies.value
    case 'skills':
      return skills.value
  }
}
</script>

<style scoped lang="scss">
@import './profile-form';

.initial-screen {
  .intro {
    margin-top: $space-xl;
    text-align: center;
    font-size: $font-size-m;
  }

  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $space-unit;
    margin-top: $space-xl;
  }
}

.following-screen {
  .following-screen-inner + .following-screen-inner {
    padding-top: 2rem;
    margin-top: 2rem;
    border-top: $border-width-s solid $primary;
  }

  .actions {
    margin-top: $space-xl;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .add-action {
    .intro {
      margin-bottom: 1.4rem;
    }

    margin-top: $space-xl;
  }

  .skill-list {
    margin-top: $space-xl;
    background-color: $primary-lighter;
    padding: $space-l pxToRem(17px);
    display: flex;
    flex-flow: column nowrap;
    gap: $space-m;
    border-radius: $border-radius-l;
  }
}

.talent-title {
  font-size: $font-size-l;
  font-weight: 700;
  color: $primary-dark;
  margin-top: $space-l;
  margin-bottom: $space-m;
  text-align: center;
}

.level-editor-list {
  margin-top: $space-xl;
  position: relative;
}

.skill-columns-header {
  display: flex;
  justify-content: stretch;
  gap: $space-unit;
  align-items: center;
  padding-bottom: $space-l;
  border-bottom: $border-width-s solid $primary;

  .column-label {
    font-weight: 700;
    text-transform: uppercase;
    color: $primary-dark;
  }

  .skill-name {
    flex-basis: 30%;

    @media screen and (max-width: $min-tablet) {
      flex-basis: 100%;
      text-align: center;
    }
  }

  .skill-level {
    flex-basis: 40%;
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: $min-tablet) {
      display: none;
    }
  }

  .mentorship {
    display: flex;
    justify-content: center;
    flex-basis: 30%;

    @media screen and (max-width: $min-tablet) {
      display: none;
    }
  }

  .delete-action,
  .edit-action {
    flex-shrink: 0;
    flex-basis: $layout-size-l;

    @media screen and (max-width: $min-tablet) {
      display: none;
    }
  }
}
</style>
