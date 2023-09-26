<template>
    <div class="reason-selection">
        <LpiButton
            v-if="!editedLinkedProject"
            :label="$t('common.back')"
            :border="false"
            class="back-btn"
            @click="$emit('back-to-project-selection')"
        />

        <SmallProjectCard :project="selectedProject" />

        <TextInput v-model="reason" :label="$t('resource.purpose')" />

        <div class="chip-ctn">
            <LpiChip
                v-for="suggestedReason in suggestedReasons"
                :key="suggestedReason"
                :has-right-icon="false"
                :name="suggestedReason"
                @click="selectReason(suggestedReason)"
                :selected="suggestedReason.toUpperCase() === reason.toUpperCase()"
            />
        </div>
    </div>
</template>

<script>
import SmallProjectCard from './SmallProjectCard.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LpiChip from '@/components/lpikit/LpiChip/LpiChip.vue'
import { RESOURCE_PROJECT_CATEGORY } from '@/functs/constants.ts'

export default {
    name: 'ReasonSelection',

    emits: ['back-to-project-selection', 'select-reason'],

    components: {
        LpiChip,
        TextInput,
        SmallProjectCard,
        LpiButton,
    },

    props: {
        editedLinkedProject: {
            type: Object,
            default: null,
        },

        selectedProject: {
            type: Object,
            default: () => {},
        },

        selectedReason: {
            type: String,
            default: null,
        },
    },

    created() {
        if (this.selectedReason) this.reason = this.selectedReason
    },

    data() {
        return {
            reason: '',
            suggestedReasons: RESOURCE_PROJECT_CATEGORY.map((category) =>
                this.$t(`resource-category.${category}`)
            ),
        }
    },

    methods: {
        selectReason(reason) {
            this.reason = reason
        },
    },

    watch: {
        reason: function (val) {
            this.$emit('select-reason', val)
        },
    },
}
</script>

<style lang="scss" scoped>
.reason-selection {
    display: flex;
    flex-direction: column;
    align-items: center;

    .back-btn {
        margin-left: auto;
    }

    .input-ctn {
        margin: $space-l auto;
        width: 100%;
    }

    .chip-ctn {
        display: flex;
        flex-wrap: wrap;
        gap: $space-m;

        .chip {
            cursor: pointer;
        }
    }
}
</style>
