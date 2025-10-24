<template>
  <div>
    <div v-if="loading" class="m-auto w-fit">
      <LpiLoader type="simple" />
      <span class="loading">
        {{ props.label ?? t('common.loading') }}
      </span>
    </div>
    <slot v-else-if="status === 'error'" name="error">
      <div class="error">
        <IconImage name="AlertOutline" class="icon" />
        <span>
          {{ t('message.error-default') }}
        </span>
      </div>
    </slot>
    <slot v-else />
  </div>
</template>

<script setup>
/*
  componets wrappers aroud usefetch status result
  show loader during fetching data
  show error message if result is error
  or show default slot content
*/

defineOptions({ name: 'FetchLoader' })

const { t } = useNuxtI18n()

const props = defineProps({
  // stauts from fetchOptions
  status: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: null,
  },
  withData: {
    type: Boolean,
    default: null,
  },
})

const loading = computed(() => {
  // if data already set, dont add loading
  if (props.withData === true) {
    return false
  }
  return ['pending', 'idle'].includes(props.status)
})
</script>

<style lang="scss" scoped>
.loading {
  font-style: italic;
  opacity: 0.4;
  padding-top: 0.5rem;
}

.error {
  opacity: 0.8;
  font-style: italic;
  text-align: center;

  & > * {
    vertical-align: middle;
  }
}

.icon {
  width: 2rem;
  display: inline-block;
  margin: 0 0.5rem;
}
</style>
