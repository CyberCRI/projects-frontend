<template>
    <div
        v-if="(data.number && data.number > 0) || !data.number"
        class="info-sentence"
        :class="[
            {
                'all-bold': allBold,
                'all-plain': allPlain,
                flow: flow,
                inline: inline,
                black: black,
                cloud: cloud,
            },
        ]"
    >
        <div class="first-part">
            <img
                v-if="cloud"
                class="icon"
                :class="size"
                :src="`${this.PUBLIC_BINARIES_PREFIX}/${data.icon}`"
            />
            <IconImage v-else class="icon" :name="data.icon" />
            <div class="text">
                <div v-if="data.info1" class="no-badge">
                    <span class="title">
                        {{ $t(data.title) }}
                    </span>
                    <span>:&nbsp;</span>
                    <span v-for="(item, index) in data.info1" :key="index" class="info">
                        {{ item }}
                    </span>
                    <span v-if="data.title2" class="info"> &nbsp; - &nbsp;</span>
                    <span v-if="data.title2"> {{ $t(data.title2) }}</span>
                    <span v-if="data.info2"> :&nbsp;</span>
                    <span v-if="data.info2" class="info"> {{ data.info2 }}</span>
                    <span v-if="data.title3" class="info"> &nbsp; - &nbsp;</span>
                </div>
                <div v-else>
                    <span v-if="data.preTitle" class="title">
                        {{ $t(data.preTitle) + data.number + $t(data.title) }}
                        <span> : &nbsp;</span>
                    </span>
                    <span v-else-if="data.number" class="title">
                        {{ data.number + $t(data.title) }}
                        <span> : &nbsp;</span>
                    </span>
                    <span v-else-if="data.title" class="title">
                        {{ $t(data.title) }}
                    </span>
                </div>
            </div>
        </div>
        <div class="second-part">
            <div v-if="data.info && data.badge" class="tag-list-desktop">
                <TagsList
                    :key="'desktop' + count"
                    :info-tags="data.info"
                    class="tag-list"
                    prefix="desktop"
                    :internal="data.internal"
                />
            </div>
            <span v-if="data.title3"> {{ $t(data.title3) }}</span>
            <span v-if="data.info3"> :&nbsp;</span>
            <span v-if="data.info3" class="info"> {{ data.info3 }}</span>
        </div>
    </div>
</template>

<script>
import TagsList from './TagsList.vue'
import IconImage from '@/components/svgs/IconImage.vue'

import imageMixin from '@/mixins/imageMixin.ts'

export default {
    name: 'InfoSentence',

    components: {
        TagsList,
        IconImage,
    },

    mixins: [imageMixin],

    props: {
        data: {
            type: Object,
            default: () => {},
        },
        count: {
            type: Number,
            default: 0,
        },
        allBold: {
            type: Boolean,
            default: false,
        },
        allPlain: {
            type: Boolean,
            default: false,
        },
        flow: {
            type: Boolean,
            default: false,
        },
        inline: {
            type: Boolean,
            default: false,
        },
        black: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: null,
        },
    },

    computed: {
        cloud() {
            return this.data.cloud || false
        },
    },
}
</script>

<style lang="scss" scoped>
.info-sentence {
    display: flex;
    align-items: center;

    span,
    a {
        font-size: $font-size-s;
        font-weight: 400;
        color: $primary-dark;
        align-self: center;
    }

    &.all-bold {
        span,
        a {
            font-weight: 700;
        }
    }

    &.all-plain {
        span,
        a {
            font-weight: 400;
        }
    }

    &.black {
        span {
            color: #000;
        }
    }

    .info {
        font-weight: 700;
        align-self: center;
    }

    .clickable {
        cursor: pointer;

        &:hover {
            filter: brightness(1.2);
        }
    }

    .first-part {
        display: flex;
        flex-direction: row;
        align-items: center;

        .text {
            display: flex;
            width: 100%;

            .title {
                width: fit-content;
            }

            .no-badge {
                display: flex;
                flex-direction: row;
                align-items: center;
            }
        }
    }

    .second-part {
        display: flex;
        flex-direction: row;
        width: 30%;
    }

    .tag-list-desktop {
        width: 100%;
    }

    .icon {
        margin-right: $space-s;
        height: pxToRem(25px);
        fill: $primary-dark;
    }

    .title-badge {
        background-color: $primary-dark;
        color: white;
    }

    .badge {
        margin-right: $space-xs;
    }
}

@media screen and (max-width: $max-mobile) {
    .info-sentence {
        flex-direction: column;
        align-items: flex-start;

        .text {
            width: fit-content;
        }

        .second-part {
            padding-left: 30px;
            width: 100%;
        }
    }
}
</style>
