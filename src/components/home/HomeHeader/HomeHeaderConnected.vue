<template>
    <div class="home-header-connected">
        <div class="page-section-medium title-container">
            <h1 class="main-title">{{ organization.dashboard_title }}</h1>
        </div>
        <!-- TODO keepin for testing purpose to remove when all is set -->
        <!--div class="debug" style="background-color: rgb(255 0 0 / 100%); text-align: center">
            <label>
                projects <input v-model="summaryMaxProjects" type="number" min="0" max="3"
            /></label>
            <label>
                events <input v-model="summaryMaxEvents" type="number" min="0" max="3"
            /></label>

            <label>
                instructions <input v-model="summaryMaxInstructions" type="number" min="0" max="1"
            /></label>
        </div-->
        <div v-if="!isLoading" class="summary-cards" data-test="home-user-header">
            <div class="summary-container page-section-wide" v-if="!isEmptyDashboard">
                <ProjectSummaryBlock
                    :projects="displayableProjects"
                    :inlined="numberOfSummaryBlock < 2"
                />

                <EventSummaryBlock
                    :events="displayableEvents"
                    v-if="displayableEvents.length"
                    :inlined="numberOfSummaryBlock < 2"
                    @reload-events="loadEvents"
                />
                <InstructionSummaryBlock
                    :instructions="displayableInstructions"
                    v-if="displayableInstructions.length"
                    :inlined="numberOfSummaryBlock < 2"
                    @reload-instructions="loadInstructions"
                />
            </div>
            <div class="empty-dashboard" v-if="isEmptyDashboard">
                <LpiButton
                    :label="$t('home.create-project')"
                    secondary
                    btn-icon="Plus"
                    @click="$router.push({ name: 'createProject' })"
                    class="white-bg"
                    data-test="empty-dashboard-create-project"
                />
            </div>
        </div>
        <LpiLoader v-else class="loading" type="simple" />
    </div>
</template>
<script>
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import ProjectSummaryBlock from '@/components/home/SummaryCards/ProjectSummaryBlock.vue'
import EventSummaryBlock from '@/components/home/SummaryCards/EventSummaryBlock.vue'
import InstructionSummaryBlock from '@/components/home/SummaryCards/InstructionSummaryBlock.vue'
import { getAllEvents } from '@/api/event.service'
import { getAllInstructions } from '@/api/instruction.service'
import { searchProjects } from '@/api/search.service'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'
export default {
    name: 'HomeHeaderConnected',

    components: {
        ProjectSummaryBlock,
        EventSummaryBlock,
        InstructionSummaryBlock,
        LpiLoader,
        LpiButton,
    },
    setup() {
        const organizationsStore = useOrganizationsStore()
        const usersStore = useUsersStore()
        return {
            organizationsStore,
            usersStore,
        }
    },
    data() {
        return {
            events: [],
            projects: [],
            instructions: [],
            summaryMaxEvents: 3,
            summaryMaxProjects: 3,
            summaryMaxInstructions: 1,
            isLoading: true,
        }
    },

    computed: {
        organization() {
            return this.organizationsStore.current
        },

        displayableEvents() {
            return this.events?.slice(0, this.summaryMaxEvents) || []
        },

        displayableInstructions() {
            return this.instructions?.slice(0, this.summaryMaxInstructions)
        },

        displayableProjects() {
            return this.projects?.slice(0, this.summaryMaxProjects)
        },

        loggedIn() {
            return this.usersStore.isLoggedIn
        },

        numberOfSummaryBlock() {
            let res = 0
            if (this.loggedIn) res++ // my projects block always visible (at leat create project button)
            if (this.displayableEvents.length > 0) res++
            if (this.displayableInstructions.length > 0) res++

            return res
        },

        isEmptyDashboard() {
            return (
                !this.displayableProjects.length &&
                !this.displayableEvents.length &&
                !this.displayableInstructions.length
            )
        },
    },

    async mounted() {
        await Promise.all([this.loadProjects(), this.loadEvents(), this.loadInstructions()])

        this.isLoading = false
    },

    methods: {
        async loadProjects() {
            const filters = {
                limit: 3,
                ordering: '-updated_at',
                members: [this.usersStore.id],
                member_role: ['owners', 'members', 'reviewers'],
                organizations: this.organizationsStore.current.code,
            }
            const response = await searchProjects('', filters)
            this.projects = response.results.map((result) => result.project)
        },

        async loadEvents() {
            const todayAtZero = new Date()
            todayAtZero.setHours(0, 0, 0, 0)
            this.events = (
                await getAllEvents(this.organizationsStore.current?.code, {
                    ordering: 'event_date',
                    from_date: todayAtZero.toISOString(),
                    limit: this.summaryMaxEvents,
                })
            ).results
        },

        async loadInstructions() {
            this.instructions = (
                await getAllInstructions(this.organizationsStore.current?.code, {
                    ordering: '-publication_date',
                    to_date: new Date().toISOString(),
                    limit: 1,
                })
            ).results
        },
    },
}
</script>
<style lang="scss" scoped>
.title-container {
    margin-top: $space-3xl;
    margin-bottom: $space-l;
}

.loading {
    display: flex;
    justify-content: center;
    padding-top: $space-l;
}

.main-title {
    font-weight: 700;
    font-size: $font-size-xl;
    text-align: center;

    @media (min-width: $min-tablet) {
        padding-top: $space-m;
        font-weight: 700;
        font-size: $font-size-4xl;
        line-height: $line-height-squashed;
        text-align: center;
    }
}

.summary-cards {
    padding-inline: 0;

    .summary-container {
        background-color: $primary-lighter;

        @media screen and (min-width: $min-tablet) {
            padding: $space-l;
            display: flex;
            gap: $space-unit;
            align-items: stretch;

            & > :deep(*) {
                flex-basis: 33%;
                flex-grow: 1;
            }
        }
    }
}

.empty-dashboard {
    display: flex;
    justify-content: center;
    padding: $space-l 0;
}
</style>
