<template>
    <form>
        <div class="form-section">
            <TextInput
                :model-value="modelValue.title"
                @update:model-value="updateForm({ title: $event })"
                :label="$filters.capitalize($t('instructions.form.title.label'))"
                :placeholder="$filters.capitalize($t('instructions.form.title.placeholder'))"
                class="input-field"
                @blur="v$.modelValue.title.$validate"
            />
            <p
                v-for="error of v$.modelValue.title.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>

        <div class="form-section">
            <label>{{ $t('instructions.form.publication_date.label') }}</label>
            <button type="button" @click="showDatePicker = true" class="date-btn">
                <IconImage class="icon" name="Calendar" />
                {{ $t('invitation.create.field.validity.pick-date') }}
            </button>

            <span class="date-preview" v-if="modelValue.publication_date">{{ displayedDate }}</span>
            <VueDatePicker
                v-if="showDatePicker"
                :on-click-outside="() => (showDatePicker = false)"
                :inline="true"
                :auto-apply="true"
                :model-value="modelValue.publication_date"
                :enable-time-picker="false"
                @update:model-value="onDateSelected"
            />

            <p
                v-for="error of v$.modelValue.publication_date.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>

        <div class="form-section">
            <label>{{ $filters.capitalize($t('instructions.form.content.label')) }}</label>
            <TipTapEditor
                ref="tiptapEditor"
                :ws-data="wsData"
                class="input-field content-editor no-max-height"
                mode="full"
                parent="blog-entry"
                @update="updateContent"
                @blur="v$.modelValue.content.$validate"
            />

            <p
                v-for="error of v$.modelValue.content.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>
        <div class="form-section">
            <label>{{ $t('instructions.form.groups.label') }}</label>
            <p class="notice">{{ $t('instructions.form.groups.notice') }}</p>

            <MultiGroupPicker
                :model-value="modelValue.people_groups"
                @update:model-value="updateForm({ people_groups: $event })"
            />
        </div>
        <div class="form-section">
            <label>{{ $t('instructions.form.notify.label') }}</label>
            <p class="notice">{{ $t('instructions.form.notify.notice') }}</p>

            <button type="button" @click="toggleNotify" class="date-btn">
                <IconImage
                    class="icon"
                    :name="modelValue.has_to_be_notified ? 'SquareRounded' : 'SquareRoundedOutline'"
                />
                {{ $t('instructions.form.notify.button') }}
            </button>
        </div>
    </form>
</template>

<script>
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import IconImage from '@/components/svgs/IconImage.vue'
import MultiGroupPicker from '@/components/lpikit/MultiGroupPicker/MultiGroupPicker.vue'

export function defaultForm() {
    return {
        title: '',
        content: '',
        publication_date: '',
        people_groups: {},
        has_to_be_notified: false,
    }
}

export default {
    name: 'InstructionForm',

    emits: ['update:modelValue'],

    components: {
        TextInput,
        TipTapEditor,
        VueDatePicker,
        IconImage,
        MultiGroupPicker,
    },

    props: {
        modelValue: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            v$: useVuelidate(),
            wsData: {
                savedContent: this.modelValue.content,
                originalContent: this.modelValue.content,
            },
            showDatePicker: false,
        }
    },

    validations() {
        return {
            modelValue: {
                title: {
                    required: helpers.withMessage(
                        this.$t('instructions.form.title.required'),
                        required
                    ),
                },
                content: {
                    required: helpers.withMessage(
                        this.$t('instructions.form.content.required'),
                        required
                    ),
                },
                publication_date: {
                    required: helpers.withMessage(
                        this.$t('instructions.form.publication_date.required'),
                        required
                    ),
                },
            },
        }
    },

    computed: {
        displayedDate() {
            return this.modelValue.publication_date
                ? new Date(this.modelValue.publication_date).toLocaleDateString()
                : ''
        },
    },

    methods: {
        onDateSelected(modelData) {
            this.updateForm({ publication_date: modelData })
            this.showDatePicker = false
        },

        updateContent(htmlContent) {
            this.updateForm({ content: htmlContent === '<p></p>' ? null : htmlContent })
        },

        updateForm(data) {
            this.$emit('update:modelValue', { ...this.modelValue, ...data })
        },
        toggleNotify() {
            this.updateForm({ notify: !this.modelValue.notify })
        },
    },
}
</script>

<style lang="scss" scoped>
.input-field {
    margin: $space-l;
    margin-bottom: $space-xs;
}

.content-editor {
    flex-grow: 1;
    min-height: pxToRem(300px);
}

.date-preview {
    margin-left: $space-l;
    display: inline-block;
    font-size: 1.2rem;
    font-weight: 700;
}

.error-description {
    color: $salmon-dark;
    font-size: $font-size-s;
    margin-left: $space-l;
}

.img-ctn {
    margin-bottom: $space-xl;
    display: flex;
    flex-direction: column;
    align-items: center;

    label {
        align-self: flex-start;
    }
}

.form-section + .form-section {
    margin-top: $space-xl;
}

label {
    font-size: 0.875rem;
    font-weight: bold;
    color: #000;
    display: block;
}

label,
.notice {
    margin-bottom: $space-l !important;
}

// TODO fix cleanly
:deep(.input-ctn),
:deep(.input-field) {
    margin: 0;
}

.date-btn {
    padding: $space-s;
    background-color: $white;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-s;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    gap: $space-m;
    color: $primary-dark;
    font-weight: 700;
    cursor: pointer;

    .icon {
        width: $font-size-2xl;
        fill: $primary-dark;
    }
}
</style>
