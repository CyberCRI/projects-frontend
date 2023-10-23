<template>
    <div :class="{ loading: isLoading }" class="page-section-extra-wide help-layout page-top">
        <div>
            <h1 class="page-title">{{ $filters.capitalize($t('faq.portal')) }}</h1>
        </div>
        <div class="intro-ctn">
            <ul class="action-list">
                <li>
                    <a href="#" @click.prevent="showContactUsDrawer = true">{{
                        $t('footer.contact')
                    }}</a>
                </li>
                <li>
                    <a href="#" @click.prevent="reportBugOpen = true">{{ $t('report.bug') }}</a>
                </li>
            </ul>
        </div>

        <LpiLoader v-if="isLoading" type="simple" />
        <TabsLayout v-else :align-left="true" :border="false" :tabs="tabs"></TabsLayout>
    </div>
    <DrawerLayout
        :custom-style="customNotificationStyle"
        :is-opened="showContactUsDrawer"
        :has-footer="false"
        class="medium"
        confirm-action-name=""
        :title="$t('footer.contact')"
        @close="closeDrawer"
    >
        <ContactDrawer v-if="showContactUsDrawer" @close="closeDrawer" />
    </DrawerLayout>
    <DrawerLayout
        v-if="reportBugOpen"
        :confirm-action-name="$t('common.submit')"
        :full-height="false"
        :has-footer="false"
        :is-opened="reportBugOpen"
        :title="$t(`report.bug`)"
        class="report-form"
        @close="reportBugOpen = false"
    >
        <ReportForm type="bug" @close="reportBugOpen = false" />
    </DrawerLayout>
</template>

<script>
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import { defineAsyncComponent } from 'vue'
import ReportForm from '@/components/lpikit/ReportForm/ReportForm.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import ContactDrawer from '@/components/Drawers/ContactDrawer.vue'

export default {
    name: 'HelpPage',

    components: {
        LpiLoader,
        TabsLayout,
        ContactDrawer,
        DrawerLayout,
        ReportForm,
    },

    data() {
        return {
            isLoading: true,
            customTab: null,
            showContactUsDrawer: false,
            reportBugOpen: false,
            customNotificationStyle: {
                maxHeight: 'unset',
                padding: 'unset',
            },
        }
    },

    mounted() {
        this.setOnboardData()
    },

    computed: {
        faq() {
            return this.$store.getters['faqs/current']
        },

        tabs() {
            const res = []

            if (this.customTab) res.push(this.customTab)

            res.push({
                key: 'help-help',
                label: this.$t('faq.portal'),
                component: defineAsyncComponent(() => import('./Tabs/HelpTab.vue')),
            })
            res.push({
                key: 'help-video',
                label: this.$t('faq.video'),
                component: defineAsyncComponent(() => import('./Tabs/VideoTab.vue')),
            })
            return res
        },
    },

    methods: {
        async setOnboardData() {
            let faq = this.faq
            try {
                if (!faq) {
                    faq = await this.$store.dispatch(
                        'faqs/getFaq',
                        this.$store.getters['organizations/current'].code
                    )
                }

                if (faq && faq.title && faq.content && faq.content !== '<p></p>') {
                    this.customTab = {
                        label: this.faq.title,
                        key: 'help-template',
                        component: defineAsyncComponent(() => import('./Tabs/OnBoardingTab.vue')),
                    }
                }
            } catch (error) {
                console.error(error)
            }

            this.isLoading = false
        },
        closeDrawer() {
            this.showContactUsDrawer = false
            this.reportBugOpen = false
        },
    },
}
</script>

<style lang="scss" scoped>
.intro-ctn {
    margin-bottom: $space-xl;
    background: $primary-lighter;
    padding: $space-l;
    border-radius: $border-radius-17;

    .action-list {
        list-style-type: disc;
        list-style-position: inside;
        font-size: $font-size-l;

        li {
            padding: $space-m 0;
        }
    }
}

.help-layout {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    &.loading {
        justify-content: center;
        align-items: center;
    }
}

:deep(.tabs) {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    .content {
        display: flex;
        flex-flow: column nowrap;
        flex-grow: 1;

        img {
            max-width: 100%;
        }
    }
}
</style>
