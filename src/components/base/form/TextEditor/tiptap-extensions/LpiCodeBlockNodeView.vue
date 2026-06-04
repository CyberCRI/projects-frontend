<script setup lang="ts">
import ContexttualToolMenu from '~/components/base/form/TextEditor/ContexttualToolMenu.vue'
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import Field from '~/components/base/form/Field.vue'

import {
  DEFAULT_LANGUAGE,
  DEFAULT_TAB,
  DEFAULT_THEME,
} from '~/components/base/form/TextEditor/tiptap-extensions/LpiCodeBlock'

import lowlight from '~/functs/lowlight'

const props = defineProps(nodeViewProps)
const { t } = useNuxtI18n()

const language = ref(DEFAULT_LANGUAGE)
const theme = ref(DEFAULT_THEME)
const tab = ref(DEFAULT_TAB)

const optionsLanguages = computed(() => {
  return lowlight.listLanguages().map((language) => ({
    value: language,
    label: language,
  }))
})

const optionsThemes = computed(() => [
  { value: 'light', label: t('multieditor.code.theme.light') },
  { value: 'dark', label: t('multieditor.code.theme.dark') },
])

const optionsTabs = computed(() => [
  { value: '2', label: '2' },
  { value: '4', label: '4' },
])

watch(
  () => props.node.attrs.language,
  (neo, old) => {
    if (neo != old) language.value = neo.toString() || DEFAULT_LANGUAGE
  },
  { immediate: true }
)

watch(
  () => props.node.attrs.theme,
  (neo, old) => {
    if (neo != old) theme.value = neo.toString() || DEFAULT_THEME
  },
  { immediate: true }
)

watch(
  () => props.node.attrs.tab,
  (neo, old) => {
    if (neo != old) tab.value = neo.toString() || DEFAULT_TAB
  },
  { immediate: true }
)

watch(language, (neo, old) => {
  if (neo && neo != old)
    props.updateAttributes({
      language: neo,
      theme: theme.value,
      tab: tab.value,
    })
})

watch(theme, (neo, old) => {
  if (neo && neo != old)
    props.updateAttributes({
      language: language.value,
      theme: neo,
      tab: tab.value,
    })
})

watch(tab, (neo, old) => {
  if (neo && neo != old)
    props.updateAttributes({
      language: language.value,
      theme: theme.value,
      tab: neo,
    })
})
</script>

<template>
  <NodeViewWrapper class="vue-component">
    <ContexttualToolMenu class="code-menu-bar" contenteditable="false">
      <Field :label="$t('multieditor.code.language.label')">
        <select v-model="language">
          <option v-for="item in optionsLanguages" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </Field>
      <Field :label="$t('multieditor.code.theme.label')">
        <select v-model="theme">
          <option v-for="item in optionsThemes" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </Field>
      <Field :label="$t('multieditor.code.tabs.label')">
        <select v-model="tab">
          <option v-for="item in optionsTabs" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </Field>
    </ContexttualToolMenu>

    <pre class="lpi-code-block" :class="[`theme-${theme} tab-${tab}`]">
      <NodeViewContent
        as="code"
        class="content-dom hljs"
        :class="[`language-${node.attrs.language}`]"
        spellcheck="false"
      />
    </pre>
  </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.code-menu-bar {
  display: flex;
  gap: 1rem;
  border: 1px solid var(--primary-dark);
  border-radius: $border-radius-m;
  padding: 0.5rem;
}
</style>
