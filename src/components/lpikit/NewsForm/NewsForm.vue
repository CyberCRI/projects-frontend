<template>
    <form>
        <div class="form-section img-ctn">
            <label>{{ $filters.capitalize($t('news.form.image.label')) }}</label>
            <ImageEditor
                picture-alt="news image"
                :contain="true"
                :image-sizes="modelValue.imageSizes"
                :picture="modelValue.header_image"
                @update:header_image="updateForm({ imageSizes: $event })"
                @update:picture="updateForm({ header_image: $event })"
                :default-picture="defaultPictures"
            ></ImageEditor>
        </div>

        <div class="form-section">
            <TextInput
                :model-value="modelValue.title"
                @update:model-value="updateForm({ title: $event })"
                :label="$filters.capitalize($t('news.form.title.label'))"
                :placeholder="$filters.capitalize($t('news.form.title.placeholder'))"
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
            <label>{{ $t('news.form.date_publication.label') }}</label>
            <button type="button" @click="showDatePicker = true" class="date-btn">
                <IconImage class="icon" name="Calendar" />
                {{ $t('invitation.create.field.validity.pick-date') }}
            </button>

            <span class="date-preview" v-if="modelValue.date_publication">{{ displayedDate }}</span>
            <VueDatePicker
                v-if="showDatePicker"
                :on-click-outside="() => (showDatePicker = false)"
                :inline="true"
                :auto-apply="true"
                :model-value="modelValue.date_publication"
                :enable-time-picker="false"
                @update:model-value="onDateSelected"
            />

            <p
                v-for="error of v$.modelValue.date_publication.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>

        <div class="form-section">
            <label>{{ $filters.capitalize($t('news.form.content.label')) }}</label>
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
            <label>{{ $t('news.form.groups.label') }}</label>
            <p class="notice">{{ $t('news.form.groups.notice') }}</p>

            <MultiGroupPicker
                :model-value="modelValue.groups"
                @update:model-value="updateForm({ groups: $event })"
            />
        </div>
    </form>
</template>

<script>
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import ImageEditor from '@/components/lpikit/ImageEditor/ImageEditor.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import IconImage from '@/components/svgs/IconImage.vue'
import MultiGroupPicker from '@/components/lpikit/MultiGroupPicker/MultiGroupPicker.vue'

export function defaultForm() {
    return {
        header_image: null,
        imageSizes: null,
        title: '',
        content: '',
        date_publication: '',
        groups: {},
    }
}

export default {
    name: 'NewsForm',

    emits: ['update:modelValue'],

    mixins: [imageMixin],

    components: {
        TextInput,
        TipTapEditor,
        ImageEditor,
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
        const defaultPictures = [1, 2, 3, 4, 5, 6].map((index) => {
            return `${
                import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX
            }/patatoids-project/Patatoid-${index}.png`
        })
        return {
            v$: useVuelidate(),
            defaultPictures,
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
                    required: helpers.withMessage(this.$t('news.form.title.required'), required),
                },
                content: {
                    required: helpers.withMessage(this.$t('news.form.content.required'), required),
                },
                date_publication: {
                    required: helpers.withMessage(
                        this.$t('event.form.date_publication.required'),
                        required
                    ),
                },
            },
        }
    },

    computed: {
        displayedDate() {
            return this.modelValue.date_publication
                ? new Date(this.modelValue.date_publication).toLocaleDateString()
                : ''
        },
    },

    methods: {
        onDateSelected(modelData) {
            this.updateForm({ date_publication: modelData })
            this.showDatePicker = false
        },

        updateContent(htmlContent) {
            this.updateForm({ content: htmlContent === '<p></p>' ? null : htmlContent })
        },

        updateForm(data) {
            this.$emit('update:modelValue', { ...this.modelValue, ...data })
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

    .icon {
        width: $font-size-2xl;
        fill: $primary-dark;
    }
}
</style>
