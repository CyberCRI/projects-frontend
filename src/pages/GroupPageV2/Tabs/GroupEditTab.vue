<script setup lang="ts">
import {
  postGroup,
  postGroupHeader,
  patchGroupHeader,
  getGroup,
  patchGroup,
} from '@/api/groups.service'
import useValidate from '@vuelidate/core'
import { required, maxLength, helpers, email } from '@vuelidate/validators'
import { imageSizesFormData, pictureApiToImageSizes } from '@/functs/imageSizesUtils'
import { isEqual } from 'es-toolkit'
import useToasterStore from '@/stores/useToaster'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
import useUsersStore from '@/stores/useUsers'

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
  postCancelRouteFactory: {
    type: [Function, null],
    default: null,
  },

  postUpdateRouteFactory: {
    type: [Function, null],
    default: null,
  },

  postCreateRouteFactory: {
    type: [Function, null],
    default: null,
  },

  isReducedMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'reload-group'])
const toaster = useToasterStore()
const peopleGroupsStore = usePeopleGroupsStore()
const organizationCode = useOrganizationCode()
const usersStore = useUsersStore()
const { canCreateGroup, canEditGroup } = usePermissions()
const route = useRoute()
const router = useRouter()
const { t } = useNuxtI18n()

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

const { startEditWatcher, stopEditWatcher } = useEditWatcher(form)

const isSaving = ref(false)
const groupData = ref(null)

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

const formIsInvalid = computed(() => v$.value.$invalid)
const isEdit = computed(() => !!props.group?.id)
// use group's org code if availabe
// to allow edition of groups on the meta portal (PROJ-1032)
const orgCode = computed(() => groupData.value?.organization ?? organizationCode)

const redirectTo404 = () => {
  router.replace({
    name: 'page404',
    params: { pathMatch: route.path.substring(1).split('/') },
  })
}
const cancel = () => {
  if (props.group.id) {
    router.push(
      props.postCancelRouteFactory
        ? props.postCancelRouteFactory(props.group.id)
        : { name: 'Group', params: { groupId: props.group.id } }
    )
  } else {
    router.push(
      props.postCancelRouteFactory ? props.postCancelRouteFactory(null) : { name: 'groups' }
    )
  }
}

const { setProjectsData } = useGroupProjectsUpdate(orgCode, props.group.id, form)
const { setMembersData } = useGroupMembersUpdate(orgCode, props.group.id, form)

const updateHeader = async (groupId) => {
  // check if header has changed
  if (
    form.value.header_image != groupData.value?.header_image?.url ||
    !isEqual(form.value.imageSizes, pictureApiToImageSizes(groupData.value?.header_image))
  ) {
    const payloadHeader = new FormData()
    if (form.value.imageSizes) imageSizesFormData(payloadHeader, form.value.imageSizes)

    if (form.value.header_image instanceof File) {
      payloadHeader.append('file', form.value.header_image, form.value.header_image.name)

      await postGroupHeader(orgCode.value, groupId, payloadHeader)
      await refreshNuxtData(`${organizationCode}::group::${groupData.value.id}`)

      // TODO: make this in POST when backend allows it
      payloadHeader.delete('file')
    } else if (form.value.imageSizes) {
      // TODO else ?
      await patchGroupHeader(orgCode.value, groupId, payloadHeader)
      await refreshNuxtData(`${organizationCode}::group::${groupData.value.id}`)
    }
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

    const newGroup = await postGroup(orgCode.value, payload)
    const newGroupId = newGroup.id

    // save header
    await updateHeader(newGroupId)
    await refreshNuxtData(`${organizationCode}::group::${newGroup.id}`)

    startEditWatcher()

    // reload current user rights in case they changed
    await usersStore.getUser(usersStore.userFromApi.id)
    toaster.pushSuccess(t('toasts.group-create.success'))

    router.push(
      props.postCreateRouteFactory
        ? props.postCreateRouteFactory(newGroupId)
        : { name: 'Group', params: { groupId: newGroupId } }
    )
  } catch (error) {
    toaster.pushError(`${t('toasts.group-create.error')} (${error})`)
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

const updateGroup = async () => {
  isSaving.value = true
  try {
    const payload = buildPayload()
    // @ts-expect-error 2339
    payload.id = props.group.id
    payload.type = form.value.type

    await patchGroup(orgCode.value, props.group.id, payload)

    // save header
    await updateHeader(props.group.id)

    await refreshNuxtData(`${organizationCode}::group::${groupData.value.id}`)

    startEditWatcher()

    // reload current user rights in case they changed
    await usersStore.getUser(usersStore.userFromApi.id)
    toaster.pushSuccess(t('toasts.group-edit.success'))

    emit('reload-group')

    router.push(
      props.postUpdateRouteFactory
        ? props.postUpdateRouteFactory(props.group.id)
        : { name: 'Group', params: { groupId: props.group.id } }
    )
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
  stopEditWatcher()
  if (!props.group.id) {
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
      const _groupData = await getGroup(orgCode.value, props.group.id)
      // now we can get the real id (not slug)
      peopleGroupsStore.currentId = _groupData.id
      if (!canEditGroup.value) {
        router.push({
          name: 'Group',
          params: { groupId: props.group.id },
        })
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
      // @ts-expect-error 2322
      form.value.organization = _groupData.organization
      form.value.type = _groupData.type
      form.value.publication_status = _groupData.publication_status
      // header image
      form.value.header_image = _groupData.header_image
      form.value.imageSizes = pictureApiToImageSizes(_groupData.header_image)

      await setMembersData()
      await setProjectsData()
    } catch (error) {
      console.log(error)
      redirectTo404()
      return
    }
    startEditWatcher()
  }
})

useLpiHead2({
  title: computed(() => (isEdit.value ? t('group.edit.title') : t('group.create.title'))),
})
</script>
<template>
  <div class="create-group">
    <div class="group-form">
      <!-- do not remove key or group hierarchy will be uncorrectly loaded on meta portal (PROJ-1032) -->
      <GroupForm
        :key="groupData?.id"
        ref="groupForm"
        v-model="form"
        :validation="v$"
        :is-add-mode="!group.id"
        :is-reduced-mode="isReducedMode"
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
  box-sizing: border-box;
  margin: 0;
  max-width: none;
  padding: 0;
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
