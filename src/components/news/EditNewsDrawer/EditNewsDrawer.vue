<template>
    <BaseDrawer
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="invalid"
        :is-opened="isOpened"
        :title="$t('news.drawer.title')"
        class="news-drawer medium"
        @confirm="saveNews"
        @close="cancel"
        :asyncing="asyncing"
    >
        <NewsForm ref="newsForm" v-model="form" @invalid="invalid = $event" class="news-form" />
    </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import NewsForm from '@/components/news/NewsForm/NewsForm.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import { createNews, postNewsHeader, patchNews, patchNewsHeader } from '@/api/news.service.ts'
import { imageSizesFormData } from '@/functs/imageSizesUtils.ts'

export default {
    name: 'EditNewsDrawer',

    emits: ['close', 'news-edited'],

    components: {
        BaseDrawer,
        NewsForm,
    },

    props: {
        news: {
            type: [Object, null],
            required: true,
        },
        isOpened: {
            type: Boolean,
            required: true,
        },
    },

    data() {
        return {
            form: null,
            asyncing: false,
            invalid: false,
        }
    },

    watch: {
        news: {
            handler(news) {
                if (news)
                    this.form = {
                        ...news,
                        publication_date: new Date(news.publication_date),
                        header_image: news.header_image || null,
                        imageSizes: pictureApiToImageSizes(news.header_image),
                        people_groups: news.people_groups.reduce
                            ? news.people_groups.reduce((acc, group) => {
                                  acc[group.id] = true
                                  return acc
                              }, {})
                            : news.people_groups,
                    }
            },
            immediate: true,
        },
    },

    methods: {
        cancel() {
            this.$emit('close')
        },
        async saveNews() {
            const isValid = await this.$refs.newsForm.v$.$validate()
            if (!isValid) {
                return
            }
            this.asyncing = true

            try {
                const payload = {
                    ...this.form,
                    header_image: this.form.header_image,
                    publication_date: this.form.publication_date.toISOString(),
                    people_groups: Object.entries(this.form.people_groups)
                        .filter(([, value]) => value)
                        .map(([id]) => id),
                }
                let payloadNews = { ...payload }
                delete payloadNews.imageSizes
                delete payloadNews.header_image
                let savedNews

                if (this.news.id) {
                    savedNews = await patchNews(
                        this.$store.getters['organizations/current']?.code,
                        this.news.id,
                        payloadNews
                    )
                } else {
                    savedNews = await createNews(
                        this.$store.getters['organizations/current']?.code,
                        payloadNews
                    )
                }

                const formData = new FormData()
                imageSizesFormData(formData, this.form.imageSizes)

                if (payload.header_image instanceof File) {
                    const formData = new FormData()

                    formData.append(
                        'file',
                        this.form['header_image'],
                        this.form['header_image'].name
                    )
                    imageSizesFormData(formData, this.form.imageSizes)
                    payload.header_image_id = (
                        await postNewsHeader(
                            this.$store.getters['organizations/current']?.code,
                            savedNews.id,
                            formData
                        )
                    ).id
                    formData.delete('file')
                    await patchNewsHeader(
                        this.$store.getters['organizations/current']?.code,
                        savedNews.id,
                        payload.header_image_id,
                        formData
                    )
                } else if (savedNews.header_image?.id) {
                    await patchNewsHeader(
                        this.$store.getters['organizations/current']?.code,
                        this.news.id,
                        this.news.header_image.id,
                        formData
                    )
                }

                this.$emit('news-edited', savedNews)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('news.save.success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('news.save.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.asyncing = false
                this.$emit('close')
            }
        },
    },
}
</script>
