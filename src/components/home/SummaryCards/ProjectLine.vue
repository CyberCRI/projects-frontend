<template>
    <RouterLink
        :to="{ name: 'pageProject', params: { slugOrId: project.slug || project.id } }"
        class="line"
    >
        <CroppedApiImage
            ref="projectImg"
            :alt="`${project.title} image`"
            class="img-container"
            :picture-data="project?.header_image"
            picture-size="medium"
            default-picture="/placeholders/header_placeholder.png"
        />
        <div class="project-title">
            {{ $filters.capitalize(project.title) }}
        </div>
    </RouterLink>
</template>

<script>
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

export default {
    name: 'ProjectLine',

    components: { CroppedApiImage },

    props: {
        project: {
            type: Object,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.line {
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
        background-color: $primary-lighter;
    }
}

.img-container {
    border-radius: $border-radius-s;
    background-size: cover;
    background-position: top center;
    width: 50px;
    height: 50px;
    flex: none;
    margin-right: $space-s;
}

.project-title {
    font-weight: 700;
    color: $primary-dark;
    -webkit-line-clamp: 1;
    line-height: $line-height-tight;
}
</style>
