<template>
    <div class="news-list-page page-section-medium">
        <h1 class="page-title">{{ $t('news.list.title') }}</h1>

        <LpiButton
            primary
            :label="$filters.capitalize($t('news.list.create'))"
            @click="createNews"
            data-test="create-news-button"
            btn-icon="Plus"
            class="create-news-button"
        />
        <div class="news-list-page__content">
            NEWS LIST

            <RouterLink :to="{ name: 'NewsPage', params: { slugOrId: '1' } }">News 1</RouterLink>
        </div>
    </div>
</template>
<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'NewsListPage',
    components: {
        LpiButton,
    },
    methods: {
        createNews() {
            this.$router.push({ name: 'CreateNewsPage' })
        },
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-top: pxToRem(60px);
    margin-bottom: pxToRem(60px);
}

.create-news-button {
    position: fixed;
    top: 10rem;
    right: 10rem;
}
</style>
