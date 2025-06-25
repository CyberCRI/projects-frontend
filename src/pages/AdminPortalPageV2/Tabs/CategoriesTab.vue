<template>
  <div class="categories-tab">
    <div class="header">
      <div class="notices">
        <p>
          {{ $t('category.info-organize') }}
          <br />
          {{ $t('category.info-limit') }}
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
        tag="ul"
        data-parent-category=""
        @start="onDragStart"
        @end="onDragEnd"
      >
        <template #item="{ element: category }">
          <CategoryAdminElement
            :key="category.id"
            :category="category"
            :dragged-category="draggedCategory"
            :drop-target-category="dropTargetCategory"
            :data-test="`category-${category.id}`"
            class="category"
            @edit-category="editCategory"
            @add-sub-category="addCategory"
            @see-category="goToCategory"
            @update-category-tree="onDragEnd"
            @delete-category="categoryToDelete = $event"
          />
        </template>
      </Sortable>
    </div>
    <div v-if="reOrdering" class="re-ordering-screen">
      <LoaderSimple />
    </div>

    <LpiSnackbar
      v-if="showMessage"
      class="snackbar"
      closable
      icon="Check"
      type="success"
      @close="close"
    >
      <div v-html="$t('category.edit-order-success')" />
    </LpiSnackbar>

    <CategoryDrawer
      v-if="categoryDrawerOpened"
      :is-opened="categoryDrawerOpened"
      :edited-category="editedCategory"
      :parent-category="parentCategory"
      @close-modal="closeCategoryDrawer"
      @submit-category="submitCategory"
    />

    <ConfirmModal
      v-if="categoryToDelete"
      :content="
        $t('admin.portal.categories.delete-category-description', {
          categoryName: categoryToDelete.name,
        })
      "
      :title="$t('admin.portal.categories.delete-category')"
      @cancel="categoryToDelete = null"
      @confirm="deleteCategory"
    />
  </div>
</template>

<script>
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import CategoryAdminElement from '@/components/category/CategoryAdminElement.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import CategoryDrawer from '@/components/category/CategoryDrawer.vue'
import {
  postProjectCategoryBackground,
  patchProjectCategoryBackground,
  deleteProjectCategory,
} from '@/api/project-categories.service'
import { imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import { toRaw } from 'vue'
import { Sortable } from 'sortablejs-vue3'
import { createProjectCategory, patchProjectCategory } from '@/api/project-categories.service'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useProjectCategories from '@/stores/useProjectCategories.ts'
export default {
  name: 'CategoriesTab',

  components: {
    CategoryAdminElement,
    LpiSnackbar,
    LinkButton,
    CategoryDrawer,
    LpiLoader,
    Sortable,
    LoaderSimple,
    ConfirmModal,
  },

  emits: ['close'],
  setup() {
    const toaster = useToasterStore()
    const projectCategoriesStore = useProjectCategories()
    return {
      toaster,
      projectCategoriesStore,
    }
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
      categoryIndex: {},
      isLoading: true,
      reOrdering: false,
      draggedCategory: null,
      dropTargetCategory: null,
      categoryToDelete: null,
    }
  },

  computed: {
    categoryTree() {
      return this.projectCategoriesStore.hierarchy
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
    categoryTree: {
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
        function indexCategories(categories, index) {
          categories.reduce((acc, category) => {
            acc[category.id] = category
            return acc
          }, index)
          categories.forEach((category) => {
            indexCategories(category.children, index)
          })
          return index
        }
        this.categoryIndex = indexCategories(this.categories, {})
      },
      immediate: true,
    },
  },

  methods: {
    onDragStart(event) {
      this.draggedCategory = this.categoryIndex[event.item.dataset.categoryId]
    },
    async onDragEnd(event) {
      const categoryId = event.item.dataset.categoryId
      const oldParentId = event.from.dataset.parentCategory || null
      const newParentId = event.to.dataset.parentCategory || null
      const { oldIndex, newIndex } = event

      const category = this.categoryIndex[categoryId]
      const newParent = this.categoryIndex[newParentId] || null
      const newParentChildren = newParent?.children || this.categories
      const oldParentChildren = this.categoryIndex[oldParentId]?.children || this.categories

      category.order_index = newIndex

      // remove from old parent
      oldParentChildren.splice(oldIndex, 1)
      // add to new parent
      newParentChildren.splice(newIndex, 0, category)

      // some weridness with sortablejs duplicate the item html element
      // if parent are different, so in this case we remove one
      if (oldParentId !== newParentId) event.item.remove()

      try {
        this.reOrdering = true
        // update new parent children
        const newParentPromises = newParentChildren.map(async (child, index) => {
          if (child.id == category.id) {
            return await patchProjectCategory(child.id, {
              order_index: index,
              parent: newParentId,
            })
          } else if (index != child.order_index) {
            return await patchProjectCategory(child.id, { order_index: index })
          } else return Promise.resolve()
        })
        // update old parent children if necessary
        const oldParentPromises =
          oldParentId !== newParentId
            ? oldParentChildren.map(async (child, index) => {
                if (index != child.order_index) {
                  return await patchProjectCategory(child.id, {
                    order_index: index,
                  })
                } else return Promise.resolve()
              })
            : []

        await Promise.all([...newParentPromises, ...oldParentPromises])
        await this.projectCategoriesStore.getAllProjectCategories()
        this.dropTargetCategory = newParent
      } catch (error) {
        console.error(error)
      } finally {
        this.reOrdering = false
        this.draggedCategory = null
        this.$nextTick(() => {
          this.dropTargetCategory = null
        })
      }
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

    async setImage(data, id, imageSizes, imageId) {
      if (data.background_image instanceof File && id) {
        const formData = new FormData()
        formData.append('file', data.background_image, data.background_image.name)
        const res = await postProjectCategoryBackground({ id, body: formData })
        imageId = res.id
      }
      if (imageSizes && id) {
        delete data.background_image
        const formData = new FormData()
        imageSizesFormData(formData, imageSizes)
        await patchProjectCategoryBackground({ id, imageId, body: formData })
      }
    },

    async submitCategory(category) {
      const imageSizes = category.imageSizes || null
      const imageId = category.background_image?.id || null
      const data = {
        ...category,
        // some category have tags for historical reasons
        // api expecty just ids
        tags: category.tags?.map((tag) => tag.id) || [],
      }
      delete data.imageSizes
      let categoryId = category.id
      if (!categoryId) {
        const newCategory = await createProjectCategory(data)
        categoryId = newCategory.id
      } else {
        // edit catgeory
        await patchProjectCategory(categoryId, data)
      }
      await this.setImage(data, categoryId, imageSizes, imageId)

      try {
        // Update order index of children
        await Promise.all(
          category.children.map(async (child, index) => {
            if (index != child.order_index)
              return await patchProjectCategory(child.id, { order_index: index })
            else return Promise.resolve()
          })
        )

        await this.projectCategoriesStore.getAllProjectCategories()
        this.toaster.pushSuccess(this.$t('toasts.category-update.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.category-update.error')} (${error})`)
        console.error(error)
      } finally {
        this.closeCategoryDrawer()
      }
    },

    goToCategory(category) {
      this.$router.push({ name: 'Category', params: { slugOrId: category.slug || category.id } })
    },

    close() {
      this.showMessage = false
    },

    async deleteCategory() {
      if (
        !this.categoryToDelete ||
        this.categoryToDelete.children?.length ||
        this.categoryToDelete.projects_count !== 0
      ) {
        this.toaster.pushError(this.$t('admin.portal.categories.delete-category-has-children'))
        return
      }
      try {
        await deleteProjectCategory(this.categoryToDelete.id)
        this.toaster.pushSuccess(this.$t('admin.portal.categories.delete-category-success'))

        await this.projectCategoriesStore.getAllProjectCategories()
      } catch (err) {
        console.error(err)
        this.toaster.pushError(this.$t('admin.portal.categories.delete-category-error'))
      } finally {
        this.categoryToDelete = null
      }
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

.re-ordering-screen {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-color: rgb(255 255 255 / 50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
