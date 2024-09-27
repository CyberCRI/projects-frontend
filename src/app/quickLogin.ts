import { goToKeycloakLoginPage } from '@/api/auth/auth.service'

export default function quickLogin() {
    // speedy redirect to keycloak login without loading the whole app
    if (window.location.pathname === '/login') {
        goToKeycloakLoginPage()
    }
}
