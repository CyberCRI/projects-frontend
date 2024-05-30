<template>
    <div class="title-block">
        <h1 class="main-title">{{ mainTitleLabel }}</h1>

        <p v-if="isAddMode" class="sub-main-title">
            {{ $t('account.sub-title') }}<a href="" class="link">{{ $t('account.link') }}</a>
        </p>
    </div>
</template>

<script>
export default {
    name: 'AccountFormTitleBlock',

    props: {
        isAddMode: {
            type: Boolean,
            required: true,
        },
    },

    computed: {
        mainTitleLabel() {
            return this.isAddMode ? this.$t('account.title') : this.$t('account.edit-title')
        },
    },
}
</script>

<style scoped lang="scss">
.title-block {
    padding-bottom: $space-2xl;

    .main-title {
        font-weight: 700;
        font-size: $font-size-5xl;
        text-align: center;
        line-height: 1.2;
    }

    .sub-main-title {
        font-weight: 400;
        font-size: $font-size-m;
        margin-top: $space-xl;

        .link {
            font-weight: 700;
            color: $primary-dark;
            text-decoration: underline;
        }
    }

    .anchors {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-top: $space-2xl;

        .btn {
            flex: 25%;
            padding: 8px 16px;
            background: white;
            border: 1px solid $green;
            cursor: pointer;

            &:not(:last-child) {
                border-right: none;
            }

            &:first-child {
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
            }

            &:last-child {
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
        }
    }
}
</style>
