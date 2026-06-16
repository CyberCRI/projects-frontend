<template>
  <div :class="{ 'search-input-ctn--full': full }" class="search-input-ctn">
    <IconImage class="left-icon search" name="Search" />
    <input
      ref="search-input"
      v-model.trim="tempModel"
      :placeholder="placeholder"
      class="search-input"
      type="search"
      data-test="search-input"
      @keyup.enter="onEnter"
      @keyup="$emit('keyup', $event)"
    />
    <span v-if="tempModel.length" class="right-icon delete" @click="deleteValue">
      <IconImage name="Close" />
    </span>
    <div v-if="suggestions?.length && !hideSuggestions" class="suggestions">
      <h6 class="suggestions-label">
        {{ $t('search.suggestions') }}
      </h6>
      <ul>
        <li
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="acceptSuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type IconImage from '~/components/base/media/IconImage.vue'
import { debounce as debounceFn } from 'es-toolkit'
import type { Events } from 'vue'

const props = withDefaults(
  defineProps<{
    full?: boolean
    placeholder?: string
    suggestions?: string[]
    debounce?: number
  }>(),
  {
    full: false,
    placeholder: '',
    suggestions: () => [],
    debounce: 0,
  }
)
const model = defineModel<string>({ default: '' })
const tempModel = ref('')
watch(model, () => (tempModel.value = model.value), { immediate: true })

// debounce update search
const debounceUpdate = debounceFn(() => {
  model.value = tempModel.value
}, props.debounce)
watch(tempModel, debounceUpdate)

const emit = defineEmits<{
  'delete-query': []
  enter: []
  keyup: [Events['onKeyup']]
}>()

const hideSuggestions = ref(false)
watch(
  () => props.suggestions,
  () => (hideSuggestions.value = false)
)

const deleteValue = () => emit('delete-query')
const onEnter = () => emit('enter')

const acceptSuggestion = (suggestion: string) => {
  tempModel.value = suggestion
  hideSuggestions.value = true
  nextTick(onEnter)
}
</script>

<style lang="scss" scoped>
.search-input-ctn {
  position: relative;
  cursor: pointer;
  width: 350px;
  max-width: 100%;

  // add margin top to avoid focus input hidden
  // https: //developer.mozilla.org/fr/docs/Web/CSS/Reference/Properties/outline-width#medium
  margin-top: 3px;

  .search-input {
    border-radius: $border-radius-l;
    background: $white;
    border: $border-width-s solid var(--primary);
    color: $black;
    padding: 11px $space-xl 10px; // 11 + 1 px border
    font-size: $font-size-m;
    width: pxToRem(350px);
    max-width: 100%;
    box-sizing: border-box;

    &::placeholder {
      color: var(--light-gray);
    }

    &:focus-visible {
      outline-color: var(--primary-dark);
    }
  }

  &--full {
    width: 100%;

    .search-input {
      width: 100%;
    }
  }

  .left-icon,
  .right-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    fill: var(--primary-dark);
  }

  .left-icon {
    left: $layout-size-s;
    height: $layout-size-l;
    width: $layout-size-l;
    pointer-events: none;
  }

  .right-icon {
    right: $layout-size-s;
    display: inline-block;
    width: $layout-size-s;
    height: $layout-size-s;
    background: $primary-dark;
    border: $border-width-m solid var(--primary-dark);
    border-radius: 100%;

    svg {
      width: $layout-size-s;
      fill: var(--white);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .suggestions {
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 10rem;
    background-color: var(--white);
    border: $border-width-s solid var(--primary);
    border-radius: $border-radius-l;
    display: flex;
    flex-flow: column nowrap;

    .suggestions-label {
      font-size: $font-size-m;
      padding: 0.5rem $border-radius-l;
      text-align: center;
      font-weight: normal;
    }

    ul {
      flex-grow: 1;
      overflow-y: auto;
    }

    li {
      padding: 0.5rem $border-radius-l;
      cursor: pointer;

      &:hover {
        background-color: var(--primary-lighter);
      }
    }
  }
}
</style>
