<template>
    <DrawerLayout :is-opened="isOpened" title="" @close="cancel" class="full" :padding="false">
        <template #header_prefix>
            <h3 class="progression">
                {{ $t('complete-profile.onboarding') }} {{ step + 1 }}/{{ stepComponents.length }}
            </h3>
        </template>
        <div class="complete-profile-page page-section-wide">
            <header>
                <h1 class="title">{{ $t('complete-profile.title') }}</h1>
                <p class="notice">
                    {{ $t('complete-profile.notice.intro') }}<br />
                    {{ $t('complete-profile.notice.no-idea') }}
                    <RouterLink class="link" :to="{ name: 'Help' }">{{
                        $t('complete-profile.notice.help')
                    }}</RouterLink>
                </p>
            </header>
            <main>
                <component
                    ref="currentStepComponent"
                    @saving="saving = $event"
                    :is="stepComponent"
                ></component>
            </main>
        </div>
        <template #footer>
            <LpiButton
                @click="cancel"
                secondary
                :label="$t('complete-profile.cancel')"
                :disabled="saving"
            ></LpiButton>

            <LpiButton
                @click="save"
                :label="$t(saveLabel)"
                :btn-icon="saving ? 'LoaderSimple' : undefined"
                :disabled="saving"
            ></LpiButton>
        </template>
    </DrawerLayout>
</template>
<script>
import { toRaw } from 'vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import CompleteProfileStep1 from '@/components/lpikit/CompleteProfileDrawer/CompleteProfileStep1.vue'
import CompleteProfileStep2 from '@/components/lpikit/CompleteProfileDrawer/CompleteProfileStep2.vue'
export default {
    name: 'CompleteProfileDrawer',
    components: { LpiButton, CompleteProfileStep1, CompleteProfileStep2, DrawerLayout },
    emits: ['close'],
    data() {
        return {
            stepComponents: [CompleteProfileStep1, CompleteProfileStep2],
            step: 0,
            saving: false,
        }
    },
    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        stepComponent() {
            return toRaw(this.stepComponents[this.step])
        },

        saveLabel() {
            return this.step < this.stepComponents.length - 1
                ? 'complete-profile.save-and-next'
                : 'complete-profile.save-and-finish'
        },
    },
    methods: {
        cancel() {
            // TODO: specify and implement
            this.$emit('close')
        },
        async save() {
            const success = await this.$refs.currentStepComponent.save()

            if (success) {
                if (this.step < this.stepComponents.length - 1) {
                    this.step++
                } else {
                    // TODO: end of the game
                    this.$emit('close')
                }
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.complete-profile-page {
    margin-top: $navbar-height;
}

.progression {
    color: $primary-dark;
    font-size: $font-size-m;
    margin-bottom: 1rem;
    font-weight: 700;
}

.title {
    font-size: $font-size-5xl;
    line-height: 1;
    margin-bottom: pxToRem(22px);
}

.notice {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: pxToRem(48px);
}

.link {
    color: $primary-dark;
    text-decoration: underline;
    font-weight: 700;
}

footer {
    border-top: $border-width-m solid $gray-10;
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: pxToRem(28px) 0;
    margin-top: pxToRem(74px);
}
</style>
