<template>
    <div class="img-inner">
        <div class="img-preview">
            <div class="preview-wrapper-outer">
                <CroppedImage
                    alt="image"
                    :contain="true"
                    :image-sizes="imageSizes"
                    :src="displayedImage"
                    class="preview-wrapper-inner"
                />
            </div>
        </div>
        <div class="img-actions">
            <ImageInput
                id="header_image"
                :label="$t('profile.edit.general.picture.upload-image')"
                @upload-image="uploadImage"
            />

            <LpiButton
                :label="$t('profile.edit.general.picture.resize-image')"
                :secondary="true"
                class="next-patatoid-btn"
                left-icon="Pen"
                @click="openImageResizer"
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
        >
            <ImageResizer
                v-if="showImageResizer"
                ref="imageResizer"
                :image="displayedImage"
                :image-sizes="imageSizes"
            />
        </DrawerLayout>
    </div>
</template>
<script>
import ImageResizer from '@/components/lpikit/ImageResizer/ImageResizer.vue'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import ImageInput from '@/components/lpikit/ImageInput/ImageInput.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
export default {
    name: 'ImageEditor',

    emits: ['update:imageSizes', 'update:picture'],

    mixins: [imageMixin],

    components: { CroppedImage, ImageResizer, ImageInput, LpiButton, DrawerLayout },

    props: {
        imageSizes: {
            type: Object,
            required: true,
        },

        picture: {
            type: String,
            required: true,
        },
        defaultPicture: {
            type: [String, Array],
            required: false,
            default: '',
        },
    },

    data() {
        return {
            showImageResizer: false,
        }
    },

    computed: {
        displayedImage() {
            return this.picture || this.defaultPicture
        },
    },
    methods: {
        uploadImage(image) {
            this.displayedImage = ''

            const fileReader = new FileReader()
            fileReader.readAsDataURL(image)

            fileReader.onload = (fileReaderEvent) => {
                this.displayedImage = fileReaderEvent.target.result
            }

            this.$emit('update:picture', image)
            // reinit image cropping data
            this.$emit('update:imageSizes', null)
        },

        openImageResizer() {
            this.showImageResizer = true
        },

        saveImageSizes() {
            this.$emit('update:imageSizes', {
                scaleX: this.$refs.imageResizer.scaleX,
                scaleY: this.$refs.imageResizer.scaleY,
                left: this.$refs.imageResizer.left,
                top: this.$refs.imageResizer.top,
                naturalRatio: this.$refs.imageResizer.naturalRatio,
            })
            this.showImageResizer = false
        },
    },
}
</script>
<style lang="scss" scoped>
.img-inner {
    width: 100%;
    display: flex;
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
        border-radius: 100%;
        border: $border-width-s solid $green;
        background-color: $white;
        overflow: hidden;
    }
}

.preview-wrapper-outer {
    width: 100%;
    padding-bottom: 100%;
    position: relative;
}

.preview-wrapper-inner {
    position: absolute;
    inset: 0;
}
</style>
