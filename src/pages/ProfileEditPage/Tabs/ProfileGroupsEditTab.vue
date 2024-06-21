<template>
    <div class="profile-edit-group">
        <div class="form-group">
            <label>
                {{ $t('profile.edit.groups.groups.label') }} ({{ groups ? groups.length : 0 }})
            </label>
            <div class="group-list-list">
                <CardList
                    :desktop-columns-number="4"
                    :is-loading="isLoading"
                    :limit="8"
                    :items="groups"
                >
                    <template #default="groupListSlotProps">
                        <GroupCard
                            v-if="groupListSlotProps.item"
                            :group="groupListSlotProps.item"
                        />
                    </template>
                    <template #empty>
                        <div class="empty-ctn" :class="gridLayout">
                            <EmptyCard class="empty-card" :label="$t('me.no-group')" />
                        </div>
                    </template>
                </CardList>
            </div>
        </div>
    </div>
</template>
<script>
import CardList from '@/components/base/CardList.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import { getGroup } from '@/api/group.service'
import EmptyCard from '@/components/people/UserProfile/EmptyCard.vue'
export default {
    name: 'ProfileGroupsEditTab',
    components: {
        CardList,
        GroupCard,
        EmptyCard,
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            groups: [],
            isLoading: false,
        }
    },

    async mounted() {
        this.isLoading = true
        try {
            this.groups = await Promise.all(
                this.user.people_groups.map(async (group) => {
                    try {
                        return await getGroup(
                            this.$store.state.organizations.current.code,
                            group.id
                        )
                    } catch (error) {
                        console.error(error)
                        return null
                    }
                })
            )
            this.groups = this.groups.filter((group) => !!group)
        } catch (error) {
            console.error(error)
        } finally {
            this.isLoading = false
        }
    },
}
</script>
<style scoped lang="scss">
@import './profile-form';
</style>
