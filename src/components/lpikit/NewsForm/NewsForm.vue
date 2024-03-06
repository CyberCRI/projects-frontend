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
            <label>{{ $filters.capitalize($t('news.form.content.label')) }}</label>
            <TipTapEditor
                :key="editorKey"
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
    </form>
</template>

<script>
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import ImageEditor from '@/components/lpikit/ImageEditor/ImageEditor.vue'
import imageMixin from '@/mixins/imageMixin.ts'

export function defaultForm() {
    return {
        header_image: null,
        imageSizes: null,
        title: '',
        content: '',
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
            },
        }
    },

    methods: {
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

.error-description {
    color: $salmon-dark;
    font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;
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
</style>
