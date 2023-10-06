<template>
    <div class="group-member-section">
        <div class="team-outer-ctn">
            <SectionHeader
                :button-label="$filters.capitalize($t('common.see-more'))"
                :title="$t('group.the-team', { users: members.length })"
                class="section-header"
                @redirect-button-clicked="goTo"
            />
            <div class="team-ctn">
                <UserItem
                    v-for="member in members.slice(0, totalDisplayed)"
                    :key="member.id"
                    :user="member"
                    class="project-member shadow-drop"
                    @user-click="$emit('user-click', $event)"
                />
            </div>

            <LpiButton
                v-if="members.length > totalDisplayed"
                :label="additionalMembersLabel"
                class="see-more-btn"
                color="primary-dark"
                thin-border
                @click="goTo"
            />
        </div>
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import SectionHeader from '@/pages/ProjectPage/Tabs/shared/SectionHeader.vue'

import UserItem from './UserItem.vue'
import viewportWidth from '@/mixins/viewportWidth.ts'

export default {
    name: 'GroupMemberSection',

    emits: ['user-click'],

    mixins: [viewportWidth],

    components: { LpiButton, UserItem, SectionHeader },

    props: {
        members: {
            type: Array,
            required: true,
        },
    },

    computed: {
        additionalMembersLabel() {
            return this.$t('group.see-more-people-button', {
                users: this.members.length - this.totalDisplayed,
            })
        },

        totalDisplayed() {
            return this.isMobile ? 6 : 8
        },
    },

    methods: {
        goTo() {
            this.$router.push(`/projects/${this.$route.params.slugOrId}/team#tab`)
        },
    },
}
</script>

<style lang="scss" scoped>
.group-member-section {
    // TODO: make the following class a generic class in styles.scss when this component is used in real application,
    // so that we don't rewrite the same styles for each section title
    .group-section-title {
        font-size: $font-size-s;
        font-weight: 700;
        margin-bottom: $space-l;
        color: $primary-dark;
    }

    .team-outer-ctn {
        border-radius: $border-radius-l;
        background: $primary-lighter;
        padding: $space-l $space-m;

        .team-ctn {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: $space-xl;

            .user {
                width: calc(50% - $space-xl);
            }
        }

        .see-more-btn {
            margin: $space-xl auto 0;
        }

        .section-header {
            justify-content: space-around;
        }
    }
}

.project-member {
    cursor: pointer;
}
</style>
