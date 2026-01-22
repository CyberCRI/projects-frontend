<template>
  <div :class="{ skeletons: inSkeletons }">
    <div v-if="loading" class="m-auto w-fit flex justify-center items-center flex-col">
      <LpiLoader type="simple" />
      <span class="loading">
        {{ props.label ?? t('common.loading') }}
      </span>
    </div>
    <slot v-else-if="actualStatus === 'error'" name="error">
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
    onlyError?: boolean
    skeleton?: boolean
  }>(),
  { withData: false, label: null, onlyError: false, skeleton: false }
)

const firstLoading = ref(false)

const actualStatus = computed(() => {
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

const inLoading = computed(() => {
  return ['pending', 'idle'].includes(actualStatus.value)
})

const loading = computed(() => {
  // if data already set, dont add loading
  if (props.withData === true || props.onlyError) {
    return false
  }
  return inLoading.value
})

const inSkeletons = computed(() => {
  return inLoading.value && !firstLoading.value && props.skeleton
})

watch(inLoading, (newValue, oldValue) => {
  if (oldValue === true && newValue === false && !firstLoading.value) {
    firstLoading.value = true
  }
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
