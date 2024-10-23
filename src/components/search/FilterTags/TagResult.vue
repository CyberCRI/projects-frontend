<template>
    <div class="tag-label" :data-test="`tag-label-${label}`">
        <span class="tag-name">{{ label }}</span>
        <span class="tag-description">{{ description }}</span>
    </div>
</template>

<script>
import useLanguagesStore from '@/stores/useLanguages'
export default {
    name: 'TagResult',

    setup() {
        const languagesStore = useLanguagesStore()
        return {
            languagesStore,
        }
    },

    props: {
        label: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: '',
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
    border: $border-width-s solid $primary;
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
