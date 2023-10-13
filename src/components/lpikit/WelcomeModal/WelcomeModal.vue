<template>
    <BaseModal @close="completeLater">
        <template #content>
            <div class="portal-logo-ctn">
                <img class="portal-logo" :src="organizationLogo" :alt="organizationName" />
            </div>
            <h2 class="welcome-title">{{ organizationTitle }}</h2>
            <p class="notice">{{ $t('welcome-modal.success') }}</p>
            <p class="notice">{{ $t('welcome-modal.instruction') }}</p>
            <p class="notice">{{ $t('welcome-modal.guidance') }}</p>
        </template>
        <template #footer>
            <div class="footer">
                <LpiButton
                    :label="$filters.capitalize($t('welcome-modal.complete-later'))"
                    :secondary="true"
                    class="footer__left-button"
                    @click="completeLater"
                    data-test="close-button"
                />

                <LpiButton
                    :disabled="confirmActionDisabled || asyncing"
                    :label="
                        $filters.capitalize(confirmActionName || $t('welcome-modal.complete-now'))
                    "
                    :secondary="false"
                    class="footer__right-button"
                    @click="completeNow"
                    data-test="confirm-button"
                />
            </div>
        </template>
    </BaseModal>
</template>
<script>
import BaseModal from '@/components/lpikit/BaseModal/BaseModal.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
export default {
    name: 'WelcomeModal',

    emits: ['close'],

    components: { BaseModal, LpiButton },

    methods: {
        completeLater() {
            // TODO: register choice
            this.$emit('close')
        },

        completeNow() {
            this.$emit('close')
            this.$router.push({ name: 'ProfileEdit' })
        },
    },

    computed: {
        organizationLogo() {
            return this.$store.getters['organizations/current']?.logo_image?.variations?.medium
        },
        organizationName() {
            return this.$store.getters['organizations/current']?.name || ''
        },
        organizationTitle() {
            return this.$store.getters['organizations/current']?.dashboard_title || ''
        },
    },
}
</script>
<style scoped lang="scss">
.portal-logo-ctn {
    text-align: center;
}

.portal-logo {
    max-width: 20rem;
}

.welcome-title {
    text-align: center;
    font-weight: 700;
    font-size: $font-size-3xl;
    line-height: 1.25;
    margin-bottom: pxToRem(56px);
}

.notice {
    font-size: $font-size-m;
    line-height: 1.6;
}

.footer {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: $space-l;
}
</style>
