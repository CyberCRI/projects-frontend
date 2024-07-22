<template>
    <div class="categories-tab">
        <div class="header">
            <div class="notices">
                <p>
                    {{ $t('category.info-organize') }}<br />
                    {{ $t('category.info-limit') }}
                </p>
                <p>
                    {{ $t('category.info-howto') }}
                    (<IconImage class="icon-tip" name="FileTreeOutline" />)
                </p>
            </div>
            <div class="actions">
                <LinkButton
                    btn-icon="Plus"
                    :label="$t('admin.portal.categories.add')"
                    @click="addCategory(null)"
                />
            </div>
        </div>

        <div class="categories-container">
            <LpiLoader v-if="isLoading" class="loader" type="simple" />
            <Sortable
                v-if="categories.length"
                :list="categories"
                :options="dragOptions"
                item-key="id"
                group="categories"
                @end="updateCategoryTree"
                tag="ul"
                data-parent-category=""
            >
                <template #item="{ element: category }">
                    <CategoryAdminElement
                        :key="category.id"
                        :category="category"
                        :data-test="`category-${category.id}`"
                        class="category"
                        @edit-category="editCategory"
                        @add-sub-category="addCategory"
                        @see-category="goToCategory"
                        @update-category-tree="updateCategoryTree"
                    />
                </template>
            </Sortable>
        </div>

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
            :edited-category="editedCategory"
            :parent-category="parentCategory"
            @close-modal="closeCategoryDrawer"
            @submit-category="submitCategory"
        />
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import formatHtml from '@/mixins/formatHtml.ts'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import CategoryAdminElement from '@/components/category/CategoryAdminElement.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import CategoryDrawer from '@/components/category/CategoryDrawer.vue'
import { postProjectCategoryBackground } from '@/api/project-categories.service'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import { toRaw } from 'vue'
import { Sortable } from 'sortablejs-vue3'
export default {
    name: 'CategoriesTab',

    mixins: [formatHtml, imageMixin],

    emits: ['close'],

    components: {
        CategoryAdminElement,
        LpiSnackbar,
        LinkButton,
        CategoryDrawer,
        LpiLoader,
        IconImage,
        Sortable,
    },

    data() {
        return {
            categoryDrawerOpened: false,
            parentCategory: null,
            editedCategory: undefined,
            showMessage: false,
            isUpdating: false,
            editable: true,
            categories: [],
            isLoading: true,
        }
    },

    computed: {
        computedSortedCategories() {
            //            let ret = this.$store.getters['projectCategories/allOrderedByOrderId']
            let ret = this.$store.getters['projectCategories/hierarchy']
                .slice(0)
                .sort((a, b) => a.order_index - b.order_index)
            return ret
        },
        dragOptions() {
            return {
                animation: 200,
                group: 'categories',
                disabled: false,
                ghostClass: 'category-ghost',
            }
        },
    },
    watch: {
        computedSortedCategories: {
            handler(neo) {
                this.isLoading = false
                function rawCategories(categories) {
                    return categories.map((category) => {
                        return {
                            ...toRaw(category),
                            children: category.children ? rawCategories(category.children) : [],
                        }
                    })
                }
                this.categories = rawCategories(neo)
            },
            immediate: true,
        },
    },

    methods: {
        updateCategoryTree(event) {
            console.log('=====================')
            console.log('onDrop')
            // console.log(event)

            console.log('new index', event.newIndex)
            console.log('old index', event.oldIndex)
            console.log('item', event.item)
            console.log('from', event.from)
            console.log('from id', event.from.dataset.parentCategory || null)
            console.log('to', event.to)
            console.log('to id', event.to.dataset.parentCategory || null)

            console.log('=====================')
        },
        addCategory(parentCategory = null) {
            this.editedCategory = null
            this.parentCategory = parentCategory?.id || null
            this.categoryDrawerOpened = true
        },

        editCategory(category) {
            this.editedCategory = category
            this.parentCategory = category.parent
            this.categoryDrawerOpened = true
        },

        closeCategoryDrawer() {
            this.parentCategory = null
            this.editedCategory = null
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
            const data = {
                ...category,
                description: category.description.savedContent,
            }
            let categoryId = category.id
            if (!categoryId) {
                // add
                const result = await this.$store.dispatch(
                    'projectCategories/addProjectCategory',
                    data
                )

                categoryId = result.id
                await this.setImage(data, categoryId)
            } else {
                // edit
                if (category.background_image) await this.setImage(data, categoryId)
            }
            try {
                await this.$store.dispatch('projectCategories/updateProjectCategory', {
                    categoryId,
                    newCategory: data,
                })
                await this.$store.dispatch('projectCategories/getAllProjectCategories')
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
                this.closeCategoryDrawer()
            }
        },

        goToCategory(category) {
            this.$router.push({ name: 'Category', params: { id: category.id } })
        },

        // change(evt) {
        //     this.startIndex = evt.draggedContext.index
        //     this.dropIndex = evt.draggedContext.futureIndex
        // },

        // async onDrop() {
        //     const fromIndex = this.startIndex
        //     const toIndex = this.dropIndex

        //     const draggedElement = this.sortedCategories[fromIndex]

        //     if (fromIndex != toIndex) {
        //         // Set new index to dragged category
        //         const reordered = [{ categoryId: draggedElement.id, index: toIndex }]

        //         // If dragged category index is decreased, increase indexes of categories having a lower index
        //         if (toIndex < fromIndex) {
        //             this.sortedCategories.forEach((element, index) => {
        //                 if (index >= toIndex && index < fromIndex) {
        //                     reordered.push({ categoryId: element.id, index: index + 1 })
        //                 }
        //             })
        //         }

        //         // If dragged category index is increased, decrease indexes of categories having a higher index
        //         else if (toIndex > fromIndex) {
        //             this.sortedCategories.forEach((element, index) => {
        //                 if (index > fromIndex && index <= toIndex) {
        //                     reordered.push({ categoryId: element.id, index: index - 1 })
        //                 }
        //             })
        //         }

        //         try {
        //             await this.$store.dispatch('projectCategories/updateProjectCategoriesOrder', {
        //                 reordered,
        //             })
        //             this.$store.dispatch('notifications/pushToast', {
        //                 message: this.$t('toasts.categories-reorder.success'),
        //                 type: 'success',
        //             })
        //         } catch (error) {
        //             this.$store.dispatch('notifications/pushToast', {
        //                 message: `${this.$t('toasts.categories-reorder.error')} (${error})`,
        //                 type: 'error',
        //             })
        //             console.error(error)
        //         }
        //         this.startIndex = null
        //         this.dropIndex = null
        //     }
        // },

        close() {
            this.showMessage = false
        },
    },
}
</script>

<style lang="scss" scoped>
.categories-tab {
    .header {
        display: flex;
        align-items: flex-start;
        gap: $space-2xl;
        margin-top: $space-xl;
        margin-bottom: $space-2xl;

        .notices {
            flex-basis: 75%;

            p + p {
                margin-top: $space-m;
            }
        }

        .actions {
            flex-basis: 25%;
            display: flex;
            justify-content: flex-end;
        }
    }

    > button {
        margin: 0 auto $space-l;
    }

    svg {
        width: 24px;
        fill: $white;
    }

    .icon-tip {
        width: 1.2em;
        height: 1.2em;
        display: inline-block;
        vertical-align: bottom;
        fill: $primary-dark;
    }

    .categories-container {
        margin: 0 auto;
        width: 30rem;
        display: flex;
        flex-wrap: wrap;
        gap: $space-l;
        justify-content: stretch;
        padding: $space-m;

        > ul {
            flex-grow: 1;
        }
    }
}

.category-ghost {
    background-color: $primary-lighter;
}

.flip-list-move {
    transition: transform 0.5s;
}
</style>
