<template>
  <form
    ref="formEl"
    class="elicitation-form"
    @submit.prevent="submit"
    @reset="reset"
    @invalid.capture="formError = $t('chatbot.elicitation-invalid')"
    @input="clearErrorIfValid"
    @change="clearErrorIfValid"
  >
    <!--pre>
         {{ JSON.stringify(elicitation, null, 2) }}
      </pre-->

    <div v-for="requestKey in requestKeys" :key="requestKey">
      <!--pre>{{ JSON.stringify(requests[requestKey], null, 2) }}</pre-->

      <ElicitationSubForm :request-key="requestKey" :request-body="requests[requestKey]" />
    </div>

    <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>

    <div class="actions">
      <LpiButton type="reset" :label="$t('common.cancel')" secondary />
      <LpiButton type="submit" :label="$t('common.submit')" />
    </div>
  </form>
</template>
<script setup>
const props = defineProps({ elicitation: { type: Object, required: true } })
const emit = defineEmits(['elicitation-answered', 'elicitation-canceled'])

// TODO multiple elicitaitons
const requests = computed(() => props.elicitation?.elicitations?.[0].requests || {})
const requestKeys = computed(() => Object.keys(requests.value))

const coerce = (type, raw) => {
  if (type === 'boolean') return raw === 'on' || raw === true
  if (type === 'number' || type === 'integer')
    return raw === '' || raw == null ? undefined : Number(raw)
  return raw === '' || raw == null ? undefined : raw
}

const { t } = useI18n()
const formEl = useTemplateRef('formEl')
const formError = ref('')

const clearErrorIfValid = () => {
  if (formError.value && formEl.value?.checkValidity()) formError.value = ''
}

const submit = (evt) => {
  // safety net: never send the payload while the form is invalid
  if (!evt.target.checkValidity()) {
    formError.value = t('chatbot.elicitation-invalid')
    return
  }
  formError.value = ''
  const formData = new FormData(evt.target)
  const responses = {}
  for (const requestKey of requestKeys.value) {
    const props = requests.value[requestKey]?.requestedSchema?.properties || {}
    const content = {}
    for (const [field, def] of Object.entries(props)) {
      const value = coerce(def.type, formData.get(`${requestKey}[${field}]`))
      if (value !== undefined) content[field] = value
    }
    responses[requestKey] = { action: 'accept', content }
  }
  emit('elicitation-answered', responses)
}

const reset = () => {
  const responses = {}
  for (const requestKey of requestKeys.value) responses[requestKey] = { action: 'cancel' }
  emit('elicitation-canceled', responses)
}
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.elicitation-form {
  border: 1px solid variables.$primary-dark;
  border-radius: 0.4rem;
  padding: 0.6rem;
  margin-bottom: 1rem;
}

.form-error {
  margin-top: 1rem;
  color: variables.$salmon;
  font-weight: 600;
  text-align: right;
}

.actions {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
}
</style>
