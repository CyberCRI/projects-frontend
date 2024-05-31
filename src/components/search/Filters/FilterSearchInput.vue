<template>
    <div class="filter-search-input-ctn">
        <input
            ref="search-input"
            v-model="model"
            :placeholder="placeholder"
            class="search-input"
            type="text"
            @keyup.enter="onEnter"
            data-test="search-input"
        />
    </div>
</template>

<script>
export default {
    name: 'FilterSearchInput',

    emits: ['update:modelValue', 'enter'],

    props: {
        modelValue: {
            type: String,
            default: '',
        },

        placeholder: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            model: this.modelValue,
        }
    },

    methods: {
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
.filter-search-input-ctn {
    position: relative;
    cursor: pointer;
    width: 100%;

    .search-input {
        background: $white;
        border: $border-width-s solid $light-gray;
        border-radius: $border-radius-xs;
        color: $black;
        padding: $space-s;
        font-size: $font-size-m;
        width: 100%;
        box-sizing: border-box;

        &:focus,
        &:focus-visible {
            outline: 0 none;
        }

        &::placeholder {
            color: $light-gray;
        }
    }
}
</style>
