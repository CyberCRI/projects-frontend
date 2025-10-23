<script setup>
import { defaultForm } from '@/components/news/NewsForm/NewsForm.vue'
import { createNews, postNewsHeader } from '@/api/news.service.ts'
import { imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'
import { capitalize } from '@/functs/string'

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const router = useRouter()
const { t } = useNuxtI18n()

const newsForm = useTemplateRef('newsForm')

const form = ref(defaultForm())
const asyncing = ref(false)
const invalid = ref(false)

const cancel = () => {
  form.value = defaultForm()
  router.push({ name: 'NewsListPage' })
}

const saveNews = async () => {
  const isValid = await newsForm.value?.v$.$validate()
  if (!isValid) {
    return
  }
  try {
    asyncing.value = true
    // TODO: handle header_image and imageSize
    const payload = {
      ...form.value,
      publication_date: form.value.publication_date,
      people_groups: Object.entries(form.value.people_groups)
        .filter(([, value]) => value)
        .map(([id]) => id),
    }
    const savedNews = await createNews(organizationsStore.current?.code, payload)

    if (form.value.header_image instanceof File) {
      const formData = new FormData()

      formData.append('file', form.value['header_image'], form.value['header_image'].name)

      if (form.value.imageSizes) imageSizesFormData(formData, form.value.imageSizes)

      await postNewsHeader(organizationsStore.current?.code, savedNews.id, formData)
    }

    toaster.pushSuccess(t('news.save.success'))
  } catch (err) {
    toaster.pushError(`${t('news.save.error')} (${err})`)
    console.error(err)
  } finally {
    asyncing.value = false
    router.push({ name: 'NewsListPage' })
  }
}

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('news.create.title')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="create-news-page page-section-narrow">
    <h1 class="page-title">
      {{ $t('news.create.title') }}
    </h1>

    <ClientOnly>
      <NewsForm ref="newsForm" v-model="form" @invalid="invalid = $event" />
    </ClientOnly>

    <div class="form-actions">
      <LpiButton
        :disabled="asyncing"
        :label="capitalize($t('common.cancel'))"
        secondary
        class="footer__left-button"
        data-test="close-button"
        @click="cancel"
      />

      <LpiButton
        :disabled="invalid || asyncing"
        :label="capitalize($t('common.confirm'))"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        class="footer__right-button"
        data-test="confirm-button"
        @click="saveNews"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-title {
  margin-top: pxToRem(60px);
  margin-bottom: pxToRem(60px);
}

.form-actions {
  margin-top: 2rem;
  z-index: 100;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: $border-width-s solid $lighter-gray;
  color: $primary-dark;
  font-weight: 700;
  padding-top: $space-l;
  padding-bottom: $space-l;
  position: sticky;
  bottom: 0;
  background: $white;
  gap: $space-l;

  button ~ button {
    text-transform: capitalize;
  }
}
</style>
