<template>
    <div class="no-item">
        <div class="message" v-html="message ? $t(message) : ''" />

        <div class="empty-bubble" />
    </div>
</template>

<script>
export default {
    name: 'NoItem',

    props: {
        message: {
            type: String,
            default: '',
        },
    },
}
</script>

<style lang="scss">
.no-item {
    padding-bottom: 100px;

    .message {
        text-align: center;
        margin: 100px 0 20px;
        color: grey;
        font-size: 16px;
        font-weight: 600;
        text-transform: uppercase;
        background: transparent;
    }

    .empty-bubble {
        height: 200px;
        width: 200px;
        opacity: 0.8;
        margin: auto;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url(#{$PUBLIC_BINARIES_PREFIX}/empties/emptybubble.png);
    }
}
</style>
