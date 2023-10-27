<template>
    <div class="tabs">
        <div
            v-click-outside="() => (showTabList = false)"
            :class="{ 'align-left': alignLeft, 'align-right': alignRight, border }"
            class="tabs-header"
        >
            <div class="tabs-slider">
                <div v-if="showTabList && usedTab.length > 0" class="tab-list-ctn">
                    <IconImage class="close-icon" name="Close" @click="closeTabList" />
                    <ul>
                        <li
                            v-for="(tab, index) in usedTab"
                            :id="tab.id"
                            :key="index"
                            :ref="'tab-' + index"
                            :class="{
                                'item-selected': currentTab.label === tab.label,
                                'tab--no-border': border,
                            }"
                            class="item"
                            @click="selectTab(isMobile ? index : tab.index)"
                        >
                            <IconImage
                                v-if="currentTab.label === tab.label"
                                class="icon"
                                name="ArrowRight"
                            />
                            <span v-else class="pellet" /> {{ tab.label }}
                        </li>
                    </ul>
                </div>

                <div class="tabs-slider-inner">
                    <template v-if="!isMobile && displayedTabs.length > 0">
                        <div
                            v-for="(tab, index) in displayedTabs"
                            :id="tab.id"
                            :key="index"
                            :ref="'tab-' + index"
                            :data-test="tab.key"
                            :class="{
                                selected: routerView
                                    ? currentViewIndex === index
                                    : current === index,
                                'tab--no-border': border,
                            }"
                            class="tab"
                            @click="selectTab(index)"
                        >
                            {{ tab.label }}
                        </div>
                    </template>

                    <div v-else class="mobile-tab-ctn">
                        <div :id="currentTab.id" ref="tab-0" class="tab selected">
                            {{ currentTab.label }}
                        </div>
                        <LpiButton
                            v-if="isMobile"
                            :label="$filters.capitalize(showMoreButtonLabel)"
                            class="more-btn"
                            left-icon="DotsHorizontal"
                            size="link"
                            @click="showTabList = !showTabList"
                        />
                    </div>
                </div>
            </div>
            <div class="btn-ctn">
                <LpiButton
                    v-if="!layouting && !isMobile && seeMoreTabs.length > 0"
                    :label="showMoreButtonLabel"
                    class="more-btn"
                    left-icon="DotsHorizontal"
                    size="link"
                    @click="showTabList = !showTabList"
                />
                <slot name="button-1"></slot>
            </div>
        </div>

        <div
            v-if="currentTab"
            :class="{
                border,
                'no-top-left-radius': noTopLeftRadius,
                'no-top-right-radius': noTopRightRadius,
            }"
            class="content"
        >
            <template v-if="currentTab.component && currentTab.key">
                <KeepAlive>
                    <Component
                        v-bind="currentTab.props"
                        :is="currentTab.component"
                        :key="currentTab.key"
                        @close="$emit('close')"
                    />
                </KeepAlive>
            </template>
            <router-view v-else-if="routerView" v-bind="currentTab.props"></router-view>
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import viewportWidth from '@/mixins/viewportWidth.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import debounce from 'lodash.debounce'

export default {
    name: 'TabsLayout',

    emits: ['close'],

    components: { LpiButton, IconImage },

    mixins: [viewportWidth],

    props: {
        tabs: {
            type: Array,
            required: true,
        },

        alignLeft: {
            type: Boolean,
            default: false,
        },

        alignRight: {
            type: Boolean,
            default: false,
        },

        border: {
            type: Boolean,
            default: true,
        },

        routerView: {
            type: Boolean,
            default: false,
        },
    },

    provide() {
        return {
            tabsLayoutSelectTab: this.selectTab,
        }
    },

    data() {
        return {
            current: 0,
            firstVisibleTabIndex: null,
            lastVisibleTabIndex: null,
            showTabList: false,
            displayedTabs: [],
            seeMoreTabs: [],
            layouting: false,
        }
    },

    mounted() {
        window.addEventListener('resize', this.layoutTabs)
    },

    unmounted() {
        window.removeEventListener('resize', this.layoutTabs)
    },

    computed: {
        currentTab() {
            return this.tabs[this.routerView ? this.currentViewIndex : this.current] || []
        },

        currentViewIndex() {
            return this.tabs.findIndex((tab) =>
                tab.view?.name
                    ? this.$route.name === tab.view?.name
                    : this.$route.path.indexOf(tab.view) === 0
            )
        },

        noTopLeftRadius() {
            return this.current === 0 && !this.alignRight
        },

        noTopRightRadius() {
            return this.current === this.tabs.length - 1 && !this.alignLeft
        },

        showMoreButtonLabel() {
            return `${this.$t('common.see-more')}`
        },

        usedTab() {
            return this.isMobile ? this.tabs : this.seeMoreTabs
        },
    },

    methods: {
        layoutTabs: debounce(
            // debounced to not hammer the browser on each resize
            async function () {
                // dirty fix for unit test async error (code is executed after dom was suppressed)
                try {
                    if (!document) return
                } catch (e) {
                    return
                }

                /* for each tab, we check if it fit in the wrapper
                 * if it doesn't, we hide it and add it to the more tabs
                 */
                const tabsNode = this.$el.querySelector('.tabs-slider')

                if (tabsNode) {
                    // reset the arrays
                    this.displayedTabs.splice(0)
                    this.seeMoreTabs.splice(0)

                    // for code factorization
                    const iterate = async (tabs, displayed, otherTab) => {
                        const wrapperRight = tabsNode.getBoundingClientRect()?.right
                        let skipOthers = false
                        for (let i = 0; i < tabs.length; i++) {
                            // add the tag to the displayed tags to compute its size
                            displayed.push(tabs[i])
                            await this.$nextTick()
                            // get the last badge and check if it fits
                            const tabsHtmlElement = this.$el.querySelectorAll('.tab')
                            if (skipOthers) {
                                displayed.pop()
                                otherTab.push({ ...tabs[i], index: i })
                            } else if (tabsHtmlElement.length) {
                                const lastTab = tabsHtmlElement[tabsHtmlElement.length - 1]
                                const lastTabRight = lastTab.getBoundingClientRect().right
                                if (lastTabRight > wrapperRight) {
                                    // if it doesn't, we hide it and add it to the more tags
                                    displayed.pop()
                                    otherTab.push({ ...tabs[i], index: i })
                                    // remember we started to skip tabs
                                    // so next are also removed even if they fit
                                    // and we keep tab order
                                    skipOthers = true
                                }
                            }
                        }
                    }

                    const postIterate = async (tabs, displayed, otherTab) => {
                        const wrapperRight = tabsNode.getBoundingClientRect()?.right
                        let skipOthers = false
                        for (let i = displayed.length - 1; i > 0; i--) {
                            await this.$nextTick()
                            // get the last badge and check if it fits
                            const tabsHtmlElement = this.$el.querySelectorAll('.tab')
                            if (tabsHtmlElement.length) {
                                const lastTab = tabsHtmlElement[tabsHtmlElement.length - 1]
                                const lastTabRight = lastTab.getBoundingClientRect().right
                                if (lastTabRight > wrapperRight) {
                                    // if it doesn't, we hide it and add it to the more tags
                                    displayed.pop()
                                    otherTab.unshift({ ...tabs[i], index: i })
                                } else {
                                    break // at this point all remaining tabs fit
                                }
                            }
                        }
                    }

                    // do the actual job
                    this.layouting = true
                    await this.$nextTick(async () => {
                        await iterate(this.tabs, this.displayedTabs, this.seeMoreTabs)
                        this.layouting = false
                        if (this.seeMoreTabs.length) {
                            await this.$nextTick()
                            // now available space might be shorter withe the see more button so re-iterate
                            await postIterate(this.tabs, this.displayedTabs, this.seeMoreTabs)
                        }
                    })
                } // end of if (tabs.length)
            },
            42,
            { leading: false, trailing: true }
        ),

        selectTab(index) {
            this.current = index
            if (this.routerView) {
                this.$router.push(this.tabs[this.current].view)
            }

            this.closeTabList()
        },

        closeTabList() {
            this.showTabList = false
        },
    },
    watch: {
        tabs: {
            handler: 'layoutTabs',
            deep: true,
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.tabs {
    position: relative;

    .tabs-header {
        display: flex;
        align-items: flex-end;
        width: 100%;

        &.align-left {
            justify-content: flex-start;
        }

        &.align-right {
            justify-content: flex-end;
        }

        @media screen and (max-width: $min-tablet) {
            flex-flow: column;
            align-items: stretch;
        }

        &.border {
            // room for border radius of content
            padding-left: pxToRem(51px);
            padding-right: pxToRem(51px);
            box-sizing: border-box;
        }

        .tab-nav,
        .tab-nav-ctn {
            flex-basis: $font-size-4xl;
            width: $font-size-4xl;
            fill: $primary-dark;
            flex-shrink: 0;

            &.tab-nav-mobile {
                display: inline-block;
                margin-left: auto;
            }

            &.tab-nav-desktop {
                display: none;
            }

            @media screen and (min-width: $min-tablet) {
                &.tab-nav-mobile {
                    display: none;
                }

                &.tab-nav-desktop {
                    display: inline-block;
                }
            }
        }

        .tab-nav-ctn {
            display: flex;
            justify-content: space-between;
            width: 100%;

            @media screen and (min-width: $min-tablet) {
                display: inline-block;
                width: auto;
            }

            &.empty-on-desktop {
                display: none;
            }
        }

        .tabs-slider {
            flex-grow: 1;
            overflow: hidden;
            padding-top: 2px; // room for the tab upper border not to be cropped
            margin-bottom: -1px; // merge with content top border if it has some (admin, carousel)

            // same as border-bottom: $border-width-s solid $green;
            // but with a background-image so it passes under the child tab element
            background: transparent
                url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NguL38PwAE4wKCsDeq2gAAAABJRU5ErkJggg==')
                left bottom repeat-x;

            .tabs-slider-inner {
                display: flex;
                align-items: flex-end;
                justify-content: flex-start;
                padding-top: pxToRem(4px); // room for the tab upper border not to be cropped

                .mobile-tab-ctn {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;

                    .more-btn {
                        margin-right: $space-m;
                    }
                }
            }

            .tab-list-ctn {
                position: absolute;
                right: 0;
                top: 0;
                background-color: $primary-dark;
                color: $white;
                box-shadow: 0 4px 4px rgb(0 0 0 / 15%);
                border-radius: 8px;
                padding: 24px;
                z-index: 110;

                @media screen and (max-width: $min-tablet) {
                    width: 87%;
                }

                .item {
                    font-style: normal;
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 18px;
                    display: flex;
                    align-items: center;
                    text-transform: uppercase;
                    color: $white;
                    padding: 8px;
                    cursor: pointer;

                    &-selected {
                        background-color: $green;
                        color: $primary-dark;
                        border-radius: 8px;
                    }
                }

                .pellet {
                    background: $green;
                    border: 4px solid $green;
                    border-radius: 50%;
                    margin-right: 12px;
                }

                .close-icon {
                    position: absolute;
                    width: 24px;
                    fill: $white;
                    right: 4px;
                    top: 4px;
                    cursor: pointer;
                }

                .icon {
                    width: 16px;
                    fill: $primary-dark;
                    margin-right: 12px;
                }
            }
        }

        .btn-ctn {
            display: flex;
            align-items: center;
            margin-left: $space-m;
            margin-bottom: 0;

            &:empty {
                display: none;
            }

            @media screen and (max-width: $min-tablet) {
                order: -1;
                flex-basis: 100%;
                flex-shrink: 0;
                margin: 0 auto;
                margin-bottom: 24px;
            }

            .more-btn {
                margin-right: pxToRem(16px);
            }
        }

        .tab {
            text-transform: uppercase;
            padding: 9px $space-l;
            cursor: pointer;
            color: $primary-dark;
            font-weight: bold;
            font-size: $font-size-m;
            box-sizing: border-box;
            user-select: none; // avoid text selection while clicking on tab
            transition: transform 0.3s ease-in-out;
            transform-origin: bottom center;

            &--no-border {
                border-bottom: none;
            }

            &:hover {
                transform: scaleY(1.15);
            }

            &.selected {
                background: $primary-lighter;
                border-left: $border-width-s solid $green;
                border-top: $border-width-s solid $green;
                border-right: $border-width-s solid $green;
                border-top-left-radius: $border-radius-l;
                border-top-right-radius: $border-radius-l;
                border-bottom: $border-width-s solid $primary-lighter; // mask parent pseudo border-bottom with background color

                &:hover {
                    transform: none;
                }
            }
        }
    }

    .content {
        border-radius: unset;

        &.border {
            border: $border-width-s solid $green;
            overflow: hidden;
            border-radius: $border-radius-l;
        }
    }
}
</style>
