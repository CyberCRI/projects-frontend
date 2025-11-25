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
</template>

<script setup>
defineOptions({
  name: 'FilterEditor',
})

defineProps({
  options: {
    type: Array,
    required: true,
  },
})

const modelValue = defineModel('modelValue', { required: true, type: Array })
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

<style scoped lang="scss">
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
  padding: $space-unit;
  text-wrap: wrap;
}

.icon-td {
  width: pxToRem(25px);
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
  fill: $lighter-gray;
}

.black-text {
  color: $almost-black;
  font-weight: 400;
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
