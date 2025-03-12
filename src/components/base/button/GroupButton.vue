<template>
    <div
        class="group-button"
        :class="{
            'is-danger': isDanger,
            'is-vertical': isVertical,
            'is-custom-color': customColor,
        }"
        :id="`group-button-${uniqueId}`"
        role="group"
        aria-label="Radio button group"
        :style="groupButtonStyle"
    >
        <div
            v-for="(button, index) in options"
            class="button-container"
            :key="index"
            :class="[{ selected: button.value === modelValue }, size]"
            :tabIndex="index + 1"
            @click="selectButton(button)"
            @transitionend="setSliderStyle"
        >
            <transition
                appear
                @after-enter="onIconMounted(button)"
                @after-leave="onIconMounted(button)"
            >
                <IconImage
                    v-if="hasIcon && button.iconName && size === 'default'"
                    class="icon"
                    :name="button.iconName"
                    :id="button.iconName"
                    :class="{ 'icon-selected': button.value === modelValue }"
                />
            </transition>
            <label
                class="label"
                :class="[{ 'label-selected': button.value === modelValue }, modelValue]"
                >{{ button.label }}</label
            >
        </div>

        <div class="slider" :style="sliderStyle" />
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import debounce from 'lodash.debounce'
import useLanguagesStore from '@/stores/useLanguages'

export default {
    name: 'GroupButton',

    emits: ['update:model-value'],

    components: {
        IconImage,
    },
    setup() {
        const languagesStore = useLanguagesStore()
        return {
            languagesStore,
        }
    },
    data() {
        return {
            sliderStyle: null,
            uniqueId: (Math.random() + 1).toString(36).substring(7),
            mountedIcons: [],
        }
    },

    props: {
        modelValue: {
            type: [String, Boolean],
            default: '',
        },

        options: {
            type: Array,
            required: true,
        },

        hasIcon: {
            type: Boolean,
            default: false,
        },

        size: {
            type: String,
            default: 'default',
            validator(value) {
                return ['default', 's-small', 's-extra-small'].includes(value)
            },
        },

        isDanger: {
            type: Boolean,
            default: false,
        },

        isVertical: {
            type: Boolean,
            default: false,
        },

        customColor: {
            type: String,
            default: null,
        },
    },

    computed: {
        groupButtonStyle() {
            if (!this.customColor) return {}
            return { 'border-color': this.customColor }
        },
        lang() {
            return this.languagesStore.current
        },
    },

    mounted() {
        this.$nextTick(this.setSliderStyle)

        window.addEventListener('resize', debounce(this.setSliderStyle, 300))
    },

    watch: {
        lang() {
            this.$nextTick(this.setSliderStyle)
        },
    },

    methods: {
        selectButton(selectedButton) {
            this.$emit('update:model-value', selectedButton.value)
            this.$nextTick(this.setSliderStyle)
        },

        onIconMounted(icon) {
            this.mountedIcons.push(icon)
            if (this.mountedIcons.length === this.options.filter((el) => el.iconName).length)
                this.setSliderStyle()
        },

        setSliderStyle() {
            if (!this.options.some((button) => button.value === this.modelValue)) return

            const container = document.getElementById(`group-button-${this.uniqueId}`)
            if (!container) return

            const groupButton = container.getElementsByClassName('button-container')
            let selectedReached = false
            let firstButtonSelected = false

            const selected = container.getElementsByClassName('selected')[0]

            if (!this.isVertical) {
                // Calculate slider's left offset
                let leftOffset = 0
                Array.prototype.forEach.call(groupButton, (button, i) => {
                    if (button.className.split(' ').includes('selected')) {
                        selectedReached = true
                        if (i === 0) firstButtonSelected = true
                    }
                    if (!selectedReached) leftOffset += button.offsetWidth
                })

                // If not in vertical mode, set slider's width
                const selectedWidth = selected.offsetWidth

                this.sliderStyle = `left: ${
                    leftOffset + (firstButtonSelected ? 0 : 1)
                }px; width: ${selectedWidth + (firstButtonSelected ? 1 : 0)}px; ${
                    this.customColor ? `background-color: ${this.customColor}` : ''
                }`
            } else {
                // Else set slider's height
                // Calculate slider's left offset
                let topOffset = 0
                Array.prototype.forEach.call(groupButton, (button, i) => {
                    if (button.className.split(' ').includes('selected')) {
                        selectedReached = true
                        if (i === 0) firstButtonSelected = true
                    }
                    if (!selectedReached) topOffset += button.offsetHeight
                })

                const selectedHeight = selected.offsetHeight

                this.sliderStyle = `top: ${topOffset + (firstButtonSelected ? 0 : 1)}px; height: ${
                    selectedHeight + (firstButtonSelected ? 1 : 0)
                }px; ${this.customColor ? `background-color: ${this.customColor}` : ''}`
            }
        },
    },
}
</script>

<style lang="scss" scoped>
/* This will be moved to the reset file */
*,
*::before,
*::after {
    box-sizing: border-box;
}

.label {
    cursor: pointer;
    margin: 0;
    font-size: inherit;
    font-weight: bold;
    transition: 0.15s color ease-in-out;
    line-height: $line-height-squashed;
}

.label-selected {
    color: $white;

    &.cancel {
        color: $mid-gray;
    }
}

.icon {
    margin-right: $space-s;
    width: 20px;
    height: 18px;
    fill: $primary-dark;
    transition: 0.15s fill ease-in-out;
}

.icon-selected {
    fill: $white;
}

.group-button {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    overflow: hidden;
    box-shadow: 0 0 0 $border-width-s $primary-dark inset;
    border-radius: $border-radius-l;
    z-index: 1;

    &.is-danger {
        box-shadow: 0 0 0 $border-width-s $salmon inset;

        .button-container.selected {
            background: $salmon;
        }

        .button-container:not(.selected) {
            .label {
                color: $salmon;
            }

            .icon {
                fill: $salmon;
            }
        }

        .slider {
            background: $salmon;
        }
    }

    &.is-vertical {
        flex-direction: column;

        .slider {
            width: 100%;
        }
    }

    &:not(.is-vertical) {
        .slider {
            height: 100%;
        }
    }
}

.button-container {
    display: flex;
    align-items: center;
    padding: $space-s $space-l;
    font-size: $font-size-m;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:not(.selected) {
        color: $primary-dark;
    }

    &:not(.selected):hover {
        opacity: 0.7;
    }
}

.slider {
    display: flex;
    position: absolute;
    top: 0;
    transition: all 0.15s ease-in-out;
    background: $primary-dark;
    z-index: -1;
    border-radius: $border-radius-l;
    border: $border-width-s solid $primary-dark;
}

// TODO: remove "s-" in the following classes when we don't import Buefy style anymore
.s-small {
    font-size: $font-size-xs;
    padding: $space-s 14px;
    height: 24px;
}

.s-extra-small {
    font-size: $font-size-2xs;
    padding: $space-2xs $space-m;
    height: 13px;
}
</style>
