<script setup>
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
} from '@/api/groups.service'
import useValidate from '@vuelidate/core'
import { required, maxLength, helpers, email } from '@vuelidate/validators'
import { imageSizesFormData, pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import isEqual from 'lodash.isequal'
import useToasterStore from '@/stores/useToaster.ts'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
import useUsersStore from '@/stores/useUsers.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'

const props = defineProps({
  groupId: {
    // watch out : this can be a slug or an id
    type: [String, null],
    default: null,
  },
})

defineEmits(['close'])
const toaster = useToasterStore()
const peopleGroupsStore = usePeopleGroupsStore()
const organizationsStore = useOrganizationsStore()
const usersStore = useUsersStore()
const { canCreateGroup, canEditGroup } = usePermissions()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const isFormCorrect = ref(true)

const form = ref({
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
})

const isSaving = ref(false)
const groupData = ref(null)
const groupMemberData = ref(null)
const groupProjectData = useState(() => null)

const rules = computed(() => ({
  form: {
    name: {
      required: helpers.withMessage(t('group.form.name-errors.required'), required),
      maxLengthValue: helpers.withMessage(t('group.form.name-errors.max'), maxLength(120)),
    },
    email: {
      email: helpers.withMessage(t('profile.edit.general.professional-email.is-email'), email),
    },
    short_description: {
      maxLengthValue: helpers.withMessage(
        t('group.form.short-description-errors.max'),
        maxLength(150)
      ),
    },
    publication_status: {
      required: helpers.withMessage(t('group.form.publication-status-errors.required'), required),
    },
  },
}))

const v$ = useValidate(rules, { form })

const formIsInvalid = computed(() => {
  return v$.value.$invalid
})
const isEdit = computed(() => {
  return !!props.groupId
})
const orgCode = computed(() => {
  // use group's org code if availabe
  // to allow edition of groups on the meta portal (PROJ-1032)
  return groupData.value ? groupData.value.organization : organizationsStore.current.code
})

const redirectTo404 = () => {
  router.replace({
    name: 'page404',
    params: { pathMatch: route.path.substring(1).split('/') },
  })
}
const cancel = () => {
  if (props.groupId) {
    router.push({ name: 'Group', params: { groupId: props.groupId } })
  } else {
    router.push({ name: 'groups' })
  }
}

const updateHeader = async (groupId) => {
  // check if header has changed
  if (
    form.value.header_image != groupProjectData.value?.header_image?.url ||
    !isEqual(form.value.imageSizes, pictureApiToImageSizes(groupProjectData.value?.header_image))
  ) {
    const payloadHeader = new FormData()
    if (form.value.imageSizes) imageSizesFormData(payloadHeader, form.value.imageSizes)

    if (form.value.header_image instanceof File) {
      payloadHeader.append('file', form.value.header_image, form.value.header_image.name)

      await postGroupHeader(orgCode.value, groupId, payloadHeader)

      // TODO: make this in POST when backend allows it
      payloadHeader.delete('file')
    } else if (form.value.imageSizes) {
      // TODO else ?
      await patchGroupHeader(orgCode.value, groupId, payloadHeader)
    }
  }
}

const updateGroupMembers = async (groupId) => {
  const previousMembersIndex = (groupMemberData.value || []).reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
  }, {})

  const currentMembersIndex = (form.value.members || []).reduce((acc, curr) => {
    acc[curr.id] = curr
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

  ;(form.value.members || []).forEach((member) => {
    const previous = previousMembersIndex[member.id]
    // if its a new user
    if (!previous) {
      if (member.is_leader) {
        leadersToAdd.push(member.id)
      } else if (member.is_manager) {
        managersToAdd.push(member.id)
      } else {
        membersToAdd.push(member.id)
      }
    } else {
      // old roles are now removed automacally on backend
      // when adding a new one

      if (member.is_leader && !previous.is_leader) {
        leadersToAdd.push(member.id)
      }

      if (member.is_manager && !previous.is_manager) {
        managersToAdd.push(member.id)
      }

      if (!member.is_leader && !member.is_manager && (previous.is_leader || previous.is_manager)) {
        membersToAdd.push(member.id)
      }
    }
  })
  ;(groupMemberData.value || []).forEach((member) => {
    // if user is to be removed
    if (!currentMembersIndex[member.id]) {
      // if was leader remove from leaders independently of other roles
      if (member.is_leader) leadersToRemove.push(member.id)
      // if was manager remove from managers else remove from members
      if (member.is_manager) managersToRemove.push(member.id)
      else membersToRemove.push(member.id)
    }
  })

  // remove before adding to accomodate for role changes
  if (membersToRemove.length > 0 || leadersToRemove.length > 0 || managersToRemove.length > 0) {
    const toRemove = [...membersToRemove, ...leadersToRemove, ...managersToRemove]
    const body = {
      users: toRemove,
    }
    await removeGroupMember(orgCode.value, groupId, body)
  }

  if (membersToAdd.length > 0 || leadersToAdd.length > 0 || managersToAdd.length > 0) {
    const payloadMembers = {
      members: membersToAdd,
      leaders: leadersToAdd,
      managers: managersToAdd,
    }
    await postGroupMembers(orgCode.value, groupId, payloadMembers)
  }
}

const updateGroupProjects = async (groupId) => {
  // TODO: check if featured projects are changed and triage add/remove

  const previousProjectsIndex = (groupProjectData.value || []).reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
  }, {})

  const currentProjectsIndex = (form.value.featuredProjects || []).reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
  }, {})

  const projectsToAdd = (form.value.featuredProjects || []).filter(
    (project) => !previousProjectsIndex[project.id]
  )

  const projectsToRemove = (groupProjectData.value || []).filter(
    (project) => !currentProjectsIndex[project.id]
  )

  if (projectsToAdd.length > 0) {
    const payloadProjects = {
      featured_projects: projectsToAdd.map((project) => project.id),
    }
    await postGroupProjects(orgCode.value, groupId, payloadProjects)
  }
  if (projectsToRemove.length > 0) {
    const payloadProjects = {
      featured_projects: projectsToRemove.map((project) => project.id),
    }
    await removeGroupProject(orgCode.value, groupId, payloadProjects)
  }
}

const buildPayload = () => {
  const team = {
    leaders: [],
    managers: [],
    members: [],
  }

  form.value.members.forEach((member) => {
    if (member?.id) {
      if (member.is_leader) {
        team.leaders.push(member.id)
      } else if (member.is_manager) {
        team.managers.push(member.id)
      } else {
        team.members.push(member.id)
      }
    }
  })

  // save base group
  const payload = {
    name: form.value.name,
    description: form.value.description,
    short_description: form.value.short_description,
    email: form.value.email,
    type: 'group', // this.form.type, // TODO ??? club | group
    parent: form.value.parentGroup?.id || null, // undefined ,
    organization: orgCode.value,
    publication_status: form.value.publication_status,
    team,
    featured_projects: form.value.featuredProjects.map((project) => project.id),
  }

  return payload
}

const createGroup = async () => {
  isSaving.value = true
  try {
    const payload = buildPayload()

    const newGroupId = (await postGroup(orgCode.value, payload)).id

    // save header
    await updateHeader(newGroupId)

    // reload current user rights in case they changed
    await usersStore.getUser(usersStore.userFromApi.id)

    router.push({ name: 'Group', params: { groupId: newGroupId } })

    toaster.pushSuccess(t('toasts.group-create.success'))
  } catch (error) {
    this.toaster.pushError(`${t('toasts.group-create.error')} (${error})`)
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

const updateGroup = async () => {
  isSaving.value = true
  try {
    const payload = buildPayload()
    payload.id = props.groupId
    payload.type = form.value.type

    await patchGroup(orgCode.value, props.groupId, payload)

    // save header
    await updateHeader(props.groupId)

    // save members
    await updateGroupMembers(props.groupId)

    //save featured projects
    await updateGroupProjects(props.groupId)

    // reload current user rights in case they changed
    await usersStore.getUser(usersStore.userFromApi.id)

    router.push({ name: 'Group', params: { groupId: props.groupId } })

    toaster.pushSuccess(t('toasts.group-edit.success'))
  } catch (error) {
    toaster.pushError(`${t('toasts.group-edit.error')} (${error})`)
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

const submit = async () => {
  isFormCorrect.value = await v$.value.$validate()

  if (isFormCorrect.value) {
    isSaving.value = true
    if (isEdit.value) {
      await updateGroup()
    } else {
      await createGroup()
    }
  }
}

onMounted(async () => {
  if (!props.groupId) {
    peopleGroupsStore.currentId = null
    // check right to create (if no grouip id passed) or edit (if group id passed)
    // and 404 if not allowed
    if (!canCreateGroup.value) {
      redirectTo404()
      return
    }
  } else {
    // load data
    // general data
    try {
      const _groupData = await getGroup(orgCode.value, props.groupId)

      // now we can get the real id (not slug)
      peopleGroupsStore.currentId = _groupData.id
      if (!canEditGroup.value) {
        redirectTo404()
        return
      }

      groupData.value = _groupData
      form.value.name = _groupData.name
      form.value.description = _groupData.description
      form.value.short_description = _groupData.short_description
      form.value.email = _groupData.email
      // first group in hierarchy is always org group
      // witch is not diplayed and considered null parent for the form and api purpose
      // parent group is always the last group in hierarchy
      form.value.parentGroup = _groupData.hierarchy?.length
        ? _groupData.hierarchy[_groupData.hierarchy.length - 1]
        : null
      form.value.organization = _groupData.organization
      form.value.type = _groupData.type
      form.value.publication_status = _groupData.publication_status
      // header image
      form.value.header_image = _groupData.header_image
      form.value.imageSizes = pictureApiToImageSizes(_groupData.header_image)

      // fetch members
      const _groupMemberData = (await getGroupMember(orgCode.value, props.groupId)).results
      groupMemberData.value = _groupMemberData.map((member) => ({ ...member })) // mapping and destructiring to avoid updating both arrays/object at the same time
      form.value.members = _groupMemberData.map((member) => ({ ...member })) // this.groupMemberData will serve as reference for add/delete ops

      // fetch featured projects
      // TODO this is paginated
      // so if there's more than 100 featured projects we're screwed
      const _groupProjectData = (await getGroupProject(orgCode.value, props.groupId)).results
      groupProjectData.value = _groupProjectData.map((project) => ({ ...project })) // mapping and destructiring to avoid updating both arrays/object at the same time
      form.value.featuredProjects = _groupProjectData.map((project) => ({ ...project })) // this.groupProjectData  will serve as reference for add/delete ops
    } catch (error) {
      console.log(error)
      redirectTo404()
      return
    }
  }
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => (isEdit.value ? t('group.edit.title') : t('group.create.title'))),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="create-group">
    <div class="header">
      <h1>{{ isEdit ? $t('group.edit.title') : $t('group.create.title') }}</h1>
      <p>
        {{ $t('group.create.notice') }}
        <NuxtLink :to="{ name: 'Help' }" class="help-link">
          {{ $t('group.create.help-link') }}
        </NuxtLink>
      </p>
    </div>

    <div class="group-form">
      <!-- do not remove key or group hierarchy will be uncorrectly loaded on meta portal (PROJ-1032) -->
      <GroupForm
        :key="groupData?.id"
        ref="groupForm"
        v-model="form"
        :validation="v$"
        :is-add-mode="!groupId"
        @close="$emit('close')"
      />

      <LpiSnackbar
        v-if="v$.$anyDirty && formIsInvalid"
        class="completed-form-snackbar"
        icon="ExclamationMark"
        type="warning"
      >
        <div v-html="$t('group.form.form-incomplete')" />
      </LpiSnackbar>

      <div class="actions">
        <LpiButton
          :disabled="isSaving"
          :label="$t('common.cancel')"
          :secondary="true"
          class="submit-btn"
          data-test="cancel-group-create-button"
          @click="cancel"
        />
        <LpiButton
          :disabled="formIsInvalid || isSaving"
          :label="isEdit ? $t('group.form.edit-group') : $t('group.form.create-group')"
          :btn-icon="isSaving ? 'LoaderSimple' : null"
          class="submit-btn"
          data-test="group-create-button"
          @click="submit"
        />
      </div>
    </div>
  </div>
</template>
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
