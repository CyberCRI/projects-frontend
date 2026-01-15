<template>
  <div class="search-bar">
    <input v-model="search" type="search" placeholder="Search a name to filter list" />
  </div>
  <p class="notice">Click on an icon to copy its name</p>
  <div class="wrapper">
    <div v-for="name in displayableName" :key="name" class="cell" @click="copy(name)">
      <div class="icon">
        <IconImage :name="name" />
      </div>
      <div>
        <strong class="name">{{ name }}</strong>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IconImageChoice, ICONS } from '@/functs/IconImage'
import IconImage from '@/components/base/media/IconImage.vue'
import useToasterStore from '@/stores/useToaster'

const toaster = useToasterStore()
const search = ref('')

const NAMES = Object.keys(ICONS) as IconImageChoice[]

const displayableName = computed(() => {
  return NAMES.filter((name) => {
    return name.toLowerCase().includes(search.value.toLowerCase())
  })
})

const copy = async (name) => {
  await navigator.clipboard.writeText(name)
  toaster.pushSuccess(`"${name}" copied to clipboard`)
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.cell {
  border: 1px solid #aaa;
  padding: 1rem;
  text-align: center;
  flex-basis: 10rem;
  flex-shrink: 0;
}

.name {
  font-size: 0.75rem;
}

.notice {
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.search-bar {
  padding: 1rem;
  display: flex;
  justify-content: stretch;
  align-items: center;

  input {
    flex-grow: 1;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #aaa;
  }
}
</style>
