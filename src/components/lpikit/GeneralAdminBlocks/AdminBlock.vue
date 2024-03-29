<template>
    <div class="admin-block">
        <div class="admin-block-header">
            <h4 class="title">{{ blockTitle }}</h4>
            <slot name="actions"></slot>
        </div>
        <div class="loader" v-if="isLoading">
            <LoaderSimple />
        </div>
        <template v-else>
            <div class="admin-block-content">
                <slot></slot>
            </div>
            <div class="admin-block-footer">
                <slot name="footer"></slot>
            </div>
        </template>
    </div>
</template>
<script>
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
export default {
    name: 'AdminBlock',

    components: {
        LoaderSimple,
    },

    props: {
        blockTitle: {
            type: String,
            required: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
<style lang="scss" scoped>
.admin-block {
    padding: $space-unit 0;
    border-bottom: $border-width-s solid $gray-10;
}

.admin-block-header,
.admin-block-content,
.admin-block-footer {
    padding-bottom: $space-unit;
}

.admin-block-header {
    display: flex;
    gap: $space-unit;
    align-items: flex-start;
    justify-content: space-between;
}

.loader {
    display: flex;
    justify-content: center;
    padding: $space-l 0;
}
</style>
