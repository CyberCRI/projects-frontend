<script setup lang="ts">
import type UserPresenceCard from '~/components/base/form/TextEditor/Utils/UserPresenceCard.vue'
import type { CollaborativeUser } from '~/interfaces/tiptap'
import type { WebSocketStatus } from '@hocuspocus/provider'

defineProps<{
  users: CollaborativeUser[]
  status: WebSocketStatus | 'offline'
  onlineAndConnected: boolean
}>()
</script>

<template>
  <div class="editor-socket">
    <div :class="`editor-status editorstatus--${status}`">
      <div v-if="onlineAndConnected" class="list currenteditors">
        <UserPresenceCard
          v-for="user in users"
          :key="user.pid"
          :user="user"
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
