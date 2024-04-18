<template>
    <div class="information-tab">
        <section>
            <LogoAdminBlock />

            <BannerAdminBlock />

            <WordingAdminBlock />
        </section>

        <section>
            <EventAdminBlock />

            <InstructionAdminBlock />

            <ChatAdminBlock />

            <NewsAdminBlock />

            <FeaturedProjectAdminBlock />
        </section>
    </div>
</template>

<script>
import EventAdminBlock from '@/components/lpikit/GeneralAdminBlocks/Events/EventAdminBlock.vue'
import InstructionAdminBlock from '@/components/lpikit/GeneralAdminBlocks/Instructions/InstructionAdminBlock.vue'
import NewsAdminBlock from '@/components/lpikit/GeneralAdminBlocks/News/NewsAdminBlock.vue'
import ChatAdminBlock from '@/components/lpikit/GeneralAdminBlocks/Chat/ChatAdminBlock.vue'
import FeaturedProjectAdminBlock from '@/components/lpikit/GeneralAdminBlocks/FeaturedProject/FeaturedProjectAdminBlock.vue'
import WordingAdminBlock from '@/components/lpikit/GeneralAdminBlocks/Wording/WordingAdminBlock.vue'
import LogoAdminBlock from '@/components/lpikit/GeneralAdminBlocks/Pictures/LogoAdminBlock.vue'
import BannerAdminBlock from '@/components/lpikit/GeneralAdminBlocks/Pictures/BannerAdminBlock.vue'

export default {
    name: 'NewInformationTab',

    components: {
        EventAdminBlock,
        InstructionAdminBlock,
        NewsAdminBlock,
        ChatAdminBlock,
        FeaturedProjectAdminBlock,
        WordingAdminBlock,
        LogoAdminBlock,
        BannerAdminBlock,
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
