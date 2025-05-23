<template>
  <BasicCard
    :to-link="toLink"
    class="project-card"
    :data-test="`project-card-${project.id}`"
    :mode="mode"
    @click="toProject"
  >
    <template #actions-left>
      <IconImage class="icon passive" :name="visibilityIcon" />
    </template>

    <template #actions-right>
      <IconImage
        v-if="showFollowButton"
        class="icon"
        name="HeartOutline"
        tabindex="1"
        @click="updateFollow"
      />
      <IconImage
        v-else-if="showUnfollowButton"
        class="icon"
        name="Heart"
        tabindex="1"
        @click="updateFollow"
      />
      <IconImage v-if="showAddButton" class="icon" name="Plus" @click="$emit('add')" />
      <IconImage
        v-if="showCloseButton"
        class="icon"
        name="CloseCircle"
        @click="$emit('unselect', project)"
      />
      <IconImage
        v-if="customIcon"
        class="icon"
        :name="customIcon"
        @click="$emit('custom-icon-click', project)"
      />
    </template>
    <CroppedApiImage
      :picture-data="project.header_image"
      picture-size="medium"
      default-picture="/placeholders/header_placeholder.png"
      :alt="`${project.title} image`"
      class="picture picture-project"
    />
    <div
      :class="{ 'has-description': project.purpose && project.purpose.length }"
      class="text text-limit"
    >
      <div ref="type" class="card-type">
        <div v-if="project.categories && project.categories.length" class="category-name">
          {{ project.categories[0].name }}
        </div>
      </div>
      <div class="card-title">
        {{ project.title }}
      </div>
      <div :style="{ '-webkit-line-clamp': purposeClamp }" class="card-description">
        {{ project.purpose }}
      </div>
    </div>
  </BasicCard>
</template>

<script>
import BasicCard from '@/components/base/BasicCard.vue'
import followUtils from '@/functs/followUtils.ts'
import IconImage from '@/components/base/media/IconImage.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'ProjectCard',

  components: {
    BasicCard,
    IconImage,
    CroppedApiImage,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },

    hasAddIcon: {
      type: Boolean,
      default: false,
    },

    hasCloseIcon: {
      type: Boolean,
      default: false,
    },
    customIcon: {
      type: String,
      default: '',
    },

    followOnClick: {
      type: Boolean,
      default: false,
    },

    targetUserId: {
      type: [Number, String, null],
      required: false,
      default: null,
    },
    mode: {
      type: String,
      default: 'card', // 'card' or 'list'
    },
  },

  emits: [
    'add',
    'unselect',
    'click',
    'get-info',
    'navigated-away',
    'card-update',
    'custom-icon-click',
  ],

  setup() {
    const usersStore = useUsersStore()
    return {
      usersStore,
    }
  },

  data() {
    return {
      fullProject: null,
      isLoading: true,
      follow: this.project.is_followed,
      imageLoaded: false,
      imageError: false,
    }
  },

  computed: {
    slugOrId() {
      return this.project.slug ? this.project.slug : this.project.id
    },

    toLink() {
      // a to-link attribute make the basic card a NuxtLink
      // witch we dont want when just selecting project
      return this.hasAddIcon || this.hasCloseIcon || this.followOnClick
        ? null
        : `/projects/${this.slugOrId}/summary`
    },

    showFollowButton() {
      return (
        !this.follow.is_followed &&
        !this.hasAddIcon &&
        !this.customIcon &&
        !this.hasCloseIcon &&
        this.usersStore.isConnected
      )
    },

    showUnfollowButton() {
      return (
        !this.hasAddIcon &&
        !this.hasCloseIcon &&
        !this.customIcon &&
        this.follow.is_followed &&
        this.usersStore.isConnected
      )
    },

    showAddButton() {
      return this.hasAddIcon
    },

    showCloseButton() {
      return this.hasCloseIcon
    },

    categorieRoughLines() {
      if (!this.project.categories.length) {
        return 0
      }
      return Math.ceil(this.project.categories[0].name.length / 18)
    },

    titleRoughLines() {
      return Math.ceil(this.project.title.length / 20)
    },

    // show at least on line for purpose
    // as per req of profschercheurs
    // however dont limit to max one line if more space is available
    purposeClamp() {
      // 5 is title default line clamp (see css below)
      // 2 is categorie default line clamp (see css below)
      return Math.max(1, 5 - this.titleRoughLines) + Math.max(0, 2 - this.categorieRoughLines)
    },

    visibilityIcon() {
      const map = {
        public: 'Eye',
        private: 'EyeSlash',
        org: 'PeopleGroup',
      }
      return map[this.project.publication_status] || ''
    },
  },

  methods: {
    toProject() {
      // this is a quick and dirty fix to make whole card clickable for selection
      if (this.hasAddIcon) this.$emit('add')
      else if (this.hasCloseIcon) this.$emit('unselect', this.project)
      else if (this.followOnClick) this.updateFollow()
      else this.$emit('navigated-away')
    },

    async updateFollow() {
      try {
        if (this.follow.is_followed) {
          await followUtils.unfollow({
            follower_id: this.follow.follow_id,
            project_id: this.project.id,
          })
          this.follow.is_followed = false
        } else {
          const result = await followUtils.follow({
            follower_id: this.targetUserId || this.usersStore.id,
            project_id: this.project.id,
          })
          this.follow = result.project.is_followed
        }
        this.$emit('card-update')
      } catch (error) {
        console.error('Error updating follow', error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.category-name,
.card-title,
.card-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-name {
  -webkit-line-clamp: 2; // if you change this change also purposeClamp() computed
  width: 100%;
}

.card-title {
  -webkit-line-clamp: 5; // if you change this change also purposeClamp() computed
}

.card-description {
  -webkit-line-clamp: 1;
}

.icon {
  fill: $primary-dark;
}
</style>
