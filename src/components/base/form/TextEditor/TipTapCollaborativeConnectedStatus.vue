<script setup>
import UserCard from './UserPresenceCard.vue'
defineProps({
    status: {
        type: String,
        required: true,
    },
    onlineAndConnected: {
        type: Boolean,
        required: true,
    },
    users: {
        type: Array,
        required: true,
    },
})
</script>
<template>
    <div class="editor-socket">
        <div :class="`editor-status editorstatus--${status}`">
            <div v-if="onlineAndConnected" class="list currenteditors">
                <UserCard
                    v-for="(u, index) in users"
                    :key="index"
                    :user="u"
                    mode="full"
                    size="s"
                    tint="inverse"
                />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.editor-socket {
    align-items: center;
    background: $primary-lighter;
    display: flex;
    justify-content: space-between;
}

.editor-status {
    align-items: center;
    color: $white;
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;

    .list {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }
}
</style>
