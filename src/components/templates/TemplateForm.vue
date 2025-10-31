<template>
  <div class="block-container form">
    <div class="block-container">
      <h4 class="title">
        {{ $t('template.template') }}
      </h4>
      <span class="description">{{ $t('template.tips-template') }}</span>
      <TextInput
        v-model="form.name"
        data-test="name"
        :placeholder="$t('project.form.project-templates')"
      />
      <FieldErrors :errors="errors.name" />
    </div>

    <div class="block-container">
      <h4 class="title">
        {{ $t('template.description') }}
      </h4>
      <span class="description">{{ $t('template.tips-template') }}</span>
      <TipTapEditor
        :key="`description-${editorKey}`"
        v-model="form.description"
        :save-image-callback="saveImageCallback"
        mode="full"
      />
    </div>

    <div class="block-container">
      <div class="title-button-ctn">
        <h4 class="title">
          {{ $t('template.category') }}
        </h4>
        <LpiButton
          :label="$filters.capitalize($t('category.edit'))"
          @click="categorySearchIsOpened = true"
        />
      </div>

      <div v-if="form.categories.length" class="tag-grid">
        <FilterValue
          v-for="category in form.categories"
          :key="category.id"
          :label="category.name"
        />
      </div>

      <span v-if="form.categories.length === 0" class="description">
        {{ $t('template.no-category-set') }}
      </span>
      <BaseDrawer
        :confirm-action-name="$t('common.confirm')"
        :is-opened="categorySearchIsOpened"
        :title="$t('template.edit-category')"
        class="small"
        @close="closeCategory"
        @confirm="confirmCategory"
      >
        <CategoriesFilterEditor v-model="tmpCategories" />
      </BaseDrawer>
    </div>

    <h4 class="divider-title">
      {{ t('template.title-project') }}
    </h4>
    <div>
      <TextInput v-model="form.project_title" :label="t('template.project-title')" />
    </div>

    <div>
      <label class="label">{{ capitalize(t('template.project-purpose')) }}</label>
      <TipTapEditor
        :key="`project-purpose-${editorKey}`"
        v-model="form.project_purpose"
        :save-image-callback="saveImageCallback"
        mode="full"
      />
    </div>

    <div>
      <label class="label">{{ capitalize(t('template.project-description')) }}</label>
      <TipTapEditor
        :key="`project-description-${editorKey}`"
        v-model="form.project_description"
        :save-image-callback="saveImageCallback"
        mode="full"
      />
    </div>

    <h4 class="divider-title">
      {{ t('template.title-blog') }}
    </h4>

    <div>
      <TextInput v-model="form.blogentry_title" :label="capitalize(t('template.blog-title'))" />
    </div>

    <div>
      <label class="label">{{ capitalize(t('template.blog-content')) }}</label>
      <TipTapEditor
        :key="`blog-${editorKey}`"
        v-model="form.blogentry_content"
        :save-image-callback="saveImageCallback"
        mode="full"
      />
    </div>

    <h4 class="divider-title">
      {{ t('template.title-goal') }}
    </h4>

    <div>
      <TextInput
        v-model="form.goal_title"
        :label="capitalize(t('template.advancement-goal-title'))"
      />
    </div>

    <div>
      <label class="label">
        {{ capitalize(t('template.advancement-goal-content')) }}
      </label>
      <TipTapEditor
        :key="`advancement-goal-${editorKey}`"
        v-model="form.goal_description"
        :save-image-callback="saveImageCallback"
        data-test="template-advancement-goal-content-editor"
        mode="full"
      />
    </div>

    <h4 class="divider-title">
      {{ t('template.title-comment') }}
    </h4>

    <div>
      <label class="label">
        {{ capitalize(t('template.comment')) }}
      </label>

      <TipTapEditor
        :key="`comment-${editorKey}`"
        v-model="form.comment_content"
        :save-image-callback="saveImageCallback"
        class="comment-description"
        mode="full"
        data-test="template-comment-editor"
      />
    </div>
  </div>
</template>

<script setup>
import { capitalize } from 'es-toolkit'
import useNuxtI18n from '@/composables/useNuxtI18n'

import TextInput from '@/components/base/form/TextInput.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'

defineOptions({ name: 'TemplateForm' })
defineProps({
  errors: {
    type: Object,
    default: () => {},
  },
  saveImageCallback: {
    type: Function,
    required: true,
  },
})

const { t } = useNuxtI18n()

const form = defineModel({ type: Object })
const editorKey = ref(0)
const categorySearchIsOpened = ref(false)

// temp categories select in drawer
const tmpCategories = ref([])
watch(categorySearchIsOpened, () => {
  tmpCategories.value = [...form.value.categories]
})
const closeCategory = () => {
  categorySearchIsOpened.value = false
}
const confirmCategory = () => {
  form.value.categories = [...tmpCategories.value]
  closeCategory()
}
</script>

<style lang="scss" scoped>
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

.block-container {
  margin-bottom: 1rem;
}

.divider-title {
  text-align: center;
  margin-top: 2rem;
  font-size: 2.5rem;
  color: $primary-dark;

  &::before,
  &::after {
    content: '';
    transform: translateY(-0.7rem);
    display: inline-block;
    width: 3rem;
    height: 0.2rem;
    background-color: $primary-dark;
    border-radius: 40px;
  }
}
</style>
