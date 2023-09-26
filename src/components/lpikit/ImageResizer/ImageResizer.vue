<template>
    <div class="image-resizer">
        <img :src="image" alt="" id="cropper" @load="init" />
    </div>
</template>
<script>
import Croppr from 'croppr'

export default {
    name: 'ImageResizer',

    props: {
        imageSizes: {
            type: Object,
            required: false,
            default: null,
        },
        image: {
            type: String,
            required: true,
        },

        ratio: {
            type: Number,
            default: 1,
        },
    },

    data() {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            naturalWidth: 0,
            naturalHeight: 0,
            maxWidth: 0,
            maxHeight: 0,
            left: 0,
            top: 0,
            scaleX: 1,
            scaleY: 1,
            naturalRatio: 1,
            croppr: null,
            bboxWidth: 0,
            bboxHeight: 0,
            bboxScale: 1,
        }
    },

    mounted() {
        window.addEventListener('resize', this.reinit)
    },

    unmounted() {
        window.removeEventListener('resize', this.reinit)
    },

    methods: {
        reinit() {
            // reinit croppr on resize
            // beacause resize invalidate all size data
            this.croppr.destroy()
            this.init()
        },

        init() {
            // get image natural size and aspect ration
            const img = document.getElementById('cropper')
            this.naturalWidth = img.naturalWidth
            this.naturalHeight = img.naturalHeight
            this.naturalRatio = img.naturalWidth / this.naturalHeight

            // get container aspect ratio
            // so we can fit croppr to availabe space
            const containerBbox = this.$el.getBoundingClientRect()
            const containerRatio = containerBbox.width / containerBbox.height

            // set a limit on width or height
            // according to image and container ratio
            // this must be done with js or croppr gets lost on vertical pictures
            if (this.naturalRatio >= containerRatio) {
                this.$el.classList.remove('limit-height')
                this.$el.classList.add('limit-width')
            } else {
                this.$el.classList.remove('limit-width')
                this.$el.classList.add('limit-height')
            }

            // get image bounding box size and scale from natural size
            // beacuse croppr data are in natural sizes
            const bbox = img.getBoundingClientRect()
            this.bboxWidth = bbox.width
            this.bboxHeight = bbox.height
            if (this.bboxWidth > this.naturalWidth || this.bboxHeight > this.naturalHeight) {
                this.bboxWidth = this.naturalWidth
                this.bboxHeight = this.naturalHeight
            }
            this.bboxScale = this.bboxWidth / this.naturalWidth

            // again croppr gets lost on vertical pictures
            // and we cant set this via js because croppr is not yet initialized and after it is too late
            // so hack this with css custom properties
            this.$el.style.setProperty('--croppr-width', `${this.bboxWidth}px`)

            // set maximum cropping area accordiang to aspect ratio
            this.maxWidth = this.bboxWidth
            this.maxHeight = this.bboxHeight
            if (this.naturalRatio > this.ratio) {
                this.maxWidth = this.bboxHeight * this.ratio
            } else {
                this.maxHeight = this.bboxWidth / this.ratio
            }

            // default croping area to max size and centered
            if (!this.imageSizes) {
                this.x = (this.bboxWidth - this.maxWidth) / 2 // pixel position, centered
                this.y = (this.bboxHeight - this.maxHeight) / 2 // pixel position, centered
                this.width = this.maxWidth // pixel size
                this.height = this.maxHeight // pixel size
                // or use the given croping area
            } else {
                // positon is negated because trandform is reciprocal in croppr and in image display
                // i.e. in cropper we move and scale the crop area
                // and in showing image we scale and move the image
                this.x = -this.bboxWidth * (this.imageSizes.left / 100) // percentage to pixel size
                this.y = -this.bboxHeight * (this.imageSizes.top / 100) // percentage to pixel size
                this.width = this.maxWidth / this.imageSizes.scaleX // ratio to pixel size
                this.height = this.maxHeight / this.imageSizes.scaleY // ratio to pixel size
            }

            // init croppr

            this.croppr = new Croppr('#cropper', {
                aspectRatio: this.ratio,
                onCropEnd: (data) => {
                    this.updateData(data)
                },
                onInitialize: (instance) => {
                    // set initial cropping area (order of op matters !)
                    instance.moveTo(this.x, this.y).resizeTo(this.width, this.height, [
                        0, // transform origin is top left
                        0,
                    ])
                },
            })
        },

        updateData(data) {
            if (isNaN(data.x) || isNaN(data.y) || isNaN(data.width) || isNaN(data.height)) return
            // memoize the data so it can be acesses from parent comoponent
            // data need to be scaled according to the image display size (ie natural vs bbox)
            this.left = (-100 * data.x) / this.naturalWidth // percentage, negated for recriprocal transformation
            this.top = (-100 * data.y) / this.naturalHeight // percentage, negated for recriprocal transformation
            this.scaleX = this.maxWidth / this.bboxScale / data.width // ratio, i.e. 1 means no scaling
            this.scaleY = this.maxHeight / this.bboxScale / data.height // ratio, i.e. 1 means no scaling
        },
    },
}
</script>
<style lang="scss" scoped>
@import 'croppr/dist/croppr.css';

.image-resizer {
    flex-grow: 1;
    max-height: 100%;
    max-width: 100%;

    img {
        max-width: 100%;
        max-height: 100%;
        display: block;
        height: auto;
        width: auto;
    }

    &.limit-width img {
        width: 100%;
    }

    &.limit-height img {
        height: 100%;
    }
}

:deep(.croppr),
:deep(.croppr-container) {
    width: 100%;
}

:deep(img),
:deep(.croppr-container img) {
    width: 100%;
    display: block;
    max-width: 100%;
}

.limit-width {
    :deep(.croppr) {
        width: 100%;
    }

    :deep(img),
    :deep(.croppr-container img) {
        width: 100%;
        height: auto;
    }
}

.limit-height {
    :deep(.croppr) {
        height: 100%;
        width: var(--croppr-width); // set in init()
    }

    :deep(img),
    :deep(.croppr-container img) {
        height: 100%;
        width: auto;
    }
}
</style>
