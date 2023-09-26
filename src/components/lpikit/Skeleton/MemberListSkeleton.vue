<template>
    <div :class="gridLayout" class="member-list">
        <div v-for="(item, index) in limit" :key="index" class="card">
            <div class="content">
                <div class="image-placeholder" />
                <div class="text-placeholder" />

                <div class="text-placeholder subtext" />
                <div class="text-placeholder" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MemberListSkeleton',

    props: {
        desktopColumnsNumber: {
            type: [String, Number],
            default: 4,
            validator(value) {
                return [1, 3, 4, 6].includes(parseInt(value))
            },
        },

        limit: {
            type: Number,
            default: 12,
        },
    },

    computed: {
        gridLayout() {
            return `desktop-col--${this.desktopColumnsNumber}`
        },
    },
}
</script>

<style lang="scss" scoped>
.member-list {
    display: grid;
    gap: $space-m;
    justify-items: center;

    .card {
        height: pxToRem(256px);
        width: pxToRem(185px);
        overflow: hidden;
    }

    .content {
        padding: $space-m;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .image-placeholder {
        width: pxToRem(120px);
        height: pxToRem(120px);
        background: $gray-10;
        margin-bottom: $space-l;
        border-radius: 50%;
        animation: skeleton-loading 1s linear infinite alternate;
    }

    .text-placeholder {
        background: $gray-10;
        border-radius: $border-radius-xs;
        width: 100%;
        height: pxToRem(16px);
        margin-bottom: pxToRem(16px);
        animation: skeleton-loading 1s linear infinite alternate;
    }

    .subtext {
        margin-bottom: $space-s;
    }

    .footer {
        margin-top: $space-l;
    }
}

.desktop-col--1 {
    @media screen and (min-width: $min-tablet) {
        grid-template-columns: 1fr;
    }
}

.desktop-col--3 {
    @media screen and (min-width: $max-tablet) {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

.desktop-col--4 {
    @media screen and (min-width: $min-tablet) {
        grid-template-columns: 1fr 1fr 1fr;
    }

    @media screen and (min-width: $min-desktop) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
}

.desktop-col--6 {
    grid-template-columns: 1fr;

    @media screen and (min-width: $max-mobile) {
        grid-template-columns: 1fr 1fr;
    }

    @media screen and (min-width: $min-tablet) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    @media screen and (min-width: $max-tablet) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }

    @media screen and (min-width: $min-desktop) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}
</style>
