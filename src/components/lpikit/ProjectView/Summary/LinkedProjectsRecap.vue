<template>
    <div class="linked-projects-recap">
        <SectionHeader
            :title="$t('project.linked', linkedProjects.length)"
            :button-label="
                $filters.capitalize($t('project.show-n-projects', linkedProjects.length))
            "
            class="section-header"
            @redirect-button-clicked="goToLinkedProjectsView"
            :has-button="linkedProjects.length > 6"
        />

        <LinkedProjects :linked-projects="linkedProjects.slice(0, 6)" />
    </div>
</template>

<script>
import SectionHeader from '@/components/lpikit/ProjectView/shared/SectionHeader.vue'
import LinkedProjects from '@/components/lpikit/LinkedProjects/LinkedProjects.vue'

export default {
    name: 'LinkedProjectsRecap',

    components: {
        SectionHeader,
        LinkedProjects,
    },

    props: {
        linkedProjects: {
            type: Array,
            default: () => [],
        },
    },

    methods: {
        goToLinkedProjectsView() {
            this.$router.push(
                `/projects/${this.$store.getters['projects/currentProjectSlug']}/linked-projects`
            )
        },
    },
}
</script>

<style lang="scss" scoped>
.linked-projects-recap {
    .additionnal-projects {
        border: $border-width-l solid $primary-dark;
        border-radius: $border-radius-l;
        height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: $space-l;
        font-weight: 700;
        font-size: pxToRem(18px);
        color: $primary-dark;
        cursor: pointer;
    }
}
</style>

<style lang="scss">
.linked-projects-recap .section-header .s-button {
    text-transform: uppercase;
}
</style>
