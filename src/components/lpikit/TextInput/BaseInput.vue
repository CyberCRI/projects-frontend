<template>
    <div>
        <label v-if="label" :for="id" class="font-bold block">
            {{ label }}
        </label>
        <input
            :id="id"
            :type="type"
            :value="modelValue"
            @input="updateInput"
            class="border w-full p-1"
        />
    </div>
</template>

<script>
export default {
    name: 'BaseInput',

    emits: ['update:model-value'],

    props: {
        id: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        modelValue: {
            type: [String, Number],
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
    },

    methods: {
        updateInput(event) {
            this.$emit('update:model-value', event.target.value)
        },
    },
}
</script>
