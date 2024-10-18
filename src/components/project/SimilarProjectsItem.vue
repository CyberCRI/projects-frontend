<template>
    <RouterLink
        class="similar-project"
        :to="{
            name: 'projectSummary',
            params: {
                slugOrId: project.slug,
            },
        }"
    >
        <CroppedApiImage
            v-if="project?.header_image"
            :alt="`${project.title} image`"
            :picture-data="project.header_image"
            picture-size="small"
            default-picture="/placeholders/header_placeholder.png"
        />

        <p>{{ project.title }}</p>
    </RouterLink>
</template>

<script>
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

export default {
    name: 'SimilarProjectsItem',

    components: { CroppedApiImage },

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },
    },
}
</script>

<style lang="scss" scoped>
.similar-project {
    display: flex;
    align-items: center;
    cursor: pointer;

    .cropped-image {
        margin-right: $space-s;
        flex: 0 0 72px;
        height: 72px;
        border-radius: $border-radius-xs;
    }

    p {
        color: $white;
        font-size: $font-size-s;
        font-weight: 400;
    }
}
</style>
