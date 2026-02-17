<template>
  <SdgsDrawer
    v-model="selection"
    :is-opened="isOpened"
    :asyncing="asyncing"
    @close="close"
    @confirm="saveSdgs"
  />
</template>

<script>
import { patchProject } from '@/api/projects.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster.ts'
import SdgsDrawer from '@/components/sdgs/SdgsDrawer.vue'

export default {
  name: 'ProjectSdgsDrawer',

  components: { SdgsDrawer },

  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
    sdgs: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['close', 'reload-sdgs'],
  setup() {
    const toaster = useToasterStore()
    return {
      toaster,
    }
  },

  data() {
    return {
      asyncing: false,
      selection: [...this.sdgs],
    }
  },

  watch: {
    isOpened(isOpened) {
      if (isOpened) {
        this.selection = [...this.sdgs]
      }
    },
  },

  methods: {
    async saveSdgs() {
      this.asyncing = true
      const sdgs = this.selection
      try {
        await patchProject(this.project.id, { sdgs })

        analytics.goal.updateSDG(
          this.project.id,
          sdgs.map((sdg) => ({
            id: sdg,
            title: this.$t(`sdg.${sdg}.title`),
          }))
        )

        this.$emit('reload-sdgs')

        this.toaster.pushSuccess(this.$t('toasts.sdgs-update.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.sdgs-update.error')} (${error})`)
        console.error(error)
      } finally {
        this.$emit('close')
        this.asyncing = false
      }
    },

    close() {
      if (this.asyncing) return
      this.$emit('close')
    },
  },
}
</script>
