<template>
  <div>
    <div v-if="loading" class="m-auto w-fit flex justify-center items-center flex-col">
      <LpiLoader type="simple" />
      <span class="loading">
        {{ props.label ?? t('common.loading') }}
      </span>
    </div>
    <slot v-else-if="acutalStatus === 'error'" name="error">
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

<script setup lang="ts">
import { AsyncDataRequestStatus } from 'nuxt/app'

/*
  componets wrappers aroud usefetch status result
  show loader during fetching data
  show error message if result is error
  or show default slot content
*/

defineOptions({ name: 'FetchLoader' })

const { t } = useNuxtI18n()

const props = withDefaults(
  defineProps<{
    // stauts from fetchOptions
    status: AsyncDataRequestStatus | AsyncDataRequestStatus[]
    label?: string
    withData?: boolean
  }>(),
  { withData: false, label: null }
)

const acutalStatus = computed(() => {
  let status = props.status
  if (!Array.isArray(status)) {
    status = [status]
  }
  if (status.includes('error')) {
    return 'error'
  }
  if (status.includes('pending')) {
    return 'idle'
  }
  if (status.includes('idle')) {
    return 'idle'
  }
  return 'success'
})

const loading = computed(() => {
  // if data already set, dont add loading
  if (props.withData === true) {
    return false
  }
  return ['pending', 'idle'].includes(acutalStatus.value)
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
