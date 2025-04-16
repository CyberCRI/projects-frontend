<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    "Plan de Sécurité des Systèmes d'Information",
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="page-section-narrow legal-page pssi page-top">
    <h1 class="page-title">
      Plan de S&eacute;curit&eacute; des Syst&egrave;mes d&#39;Information (PSSI) pour
      l&#39;Association Learning Planet Institute (LPI)
    </h1>
    <section>
      <h3>1. Introduction</h3>
      <ul>
        <li>
          <strong>Objectif :</strong>
          Assurer la s&eacute;curit&eacute; des syst&egrave;mes d&#39;information de
          l&#39;association pour prot&eacute;ger les donn&eacute;es des &eacute;tudiants et des
          enseignants chercheurs, ainsi que l&rsquo;ensemble des utilisateurs de nos plateformes
        </li>
        <li>
          <strong>Champ d&#39;application :</strong>
          Ce PSSI s&#39;applique &agrave; toutes les ressources informatiques et donn&eacute;es
          g&eacute;r&eacute;es par l&rsquo;&eacute;quipe plateforme num&eacute;rique du LPI.
        </li>
      </ul>
    </section>
    <section>
      <h3>2. Politique de S&eacute;curit&eacute;</h3>
      <ul>
        <li>
          <strong>Engagement :</strong>
          La direction du P&ocirc;le s&#39;engage &agrave; prot&eacute;ger les syst&egrave;mes
          d&#39;information contre les menaces et &agrave; garantir la confidentialit&eacute;,
          l&#39;int&eacute;grit&eacute; et la disponibilit&eacute; des donn&eacute;es.
        </li>
        <li>
          <strong>Objectifs :</strong>
          Prot&eacute;ger les donn&eacute;es personnelles, assurer la continuit&eacute; des
          services, et pr&eacute;venir les violations de s&eacute;curit&eacute;.
        </li>
      </ul>
    </section>
    <section>
      <h3>3. Organisation de la S&eacute;curit&eacute;</h3>
      <ul>
        <li>
          <strong>Responsable S&eacute;curit&eacute; :</strong>
          Stanislas Bruhi&egrave;re, charg&eacute; de la gestion de la s&eacute;curit&eacute; des
          syst&egrave;mes d&#39;information.
        </li>
        <li>
          <strong>&Eacute;quipe S&eacute;curit&eacute; :</strong>
          membres techniques de l&rsquo;&eacute;quipe plateformes (d&eacute;veloppeurs front-end et
          back-end des plateformes, &eacute;quipe support IT, responsable support plateformes)
        </li>
      </ul>
    </section>
    <section>
      <h3>4. &Eacute;valuation des Risques</h3>
      <ul>
        <li>
          <strong>Identification :</strong>
          Recensement des menaces potentielles comme les cyberattaques et les erreurs humaines tels
          que d&eacute;crits dans le Plan de Continuit&eacute; d&#39;activit&eacute;.
        </li>
        <li>
          <strong>Analyse :</strong>
          &Eacute;valuation des impacts possibles sur les activit&eacute;s et les donn&eacute;es.
        </li>
        <li>
          <strong>Traitement :</strong>
          Strat&eacute;gies d&#39;att&eacute;nuation et plan de r&eacute;ponse aux risques
          identifi&eacute;s.
        </li>
      </ul>
    </section>
    <section>
      <h3>5. Contr&ocirc;les de S&eacute;curit&eacute;</h3>
      <h4>Contr&ocirc;les Techniques :</h4>
      <ul>
        <li>
          <strong>Gestion des Acc&egrave;s :</strong>
          Authentification forte et gestion des permissions, avec un traitement sp&eacute;cifique
          des comptes d&rsquo;administration.
        </li>
        <li>
          <strong>Cryptographie :</strong>
          Chiffrement des donn&eacute;es sensibles.
        </li>
        <li>
          <strong>Protection :</strong>
          Pare-feu, antivirus, et syst&egrave;mes de d&eacute;tection d&#39;intrusion.
        </li>
        <li>
          <strong>S&eacute;curisation des donn&eacute;es :</strong>
          G&eacute;o-r&eacute;plication des donn&eacute;es, sauvegardes r&eacute;guli&egrave;res
        </li>
      </ul>
      <p></p>
      <h4>Contr&ocirc;les Organisationnels :</h4>
      <ul>
        <li>
          R&egrave;gles de s&eacute;curit&eacute; pour le traitement des donn&eacute;es et
          l&#39;utilisation des syst&egrave;mes.
        </li>
        <li>Signature de la charte informatique par les employ&eacute;s</li>
        <li>Signature de la carte administrateur par les personnes habilit&eacute;es</li>
        <li>
          Processus de nettoyage des comptes obsol&egrave;te (en continu et audit tous les 6 mois)
        </li>
        <li>Processus de rotation des mots de passe</li>
      </ul>
    </section>
    <section>
      <h3>6. D&eacute;tection &amp; gestion des Incidents de S&eacute;curit&eacute;</h3>
      <ul>
        <li>
          <strong>Identification :</strong>
          Processus de signalement des incidents (voir PCA).
        </li>
        <li>
          <strong>R&eacute;ponse :</strong>
          Proc&eacute;dures pour la gestion et la r&eacute;solution des incidents (voir PCA).
        </li>
        <li>
          <strong>Analyse :</strong>
          Post-mortem pour am&eacute;liorer les pratiques de s&eacute;curit&eacute;.
        </li>
      </ul>
    </section>
    <section>
      <h3>7. Formation et Sensibilisation</h3>
      <ul>
        <li>
          <strong>Formation :</strong>
          Sessions r&eacute;guli&egrave;res pour sensibiliser les employ&eacute;s aux risques de
          s&eacute;curit&eacute; et aux bonnes pratiques.
        </li>
        <li>
          <strong>Sensibilisation :</strong>
          Communication continue sur les politiques de s&eacute;curit&eacute; et les
          proc&eacute;dures.
        </li>
      </ul>
    </section>
    <section>
      <h3>8. Conformit&eacute; et Audits</h3>
      <ul>
        <li>
          <strong>Conformit&eacute; :</strong>
          Respect des r&eacute;glementations en vigueur (RGPD, etc.). Suivi des traitements de
          donn&eacute;es personnelles coordonn&eacute; par la DPO.
        </li>
        <li>
          <strong>Audits :</strong>
          V&eacute;rifications r&eacute;guli&egrave;res pour &eacute;valuer
          l&rsquo;efficacit&eacute; des mesures de s&eacute;curit&eacute;.
        </li>
      </ul>
    </section>
    <section>
      <h3>9. Plan de Continuit&eacute; des Activit&eacute;s</h3>
      <ul>
        <li>
          <strong>Pr&eacute;paration :</strong>
          Mesures pour maintenir les op&eacute;rations en cas d&rsquo;incident majeur (voir PCA).
        </li>
        <li>
          <strong>Reprise :</strong>
          Plan pour la restauration des services apr&egrave;s une interruption.
        </li>
      </ul>
      <h3>10. R&eacute;vision du PSSI</h3>
      <ul>
        <li>
          <strong>Mise &agrave; Jour :</strong>
          R&eacute;vision annuelle du PSSI pour refl&eacute;ter les &eacute;volutions technologiques
          et les nouvelles menaces, sous la responsabilit&eacute; du DevOps / responsable
          s&eacute;curit&eacute;.
        </li>
        <li>
          <strong>Documentation :</strong>
          Conservation des documents de s&eacute;curit&eacute; &agrave; jour et accessibles sur la
          plateforme en ligne Confluence.
        </li>
      </ul>
    </section>
  </div>
</template>
