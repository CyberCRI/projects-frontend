<template>
    <div class="tag-label">
        {{ label }}
        <span v-if="isAmbiguous && !hasDisambiguationTerm"
            >&nbsp;{{ $t('search.disambiguate') }}</span
        >
    </div>
</template>

<script>
export default {
    name: 'TagResult',

    props: {
        label: {
            type: String,
            required: true,
        },

        isAmbiguous: {
            type: Boolean,
            required: true,
        },
    },

    computed: {
        hasDisambiguationTerm() {
            return this.label.includes('(disambiguation)') || this.label.includes('(homonymie)')
        },
    },
}
</script>

<style lang="scss" scoped>
.tag-label {
    background: $white;
    border: $border-width-s solid $green;
    border-radius: $border-radius-l;
    display: inline-flex;
    text-align: center;
    padding: $space-s $space-m;
    color: $primary-dark;
    font-size: $font-size-s;
    text-transform: uppercase;
    align-items: center;
}
</style>
