<template>
    <div class="box">
        <IconImage v-if="selected" class="icon" name="CheckBoxOutline" @click="$emit('select')" />
        <IconImage v-else class="icon" name="CheckBoxBlankOutline" @click="$emit('select')" />
        {{ results }} {{ type }}
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'ResultBox',
    emits: ['select'],
    components: {
        IconImage,
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        results: {
            type: Number,
            required: true,
        },
        selected: {
            type: Boolean,
            required: true,
        },
    },
}
</script>

<style scoped lang="scss">
.box {
    display: flex;
    border-radius: 5px;
    padding: 1rem;
    margin: 1rem;
    background-color: $primary-dark;
    width: 150px;
    color: $white;
    font-weight: 700;
    justify-content: center;
}

.icon {
    fill: $primary-dark;
    background-color: $white;
    margin-right: $space-s;
    width: 16px;
    border-radius: 2px;
    cursor: pointer;
}
</style>
