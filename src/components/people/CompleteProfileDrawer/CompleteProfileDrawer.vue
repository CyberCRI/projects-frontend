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
<script>
import { toRaw } from 'vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import CompleteProfileStep1 from '@/components/people/CompleteProfileDrawer/CompleteProfileStep1.vue'
import CompleteProfileStep2 from '@/components/people/CompleteProfileDrawer/CompleteProfileStep2.vue'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import { useRuntimeConfig } from '#imports'

export default {
  name: 'CompleteProfileDrawer',

  components: { LpiButton, CompleteProfileStep1, CompleteProfileStep2, BaseDrawer, LpiLoader },
  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
    initialStep: {
      type: Number,
      required: true,
    },
  },

  emits: ['close', 'completed'],

  setup() {
    const { locale } = useI18n()
    const runtimeConfig = useRuntimeConfig()
    const { onboardingTrapAll } = useOnboardingStatus()
    return {
      locale,
      runtimeConfig,
      onboardingTrapAll,
    }
  },

  data() {
    return {
      stepComponents: [CompleteProfileStep1, CompleteProfileStep2],
      step: this.initialStep,
      saving: false,
      loading: false,
      invalid: false,
      helpOpened: false,
      helpIsLoading: false,
    }
  },

  computed: {
    stepComponent() {
      return toRaw(this.stepComponents[this.step])
    },

    saveLabel() {
      return this.step < this.stepComponents.length - 1
        ? 'complete-profile.save-and-next'
        : 'complete-profile.save-and-finish'
    },
    docUrl() {
      const url = new URL(this.runtimeConfig.public.appDoc)
      // uppercase lang code are mandatory for this service
      url.searchParams.append('lang', this.locale)

      return url
    },
  },
  watch: {
    helpOpened: function () {
      this.helpIsLoading = true
    },
  },
  methods: {
    async cancel() {
      this.$emit('close')
    },
    async save() {
      const success = await this.$refs.currentStepComponent.save()
      if (success) {
        if (this.step < this.stepComponents.length - 1) {
          this.step++
          await this.onboardingTrapAll({
            // +1 because 1-indexed here and 0-indexed in the component
            show_complete_profile_modal: this.step + 1,
          })
        } else {
          this.$emit('completed')
        }
      }
    },
  },
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
