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
            @keyup="$emit('keyup', $event)"
        />
        <span class="right-icon delete" v-if="model.length" @click="deleteValue">
            <IconImage name="Close" />
        </span>
        <div class="suggestions" v-if="suggestions?.length && !hideSuggestions">
            <h6 class="suggestions-label">{{ $t('search.suggestions') }}</h6>
            <ul>
                <li
                    v-for="suggestion in suggestions"
                    :key="suggestion"
                    @click="acceptSuggestion(suggestion)"
                >
                    {{ suggestion }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'

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
            hideSuggestions: false,
        }
    },

    methods: {
        deleteValue() {
            this.$emit('delete-query')
        },

        onEnter() {
            this.$emit('enter')
        },

        acceptSuggestion(suggestion) {
            this.model = suggestion
            this.hideSuggestions = true
            this.$nextTick(this.onEnter)
        },
    },

    watch: {
        modelValue(value) {
            this.model = value
        },
        model(value) {
            this.$emit('update:modelValue', value)
        },

        suggestions() {
            this.hideSuggestions = false
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
        border: $border-width-s solid $primary;
        color: $black;
        padding: 11px $space-xl 10px; // 11 + 1 px border
        font-size: $font-size-m;
        width: pxToRem(350px);
        max-width: 100%;
        box-sizing: border-box;

        &::placeholder {
            color: $light-gray;
        }

        &:focus-visible {
            outline-color: $primary;
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
        left: $layout-size-s;
        height: $layout-size-l;
        width: $layout-size-l;
        pointer-events: none;
    }

    .right-icon {
        right: $layout-size-s;
        display: inline-block;
        width: $layout-size-s;
        height: $layout-size-s;
        background: $primary-dark;
        border: $border-width-m solid $primary-dark;
        border-radius: 100%;

        svg {
            width: $layout-size-s;
            fill: $white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .suggestions {
        position: absolute;
        z-index: 1;
        top: 100%;
        left: 0;
        right: 0;
        max-height: 10rem;
        background-color: $white;
        border: $border-width-s solid $primary;
        border-radius: $border-radius-l;
        display: flex;
        flex-flow: column nowrap;

        .suggestions-label {
            font-size: $font-size-m;
            padding: 0.5rem $border-radius-l;
            text-align: center;
            font-weight: normal;
        }

        ul {
            flex-grow: 1;
            overflow-y: auto;
        }

        li {
            padding: 0.5rem $border-radius-l;
            cursor: pointer;

            &:hover {
                background-color: $primary-lighter;
            }
        }
    }
}
</style>
