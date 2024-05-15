<template>
    <div class="home-btn-container">
        <LpiButton
            :label="$t('home.new-project')"
            secondary
            white-bg
            btn-icon="Plus"
            @click="$router.push({ name: 'createProject' })"
            class="individual-button white-bg"
            data-test="create-project"
        />

        <LpiButton
            v-if="organization.chat_button_text && organization.chat_url"
            :label="organization.chat_button_text"
            secondary
            white-bg
            @click="window.open(this.organization.chat_url, '_blank')"
            class="individual-button white-bg"
            data-test="go-to-chat"
        />
    </div>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
    name: 'HomeButtons',

    components: { LpiButton },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
    },
}
</script>

<style lang="scss" scoped>
.home-btn-container {
    display: flex;
    place-content: center center;
    gap: $space-xs;
}
</style>
