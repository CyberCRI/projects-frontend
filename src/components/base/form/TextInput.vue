<template>
    <div :class="{ 'big-input': bigInput, disabled: disabled }" class="input-ctn">
        <label v-if="label" :for="inputId || randomId">{{ label }}</label>
        <slot v-else></slot>

        <textarea
            v-if="inputType === 'textarea'"
            :id="inputId || (label ? randomId : null)"
            v-model="model"
            :placeholder="placeholder"
            @keydown.enter="$emit('enter')"
            v-disable-focus="unfocusable"
            @focus="$emit('focus', $event)"
            @blur="$emit('blur', $event)"
            :data-test="dataTest"
            :maxlength="maxLength"
            :rows="rows"
        />

        <span class="input-wrapper" :class="{ 'is-password': inputType == 'password' }" v-else>
            <input
                :id="inputId || (label ? randomId : null)"
                v-model="model"
                :placeholder="placeholder"
                :type="typeOverride || inputType || 'text'"
                @keydown.enter="$emit('enter')"
                v-disable-focus="unfocusable"
                :disabled="disabled"
                @focus="$emit('focus', $event)"
                @blur="$emit('blur', $event)"
                :data-test="dataTest"
                :maxlength="maxLength"
            />
            <IconImage
                v-if="inputType === 'password'"
                class="show-password"
                @click="typeOverride = typeOverride ? null : 'text'"
                :name="typeOverride ? 'Eye' : 'EyeSlash'"
            />
        </span>

        <small v-if="bottomText">{{ bottomText }}</small>
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
export default {
    name: 'TextInput',

    emits: ['update:modelValue', 'enter', 'focus', 'blur'],

    components: { IconImage },

    props: {
        modelValue: {
            type: String,
            default: '',
        },

        placeholder: {
            type: String,
            default: '',
        },

        label: {
            type: String,
            default: null,
        },

        bottomText: {
            type: String,
            default: null,
        },

        inputId: {
            type: String,
            default: '',
        },

        inputType: {
            type: String,
            default: 'text',
        },

        bigInput: {
            type: Boolean,
            default: false,
        },

        unfocusable: {
            type: Boolean,
            default: false,
        },
        dataTest: {
            type: String,
            default: 'input-field',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        maxLength: {
            type: Number,
            default: null,
        },
        rows: {
            type: [Number, String],
            default: 3,
        },
    },

    data() {
        return {
            randomId: (Math.random() + 1).toString(36).substring(7),
            typeOverride: null,
        }
    },

    computed: {
        model: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            },
        },
    },
}
</script>

<style lang="scss" scoped>
.input-ctn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .input-wrapper {
        width: 100%;

        &.is-password {
            position: relative;

            input {
                padding-right: 2rem;
            }

            .show-password {
                position: absolute;
                z-index: 10;
                right: 0;
                top: 50%;
                transform: translate(-20%, -50%);
                height: 60%;
                fill: $primary-dark;
                cursor: pointer;
            }
        }
    }

    input,
    textarea {
        padding: 10px;
        font-size: 1em;
        box-sizing: border-box;
        width: 100%;
        border-radius: $border-radius-s;
        background: $white;
        border: $border-width-s solid $light-gray;
        color: $black;
    }

    textarea {
        border-bottom-right-radius: $border-radius-s;
    }

    ::placeholder {
        color: $mid-gray;
    }

    label {
        font-size: $font-size-s;
        font-weight: bold;
        margin-bottom: $space-m;
        color: $black;

        &.large-space {
            margin-bottom: $space-l;
        }
    }

    small {
        font-size: $font-size-xs;
        align-self: flex-end;
        color: $black;
    }

    &.disabled {
        input {
            color: $light-gray;
        }

        label {
            color: $light-gray;
        }

        small {
            color: $light-gray;
        }
    }

    &.big-input input {
        height: 60px;
        border-radius: 35px;
        font-size: $font-size-3xl;
        line-height: 1;
    }

    @media screen and (min-width: $min-tablet) {
        &.big-input input {
            height: 90px;
            font-size: $font-size-5xl;
            line-height: 1;
            border-radius: $border-radius-s;
        }
    }
}
</style>
