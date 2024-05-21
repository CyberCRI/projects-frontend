<template>
    <div class="image-input-ctn">
        <label :for="uniqueId" ref="label" class="image-button" data-test="upload-image-button">
            <LinkButton
                v-if="isLink"
                btn-icon="Upload"
                :label="displayedLabel"
                class="passive"
                v-disable-focus="unfocusable"
            />

            <LpiButton
                v-else
                btn-icon="Upload"
                secondary
                :label="displayedLabel"
                class="passive"
                v-disable-focus="unfocusable"
            />
        </label>

        <input :id="uniqueId" :ref="uniqueId" type="file" @change="uploadImage" />
    </div>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'

export default {
    name: 'ImageInput',

    emits: ['upload-image'],

    components: {
        LpiButton,
        LinkButton,
    },

    data() {
        return {
            uniqueId: (Math.random() + 1).toString(36).substring(7),
        }
    },

    props: {
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
        isLink: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        uploadImage(event) {
            this.$emit('upload-image', this.$refs[this.uniqueId].files[0])
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
