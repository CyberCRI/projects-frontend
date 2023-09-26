<template>
    <DatePicker v-model="value" />
</template>

<script>
import DatePicker from './DatePicker.vue'

export default {
    name: 'StorybookWrapper',

    components: { DatePicker },

    data() {
        return {
            value: '',
        }
    },
}
</script>
