<template>
    <div class="project-linked-projects">
        <div class="add-linked-project" v-if="canEditProject">
            <LpiButton
                :label="$filters.capitalize($t('project.add-linked-project'))"
                class="add-linked-project-btn"
                @click="projectLayoutToggleAddModal('linkedProject')"
            />
        </div>
        <LinkedProjects :linked-projects="project ? project.linked_projects : []" />
    </div>
</template>

<script>
import LinkedProjects from '@/components/lpikit/LinkedProjects/LinkedProjects.vue'
import permissions from '@/mixins/permissions.ts'
import ProjectTab from '@/mixins/ProjectTab.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'ProjectLinkedProjectsTab',

    mixins: [permissions, ProjectTab],

    inject: ['projectLayoutToggleAddModal'],

    components: {
        LinkedProjects,
        LpiButton,
    },

    computed: {
        project() {
            return this.$store.getters['projects/project']
        },
    },
}
</script>

<style lang="scss" scoped>
.project-linked-projects {
    padding: $space-xl $space-l;
}

.add-linked-project {
    display: flex;
    justify-content: flex-end;
    padding: $space-l 0;
}
</style>
