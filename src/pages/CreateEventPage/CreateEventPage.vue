<template>
  <div class="page-section-narrow page-top">
    <h1 class="page-title">
      {{ $t('event.create.title') }}
    </h1>
    <ClientOnly>
      <EventForm ref="eventForm" v-model="form" @invalid="invalid = $event" />
    </ClientOnly>
    <div class="form-actions">
      <LpiButton
        :disabled="asyncing"
        :label="$t('common.cancel')"
        secondary
        class="footer__left-button"
        data-test="close-button"
        @click="cancel"
      />

      <LpiButton
        :disabled="invalid || asyncing"
        :label="$t('common.confirm')"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        class="footer__right-button"
        data-test="confirm-button"
        @click="saveEvent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { createEvent } from '~/api/event.service'
import useToasterStore from '~/stores/useToaster'
import { defaultForm } from '~/form/event'

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const router = useRouter()
const { t } = useNuxtI18n()

const asyncing = ref(false)
const form = ref(defaultForm())
const invalid = ref(false)
const eventForm = useTemplateRef('eventForm')

const cancel = () => {
  form.value = defaultForm()
  router.push({ name: 'CalendarPage' })
}

const saveEvent = async () => {
  const isValid = await eventForm.value?.v$.$validate()
  if (!isValid) {
    return
  }

  try {
    asyncing.value = true
    const formData = {
      organization_code: organizationCode,
      ...form.value,
      start_date: form.value.start_date.toISOString(),
      end_date: (form.value.end_date || form.value.start_date).toISOString(),
      people_groups: Object.entries(form.value.people_groups)
        .filter(([, value]) => value)
        .map(([id]) => id),
    }
    await createEvent(organizationCode, formData)
    toaster.pushSuccess(t('event.save.success'))
  } catch (err) {
    toaster.pushError(`${t('event.save.error')} (${err})`)
    console.error(err)
  } finally {
    asyncing.value = false
    router.push({ name: 'CalendarPage' })
  }
}

useLpiHead2({
  title: computed(() => t('event.create.title')),
})
</script>

<style lang="scss" scoped>
.page-title {
  margin-bottom: pxToRem(60px);
}

.form-actions {
  flex-shrink: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: $border-width-s solid $lighter-gray;
  color: $primary-dark;
  font-weight: 700;
  padding-top: $space-l;
  padding-bottom: $space-l;
  position: sticky;
  bottom: 0;
  background: $white;
  gap: $space-l;

  button ~ button {
    text-transform: capitalize;
  }
}
</style>
