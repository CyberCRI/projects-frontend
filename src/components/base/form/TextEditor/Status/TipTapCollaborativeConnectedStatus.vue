<script setup lang="ts">
import UserPresenceCard from '~/components/base/form/TextEditor/Utils/UserPresenceCard.vue'
import type { CollaborativeUser } from '~/interfaces/tiptap.js'

defineProps<{
  users: CollaborativeUser[]
  status: string
  onlineAndConnected: boolean
}>()
</script>
<template>
  <div class="editor-socket">
    <div :class="`editor-status editorstatus--${status}`">
      <div v-if="onlineAndConnected" class="list currenteditors">
        <UserPresenceCard
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
