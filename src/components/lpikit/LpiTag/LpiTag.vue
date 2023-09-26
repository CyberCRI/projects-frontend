<template>
    <div class="tag" :class="type">
        <div class="tag-label">{{ label }}</div>

        <div v-if="hasIcon" class="icon-ctn" @click="onIconClicked">
            <IconImage name="Plus" v-if="type === 'add'" />
            <IconImage name="Close" v-else-if="type === 'remove'" />
            <IconImage name="Check" v-else-if="type === 'check'" />
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'LpiTag',

    emits: ['add-tag', 'remove-tag'],

    props: {
        tag: {
            type: Object,
            default: () => {},
        },

        hasIcon: {
            type: Boolean,
            default: false,
        },

        type: {
            type: String,
            default: 'add',
        },
    },

    computed: {
        label() {
            return this.tag[`name_${this.$store.getters['languages/current']}`] || this.tag.name
        },
    },

    components: {
        IconImage,
    },

    methods: {
        onIconClicked() {
            if (this.type === 'add') this.$emit('add-tag')
            else if (this.type === 'remove') this.$emit('remove-tag')
        },
    },
}
</script>

<style lang="scss" scoped>
.tag {
    display: flex;
    align-items: center;
    justify-content: center;
    border: $border-width-m solid $primary-dark;
    border-radius: $border-radius-l;
    overflow: hidden;
    box-sizing: border-box;
    min-width: 40px;
    background: $white;

    > * {
        padding: pxToRem(4px) $space-s;
        height: 19px;
    }

    .tag-label {
        text-transform: uppercase;
        font-size: $font-size-2xs;
        font-weight: 700;
        color: $primary-dark;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-ctn {
        background: $white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: $border-width-m solid $primary-dark;
        cursor: pointer;

        svg {
            height: 10px;
            fill: $primary-dark;
        }
    }

    &.check {
        .icon-ctn {
            background: $primary-light;
        }
    }

    &.remove {
        .icon-ctn svg {
            fill: $salmon;
        }
    }
}
</style>
