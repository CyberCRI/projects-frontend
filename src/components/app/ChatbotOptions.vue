<script setup>
const props = defineProps({
  hasUserContext: { type: Boolean, default: false },
  hasPageContext: { type: Boolean, default: false },
})
const { allowProfile, updateAllowProfile, allowCurrentPage, updateAllowCurrentPage } =
  useChatbotContext(props)
</script>
<template>
  <div
    v-if="hasPageContext || hasUserContext"
    style="margin: 1rem; padding: 1rem; background-color: #f3f3f3; border-radius: 10px"
  >
    <p>
      {{ $t('chatbot.before-we-start') }}
    </p>
    <p v-if="hasUserContext">
      <label>
        <input
          type="checkbox"
          :checked="allowProfile"
          style="accent-color: #1d727c"
          @click="updateAllowProfile"
        />
        {{ $t('chatbot.allow-profile') }}
      </label>
    </p>
    <p v-if="hasPageContext">
      <label>
        <input
          type="checkbox"
          :checked="allowCurrentPage"
          style="accent-color: #1d727c"
          @click="updateAllowCurrentPage"
        />
        {{ $t('chatbot.allow-current-page') }}
      </label>
    </p>
  </div>
</template>
