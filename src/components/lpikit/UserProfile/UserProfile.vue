<template>
    <div class="user-profile">
        <!-- Profile Header -->
        <ProfileHeader
            v-if="user"
            :can-edit="canEdit"
            :user="user"
            @edit-profile="$emit('edit-profile')"
        />

        <div class="profile-user__content">
            <!-- short description -->
            <h4 v-if="isEditMode || !!user.des.short" class="title">
                {{ $t('profile.bio_short') }}
            </h4>
            <p v-if="!isEditMode" class="short-description" v-html="user.des.short" />
            <TipTapEditor
                v-else
                :save-icon-visible="false"
                :socket="false"
                :ws-data="payload.editorShortDescription"
                mode="full"
                @update="updateContent('editorShortDescription', $event)"
            />

            <!-- work description -->
            <h4 v-if="isEditMode || !!user.des.work" class="title">
                {{ $t('profile.bio_pro') }}
            </h4>
            <p v-if="!isEditMode" class="professional-description" v-html="user.des.work" />
            <TipTapEditor
                v-else
                :save-icon-visible="false"
                :socket="false"
                :ws-data="payload.editorProfessionalDescription"
                mode="full"
                @update="updateContent('editorProfessionalDescription', $event)"
            />

            <!-- personal description -->
            <h4 v-if="isEditMode || !!user.des.personal" class="title">
                {{ $t('profile.bio_personal') }}
            </h4>
            <p v-if="!isEditMode" class="personal-description" v-html="user.des.personal" />
            <TipTapEditor
                v-else
                :save-icon-visible="false"
                :socket="false"
                :ws-data="payload.editorPersonalDescription"
                mode="full"
                @update="updateContent('editorPersonalDescription', $event)"
            />

            <!-- user projects (Owners, Members) -->
            <UserProjectList
                :label="$filters.capitalize($t('me.projects-participate'))"
                :member-role="['owners', 'members']"
                :user="user"
                @navigated-away="$emit('navigated-away')"
            />

            <!-- user projects (Reviewers) -->
            <UserProjectList
                :label="$filters.capitalize(t('me.projects-reviewing'))"
                :member-role="['reviewers']"
                :user="user"
                @navigated-away="$emit('navigated-away')"
            />

            <!-- user projects (Followed) -->
            <h4 class="title">{{ $filters.capitalize($t('me.follow')) }}</h4>
            <CardList
                :desktop-columns-number="6"
                :is-loading="followedProjectLoading"
                :limit="12"
                :projects="filteredFollowedProjects"
            >
                <template #default="projectListSlotProps">
                    <ProjectCard
                        :horizontal-display="true"
                        :project="projectListSlotProps.project"
                    />
                </template>
            </CardList>

            <!-- SDGs -->
            <template v-if="user.sdgs.length">
                <h4 class="title">{{ $t('profile.sdgs') }}</h4>
                <div class="sdg-ctn">
                    <div
                        v-for="sdg in adaptedSdgs"
                        :key="sdg"
                        :style="`background-image: url('${PUBLIC_BINARIES_PREFIX}/sdgs/${language}/${sdg}.svg')`"
                        class="sdg-img"
                    />
                </div>
            </template>

            <!-- Skill -->
            <template v-if="user.concepts && user.concepts.length">
                <h4 class="title">{{ $t('profile.skills') }}</h4>
                <UserSkills :skills="user.concepts" />
            </template>
        </div>
    </div>
</template>

<script>
import ProfileHeader from '@/components/lpikit/FullProfile/ProfileHeader.vue'
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import UserSkills from '@/components/lpikit/UserSkills/UserSkills.vue'
import UserProjectList from '@/components/lpikit/UserProfile/UserProjectList.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { getUserFollows } from '@/api/follows.service'

export default {
    name: 'UserProfile',

    emits: ['edit-profile', 'navigated-away'],

    mixins: [imageMixin],

    components: {
        UserProjectList,
        ProfileHeader,
        TipTapEditor,
        UserSkills,
        CardList,
        ProjectCard,
    },

    props: {
        user: {
            type: Object,
            required: true,
        },

        isEditMode: {
            type: Boolean,
            default: false,
        },

        canEdit: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            payload: {
                editorShortDescription: {
                    savedContent: '',
                    originalContent: '',
                },
                editorProfessionalDescription: {
                    savedContent: '',
                    originalContent: '',
                },
                editorPersonalDescription: {
                    savedContent: '',
                    originalContent: '',
                },
            },
            followedProjects: [],
            followedProjectLoading: true,
            filteredFollowedProjects: [],
        }
    },

    mounted() {
        this.initPayloads()
        this.setFollowedProject()
    },

    computed: {
        language() {
            return this.$store.getters['languages/current']
        },

        adaptedSdgs() {
            return this.user.sdgs.map((sdg) => (sdg[0] === '0' ? sdg.slice(1) : sdg))
        },
    },

    methods: {
        initPayloads() {
            this.payload = {
                editorShortDescription: {
                    savedContent: this.user.des.short,
                    originalContent: this.user.des.short,
                },
                editorProfessionalDescription: {
                    savedContent: this.user.des.work,
                    originalContent: this.user.des.work,
                },
                editorPersonalDescription: {
                    savedContent: this.user.des.personal,
                    originalContent: this.user.des.personal,
                },
            }
        },

        updateContent(selectedEditor, htmlContent) {
            this.payload[selectedEditor].savedContent = htmlContent
        },

        setFollowedProject() {
            getUserFollows({
                follower_id: this.user.kid,
            }).then((resp) => {
                this.followedProjects = resp.results
                this.sortFollows()
            })
        },

        sortFollows() {
            this.followedProjects.forEach((follow) => {
                this.filteredFollowedProjects.push(follow.project)
            })

            this.followedProjectLoading = false
        },
    },
}
</script>

<style lang="scss" scoped>
.user-profile {
    &__content {
        margin: pxToRem(30px) $space-l 0 $space-l;
    }

    .title {
        font-size: $font-size-m;
        font-weight: 700;
        color: $primary-dark;
        margin: pxToRem(90px) 0 $space-l 0;
    }

    .sdg-ctn {
        display: flex;
        flex-wrap: wrap;
        gap: $space-l;

        .sdg-img {
            width: pxToRem(142px);
            height: pxToRem(142px);
            background-repeat: no-repeat;
            background-size: contain;
        }
    }
}
</style>
