<template>
    <div class="create-news-page page-section-narrow">
        <h1 class="page-title">{{ $t('news.create.title') }}</h1>

        <NewsForm ref="newsForm" v-model="form" @invalid="invalid = $event" />

        <div class="form-actions">
            <LpiButton
                :disabled="asyncing"
                :label="$filters.capitalize($t('common.cancel'))"
                secondary
                class="footer__left-button"
                @click="cancel"
                data-test="close-button"
            />

            <LpiButton
                :disabled="invalid || asyncing"
                :label="$filters.capitalize($t('common.confirm'))"
                :btn-icon="asyncing ? 'LoaderSimple' : null"
                class="footer__right-button"
                @click="saveNews"
                data-test="confirm-button"
            />
        </div>
    </div>
</template>
<script>
import NewsForm, { defaultForm } from '@/components/news/NewsForm/NewsForm.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import { createNews, postNewsHeader } from '@/api/news.service.ts'
import { imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
    name: 'CreateNewsPage',
    components: {
        NewsForm,
        LpiButton,
    },
    setup() {
        const toaster = useToasterStore()
        const organizationsStore = useOrganizationsStore()
        return {
            toaster,
            organizationsStore,
        }
    },

    data() {
        return {
            form: defaultForm(),
            asyncing: false,
            invalid: false,
        }
    },
    methods: {
        cancel() {
            this.form = defaultForm()
            this.$router.push({ name: 'NewsListPage' })
        },
        async saveNews() {
            const isValid = await this.$refs.newsForm.v$.$validate()
            if (!isValid) {
                return
            }
            try {
                this.asyncing = true
                // TODO: handle header_image and imageSize
                const payload = {
                    ...this.form,
                    publication_date: this.form.publication_date,
                    people_groups: Object.entries(this.form.people_groups)
                        .filter(([, value]) => value)
                        .map(([id]) => id),
                }
                const savedNews = await createNews(this.organizationsStore.current?.code, payload)

                if (this.form.header_image instanceof File) {
                    const formData = new FormData()

                    formData.append(
                        'file',
                        this.form['header_image'],
                        this.form['header_image'].name
                    )

                    imageSizesFormData(formData, this.form.imageSizes)

                    await postNewsHeader(
                        this.organizationsStore.current?.code,
                        savedNews.id,
                        formData
                    )
                }

                this.toaster.pushSuccess(this.$t('news.save.success'))
            } catch (err) {
                this.toaster.pushError(`${this.$t('news.save.error')} (${err})`)
                console.error(err)
            } finally {
                this.asyncing = false
                this.$router.push({ name: 'NewsListPage' })
            }
        },
    },
}
</script>
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
