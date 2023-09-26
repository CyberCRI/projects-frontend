<template>
    <div class="resources-recap">
        <div class="resources-ctn">
            <SectionHeader
                :button-label="$t('common.see-more')"
                :quantity="links.length + files.length"
                :title="$t('project.resource', links.length + files.length)"
                class="section-header"
                @redirect-button-clicked="goToResourcesPage"
            />

            <div class="resources-block">
                <ResourceCount
                    v-if="files.length"
                    :count="files.length"
                    :is-file="true"
                    :target="`/projects/${$route.params.slugOrId}/resources`"
                />

                <ResourceCount
                    v-if="links.length"
                    :count="links.length"
                    :is-file="false"
                    :target="`/projects/${$route.params.slugOrId}/resources`"
                />
            </div>
        </div>
    </div>
</template>

<script>
import SectionHeader from '@/components/lpikit/ProjectView/shared/SectionHeader.vue'
import ResourceCount from '@/components/lpikit/ResourceCount/ResourceCount.vue'

export default {
    name: 'ResourcesRecap',

    components: { SectionHeader, ResourceCount },

    computed: {
        files() {
            return this.$store.getters['projects/project'].files
        },

        links() {
            return this.$store.getters['projects/project'].links
        },
    },

    methods: {
        goToResourcesPage() {
            this.$router.push(`/projects/${this.$route.params.slugOrId}/resources#tab`)
        },
    },
}
</script>

<style lang="scss" scoped>
.resources-recap .resources-ctn {
    display: flex;
    align-items: stretch;
    justify-content: space-evenly;
    flex-direction: column;
    padding: $space-l;
    background: $primary-lighter;
    border-radius: $border-radius-l;

    .section-header {
        justify-content: space-around;
    }

    .resources-block {
        display: flex;
        justify-content: space-evenly;
    }
}
</style>
