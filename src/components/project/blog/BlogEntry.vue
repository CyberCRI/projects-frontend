<template>
    <div class="blog-entry" :class="{ 'shadow-box': !isExpanded }">
        <div class="blog-entry-header">
            <div class="header-main">
                <div class="entry-title">{{ blogEntry.title }}</div>

                <div class="date">
                    {{ new Date(blogEntry.created_at).toLocaleDateString() }}
                </div>
            </div>

            <div class="expand-button" @click="toggleExpand">
                <span>{{ isExpanded ? $t('common.shrink') : $t('common.read') }}</span>

                <IconImage v-if="isExpanded" name="ChevronUp" />
                <IconImage v-else name="ChevronDown" />
            </div>
        </div>

        <div v-if="isExpanded && isLastBlogEntry" class="last-publication-flag">
            {{ $t('blog.last-publication') }}
        </div>

        <div v-show="isExpanded" class="entry-body" v-html="blogEntry.content"></div>

        <div
            v-if="canEdit || canDelete"
            :class="{ 'button-ctn--expanded': isExpanded }"
            class="button-ctn"
        >
            <ContextActionButton
                v-if="canEdit"
                class="button small"
                action-icon="Pen"
                @click="$emit('edit-clicked')"
            />
            <ContextActionButton
                v-if="canDelete"
                class="button small"
                action-icon="Close"
                @click="$emit('delete-clicked')"
            />
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import fixEditorContent from '@/functs/editorUtils.ts'

export default {
    name: 'BlogEntry',

    emits: ['edit-clicked', 'delete-clicked', 'toggle-expand'],

    components: {
        IconImage,
        ContextActionButton,
    },

    props: {
        blogEntry: {
            type: Object,
            required: true,
        },

        isLastBlogEntry: {
            type: Boolean,
            default: false,
        },

        isExpanded: {
            type: Boolean,
            default: false,
        },

        canEdit: {
            type: Boolean,
            default: false,
        },

        canDelete: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        toggleExpand() {
            this.$emit('toggle-expand', this.blogEntry)
        },
    },

    watch: {
        'blogEntry.content': {
            handler: function (neo, old) {
                if (neo != old) {
                    // give time to render content
                    this.$nextTick(() => {
                        const contentNode = this.$el.querySelector('.entry-body')
                        fixEditorContent(contentNode)
                    })
                }
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.blog-entry {
    border-radius: $border-radius-l;
    border: $border-width-s solid $green;
    box-sizing: border-box;
    background: $white;
    position: relative;

    .blog-entry-header {
        display: flex;
        color: $primary-dark;

        .header-main {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: $space-m $space-l;
            font-weight: 700;
            width: 100%;

            .entry-title {
                font-size: $font-size-m;
                line-height: 18px;
            }

            .date {
                font-size: $font-size-xs;
            }
        }

        .expand-button {
            border-left: $border-width-s solid $green;
            display: flex;
            align-items: center;
            padding: 0 $space-l;
            text-transform: uppercase;
            font-weight: 700;
            font-size: $font-size-2xs;
            cursor: pointer;
            flex-basis: pxToRem(75px);
            justify-content: space-between;

            svg {
                height: 18px;
                fill: $primary-dark;
            }
        }
    }

    .last-publication-flag {
        border-top: $border-width-s solid $green;
        background: $green-light;
        color: $primary-dark;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: $font-size-2xs;
        padding: $space-s 0;
    }

    .entry-body {
        border-top: $border-width-s solid $green;
        padding: $space-m $space-l;

        &::after {
            // fix floated image overflow
            content: '';
            display: block;
            clear: both;
        }
    }

    .button-ctn {
        position: absolute;
        top: 0;
        right: 110px;
        display: flex;
        transform: translateY(-60%);

        .button {
            margin: 0 4px;
        }

        svg {
            width: 12px;
            height: 12px;
            fill: $primary-dark;
        }
    }
}
</style>
