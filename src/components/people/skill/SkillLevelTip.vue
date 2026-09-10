<template>
  <ToolTip :hover="true">
    <slot />
    <template #custom-content>
      <div class="tip-ctn">
        <p>{{ t('profile.edit.skills.tip.intro-edit') }}</p>
        <ul>
          <li>
            <strong>
              <SkillSteps :active-step="1" />
              <br />
              {{ t('profile.edit.skills.tip.curious.title') }}
            </strong>
            <br />
            {{ t('profile.edit.skills.tip.curious.description') }}
          </li>
          <li>
            <SkillSteps :active-step="2" />
            <br />
            <strong>{{ t('profile.edit.skills.tip.basic.title') }}</strong>
            <br />
            {{ t('profile.edit.skills.tip.basic.description') }}
          </li>
          <li>
            <SkillSteps :active-step="3" />
            <br />
            <strong>{{ t('profile.edit.skills.tip.competent.title') }}</strong>
            <br />
            {{ t('profile.edit.skills.tip.competent.description') }}
          </li>
          <li>
            <SkillSteps :active-step="4" />
            <br />
            <strong>{{ t('profile.edit.skills.tip.expert.title') }}</strong>
            <br />
            {{ t('profile.edit.skills.tip.expert.description') }}
          </li>
        </ul>
      </div>
    </template>
  </ToolTip>
</template>

<script setup lang="ts">
import ToolTip from '~/components/base/ToolTip.vue'
const { t } = useNuxtI18n()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.tip-ctn {
  max-width: 20rem;
  padding: variables.$space-m;

  p {
    margin-bottom: variables.$space-m;
  }

  strong {
    font-weight: 700;
  }

  ul {
    list-style-type: disc;
    margin-left: variables.$space-m;
  }

  li + li {
    margin-top: variables.$space-s;
  }
}
</style>
