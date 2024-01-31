<template>
    <div :class="{ 'search-input-ctn--full': full }" class="search-input-ctn">
        <IconImage class="left-icon search" name="Search" />
        <input
            ref="search-input"
            v-model.trim="model"
            :placeholder="placeholder"
            class="search-input"
            type="text"
            @keyup.enter="onEnter"
            data-test="search-input"
            :list="listId"
            @keyup="$emit('keyup', $event)"
        />
        <span class="right-icon delete" v-if="model.length" @click="deleteValue">
            <IconImage name="Close" />
        </span>
        <datalist :id="listId">
            <option v-for="suggestion in suggestions" :value="suggestion"></option>
        </datalist>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'SearchInput',

    emits: ['update:modelValue', 'delete-query', 'enter', 'keyup'],

    components: {
        IconImage,
    },

    props: {
        full: {
            type: Boolean,
            default: false,
        },

        modelValue: {
            type: String,
            default: '',
        },

        placeholder: {
            type: String,
            default: '',
        },

        suggestions: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            model: this.modelValue,
            listId: 'search-suggestions-' + (Math.random() + 1).toString(36).substring(7),
        }
    },

    methods: {
        deleteValue() {
            this.$emit('delete-query')
        },

        onEnter() {
            this.$emit('enter')
        },
    },

    watch: {
        modelValue(value) {
            this.model = value
        },
        model(value) {
            this.$emit('update:modelValue', value)
        },
    },
}
</script>

<style lang="scss" scoped>
.search-input-ctn {
    position: relative;
    cursor: pointer;
    width: 350px;
    max-width: 100%;

    .search-input {
        border-radius: $border-radius-l;
        background: $white;
        border: $border-width-s solid $green;
        color: $black;
        padding: 11px $space-xl; // 11 + 1 px border
        font-size: $font-size-m;
        width: pxToRem(350px);
        max-width: 100%;
        box-sizing: border-box;

        &::placeholder {
            color: $gray-7;
        }

        &:focus-visible {
            outline-color: $green-dark;
        }
    }

    &--full {
        width: 100%;

        .search-input {
            width: 100%;
        }
    }

    .left-icon,
    .right-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        fill: $primary-dark;
    }

    .left-icon {
        left: $font-size-s;
        height: $font-size-l;
        width: $font-size-l;
        pointer-events: none;
    }

    .right-icon {
        right: $font-size-s;
        display: inline-block;
        width: $font-size-s;
        height: $font-size-s;
        background: $primary-dark;
        border: $border-width-m solid $primary-dark;
        border-radius: 100%;

        svg {
            width: $font-size-s;
            fill: $white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>
