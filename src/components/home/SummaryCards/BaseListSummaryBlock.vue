<template>
    <div class="summary-block list-summary-block" :class="[nbColsText, { inlined }]">
        <h1 class="uppercase-title">
            {{ $filters.capitalize(title) }}
        </h1>
        <div class="column-wrapper">
            <div class="items-line">
                <slot></slot>
            </div>
            <div class="block-action">
                <slot name="action"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseListSummaryBlock',

    props: {
        title: {
            type: String,
            default: '',
        },

        items: {
            type: Array,
            default: () => [],
        },

        inlined: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        nbCols() {
            return this.items.length
        },

        nbColsText() {
            if (this.nbCols > 2) {
                return 'three-col-wrapper'
            } else if (this.nbCols === 2) {
                return 'two-col-wrapper'
            } else if (this.nbCols === 1) {
                return ['one-col-wrapper']
            } else {
                return 'no-col-wrapper'
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.summary-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: stretch;
    padding-inline: $space-xs;
}

.uppercase-title {
    font-size: $font-size-xs;
    font-weight: normal;
    text-transform: uppercase;
    margin-top: $space-l;
}

.no-col-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.column-wrapper {
    box-sizing: border-box;
    width: 100%;
    background-color: $white;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-s;
    display: flex;
    flex-direction: column;
    margin-block: $space-s;
    padding: $space-m;
    gap: $space-m;
    flex-grow: 1;
}

@media screen and (min-width: $min-tablet) {
    .inlined {
        align-items: center;

        .column-wrapper {
            flex-direction: row;
        }
    }
}

.top-title {
    font-size: $font-size-xs;
    font-weight: 400;
    text-transform: uppercase;
    padding-top: $space-m;
}

.items-line {
    display: flex;
    flex-direction: column;
    width: auto;
    gap: $space-m;
    flex-grow: 1;

    &:empty {
        display: none;
    }
}

.block-action {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    width: auto;
}

.no-col-wrapper .block-action {
    justify-content: center;
    align-items: center;
    width: 100%;
}

@media screen and (min-width: $min-tablet) {
    .uppercase-title {
        margin-top: 0;
        margin-right: $space-l;
    }

    .one-col-wrapper,
    .two-col-wrapper {
        &.inlined {
            flex-direction: row !important;
            padding-inline: $space-xl;
        }
    }

    .inlined {
        &.one-col-wrapper .column-wrapper {
            width: 40%;
        }

        &.two-col-wrapper .column-wrapper {
            width: 70%;
        }

        &.three-col-wrapper .column-wrapper {
            margin-top: $space-m;
        }

        .items-line {
            flex-direction: row;
            width: 80%;

            > :deep(*) {
                flex-basis: 33%;
                flex-grow: 1;
            }
        }

        .block-action {
            justify-content: center;
        }
    }
}
</style>
