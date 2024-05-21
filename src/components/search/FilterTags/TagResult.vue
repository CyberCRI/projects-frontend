<template>
    <div class="tag-label" :data-test="`tag-label-${label}`">
        <span class="tag-name">{{ label }}</span>
        <span class="tag-description">{{ description }}</span>
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

        description: {
            type: String,
            default: '',
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
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.8rem;
    background: $white;
    border: $border-width-s solid $green;
    border-radius: $border-radius-l;
    padding: $space-s $space-m;
    color: $primary-dark;
    font-size: $font-size-m;
}

.tag-name {
    text-transform: uppercase;
}

.tag-description {
    font-size: 0.7em;
}
</style>
