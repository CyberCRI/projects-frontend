<template>
    <div class="empty-card">
        <slot>
            <p class="empty-label">{{ label }}</p>
        </slot>
    </div>
</template>
<script>
export default {
    name: 'EmptyCard',

    props: {
        label: {
            type: String,
            default: '',
        },
    },
}
</script>
<style scoped lang="scss">
// same as src/components/peopleKit/BasicCard.vue except for border color and justify content
.empty-card {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-around;
    height: $card_height;
    width: $card_width;
    border: $border-width-s solid $gray-4;
    border-radius: $border-radius-m;
    text-align: center;
    background: $white;
    overflow: hidden;
}

.empty-label {
    text-align: center;
    color: $gray-8;
    font-weight: 700;
    font-size: $font-size-s;
}
</style>
