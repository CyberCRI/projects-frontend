<template>
  <VueDatepickerUi
    v-model="model"
    :position="position"
    lang="en"
    :placeholder="$t('common.chose-date')"
  />
</template>

<script>
import VueDatepickerUi from 'vue-datepicker-ui'

export default {
  name: 'DatePicker',

  components: { VueDatepickerUi },

  props: {
    value: {
      type: String || Date || Array,
      default: '',
    },

    position: {
      type: String,
      default: 'left',
    },
  },

  emits: ['input'],

  computed: {
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>
<style lang="scss">
.v-calendar .content {
  cursor: pointer;
}
</style>
