<template>
    <div class="basic-card shadow-box" tabindex="1">
        <div class="action-left-wrapper">
            <slot name="actions-left" />
        </div>
        <div class="action-right-wrapper">
            <slot name="actions-right" />
        </div>

        <component
            class="card-inner"
            :is="toLink ? 'router-link' : 'div'"
            :to="toLink"
            @click="$emit('click')"
        >
            <!-- Content -->
            <div class="content">
                <slot></slot>
            </div>
            <!-- Footer -->
            <slot name="footer"> </slot>
        </component>
    </div>
</template>

<script>
export default {
    name: 'BasicCard',

    emits: ['click'],

    props: {
        toLink: {
            type: [String, Object],
            default: null,
        },
    },
}
</script>

<style lang="scss" scoped>
.basic-card {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
    height: $card_height;
    width: $card_width;
    border: $border-width-s solid $green;
    border-radius: $border-radius-m;
    text-align: center;
    background: $white;
    overflow: hidden;

    .card-inner {
        display: flex;
        flex-flow: column;
        flex-grow: 1;
    }
}

:deep(.picture) {
    $picture-width: 72px;

    display: flex;
    width: pxToRem($picture-width);
    height: pxToRem($picture-width);
    border-radius: $border-radius-xs;
    box-shadow: 0 0 2px rgb(0 0 0 / 15%);
}

:deep(.picture-user) {
    $picture-width: 110px;

    width: pxToRem($picture-width);
    height: pxToRem($picture-width);
}

:deep(.picture-project) {
    $picture-width: 86px;

    width: pxToRem($picture-width);
    height: pxToRem($picture-width);
}

:deep(.picture-group) {
    border-radius: 50%;
    width: pxToRem(90px);
    height: pxToRem(90px);
}

:deep(.card-title) {
    margin-top: $space-s;
    font-weight: 700;
    font-size: $font-size-m;
    line-height: 18px;
    text-transform: capitalize;
    width: 100%;
}

:deep(.card-type) {
    font-weight: 700;
    font-size: $font-size-xs;
    line-height: 18px;
    text-transform: uppercase;
    color: $green-dark;
    margin-top: $space-s;
}

:deep(.content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-m $space-m 0 $space-m;
    height: 100%;
    cursor: pointer;
}

:deep(.content--open) {
    align-items: start;
    text-align: start;
    display: block;
    word-break: break-word;
    overflow: hidden auto;
}

:deep(.text-limit) {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
}

:deep(.description) {
    margin-top: $space-m;
    font-size: $font-size-s;
    line-height: 18px;
    width: 100%;
}

:deep(.card-description) {
    margin-top: $space-xs;
    font-size: $font-size-s;
    line-height: 18px;
}

:deep(.action-right-wrapper),
:deep(.action-left-wrapper) {
    position: absolute;
    top: 12px;
    display: flex;
    flex-flow: column nowrap;
    gap: $space-m;

    // don't block click on card despite we are not a child of it and absolutely positioned above
    // (however this doesnt prevent click on icons, see .icon.passive below for that)
    pointer-events: none;
}

:deep(.action-right-wrapper) {
    right: 12px;
}

:deep(.action-left-wrapper) {
    left: 12px;
}

:deep(.icon) {
    width: 24px;
    height: 24px;
    fill: $primary-dark;
    cursor: pointer;
    pointer-events: auto; // overide passive wrapper

    &.passive,
    &.passive * {
        // otherwise svg and its subnodes will also block event
        pointer-events: none;
    }
}

:deep(.icon--fixed-dot) {
    bottom: 0;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -25%);
}

:deep(.link-button) {
    font-size: $font-size-s;
}
</style>
