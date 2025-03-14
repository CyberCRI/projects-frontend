<script setup>
import IconImage from '@/components/base/media/IconImage.vue'
import { ref, computed, watchEffect } from 'vue'

const emit = defineEmits(['pick-category'])

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
  selectedCategory: {
    type: Object,
    default: null,
  },
  selectedCategories: {
    type: Object,
    default: null,
  },
  type: {
    type: String,
    default: 'radio',
  },
})

const isSelected = ref(false)

watchEffect(() => {
  isSelected.value =
    props.selectedCategory?.id === props.category.id ||
    props.selectedCategories?.some(({ id }) => id == props.category.id)
})

const hasChildren = computed(() => {
  return props.category.children?.length
})
const showChild = ref(false)
watchEffect(() => {
  if (
    props.selectedCategory?.hierarchy?.find(({ id: parentId }) => parentId == props.category.id) ||
    props.selectedCategories?.some(
      (selectedCategory) =>
        !!selectedCategory?.hierarchy?.find(({ id: parentId }) => parentId == props.category.id)
    )
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
.top-list {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid $lighter-gray 1px;
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
  padding-left: pxToRem(35px);
}

.nested-list {
  display: flex;
  justify-content: flex-end;
}

.icon-td {
  width: pxToRem(25px);
  padding: 7px;
}

.name {
  padding: $space-unit;
}

.green-color {
  fill: $primary-dark;
}

.grey-color {
  fill: $lighter-gray;
}

.green-text {
  color: $primary-dark;
}

.black-text {
  color: $almost-black;
  font-weight: 400;
}

input[type='radio'] {
  appearance: none;
  background-color: $white;
  margin: 0;
  font: inherit;
  width: pxToRem(20px);
  height: pxToRem(20px);
  border: $border-width-s solid $primary-dark;
  border-radius: pxToRem(20px);
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
}

input[type='radio']::before {
  content: '';
  width: pxToRem(12px);
  height: pxToRem(12px);
  border-radius: pxToRem(12px);
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em $primary-dark;
}

input[type='radio']:checked::before {
  transform: scale(1);
}

input[type='checkbox'] {
  appearance: none;
  background-color: $white;
  margin: 0;
  font: inherit;
  width: pxToRem(20px);
  height: pxToRem(20px);
  border: $border-width-s solid $primary-dark;
  border-radius: $border-radius-xs;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
}

input[type='checkbox']::before {
  content: '';
  width: pxToRem(12px);
  height: pxToRem(12px);
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em $primary-dark;
}

input[type='checkbox']:checked::before {
  transform: scale(1);
}
</style>
