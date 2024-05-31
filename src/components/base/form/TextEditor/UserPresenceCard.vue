<template>
    <div class="user-card-wrapper">
        <div class="user-card-ctn">
            <div :class="[size, tint]" class="user-card">
                <CroppedImage
                    :alt="`${user.name} image`"
                    :image-sizes="imageError ? null : user.imageSizes"
                    :src="imageError ? defaultImage : user.picture"
                    @error="placeHolderImg"
                    class="picture"
                />
                <div class="description">
                    <div :style="{ borderLeftColor: user.color }" class="name">
                        {{ user.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import formatHtml from '@/mixins/formatHtml.ts'
import imageMixin from '@/mixins/imageMixin.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'

export default {
    name: 'UserPresenceCard',

    mixins: [formatHtml, imageMixin],

    components: {
        CroppedImage,
    },

    props: {
        user: {
            type: [Object, String],
            required: true,
        },

        size: {
            type: String,
            required: true,
        },

        tint: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            imageError: false,
        }
    },

    computed: {
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },
    },

    methods: {
        placeHolderImg() {
            this.imageError = true
        },
    },
}
</script>

<style lang="scss" scoped>
.user-card {
    padding: 0;
    position: relative;
    overflow: hidden;
    transition:
        box-shadow 150ms,
        transform 150ms;
    background: transparent;
    height: 40px;
    margin: 0;
    border: 0;
    box-shadow: initial;
    vertical-align: bottom;
    display: flex;
}

.picture {
    background-color: rgb(0 0 0 / 20%);
    border-radius: 100%;
    background-size: cover;
    background-position: 50% 20%;
    height: 40px;
    width: 40px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
}

.description {
    text-align: left;
    padding-top: 0;
    padding-right: 10px;
    position: relative;
    left: 5px;
    height: 40px;
    margin-right: 10px;
    width: auto;
    font-size: 13px;
    text-transform: uppercase;
    color: $text-body;
    line-height: $line-height-tight;
    padding-left: 10px;
    align-items: center;
    display: flex;
}

.name {
    font-size: 13px;
    text-transform: uppercase;
    display: inline-block;
    border-bottom: 0 solid lightgrey;
    border-left: 4px solid transparent;
    color: $text-body;
    line-height: $line-height-tight;
    padding-left: 10px;
}

.user-card-ctn {
    position: relative;
}
</style>
