<script setup lang="ts">
import { useKeycloak } from '@dsb-norge/vue-keycloak-js'

const keycloak = useKeycloak()

// a dummy component that redirects to keycloak login page
// used in keycloak registration flow to hackishly redirect to keycloak login page...
onMounted(() => keycloak.login())
// TODO(remi): i18n redirecting
</script>
<template><p>Redirecting...</p></template>
