<script setup lang="ts">
import MentorshipContactDrawer from '~/components/people/skill/MentorshipContactDrawer.vue'
import type { TranslatedSkill, TranslatedUserModel } from 'shared-projects-frontend/models'
import SkillSteps from '~/components/people/skill/SkillSteps.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import type { UserMentorShip } from '~/interfaces/mengtorship'
import useUsersStore from '~/stores/useUserStore'

const props = withDefaults(
  defineProps<{
    skill: TranslatedSkill
    user: TranslatedUserModel
    canDelete?: boolean
    canEdit?: boolean
    mode?: 'minimal' | 'medium' | 'full'
    userMentoring?: UserMentorShip | null
  }>(),
  {
    canDelete: false,
    canEdit: false,
    mode: 'full',
    userMentoring: null,
  }
)

const { stateModals, openModals, closeModals } = useModals({
  askMentor: false,
  offerMentor: false,
})

const emit = defineEmits<{
  'mentorship-send': []
  delete: []
  edit: []
}>()

const userStores = useUsersStore()
const isSelf = computed(() => userStores.id === props.user.id)
</script>

<template>
  <div class="skill">
    <div class="skill-header">
      <SkillLevelTip>
        <BadgeItem colors="grey" class="badge">
          <SkillSteps :active-step="skill.level" class="steps" />
        </BadgeItem>
      </SkillLevelTip>
      <h3 class="title skeletons-text">
        {{ skill.tag.$t.title }}
      </h3>
      <ContextActionMenuInline
        class="actions"
        :can-delete="canDelete"
        :can-edit="canEdit"
        @delete="emit('delete')"
        @edit="emit('edit')"
      />
    </div>
    <p v-if="mode !== 'minimal'" class="description skeletons-text">
      {{ skill.tag.$t.description }}
    </p>

    <div class="skill-button skeletons-background">
      <template v-if="skill.can_mentor">
        <BadgeItem
          v-if="isSelf || mode === 'minimal'"
          icon-name="HelpCircle"
          :label="$t('profile.mentorship-offering')"
        />
        <BadgeItem
          v-else-if="userMentoring === 'mentoree'"
          icon-name="HelpCircle"
          :label="$t('profile.mentorship-asked')"
        />
        <NeedLoginToolTip v-else>
          <template #default="{ needLogin }">
            <LpiButton
              :disabled="needLogin"
              secondary
              btn-icon="EmailOutline"
              :label="$t('profile.ask-mentorship')"
              @click="openModals('askMentor')"
            />
          </template>
        </NeedLoginToolTip>
      </template>

      <template v-if="skill.needs_mentor">
        <BadgeItem
          v-if="isSelf || mode === 'minimal'"
          icon-name="HelpCircle"
          :label="$t('profile.mentorship-asking')"
        />
        <BadgeItem
          v-else-if="userMentoring === 'mentor'"
          icon-name="HelpCircle"
          :label="$t('profile.mentorship-offered')"
        />
        <NeedLoginToolTip v-else>
          <template #default="{ needLogin }">
            <LpiButton
              :disabled="needLogin"
              secondary
              btn-icon="EmailOutline"
              :label="$t('profile.offer-mentorship')"
              @click="openModals('offerMentor')"
            />
          </template>
        </NeedLoginToolTip>
      </template>
    </div>

    <!-- drawer -->
    <MentorshipContactDrawer
      :skill="skill"
      :is-open="stateModals.offerMentor || stateModals.askMentor"
      :is-offer="stateModals.offerMentor"
      @close="closeModals('askMentor', 'offerMentor')"
      @mentorship-send="emit('mentorship-send')"
    />
  </div>
</template>

<style lang="scss" scoped>
.skill {
  display: grid;
  position: relative;
  grid-template-rows: 2rem auto auto;

  .skill-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.2rem;
  }

  .badge {
    width: fit-content;
  }

  .title {
    font-size: 1.4rem;
  }

  .description {
    font-style: italic;
    opacity: 0.8;
  }
}

.skill-button {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 0.2rem;
}

.actions {
  position: absolute;
  right: 0;
}
</style>
