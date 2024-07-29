<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({
    cnxTimedout: {
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
})
</script>
<template>
    <p v-if="cnxTimedout" class="not-synced">
        {{ t(`multieditor.server-unconnectable`) }}
    </p>
    <div v-else>
        <p class="not-synced">{{ t('multieditor.not-synced') }}</p>
        <p class="not-synced">{{ t('multieditor.server-' + status) }}</p>
    </div>
</template>
<style lang="scss" scoped>
.not-synced {
    padding: 20px;
}
</style>
