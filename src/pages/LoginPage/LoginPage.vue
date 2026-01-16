<script setup lang="ts">
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
// a dummy component that redirects to keycloak login page
// used in keycloak registration flow to hackishly redirect to keycloak login page...
onMounted(goToKeycloakLoginPage)
// TODO(remi): i18n redirecting
</script>
<template><p>Redirecting...</p></template>
