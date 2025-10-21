<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'
import { capitalize } from 'es-toolkit'

const { onboardingTrap } = useOnboardingStatus()
const { t } = useNuxtI18n()

provide(
  'helpPageHasFaq',
  computed(() => this.hasFaq)
)
provide(
  'helpPageFaq',
  computed(() => this.faq)
)

const isLoading = ref(true)
const customTab = ref(null)
const faq = ref(null)

const hasFaq = computed(() => {
  let _faq = faq.value
  return _faq && _faq.title && _faq.content && _faq.content !== '<p></p>'
})
const tabs = computed(() => {
  const res = []

  if (customTab.value) res.push(customTab.value)

  res.push({
    key: 'help-help',
    label: t('faq.portal'),
    view: { name: 'HelpHelpTab' },
  })
  res.push({
    key: 'help-video',
    label: t('faq.video'),
    view: { name: 'HelpVideoTab' },
  })
  return res
})

const setOnboardData = async () => {
  try {
    if (hasFaq.value) {
      customTab.value = {
        label: faq.value.title,
        key: 'help-template',
        view: { name: 'HelpFaqTab' },
      }
    }
  } catch (error) {
    console.error(error)
  }

  isLoading.value = false
}

onMounted(async () => {
  // try {
  //     this.faq = await getFaq(this.organizationsStore.current.code)
  // } catch (err) {
  //     console.error(err)
  //     // ignore 404 error
  // }
  setOnboardData()

  onboardingTrap('take_tour', false)
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('faq.portal')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div :class="{ loading: isLoading }" class="page-section-extra-wide help-layout page-top">
    <div>
      <h1 class="page-title">
        {{ capitalize($t('faq.portal')) }}
      </h1>
    </div>

    <LpiLoader v-if="isLoading" type="simple" />
    <TabsLayout v-else :align-left="true" :border="false" :tabs="tabs" router-view />
  </div>
</template>

<style lang="scss" scoped>
.intro-ctn {
  margin-bottom: $space-xl;
  background: $primary-lighter;
  padding: $space-l;
  border-radius: $border-radius-17;

  .action-list {
    list-style-type: disc;
    list-style-position: inside;
    font-size: $font-size-l;

    li {
      padding: $space-m 0;
    }
  }
}

.help-layout {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;

  &.loading {
    justify-content: center;
    align-items: center;
  }
}

:deep(.tabs) {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;

  .content {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    img {
      max-width: 100%;
    }
  }
}
</style>
