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
.column-wrapper {
    width: 100%;
    background-color: $white;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-s;
    display: flex;
    flex-direction: column;
    margin-block: $space-l;
    padding-top: $space-xs;

    @media screen and (min-width: $min-tablet) {
        .inlined & {
            flex-direction: row;
            padding-top: 0;
        }
    }
}

.no-col-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.three-col-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: $space-xs;

    @media screen and (min-width: $min-tablet) {
        padding-inline: $space-xl;
    }
}

.inlined .three-col-wrapper .column-wrapper {
    @media screen and (min-width: $min-tablet) {
        margin-top: $space-m;
    }
}

.one-col-wrapper,
.two-col-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: $space-xs;

    @media screen and (min-width: $min-tablet) {
        .inlined {
            flex-direction: row !important;
            padding-inline: $space-xl;
        }
    }

    .column-wrapper {
        @media screen and (min-width: $min-tablet) {
            padding-top: 0;
        }
    }
}

@media screen and (min-width: $min-tablet) {
    .inlined.one-col-wrapper .column-wrapper {
        width: 40%;
    }

    .inlined.two-col-wrapper .column-wrapper {
        width: 70%;
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

    .one-col-wrapper & {
        @media screen and (min-width: $min-tablet) {
            width: 60%;
        }
    }

    &:empty {
        display: none;
    }
}

@media screen and (min-width: $min-tablet) {
    .inlined .items-line {
        flex-direction: row;
        width: 80%;

        > :deep(*) {
            flex-basis: 33%;
            flex-grow: 1;
        }
    }
}

.block-action {
    display: flex;
    align-items: center;
    width: auto;
    margin-inline: $space-m;
    margin-block: $space-m;
}

@media screen and (min-width: $min-tablet) {
    .inlined .block-action {
        width: 20%;
        justify-content: flex-end;
        margin-left: 0;
        margin-block: 0;
    }
}

.one-col-wrapper .block-action {
    @media screen and (min-width: $min-tablet) {
        width: 40%;
    }
}

.no-col-wrapper .block-action {
    justify-content: center;
    align-items: center;
    width: 100%;
}

.uppercase-title {
    font-size: $font-size-l;
    font-weight: 700;
    text-transform: uppercase;
    color: $primary-dark;
    margin-top: $space-l;

    @media screen and (min-width: $min-tablet) {
        margin-top: 0;
        margin-right: $space-l;
    }
}
</style>
