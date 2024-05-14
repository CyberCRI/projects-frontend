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
                <BadgeItem v-if="item.badge" :label="item.badge" class="user-badge"></BadgeItem>
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
        <a v-else @click="menuAction(item)" class="link">
            <IconImage v-if="item.leftIcon" :name="item.leftIcon" class="icon" />
            {{ item.label }}
        </a>
    </li>
</template>

<script>
import AccordionItem from '@/components/base/AccordionItem.vue'
import BadgeItem from '@/components/base/BadgeItem.vue'
import IconImage from '@/components/base/media/IconImage.vue'

export default {
    name: 'HeaderItemList',

    emits: ['close'],

    components: { IconImage, AccordionItem, BadgeItem },

    props: {
        item: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            isActive: false,
        }
    },

    methods: {
        menuAction(item) {
            this.$emit('close')
            if (item.action) item.action()
            else if (item.to) {
                this.$router.push(item.to)
            }
        },

        setActive(e) {
            this.isActive = e
        },
    },
}
</script>

<style scoped lang="scss">
.list-item {
    padding: $space-xs $space-l;
    text-align: start;
    font-weight: 700;
    font-size: $font-size-m;
    line-height: 18px;
}

.user-badge {
    margin-right: $space-s;
    font-weight: 700;
    font-size: $font-size-xs;
    line-height: 15px;
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
