<template>
    <div class="information-tab">
        <section>
            <EventAdminBlock />

            <NewsAdminBlock />
        </section>
        <section>
            <InstructionAdminBlock />

            <FeaturedProjectAdminBlock />
        </section>
    </div>
</template>

<script>
import EventAdminBlock from '@/components/admin/GeneralAdminBlocks/Events/EventAdminBlock.vue'
import InstructionAdminBlock from '@/components/admin/GeneralAdminBlocks/Instructions/InstructionAdminBlock.vue'
import NewsAdminBlock from '@/components/admin/GeneralAdminBlocks/News/NewsAdminBlock.vue'
import FeaturedProjectAdminBlock from '@/components/admin/GeneralAdminBlocks/FeaturedProject/FeaturedProjectAdminBlock.vue'

export default {
    name: 'NewInformationTab',

    components: {
        EventAdminBlock,
        InstructionAdminBlock,
        NewsAdminBlock,
        FeaturedProjectAdminBlock,
    },
}
</script>

<style lang="scss" scoped>
.information-tab {
    display: flex;
    flex-direction: column;
    padding: $space-xl 0;
}

@media (min-width: $min-desktop) {
    .information-tab {
        align-items: stretch;
        flex-direction: row;
        gap: $space-xl;

        section {
            width: 50%;
        }
    }
}
</style>
