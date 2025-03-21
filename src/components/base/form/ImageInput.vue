<template>
  <div class="image-input-ctn">
    <label ref="label" :for="uniqueId" class="image-button" data-test="upload-image-button">
      <LinkButton
        v-if="isLink"
        v-disable-focus="unfocusable"
        btn-icon="Upload"
        :label="displayedLabel"
        @click.prevent="$refs?.label?.click()"
      />

      <LpiButton
        v-else
        v-disable-focus="unfocusable"
        btn-icon="Upload"
        secondary
        :label="displayedLabel"
        @click.prevent="$refs?.label?.click()"
      />
    </label>

    <input :id="uniqueId" :ref="uniqueId" type="file" @change="uploadImage" />
  </div>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'

export default {
  name: 'ImageInput',

  components: {
    LpiButton,
    LinkButton,
  },

  props: {
    existingImage: {
      type: String,
      default: null,
    },
    unfocusable: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: null,
    },
    isLink: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['upload-image'],

  data() {
    return {
      uniqueId: (Math.random() + 1).toString(36).substring(7),
    }
  },

  computed: {
    displayedLabel() {
      return this.label
        ? this.label
        : this.existingImage
          ? this.$t('picture.change-picture')
          : this.$t('picture.add-picture')
    },
  },

  methods: {
    uploadImage(event) {
      this.$emit('upload-image', this.$refs[this.uniqueId].files[0])
      event.target.value = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.image-input-ctn {
  width: fit-content;

  input[type='file'] {
    display: none;
  }

  label {
    cursor: pointer;
  }
}
</style>
