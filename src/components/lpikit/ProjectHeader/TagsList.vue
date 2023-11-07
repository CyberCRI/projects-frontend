<template>
    <div class="wrapper">
        <div class="tag-ctn">
            <router-link
                v-for="tag in displayedOrgTags || []"
                :key="prefix + tag.id"
                :to="browsePageWithQuery('organization_tags', tag.id)"
                class="tag-elt tag-elt-anim"
            >
                <BadgeItem v-if="tag.name" :key="prefix + tag.id" :label="tag.name" size="small" />
            </router-link>
            <router-link
                v-for="tag in displayedWikiTags || []"
                :key="tag.wikipedia_qid"
                :to="browsePageWithQuery('wikipedia_tags', tag.wikipedia_qid)"
                class="tag-elt tag-elt-anim"
            >
                <BadgeItem
                    v-if="tag[`name_${currentLang}`] || tag.name"
                    :label="tag[`name_${currentLang}`] || tag.name"
                    size="small"
                />
            </router-link>
            <template v-if="internal">
                <router-link
                    v-for="tag in displayedInfoTags || []"
                    :key="prefix + tag.name"
                    :to="tag.direction"
                    class="tag-elt"
                >
                    <BadgeItem
                        v-if="tag.name"
                        :key="prefix + tag.name"
                        :label="tag.name"
                        size="small"
                    />
                </router-link>
            </template>
            <template v-else>
                <a
                    v-for="tag in displayedInfoTags || []"
                    :key="prefix + tag.direction"
                    :href="tag.direction"
                    target="_blank"
                    class="tag-elt"
                >
                    <BadgeItem
                        v-if="tag.name"
                        :key="prefix + tag.name"
                        :label="tag.name"
                        size="small"
                    />
                </a>
            </template>
            <span
                class="tag-elt-show-more"
                @click="showExtraTags = !showExtraTags"
                :class="{ hidden: !hasMoreTags }"
            >
                <BadgeItem
                    class="tag-elt tag-elt-show-more"
                    :class="{ 'is-showing-more': showExtraTags }"
                    :label="`+ ${moreTagsCount}`"
                    colors="primary-dark"
                    size="small"
                    :is-open-tab="showExtraTags"
                />
            </span>
        </div>
        <div class="extra-tags" v-if="showExtraTags" :class="{ 'straight-corner': straightCorner }">
            <router-link
                v-for="tag in moreOrgTags || []"
                :key="tag.id"
                :to="browsePageWithQuery('organization_tags', tag.id)"
                class="extra-tag-elt tag-elt-anim"
            >
                <BadgeItem v-if="tag.name" :label="tag.name" size="small" />
            </router-link>
            <router-link
                v-for="tag in moreWikiTags || []"
                :key="tag.wikipedia_qid"
                :to="browsePageWithQuery('wikipedia_tags', tag.wikipedia_qid)"
                class="extra-tag-elt tag-elt-anim"
            >
                <BadgeItem
                    v-if="tag[`name_${currentLang}`] || tag.name"
                    :label="tag[`name_${currentLang}`] || tag.name"
                    size="small"
                />
            </router-link>
            <span v-if="internal">
                <router-link
                    v-for="tag in moreInfoTags || []"
                    :key="prefix + tag.name"
                    :to="tag.direction"
                    class="extra-tag-elt"
                >
                    <BadgeItem
                        v-if="tag.name"
                        :key="prefix + tag.name"
                        :label="tag.name"
                        size="small"
                    />
                </router-link>
            </span>
            <span v-else>
                <a
                    v-for="tag in moreInfoTags || []"
                    :key="prefix + tag.direction"
                    :href="tag.direction"
                    target="_blank"
                    class="extra-tag-elt"
                >
                    <BadgeItem
                        v-if="tag.name"
                        :key="prefix + tag.name"
                        :label="tag.name"
                        size="small"
                    />
                </a>
            </span>
        </div>
    </div>
</template>
<script>
import debounce from 'lodash.debounce'
import BadgeItem from '@/components/lpikit/Badge/BadgeItem.vue'

export default {
    name: 'TagsList',

    components: {
        BadgeItem,
    },

    data() {
        return {
            moreOrgTags: [],
            moreWikiTags: [],
            moreInfoTags: [],
            displayedOrgTags: [],
            displayedWikiTags: [],
            displayedInfoTags: [],
            layoutTags: debounce(
                async function () {
                    /* for each tag, we check if it fit in the wrapper
                     * if it doesn't, we hide it and add it to the more tags
                     * we do this for both org and wiki tags
                     */
                    if (this && this.$el) {
                        const wrapperRight = this.$el.getBoundingClientRect().right
                        const wrapperBottom = this.$el.getBoundingClientRect().bottom
                        let hideNext = false

                        // reset the arrays
                        this.displayedOrgTags.splice(0)
                        this.displayedWikiTags.splice(0)
                        this.displayedInfoTags.splice(0)
                        this.moreOrgTags.splice(0)
                        this.moreWikiTags.splice(0)
                        this.moreInfoTags.splice(0)

                        // for code factorization
                        const iterate = async (tags, displayed, more) => {
                            for (const tag of tags) {
                                if (hideNext) {
                                    // if we hide previous tag, we hide this one too
                                    more.push(tag)
                                    continue
                                }
                                // add the tag to the displayed tags to compute its size
                                displayed.push(tag)
                                await this.$nextTick()
                                // get the last badge and check if it fits
                                const elts = this.$el.querySelectorAll('.tag-elt')
                                if (elts.length) {
                                    const elt = elts[elts.length - 1]
                                    const eltRight = elt.getBoundingClientRect().right
                                    const eltBottom = elt.getBoundingClientRect().bottom
                                    let elt2 = null
                                    let elt2Right = null
                                    let elt2Bottom = null
                                    if (elts.length > 1) {
                                        elt2 = elts[elts.length - 2]
                                        elt2Right = elt2.getBoundingClientRect().right
                                        elt2Bottom = elt2.getBoundingClientRect().bottom
                                    }
                                    if (
                                        eltRight > wrapperRight ||
                                        eltBottom > wrapperBottom ||
                                        (elt2 && elt2Right > wrapperRight) ||
                                        elt2Bottom > wrapperBottom
                                    ) {
                                        // if it doesn't, we hide it and add it to the more tags
                                        displayed.pop()
                                        more.push(tag)
                                        // and mark the next ones to be hidden too
                                        hideNext = true
                                    }
                                }
                            }
                        }

                        // do the actual job
                        await iterate(
                            this.organizationTags,
                            this.displayedOrgTags,
                            this.moreOrgTags
                        )
                        await iterate(this.wikipediaTags, this.displayedWikiTags, this.moreWikiTags)
                        await iterate(this.infoTags, this.displayedInfoTags, this.moreInfoTags)

                        // fix border radius if extra tags container is too short
                        const elts = this.$el.querySelectorAll('.tag-elt')
                        if (elts.length) {
                            const lastEltRight = elts[elts.length - 1].getBoundingClientRect().right
                            this.straightCorner = wrapperRight - lastEltRight < 12
                        } else {
                            this.straightCorner = false
                        }
                    }
                },
                40,
                { leading: false, trailing: true }
            ),
            showExtraTags: false,
            straightCorner: false,
        }
    },

    async mounted() {
        this.layoutTags()
        document.addEventListener('click', this.extraTagClickOutside)
        window.addEventListener(
            'resize',
            debounce(this.layoutTagsBis, 42, { leading: false, trailing: true })
        )
    },

    props: {
        organizationTags: {
            type: Array,
            default: () => [],
        },
        wikipediaTags: {
            type: Array,
            default: () => [],
        },
        infoTags: {
            type: Array,
            default: () => [],
        },
        prefix: {
            type: String,
            default: '',
        },
        internal: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        currentLang() {
            return this.$store.getters['languages/current']
        },
        moreTagsCount() {
            return this.moreOrgTags.length + this.moreWikiTags.length + this.moreInfoTags.length
        },
        hasMoreTags() {
            return this.moreTagsCount > 0
        },
    },

    watch: {
        organizationTags: {
            handler: 'layoutTags',
            deep: true,
            immediate: false,
        },

        wikipediaTags: {
            handler: 'layoutTags',
            deep: true,
            immediate: false,
        },

        infoTags: {
            handler: 'layoutTags',
            deep: true,
            immediate: false,
        },
    },

    methods: {
        async layoutTagsBis() {
            // NEEDED FOR THE RESIZE

            /* for each tag, we check if it fit in the wrapper
             * if it doesn't, we hide it and add it to the more tags
             * we do this for both org and wiki tags
             */
            const wrapperRight = this.$el.getBoundingClientRect().right
            const wrapperBottom = this.$el.getBoundingClientRect().bottom

            let hideNext = false

            // reset the arrays
            this.displayedOrgTags.splice(0)
            this.displayedWikiTags.splice(0)
            this.displayedInfoTags.splice(0)
            this.moreOrgTags.splice(0)
            this.moreWikiTags.splice(0)
            this.moreInfoTags.splice(0)

            // for code factorization
            const iterate = async (tags, displayed, more) => {
                for (const tag of tags) {
                    if (hideNext) {
                        // if we hide previous tag, we hide this one too
                        more.push(tag)
                        continue
                    }
                    // add the tag to the displayed tags to compute its size
                    displayed.push(tag)
                    await this.$nextTick()
                    // get the last badge and check if it fits
                    const elts = this.$el.querySelectorAll('.tag-elt')
                    if (elts.length) {
                        const elt = elts[elts.length - 1]
                        const eltRight = elt.getBoundingClientRect().right
                        const eltBottom = elt.getBoundingClientRect().bottom
                        let elt2 = null
                        let elt2Right = null
                        let elt2Bottom = null
                        if (elts.length > 1) {
                            elt2 = elts[elts.length - 2]
                            elt2Right = elt2.getBoundingClientRect().right
                            elt2Bottom = elt2.getBoundingClientRect().bottom
                        }
                        if (
                            eltRight > wrapperRight ||
                            eltBottom > wrapperBottom ||
                            (elt2 && elt2Right > wrapperRight) ||
                            elt2Bottom > wrapperBottom
                        ) {
                            // if it doesn't, we hide it and add it to the more tags
                            displayed.pop()
                            more.push(tag)
                            // and mark the next ones to be hidden too
                            hideNext = true
                        }
                    }
                }
            }

            // do the actual job
            await iterate(this.organizationTags, this.displayedOrgTags, this.moreOrgTags)
            await iterate(this.wikipediaTags, this.displayedWikiTags, this.moreWikiTags)
            await iterate(this.infoTags, this.displayedInfoTags, this.moreInfoTags)

            // fix border radius if extra tags container is too short
            const elts = this.$el.querySelectorAll('.tag-elt')
            if (elts.length) {
                const lastEltRight = elts[elts.length - 1].getBoundingClientRect().right
                this.straightCorner = wrapperRight - lastEltRight < 12
            } else {
                this.straightCorner = false
            }
        },

        browsePageWithQuery(queryField, queryValue) {
            return {
                name: 'ProjectSearch',
                query: {
                    [queryField]: queryValue,
                    section: 'projects',
                },
            }
        },

        extraTagClickOutside(evt) {
            // if we click outside the extra tags AND outside of the toggle button (they are siblings), we hide them
            const showMore = this.$el.querySelector('.tag-elt-show-more')
            const extra = this.$el.querySelector('.extra-tags')

            if (
                showMore &&
                !showMore.contains(evt.target) &&
                showMore !== evt.target &&
                extra &&
                !extra.contains(evt.target) &&
                extra !== evt.target
            ) {
                this.showExtraTags = false
            }
        },
    },

    unmounted() {
        document.removeEventListener('click', this.extraTagClickOutside)

        window.removeEventListener('resize', this.layoutTagsBis)
    },
}
</script>
<style lang="scss" scoped>
.wrapper {
    position: relative;
    height: 22px;

    .tag-ctn {
        margin: 0;
        display: flex;
        flex-wrap: nowrap;
        gap: $space-xs;
        height: 22px;
    }
}

.extra-tags {
    margin-top: -$border-width-s;
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    background-color: $white;
    border: $border-width-s solid $green;
    border-radius: $border-radius-m;
    padding: $space-m;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: $space-2xs;
    width: min-content;

    &.straight-corner {
        border-top-right-radius: 0;
    }
}

.tag-elt-anim {
    transition: transform 0.3s ease-in-out;
    transform-origin: center bottom;
    display: inline-block;

    &:hover {
        transform: scaleY(1.3);
    }
}

.tag-elt-show-more {
    cursor: pointer;

    &.hidden {
        /* the tag must stay in dom and be displayed for computation to work so we just hide it */
        visibility: hidden;
        pointer-events: none;
    }
}

.is-showing-more {
    position: relative;
    z-index: 2;
}
</style>
