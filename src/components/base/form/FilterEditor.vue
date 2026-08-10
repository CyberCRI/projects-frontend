<template>
  <div class="filter-editor">
    <ul>
      <li v-for="option in options" :key="option.id" class="sub-list option-picker-element">
        <div class="control">
          <input
            :ref="selectedId.includes(option.id) ? 'selected' : 'unselected'"
            :name="`option-picker-${option.id}`"
            type="checkbox"
            :checked="selectedId.includes(option.id)"
            @input="toggle(option)"
          />
        </div>
        <div class="name black-text">
          {{ option.name }}
        </div>
      </li>
    </ul>
  </div>
  <NothingHere v-if="options.length === 0" />
</template>

<script setup lang="ts">
import NothingHere from '~/components/base/NothingHere.vue'

type Value = {
  id: number
  name: string
}
defineProps<{
  options: Value[]
}>()

const modelValue = defineModel<Value[]>('modelValue')
const emit = defineEmits(['update:modelValue'])

const selectedId = computed(() => modelValue.value.map((el) => el.id))
const toggle = (element) => {
  let value = modelValue.value
  if (selectedId.value.includes(element.id)) {
    value = value.filter((el) => el.id !== element.id)
  } else {
    value.push(element)
  }
  value = [...value]
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.filter-editor {
  display: flex;
  justify-content: stretch;

  > ul {
    flex-grow: 1;
  }
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

.name {
  padding: variables.$space-unit;
  text-wrap: wrap;
}

.icon-td {
  width: variables.pxtorem(25px);
  padding: 7px;
}

.option-picker-element {
  display: grid;
  grid-template-columns: auto 1fr;

  & > * {
    align-content: center;
  }
}

.grey-color {
  fill: variables.$lighter-gray;
}

.black-text {
  color: variables.$almost-black;
  font-weight: 400;
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
