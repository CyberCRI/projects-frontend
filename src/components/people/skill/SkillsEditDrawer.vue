<template>
  <BaseDrawer
    ref="root"
    :confirm-action-disabled="asyncing || !addedTalent"
    :confirm-action-name="$t('common.save')"
    :is-opened="isOpen"
    :title="$t(`profile.edit.skills.${type}.drawer.title`)"
    class="medium"
    @close="$emit('close')"
    @confirm="save"
  >
    <div v-if="!addedTalent" class="add-skill-mode">
      <div v-if="!searchAllMode" class="section">
        <p class="notice">
          {{ $t('search.pick-skill-classification') }}
        </p>

        <LpiSelect v-model="selectedClassificationId" :options="orgClassificationOptions" />
      </div>

      <div v-show="searchAllMode || showTagSearch" class="section">
        <p class="notice">
          {{ $t(`profile.edit.skills.${type}.drawer.notice`) }}
        </p>
        <div class="search-field no-shrink">
          <SearchInput
            v-model.trim="search"
            :placeholder="$t(`profile.edit.skills.${type}.drawer.placeholder`)"
            @delete-query="onDeleteQuery"
          />
        </div>
      </div>

      <div v-if="!search.length && suggestedTags.length" class="section">
        <p class="notice">
          {{ $t('profile.edit.skills.suggested-skills') }}
        </p>
        <SuggestedTags
          :current-tags="selectionAsTagIds"
          :suggested-tags="suggestedTags"
          :loading="suggestedTagsAreLoading"
          @add-tag="selectTalent"
        />
      </div>
      <div v-if="search.length" class="section">
        <p v-if="search && searchResultsCount" class="notice no-shrink">
          {{ $t('search.choose-skill') }}
        </p>
        <TagResults
          v-if="search"
          class="flexed-search-results-ctn custom-scrollbar"
          :classification-id="selectedClassificationId"
          :existing-tags="selectionAsTagIds"
          :search="search"
          :search-all="searchAllMode"
          type="skills"
          @add-tag="selectTalent"
          @results-count="searchResultsCount = $event"
        />
      </div>
    </div>
    <div v-else class="edit-skill-mode">
      <p class="notice">
        {{ $t(`profile.edit.skills.${type}.drawer.notice-levels`) }}

        <SkillLevelTip>
          <a href="#" class="help-link">
            <IconImage name="HelpCircle" class="help-icon" />
            {{ $t(`profile.edit.skills.${type}.drawer.help-levels`) }}
          </a>
        </SkillLevelTip>
      </p>

      <div class="level-editor-list">
        <SkillEditor
          :skill="addedTalent"
          :type="type"
          no-mentorship
          @set-level="setTalentLevel($event.skill, $event.level)"
          @delete="addedTalent = null"
        />
      </div>
      <div class="mentorship">
        <MentorshipForm v-model="mentorship" />
      </div>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { postUserSkill } from 'shared-projects-frontend/apis'

import SuggestedTags from '~/components/search/FilterTags/SuggestedTags.vue'
import type { SkillType } from '~/components/people/skill/SkillEditor.vue'
import MentorshipForm from '~/components/people/skill/MentorshipForm.vue'
import SkillLevelTip from '~/components/people/skill/SkillLevelTip.vue'
import TagResults from '~/components/search/FilterTags/TagResults.vue'
import SkillEditor from '~/components/people/skill/SkillEditor.vue'
import SearchInput from '~/components/base/form/SearchInput.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import LpiSelect from '~/components/base/form/LpiSelect.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useToasterStore from '~/stores/useToaster'

import type { TranslatedUserModel, SkillModel } from 'shared-projects-frontend/models'
import useSkillTexts from '~/composables/useSkillTexts'
import useTagSearch from '~/composables/useTagSearch'
import { defaultMentorship } from '~/form/mentorship'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    type: SkillType
    user: TranslatedUserModel
    searchAllMode?: boolean
  }>(),
  {
    searchAllMode: false,
  }
)

const { t } = useNuxtI18n()

const reloadUser = inject<() => void>('profileEditReloadUser', () => () => {})

const emit = defineEmits<{
  close: []
  'switch-mode': []
  confirm: []
  'skill-added': [SkillModel]
}>()

const toaster = useToasterStore()
const skillTexts = useSkillTexts()
const {
  suggestedTagsAreLoading,
  selectedClassificationId,
  search,
  suggestedTags,
  orgClassificationOptions,
  showTagSearch,
  resetTagSearch,
} = useTagSearch({ useSkills: true })

const selection = ref([])
const asyncing = ref(false)
const searchResultsCount = ref(0)
const addedTalent = ref(null)
const mentorship = ref(defaultMentorship())

const selectionAsTagIds = computed(() => selection.value.map((s) => s.tag?.id))
const allSkills = computed(() => props.user.skills || [])

const skills = computed(() => allSkills.value.filter((s) => s.type === 'skill'))
const hobbies = computed(() => allSkills.value.filter((s) => s.type === 'hobby'))

const rootRef = useTemplateRef('root')
const focusInput = () => {
  const searchInput = rootRef.value.$el.querySelector('.search-field input')
  nextTick(() => {
    searchInput?.focus()
  })
}

watch(
  () => props.isOpen,
  (neo) => {
    if (neo) {
      addedTalent.value = null
      search.value = ''
      selection.value = getSkillOfType(props.type)
        ? getSkillOfType(props.type).map((item) => ({ ...toRaw(item) }))
        : []

      resetTagSearch()
      mentorship.value = defaultMentorship()
      nextTick(focusInput)
    }
  }
)

const getSkillOfType = (type: SkillType) => {
  switch (type) {
    case 'hobbies':
      return hobbies.value
    case 'skills':
      return skills.value
  }
}

const onDeleteQuery = () => (search.value = '')

const save = async () => {
  // save selection
  asyncing.value = true

  try {
    const newSkill = await postUserSkill(props.user.id, {
      ...addedTalent.value,
      tag: addedTalent.value.tag.id,
      ...mentorship.value,
    })
    reloadUser()
    emit('skill-added', newSkill)
    toaster.pushSuccess(
      t(`profile.edit.skills.${props.type}.add-success`, {
        name: skillTexts.title(addedTalent.value),
      })
    )
  } catch (error) {
    console.error(error)
    if (error?.response?.status === 409) {
      toaster.pushError(t(`profile.edit.skills.${props.type}.already-added`))
    } else {
      toaster.pushError(t('profile.edit.skills.save-error'))
    }
  } finally {
    asyncing.value = false
    emit('close')
  }
}
const selectTalent = (tag) => {
  const skill = {
    tag: tag,
    level: 1,
    level_to_reach: 1,
    type: props.type == 'hobbies' ? 'hobby' : 'skill',
    category: '', // TODO: check what this is
    user: props.user.id,
  }
  addedTalent.value = skill
}
const setTalentLevel = (talent, level) => {
  talent.level = level
}
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.no-shrink {
  flex-shrink: 0;
}

.add-skill-mode {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .notice {
    font-size: variables.$font-size-m;
    margin-bottom: variables.$space-s;
  }

  .selected-list {
    margin-top: variables.$space-m;
    display: flex;
    flex-flow: row wrap;
    gap: variables.$space-m;
  }

  .search-field {
    margin-top: variables.$space-m;
    display: flex;
    justify-content: stretch;
    align-items: center;
    gap: 1rem;

    .search-input-ctn {
      flex-grow: 1;

      :deep(.search-input) {
        width: 100%;
      }
    }
  }

  .flexed-search-results {
    overflow: auto;
  }

  .search-results {
    margin-top: variables.$space-42;
    display: flex;
    flex-flow: row wrap;
    gap: variables.$space-s;
    background-color: variables.$primary-lighter;
    border-radius: variables.$space-s;
    padding: variables.$space-s;
  }

  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: variables.$space-xl;
  }
}

.edit-skill-mode {
  .notice {
    margin-top: variables.$space-m;
  }

  .help-link {
    color: variables.$primary-dark;
    text-decoration: underline;
    font-weight: 700;
  }

  .help-icon {
    width: variables.$layout-size-l;
    height: variables.$layout-size-l;
    fill: variables.$primary-dark;
    display: inline-block;
    vertical-align: middle;
  }
}

.section + .section {
  margin-top: variables.$space-l;
}

.level-editor-list {
  margin-top: variables.$space-xl;
}
</style>
