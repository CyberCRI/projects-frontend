<template>
    <div v-for="(item, index) in limit" :key="index" class="fake-news">
        <div v-if="projectNewsIndex.indexOf(index) >= 0" class="project-skeleton">
            <div class="text-placeholder mobile" />
            <div class="subtext-placeholder subtext mobile" />
            <div class="image-placeholder" />
            <div class="news-content-placeholder">
                <div class="text-placeholder desktop" />
                <div class="subtext-placeholder subtext desktop" />
                <div class="text-placeholder" />
                <div class="text-placeholder" />
                <div class="subtext-placeholder subtext" />
                <div class="read-placeholder" />
            </div>
        </div>
        <div v-else class="announcement-skeleton">
            <div class="announcement-image-placeholder" />
            <div class="news-content-placeholder">
                <div class="text-placeholder announcement" />
                <div class="subtext-placeholder subtext desktop" />
                <div class="text-placeholder announcement" />
                <div class="read-placeholder" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsListSkeleton',

    data() {
        return {
            projectNewsIndex: [0, 1, 2, 5, 6, 8, 9, 10, 13, 14],
        }
    },

    props: {
        limit: {
            type: Number,
            default: 15,
        },
    },
}
</script>

<style lang="scss" scoped>
.fake-news {
    display: flex;
    flex-direction: column;
    border: $border-width-s solid $gray-9;
    border-radius: $border-radius-m;
    overflow: hidden;
    margin-bottom: $space-xl;
    padding: $space-l;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        width: pxToRem(900px);
    }
}

.project-skeleton {
    display: flex;
    flex-direction: column;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
    }
}

.announcement-skeleton {
    display: flex;
    flex-direction: row;
}

.image-placeholder {
    width: 100%;
    height: pxToRem(200px);
    background: $gray-10;
    border-radius: $border-radius-xs;
    margin-bottom: $space-m;
    animation: skeleton-loading 1s linear infinite alternate;

    @media screen and (min-width: $min-tablet) {
        margin-right: $space-xl;
        margin-bottom: 0;
        width: 280px;
    }
}

.announcement-image-placeholder {
    width: pxToRem(120px);
    height: pxToRem(120px);
    background: $gray-10;
    border-radius: $border-radius-xs;
    margin-bottom: $space-m;
    animation: skeleton-loading 1s linear infinite alternate;
    margin-right: $space-m;

    @media screen and (min-width: $min-tablet) {
        margin-right: $space-xl;
    }
}

.text-placeholder {
    background: $gray-10;
    border-radius: $border-radius-xs;
    width: pxToRem(350px);
    height: pxToRem(16px);
    margin-bottom: pxToRem(16px);
    animation: skeleton-loading 1s linear infinite alternate;

    @media screen and (min-width: $min-tablet) {
        width: pxToRem(550px);
    }

    &.mobile {
        @media screen and (min-width: $min-tablet) {
            display: none;
        }
    }

    &.desktop {
        display: none;

        @media screen and (min-width: $min-tablet) {
            display: block;
        }
    }

    &.announcement {
        width: pxToRem(210px);

        @media screen and (min-width: $min-tablet) {
            width: pxToRem(700px);
        }
    }
}

.subtext-placeholder {
    background: $gray-10;
    border-radius: $border-radius-xs;
    width: pxToRem(200px);
    height: pxToRem(16px);
    margin-bottom: pxToRem(16px);
    animation: skeleton-loading 1s linear infinite alternate;

    @media screen and (min-width: $min-tablet) {
        width: pxToRem(300px);
    }

    &.subtext {
        @media screen and (min-width: $min-tablet) {
            margin-bottom: $space-l;
        }
    }

    &.mobile {
        @media screen and (min-width: $min-tablet) {
            display: none;
        }
    }

    &.desktop {
        display: none;

        @media screen and (min-width: $min-tablet) {
            display: block;
        }
    }
}

.read-placeholder {
    background: $gray-10;
    border-radius: $border-radius-xs;
    width: pxToRem(50px);
    height: pxToRem(16px);
    margin-bottom: pxToRem(16px);
    animation: skeleton-loading 1s linear infinite alternate;
}
</style>
