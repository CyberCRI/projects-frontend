<template>
    <div class="group-resource-section">
        <div class="group-section-title">
            {{ $t('group.resource-title', { quantity: resources.length }) }}
        </div>

        <div class="resource-ctn">
            <ResourceCard v-for="(resource, i) in resources" :key="i" :resource="resource" />
        </div>

        <LpiButton
            :label="buttonLabel"
            right-icon="ArrowRight"
            thin-border
            color="primary-dark"
            class="see-more-btn"
        />
    </div>
</template>

<script>
import ResourceCard from './ResourceCard.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'GroupResourceSection',

    components: { ResourceCard, LpiButton },

    data() {
        return {
            resources: [
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'link',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
                {
                    type: 'file',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
                },
            ],
        }
    },

    computed: {
        buttonLabel() {
            return this.$t('group.resource-button', { quantity: this.resources.length - 12 })
        },
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

    .resource-ctn {
        display: flex;
        flex-wrap: wrap;
        gap: $space-m;

        > * {
            width: 100%;
        }
    }

    .see-more-btn {
        margin: $space-m auto 0;
    }
}

@media screen and (min-width: $min-tablet) {
    .group-resource-section .resource-ctn {
        > * {
            width: calc(25% - $space-m);
        }
    }
}
</style>
