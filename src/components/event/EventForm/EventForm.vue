<template>
    <form>
        <div class="form-section">
            <label>{{ $t('event.form.title.label') }}</label>
            <TextInput
                input-type="text"
                label=""
                :model-value="modelValue.title"
                @update:model-value="updateForm({ title: $event })"
                :placeholder="$t('event.form.title.placeholder')"
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
            <label>{{ $t('event.form.content.label') }}</label>
            <TextInput
                input-type="textarea"
                label=""
                :model-value="modelValue.content"
                @update:model-value="updateForm({ content: $event })"
                :placeholder="$t('event.form.content.placeholder')"
            />
        </div>
        <div class="form-section">
            <label>{{ $t('event.form.event_date.label') }}</label>
            <button type="button" @click="showDatePicker = true" class="date-btn">
                <IconImage class="icon" name="Calendar" />
                {{ $t('invitation.create.field.validity.pick-date') }}
            </button>

            <span class="date-preview" v-if="modelValue.event_date">{{ displayedDate }}</span>
            <VueDatePicker
                v-if="showDatePicker"
                :on-click-outside="() => (showDatePicker = false)"
                :inline="true"
                :auto-apply="true"
                :model-value="modelValue.event_date"
                :enable-time-picker="false"
                @update:model-value="onDateSelected"
            />

            <p
                v-for="error of v$.modelValue.event_date.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>
        <div class="form-section">
            <label>{{ $t('event.form.people_groups.label') }}</label>
            <p class="notice">{{ $t('event.form.people_groups.notice') }}</p>

            <MultiGroupPicker
                has-public-field
                :is-public="modelValue.visible_by_all"
                @update:is-public="updateForm({ visible_by_all: $event })"
                :model-value="modelValue.people_groups"
                @update:model-value="updateForm({ people_groups: $event })"
            />
        </div>
    </form>
</template>
<script>
import TextInput from '@/components/base/form/TextInput.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import IconImage from '@/components/base/media/IconImage.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'

export function defaultForm() {
    return {
        title: '',
        content: '',
        event_date: '',
        people_groups: {},
        visible_by_all: true,
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
                title: {
                    required: helpers.withMessage(this.$t('event.form.title.required'), required),
                },
                event_date: {
                    required: helpers.withMessage(
                        this.$t('event.form.event_date.required'),
                        required
                    ),
                },
            },
        }
    },

    computed: {
        displayedDate() {
            return this.modelValue.event_date
                ? new Date(this.modelValue.event_date).toLocaleDateString()
                : ''
        },
    },

    methods: {
        onDateSelected(modelData) {
            this.updateForm({ event_date: modelData })
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
    color: $red;
    font-size: $font-size-s;
    margin-left: $space-l;
}
</style>
