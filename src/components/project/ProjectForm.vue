<template>
  <form>
    <!--  Category -->
    <div v-if="isAddMode && categories && categories.length" class="category-ctn">
      <label class="label">{{ $t('project.form.project-category') }} *</label>
      <ProjectCategoriesDropdown
        ref="categoryDropdown"
        class="category-select"
        data-test="select-project-category"
        :dropdown-label="selectedCategoryLabel"
      >
        <template #default="{ category }">
          <ProjectCategoriesDropdownElementButton
            :category="category"
            @choose-category="setCategory(category.id)"
          />
        </template>
      </ProjectCategoriesDropdown>
    </div>

    <!--  Title -->
    <FieldDisabler :disabled="otherFieldDisabled">
      <TextInput
        v-model="form.title"
        :placeholder="titlePlaceholder"
        :unfocusable="otherFieldDisabled"
        space-below-label="large-space"
        data-test="title-input"
        @blur="validation.form.title.$touch"
      >
        <label>{{
          isAddMode ? `${$t('project.form.title-label')} *` : `${$t('project.form.edit-title')} *`
        }}</label>
      </TextInput>
      <FieldErrors :errors="validation.form.title.$errors" />
    </FieldDisabler>

    <!-- Purpose -->
    <FieldDisabler :disabled="otherFieldDisabled" class="purpose-input">
      <TextInput
        v-model="form.purpose"
        :placeholder="purposePlaceholder"
        :unfocusable="otherFieldDisabled"
        data-test="purpose-input"
        space-below-label="large-space"
        @blur="validation.form.purpose.$touch"
      >
        <label>{{ $t('project.form.purpose-label') + ' *' }}</label>
      </TextInput>
      <FieldErrors :errors="validation.form.purpose.$errors" />
    </FieldDisabler>

    <!-- Team -->
    <FieldDisabler v-if="isAddMode" :disabled="otherFieldDisabled" class="team">
      <TeamSection
        :selected-category="selectedCategory"
        :unfocusable="otherFieldDisabled"
        @update-team="updateTeam"
      />
    </FieldDisabler>

    <!-- Tag -->
    <FieldDisabler :disabled="otherFieldDisabled" class="tags">
      <label>
        {{ $filters.capitalize($t('tag.title')) }}
        <span
          v-disable-focus="otherFieldDisabled"
          class="add-tags"
          data-test="tags"
          @click="tagSearchIsOpened = true"
        >
          <IconImage name="Plus" />
          <span>{{ $filters.capitalize($t('project.form.add-tags')) }}</span>
        </span>
      </label>
      <TagsFilterSummary v-model="tags" />
    </FieldDisabler>

    <div class="spacer" />

    <!-- Picture -->
    <FieldDisabler :disabled="otherFieldDisabled" class="img-ctn">
      <label>{{ $filters.capitalize($t('project.image-header')) }}</label>
      <ImageEditor
        v-model:image-sizes="form.imageSizes"
        v-model:picture="form.header_image"
        :picture-alt="`${form.last_name} image`"
        :contain="true"
        :default-picture="defaultPictures"
        :disabled="otherFieldDisabled"
      />
    </FieldDisabler>

    <!-- Language -->
    <FieldDisabler :disabled="otherFieldDisabled" class="language">
      <label>{{ $filters.capitalize($t('project.language')) }}</label>
      <LpiSelect
        v-model="form.language"
        :value="form.language"
        :options="languageOptions"
        class="category-select"
        data-test="select-language"
      />
    </FieldDisabler>

    <BaseDrawer
      :confirm-action-name="$t('common.confirm')"
      :is-opened="tagSearchIsOpened"
      :title="$t('project.form.add-tags')"
      class="medium"
      @close="closeTagSearchTags"
      @confirm="saveTags"
    >
      <TagsFilterEditor
        v-model="tags"
        :value="tags"
        :progressive-update="false"
        hide-current-tags-separator
        @update-tags="updateTagsInProcess"
      />
    </BaseDrawer>
  </form>
</template>

<script>
import TextInput from '@/components/base/form/TextInput.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import ProjectCategoriesDropdown from '@/components/category/ProjectCategoriesDropdown.vue'
import ProjectCategoriesDropdownElementButton from '@/components/category/ProjectCategoriesDropdownElementButton.vue'
import TeamSection from '@/components/project/TeamSection.vue'
import FieldDisabler from '@/components/base/form/FieldDisabler.vue'
import TagsFilterSummary from '@/components/search/Filters/TagsFilterSummary.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useLanguagesStore from '@/stores/useLanguages'
import { useRuntimeConfig } from '#imports'

export default {
  name: 'ProjectForm',

  components: {
    TextInput,
    TeamSection,
    LpiSelect,
    FieldDisabler,
    TagsFilterEditor,
    IconImage,
    TagsFilterSummary,
    BaseDrawer,
    ImageEditor,
    FieldErrors,
    ProjectCategoriesDropdown,
    ProjectCategoriesDropdownElementButton,
  },
  props: {
    isAddMode: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: Object,
      required: true,
    },
    validation: {
      type: Object,
      default: () => {},
    },
    categories: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update:modelValue', 'close'],

  setup() {
    const languagesStore = useLanguagesStore()
    const runtimeConfig = useRuntimeConfig()
    return {
      languagesStore,
      runtimeConfig,
    }
  },

  data() {
    const defaultPictures = [1, 2, 3, 4, 5, 6].map((index) => {
      return `${
        this.runtimeConfig.public.appPublicBinariesPrefix
      }/patatoids-project/Patatoid-${index}.png`
    })

    return {
      loading: false,
      displayedImage: '',
      selectedCategory: undefined,
      form: JSON.parse(JSON.stringify(this.modelValue)),
      tags: [...this.modelValue.tags],
      tagSearchIsOpened: false,
      showImageResizer: false,
      tagsInProcess: [],
      defaultPictures,
    }
  },

  computed: {
    selectedCategoryLabel() {
      return this.selectedCategory
        ? this.selectedCategory.name
        : this.$t('project.form.select-category')
    },

    languageOptions() {
      return this.languagesStore.all.map((language) => {
        return {
          value: language,
          label: this.$t(`language.label-${language}`),
          dataTest: `project-form-${language}`,
        }
      })
    },

    titlePlaceholder() {
      if (
        this.selectedCategory &&
        this.selectedCategory.template &&
        this.selectedCategory.template.title_placeholder
      )
        return this.selectedCategory.template.title_placeholder
      return this.$t('project.form.title-placeholder')
    },

    purposePlaceholder() {
      if (
        this.selectedCategory &&
        this.selectedCategory.template &&
        this.selectedCategory.template.goal_placeholder
      )
        return this.selectedCategory.template.goal_placeholder
      return this.$t('project.form.purpose-placeholder')
    },

    otherFieldDisabled() {
      return (
        this.isAddMode && !!this.categories && this.categories.length > 0 && !this.form.category
      )
    },
  },

  watch: {
    'form.category': async function (categoryId, oldVal) {
      if (categoryId && categoryId !== oldVal)
        this.selectedCategory = this.categories.find((category) => category.id === categoryId)
      // set default tags according to selected category
      this.tags = [...this.selectedCategory.tags]
    },

    form: {
      deep: true,
      handler: function () {
        this.$emit('update:modelValue', this.form)
      },
    },

    tags: {
      handler() {
        this.updateTags()
      },
      deep: true,
    },
  },

  async mounted() {
    if (this.isAddMode) {
      if (this.$route.query.category) {
        this.form.category = parseInt(this.$route.query.category)
      }
    }
  },

  methods: {
    setCategory(categoryId) {
      this.form.category = categoryId
      this.$refs.categoryDropdown?.close()
    },
    closeTagSearchTags() {
      this.tagSearchIsOpened = false
    },

    saveTags() {
      this.tags = this.tagsInProcess
      this.tagSearchIsOpened = false
    },

    updateTags() {
      this.form.tags = this.tags
    },

    updateTeam(team) {
      this.form.team.members = []
      this.form.team.owners = []
      this.form.team.reviewers = []
      this.form.team.owner_groups = []
      this.form.team.reviewer_groups = []
      this.form.team.member_groups = []

      team.forEach((user) => {
        this.form.team[user.role].push(user.user.id)
      })
    },

    updateTagsInProcess(tags) {
      this.tagsInProcess = tags
    },
  },
}
</script>

<style lang="scss" scoped>
.project-form {
  .purpose-input {
    margin: $space-xl 0;
  }

  .category-ctn {
    margin-bottom: $space-xl;
  }

  .category-select {
    width: 100%;

    select {
      width: 100%;
    }
  }

  .team,
  .tags {
    margin-bottom: $space-xl;
  }

  .completed-form-snackbar {
    width: fit-content;
    margin: $space-xl auto;
    border: $border-width-s solid $salmon;
  }

  .language {
    margin-bottom: $space-xl;
  }

  .img-ctn {
    margin-bottom: $space-xl;
    display: flex;
    flex-direction: column;
    align-items: center;

    label {
      align-self: flex-start;
    }
  }

  .tags label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    margin-bottom: $space-l;

    .section-title {
      font-size: $font-size-s;
      color: $black;
      font-weight: bold;
      display: block;
    }

    .add-tags {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background: $white;
      color: $primary-dark;
      cursor: pointer;
      font-weight: 700;

      svg {
        width: 18px;
        fill: $primary-dark;
      }
    }
  }

  label {
    margin-bottom: $space-l;
    font-size: $font-size-m;
    color: $black;
    font-weight: bold;
    display: block;
  }

  .spacer {
    border-top: 1px solid $lighter-gray;
    margin-bottom: 34px;
  }
}
</style>
