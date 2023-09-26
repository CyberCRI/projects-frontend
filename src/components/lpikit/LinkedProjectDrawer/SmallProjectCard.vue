<template>
    <div class="small-project-card">
        <img
            v-if="project.header_image && project.header_image.variations"
            :alt="`${project.title} image`"
            :src="project.header_image.variations.small"
        />

        <div class="project-content">
            <div class="project-title">{{ project.title }}</div>
            <div class="project-purpose">{{ project.purpose }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SmallProjectCard',

    props: {
        project: {
            type: Object,
            default: () => {},
        },
    },
}
</script>

<style lang="scss" scoped>
.small-project-card {
    display: flex;
    border: $border-width-l solid $primary-dark;
    border-radius: $border-radius-m;
    overflow: hidden;
    height: 80px;
    box-sizing: border-box;

    img {
        width: 100px;
        object-fit: cover;
    }

    .project-content {
        padding: $space-m $space-s;
        background: $white;
        flex-grow: 1;

        .project-title {
            color: $primary-dark;
            font-size: $font-size-m;
            font-weight: 900;
        }

        .project-purpose {
            font-size: $font-size-xs;
            margin-top: $space-xs;
        }
    }
}
</style>
