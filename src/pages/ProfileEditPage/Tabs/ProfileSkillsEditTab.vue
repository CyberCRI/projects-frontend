<template>
  <div class="profile-edit-skills">
    <div class="header">
      <LinkButton
        class="edit-btn"
        btn-icon="Eye"
        :label="$t('profile.edit.back-to-profile')"
        :to="profileSkillLink"
        data-test="edit-bio"
      />
    </div>
    <div v-if="isInitial" class="initial-screen">
      <p class="intro">
        {{ $t('profile.edit.skills.intro') }}
      </p>
      <div class="actions">
        <LpiButton
          :label="$filters.capitalize($t('profile.edit.skills.skills.add-item'))"
          btn-icon="Plus"
          data-test="initial-add-skills-button"
          @click="openDrawer('skills', 'add')"
        />
        <LpiButton
          :label="$filters.capitalize($t('profile.edit.skills.hobbies.add-item'))"
          btn-icon="Plus"
          data-test="initial-add-hobbies-button"
          @click="openDrawer('hobbies', 'add')"
        />
      </div>
    </div>
    <div v-else class="following-screen">
      <div v-for="key in ['skills', 'hobbies']" :key="key" :class="key">
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
            <LinkButton
              :label="$filters.capitalize($t(`profile.edit.skills.${key}.add-item`))"
              btn-icon="Plus"
              :data-test="`add-${key}-button`"
              @click="openDrawer(key)"
            />
          </div>
        </template>
        <div v-else class="add-action">
          <LpiButton
            :label="$filters.capitalize($t(`profile.edit.skills.${key}.add-item`))"
            btn-icon="Plus"
            :secondary="false"
            :data-test="`initial-add-${key}-button`"
            @click="openDrawer(key, 'add')"
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
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import SkillsEditDrawer from '@/components/people/skill/SkillsEditDrawer.vue'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import { patchUserSkill, deleteUserSkill } from '@/api/people.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import SkillEditor from '@/components/people/skill/SkillEditor.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'
import useSkillLevels from '@/composables/useSkillLevels.js'
import useUsersStore from '@/stores/useUsers.ts'
export default {
  name: 'ProfileSkillsEditTab',
  components: {
    LpiButton,
    SkillsEditDrawer,
    SkillLevelTip,
    LinkButton,
    SkillEditor,
  },

  inject: {
    reloadUser: {
      from: 'profileEditReloadUser',
      default: () => () => {},
    },
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  emits: ['edited', 'profile-edited'],

  setup() {
    const skillTexts = useSkillTexts()
    const toaster = useToasterStore()
    const usersStore = useUsersStore()
    const { skillLevels, clampLevel } = useSkillLevels()
    return { skillTexts, toaster, usersStore, skillLevels, clampLevel }
  },
  data() {
    return {
      drawerType: 'skills', // skills | hobbies
      drawerMode: 'add', // add | edit
      drawerIsOpen: false,
      lastAddedTalent: null,
    }
  },
  computed: {
    isInitial() {
      return (
        !this.user ||
        ((!this.skills || this.skills.length === 0) && (!this.hobbies || this.hobbies.length === 0))
      )
    },
    allSkills() {
      return this.user.skills || []
    },
    skills() {
      return [
        ...this.allSkills.filter((s) => s.type === 'skill').sort(this.skillTexts.compareTitles),
      ]
    },
    hobbies() {
      return this.allSkills.filter((s) => s.type === 'hobby').sort(this.skillTexts.compareTitles)
    },

    isSelf() {
      const connectedUser = this.usersStore.userFromApi
      return connectedUser && this.user.id === connectedUser.id
    },

    profileSkillLink() {
      return {
        name: 'ProfileSkills' + (this.isSelf ? '' : 'Other'),
        params: this.isSelf ? {} : { userId: this.user.slug || this.user.id },
      }
    },
  },

  methods: {
    onSkillAdded(newSkill) {
      this.lastAddedTalent = newSkill.id
      this.$emit('profile-edited')
    },
    async setTalentLevel(type, talent, newLevel) {
      if (this.clampLevel(talent.level) !== newLevel) {
        try {
          await patchUserSkill(this.user.id, talent.id, {
            ...talent,
            level: newLevel,
            tag: talent.tag.id,
          })
          this.toaster.pushSuccess(
            this.$t(`profile.edit.skills.${type}.edit-success`, {
              name: this.skillTexts.title(talent),
            })
          )
          this.reloadUser()
          this.$emit('profile-edited')
        } catch (error) {
          console.error(error)
          this.toaster.pushError(this.$t('profile.edit.skills.save-error'))
        }
      }
    },

    async updateMentorship(type, data, talent) {
      try {
        await patchUserSkill(this.user.id, data.id, {
          ...data,
        })
        this.toaster.pushSuccess(
          this.$t(`profile.edit.skills.${type}.edit-success`, {
            name: this.skillTexts.title(talent),
          })
        )
        this.reloadUser()
        this.$emit('profile-edited')
      } catch (error) {
        console.error(error)
        this.toaster.pushError(this.$t('profile.edit.skills.save-error'))
      }
    },
    async removeTalent(type, talent) {
      try {
        await deleteUserSkill(this.user.id, talent.id)
        this.toaster.pushSuccess(
          this.$t(`profile.edit.skills.${type}.delete-success`, {
            name: this.skillTexts.title(talent),
          })
        )
        this.reloadUser()
        this.$emit('profile-edited')
      } catch (error) {
        console.error(error)
        this.toaster.pushError(this.$t('profile.edit.skills.save-error'))
      }
    },

    openDrawer(type) {
      this.drawerType = type
      this.drawerIsOpen = true
    },
    closeDrawer() {
      this.drawerIsOpen = false
      this.$emit('edited')
    },

    getSkillOfType(type) {
      if (type == 'skills') return this.skills
      else return this.hobbies
    },
  },
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
  .actions {
    margin-top: $space-xl;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .add-action {
    margin-top: $space-xl;
    display: flex;
    justify-content: center;
    align-items: center;
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
  padding: $space-l 0;
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

.header {
  padding-top: $space-m;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
