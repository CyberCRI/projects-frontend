<template>
  <div class="group-member-section">
    <div class="team-outer-ctn">
      <SectionHeader
        :button-label="capitalize($t('common.see-more'))"
        :title="$t('group.the-team', { users: members.length })"
        class="section-header"
        @redirect-button-clicked="goTo"
      />
      <div class="team-ctn">
        <ProjectMemberItem
          v-for="member in members.slice(0, totalDisplayed)"
          :key="member.id"
          :user="member"
          class="project-member shadow-drop"
          @user-click="$emit('user-click', $event)"
        />
      </div>

      <LpiButton
        v-if="members.length > totalDisplayed"
        :label="additionalMembersLabel"
        class="see-more-btn"
        thin-border
        @click="goTo"
      />
    </div>
  </div>
</template>

<script>
import { capitalize } from 'es-toolkit'

import LpiButton from '@/components/base/button/LpiButton.vue'
import SectionHeader from '@/components/base/SectionHeader.vue'
import useViewportWidth from '@/composables/useViewportWidth.ts'

export default {
  name: 'ProjectMemberSection',

  components: { LpiButton, SectionHeader },

  props: {
    members: {
      type: Array,
      required: true,
    },
  },

  emits: ['user-click'],

  setup() {
    const { isMobile, viewportWidth } = useViewportWidth()
    return { isMobile, viewportWidth, capitalize }
  },

  computed: {
    additionalMembersLabel() {
      return this.$t('group.see-more-people-button', {
        users: this.members.length - this.totalDisplayed,
      })
    },

    totalDisplayed() {
      return this.isMobile.value ? 6 : 8
    },
  },

  methods: {
    goTo() {
      this.$router.push({
        name: 'projectTeam',
        params: { slugOrId: this.$route.params.slugOrId },
        hash: '#tab',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.group-member-section {
  // TODO: make the following class a generic class in styles.scss when this component is used in real application,
  // so that we don't rewrite the same styles for each section title
  .group-section-title {
    font-size: $font-size-s;
    font-weight: 700;
    margin-bottom: $space-l;
    color: $primary-dark;
  }

  .team-outer-ctn {
    border-radius: $border-radius-l;
    background: transparent;
    padding: $space-l $space-m;

    .team-ctn {
      display: grid;
      grid-template-columns: repeat(auto-fill, 200px);
      gap: $space-m;
      justify-content: space-between;

      .project-member {
        width: 100%;
        max-width: 200px;
      }
    }

    .see-more-btn {
      margin: $space-xl auto 0;
    }

    .section-header {
      justify-content: space-between;
    }
  }
}

.project-member {
  cursor: pointer;
}
</style>
