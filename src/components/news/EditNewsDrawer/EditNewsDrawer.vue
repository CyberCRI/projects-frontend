<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="invalid"
    :is-opened="isOpened"
    :title="$t('news.drawer.title')"
    class="news-drawer medium"
    :asyncing="asyncing"
    @confirm="saveNews"
    @close="cancel"
  >
    <NewsForm
      ref="newsForm"
      v-model="form"
      class="news-form"
      :selected-group="selectedGroup"
      @invalid="invalid = $event"
    />
  </BaseDrawer>
</template>

<script setup lang="ts">
import {
  createNews,
  deleteNewsHeader,
  patchNews,
  patchNewsHeader,
  postNewsHeader,
} from 'shared-projects-frontend/apis'

import NewsForm from '~/components/news/NewsForm/NewsForm.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

import { imageSizesFormData, pictureApiToImageSizes } from '~/functs/imageSizesUtils'
import type { NewsModel, TranslatedNews } from 'shared-projects-frontend/models'

const props = withDefaults(
  defineProps<{
    news?: TranslatedNews
    isOpened?: boolean
    selectedGroup?: boolean
  }>(),
  {
    news: null,
    isOpened: false,
    selectedGroup: true,
  }
)

const emit = defineEmits<{
  close: []
  'news-edited': [NewsModel]
}>()

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()

const form = ref(null)
const asyncing = ref(false)
const invalid = ref(false)

const { t } = useNuxtI18n()

watch(
  () => props.news,
  () => {
    if (props.news) {
      form.value = {
        ...props.news,
        publication_date: props.news.publication_date
          ? new Date(props.news.publication_date)
          : null,
        header_image: props.news.header_image || null,
        imageSizes: pictureApiToImageSizes(props.news.header_image),
        people_groups: Array.isArray(props.news.people_groups)
          ? props.news.people_groups.reduce((acc, groupId) => {
              acc[groupId as unknown as number] = true
              return acc
            }, {})
          : props.news.people_groups,
      }
    }
  },
  { immediate: true }
)

const cancel = () => emit('close')

const newsFormRef = useTemplateRef('newsForm')

const saveNews = async () => {
  const isValid = await newsFormRef.value.v$.$validate()
  if (!isValid) {
    return
  }
  asyncing.value = true

  try {
    const payload = {
      ...form.value,
      header_image: form.value.header_image,
      publication_date: form.value.publication_date.toISOString(),
      people_groups: Object.entries(form.value.people_groups)
        .filter(([, value]) => value)
        .map(([id]) => id),
    }
    const payloadNews = { ...payload }
    delete payloadNews.imageSizes
    delete payloadNews.header_image
    let savedNews: NewsModel

    if (props.news.id) {
      savedNews = await patchNews(organizationsStore.current?.code, props.news.id, payloadNews)
    } else {
      savedNews = await createNews(organizationsStore.current?.code, payloadNews)
    }

    const formData = new FormData()
    if (form.value.imageSizes) imageSizesFormData(formData, form.value.imageSizes)

    if (
      savedNews?.header_image?.id !== form.value.header_image?.id &&
      savedNews?.header_image?.id
    ) {
      await deleteNewsHeader(
        organizationsStore.current?.code,
        savedNews.id,
        savedNews.header_image.id
      )
    }

    if (payload.header_image instanceof File) {
      const formData = new FormData()

      formData.append('file', form.value['header_image'], form.value['header_image'].name)
      if (form.value.imageSizes) imageSizesFormData(formData, form.value.imageSizes)
      payload.header_image_id = (
        await postNewsHeader(organizationsStore.current?.code, savedNews.id, formData)
      ).id
      formData.delete('file')
      await patchNewsHeader(
        organizationsStore.current?.code,
        savedNews.id,
        payload.header_image_id,
        formData
      )
    } else if (form.value.header_image?.id) {
      await patchNewsHeader(
        organizationsStore.current?.code,
        props.news.id,
        props.news.header_image.id,
        formData
      )
    }
    emit('news-edited', savedNews)
    toaster.pushSuccess(t('news.save.success'))
  } catch (err) {
    toaster.pushError(t('news.save.error'))
    console.error(err)
  } finally {
    asyncing.value = false
    emit('close')
  }
}
</script>
