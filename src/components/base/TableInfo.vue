<script setup lang="ts">
type Options = {
  label: string
  description: string
  value?: string | number
}

defineProps<{
  options: Options[]
}>()
</script>

<template>
  <table class="table">
    <tbody>
      <tr v-for="option in options" :key="option.value ?? option.label">
        <td>
          <BadgeItem :label="option.label" colors="primary-dark" />
        </td>
        <td>
          {{ option.description }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  tbody tr {
    border-bottom: $border-width-s solid var(--mid-gray);
  }

  td {
    padding: $space-m;
  }
}
</style>
