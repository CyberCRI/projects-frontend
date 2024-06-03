<template>
    <div class="resource-wrapper">
        <div
            :class="[{ 'h-reverse': horizontalReverse }, color]"
            class="resource-card shadow-box"
            @click="openResource"
        >
            <div v-if="icon" class="icon-ctn">
                <IconImage :name="icon" class="icon" />
            </div>

            <div class="content">
                <span class="resource-title">{{ title }}</span>
                <span class="resource-subtitle">{{ subtitle }}</span>
            </div>
        </div>
        <div v-if="canEdit || canDelete" class="actions-ctn">
            <ContextActionButton v-if="canEdit" action-icon="Pen" @click="$emit('edit-clicked')" />
            <ContextActionButton
                v-if="canDelete"
                action-icon="Close"
                @click="$emit('delete-clicked')"
            />
        </div>
    </div>
</template>

<script>
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import IconImage from '@/components/base/media/IconImage.vue'

export default {
    name: 'ResourceCard',

    emits: ['delete-clicked', 'edit-clicked'],

    components: { IconImage, ContextActionButton },

    props: {
        title: {
            type: String,
            required: true,
        },

        subtitle: {
            type: String,
            default: '',
        },

        resource: {
            type: Object,
            default: () => {},
        },

        canEdit: {
            type: Boolean,
            default: false,
        },

        canDelete: {
            type: Boolean,
            default: false,
        },

        horizontalReverse: {
            type: Boolean,
            default: false,
        },

        icon: {
            type: String,
            default: null,
        },

        color: {
            type: String,
            default: null,
            validator(value) {
                return [null, 'blue', 'violet'].includes(value)
            },
        },
    },

    methods: {
        openResource() {
            if (this.resource.attachment_type === 'file') {
                window.open(this.resource.file, '_blank')
            } else {
                //'link', 'video'...
                window.open(this.resource.site_url, '_blank')
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.resource-wrapper {
    width: 100%;
    position: relative;

    .actions-ctn {
        position: absolute;
        top: -18px;
        right: 0;
        display: flex;

        button:last-of-type {
            margin-left: $space-s;
        }
    }

    .resource-card {
        border: $border-width-s solid $green;
        border-radius: $border-radius-m;
        display: flex;
        cursor: pointer;
        height: 96px;
        overflow: hidden;
        position: relative;

        &.h-reverse {
            flex-direction: row-reverse;

            .icon-ctn {
                border-left: 1px solid $green;
                border-right: unset;
            }
        }

        &:hover .content {
            background-color: $primary-lighter;
        }

        .icon-ctn {
            background: $primary;
            border-right: 1px solid $green;
            padding: $space-l;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

            > svg {
                width: 30px;
                max-height: 100%;
                fill: $white;
            }

            &.blue {
                background: $blue;
            }
        }

        .content {
            background-color: $white;
            font-size: $font-size-m;
            padding: $space-s pxToRem(18px);
            margin-right: auto;
            transition: background-color 0.3s ease-in-out;
            overflow: hidden;
            flex-grow: 1;

            .resource-title {
                font-weight: bold;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                word-wrap: break-word;
            }

            .resource-subtitle {
                font-size: $font-size-s;
                line-height: $line-height-tight;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                margin-top: $space-s;
                word-wrap: break-word;
            }

            span {
                display: block;
            }
        }

        .button-ctn {
            position: absolute;
            top: -8px;
            right: 17px;
            display: flex;

            .svg-wrapper {
                padding: $space-2xs;
                background: $green-lighter;
                border-radius: 100%;
                border: $border-width-s solid $green;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;

                svg {
                    width: 12px;
                    height: 12px;
                    fill: $primary-dark;
                }

                &:nth-child(2) {
                    margin-left: $space-2xs;
                }
            }
        }

        &.blue {
            .icon-ctn {
                background: $blue;
            }
        }

        &.violet {
            border-color: $violet-dark;
            color: $violet-dark;

            .icon-ctn {
                background: $violet;
                border-right-color: $violet-dark;
            }

            &.resource-card .icon-ctn {
                border-left-color: $violet-dark;
            }
        }
    }
}
</style>
