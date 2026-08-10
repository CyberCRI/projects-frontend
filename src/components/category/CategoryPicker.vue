<script setup lang="ts">
import type {
  ProjectCategoryModel,
  TranslatedProjectCategory,
} from 'shared-projects-frontend/models'

import IconImage from '~/components/base/media/IconImage.vue'

const emit = defineEmits<{
  'pick-category': [ProjectCategoryModel]
}>()

const props = withDefaults(
  defineProps<{
    category: TranslatedProjectCategory
    selectedCategory?: ProjectCategoryModel
    selectedCategories?: ProjectCategoryModel[]
    type?: string
  }>(),
  {
    selectedCategory: null,
    selectedCategories: null,
    type: 'radio',
  }
)

const isSelected = computed(
  () =>
    props.selectedCategory?.id === props.category.id ||
    props.selectedCategories?.some(({ id }) => id == props.category.id)
)

const hasChildren = computed(() => {
  return props.category.children?.length
})
const showChild = ref(false)
watchEffect(() => {
  const hierarchy = props.selectedCategory?.hierarchy as ProjectCategoryModel[]
  if (
    hierarchy?.find(({ id: parentId }) => parentId == props.category.id) ||
    props.selectedCategories?.some((selectedCategory) => {
      const selectedHierarchy = selectedCategory?.hierarchy as ProjectCategoryModel[]
      return !!selectedHierarchy?.find(({ id: parentId }) => parentId == props.category.id)
    })
  )
    showChild.value = true
})

const chevronImage = computed(() => {
  return !hasChildren.value ? 'ChevronRight' : showChild.value ? 'ChevronUp' : 'ChevronDown'
})
</script>
<template>
  <li class="sub-list category-picker-element" :data-category-id="category.id">
    <div class="top-list">
      <div class="texts" :class="{ clickable: hasChildren }">
        <div
          class="icon-td"
          :class="{
            'green-color': hasChildren,
            'grey-color': !hasChildren,
          }"
          @click="showChild = !showChild"
        >
          <IconImage class="icon" :name="chevronImage" />
        </div>

        <div class="control">
          <input
            :ref="isSelected ? 'selected' : 'unselected'"
            name="category_picker"
            :type="type"
            :checked="isSelected"
            @input="emit('pick-category', category)"
          />
        </div>
        <div
          class="name"
          :class="{
            'green-text': category.children?.length,
            'black-text': !category.children?.length,
          }"
          @click="showChild = !showChild"
        >
          {{ category.name }}
        </div>
      </div>
    </div>
    <div class="child-list">
      <ul>
        <CategoryPicker
          v-for="child in category.children"
          v-show="showChild"
          :key="child.id"
          :category="child"
          :selected-category="selectedCategory"
          :selected-categories="selectedCategories"
          class="nested-list"
          :type="type"
          @pick-category="emit('pick-category', $event)"
        />
      </ul>
    </div>
  </li>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.top-list {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid variables.$lighter-gray 1px;
}

.sub-list {
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

li {
  display: flex;
  width: 100%;
}

.texts {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
}

.name {
  display: flex;
  gap: 1rem;
}

.clickable {
  cursor: pointer;
}

.child-list {
  padding-left: variables.pxtorem(35px);
}

.nested-list {
  display: flex;
  justify-content: flex-end;
}

.icon-td {
  width: variables.pxtorem(25px);
  padding: 7px;
}

.name {
  padding: variables.$space-unit;
}

.green-color {
  fill: variables.$primary-dark;
}

.grey-color {
  fill: variables.$lighter-gray;
}

.green-text {
  color: variables.$primary-dark;
}

.black-text {
  color: variables.$almost-black;
  font-weight: 400;
}

input[type='radio'] {
  appearance: none;
  background-color: variables.$white;
  margin: 0;
  font: inherit;
  width: variables.pxtorem(20px);
  height: variables.pxtorem(20px);
  border: variables.$border-width-s solid variables.$primary-dark;
  border-radius: variables.pxtorem(20px);
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
}

input[type='radio']::before {
  content: '';
  width: variables.pxtorem(12px);
  height: variables.pxtorem(12px);
  border-radius: variables.pxtorem(12px);
  transform: translateZ(0) scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em variables.$primary-dark;
}

input[type='radio']:checked::before {
  transform: translateZ(0) scale(1);
}

input[type='checkbox'] {
  appearance: none;
  background-color: variables.$white;
  margin: 0;
  font: inherit;
  width: variables.pxtorem(20px);
  height: variables.pxtorem(20px);
  border: variables.$border-width-s solid variables.$primary-dark;
  border-radius: variables.$border-radius-xs;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
}

input[type='checkbox']::before {
  content: '';
  width: variables.pxtorem(12px);
  height: variables.pxtorem(12px);
  transform: translateZ(0) scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em variables.$primary-dark;
}

input[type='checkbox']:checked::before {
  transform: translateZ(0) scale(1);
}
</style>
