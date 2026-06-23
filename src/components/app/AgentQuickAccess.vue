<script lang="ts" setup>
type SpecialAgent = {
  id: number
  slug: string
  title: string
  description: string
  $t: {
    title: string
    description: string
  }
}
withDefaults(
  defineProps<{
    agentList?: SpecialAgent[]
    title: string
  }>(),
  {
    agentList: () => [],
  }
)
</script>
<template>
  <details v-if="agentList.length" class="special-agents-access">
    <summary>{{ title }}</summary>
    <ul>
      <li v-for="specialAgent in agentList" :key="specialAgent.id">
        <LinkButton
          btn-icon="ArrowUpRightFromSquare"
          :label="specialAgent.$t.title"
          :title="specialAgent.$t.description?.replace(/<[^>]*?>/gim, '')"
          :to="{ name: 'AgentPage', params: { agentSlug: specialAgent.slug } }"
        />
      </li>
    </ul>
  </details>
</template>
<style lang="scss" scoped>
.special-agents-access {
  text-align: right;
  margin-bottom: 1rem;

  summary {
    color: $primary-dark;
    font-size: 1.2em;
    cursor: pointer;
    font-weight: bold;
  }

  &:open summary {
    text-decoration: underline;
  }

  .link-button {
    margin-top: 0.8rem;
    width: max-content;
    margin-left: auto;
  }
}
</style>
