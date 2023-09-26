<template>
    <div
        class="lpi-select"
        :class="{ active: isOpen }"
        v-click-outside="clickOutside"
        data-test="select-project-category"
    >
        <div
            class="menu-header"
            :class="{ placeholder: !selected, 'placeholder--open': isOpen }"
            @click="toggleMenu"
        >
            <span class="selected-label" :style="styles">{{
                selected ? selected.label : placeholder
            }}</span>
            <IconImage :name="chevron" class="svg" />
        </div>
        <div class="options-wrapper">
            <Transition name="menu-fade">
                <ul v-show="isOpen" class="option-list">
                    <template v-for="option in options">
                        <li v-if="!selected || option.value !== selected.value" :key="option.value">
                            <button
                                class="menu-dropdown"
                                @click="select(option)"
                                :data-test="option.dataTest"
                            >
                                {{ option.label }}
                            </button>
                        </li>
                    </template>
                </ul>
            </Transition>
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'LpiSelect',

    emits: ['update:model-value', 'blur'],

    components: {
        IconImage,
    },
    watch: {
        selected(neo) {
            this.$emit('update:model-value', neo.value)
        },
        options: {
            handler: function (neo) {
                this.selected = neo.find((option) => option.value === this.modelValue)
            },
            deep: true,
        },

        modelValue: function (neo) {
            this.selected = this.options.find((option) => option.value === neo)
        },

        isOpen: {
            handler: function (open) {
                this.chevron = open ? 'ChevronUp' : 'ChevronDown'
            },
            immediate: true,
        },
    },
    data() {
        return {
            isOpen: false,
            selected: this.options.find((option) => option.value === this.modelValue),
            chevron: 'ChevronDown',
        }
    },

    computed: {
        styles() {
            let maxCharLength = this.placeholder ? this.placeholder.length : 0
            for (let i = 0; i < this.options.length; i++) {
                maxCharLength = Math.max(
                    maxCharLength,
                    this.options[i].label ? this.options[i].label.length : 0
                )
            }

            return {
                width: `${maxCharLength}em`, // use em to get current font width
            }
        },
    },

    props: {
        modelValue: {
            type: [String, Number],
            default: '',
        },

        options: {
            type: Array,
            required: true,
            default: () => [],
        },

        placeholder: {
            type: String,
            default: 'Select',
        },
    },

    methods: {
        toggleMenu() {
            this.isOpen = !this.isOpen
        },

        select(option) {
            this.selected = option
            this.isOpen = false
        },
        clickOutside() {
            this.isOpen = false
            this.$emit('blur', {})
        },
    },
}
</script>

<style lang="scss" scoped>
.lpi-select {
    display: inline-block;
    position: relative;
    background: $white;
    border-radius: $border-radius-s;
    border: $border-width-s solid $gray-7;

    &.active {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-width: 0;

        .option-list {
            border-top-width: 0;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }

    .option-list {
        background-color: $white;
        border: $border-width-s solid $gray-7;
        border-radius: $border-radius-s;
    }

    .menu-header {
        z-index: 14;
        padding: pxToRem(12px) $space-l;
        appearance: none;
        font-size: $font-size-m;
        font-weight: 700;
        max-width: 100%;
        transition: 0.15s all ease-in-out;
        padding-right: $space-xl;
        background: transparent;
        border: none;
        cursor: pointer;
        color: $black;

        &.placeholder {
            color: $gray-8;
            font-weight: 400;

            &--open {
                padding-top: pxToRem(13px);
            }
        }

        &:focus {
            outline: 0;
        }
    }

    .menu-dropdown {
        padding: pxToRem(10px) $space-l;
        appearance: none;
        font-size: $font-size-m;
        font-weight: 700;
        width: 100%;
        max-width: 100%;
        padding-right: $space-xl;
        background: transparent;
        border: none;
        cursor: pointer;
        text-align: left;
        color: $black;

        &:hover {
            background: $gray-2;
        }
    }

    .selected-label {
        display: inline-block;
        font-size: $font-size-m;
    }
}

.options-wrapper {
    position: absolute;
    top: 100%;
    min-width: 100%;
    left: -$border-width-s;
    right: -$border-width-s;
    z-index: 100;
    overflow: hidden;

    button {
        font-weight: 400;
    }
}

.svg {
    height: 21px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
    fill: $black;
}

.menu-fade-leave-active,
.menu-fade-enter-active {
    transform: translateY(0);
    transition: 0.15s transform ease-in-out;
}

.menu-fade-enter,
.menu-fade-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}

// old style, add 'primary' class to use it
// TODO check if still needed
.lpi-select.primary {
    background: $primary-dark;
    border-radius: $border-radius-l;
    border: 0 none;

    &.active {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        .option-list {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }

    .menu-header {
        color: $white;
    }

    .option-list {
        background-color: $primary-dark;
        border-radius: $border-radius-l;
    }

    .menu-dropdown {
        color: $white;
    }

    .svg {
        fill: $white;
    }
}
</style>
