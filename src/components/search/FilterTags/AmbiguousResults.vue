<template>
    <div class="ambiguous-ctn" :class="{ inline }">
        <h4 class="ambiguous-term">
            <IconImage
                class="back"
                name="ArrowLeft"
                v-if="inline"
                @click="$emit('go-back-to-results')"
            />
            {{ ambiguousTerm }}
        </h4>
        <div class="subtitle">
            {{ $t('search.subtitle-ambiguous-tag') }}
        </div>
        <div class="ambiguous-results-ctn">
            <div
                v-for="(tag, index) in ambiguousResults"
                :key="`${tag.title}-${index}`"
                class="tag-result"
                tabindex="0"
                @click="emitFormattedResult(tag)"
            >
                <div class="tag-label">{{ `${tag.title} #${index + 1}` }}</div>
                <div class="tag-description">
                    {{
                        tag.extract
                            ? tag.extract
                            : tag.terms && tag.terms.description
                              ? tag.terms.description[0]
                              : ''
                    }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'

export default {
    name: 'AmbiguousResults',

    emits: ['result-clicked', 'go-back-to-results'],

    components: { IconImage },

    props: {
        ambiguousTerm: {
            type: String,
            required: true,
        },
        ambiguousResults: {
            type: Array,
            default: () => [],
        },
        inline: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        emitFormattedResult(result) {
            this.$emit('result-clicked', { ...result, name: result.title })
        },
    },
}
</script>

<style lang="scss" scoped>
.ambiguous-results-ctn {
    margin-top: $space-s;
    width: 100%;
    padding: $space-l $space-l $space-l $space-l;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: $space-m;
    box-sizing: border-box;

    > * {
        flex: 1 1 calc(50% - $space-m);
    }

    .tag-result {
        cursor: pointer;
        padding: $space-l;
        background: $green-lighter;
        border-radius: $border-radius-m;
        text-align: center;

        & + .tag-result {
            margin-top: $space-m;
        }

        .tag-label {
            background: $white;
            border: $border-width-s solid $green;
            border-radius: $border-radius-l;
            display: inline-block;
            text-align: center;
            padding: $space-s $space-m;
            color: $primary-dark;
            font-size: $font-size-s;
            text-transform: uppercase;
            margin-bottom: $space-l;
        }

        .tag-description {
            text-align: start;
            font-weight: 400;
            font-size: $font-size-s;
            margin-top: $space-s;
            display: block;
        }
    }
}

.ambiguous-ctn {
    border-radius: $border-radius-l;
    margin-bottom: $space-xs;

    .subtitle {
        padding: 0 $space-l;
    }

    .ambiguous-term {
        text-align: center;
        font-size: $font-size-m;
        font-weight: 700;
        margin: $space-l;
    }

    &.inline .ambiguous-term {
        padding: 0 $space-l;
        position: relative;
    }

    .back {
        position: absolute;
        left: 0;
        bottom: 0;
        cursor: pointer;
        width: $space-l;
        fill: $primary-dark;
    }

    .ambiguous-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;

        svg {
            height: 18px;
            fill: $primary-dark;
            transform: rotate(-90deg);
            margin-right: $space-s;
        }

        span {
            font-size: $font-size-m;
            font-weight: 700;
            color: $primary-dark;
        }
    }
}
</style>
