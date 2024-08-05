<script setup>
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['do-fallback-edit'])

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

const riskAck = ref(false)
</script>
<template>
    <div v-if="cnxTimedout" class="not-synced">
        <p class="emphasis">
            {{ t(`multieditor.server-unconnectable.status`) }}
        </p>
        <p>{{ t(`multieditor.server-unconnectable.notice`) }}</p>
        <p>{{ t(`multieditor.server-unconnectable.ack-notice`) }}</p>
        <div class="fallback-ack">
            <LpiCheckbox v-model="riskAck" :label="t(`multieditor.server-unconnectable.do-ack`)" />
        </div>
        <div class="fallback-button">
            <LpiButton
                @click="emit('do-fallback-edit')"
                :disabled="!riskAck"
                :label="t(`multieditor.server-unconnectable.do-solo-edit`)"
            />
        </div>
    </div>
    <div v-else>
        <p class="not-synced">{{ t('multieditor.not-synced') }}</p>
        <p class="not-synced">{{ t('multieditor.server-' + status) }}</p>
    </div>
</template>
<style lang="scss" scoped>
.not-synced {
    padding: 20px;

    p + p {
        margin-top: 1rem;
    }
}

.emphasis {
    font-weight: 700;
}

.fallback-ack {
    padding-top: 1rem;
}

.fallback-button {
    display: flex;
    justify-content: center;
    padding-top: 1rem;
}
</style>
