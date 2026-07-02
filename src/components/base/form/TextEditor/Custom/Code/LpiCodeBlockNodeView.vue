<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import Field from '~/components/base/form/Field.vue'

import {
  DEFAULT_LANGUAGE,
  DEFAULT_TAB,
  DEFAULT_THEME,
} from '~/composables/tiptap/extensions/LpiCodeBlock'
import type { GroupOption } from '~/components/base/button/GroupButton.vue'
import GroupButton from '~/components/base/button/GroupButton.vue'
import LpiSelect from '~/components/base/form/LpiSelect.vue'
import CodeBlock from '~/components/base/form/CodeBlock.vue'
import lowlight from '~/functs/lowlight'

const props = defineProps(nodeViewProps)
const { t } = useNuxtI18n()

const language = ref(DEFAULT_LANGUAGE)
const theme = ref<'dark' | 'light'>(DEFAULT_THEME)
const tab = ref<2 | 4>(DEFAULT_TAB)

const optionsLanguages = computed(() => {
  return lowlight.listLanguages().map((language) => ({
    value: language,
    label: language,
  }))
})

const optionsThemes = computed(
  () =>
    [
      { value: 'light', title: t('multieditor.code.theme.light'), iconName: 'Sun' },
      { value: 'dark', title: t('multieditor.code.theme.dark'), iconName: 'Moon' },
    ] satisfies GroupOption[]
)

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
        <LpiSelect
          v-model="language"
          class="ignore-tip-tap"
          :options="optionsLanguages"
          max-height="250px"
        />
      </Field>

      <Field :label="$t('multieditor.code.theme.label')">
        <GroupButton v-model="theme" :options="optionsThemes" has-icon />
      </Field>

      <Field :label="$t('multieditor.code.tabs.label')">
        <GroupButton v-model="tab" :options="optionsTabs" has-icon />
      </Field>
    </ContexttualToolMenu>

    <CodeBlock :language="node.attrs.language" :theme="theme" :tab="tab">
      <NodeViewContent />
    </CodeBlock>
  </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.code-menu-bar {
  display: flex;
  gap: 1rem;
  border: 1px solid var(--primary-dark);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: 0;
  padding: 0.5rem;
  align-items: flex-start;
  width: fit-content;
}

.switch-theme {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border: 2px solid var(--primary-dark);
  border-radius: 10px;
  padding: 0.5rem;
}

.lpi-code-block .content-dom.hljs {
  border-top-left-radius: 0;
}
</style>

<style lang="scss">
// tiptap overright style , and LpiSelect is impacted too...
.ignore-tip-tap {
  li {
    margin: 0 !important;
  }
}
</style>
