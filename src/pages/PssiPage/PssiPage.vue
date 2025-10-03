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
    <h1
      id="plan-de-sécurité-des-systèmes-dinformation-pssi-pour-lassociation-learning-planet-institute-lpi"
      class="page-title"
    >
      Plan de Sécurité des Systèmes d’Information (PSSI) pour l’Association Learning Planet
      Institute (LPI)
    </h1>
    <section>
      <h3 id="introduction">1. Introduction</h3>
      <ul>
        <li>
          <strong>Objectif</strong>
          : Assurer la sécurité des systèmes d’information de l’association pour protéger les
          données des étudiants et des enseignants chercheurs, ainsi que l’ensemble des utilisateurs
          de nos plateformes
          <br />
        </li>
        <li>
          <strong>Champ d’application</strong>
          : Ce PSSI s’applique à toutes les ressources informatiques et données gérées par l’équipe
          plateforme numérique du LPI.
        </li>
      </ul>
    </section>
    <section>
      <h3 id="politique-de-sécurité">2. Politique de Sécurité</h3>
      <ul>
        <li>
          <strong>Engagement</strong>
          : La direction du Pôle s’engage à protéger les systèmes d’information contre les menaces
          et à garantir la confidentialité, l’intégrité et la disponibilité des données.
          <br />
        </li>
        <li>
          <strong>Objectifs</strong>
          : Protéger les données personnelles, assurer la continuité des services, et prévenir les
          violations de sécurité.
        </li>
      </ul>
    </section>
    <section>
      <h3 id="organisation-de-la-sécurité">3. Organisation de la Sécurité</h3>
      <ul>
        <li>
          <strong>Responsable Sécurité</strong>
          : Stanislas Bruhière, chargé de la gestion de la sécurité des systèmes d’information.
          <br />
        </li>
        <li>
          <strong>Équipe Sécurité</strong>
          : membres techniques de l’équipe plateformes (développeurs front-end et back-end des
          plateformes, équipe support IT, responsable support plateformes)
        </li>
      </ul>
    </section>
    <section>
      <h3 id="évaluation-des-risques">4. Évaluation des Risques</h3>
      <ul>
        <li>
          <strong>Identification</strong>
          : Recensement des menaces potentielles comme les cyberattaques et les erreurs humaines
          tels que décrits dans le Plan de Continuité d’activité.
          <br />
        </li>
        <li>
          <strong>Analyse</strong>
          : Évaluation des impacts possibles sur les activités et les données.
          <br />
        </li>
        <li>
          <strong>Traitement</strong>
          : Stratégies d’atténuation et plan de réponse aux risques identifiés.
        </li>
      </ul>
    </section>
    <section>
      <h3 id="contrôles-de-sécurité">5. Contrôles de Sécurité</h3>
      <ul>
        <li>
          <strong>Contrôles Techniques</strong>
          :
          <ul>
            <li>
              <strong>Gestion des Accès</strong>
              : Authentification forte et gestion des permissions, avec un traitement spécifique des
              comptes d’administration.
              <br />
            </li>
            <li>
              <strong>Cryptographie</strong>
              : Chiffrement des données sensibles.
              <br />
            </li>
            <li>
              <strong>Protection</strong>
              : Pare-feu, antivirus, et systèmes de détection d’intrusion.
              <br />
            </li>
            <li>
              <strong>Sécurisation des données</strong>
              : Géo-réplication des données, sauvegardes régulières
              <br />
            </li>
            <li>
              <strong>Architecture IA sécurisée par design</strong>
              : isolement du contexte transmis à chaque interaction avec un bot conversationnel,
              avec anonymisation quand c’est possible et pertinent, pour réduire les risques de
              fuites de données personnelles et de dérives de l’IA (hallucinations, jailbreaking…)
            </li>
          </ul>
        </li>
        <li>
          <strong>Contrôles Organisationnels</strong>
          :
          <ul>
            <li>
              Règles de sécurité pour le traitement des données et l’utilisation des systèmes.
              <br />
            </li>
            <li>
              Signature de la charte informatique par les employés
              <br />
            </li>
            <li>
              Signature de la carte administrateur par les personnes habilitées
              <br />
            </li>
            <li>
              Processus de nettoyage des comptes obsolète (en continu et audit tous les 6 mois)
              <br />
            </li>
            <li>Processus de rotation des mots de passe</li>
          </ul>
        </li>
      </ul>
      <h4 id="détection-gestion-des-incidents-de-sécurité">
        6. Détection &amp; gestion des Incidents de Sécurité
      </h4>
      <ul>
        <li>
          <strong>Identification</strong>
          : Processus de signalement des incidents (voir PCA).
          <br />
        </li>
        <li>
          <strong>Réponse</strong>
          : Procédures pour la gestion et la résolution des incidents (voir PCA).
          <br />
        </li>
        <li>
          <strong>Analyse</strong>
          : Post-mortem pour améliorer les pratiques de sécurité.
        </li>
      </ul>
      <h4 id="formation-et-sensibilisation">7. Formation et Sensibilisation</h4>
      <ul>
        <li>
          <strong>Formation</strong>
          : Sessions régulières pour sensibiliser les employés aux risques de sécurité et aux bonnes
          pratiques.
          <br />
        </li>
        <li>
          <strong>Sensibilisation</strong>
          : Communication continue sur les politiques de sécurité et les procédures.
        </li>
      </ul>
    </section>
    <section>
      <h3 id="conformité-et-audits">8. Conformité et Audits</h3>
      <ul>
        <li>
          <strong>Conformité</strong>
          : Respect des réglementations en vigueur (RGPD, etc.). Suivi des traitements de données
          personnelles coordonné par la DPO.
          <br />
        </li>
        <li>
          <strong>Audits</strong>
          : Vérifications régulières pour évaluer l’efficacité des mesures de sécurité.
        </li>
      </ul>
    </section>
    <section>
      <h3 id="plan-de-continuité-des-activités">9. Plan de Continuité des Activités</h3>
      <ul>
        <li>
          <strong>Préparation</strong>
          : Mesures pour maintenir les opérations en cas d’incident majeur (voir PCA).
          <br />
        </li>
        <li>
          <strong>Reprise</strong>
          : Plan pour la restauration des services après une interruption.
        </li>
      </ul>
    </section>
    <section>
      <h3 id="révision-du-pssi">10. Révision du PSSI</h3>
      <ul>
        <li>
          <strong>Mise à Jour</strong>
          : Révision annuelle du PSSI pour refléter les évolutions technologiques et les nouvelles
          menaces, sous la responsabilité du DevOps / responsable sécurité.
          <br />
        </li>
        <li>
          <strong>Documentation</strong>
          : Conservation des documents de sécurité à jour et accessibles sur la plateforme en ligne
          Confluence.
        </li>
      </ul>
    </section>
    <p class="last-updated">Dernière révision: 29 septembre 2025</p>
  </div>
</template>
