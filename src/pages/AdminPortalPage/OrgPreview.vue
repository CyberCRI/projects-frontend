<template>
    <div class="org-preview" :style="{ backgroundImage: `url(${bannerUrl})` }">
        <div class="top-bar">
            <img v-if="logoUrl" :src="logoUrl" />
        </div>

        <div class="text-container">
            <span class="subtitle">{{ subtitle }}</span>
            <span class="title">{{ title }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrgPreview',

    props: {
        title: {
            type: String,
            default: '',
        },

        subtitle: {
            type: String,
            default: '',
        },

        logoUrl: {
            type: Object,
            default: () => {},
        },

        bannerUrl: {
            type: Object,
            default: () => {},
        },
    },
}
</script>

<style lang="scss" scoped>
.org-preview {
    height: 480px;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    .top-bar {
        height: 50px;
        border-bottom: 1px solid rgb(0 0 0 / 5%);
        background: rgb(0 0 0 / 70%);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;

        img {
            max-height: 50px;
            margin-left: 10%;
        }
    }

    .text-container {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 10%;
        color: $white;

        > span {
            display: block;
        }

        .subtitle {
            font-size: $font-size-xs;
            font-style: italic;
        }

        .title {
            font-size: $font-size-l;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 10px;
        }
    }
}
</style>
