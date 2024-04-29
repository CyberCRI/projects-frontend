<template>
    <div
        class="img-inner"
        :class="{ 'round-picture': roundPicture }"
        :style="{ '--picture-ratio': pictureRatio }"
    >
        <div class="img-preview">
            <div class="preview-wrapper-outer" :class="{ active: !disabled }">
                <CroppedImage
                    @click="imageOnClick"
                    :alt="pictureAlt"
                    :contain="true"
                    :image-sizes="imageSizes"
                    :src="displayedImage"
                    class="preview-wrapper-inner"
                    :ratio="pictureRatio"
                />
            </div>
        </div>
        <div class="img-actions">
            <LinkButton
                v-if="defaultPictureFiles?.length > 1"
                v-disable-focus="disabled"
                :label="$t('project.random-image')"
                btn-icon="RotateRight"
                @click="nextDefaultPicture"
                data-test="random-image-button"
            />

            <ImageInput
                ref="imageInput"
                id="header_image"
                :unfocusable="disabled"
                is-link
                :label="$t('common.modify')"
                @upload-image="uploadImage"
            />

            <LinkButton
                v-if="!noResize"
                v-disable-focus="disabled"
                :label="$t('project.form.resize-image')"
                btn-icon="CropFree"
                @click="openImageResizer"
                data-test="resize-image-button"
            />
        </div>
        <!-- image resizer -->
        <DrawerLayout
            :confirm-action-name="$t('common.confirm')"
            :is-opened="showImageResizer"
            :title="$t('project.form.resize-image')"
            class="medium"
            @close="showImageResizer = false"
            @confirm="saveImageSizes"
            data-test="image-resizer-drawer"
        >
            <ImageResizer
                v-if="showImageResizer"
                ref="imageResizer"
                :image="displayedImage"
                :image-sizes="imageSizes"
                :round-shape="roundPicture"
                :ratio="pictureRatio"
            />
        </DrawerLayout>
    </div>
</template>
<script>
import axios from 'axios'
import ImageResizer from '@/components/lpikit/ImageResizer/ImageResizer.vue'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import ImageInput from '@/components/lpikit/ImageInput/ImageInput.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
export default {
    name: 'ImageEditor',

    emits: ['update:imageSizes', 'update:picture'],

    mixins: [imageMixin],

    components: { CroppedImage, ImageResizer, ImageInput, LinkButton, DrawerLayout },

    props: {
        imageSizes: {
            type: [Object, null],
            required: true,
        },

        picture: {
            type: [Object, File, null],
            required: true,
        },
        defaultPicture: {
            type: [String, Array],
            required: false,
            default: '',
        },
        pictureAlt: {
            type: String,
            required: false,
            default: 'Image',
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        roundPicture: {
            type: Boolean,
            required: false,
            default: false,
        },

        pictureRatio: {
            type: Number,
            required: false,
            default: 1,
        },
        noResize: {
            type: Boolean,
            default: false,
        },

        dontResizeOnChange: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            showImageResizer: false,
            defaultPictureFiles: [],
            defaultPictureIndex: 0,
            displayableImage: '',
        }
    },

    computed: {
        displayedImage() {
            return this.picture instanceof File
                ? this.displayableImage
                : this.picture?.variations?.small || null
        },
    },

    async mounted() {
        const urlArray = Array.isArray(this.defaultPicture)
            ? this.defaultPicture
            : [this.defaultPicture]

        this.defaultPictureFiles = await Promise.all(urlArray.map(this.getFilesFromUrl))

        if (!this.picture && this.defaultPictureFiles.length) {
            this.setImage(this.defaultPictureFiles[0])
        }
    },

    methods: {
        async getFilesFromUrl(url) {
            const filename = url.split('/').pop() || 'default-image'
            const result = await axios.get(url, { responseType: 'blob' })
            return new File([result.data], filename)
        },

        setImage(image) {
            this.displayableImage = ''
            const fileReader = new FileReader()
            fileReader.readAsDataURL(image)
            fileReader.onload = (fileReaderEvent) => {
                this.displayableImage = fileReaderEvent.target.result
            }

            this.$emit('update:picture', image)
            // reinit image cropping data
            this.$emit('update:imageSizes', null)
        },

        uploadImage(image) {
            this.setImage(image)
            if (!this.noResize && !this.dontResizeOnChange) this.$nextTick(this.openImageResizer)
        },

        openImageResizer() {
            this.showImageResizer = true
        },

        saveImageSizes() {
            // EASTER BUG 3 image dont resize
            // this.$emit('update:imageSizes', {
            //     scaleX: this.$refs.imageResizer.scaleX,
            //     scaleY: this.$refs.imageResizer.scaleY,
            //     left: this.$refs.imageResizer.left,
            //     top: this.$refs.imageResizer.top,
            //     naturalRatio: this.$refs.imageResizer.naturalRatio,
            // })
            this.showImageResizer = false
        },

        nextDefaultPicture() {
            if (this.defaultPictureFiles.length) {
                // EASTER BUG 2 random image dont change
                // this.defaultPictureIndex =
                //    (this.defaultPictureIndex + 1) % this.defaultPictureFiles.length
                this.setImage(this.defaultPictureFiles[this.defaultPictureIndex])
            }
        },
        imageOnClick() {
            if (!this.disabled) this.$refs.imageInput?.$refs?.header_image?.click()
        },
    },
}
</script>
<style lang="scss" scoped>
.img-inner {
    width: 100%;
    display: flex;
    align-items: center;
    gap: $space-m;

    .img-preview,
    .img-actions {
        flex-basis: 50%;
        flex-grow: 1;
    }

    .img-actions {
        display: flex;
        flex-flow: column;
        gap: $space-m;
        justify-content: center;
        align-items: flex-start;
    }

    .img-preview {
        border: $border-width-s solid $green;
        background-color: $white;
        overflow: hidden;
    }

    &.round-picture .img-preview {
        border-radius: 100%;
    }
}

.preview-wrapper-outer {
    width: 100%;
    padding-bottom: calc(100% / var(--picture-ratio, 1));
    position: relative;

    &.active {
        cursor: pointer;
    }
}

.preview-wrapper-inner {
    position: absolute;
    inset: 0;
}
</style>
