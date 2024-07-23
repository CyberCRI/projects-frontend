<script setup>
import IconImage from '@/components/base/media/IconImage.vue'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import { ref, computed, watch } from 'vue'
import { Sortable } from 'sortablejs-vue3'

const emit = defineEmits([
    'edit-category',
    'add-sub-category',
    'see-category',
    'update-category-tree',
])

const props = defineProps({
    category: {
        type: Object,
        required: true,
    },

    draggedCategory: {
        type: Object,
        default: null,
    },

    dropTargetCategory: {
        type: Object,
        default: null,
    },
})

const hasChildren = computed(() => {
    return props.category.children?.length
})
const showChild = ref(false)

const chevronImage = computed(() => {
    return !hasChildren.value ? 'ChevronRight' : showChild.value ? 'ChevronUp' : 'ChevronDown'
})

const dragOptions = computed(() => {
    return {
        animation: 200,
        group: 'categories',
        disabled: false,
        ghostClass: 'category-ghost',
    }
})

function onDragStart(event) {
    let dragged = event.target.closest('[data-category-id]')
    if (dragged && dragged.dataset.categoryId == props.category.id) {
        showChild.value = false
    }
}

function onDragOver() {
    if (props.draggedCategory && props.category.id != props.draggedCategory.id) {
        showChild.value = true
    }
}

const isDraggedOver = ref(false)

function onDragEnter() {
    isDraggedOver.value = true
}
function onDragLeave() {
    isDraggedOver.value = false
}

watch(
    () => props.dropTargetCategory,
    (newValue) => {
        if (newValue && newValue.id == props.category.id) {
            showChild.value = true
        }
    }
)
</script>
<template>
    <li
        class="sub-list"
        :class="{ 'is-dragged-over': isDraggedOver }"
        @dragstart="onDragStart"
        @dragover="onDragOver"
        :data-category-id="category.id"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
    >
        <div class="top-list">
            <span class="drag-icon">
                <IconImage name="DotsGrid" />
            </span>
            <div class="texts" :class="{ clickable: hasChildren }" @click="showChild = !showChild">
                <div
                    class="icon-td"
                    :class="{
                        'green-color': hasChildren,
                        'grey-color': !hasChildren,
                    }"
                >
                    <IconImage class="icon" :name="chevronImage" />
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
        </div>
        <div class="child-list">
            <Sortable
                :list="category.children"
                :options="dragOptions"
                group="categories"
                tag="ul"
                item-key="id"
                :data-parent-category="category.id"
                @end="emit('update-category-tree', $event)"
            >
                <template #item="{ element: child }">
                    <CategoryAdminElement
                        v-show="showChild"
                        :key="child.id"
                        :category="child"
                        :dragged-category="draggedCategory"
                        :drop-target-category="dropTargetCategory"
                        class="nested-list"
                        @edit-category="emit('edit-category', $event)"
                        @add-sub-category="emit('add-sub-category', $event)"
                        @see-category="emit('see-category', $event)"
                        @update-category-tree="emit('update-category-tree', $event)"
                    />
                </template>
            </Sortable>
        </div>
    </li>
</template>
<style lang="scss" scoped>
.top-list {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid $lighter-gray 1px;
}

.sub-list {
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.is-dragged-over > .child-list > ul {
    // give room to drop even in childless category
    padding-block: 0.5rem;
}

li {
    display: flex;
}

.actions {
    align-self: center;
}

.texts {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
}

.clickable {
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

.category-ghost {
    background-color: $primary-lighter;
}

.flip-list-move {
    transition: transform 0.5s;
}

.drag-icon {
    display: inline-block;
    cursor: move;

    svg {
        width: 1.2em;
        height: 1.2em;
        fill: $mid-gray;
    }
}
</style>
