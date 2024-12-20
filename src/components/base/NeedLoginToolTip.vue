<template>
    <ToolTip :disabled="isOrgUser" interactive placement="top">
        <template #custom-content>
            <p class="notice">{{ $t('common.need-login') }}</p>
            <p class="action">
                <LpiButton :label="$t('home.login')" :secondary="false" @click="logInUser" />
            </p>
        </template>
        <slot :need-login="!isOrgUser"></slot>
    </ToolTip>
</template>
<script>
import ToolTip from '@/components/base/ToolTip.vue'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import permissions from '@/mixins/permissions.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
    name: 'NeedLoginToolTip',
    mixins: [permissions],
    components: {
        ToolTip,
        LpiButton,
    },
    methods: {
        logInUser() {
            goToKeycloakLoginPage()
        },
    },
}
</script>
<style lang="scss" scoped>
.notice {
    font-size: $font-size-l;
    text-align: center;
    margin-bottom: 1rem;
}

.action {
    display: flex;
    justify-content: center;
}
</style>
