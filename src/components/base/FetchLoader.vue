<template>
  <div :class="{ skeletons: inSkeletons }" class="contents">
    <div v-if="loading" class="center" :class="[classLoading]">
      <LpiLoader type="simple" />
      <span class="loading">
        {{ props.label ?? t('common.loading') }}
      </span>
    </div>
    <slot v-else-if="isError" name="error">
      <div class="center error" :class="[classError]">
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
import { isNil } from 'es-toolkit'
import { AsyncDataRequestStatus, NuxtError, NuxtLinkProps } from 'nuxt/app'

/*
  componets wrappers aroud usefetch status result
  show loader during fetching data
  show error message if result is error
  or show default slot content
*/

const { t } = useNuxtI18n()

const props = withDefaults(
  defineProps<{
    // stauts from fetchOptions
    status: AsyncDataRequestStatus | AsyncDataRequestStatus[]
    label?: string
    error?: NuxtError | null | (NuxtError | null)[]
    error404?: boolean | NuxtLinkProps['to']
    withData?: boolean
    onlyError?: boolean
    skeleton?: boolean
    classLoading?: string
    classError?: string
  }>(),
  {
    withData: false,
    label: null,
    onlyError: false,
    skeleton: false,
    classLoading: '',
    classError: '',
    error: null,
    error404: true,
  }
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

const isError = computed(() => {
  return actualStatus.value === 'error'
})

const loading = computed(() => {
  if (props.withData === true || props.onlyError) {
    return false
  }
  return inLoading.value
})

const inSkeletons = ref(true)
watchEffect(() => {
  const value = inLoading.value && (!firstLoading.value || !props.withData) && props.skeleton
  nextTick(() => (inSkeletons.value = value))
})

// const inSkeletons = computed(() => {
//   return inLoading.value && (!firstLoading.value || !props.withData) && props.skeleton
// })

watch(inLoading, (newValue, oldValue) => {
  if (oldValue === true && newValue === false && !firstLoading.value) {
    firstLoading.value = true
  }
})

// if error are set and error 404 is set to true, redirect to page 404
const router = useRouter()
const route = useRoute()
watch(
  () => [props.error, props.error404, isError.value],
  () => {
    if (!isError.value || !props.error || props.error404 === false) {
      return
    }
    const errors = Array.isArray(props.error) ? props.error : [props.error]
    // check if error is 404
    if (!errors.filter((r) => !isNil(r)).find((r) => r.statusCode === 404)) {
      return
    }
    const to =
      props.error404 === true
        ? {
            name: 'page404',
            params: {
              pathMatch: route.path.substring(1).split('/'),
            },
          }
        : props.error404
    router.push(to)
  }
)
</script>

<style lang="scss" scoped>
.loading {
  font-style: italic;
  opacity: 0.4;
  padding-top: 0.5rem;
}

.center {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding: 0.5rem;
}

.error {
  opacity: 0.8;
  font-style: italic;
  text-align: center;
  margin: auto;

  & > * {
    vertical-align: middle;
    margin: auto;
  }
}

.icon {
  width: 2rem;
  display: inline-block;
  margin: 0 0.5rem;
}
</style>
