<template>
    <div
        :class="{ 'sdg--unselected': !selected }"
        :style="{ 'background-image': `url(${PUBLIC_BINARIES_PREFIX}/sdgs/${lang}/${sdgId}.svg)` }"
        class="sdg"
        @click="toggle"
        :data-test="`sdg-${sdgId}`"
    >
        <IconImage v-if="selected" class="check-icon" name="Check" />
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'

export default {
    name: 'SdgIcon',
    emits: ['toggled'],
    mixins: [imageMixin],
    components: { IconImage },
    props: {
        sdgId: {
            type: [Number, String],
            required: true,
        },

        selected: {
            type: Boolean,
            required: true,
        },
    },

    methods: {
        toggle() {
            this.$emit('toggled', this.sdgId)
        },
    },

    computed: {
        lang() {
            return this.$store.getters['languages/current']
        },
    },
}
</script>

<style lang="scss" scoped>
/* We use box-shadow to mimic borders
** so when a filter is selected
** the other do not move due the pixel diff
*/

.sdg {
    display: inline-block;
    width: pxToRem(96px);
    height: pxToRem(96px);
    border-radius: $border-radius-xs;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    cursor: pointer;
    box-shadow: 0 0 0 $border-width-l $primary-dark;
    position: relative;

    &--unselected {
        box-shadow: none;
    }

    .check-icon {
        position: absolute;
        width: pxToRem(20px);
        height: pxToRem(20px);
        top: -14px;
        right: 8px;
        fill: $primary-dark;
        background: white;
        border: $border-width-s solid $primary-dark;
        border-radius: $border-radius-50;
    }
}
</style>
