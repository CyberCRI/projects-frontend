<template>
    <div class="group-recommandation-section">
        <div class="group-section-title">
            {{ $t('group.recommandations-title') }}
            <span class="hint">{{ $t('group.recommandations-hint') }}</span>
        </div>

        <div class="recommandations-ctn">
            <div class="recommandations-grid">
                <LpiRecommandation
                    v-for="(recommandation, i) in recommandations"
                    :key="i"
                    :recommandation="recommandation"
                />
            </div>

            <LpiButton
                :label="$filters.capitalize($t('common.learn-more'))"
                right-icon="ArrowRight"
                class="see-more-btn"
            />
        </div>
    </div>
</template>

<script>
import LpiRecommandation from './LpiRecommandation.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'GroupRecommandationSection',

    components: {
        LpiRecommandation,
        LpiButton,
    },

    data() {
        return {
            recommandations: [
                {
                    type: 'group',
                    name: 'Group 1',
                    description: 'recommandé #1',
                    usersQuantity: 16,
                    image: require('./test-images/dali-time.jpeg'),
                },
                {
                    type: 'group',
                    name: 'Group 2',
                    description: 'recommandé #2',
                    usersQuantity: 42,
                    image: require('./test-images/taxe.jpeg'),
                },
                {
                    type: 'people',
                    name: 'Eric Chérel',
                    job: 'Chief Information Officer (CIO)',
                    image: require('./test-images/eric-cherel.jpeg'),
                },
                {
                    type: 'people',
                    name: 'Olivier Delesgue',
                    job: 'IT Support',
                    image: require('./test-images/Olivier-Delesgue.png'),
                },
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
.group-recommandation-section {
    // TODO: make the following class a generic class in styles.scss when this component is used in real application,
    // so that we don't rewrite the same styles for each section title
    .group-section-title {
        font-size: $font-size-2xl;
        font-weight: 700;
        margin-bottom: $space-l;

        .hint {
            font-size: $font-size-m;
            font-weight: 400;
            margin-left: $space-m;
        }
    }

    .recommandations-ctn {
        background: $primary-dark;
        border-radius: $border-radius-l;
        padding: $space-m $space-xl;

        .recommandations-grid {
            display: flex;
            flex-wrap: wrap;
            gap: $space-m;

            > * {
                width: calc(50% - $space-m);
            }
        }

        .see-more-btn {
            margin: $space-m auto 0;
        }
    }
}

@media screen and (min-width: $min-tablet) {
    .group-recommandation-section .recommandations-ctn {
        display: flex;
        align-items: center;

        .recommandations-grid {
            flex-grow: 1;

            > * {
                width: calc(25% - $space-m);
            }
        }
    }
}
</style>
