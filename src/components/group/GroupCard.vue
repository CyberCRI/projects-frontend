<template>
  <BasicCard
    :group="group"
    :to-link="toLink"
    :data-test="`group-card-${group.name}`"
    :mode="mode"
    @click="toGroupPage"
  >
    <template #actions-right>
      <IconImage v-if="group.email" class="icon" name="EmailOutline" @click="mailTo" />
      <IconImage v-if="showAddButton" class="icon" name="Plus" @click="$emit('add')" />
      <IconImage
        v-if="showCloseButton"
        class="icon"
        name="CloseCircle"
        @click="$emit('unselect', group)"
      />
    </template>

    <CroppedApiImage
      :alt="`${group.name} image`"
      class="picture picture-group"
      :picture-data="group.header_image"
      picture-size="medium"
      default-picture="/placeholders/user_placeholder.svg"
    />

    <div class="text text-limit">
      <div v-if="group.members_count !== undefined" class="group-count">
        <IconImage name="MultiplePerson" class="icon" />
        {{ group.members_count }}
      </div>
      <div class="card-type">
        {{ translatedName }}
      </div>
      <p v-html="translatedShortDescription" />
    </div>

    <template v-if="hasSubGroupsLink" #footer>
      <div class="subgroups-link" @click.prevent="gotoSubgroup(group)">
        {{ $t('group.see-subgroups', group.children.length) }}
        <IconImage class="arrow" name="ArrowRight" />
      </div>
    </template>
  </BasicCard>
</template>

<script>
import BasicCard from '@/components/base/BasicCard.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

export default {
  name: 'GroupCard',

  components: {
    BasicCard,
    IconImage,
    CroppedApiImage,
  },

  props: {
    group: {
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
    hasSubGroupsLink: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'card', // 'card' or 'list'
    },
  },

  emits: ['add', 'unselect', 'click', 'navigated-away'],

  setup(props) {
    const { getTranslatableField } = useAutoTranslate()
    const translatedName = getTranslatableField(props.group, 'name')
    const translatedShortDescription = getTranslatableField(props.group, 'short_description')

    return {
      translatedName,
      translatedShortDescription,
    }
  },

  computed: {
    showAddButton() {
      return this.hasAddIcon
    },

    showCloseButton() {
      return this.hasCloseIcon
    },

    toLink() {
      // a to-link attribute make the basic card a NuxtLink
      // witch we dont want when just selecting project
      return this.hasAddIcon
        ? null
        : { name: 'Group', params: { groupId: this.group.slug || this.group.id } }
    },
  },

  methods: {
    mailTo() {
      document.location.href = `mailto:${this.group.email}`
    },

    toGroupPage() {
      // this is a quick and dirty fix to make whole card clickable for selection
      if (this.hasAddIcon) this.$emit('add')
      else this.$emit('navigated-away')
    },

    gotoSubgroup(group) {
      this.$router.push({ name: 'Groups', params: { groupId: group.id } })
    },
  },
}
</script>

<style lang="scss" scoped>
.group-count {
  display: flex;
  font-weight: 700;
  font-size: $font-size-xs;
  color: $primary-dark;
  align-items: center;

  .icon {
    fill: $primary-dark;
    margin-right: $space-s;
    width: 16px;
  }
}

.card .group-count {
  margin-top: $space-s;
  justify-content: center;
}

.card-type {
  font-weight: 700;
  font-size: $font-size-m;
  color: $almost-black;
}

.subgroups-link {
  background-color: $primary-dark;
  color: $white;
  font-weight: bold;
  text-align: center;
  justify-self: end;
  padding: $space-xs $space-s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $layout-size-xs;
  cursor: pointer;
  font-size: $font-size-xs;

  .arrow {
    fill: $white;
    height: $layout-size-s;
    width: $layout-size-s;
  }
}
</style>
