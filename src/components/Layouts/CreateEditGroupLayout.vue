<template>
    <div class="create-group">
        <div class="header">
            <h1>{{ isEdit ? $t('group.edit.title') : $t('group.create.title') }}</h1>
            <p>
                {{ $t('group.create.notice') }}
                <RouterLink :to="{ name: 'Help' }" class="help-link"
                    >{{ $t('group.create.help-link') }}
                </RouterLink>
            </p>
        </div>

        <div class="group-form">
            <!-- do not remove key or group hierarchy will be uncorrectly loaded on meta portal (PROJ-1032) -->
            <GroupForm
                :key="groupData?.id"
                ref="groupForm"
                v-model="form"
                @close="$emit('close')"
                :validation="v$"
                :is-add-mode="!groupId"
            />

            <LpiSnackbar
                v-if="v$.$anyDirty && formIsInvalid"
                class="completed-form-snackbar"
                icon="ExclamationMark"
                type="warning"
            >
                <div v-html="$t('group.form.form-incomplete')"></div>
            </LpiSnackbar>

            <div class="actions">
                <LpiButton
                    :disabled="isSaving"
                    :label="$t('common.cancel')"
                    :secondary="true"
                    class="submit-btn"
                    @click="cancel"
                    data-test="cancel-group-create-button"
                />
                <LpiButton
                    :disabled="formIsInvalid || isSaving"
                    :label="isEdit ? $t('group.form.edit-group') : $t('group.form.create-group')"
                    :left-icon="isSaving ? 'LoaderSimple' : null"
                    class="submit-btn"
                    @click="submit"
                    data-test="group-create-button"
                />
            </div>
        </div>
    </div>
</template>

<script>
import GroupForm from '@/components/lpikit/GroupForm/GroupForm.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LpiSnackbar from '@/components/lpikit/Snackbar/LpiSnackbar.vue'
import permissions from '@/mixins/permissions.ts'
import {
    postGroup,
    postGroupMembers,
    postGroupProjects,
    postGroupHeader,
    patchGroupHeader,
    getGroup,
    getGroupMember,
    getGroupProject,
    patchGroup,
    removeGroupMember,
    removeGroupProject,
} from '@/api/group.service'
import useValidate from '@vuelidate/core'
import { required, maxLength, helpers, email } from '@vuelidate/validators'
import { imageSizesFormData, pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import isEqual from 'lodash.isequal'

export default {
    name: 'CreateEditGroupLayout',

    mixins: [permissions],

    emits: ['close'],

    components: { GroupForm, LpiButton, LpiSnackbar },

    props: {
        groupId: {
            type: [String, null],
            default: null,
        },
    },

    data() {
        return {
            v$: useValidate(),
            isFormCorrect: true,

            form: {
                name: '',
                description: '',
                short_description: '',
                email: '',
                type: '', // TODO ??? "club" | "group"?
                parentGroup: null, // group object
                organization: '',
                members: [],
                featuredProjects: [],
                header_image: null,
                imageSizes: null,
                publication_status: 'public',
            },
            isSaving: false,
            groupData: null,
            groupMemberData: null,
            groupProjectData: null,
        }
    },

    validations() {
        return {
            form: {
                name: {
                    required: helpers.withMessage(
                        this.$t('group.form.name-errors.required'),
                        required
                    ),
                    maxLengthValue: helpers.withMessage(
                        this.$t('group.form.name-errors.max'),
                        maxLength(120)
                    ),
                },
                email: {
                    email: helpers.withMessage(
                        this.$t('profile.edit.general.personal-email.is-email'),
                        email
                    ),
                },
                short_description: {
                    maxLengthValue: helpers.withMessage(
                        this.$t('group.form.short-description-errors.max'),
                        maxLength(150)
                    ),
                },
                publication_status: {
                    required: helpers.withMessage(
                        this.$t('group.form.publication-status-errors.required'),
                        required
                    ),
                },
            },
        }
    },

    async mounted() {
        await this.$store.dispatch('people-groups/setCurrentId', this.groupId || null)
        // check right to create (if no grouip id passed) or edit (if group id passed)
        // and 404 if not allowed
        if ((this.groupId && !this.canEditGroup) || (!this.groupId && !this.canCreateGroup)) {
            this.$router.replace({
                name: 'page404',
                params: { pathMatch: this.$route.path.substring(1).split('/') },
            })
            return
        }

        if (this.groupId) {
            // load data
            // general data
            const groupData = await getGroup(this.orgCode, this.groupId)
            this.groupData = groupData
            this.form.name = groupData.name
            this.form.description = groupData.description
            this.form.short_description = groupData.short_description
            this.form.email = groupData.email
            // first group in hierarchy is always org group
            // witch is not diplayed and considered null parent for the form and api purpose
            // parent group is always the last group in hierarchy
            this.form.parentGroup =
                groupData.hierarchy?.length > 1
                    ? groupData.hierarchy[groupData.hierarchy.length - 1]
                    : null
            this.form.organization = groupData.organization
            this.form.type = groupData.type
            this.form.publication_status = groupData.publication_status
            // header image
            this.form.header_image = groupData.header_image?.url
            this.form.imageSizes = pictureApiToImageSizes(groupData.header_image)

            // fetch members
            const groupMemberData = (await getGroupMember(this.orgCode, this.groupId)).results
            this.groupMemberData = groupMemberData.map((member) => ({ ...member })) // mapping and destructiring to avoid updating both arrays/object at the same time
            this.form.members = groupMemberData.map((member) => ({ ...member })) // this.groupMemberData will serve as reference for add/delete ops

            // fetch featured projects
            // TODO this is paginated
            // so if there's more than 100 featured projects we're screwed
            const groupProjectData = (
                await getGroupProject(this.orgCode, this.groupId)
            ).results.filter((project) => project.is_featured) // projects are mix of featured and member's projects, so filter out non featured
            this.groupProjectData = groupProjectData.map((project) => ({ ...project })) // mapping and destructiring to avoid updating both arrays/object at the same time
            this.form.featuredProjects = groupProjectData.map((project) => ({ ...project })) // this.groupProjectData  will serve as reference for add/delete ops
        }
    },

    computed: {
        formIsInvalid() {
            return this.v$.$invalid
        },
        isEdit() {
            return !!this.groupId
        },
        orgCode() {
            // use group's org code if availabe
            // to allow edition of groups on the meta portal (PROJ-1032)
            return this.groupData
                ? this.groupData.organization
                : this.$store.getters['organizations/current'].code
        },
    },

    methods: {
        cancel() {
            if (this.groupId) {
                this.$router.push({ name: 'Group', params: { groupId: this.groupId } })
            } else {
                this.$router.push('/admin/groups')
            }
        },

        async submit() {
            this.isFormCorrect = await this.v$.$validate()

            if (this.isFormCorrect) {
                this.isSaving = true
                if (this.isEdit) {
                    this.updateProject()
                } else {
                    this.createProject()
                }
            }
        },

        async createProject() {
            this.isSaving = true
            try {
                // save base group
                const payload = {
                    name: this.form.name,
                    description: this.form.description,
                    short_description: this.form.short_description,
                    email: this.form.email,
                    type: 'group', // this.form.type, // TODO ??? club | group
                    parent: this.form.parentGroup?.id,
                    organization: this.orgCode,
                    publication_status: this.form.publication_status,
                }
                const newGroupId = (await postGroup(this.orgCode, payload)).id

                // save header
                await this.updateHeader(newGroupId)

                // save members
                await this.updateGroupMembers(newGroupId)

                //save featured projects
                await this.updateGroupProjects(newGroupId)

                this.$router.push({ name: 'Group', params: { groupId: newGroupId } })

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.group-create.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.group-create.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.isSaving = false
            }
        },

        async updateProject() {
            this.isSaving = true
            try {
                // save base group
                const payload = {
                    id: this.groupId,
                    name: this.form.name,
                    description: this.form.description,
                    short_description: this.form.short_description,
                    email: this.form.email,
                    type: this.form.type, // this.form.type, // TODO ??? club | group
                    parent: this.form.parentGroup?.id || null, // undefined unset the key, null set it to null
                    organization: this.orgCode,
                    publication_status: this.form.publication_status,
                }
                await patchGroup(this.orgCode, this.groupId, payload)

                // save header
                await this.updateHeader(this.groupId)

                // save members
                await this.updateGroupMembers(this.groupId)

                //save featured projects
                await this.updateGroupProjects(this.groupId)

                this.$router.push({ name: 'Group', params: { groupId: this.groupId } })

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.group-edit.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.group-edit.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.isSaving = false
            }
        },

        async updateHeader(groupId) {
            // check if header has changed
            if (
                this.form.header_image != this.groupProjectData?.header_image?.url ||
                !isEqual(
                    this.form.imageSizes,
                    pictureApiToImageSizes(this.groupProjectData?.header_image)
                )
            ) {
                const payloadHeader = new FormData()
                imageSizesFormData(payloadHeader, this.form.imageSizes)

                if (this.form.header_image instanceof File) {
                    payloadHeader.append(
                        'file',
                        this.form.header_image,
                        this.form.header_image.name
                    )

                    await postGroupHeader(this.orgCode, groupId, payloadHeader)

                    // TODO: make this in POST when backend allows it
                    payloadHeader.delete('file')
                    await patchGroupHeader(this.orgCode, groupId, payloadHeader)
                } else if (this.groupProjectData?.header_image?.id) {
                    await patchGroupHeader(this.orgCode, groupId, payloadHeader)
                }
            }
        },

        async updateGroupMembers(groupId) {
            const previousMembersIndex = (this.groupMemberData || []).reduce((acc, curr) => {
                acc[curr.keycloak_id] = curr
                return acc
            }, {})

            const currentMembersIndex = (this.form.members || []).reduce((acc, curr) => {
                acc[curr.keycloak_id] = curr
                return acc
            }, {})

            const membersToAdd = []
            const membersToRemove = []
            const leadersToAdd = []
            const leadersToRemove = []
            const managersToAdd = []
            const managersToRemove = []

            // a user is a manager OR a member
            // in both case it can ALSO be leader

            ;(this.form.members || []).forEach((member) => {
                const previous = previousMembersIndex[member.keycloak_id]
                // if its a new user
                if (!previous) {
                    // add it as manager OR just member
                    if (member.is_manager) {
                        managersToAdd.push(member.keycloak_id)
                    } else {
                        membersToAdd.push(member.keycloak_id)
                    }
                    // also add it as leader if it is
                    if (member.is_leader) {
                        leadersToAdd.push(member.keycloak_id)
                    }
                } else {
                    // add or remove leader role if necesserary (independant from other roles)
                    if (member.is_leader && !previous.is_leader) {
                        leadersToAdd.push(member.keycloak_id)
                    } else if (!member.is_leader && previous.is_leader) {
                        leadersToRemove.push(member.keycloak_id)
                    }

                    // if manager status changed
                    if (member.is_manager && !previous.is_manager) {
                        // if now manager remove from regular members and add as manager
                        membersToRemove.push(member.keycloak_id)
                        managersToAdd.push(member.keycloak_id)
                    } else if (!member.is_manager && previous.is_manager) {
                        // if not manager anymore remove from managers but add as a member
                        managersToRemove.push(member.keycloak_id)
                        membersToAdd.push(member.keycloak_id)
                    }
                }
            })
            ;(this.groupMemberData || []).forEach((member) => {
                // if user is to be removed
                if (!currentMembersIndex[member.keycloak_id]) {
                    // if was leader remove from leaders independently of other roles
                    if (member.is_leader) leadersToRemove.push(member.keycloak_id)
                    // if was manager remove from managers else remove from members
                    if (member.is_manager) managersToRemove.push(member.keycloak_id)
                    else membersToRemove.push(member.keycloak_id)
                }
            })

            if (membersToAdd.length > 0 || leadersToAdd.length > 0 || managersToAdd.length > 0) {
                const payloadMembers = {
                    members: membersToAdd,
                    leaders: leadersToAdd,
                    managers: managersToAdd,
                }
                await postGroupMembers(this.orgCode, groupId, payloadMembers)
            }

            // TODO ask Santa Claus for a batch removal endpoint
            if (
                membersToRemove.length > 0 ||
                leadersToRemove.length > 0 ||
                managersToRemove.length > 0
            ) {
                const toRemove = [...membersToRemove, ...leadersToRemove, ...managersToRemove]
                const body = {
                    users: toRemove,
                }
                await removeGroupMember(this.orgCode, groupId, body)
            }
        },

        async updateGroupProjects(groupId) {
            // TODO: check if featured projects are changed and triage add/remove

            const previousProjectsIndex = (this.groupProjectData || []).reduce((acc, curr) => {
                acc[curr.id] = curr
                return acc
            }, {})

            const currentProjectsIndex = (this.form.featuredProjects || []).reduce((acc, curr) => {
                acc[curr.id] = curr
                return acc
            }, {})

            const projectsToAdd = (this.form.featuredProjects || []).filter(
                (project) => !previousProjectsIndex[project.id]
            )

            const projectsToRemove = (this.groupProjectData || []).filter(
                (project) => !currentProjectsIndex[project.id]
            )

            if (projectsToAdd.length > 0) {
                const payloadProjects = {
                    featured_projects: projectsToAdd.map((project) => project.id),
                }
                await postGroupProjects(this.orgCode, groupId, payloadProjects)
            }
            if (projectsToRemove.length > 0) {
                // TODO ask Santa Claus for a batch removal endpoint
                await Promise.all(
                    projectsToRemove.map((project) => {
                        const payloadProject = {
                            project: project.id,
                        }
                        return removeGroupProject(this.orgCode, groupId, payloadProject)
                    })
                )
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.create-group {
    width: 100%;
    max-width: pxToRem(532px);
    margin: $navbar-height auto 0 auto;
    padding: 0 $space-l;
    box-sizing: border-box;
}

.header {
    margin-top: pxToRem(110px);
    margin-bottom: $space-xl;

    h1 {
        font-size: $font-size-5xl;
        font-weight: 700;
        text-align: center;
    }

    p {
        font-size: $font-size-m;
        line-height: 1.6;
        margin: $space-xl 0;
    }

    .help-link {
        color: $primary-dark;
    }
}

.actions {
    display: flex;
    justify-content: center;
    gap: $space-xl;
    margin-top: $space-m;
    margin-bottom: $space-xl;
}
</style>
