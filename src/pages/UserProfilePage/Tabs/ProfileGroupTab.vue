<template>
    <div class="project-tab">
        <div v-if="isMyProfile" class="create-project">
            <LpiButton
                :label="$t('group.create-group')"
                class="btn"
                left-icon="Plus"
                secondary
                @click="$router.push({ name: 'createGroup' })"
            />
        </div>
    </div>
</template>

<script>
import permissions from '@/mixins/permissions.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'ProfileGroupTab',

    mixins: [permissions],

    components: {
        LpiButton,
    },

    props: {
        user: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {}
    },

    computed: {
        isMyProfile() {
            const loggedAsKID = this.$store.getters['users/kid']
            return loggedAsKID && this.user.keycloak_id === loggedAsKID
        },
    },
}
</script>

<style lang="scss" scoped>
.title {
    font-size: $font-size-m;
    font-weight: 700;
    color: $primary-dark;
    margin: $space-l 0;
}

.create-project {
    padding-top: $space-l;
    display: flex;
    justify-content: flex-end;
}

@media screen and (max-width: $min-tablet) {
    .project-tab {
        padding: 0 $space-s;
    }
}
</style>
