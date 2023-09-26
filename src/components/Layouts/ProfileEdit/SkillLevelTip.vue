<template>
    <ToolTip :hover="true">
        <slot></slot>
        <template #custom-content>
            <div class="tip-ctn">
                <p>{{ $t('profile.edit.skills.tip.intro-edit') }}</p>
                <ul>
                    <li>
                        <strong>{{ $t('profile.edit.skills.tip.curious.title') }}</strong>
                        <br />
                        {{ $t('profile.edit.skills.tip.curious.description') }}
                    </li>
                    <li>
                        <strong>{{ $t('profile.edit.skills.tip.basic.title') }}</strong>
                        <br />
                        {{ $t('profile.edit.skills.tip.basic.description') }}
                    </li>
                    <li>
                        <strong>{{ $t('profile.edit.skills.tip.competent.title') }}</strong>
                        <br />
                        {{ $t('profile.edit.skills.tip.competent.description') }}
                    </li>
                    <li>
                        <strong>{{ $t('profile.edit.skills.tip.expert.title') }}</strong>
                        <br />
                        {{ $t('profile.edit.skills.tip.expert.description') }}
                    </li>
                </ul>
            </div>
        </template>
    </ToolTip>
</template>
<script>
import ToolTip from '@/components/lpikit/ToolTip/ToolTip.vue'

export default {
    name: 'SkillLevelTip',

    components: {
        ToolTip,
    },
}
</script>
<style lang="scss" scoped>
.tip-ctn {
    max-width: 20rem;
    padding: $space-m;

    p {
        margin-bottom: $space-m;
    }

    strong {
        font-weight: 700;
    }

    ul {
        list-style-type: disc;
        margin-left: $space-m;
    }

    li + li {
        margin-top: $space-s;
    }
}
</style>
