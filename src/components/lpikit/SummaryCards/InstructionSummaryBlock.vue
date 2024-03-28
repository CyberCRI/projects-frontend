<template>
    <BaseListSummaryBlock
        :title="
            instructions.length > 2
                ? $t(`home.short-title.instructions`)
                : $t(`home.long-title.instructions`)
        "
        :items="instructions"
        :inlined="inlined"
    >
        <template #default>
            <InstructionItem
                v-for="instruction in instructions"
                :key="instruction.id"
                :instruction="instruction"
            />
        </template>

        <template #action>
            <SummaryAction
                :to="{ name: 'InstructionListPage' }"
                action-icon="ArrowRight"
                :action-label="$t('feed.see-all')"
            />
        </template>
    </BaseListSummaryBlock>
</template>

<script>
import InstructionItem from '@/components/lpikit/SummaryCards/InstructionItem.vue'
import BaseListSummaryBlock from '@/components/lpikit/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '@/components/lpikit/SummaryCards/SummaryAction.vue'

export default {
    name: 'InstructionSummaryBlock',

    components: { InstructionItem, BaseListSummaryBlock, SummaryAction },

    props: {
        instructions: {
            type: Array,
            default: () => [],
        },
        inlined: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
