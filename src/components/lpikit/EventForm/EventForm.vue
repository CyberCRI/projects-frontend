<template>
    <form>
        <div class="form-section">
            <label>{{ $t('event.form.name.label') }}</label>
            <TextInput
                input-type="text"
                label=""
                :model-value="modelValue.name"
                @update:model-value="updateForm({ name: $event })"
                :placeholder="$t('event.form.name.placeholder')"
                @blur="v$.modelValue.name.$validate"
            />
            <p
                v-for="error of v$.modelValue.name.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>
        <div class="form-section">
            <label>{{ $t('event.form.information.label') }}</label>
            <TextInput
                input-type="textarea"
                label=""
                :model-value="modelValue.information"
                @update:model-value="updateForm({ information: $event })"
                :placeholder="$t('event.form.information.placeholder')"
            />
        </div>
        <div class="form-section">
            <label>{{ $t('event.form.date.label') }}</label>
            <button type="button" @click="showDatePicker = true" class="date-btn">
                <IconImage class="icon" name="Calendar" />
                {{ $t('invitation.create.field.validity.pick-date') }}
            </button>

            <span class="date-preview" v-if="modelValue.date">{{ displayedDate }}</span>
            <VueDatePicker
                v-if="showDatePicker"
                :on-click-outside="() => (showDatePicker = false)"
                :inline="true"
                :auto-apply="true"
                :model-value="modelValue.date"
                :enable-time-picker="false"
                @update:model-value="onDateSelected"
            />

            <p
                v-for="error of v$.modelValue.date.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>
        <div class="form-section">
            <label>{{ $t('event.form.groups.label') }}</label>
            <p class="notice">{{ $t('event.form.groups.notice') }}</p>

            <MultiGroupPicker
                :model-value="modelValue.groups"
                @update:model-value="updateForm({ groups: $event })"
            />
        </div>
    </form>
</template>
<script>
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import IconImage from '@/components/svgs/IconImage.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import MultiGroupPicker from '@/components/lpikit/MultiGroupPicker/MultiGroupPicker.vue'

export function defaultForm() {
    return {
        name: '',
        information: '',
        date: '',
        groups: {},
    }
}

export default {
    name: 'EventForm',

    emits: ['update:modelValue'],

    components: {
        TextInput,
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
            showDatePicker: false,
            v$: useVuelidate(),
        }
    },

    validations() {
        return {
            modelValue: {
                name: {
                    required: helpers.withMessage(this.$t('event.form.name.required'), required),
                },
                date: {
                    required: helpers.withMessage(this.$t('event.form.date.required'), required),
                },
            },
        }
    },

    computed: {
        displayedDate() {
            return this.modelValue.date ? new Date(this.modelValue.date).toLocaleDateString() : ''
        },
    },

    methods: {
        onDateSelected(modelData) {
            this.updateForm({ date: modelData })
            this.showDatePicker = false
        },

        updateForm(data) {
            this.$emit('update:modelValue', { ...this.modelValue, ...data })
        },
    },
}
</script>
<style lang="scss" scoped>
.loader-ctn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5rem 0;
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

    .icon {
        width: $font-size-2xl;
        fill: $primary-dark;
    }
}

.form-section + .form-section {
    margin-top: $space-xl;
}

label {
    font-size: $font-size-s;
    font-weight: 700;
    color: $black;
    display: block;
}

label,
.notice {
    margin-bottom: $space-l !important;
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
</style>
