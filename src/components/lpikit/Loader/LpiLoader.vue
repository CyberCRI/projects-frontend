<template>
    <div>
        <LoaderSimple v-if="type === 'simple'" />
        <LoaderComplex v-if="type === 'complex'" />
    </div>
</template>

<script>
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import LoaderComplex from '@/components/lpikit/Loader/LoaderComplex.vue'

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
