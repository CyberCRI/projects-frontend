<template>
    <div>
        <div class="page-section-medium title-container">
            <h1 class="main-title">{{ organization.dashboard_title }}</h1>
        </div>
        <!-- TODO keepin for testing purpose to remove when all is set -->
        <!--div class="debug" style="background-color: rgba(255, 0, 0, 1); text-align: center">
            <label>
                projects <input v-model="summaryMaxProjects" type="number" min="0" max="3"
            /></label>
            <label>
                events <input v-model="summaryMaxEvents" type="number" min="0" max="3"
            /></label>

            <label>
                insturctions <input v-model="summaryMaxInstructions" type="number" min="0" max="1"
            /></label>
        </div-->
        <div v-if="!isLoading" class="summary-cards" data-test="home-user-header">
            <div class="summary-container page-section-wide">
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
        </div>
        <LpiLoader v-else class="loading" type="simple" />
    </div>
</template>
<script>
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import ProjectSummaryBlock from '@/components/lpikit/SummaryCards/ProjectSummaryBlock.vue'
import EventSummaryBlock from '@/components/lpikit/SummaryCards/EventSummaryBlock.vue'
import InstructionSummaryBlock from '@/components/lpikit/SummaryCards/InstructionSummaryBlock.vue'
import { getAllEvents } from '@/api/event.service'
import { getAllInstructions } from '@/api/instruction.service'
import { searchProjects } from '@/api/projects.service'
export default {
    name: 'HomeHeaderConnected',

    components: {
        ProjectSummaryBlock,
        EventSummaryBlock,
        InstructionSummaryBlock,
        LpiLoader,
    },

    data() {
        return {
            events: [],
            instructions: [],
            summaryMaxEvents: 3,
            summaryMaxProjects: 3,
            summaryMaxInstructions: 1,
            isLoading: true,
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },

        displayableEvents() {
            return this.events?.slice(0, this.summaryMaxEvents) || []
        },

        displayableInstructions() {
            return this.instructions.slice(0, this.summaryMaxInstructions)
        },

        displayableProjects() {
            return this.projects.slice(0, this.summaryMaxProjects)
        },

        loggedIn() {
            return this.$store.getters['users/isLoggedIn']
        },

        numberOfSummaryBlock() {
            let res = 0
            if (this.loggedIn) res++ // my projects block always visible (at leat create project button)
            if (this.displayableEvents.length > 0) res++
            if (this.displayableInstructions.length > 0) res++

            return res
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
                members: [this.$store.getters['users/id']],
                member_role: ['owners', 'members', 'reviewers'],
                organizations: this.$store.getters['organizations/current'].code,
            }
            const response = await searchProjects('', filters)
            this.projects = response.results
        },

        async loadEvents() {
            this.events = (
                await getAllEvents(this.$store.getters['organizations/current']?.code, {
                    ordering: '+event_date',
                    from_date: new Date().toISOString(),
                })
            ).results
        },

        async loadInstructions() {
            this.instructions = (
                await getAllInstructions(this.$store.getters['organizations/current']?.code, {
                    ordering: '+publication_date',
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
        line-height: 1;
        text-align: center;
    }
}

.summary-cards {
    padding-inline: 0;

    .summary-container {
        background-color: $green-lighter;

        @media screen and (min-width: $min-tablet) {
            padding: $space-l;
            display: flex;
            gap: $space-unit;
            align-items: flex-start;

            & > :deep(*) {
                flex-basis: 33%;
                flex-grow: 1;
            }
        }
    }
}
</style>
