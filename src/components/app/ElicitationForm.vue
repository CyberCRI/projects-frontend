<template>
  <form class="elicitation-form" @submit.prevent="submit" @reset="reset">
    <!--pre>
         {{ JSON.stringify(elicitation, null, 2) }}
      </pre-->

    <div v-for="requestKey in requestKeys" :key="requestKey">
      <!--pre>{{ JSON.stringify(requests[requestKey], null, 2) }}</pre-->

      <ElicitationSubForm
        v-model="response"
        :request-key="requestKey"
        :request-body="requests[requestKey]"
      />
    </div>

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

const submit = (evt) => {
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

.actions {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
}
</style>
