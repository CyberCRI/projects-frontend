<script setup>
import useValidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'
import useToasterStore from '@/stores/useToaster.ts'
import useLanguagesStore from '@/stores/useLanguages'
import useProjectCategories from '@/stores/useProjectCategories.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'

import analytics from '@/analytics'
import { createProject } from '@/api/projects.service'
import { getOrganizationByCode } from '@/api/organizations.service'

const emit = defineEmits(['close'])

const toaster = useToasterStore()
const languagesStore = useLanguagesStore()
const projectCategoriesStore = useProjectCategories()
const organizationsStore = useOrganizationsStore()
const usersStore = useUsersStore()
const router = useRouter()
const { onboardingTrap } = useOnboardingStatus()
const { t } = useI18n()

const isFormCorrect = ref(true)
const form = ref({
    title: '',
    purpose: '',
    category: undefined,
    header_image: null,

    language: languagesStore.current,

    tags: [],

    team: {
        owners: null,
        members: null,
        reviewers: null,
        people_groups: null,
    },
    imageSizes: null,
})
const isSaving = ref(false)

const rules = computed(() => {
    const purposeRules =
        form.value.purpose === '   '
            ? {
                  minLengthValue: helpers.withMessage(
                      t('project.form.purpose-errors.min'),
                      minLength(3)
                  ),
                  maxLengthValue: helpers.withMessage(
                      t('project.form.purpose-errors.max'),
                      maxLength(180)
                  ),
              }
            : {
                  required: helpers.withMessage(
                      t('project.form.purpose-errors.required'),
                      required
                  ),
                  minLengthValue: helpers.withMessage(
                      t('project.form.purpose-errors.min'),
                      minLength(3)
                  ),
                  maxLengthValue: helpers.withMessage(
                      t('project.form.purpose-errors.max'),
                      maxLength(180)
                  ),
              }
    return {
        form: {
            title: {
                required: helpers.withMessage(t('project.form.title-errors.required'), required),
                maxLengthValue: helpers.withMessage(
                    t('project.form.title-errors.max'),
                    maxLength(120)
                ),
            },
            purpose: purposeRules,
        },
    }
})

const v$ = useValidate(rules, { form })

const categories = computed(() => {
    return projectCategoriesStore.allOrderedByOrderId
})

const formNotEmpty = computed(() => {
    if (organizationsStore.isDefault) {
        return !!form.value.title && !!form.value.purpose
    }
    return (
        !!form.value.title &&
        !!form.value.purpose &&
        (!categories.value?.length || !!form.value.category)
    )
})

onMounted(async () => {
    if (!categories.value.length) {
        await projectCategoriesStore.getAllProjectCategories()
    }
})

const cancel = () => {
    router.push('/')
}

const doCreateProject = async () => {
    const payload = {
        ...form.value,
        is_locked: false,
        is_shareable: false,
        publication_status: 'private',
        life_status: 'running',
        organizations_codes: [organizationsStore.current.code],
        tags: form.value.tags.map((tag) => tag.id),
    }

    if (form.value.category) {
        payload['project_categories_ids'] = [form.value.category.toString()]
    }
    isSaving.value = true
    try {
        const project = await createProject(payload)

        // fetch updated project list from user so permissions as set correctly
        await usersStore.getUser(usersStore.id)

        analytics.project.create({ id: project.id, title: project.title })

        await onboardingTrap('create_project', false)
        // reload current to user to get new permissions
        // maybe set a endpoint to fetch only permission ?
        const user = usersStore.userFromApi
        if (user) usersStore.getUser(user.id)
        router.push({
            name: 'projectDescription',
            params: { slugOrId: project.slug },
        })
        toaster.pushSuccess(t('toasts.project-create.success'))
    } catch (error) {
        toaster.pushError(`${t('toasts.project-create.error')} (${error})`)
        console.error(error)
    } finally {
        isSaving.value = false
    }
}

const submit = async () => {
    isFormCorrect.value = await v$.value.$validate()

    if (isFormCorrect.value) {
        isSaving.value = true
        doCreateProject()
    }
}

try {
    const runtimeConfig = useRuntimeConfig()
    const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
    useLpiHead(
        useRequestURL().toString(),
        computed(() => t('project.create.title')),
        organization?.dashboard_subtitle,
        organization?.banner_image?.variations?.medium
    )
} catch (err) {
    console.log(err)
}
</script>

<template>
    <ClientOnly>
        <div class="create-project">
            <div class="header">
                <h1>{{ $t('project.create.title') }}</h1>
                <p>
                    {{ $t('project.create.notice') }}
                    <NuxtLink :to="{ name: 'Help' }" class="help-link"
                        >{{ $t('project.create.help-link') }}
                    </NuxtLink>
                </p>
            </div>
            <div class="project-form">
                <LazyProjectForm
                    :categories="categories"
                    ref="projectForm"
                    v-model="form"
                    @close="$emit('close')"
                    :validation="v$"
                />

                <LazyLpiSnackbar
                    v-if="!isFormCorrect"
                    class="completed-form-snackbar"
                    icon="ExclamationMark"
                    type="warning"
                >
                    <div v-html="$t('project.form.completed-info-to-access-presentation')"></div>
                </LazyLpiSnackbar>

                <div class="actions">
                    <LpiButton
                        :disabled="isSaving"
                        :label="$t('common.cancel')"
                        :secondary="true"
                        class="submit-btn"
                        @click="cancel"
                        data-test="cancel-project-create-button"
                    />
                    <LpiButton
                        :disabled="!formNotEmpty || isSaving"
                        :label="$t('project.form.create-project')"
                        :btn-icon="isSaving ? 'LoaderSimple' : null"
                        class="submit-btn"
                        @click="submit"
                        data-test="project-create-button"
                    />
                </div>
            </div>
        </div>
    </ClientOnly>
</template>

<style lang="scss" scoped>
.create-project {
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
