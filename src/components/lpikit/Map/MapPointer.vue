<template>
    <div class="wrapper">
        <div ref="marker" class="map-pointer">
            <div class="badge">
                <div :class="location.type" class="badge__dot" />

                <div class="badge__label">{{ pointerLabel }}</div>
            </div>

            <div class="line" />
        </div>
        <ProjectTooltip v-if="hasProjectTip" :location="location" ref="tooltip" />
        <LocationTooltip v-else-if="hasLocationTip" :location="location" ref="tooltip" />
    </div>
</template>

<script>
import ProjectTooltip from '@/components/lpikit/Map/ProjectTooltip.vue'
import LocationTooltip from '@/components/lpikit/Map/LocationTooltip.vue'
export default {
    name: 'MapPointer',

    emits: ['mounted', 'unmounted'],

    components: {
        ProjectTooltip,
        LocationTooltip,
    },
    props: {
        location: {
            type: Object,
            required: true,
            default: null,
        },

        hasProjectTip: {
            type: Boolean,
            default: false,
        },

        hasLocationTip: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        pointerLabel() {
            return this.location.type === 'impact'
                ? this.$t('project.impact')
                : this.$t('team.team')
        },
    },

    mounted() {
        this.$emit('mounted', {
            location: this.location,
            markerContent: this.$refs.marker,
            tooltip: this.$refs.tooltip,
        })
    },

    unmounted() {
        this.$emit('unmounted')
    },
}
</script>

<style lang="scss" scoped>
.wrapper {
    display: none;
}

.map-pointer {
    display: flex;
    flex-direction: column;
    align-items: center;

    .badge {
        background: $white;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: $space-m;
        height: 34px;
        box-sizing: border-box;
        border: $border-width-s solid $primary-dark;
        border-radius: $border-radius-l;
        cursor: pointer;
        transition:
            height 0.15s ease-in-out,
            width 0.15s ease-in-out;

        &__dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            margin-right: $space-s;

            &.impact {
                background: $violet-dark;
            }

            &.team {
                background: $primary;
            }
        }

        &__label {
            color: $primary-dark;
            font-size: $font-size-xs;
            text-transform: uppercase;
            font-weight: 700;
        }
    }

    .line {
        width: 3px;
        height: 35px;
        background: $primary-dark;
        position: relative;

        &::after {
            content: '';
            width: 10px;
            height: 10px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            background: $primary-dark;
            border-radius: 50%;
        }
    }
}
</style>
