<template>
    <div class="sdg-recap">
        <div>
            <div
                :style="`background-image: url('${PUBLIC_BINARIES_PREFIX}/sdgs/logo.png')`"
                class="sdg-logo"
            />

            <TransitionGroup tag="div" name="sdg" class="current-list">
                <div
                    v-for="sdg in sdgs"
                    :key="sdg"
                    :style="`background-image: url('${PUBLIC_BINARIES_PREFIX}/sdgs/${lang}/${sdg}.svg')`"
                ></div>
            </TransitionGroup>
        </div>

        <LpiButton
            v-if="canEditProject"
            :label="$filters.capitalize($t('sdg.add-short'))"
            class="add-sdg-btn"
            @click="showSdgModal"
        />
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import permissions from '@/mixins/permissions.ts'
import imageMixin from '@/mixins/imageMixin.ts'

export default {
    name: 'SdgRecap',

    components: { LpiButton },

    inject: ['projectLayoutToggleAddModal'],

    mixins: [permissions, imageMixin],

    props: {
        sdgs: {
            type: Array,
            default: () => [],
        },
    },

    computed: {
        lang() {
            return this.$store.getters['languages/current']
        },
    },

    methods: {
        showSdgModal() {
            this.projectLayoutToggleAddModal('sdg')
        },
    },
}
</script>

<style lang="scss" scoped>
.sdg-enter-active,
.sdg-leave-active {
    transition: all 0.4s ease;
}

.sdg-enter-from,
.sdg-leave-to {
    transform: scale(0) translateY(200%);
}

.sdg-recap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: $border-width-s solid $black;
    border-radius: $border-radius-l;
    overflow: hidden;
    padding: $space-2xs;
    background: $white;

    > div:first-of-type {
        display: flex;
        align-items: center;
    }

    .sdg-logo {
        height: 100px;
        width: 80px;
        background-repeat: no-repeat;
        background-size: contain;
        padding: 0 $space-xs;
    }

    .current-list {
        display: flex;
        flex-wrap: wrap;
        gap: $space-2xs;
        width: fit-content;

        > div {
            height: 100px;
            width: 100px;
            background-repeat: no-repeat;
            background-size: contain;
        }
    }

    .add-sdg-btn {
        margin-left: $space-2xs;
    }
}

@media screen and (max-width: $max-mobile) {
    .sdg-recap {
        flex-direction: column;

        > div:first-of-type {
            flex-direction: column;

            .current-list {
                justify-content: center;
            }
        }

        .add-sdg-btn {
            margin-left: 0;
            margin-top: $space-2xs;
        }
    }
}
</style>
