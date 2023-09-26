<template>
    <div class="category-banner">
        <CategoryBackground
            class="category-image"
            :color="category.foreground_color"
            :background="category.background_color"
        />

        <div class="category-content">
            <h1>{{ category.name }}</h1>
            <p>{{ category.description }}</p>
        </div>

        <LpiButton :label="$t('project.create-project')" color="green" left-icon="Plus" />
    </div>
</template>

<script>
import CategoryBackground from '@/components/svgs/CategoryBackground.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ProjectCategoryModel from '@/models/project-category.model'

export default {
    name: 'CategoryBanner',

    components: { CategoryBackground, LpiButton },

    props: {
        category: {
            type: ProjectCategoryModel,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.category-banner {
    position: relative;
    overflow: hidden;
    height: 469px;
    padding: pxToRem(68px) 8% 0;
    color: $black;

    .category-image {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        min-width: 100%;
        z-index: -1;
    }

    .category-content {
        background: $white-transparent;
        border-radius: $border-radius-m;
        padding: $space-l $space-m $space-m;
        text-align: center;

        h1 {
            font-weight: 700;
            font-size: $font-size-8xl;
            margin-bottom: pxToRem(24px);
        }

        p {
            font-size: $font-size-l;
            font-weight: 400;
        }
    }

    > button {
        margin: $space-l auto 0;

        svg {
            height: 18px;
            fill: $white;
        }
    }
}

@media screen and (max-width: $max-mobile) {
    .category-banner {
        height: unset;
        padding: $space-m $space-2xs $space-m;

        .category-content {
            h1 {
                font-size: $font-size-6xl;
                line-height: $font-size-6xl;
                margin-bottom: $font-size-xs;
            }
        }

        > button {
            margin-top: $space-m;
        }
    }
}
</style>
