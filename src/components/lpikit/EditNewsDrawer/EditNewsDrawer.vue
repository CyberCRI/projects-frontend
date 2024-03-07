<template>
    <DrawerLayout
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="$refs?.newsForm?.v$?.$invalid"
        :is-opened="isOpened"
        :title="$t('news.drawer.title')"
        class="news-drawer medium"
        @confirm="saveNews"
        @close="cancel"
    >
        <NewsForm ref="newsForm" v-model="form" class="news-form" />
    </DrawerLayout>
</template>
<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import NewsForm from '@/components/lpikit/NewsForm/NewsForm.vue'
export default {
    name: 'EditNewsDrawer',

    emits: ['close'],

    components: {
        DrawerLayout,
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
        }
    },

    watch: {
        news: {
            handler(news) {
                if (news)
                    this.form = {
                        ...news,
                        date_publication: new Date(news.date_publication),
                        header_image: news.header_image || null,
                        imageSizes: news.header_image?.imageSizes || null,
                        groups: news.groups.reduce((acc, group) => {
                            acc[group.id] = true
                            return acc
                        }, {}),
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
            // TODO handle image
            const formData = {
                ...this.form,
                date_publication: this.form.date_publication.toISOString(),
                groups: Object.entries(this.form.groups)
                    .filter(([, value]) => value)
                    .map(([id]) => id),
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log('saveNews', formData)
            this.asyncing = false
            this.$emit('close')
        },
    },
}
</script>
