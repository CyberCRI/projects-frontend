<template><p>Redirecting...</p></template>
<script>
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
// a dummy component that redirects to keycloak login page
// used in keycloak registration flow to hackishly redirect to keycloak login page...
export default {
    name: 'LoginPage',
    mounted() {
        goToKeycloakLoginPage()
    },
}
</script>
