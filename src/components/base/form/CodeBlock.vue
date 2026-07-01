<script setup lang="ts">
import hljs from 'highlight.js'

const props = withDefaults(
  defineProps<{
    theme?: 'dark' | 'light'
    language: string
    content: string
    tab?: 2 | 4
  }>(),
  {
    theme: 'dark',
    tab: 4,
  }
)

// when values changes, reload higlightAll
watchEffect(
  onClient(() => {
    void props.content
    hljs.highlightAll()
  })
)

onClientMounted(() => hljs.highlightAll())
</script>

<template>
  <div class="tiptap-output">
    <pre class="lpi-code-block" :class="[`theme-${theme} tab-${tab}`]"><code
      class="content-dom hljs"
      :class="[`language-${language}`]"
      spellcheck="false"
      >{{ content }}</code></pre>
  </div>
</template>
