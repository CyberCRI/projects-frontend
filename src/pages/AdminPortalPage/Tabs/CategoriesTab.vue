<template>
    <div class="categories-tab">
        <LpiSnackbar class="info-snackbar" icon="QuestionMark" type="info">
            <div v-html="$t('category.info')"></div>
        </LpiSnackbar>

        <div class="categories-container">
            <LpiLoader v-if="isLoading" class="loader" type="simple" />
            <draggable v-if="computedSortedCategories" :list="sortedCategories" :move="change">
                <Category
                    v-for="(category, index) in sortedCategories"
                    :key="category.id"
                    :category="category"
                    :data-test="`category-${category.id}`"
                    class="category"
                    draggable
                    editable
                    size="small"
                    @click="goToCategory(category)"
                    @drop="onDrop($event, index)"
                    @edit-category="editCategory(category)"
                />
            </draggable>
        </div>

        <LpiButton :label="$t('admin.portal.categories.add')" @click="addCategory" />

        <LpiSnackbar
            v-if="showMessage"
            class="snackbar"
            closable
            icon="Check"
            type="success"
            @close="close"
        >
            <div v-html="$t('category.edit-order-success')"></div>
        </LpiSnackbar>

        <CategoryDrawer
            v-if="categoryDrawerOpened"
            :is-opened="categoryDrawerOpened"
            :add-mode="addMode"
            :edited-category="editedCategory"
            @close-modal="closeCategoryDrawer"
            @submit-category="submitCategory"
        />
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import formatHtml from '@/mixins/formatHtml.ts'
import LpiSnackbar from '@/components/lpikit/Snackbar/LpiSnackbar.vue'
import Category from '@/components/lpikit/CategoryCard/CategoryCard.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import CategoryDrawer from '@/components/lpikit/CategoryDrawer/CategoryDrawer.vue'
import { postProjectCategoryBackground } from '@/api/project-categories.service'
import { VueDraggableNext } from 'vue-draggable-next'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'

export default {
    name: 'CategoriesTab',

    mixins: [formatHtml, imageMixin],

    emits: ['close'],

    components: {
        Category,
        LpiSnackbar,
        LpiButton,
        CategoryDrawer,
        draggable: VueDraggableNext,
        LpiLoader,
    },

    data() {
        return {
            addMode: true,
            categoryDrawerOpened: false,
            editedCategory: undefined,
            showMessage: false,
            isUpdating: false,
            editable: true,
            sortedCategories: [],
            isLoading: true,
        }
    },

    computed: {
        computedSortedCategories() {
            let ret = this.$store.getters['projectCategories/allOrderedByOrderId']
                .slice(0)
                .sort((a, b) => a.order_index - b.order_index)
            this.getSortedCategories(ret)
            return ret
        },
    },

    methods: {
        getSortedCategories(ret) {
            this.isLoading = false
            this.sortedCategories = ret
        },
        addCategory() {
            this.addMode = true
            this.categoryDrawerOpened = true
        },

        editCategory(category) {
            this.addMode = false
            this.editedCategory = category
            this.categoryDrawerOpened = true
        },

        closeCategoryDrawer() {
            this.categoryDrawerOpened = false
        },

        async setImage(data, id) {
            if (data.background_image instanceof File && id) {
                const formData = new FormData()
                formData.append('file', data.background_image, data.background_image.name)
                await postProjectCategoryBackground({ id, body: formData })
            }
        },

        async submitCategory(category) {
            const data = { ...category, description: category.description.savedContent }
            let categoryId
            if (this.addMode === true) {
                const result = await this.$store.dispatch(
                    'projectCategories/addProjectCategory',
                    data
                )

                categoryId = result.id
                await this.setImage(data, categoryId)
            } else {
                categoryId = category.id
                if (category.background_image) await this.setImage(data, categoryId)
            }
            try {
                await this.$store.dispatch('projectCategories/updateProjectCategory', {
                    categoryId,
                    newCategory: data,
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.category-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.category-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.categoryDrawerOpened = false
            }
        },

        goToCategory(category) {
            if (!this.editable) {
                this.$emit('close')
                this.$router.push(`/category/${category.id}`)
            }
        },

        change(evt) {
            this.startIndex = evt.draggedContext.index
            this.dropIndex = evt.draggedContext.futureIndex
        },

        async onDrop() {
            const fromIndex = this.startIndex
            const toIndex = this.dropIndex

            const draggedElement = this.sortedCategories[fromIndex]

            if (fromIndex != toIndex) {
                // Set new index to dragged category
                const reordered = [{ categoryId: draggedElement.id, index: toIndex }]

                // If dragged category index is decreased, increase indexes of categories having a lower index
                if (toIndex < fromIndex) {
                    this.sortedCategories.forEach((element, index) => {
                        if (index >= toIndex && index < fromIndex) {
                            reordered.push({ categoryId: element.id, index: index + 1 })
                        }
                    })
                }

                // If dragged category index is increased, decrease indexes of categories having a higher index
                else if (toIndex > fromIndex) {
                    this.sortedCategories.forEach((element, index) => {
                        if (index > fromIndex && index <= toIndex) {
                            reordered.push({ categoryId: element.id, index: index - 1 })
                        }
                    })
                }

                try {
                    await this.$store.dispatch('projectCategories/updateProjectCategoriesOrder', {
                        reordered,
                    })
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.categories-reorder.success'),
                        type: 'success',
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.categories-reorder.error')} (${error})`,
                        type: 'error',
                    })
                    console.error(error)
                }
                this.startIndex = null
                this.dropIndex = null
            }
        },

        close() {
            this.showMessage = false
        },
    },
}
</script>

<style lang="scss" scoped>
.categories-tab {
    .info-snackbar {
        border: 1px solid $primary-dark;
        line-height: $font-size-l;
        margin: $space-l auto;
    }

    > button {
        margin: 0 auto $space-l;
    }

    svg {
        width: 24px;
        fill: $white;
    }

    .categories-container > div {
        display: flex;
        flex-wrap: wrap;
        gap: $space-l;
        justify-content: center;
        padding: $space-m;
    }

    .category {
        cursor: grab;

        &:hover {
            filter: brightness(1.2);
        }
    }
}

.flip-list-move {
    transition: transform 1s;
}
</style>
