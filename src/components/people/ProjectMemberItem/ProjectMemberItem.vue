<template>
    <div class="user" @click="$emit('user-click', user)">
        <CroppedApiImage
            :alt="user.id ? `${user.given_name} ${user.family_name} image` : `${user.name} image`"
            class="picture"
            :picture-data="user.profile_picture"
            picture-size="medium"
            default-picture="/placeholders/user_placeholder.svg"
        />
        <span class="badge" v-if="roleLabel" data-test="leader-badge">
            {{ $t(roleLabel) }}
        </span>

        <div v-if="$filters.isNotGroup(user)" class="name-ctn">
            <h4 class="user-name">{{ userName }}</h4>
        </div>

        <!--        TODO: ask Api to send information-->
        <div v-if="$filters.isNotGroup(user)" class="job">{{ user.job }}</div>

        <div v-if="$filters.isGroup(user)" class="name-ctn">
            <h4 class="user-name">{{ user.name }}</h4>
        </div>
    </div>
</template>

<script>
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

export default {
    name: 'ProjectMemberItem',

    emits: ['user-click'],

    components: {
        CroppedApiImage,
    },

    props: {
        user: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        userName() {
            return `${this.user.given_name?.toLowerCase()} ${this.user.family_name?.toLowerCase()}`
        },
        roleLabel() {
            const role = this.user?.role
            if (role) {
                if (role === 'owners') return 'role.editor'
                else if (role === 'members') return 'role.teammate'
                else if (role === 'reviewers') return 'role.reviewer'
                else if (role === 'owner_groups') return 'role.editor-group'
                else if (role === 'reviewer_groups') return 'role.reviewer-group'
                else if (role === 'member_groups') return 'role.teammate-group'
            }
            return null
        },
    },
}
</script>

<style lang="scss" scoped>
.user {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min-content;

    .picture {
        width: pxToRem(120px);
        height: pxToRem(120px);
        object-fit: cover;
        object-position: top center;
        border-radius: 50%;
    }

    .badge {
        background: $primary-dark;
        font-weight: 400;
        font-size: $font-size-s;
        margin-top: $space-s;
        padding: $space-2xs;
        color: $white;
    }

    .user-name {
        text-transform: capitalize;
    }

    .name-ctn {
        display: flex;
        align-items: center;
        margin-top: $space-s;
        text-align: center;

        h4 {
            margin: 0;
            font-weight: 700;
            font-size: $font-size-m;
            line-height: $line-height-tight;
        }

        svg {
            height: 16px;
            width: 16px;
            fill: $primary-dark;
            cursor: pointer;
            margin-left: $space-s;
        }
    }

    .job {
        margin-top: $space-s;
        text-align: center;
        font-size: $font-size-s;
    }
}
</style>
