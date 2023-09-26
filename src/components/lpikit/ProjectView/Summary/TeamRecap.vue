<template>
    <div class="team-recap">
        <SectionHeader
            :quantity="members.length"
            :title="$filters.capitalize($t('team.team'))"
            @redirect-button-clicked="goToTeam"
        />

        <div class="team-card-ctn">
            <TeamCard
                v-for="member in members.length > 6 ? members.slice(0, 5) : members.slice(0, 6)"
                :key="member.keycloak_id"
                :user="member"
                class="team-card"
            />

            <router-link
                v-if="members.length > 6"
                :to="`/projects/${$route.params.slugOrId}/team`"
                class="additional-member"
            >
                <div>+{{ members.length - 5 }}</div>
            </router-link>
        </div>
    </div>
</template>

<script>
import SectionHeader from '@/components/lpikit/ProjectView/shared/SectionHeader.vue'
import TeamCard from '@/components/lpikit/TeamCard/TeamCard.vue'

export default {
    name: 'TeamRecap',

    components: {
        SectionHeader,
        TeamCard,
    },

    props: {
        members: {
            type: Array,
            default: () => [],
        },
    },

    methods: {
        goToTeam() {
            this.$router.push(`/projects/${this.$route.params.slugOrId}/team`)
        },
    },
}
</script>

<style lang="scss" scoped>
.team-recap {
    .team-card-ctn {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: $space-m;

        .team-card {
            width: calc(33.33% - $space-m);
        }

        .additional-member {
            border: $border-width-l solid $primary-dark;
            border-radius: $border-radius-m;
            width: calc(33.33% - $space-m);
            display: flex;
            align-items: center;
            justify-content: center;
            color: $primary-dark;
            font-weight: 700;
            font-size: pxToRem(18px);
            cursor: pointer;
        }
    }
}

@media screen and (max-width: $max-mobile) {
    .team-recap .team-card-ctn {
        gap: $space-s;

        .team-card,
        .additional-member {
            width: calc(50% - $space-s);
        }
    }
}

@media screen and (max-width: $min-mobile) {
    .team-recap .team-card-ctn {
        gap: $space-s;

        .team-card {
            width: 100%;
        }

        .additional-member {
            width: 100%;
            height: pxToRem(50px);
        }
    }
}
</style>
