<template>
  <li class="list-item">
    <AccordionItem v-if="item.childItems && item.childItems.length > 0" @is-active="setActive">
      <template #header>
        <IconImage
          v-if="item.leftIcon"
          :name="item.leftIcon"
          class="icon"
          :class="{ 'icon-active': isActive }"
        />
        <BadgeItem v-if="item.badge" :label="item.badge" class="user-badge" />
        <span class="current">{{ item.label }}</span>
      </template>

      <ul>
        <HeaderItemList
          v-for="(childItem, indexItem) in item.childItems"
          :key="indexItem"
          :item="childItem"
          @close="$emit('close')"
        />
      </ul>
    </AccordionItem>
    <a v-else class="link" @click="menuAction(item)">
      <IconImage v-if="item.leftIcon" :name="item.leftIcon" class="icon" />
      {{ item.label }}
    </a>
  </li>
</template>

<script setup lang="ts">
import AccordionItem from '@/components/base/AccordionItem.vue'
import BadgeItem from '@/components/base/BadgeItem.vue'
import IconImage from '@/components/base/media/IconImage.vue'

const props = defineProps<{ item: any }>()

const emit = defineEmits<{ close: [] }>()
const isActive = ref(false)
const router = useRouter()

const menuAction = (item) => {
  emit('close')
  if (props.item.action) {
    item.action()
  } else if (item.to) {
    router.push(item.to)
  }
}

const setActive = (val) => (isActive.value = val)
</script>

<style scoped lang="scss">
.list-item {
  padding: $space-xs $space-l;
  text-align: start;
  font-weight: 700;
  font-size: $font-size-m;
  line-height: $line-height-tight;
}

.user-badge {
  margin-right: $space-s;
  font-weight: 700;
  font-size: $font-size-xs;
}

.icon {
  height: 18px;
  width: 18px;
  fill: $white;
  margin-right: $space-xs;

  &-active {
    fill: $primary-dark;
  }
}

.link {
  display: inline-flex;
  color: $white;
  text-transform: uppercase;
  cursor: pointer;
  padding: 8px;

  &:visited {
    color: $white;
  }
}
</style>
