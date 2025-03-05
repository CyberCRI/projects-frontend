<template>
    <ProjectListSkeleton class="card-list" v-if="isLoading" :min-gap="gridGap" :limit="limit" />

    <div v-else>
        <template v-if="isEmpty">
            <slot name="empty">
                <div class="card-list__empty">
                    <p class="card-list__empty--text">{{ $t('project.nothing') }}</p>
                    <img
                        :src="`${runtimeConfig.public.appPublicBinariesPrefix}/empties/emptyBox.svg`"
                        alt="Nothing here"
                    />
                </div>
            </slot>
        </template>
        <div v-else class="card-container">
            <DynamicGrid :min-gap="gridGap" class="card-list">
                <div v-for="item in items" :key="item.id" class="card-list__content">
                    <slot name="default" :item="item"></slot>
                </div>
            </DynamicGrid>
        </div>
    </div>
</template>

<script>
import ProjectListSkeleton from '@/components/project/ProjectListSkeleton.vue'
import DynamicGrid from '@/components/base/DynamicGrid.vue'

export default {
    name: 'CardList',

    components: {
        ProjectListSkeleton,
        DynamicGrid,
    },

    props: {
        items: {
            type: Array,
            default: () => [],
        },

        isLoading: {
            type: Boolean,
            default: false,
        },

        limit: {
            type: Number,
            default: 12,
        },
    },

    setup() {
        const runtimeConfig = useRuntimeConfig()
        return {
            runtimeConfig,
        }
    },

    data() {
        return {
            gridGap: 24,
        }
    },

    computed: {
        isEmpty() {
            return !this.isLoading && !this.items.length
        },
    },
}
</script>

<style lang="scss" scoped>
.card-list {
    justify-content: space-between;
}

.card-list__empty {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
}

.card-list__empty--text {
    font-weight: 400;
    font-size: 22px;
    color: $primary-dark;
    margin-bottom: 24px;
}

.card-list__empty--image {
    width: 200px;
}

.card-list__content {
    width: min-content;
}

.card-container {
    margin: $space-xl 0;
}
</style>
