<template>
    <SwitchInput v-model="switchValue" :type="type" :label="label" />
</template>

<script>
import SwitchInput from './SwitchInput.vue'

export default {
    name: 'StorybookWrapper',

    components: { SwitchInput },

    data() {
        return {
            switchValue: false,
        }
    },

    props: {
        label: {
            type: String,
            default: null,
        },

        type: {
            type: String,
            default: 'success',
        },
    },
}
</script>
