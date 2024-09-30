<template>
    <div v-if="summary.length" class="summary">
        <div class="summary-header">{{ $t('common.index') }}</div>

        <div :class="{ 'body--description-block': description }" class="body custom-scrollbar">
            <ul>
                <li
                    v-for="(item, index) in summary"
                    :id="`quick-link-${item.id}`"
                    :key="index"
                    :class="summaryTextContainer ? item.type : null"
                >
                    <div
                        v-if="(item.separator || !summaryTextContainer) && index !== 0"
                        :class="{ 'separator--margin': !summaryTextContainer }"
                        class="separator"
                    />
                    <a
                        v-if="summaryTextContainer"
                        :href="item.link"
                        @click.prevent="onItemClicked(item.id)"
                    >
                        {{ item.text }}
                    </a>

                    <p
                        v-else-if="items"
                        :class="{ current: current === item.id }"
                        @click="onItemClicked(item.id)"
                    >
                        <span>{{ item.label }}</span>
                        <span v-if="item.date" class="item-date">{{
                            $d(new Date(item.date))
                        }}</span>
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BlogSummaryBlock',

    emits: ['item-clicked'],

    props: {
        summaryTextContainer: {
            type: String,
            default: '',
        },

        anchorOffset: {
            type: Number,
            default: 0,
        },

        items: {
            type: Array,
            default: null,
        },

        current: {
            type: Number,
            default: null,
        },

        description: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            summary: [],
        }
    },

    mounted() {
        this.loadSummary()
    },

    methods: {
        onItemClicked(id) {
            if (id !== this.current) this.$emit('item-clicked', id)
        },

        loadSummary() {
            if (this.summaryTextContainer && !this.items) {
                this.summary = []
                document
                    .querySelectorAll(
                        `${this.summaryTextContainer} > h1,${this.summaryTextContainer} > h2`
                    )
                    .forEach((element, i) => {
                        if (document.getElementById(`anchor-${i}`))
                            document.getElementById(`anchor-${i}`).remove()
                        const anchor = document.createElement('span')
                        anchor.id = `anchor-${i}`
                        anchor.classList.add('anchor-element')
                        if (this.anchorOffset) anchor.style.top = `-${this.anchorOffset}px`
                        element.prepend(anchor)

                        this.summary.push({
                            type: element.tagName,
                            text: element.innerText,
                            link: `#anchor-${i}`,
                            id: i,
                            separator: element.tagName === 'H1',
                        })
                    })
            } else if (this.items) this.summary = this.items
        },
    },

    watch: {
        current: {
            immediate: true,
            handler: function (neo, old) {
                if (neo && neo !== old) {
                    const target = document.getElementById(`quick-link-${neo}`)
                    if (target) target.scrollIntoView({ behavior: 'smooth' })
                }
            },
        },

        items: {
            handler() {
                this.loadSummary()
            },
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: $min-tablet) {
    .summary {
        width: 378px;
    }
}

.summary {
    background: $primary-lighter;
    border-radius: $border-radius-l;
    border: $border-width-s solid $primary;
    position: relative;
    overflow: hidden;

    .summary-header {
        padding: $space-l;
        font-size: 24px;
        font-weight: 700;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: $primary;
    }

    .body {
        overflow-y: scroll;
        max-height: 302px;
        margin: 0 $space-2xs 16px 0;
        padding-left: 16px;

        &--description-block {
            padding: $space-m $space-l;
            color: $primary-dark;
        }

        .separator {
            border: 1px solid $primary-dark;
            width: pxToRem(50px);
            margin-bottom: 16px;

            &--margin {
                margin-left: $space-m;
            }
        }

        .H1 {
            font-weight: 700;
            font-size: $font-size-m;
        }

        .H2 {
            margin-left: $space-m;
            font-weight: 500;
            font-size: $font-size-s;
        }

        li:not(:last-of-type) {
            margin-bottom: pxToRem(16px);
        }

        li {
            cursor: pointer;
            transition: color 0.2s ease-in-out;
            line-height: $line-height-tight;

            &:hover {
                color: $primary-dark;
            }

            a {
                color: $primary-dark;
            }

            p {
                color: $primary-dark;
            }
        }

        li > p {
            display: flex;
            justify-content: space-between;
            padding: 0 $space-m;

            .item-date {
                margin-left: $space-s;
            }

            &.current {
                font-weight: 700;
            }
        }
    }
}
</style>
