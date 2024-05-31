<template>
    <div class="announcement">
        <div class="banner">
            <div class="creation-date">{{ $filters.capitalize(createdDateLabel) }}</div>
            <div v-if="!!this.announcement.deadline" class="deadline">
                {{ $filters.capitalize(deadlineLabel) }}
            </div>
            <div v-if="announcement.type && announcement.type !== 'na'" class="type">
                {{ $filters.capitalize($t(`recruit.${announcement.type}`)) }}
            </div>
        </div>

        <div class="title">{{ announcement.title }}</div>

        <div class="description" v-html="announcement.description" />

        <div class="action-buttons" v-if="canEditAndDelete">
            <ContextActionButton
                action-icon="Pen"
                class="udpate-btn"
                @click="$emit('update-announcement')"
            />
            <ContextActionButton
                action-icon="Close"
                class="udpate-btn"
                @click="$emit('open-confirm-modal')"
            />
        </div>

        <div v-if="showApplyAction && !outdated" class="actions">
            <LpiButton
                btn-icon="EmailOutline"
                class="apply-btn"
                :secondary="true"
                :label="$t('recruit.apply')"
                @click="$emit('apply', announcement)"
            />
        </div>
        <div v-if="outdated" class="gradient"></div>
    </div>
</template>

<script>
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import utils from '@/functs/functions.ts'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'AnnouncementItem',

    emits: ['update-announcement', 'open-confirm-modal', 'apply'],

    mixins: [permissions],

    components: {
        LpiButton,
        ContextActionButton,
    },

    props: {
        announcement: {
            type: Object,
            default: () => {},
        },
        showApplyAction: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        canEditAndDelete() {
            return this.canEditProject
        },

        createdDateLabel() {
            return `${this.$t('common.added-on-the')} ${utils.toHDate(
                this.announcement.created_at
            )}`
        },

        deadlineLabel() {
            return `${this.$t('recruit.valid-until-the')} ${utils.toHDate(
                this.announcement.deadline
            )}`
        },

        outdated() {
            return this.announcement.deadline && new Date(this.announcement.deadline) < new Date()
        },
    },
}
</script>

<style lang="scss" scoped>
.announcement {
    position: relative;
    padding: $space-m $space-s;
    border: $border-width-m solid $primary-dark;
    border-radius: $border-radius-m;

    .banner {
        display: flex;
        align-items: center;
        color: $white;
        border-radius: $border-radius-s;
        overflow: hidden;
        border: $border-width-s solid $white;
        font-size: $font-size-xs;
        width: fit-content;

        > div {
            padding: $space-2xs $space-xs;
        }

        .creation-date {
            background: $dark-blue;
        }

        .deadline {
            background: $primary;
        }

        .type {
            background: $primary-dark;
        }
    }

    .title {
        margin: $space-xs 0 $space-s;
        color: $primary-dark;
        font-weight: 700;
        overflow-wrap: break-word;
    }

    .description {
        font-size: $font-size-xs;
    }

    .action-buttons {
        position: absolute;
        top: -20px;
        right: 20px;
        display: flex;
        align-items: center;
        z-index: 1;

        > button:nth-child(2) {
            margin-left: $space-m;
        }
    }

    .gradient {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: $border-radius-m;
    }

    .actions {
        padding-top: $space-m;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>
