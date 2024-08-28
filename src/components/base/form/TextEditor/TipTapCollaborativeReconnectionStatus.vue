<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({
    disconnectionGrace: { type: Boolean, required: true },
    status: { type: String, required: true },
})
</script>

<template>
    <div :class="{ 'editor-frozen': !disconnectionGrace }" class="status-bar">
        <div v-if="!online" class="connection-status" v-text="t(`multieditor.offline`)"></div>
        <div
            v-if="online && status === 'connecting'"
            class="connection-status"
            v-text="t(`multieditor.server-connecting`)"
        ></div>
        <div
            v-if="online && status === 'disconnected'"
            class="connection-status"
            v-text="t(`multieditor.server-disconnected`)"
        ></div>
        <div
            v-if="!disconnectionGrace"
            class="connection-status"
            v-text="t(`multieditor.frozen`)"
        ></div>
    </div>
</template>
<style lang="scss" scoped>
.status-bar {
    justify-content: center;
    top: 30px;
    background: $white;
    color: $primary-dark;
    display: flex;
    padding: 5px 20px;
    position: sticky;
    z-index: 10;
    width: 100%;

    &.editor-frozen {
        top: 0;
    }

    .connection-status {
        padding: 0 2rem;
    }
}
</style>
`;
