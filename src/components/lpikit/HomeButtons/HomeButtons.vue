<template>
    <div v-for="(button, index) in buttons" :key="index" class="home-btn-container">
        <LpiButton
            :label="button.label"
            :secondary="true"
            :white-bg="true"
            btn-icon="Plus"
            @click="button.action"
            class="individual-button"
        />
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'HomeButtons',

    components: { LpiButton },

    props: {
        buttons: {
            type: Array,
            default: () => [],
        },
    },
}
</script>

<style lang="scss" scoped>
.home-btn-container {
    display: flex;
    justify-content: center;
    align-content: center;

    .individual-button {
        margin-block: $space-xs;
    }
}
</style>
