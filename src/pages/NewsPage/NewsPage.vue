<template>
    <div class="news-list-page page-section-medium" v-if="news">
        <div class="news-header">
            <div class="news-img-ctn">
                <CroppedImage
                    :alt="`${news.title} image`"
                    :image-sizes="imageSizes"
                    :src="croppedImageSrc"
                    class="picture"
                    :ratio="4 / 3"
                />
            </div>
            <div class="header-texts">
                <BreadCrumbs :breadcrumbs="breadcrumbs" />
                <h1 class="page-title">{{ news.title }}</h1>
                <p>{{ publicationDate }}</p>
            </div>
            <div class="news-actions" v-if="canEditNews">
                <ContextActionButton
                    action-icon="Pen"
                    class="edit-btn small"
                    @click="editedNews = news"
                />
                <ContextActionButton
                    action-icon="Close"
                    class="remove-btn small"
                    @click="newsToDelete = news"
                />
            </div>
        </div>
    </div>

    <div class="page-section-narrow" v-if="news">
        <div class="news-content" v-html="news.content"></div>
    </div>

    <div class="other-news page-section-narrow">
        <h3 class="other-news-title">{{ $t('news.page.others') }}</h3>
        <NewsListItem
            :news="anotherNews"
            v-for="anotherNews in otherNews"
            :key="anotherNews.id"
            @edit-news="editedNews = anotherNews"
            @delete-news="newsToDelete = anotherNews"
        />
    </div>

    <EditNewsDrawer
        :is-opened="!!editedNews"
        :news="editedNews"
        @news-edited="onNewsEdited"
        @close="editedNews = null"
    />

    <ConfirmModal
        v-if="newsToDelete"
        :content="$t('news.delete.message')"
        :title="$t('news.delete.title')"
        cancel-button-label="common.cancel"
        confirm-button-label="common.delete"
        @cancel="newsToDelete = null"
        @confirm="deleteNews"
        :asyncing="isDeletingNews"
    />
</template>
<script>
import BreadCrumbs from '@/components/lpikit/BreadCrumbs/BreadCrumbs.vue'
import NewsListItem from '@/components/lpikit/NewsListItem/NewsListItem.vue'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import { getNews, getAllNews, deleteNews } from '@/api/news.service.ts'
import permissions from '@/mixins/permissions.ts'
import ContextActionButton from '@/components/lpikit/LpiButton/ContextActionButton.vue'
import EditNewsDrawer from '@/components/lpikit/EditNewsDrawer/EditNewsDrawer.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'

export default {
    name: 'NewsPage',

    mixins: [imageMixin, permissions],

    components: {
        BreadCrumbs,
        CroppedImage,
        NewsListItem,
        ContextActionButton,
        ConfirmModal,
        EditNewsDrawer,
    },
    props: {
        slugOrId: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            news: null,
            otherNews: [],
            loading: false,
            style: {},
            editedNews: null,
            newsToDelete: null,
        }
    },

    async mounted() {
        await this.load()
    },

    watch: {
        slugOrId() {
            this.load()
        },
    },

    computed: {
        canEditNews() {
            return this.isAdmin
        },

        breadcrumbs() {
            return [
                {
                    name: 'News',
                    route: { name: 'NewsListPage' },
                },
            ]
        },

        publicationDate() {
            return this.news?.publication_date
                ? new Date(this.news.publication_date).toLocaleDateString()
                : ''
        },

        imageSizes() {
            return pictureApiToImageSizes(this.news?.header_image)
        },

        croppedImageSrc() {
            return this.news && this.news.header_image
                ? this.news.header_image.variations.small
                : `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-1.png`
        },
    },

    methods: {
        async load() {
            this.loading = true
            await this.loadNews()
            await this.loadOtherNews()
            this.loading = false
        },
        async loadNews() {
            this.news = await getNews(
                this.$store.getters['organizations/current']?.code,
                this.slugOrId
            )
        },

        async loadOtherNews() {
            // fetch 3 news because we want to show 2 other news and one might be the current one
            this.otherNews = (
                await getAllNews(this.$store.getters['organizations/current']?.code, { limit: 3 })
            ).results
                ?.filter((news) => news.id !== this.news.id)
                .slice(0, 2)
        },

        async deleteNews() {
            this.isDeletingNews = true
            try {
                await deleteNews(
                    this.$store.getters['organizations/current']?.code,
                    this.newsToDelete.id
                )
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('news.delete.success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('news.delete.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                if (this.newsToDelete.id != this.news.id) {
                    this.loadOtherNews()
                    this.newsToDelete = null
                    this.isDeletingNews = false
                } else {
                    this.$router.push({ name: 'NewsListPage' })
                }
            }
        },
        onNewsEdited(editedNews) {
            if (editedNews.id === this.news.id) {
                this.loadNews()
            } else {
                this.loadOtherNews()
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.news-header {
    margin-top: 70px;
    margin-bottom: 3rem;

    --news-dimension: 16rem;
    --picture-ratio: calc(4 / 3);

    display: flex;
    gap: 2rem;
    height: var(--news-dimension);
    overflow: hidden;
    padding: 1rem;
    border: $border-width-s solid $gray-10;
    border-radius: 1rem;
}

.news-img-ctn {
    flex-basis: calc(var(--picture-ratio, 1) * var(--news-dimension));
    height: var(--news-dimension);
    flex-shrink: 0;
}

.header-texts {
    flex-grow: 1;
}

.news-actions {
    display: flex;
    gap: $space-s;
}

.news-texts {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
}

.page-title {
    font-size: $font-size-3xl;
    text-align: left;
}

.other-news {
    .other-news-title {
        font-size: $font-size-xl;
        margin-bottom: 2rem;
        text-align: center;
    }

    display: flex;
    flex-flow: column;
    gap: 1rem;
    margin: 4rem auto;
}

.cropped-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1rem;
}
</style>
