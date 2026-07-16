<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="$t('profile.edit.projects.followed.drawer-title')"
    @close="close"
    @confirm="close"
  >
    <div>
      <div class="search-container">
        <div class="search-group">
          <SearchInput
            v-model="search"
            class="search-input"
            full
            :placeholder="$t('browse.placeholder')"
            @delete-query="search = ''"
          />
        </div>
      </div>
      <div>
        <SearchResults :search="query" mode="projects">
          <template #default="SearchResultsSlotProps">
            <CardList
              :is-loading="SearchResultsSlotProps.isLoading"
              :limit="SearchResultsSlotProps.limit"
              :items="SearchResultsSlotProps.items"
            >
              <template #default="projectListSlotProps">
                <ProjectCard
                  :project="projectListSlotProps.item.project"
                  follow-on-click
                  :target-user-id="targetUserId"
                />
              </template>
            </CardList>
          </template>
        </SearchResults>
      </div>
    </div>

    <template #footer>
      <LpiButton
        :label="$t('header.close')"
        class="footer__right-button"
        data-test="close-button"
        @click="close"
      />
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import SearchResults from '~/components/project/SearchResults.vue'
import SearchInput from '~/components/base/form/SearchInput.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import ProjectCard from '~/components/project/ProjectCard.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'
import CardList from '~/components/base/CardList.vue'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    targetUserId?: number
  }>(),
  {
    isOpened: false,
    targetUserId: null,
  }
)

const emit = defineEmits<{
  close: []
}>()

const organizationCode = useOrganizationCode()

const search = ref('')

const query = computed(() => {
  return {
    search: search.value,
    categories: [],
    tags: [],
    members: [],
    sdgs: [],
    languages: [],
    organizations: [organizationCode],
    ordering: '-updated_at',
    limit: 30,
    page: 1,
    section: 'projects',
  }
})

watch(
  () => props.isOpened,
  () => {
    search.value = ''
  }
)

const close = () => emit('close')
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.clear {
  font-size: variables.$font-size-s;
  color: variables.$primary-dark;
  font-weight: 700;
  text-decoration: underline;
  margin-left: variables.$space-l;
  cursor: pointer;
}

.results-ctn {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: variables.$space-m;
  padding-inline: variables.$space-l;
  padding-bottom: variables.$space-l;

  .selected-card {
    background-color: variables.$primary-lighter;
  }
}

.show-more {
  display: flex;
  justify-content: center;
  margin: variables.$space-l 0;
}

.project-placeholder {
  height: variables.$card_height;
  width: variables.$card_width;
  border: variables.$border-width-s solid variables.$lighter-gray;
  border-radius: variables.$border-radius-m;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: variables.$space-m variables.$space-m 0 variables.$space-m;
    height: 100%;
  }

  .picture {
    display: inline-block;

    $picture-width: 86px;

    width: variables.pxtorem($picture-width);
    height: variables.pxtorem($picture-width);
    border-radius: variables.$border-radius-xs;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    background-color: variables.$lighter-gray;
    box-shadow: 0 0 2px rgb(0 0 0 / 15%);
  }
}
</style>
