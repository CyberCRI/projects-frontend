<template>
    <BaseModal @close="completeLater" data-test="welcome-modal">
        <template #content>
            <div
                class="portal-logo-ctn"
                :style="{ 'background-image': `url(${organizationLogo})` }"
            ></div>
            <i18n-t keypath="welcome-modal.title" tag="h2" class="welcome-title" scope="global">
                <span>{{ organizationTitle }}</span>
            </i18n-t>
            <p class="notice">{{ $t('welcome-modal.success') }}</p>
            <p class="notice">{{ $t('welcome-modal.instruction') }}</p>
            <p class="notice">{{ $t('welcome-modal.guidance') }}</p>
        </template>
        <template #footer>
            <div class="footer">
                <LpiButton
                    :disabled="!!asyncing"
                    :label="$t('welcome-modal.complete-later')"
                    :btn-icon="asyncing == 'skip' ? 'LoaderSimple' : undefined"
                    :secondary="true"
                    class="footer__left-button"
                    @click="completeLater"
                    data-test="close-button"
                />

                <LpiButton
                    :disabled="!!asyncing"
                    :label="$t('welcome-modal.complete-now')"
                    :btn-icon="asyncing == 'proceed' ? 'LoaderSimple' : undefined"
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
import BaseModal from '@/components/base/modal/BaseModal.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import onboardingStatusMixin from '@/mixins/onboardingStatusMixin.ts'
export default {
    name: 'WelcomeModal',

    emits: ['close', 'complete-profile'],

    components: { BaseModal, LpiButton },

    mixins: [onboardingStatusMixin],

    data() {
        return {
            asyncing: false,
        }
    },

    methods: {
        async completeLater() {
            await this.patchUser('skip')
            this.$emit('close')
        },

        async completeNow() {
            await this.patchUser('proceed')
            this.$emit('complete-profile')
        },

        async patchUser(choice) {
            this.asyncing = choice
            // register that the user has seen the welcome modal
            // and set the next todos
            await this.onboardingTrapAll({
                show_welcome: false,
                // use 1 for step insted of 0 to have a truthy value
                show_complete_profile_modal: choice == 'proceed' ? 1 : false,
                show_progress: true,
                complete_profile: true,
                explore_projects: true,
                create_project: true,
                take_tour: true,
            })

            this.asyncing = false
        },
    },

    computed: {
        organizationLogo() {
            return this.$store.getters['organizations/current']?.logo_image?.variations?.medium
        },
        organizationTitle() {
            return this.$store.getters['organizations/current']?.name || ''
        },
    },
}
</script>
<style scoped lang="scss">
.portal-logo-ctn {
    width: 16rem;
    height: 16rem;
    margin: 0 auto;
    text-align: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
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
