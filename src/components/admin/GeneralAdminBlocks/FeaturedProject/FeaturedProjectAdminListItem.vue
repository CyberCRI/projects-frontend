<template>
    <NuxtLink
        class="featured-project-admin-list-item"
        :to="{ name: 'pageProject', params: { slugOrId: project.slug } }"
    >
        <div class="project-image">
            <CroppedApiImage
                :alt="`${project.title} image`"
                :picture-data="project.header_image"
                picture-size="small"
                default-picture="/placeholders/header_placeholder.png"
                class="picture"
            />
        </div>
        <div project-text>
            <h4 class="title">{{ project.title }}</h4>
        </div>
    </NuxtLink>
</template>

<script>
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

export default {
    name: 'FeaturedProjectAdminListItem',

    components: {
        CroppedApiImage,
    },

    props: {
        project: {
            type: Object,
            required: true,
        },
    },
}
</script>
<style scoped lang="scss">
.featured-project-admin-list-item {
    display: flex;
    gap: $space-unit;
    justify-content: flex-start;
    align-items: flex-start;

    &:hover {
        background-color: $primary-lighter;
    }

    .project-image {
        display: flex;
        width: 4rem;
        height: 4rem;
        overflow: hidden;
    }

    .picture {
        flex-grow: 1;
    }

    .title {
        color: $primary-dark;
        font-weight: 700;
        text-overflow: ellipsis;

        /* Required for text-overflow to do anything */
        white-space: nowrap;
        overflow: hidden;
        max-width: 32rem;

        @media screen and (max-width: $min-tablet) {
            max-width: 15rem;
        }
    }

    & + .featured-project-admin-list-item {
        margin-top: $space-unit;
    }
}
</style>
