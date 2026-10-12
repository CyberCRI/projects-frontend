<template>
  <div v-if="user.researcher">
    <div v-html="content"></div>
    <div class="actions">
      <LinkButton :label="$t('common.see-more')" btn-icon="Plus" />
      <LinkButton :label="$t('researcher.download-resume')" btn-icon="TrayArrowDown" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const content = ref(`
  <p>CRI co-founder and director, former research director, Ariel currently heads the Biology for Global Good Department and mentors the research group leaders at the LPI. Ariel was the former director of the AIRE master and director of studies of FIRE PhD program, where he continues to teach and mentor and keep enjoying mentoring the Paris Bettencourt iGEM team since 2006.</p>
  <p>Ariel is an INSERM tenured research director and serves as the director of INSERM/Université de Paris Cité Systems Engineering and Evolution Dynamics Unit (UMR1284) harboured at LPI. He graduated from the Hebrew University, Jerusalem "Amirim" interdisciplinary program (Chemistry major) and received my M.Sc. and Ph.D. from the Weizmann Institute of Science in Chemical Immunology. Following research stints at the Scripps Institute  (California) and MRC (Cambridge), he received EMBO and Marie Curie postdoctoral fellowships to joined the lab of Miro Radman in Paris. His current research revolves around two axes: systems and synthetic biology as well as open and citizen science on SDGs and learning disabilities. His major scientific contributions in past 5 years include publications in Nature, Science, Cell and PNAS journals and were supported by HFSP, EU, national, Axa Fund and MSDAvenir competitive grants.</p>`)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}
</style>
