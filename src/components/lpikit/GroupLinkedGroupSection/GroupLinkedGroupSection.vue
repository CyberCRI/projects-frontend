<template>
    <div class="group-resource-section">
        <div class="group-section-title">
            {{ $t('group.linked-groups-title', { quantity: linkedGroups.length }) }}
        </div>

        <div class="linked-groups-ctn">
            <LinkedGroup
                v-for="(linkedGroup, i) in linkedGroups"
                :key="i"
                :linked-group="linkedGroup"
            />
        </div>
    </div>
</template>

<script>
import LinkedGroup from './LinkedGroup.vue'

export default {
    name: 'GroupLinkedGroupSection',

    components: { LinkedGroup },

    data() {
        return {
            linkedGroups: [
                {
                    name: 'Data analysis',
                    type: 'Groupe parent',
                    image: require('./test-image.png'),
                },
                {
                    name: 'Data analysis',
                    type: 'Groupe parent',
                    image: require('./test-image.png'),
                },
                {
                    name: 'Data analysis',
                    type: 'Groupe parent',
                    image: require('./test-image.png'),
                },
                {
                    name: 'Data analysis',
                    type: 'Groupe parent',
                    image: require('./test-image.png'),
                },
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
.group-resource-section {
    // TODO: make the following class a generic class in styles.scss when this component is used in real application,
    // so that we don't rewrite the same styles for each section title
    .group-section-title {
        font-size: $font-size-2xl;
        font-weight: 700;
        margin-bottom: $space-l;
    }

    .linked-groups-ctn {
        border: $border-width-s solid $primary;
        border-radius: $border-radius-l;
        padding: $space-l;
        display: flex;
        flex-wrap: wrap;
        gap: $space-l;
        justify-content: center;
    }
}

@media screen and (min-width: $min-tablet) {
    .group-resource-section .linked-groups-ctn {
        justify-content: flex-start;
    }
}
</style>
