<template>
    <div
        class="linkcat"
        :class="{
            selected: selected,
        }"
        @click="onClick($event)"
    >
        {{ label }}
    </div>
</template>

<script>
export default {
    name: 'LinkCat',

    emits: ['click'],

    props: {
        selected: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            required: true,
        },
    },

    methods: {
        onClick(event) {
            this.$emit('click', event)
        },
    },
}
</script>

<style lang="scss" scoped>
.linkcat {
    padding: 5px;
    margin: 1px;
    font-size: 10px;
    color: darkgrey;
    background: transparent;
    display: inline-block;
    text-transform: uppercase;
    font-weight: 500;
    border: 1px solid grey;
    cursor: pointer;

    &.big {
        font-size: 13px;
        margin: 2px;
        padding: 8px 10px;
    }

    &:hover {
        color: #00db80;
        border: 1px solid #00db80;
    }

    &.selected {
        background: #00db80;
        border: 1px solid #00db80;
        color: $white;
    }
}
</style>
