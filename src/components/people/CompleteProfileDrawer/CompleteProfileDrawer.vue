<template>
  <BaseDrawer
    :is-opened="isOpened"
    title=""
    class="full"
    :data-test="`onboarding-step-${step}`"
    @close="cancel"
  >
    <template #header_prefix>
      <h3 class="progression">
        {{ $t('complete-profile.onboarding') }} {{ step + 1 }}/{{ stepComponents.length }}
      </h3>
    </template>
    <div class="complete-profile-content page-section-wide">
      <header>
        <h1 class="title">
          {{ $t('complete-profile.title') }}
        </h1>
        <p class="notice">
          {{ $t('complete-profile.notice.intro') }}
          <br />
          {{ $t('complete-profile.notice.no-idea') }}
          <a class="link" href="#" @click="helpOpened = true">
            {{ $t('complete-profile.notice.help') }}
          </a>
        </p>
      </header>
      <main>
        <component
          :is="stepComponent"
          ref="currentStepComponent"
          @saving="saving = $event"
          @loading="loading = $event"
          @invalid="invalid = $event"
        />
      </main>
    </div>
    <template #footer>
      <LpiButton
        secondary
        :label="$t('complete-profile.cancel')"
        :disabled="saving"
        data-test="skip-button"
        @click="cancel"
      />

      <LpiButton
        :label="$t(saveLabel)"
        :btn-icon="saving ? 'LoaderSimple' : undefined"
        :disabled="invalid || loading || saving"
        data-test="confirm-button"
        @click="save"
      />
    </template>
  </BaseDrawer>
  <BaseDrawer
    :is-opened="helpOpened"
    :title="$t('faq.portal')"
    @close="helpOpened = false"
    @confirm="helpOpened = false"
  >
    <LpiLoader v-if="helpIsLoading" class="help-loader" type="simple" />
    <iframe :src="docUrl" @load="helpIsLoading = false" />
  </BaseDrawer>
</template>
<script setup lang="ts">
import { toRaw } from 'vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import CompleteProfileStep1 from '@/components/people/CompleteProfileDrawer/CompleteProfileStep1.vue'
import CompleteProfileStep2 from '@/components/people/CompleteProfileDrawer/CompleteProfileStep2.vue'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import { useRuntimeConfig } from '#imports'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    initialStep: number
  }>(),
  { isOpened: false }
)

const emit = defineEmits<{
  close: []
  completed: []
}>()
const { locale } = useNuxtI18n()
const runtimeConfig = useRuntimeConfig()
const { onboardingTrapAll } = useOnboardingStatus()

const currentStepComponent = useTemplateRef('currentStepComponent')
const stepComponents = ref([CompleteProfileStep1, CompleteProfileStep2])
const step = ref(props.initialStep)
const saving = ref(false)
const loading = ref(false)
const invalid = ref(false)
const helpOpened = ref(false)
const helpIsLoading = ref(false)

const stepComponent = computed(() => {
  return toRaw(stepComponents.value[step.value])
})

const saveLabel = computed(() => {
  return step.value < stepComponents.value.length - 1
    ? 'complete-profile.save-and-next'
    : 'complete-profile.save-and-finish'
})
const docUrl = computed(() => {
  const url = new URL(runtimeConfig.public.appDoc)
  // uppercase lang code are mandatory for this service
  url.searchParams.append('lang', locale.value)

  return url.toString()
})

watchEffect(() => {
  if (helpOpened.value) {
    helpIsLoading.value = true
  }
})

const cancel = () => emit('close')
const save = async () => {
  const success = await currentStepComponent.value.save()
  if (success) {
    if (step.value < stepComponents.value.length - 1) {
      step.value = step.value += 1
      await onboardingTrapAll({
        // +1 because 1-indexed here and 0-indexed in the component
        show_complete_profile_modal: step.value + 1,
      })
    } else {
      emit('completed')
    }
  }
}
</script>
<style lang="scss" scoped>
iframe {
  width: 100%;

  // height: calc(100vh - 100px);
  flex-grow: 1;
}

.help-loader {
  align-self: center;
}

.complete-profile-content {
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: stretch;

  main {
    flex-grow: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: stretch;
  }
}

.progression {
  color: $primary-dark;
  font-size: $font-size-m;
  margin-bottom: 1rem;
  font-weight: 700;
}

.title {
  font-size: $font-size-5xl;
  line-height: $line-height-squashed;
  margin-bottom: pxToRem(22px);
}

.notice {
  font-size: $font-size-m;
  margin-bottom: pxToRem(48px);
}

.link {
  color: $primary-dark;
  text-decoration: underline;
  font-weight: 700;
}

footer {
  border-top: $border-width-m solid $lighter-gray;
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: pxToRem(28px) 0;
  margin-top: pxToRem(74px);
}
</style>
