<template>
    <div class="group-summary">
        <div class="members-and-projects">
            <GroupMemberSection />
            <GroupProjectSection class="project-section" />
        </div>
        <GroupLinkedGroupSection />
        <GroupRecommandationSection />
        <GroupResourceSection />
    </div>
</template>

<script>
import GroupMemberSection from '@/components/lpikit/GroupMemberSection/GroupMemberSection.vue'
import GroupProjectSection from '@/components/lpikit/GroupProjectSection/GroupProjectSection.vue'
import GroupLinkedGroupSection from '@/components/lpikit/GroupLinkedGroupSection/GroupLinkedGroupSection.vue'
import GroupRecommandationSection from '@/components/lpikit/GroupRecommandationSection/GroupRecommandationSection.vue'
import GroupResourceSection from '@/components/lpikit/GroupResourceSection/GroupResourceSection.vue'

export default {
    name: 'GroupSummaryLayout',

    components: {
        GroupMemberSection,
        GroupProjectSection,
        GroupLinkedGroupSection,
        GroupRecommandationSection,
        GroupResourceSection,
    },
}
</script>

<style lang="scss" scoped>
.group-summary {
    display: flex;
    flex-direction: column;
    gap: $space-xl;

    .project-section {
        margin-top: $space-xl;
    }
}

@media screen and (min-width: $max-tablet) {
    .group-summary {
        .members-and-projects {
            display: flex;
            gap: $space-xl;

            > * {
                width: calc(50% - $space-xl);
            }
        }

        .project-section {
            margin-top: 0;
        }
    }
}
</style>
