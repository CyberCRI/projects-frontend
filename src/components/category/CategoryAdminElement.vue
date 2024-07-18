<script setup>
import IconImage from '@/components/base/media/IconImage.vue'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import { ref } from 'vue'

const emit = defineEmits(['edit-category', 'add-sub-category', 'see-category'])

defineProps({
    category: {
        type: Object,
        required: true,
    },
})
const showChild = ref(false)
</script>
<template>
    <li class="sub-list">
        <div class="top-list">
            <div class="texts" @click="showChildren">
                <div
                    class="icon-td"
                    :class="{
                        'green-color': category.children?.length,
                        clickable: category.children?.length,
                        'grey-color': !category.children?.length,
                    }"
                >
                    <IconImage class="icon" name="ChevronRight" />
                </div>

                <div
                    class="name"
                    :class="{
                        'green-text': category.children?.length,
                        'black-text': !category.children?.length,
                    }"
                >
                    {{ category.name }}
                </div>
            </div>
            <div class="actions">
                <ContextActionMenu>
                    <ContextActionButton
                        action-icon="Pen"
                        class="edit-btn small"
                        secondary
                        no-border
                        @click.stop.prevent="emit('edit-category', category)"
                        :action-label="$t('common.edit')"
                    />

                    <ContextActionButton
                        action-icon="Plus"
                        class="edit-btn small"
                        secondary
                        no-border
                        @click.stop.prevent="emit('add-sub-category', category)"
                        :action-label="$t('category.add-sub-category')"
                    />
                    <ContextActionButton
                        action-icon="Eye"
                        class="edit-btn small"
                        secondary
                        no-border
                        @click.stop.prevent="emit('see-category', category)"
                        :action-label="$t('common.see')"
                    />
                </ContextActionMenu>
            </div>
            <div v-if="category.children && showChild" class="child-list">
                <CategoryAdminElement
                    v-for="child in category.children"
                    :key="child.id"
                    :category="child"
                    class="nested-list"
                    @edit-category="emit('edit-category', $event)"
                    @add-sub-category="emit('add-sub-category', $event)"
                    @see-category="emit('see-category', $event)"
                />
            </div>
        </div>
    </li>
</template>
<style lang="scss" scoped>
.top-list {
    display: flex;
    justify-content: space-between;
    border-bottom: solid $lighter-gray 1px;
}

.sub-list {
    display: flex;
    flex-direction: column;
    width: 100%;
}

li {
    display: flex;
}

.actions {
    align-self: center;
}

.texts {
    display: flex;
    width: 30rem;
    align-items: center;
    cursor: pointer;
}

.child-list {
    padding-left: pxToRem(35px);
}

.nested-list {
    display: flex;
    justify-content: flex-end;
}

.icon-td {
    width: pxToRem(25px);
    padding: 7px;
}

.name {
    padding: $space-unit;
}

.green-color {
    fill: $primary-dark;
}

.clickable {
    cursor: pointer;
}

.grey-color {
    fill: $lighter-gray;
}

.green-text {
    color: $primary-dark;
}

.black-text {
    color: $almost-black;
    font-weight: 400;
}
</style>
