<template>
    <div class="image-input-ctn">
        <label :for="id" ref="label" class="image-button" data-test="upload-image-button">
            <LpiButton
                btn-icon="Upload"
                secondary
                :label="displayedLabel"
                class="passive"
                v-disable-focus="unfocusable"
            />
        </label>

        <input :id="id" :ref="id" type="file" @change="uploadImage" />
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'ImageInput',

    emits: ['upload-image'],

    components: {
        LpiButton,
    },

    props: {
        id: {
            type: String,
            required: true,
        },

        existingImage: {
            type: String,
            default: null,
        },
        unfocusable: {
            type: Boolean,
            default: false,
        },

        label: {
            type: String,
            default: null,
        },
        secondary: {
            type: Boolean,
            default: true,
        },
        noBorder: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        uploadImage(event) {
            this.$emit('upload-image', this.$refs[this.id].files[0])
            event.target.value = ''
        },
    },

    computed: {
        displayedLabel() {
            return this.label
                ? this.label
                : this.existingImage
                ? this.$t('picture.change-picture')
                : this.$t('picture.add-picture')
        },
    },
}
</script>

<style lang="scss" scoped>
.image-input-ctn {
    width: fit-content;

    input[type='file'] {
        display: none;
    }

    label {
        cursor: pointer;
    }

    .passive {
        pointer-events: none;
    }
}
</style>
