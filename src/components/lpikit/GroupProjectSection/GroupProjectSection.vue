<template>
    <div class="group-project-section">
        <div class="group-section-title">
            {{ $t('group.projects-title', { quantity: projects.length }) }}
        </div>

        <div class="projects-ctn">
            <ProjectCard
                v-for="project in projects.slice(0, totalDisplayed)"
                :key="project.id"
                :project="project"
            />

            <LpiButton
                :label="seeMoreProjectsButton"
                right-icon="ArrowRight"
                color="primary-dark"
                thin-border
                class="see-more-projects-btn"
            />
        </div>
    </div>
</template>

<script>
import viewportWidth from '@/mixins/viewportWidth.ts'
import ProjectCard from './ProjectCard.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'GroupProjectSection',

    components: { ProjectCard, LpiButton },

    mixins: [viewportWidth],

    data() {
        return {
            projects: [
                {
                    id: '1',
                    name: 'Open Panthéon',
                    purpose: 'Célébrons les figures inspirantes du passé dans le monde entier !',
                    categories: [{ name: 'Research project' }],
                    life_status: 'ongoing',
                },
                {
                    id: '2',
                    name: 'Challenge Institute / Institut des défis',
                    purpose: 'Let’s imagine the new model for a learning university',
                    life_status: 'ongoing',
                },
                {
                    id: '3',
                    name: 'Make our IT infrastructure more robust again',
                    purpose: 'Provision our infrastructure using Infra-As-Code tools.',
                    categories: [{ name: 'Student project' }],
                    life_status: 'finished',
                },
                {
                    id: '4',
                    name: 'Make our IT infrastructure more robust again',
                    purpose: 'Provision our infrastructure using Infra-As-Code tools.',
                    categories: [{ name: 'Research project' }],
                    life_status: 'ongoing (60%)',
                },
                {
                    id: '5',
                    name: 'Test 1',
                    purpose: 'Provision our infrastructure using Infra-As-Code tools.',
                    categories: [{ name: 'Research project' }],
                    life_status: 'ongoing',
                },
                {
                    id: '6',
                    name: 'Test 2',
                    purpose: 'Provision our infrastructure using Infra-As-Code tools.',
                    categories: [{ name: 'Research project' }],
                    life_status: 'ongoing',
                },
            ],
        }
    },

    computed: {
        seeMoreProjectsButton() {
            return this.$t('group.see-more-projects-button', {
                quantity: this.projects.length - this.totalDisplayed,
            })
        },

        totalDisplayed() {
            return this.isMobile ? 3 : 4
        },
    },
}
</script>

<style lang="scss" scoped>
.group-project-section {
    // TODO: make the following class a generic class in styles.scss when this component is used in real application,
    // so that we don't rewrite the same styles for each section title
    .group-section-title {
        font-size: $font-size-2xl;
        font-weight: 700;
        margin-bottom: $space-l;
    }

    .projects-ctn {
        display: flex;
        flex-direction: column;
        gap: $space-m;

        .see-more-projects-btn {
            align-self: center;
        }
    }
}
</style>
