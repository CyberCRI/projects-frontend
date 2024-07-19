<script setup>
import IconImage from '@/components/base/media/IconImage.vue'
import { ref } from 'vue'
const props = defineProps({
    label: { type: String, required: true },
    isToggleable: { type: Boolean, default: false },
    isInitialyOpen: { type: Boolean, default: false },
})

const isOpen = ref(props.isInitialyOpen)
</script>
<template>
    <div class="category-field" :class="{ 'is-toggleable': isToggleable, 'is-open': isOpen }">
        <h4 class="field-label" @click.stop="isOpen = !isOpen">
            <span class="text">{{ label }}</span>
            <span v-if="isToggleable" class="toggle">
                <IconImage :name="isOpen ? 'ChevronUp' : 'ChevronDown'" />
            </span>
        </h4>
        <div class="field-content" v-show="!isToggleable || isOpen">
            <slot> </slot>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.field-label {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: $font-size-m;
    margin-bottom: $space-s;

    .text {
        flex-grow: 1;
        font-weight: 500;
        color: $almost-black;
    }

    .toggle {
        flex-shrink: 0;
        fill: $primary-dark;
        width: 2em;
        height: 2em;
    }
}

.is-toggleable .field-label {
    cursor: pointer;
}
</style>
