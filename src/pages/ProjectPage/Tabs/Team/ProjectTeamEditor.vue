<template>
    <div class="project-team-editor">
        <div class="actions">
            <LpiButton
                v-if="canBeRemoved"
                left-icon="Close"
                class="remove-btn"
                size="extra-small"
                @click="$emit('remove-user')"
            />
            <LpiButton
                v-if="canBeEdited"
                left-icon="Pen"
                class="edit-btn"
                size="extra-small"
                @click="$emit('edit-user')"
            />
        </div>
        <div>
            <slot />
        </div>
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'ProjectTeamEditor',

    emits: ['remove-user', 'edit-user'],

    components: {
        LpiButton,
    },

    props: {
        canBeRemoved: {
            type: Boolean,
            default: false,
        },

        canBeEdited: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {}
    },

    methods: {},
}
</script>

<style lang="scss" scoped>
.project-team-editor {
    display: inline-block;
    position: relative;

    .actions {
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        justify-content: flex-end;
        gap: $space-m;
        z-index: 10;
        transform: translate(0, -50%);
    }
}
</style>
