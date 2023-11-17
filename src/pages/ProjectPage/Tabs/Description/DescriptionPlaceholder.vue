<template>
    <div class="description-placeholder">
        <p class="text">
            {{ $t('description.placeholder') }}
        </p>

        <LpiButton
            :label="$filters.capitalize($t('description.add'))"
            btn-icon="ArrowRight"
            :reversed-order="true"
            @click="editDescriptionModalActive = !editDescriptionModalActive"
            data-test="add-description-button"
        />

        <DescriptionDrawer
            :is-opened="editDescriptionModalActive"
            :project="project"
            :v-if="editDescriptionModalActive"
            @close="close"
        />
    </div>
</template>

<script>
import DescriptionDrawer from '@/components/lpikit/EditDescriptionDrawer/DescriptionDrawer.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
export default {
    name: 'DescriptionPlaceholder',

    components: {
        DescriptionDrawer,
        LpiButton,
    },

    props: {
        project: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            editDescriptionModalActive: false,
        }
    },

    methods: {
        close() {
            this.editDescriptionModalActive = !this.editDescriptionModalActive
        },
    },
}
</script>

<style lang="scss" scoped>
.description-placeholder {
    background: $primary-lighter;
    border-radius: $border-radius-l;
    padding: $space-l;
    display: flex;
    flex-direction: column;
    align-items: center;

    .text {
        margin-bottom: $space-l;
    }
}
</style>
