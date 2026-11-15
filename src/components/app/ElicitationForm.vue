<template>
  <form @submit.prevent="submit" @reset="reset" class="elicitation-form">
    <!--pre>
         {{ JSON.stringify(elicitation, null, 2) }}
      </pre-->

    <div v-for="requestKey in requestKeys" :key="requestKey">
      <!--pre>{{ JSON.stringify(requests[requestKey], null, 2) }}</pre-->

      <ElicitationSubForm
        :request-key="requestKey"
        :request-body="requests[requestKey]"
        v-model="response"
      />
    </div>

    <div class="actions">
      <LpiButton type="reset" :label="$t('common.cancel')" secondary />
      <LpiButton type="submit" :label="$t('common.submit')" />
    </div>
  </form>
</template>
<script setup>
const props = defineProps({ elicitation: Object })
const emit = defineEmits(['elicitation-answered', 'elicitation-canceled'])

// TODO multiple elicitaitons
const requests = computed(() => props.elicitation?.elicitations?.[0].requests || {})
const requestKeys = computed(() => Object.keys(requests.value))

const response = ref(() => {})

const submit = (evt) => {
  const form = evt.target
  const formData = new FormData(form)
  var payload = {}
  formData.forEach((value, key) => {
    const [reqKey, fieldKey] = key.replace(']', '').split('[')
    if (!payload[reqKey]) payload[reqKey] = {}
    payload[reqKey][fieldKey] = value
  })
  console.log('payload', payload)
  emit('elicitation-answered', payload)
}

const reset = (evt) => {
  console.log('reset')
  emit('elicitation-canceled')
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
