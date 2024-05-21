<template>
    <div>
        <LoaderSimple v-if="type === 'simple'" />
        <LoaderComplex v-if="type === 'complex'" />
    </div>
</template>

<script>
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import LoaderComplex from '@/components/base/loader/LoaderComplex.vue'

export default {
    name: 'LpiLoader',

    components: {
        LoaderSimple,
        LoaderComplex,
    },

    props: {
        type: {
            type: String,
            required: true,
            validator(value) {
                return ['simple', 'complex'].includes(value)
            },
        },
    },
}
</script>
