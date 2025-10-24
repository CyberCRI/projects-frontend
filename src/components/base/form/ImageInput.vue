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
        :label="displayedLabel"
        @click.prevent="$refs?.label?.click()"
      />
    </label>

    <input :id="uniqueId" :ref="uniqueId" type="file" accept="image/*" @change="uploadImage" />
    <p v-if="fileIsTooLarge" class="error-message">
      {{ $t('common.file-too-big', { maxSize: maxSizeMb }) }}
    </p>
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
    maxSizeMb: {
      type: Number,
      default: 2,
    },
  },

  emits: ['upload-image'],

  data() {
    return {
      uniqueId: (Math.random() + 1).toString(36).substring(7),
      fileIsTooLarge: false,
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
      this.fileIsTooLarge = false
      const file = this.$refs[this.uniqueId].files[0]
      if (!file) return
      if (this.maxSizeMb && file.size > this.maxSizeMb * 1024 * 1024) {
        this.fileIsTooLarge = true
      } else {
        this.$emit('upload-image', file)
      }
      event.target.value = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.image-input-ctn {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 1rem;

  input[type='file'] {
    display: none;
  }

  label {
    cursor: pointer;
  }

  .error-message {
    color: $salmon;
    font-weight: bold;
  }
}
</style>
