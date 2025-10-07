<template>
  <div class="templates-tab">
    <LpiSnackbar border icon="QuestionMark" type="info" class="snackbar">
      <div v-html="$t('template.info')" />
    </LpiSnackbar>

    <div class="form">
      <div class="block-container">
        <h4 class="title">
          {{ $t('template.category') }}
        </h4>
        <span class="description">{{ $t('template.tips-category') }}</span>
        <ProjectCategoriesDropdown
          ref="categoryDropdown"
          class="category-select"
          data-test="select-project-category"
          :dropdown-label="selectedCategoryLabel"
        >
          <template #default="{ category }">
            <ProjectCategoriesDropdownElementButton
              :category="category"
              @choose-category="setCategory(category)"
              @blur="v$.selectedCategory.id.$touch"
            />
          </template>
        </ProjectCategoriesDropdown>
        <FieldErrors :errors="v$.selectedCategory?.id.$errors" />
      </div>
      <div v-if="fetchingTemplate" class="loader">
        <LoaderSimple />
      </div>
      <FieldDisabler :disabled="otherFieldDisabled">
        <div class="block-container">
          <div class="title-button-ctn">
            <h4 class="title">
              {{ $t('template.tags') }}
            </h4>
            <LpiButton
              :label="$filters.capitalize($t('tag.edit'))"
              @click="tagSearchIsOpened = true"
            />
          </div>

          <div v-if="form.tags.length" class="tag-grid">
            <FilterValue
              v-for="tag in form.tags"
              :key="tag.id"
              :label="tagTitle(tag)"
              icon="Close"
              @click="deleteOrganizationTag(tag)"
            />
          </div>

          <span v-if="!form.tags.length" class="description">{{ $t('template.no-tag-set') }}</span>
        </div>
      </FieldDisabler>

      <!-- TODO: delete or uncomment when we decide what to do about languages in categories -->
      <!-- <div class="block-container">
          <h4 class="title">{{ $t('template.language') }}</h4>
          <LpiSelect v-model="form.language" :options="languagesOptions" />
      </div> -->

      <div class="block-container template-container form">
        <h4 class="title">
          {{ $t('template.title') }}
        </h4>

        <FieldDisabler :disabled="otherFieldDisabled">
          <TextInput v-model="form.title" :label="$t('template.placeholder-title')" />
        </FieldDisabler>

        <FieldDisabler :disabled="otherFieldDisabled">
          <TextInput v-model="form.purpose" :label="$t('template.placeholder-purpose')" />
        </FieldDisabler>

        <FieldDisabler :disabled="otherFieldDisabled">
          <label class="label">{{ $filters.capitalize($t('template.description')) }}</label>
          <TipTapEditor
            :key="`description-${editorKey}`"
            v-model="form.description"
            :save-image-callback="saveTemplateImage"
            mode="full"
          />
        </FieldDisabler>

        <FieldDisabler :disabled="otherFieldDisabled">
          <TextInput
            v-model="form.blogTitle"
            :label="$filters.capitalize($t('template.blog-title'))"
          />
        </FieldDisabler>

        <FieldDisabler :disabled="otherFieldDisabled">
          <label class="label">{{ $filters.capitalize($t('template.blog-content')) }}</label>
          <TipTapEditor
            :key="`blog-${editorKey}`"
            v-model="form.blogContent"
            :save-image-callback="saveTemplateImage"
            mode="full"
          />
        </FieldDisabler>

        <FieldDisabler :disabled="otherFieldDisabled">
          <TextInput
            v-model="form.goalTitle"
            :label="$filters.capitalize($t('template.advancement-goal-title'))"
          />
        </FieldDisabler>

        <FieldDisabler :disabled="otherFieldDisabled">
          <label class="label">
            {{ $filters.capitalize($t('template.advancement-goal-content')) }}
          </label>
          <TipTapEditor
            :key="`advancement-goal-${editorKey}`"
            v-model="form.goal_description"
            :save-image-callback="saveTemplateImage"
            data-test="template-advancement-goal-content-editor"
            mode="full"
          />
        </FieldDisabler>

        <FieldDisabler :disabled="otherFieldDisabled">
          <label class="label">
            {{ $filters.capitalize($t('template.comment')) }}
          </label>

          <TipTapEditor
            :key="`comment-${editorKey}`"
            v-model="form.comment"
            :save-image-callback="saveTemplateImage"
            class="comment-description"
            mode="full"
            data-test="template-comment-editor"
          />
        </FieldDisabler>

        <div class="form-actions">
          <LpiButton
            :disabled="otherFieldDisabled"
            :label="$filters.capitalize($t('common.save'))"
            :btn-icon="isLoading ? 'LoaderSimple' : null"
            color="green"
            @click="submit"
          />
        </div>
      </div>
    </div>

    <BaseDrawer
      :confirm-action-name="$t('common.confirm')"
      :is-opened="tagSearchIsOpened"
      :title="$t('template.edit-tags')"
      class="small"
      @close="closeTags"
      @confirm="updateTemplateTags"
    >
      <TagsFilterEditor v-model="newTags" />
    </BaseDrawer>
  </div>
</template>

<script>
import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import { getProjectCategory, patchProjectCategory } from '@/api/project-categories.service'
import FieldDisabler from '@/components/base/form/FieldDisabler.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import ProjectCategoriesDropdown from '@/components/category/ProjectCategoriesDropdown.vue'
import ProjectCategoriesDropdownElementButton from '@/components/category/ProjectCategoriesDropdownElementButton.vue'
import { postTemplateImage } from '@/api/templates.service'
import useToasterStore from '@/stores/useToaster.ts'
import useProjectCategories from '@/stores/useProjectCategories.ts'
import useProjectsStore from '@/stores/useProjects.ts'
export default {
  name: 'TemplatesTab',

  components: {
    TextInput,
    TipTapEditor,
    LpiButton,
    LpiSnackbar,
    FieldDisabler,
    BaseDrawer,
    TagsFilterEditor,
    FilterValue,
    FieldErrors,
    ProjectCategoriesDropdown,
    ProjectCategoriesDropdownElementButton,
    LoaderSimple,
  },

  setup() {
    const toaster = useToasterStore()
    const { locale } = useI18n()
    const projectCategoriesStore = useProjectCategories()
    const projectsStore = useProjectsStore()
    return {
      toaster,
      v$: useVuelidate(),
      locale,
      projectCategoriesStore,
      projectsStore,
    }
  },

  data() {
    return {
      form: {
        language: undefined,
        title: '',
        purpose: '',
        description: '<p></p>',
        blogTitle: '',
        blogContent: '<p></p>',
        goalTitle: '',
        goal_description: '<p></p>',
        tags: [],
        comment: '',
      },
      isLoading: false,
      selectedCategory: null,
      tagSearchIsOpened: false,
      editorKey: 0,
      newTags: [],
      fetchingTemplate: false,
    }
  },

  validations() {
    return {
      selectedCategory: {
        id: {
          required: helpers.withMessage(this.$t('admin.form.template.category.required'), required),
        },
      },
    }
  },

  computed: {
    categories() {
      return this.projectCategoriesStore.allOrderedByOrderId
    },

    otherFieldDisabled() {
      return !this.selectedCategory?.id || this.fetchingTemplate
    },

    allTags() {
      return [...this.form.tags]
    },

    selectedCategoryLabel() {
      return this.selectedCategory
        ? this.selectedCategory.name
        : this.$t('project.form.select-category')
    },
  },
  watch: {
    allTags: {
      handler: function (neo) {
        this.newTags = [...neo]
      },
      immediate: true,
      deep: true,
    },
    selectedCategory: {
      handler: function (neo, old) {
        if (neo?.id && neo?.id != old?.id) this.fillForm()
      },
      immediate: true,
      deep: true,
    },
  },

  async created() {
    await this.projectCategoriesStore.getAllProjectCategories()
  },

  methods: {
    tagTitle(tag) {
      return tag['title_' + this.locale] || tag.title
    },
    setCategory(category) {
      this.selectedCategory = category
      this.$refs.categoryDropdown?.close()
    },
    saveTemplateImage(file) {
      const formData = new FormData()
      formData.append('file', file, file.name)
      return postTemplateImage({ id: this.selectedCategory.id, body: formData })
    },

    async fillForm() {
      const organizationCode = useOrganizationCode()
      this.fetchingTemplate = true
      this.selectedCategory = await getProjectCategory(
        organizationCode,
        this.selectedCategory?.id ? this.selectedCategory.id : this.categories[0]?.id
      )

      if (this.selectedCategory?.template) {
        /* Titles and purpose */
        this.form.title = this.selectedCategory?.template.title_placeholder
        this.form.purpose = this.selectedCategory?.template.goal_placeholder
        this.form.description = this.selectedCategory?.template.description_placeholder || '<p></p>'
        /* Blog */
        this.form.blogTitle = this.selectedCategory?.template.blogentry_title_placeholder
        this.form.blogContent = this.selectedCategory?.template.blogentry_placeholder || '<p></p>'

        /* Goal */
        this.form.goalTitle = this.selectedCategory?.template.goal_title
        this.form.goal_description = this.selectedCategory?.template.goal_description || '<p></p>'

        /* Language */
        this.form.language = this.selectedCategory?.lang || this.locale

        /* Tags */
        this.form.tags = this.selectedCategory?.tags

        /* Comment */
        this.form.comment = this.selectedCategory?.template.comment || '<p></p>'
      }
      this.editorKey += 1
      this.fetchingTemplate = false
    },

    async submit() {
      const organizationCode = useOrganizationCode()
      this.isLoading = true

      const template = {
        title_placeholder: this.form.title,
        goal_placeholder: this.form.purpose,
        description_placeholder: this.form.description,
        blogentry_title_placeholder: this.form.blogTitle,
        blogentry_placeholder: this.form.blogContent,
        goal_description: this.form.goal_description,
        goal_title: this.form.goalTitle,
        comment: this.form.comment,
        // language: this.form.language, TODO: delete or uncomment when we decide what to do about languages in categories
      }

      const updatedData = {
        template: { ...template },
        tags: this.form.tags.map((tag) => tag.id),
      }

      try {
        await patchProjectCategory(organizationCode, this.selectedCategory?.id, updatedData)

        this.toaster.pushSuccess(this.$t('toasts.category-template-update.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.category-template-update.error')} (${error})`)
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    updateTemplateTags() {
      // memoize the newtags first
      const tags = [...this.newTags]
      // or form update will trigger watcher
      // that will reset newTags and then skip one or the other depending on watchers schedule
      this.form.tags = tags
      this.tagSearchIsOpened = false
    },

    closeTags() {
      this.newTags = [...this.form.tags]
      this.tagSearchIsOpened = false
    },

    deleteOrganizationTag(tag) {
      this.form.tags = this.form.tags.filter((t) => t !== tag)
    },
  },
}
</script>

<style lang="scss" scoped>
.templates-tab {
  .snackbar {
    margin: $space-l auto;
  }

  .description {
    font-size: $font-size-m;
  }

  .title {
    font-size: $font-size-l;
  }

  .block-container {
    padding: $space-l 0;
    background: $white;
    border-radius: $border-radius-l;

    & ~ .block-container {
      margin-top: $space-l;
    }

    .title-button-ctn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: $space-l;

      .title {
        margin: unset;
        font-size: $font-size-l;
      }
    }

    .tag-grid {
      display: flex;
      flex-wrap: wrap;
      gap: $space-s;
    }

    .label {
      font-size: $font-size-s;
      font-weight: bold;
      display: block;
      margin-bottom: $space-m;
    }
  }
}

.loader,
.form-actions {
  display: flex;
  justify-content: center;
  padding-block: 1rem;
}
</style>
