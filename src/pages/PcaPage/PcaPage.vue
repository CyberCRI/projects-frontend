<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    "Plan de Continuité d'Activité",
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="page-section-narrow legal-page pca page-top">
    <h1
      id="plan-de-continuité-dactivité-pca-pour-léquipe-plateforme-du-learning-planet-institute"
      class="page-title"
    >
      Plan de Continuité d’Activité (PCA) pour l’Équipe Plateforme du Learning Planet Institute
    </h1>
    <section>
      <h3 id="objectifs-du-pca">1. Objectifs du PCA</h3>
      <ul>
        <li>
          Assurer la continuité des opérations en cas de crise ou de perturbation.
          <br />
        </li>
        <li>
          Minimiser les impacts sur les services et les utilisateurs.
          <br />
        </li>
        <li>Garantir une reprise rapide et efficace des activités normales.</li>
      </ul>
    </section>
    <section>
      <h3 id="évaluation-des-risques">2. Évaluation des Risques</h3>
      <ul>
        <li>
          <strong>Identification des risques</strong>
          : Liste des risques potentiels (pannes techniques, cyberattaques, désastres naturels,
          absences prolongées de membres clés).
          <br />
        </li>
        <li>
          <strong>Détail</strong>
          : type de risque précis
          <br />
        </li>
        <li>
          <strong>Analyse de l’Impact</strong>
          : Évaluation des conséquences de chaque risque sur les opérations.
          <br />
        </li>
        <li>
          <strong>Probabilité d’Occurrence</strong>
          : Évaluation de la probabilité que chaque risque se produise.
          <br />
        </li>
        <li>
          <strong>Action(s) préventive(s)</strong>
          : actions mises en place qui réduire le risque ou limiter les conséquences de son
          activation
        </li>
      </ul>
      <table>
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
        </colgroup>
        <thead>
          <tr class="header">
            <th style="text-align: left">Risque</th>
            <th style="text-align: left">Détail</th>
            <th style="text-align: left">Analyse d’impact</th>
            <th style="text-align: left">Probabilité d’occurrence</th>
            <th style="text-align: left">Action(s) préventive(s)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="odd">
            <td style="text-align: left">Cyber attaque - intrusion</td>
            <td style="text-align: left">Vol de données</td>
            <td style="text-align: left">
              Conséquences juridiques Réutilisation illégale des données Perte de crédibilité de la
              plateforme
            </td>
            <td style="text-align: left">Faible</td>
            <td style="text-align: left">
              Sécurisation des mots de passe Limitation de l’accès sur tous les environnement
              (production et développement) Séparation des droits
            </td>
          </tr>
          <tr class="even">
            <td style="text-align: left"></td>
            <td style="text-align: left">Perte de données</td>
            <td style="text-align: left">
              Perte de crédibilité de la plateforme Incapacité d’utiliser les services
            </td>
            <td style="text-align: left">Moyenne - erreur humaine</td>
            <td style="text-align: left">
              Sécurisation des mots de passe Limitation de l’accès Procédure de backups
            </td>
          </tr>
          <tr class="odd">
            <td style="text-align: left"></td>
            <td style="text-align: left">Dégradation volontaire</td>
            <td style="text-align: left">Perte de crédibilité de la plateforme</td>
            <td style="text-align: left">Moyenne</td>
            <td style="text-align: left">
              Procédure de signalisation puis correction rapide Sécurisation des mots de passe
              Limitation de l’accès
            </td>
          </tr>
          <tr class="even">
            <td style="text-align: left"></td>
            <td style="text-align: left">Utilisation frauduleuse et clandestine des serveurs</td>
            <td style="text-align: left">
              Extension du blast radius à d’autres services numériques
            </td>
            <td style="text-align: left">Faible</td>
            <td style="text-align: left">
              Sécurisation des mots de passe Limitation de l’accès Monitoring de l’activité
            </td>
          </tr>
          <tr class="odd">
            <td style="text-align: left"></td>
            <td style="text-align: left">Phishing et impersonation de compte</td>
            <td style="text-align: left">
              Extension du blast radius à d’autres services numériques
            </td>
            <td style="text-align: left">
              Moyenne - erreur humaine Risque accru d’impersonation dû à l’IA
            </td>
            <td style="text-align: left">
              Sécurisation des mots de passe Limitation de l’accès Double authentification
              généralisée
            </td>
          </tr>
          <tr class="even">
            <td style="text-align: left">Cyber attaque - déni de service</td>
            <td style="text-align: left">Attaque informatisée</td>
            <td style="text-align: left">
              Perte de crédibilité de la plateforme Incapacité d’utiliser les services
            </td>
            <td style="text-align: left">Moyenne</td>
            <td style="text-align: left">Limitation de sur-utilisation des services</td>
          </tr>
          <tr class="odd">
            <td style="text-align: left">Humain</td>
            <td style="text-align: left">Absence de Personnel Clé</td>
            <td style="text-align: left">Incapacité à maintenir la plateforme opérationnelle</td>
            <td style="text-align: left">Moyenne</td>
            <td style="text-align: left">
              Duplication des compétences
              <br />
              Documentation des procédures clés
            </td>
          </tr>
          <tr class="even">
            <td style="text-align: left"></td>
            <td style="text-align: left">Non paiement d’un prestataire clé</td>
            <td style="text-align: left">Incapacité d’utiliser les services Perte de données</td>
            <td style="text-align: left">Faible</td>
            <td style="text-align: left">
              Processus de rappel et de suivi en commun avec les services financiers
            </td>
          </tr>
          <tr class="odd">
            <td style="text-align: left">Technique</td>
            <td style="text-align: left">
              Interruption totale ou partielle du prestataire Cloud et/ou de services numériques
              critiques
            </td>
            <td style="text-align: left">
              Incapacité d’utiliser les services Perte de données Perte d’activité contractuelle
            </td>
            <td style="text-align: left">Faible</td>
            <td style="text-align: left">Géo-réplication</td>
          </tr>
          <tr class="even">
            <td style="text-align: left"></td>
            <td style="text-align: left">Baisse de performance en cas de pic de charge</td>
            <td style="text-align: left">
              Incapacité d’utiliser les services Perte de crédibilité de la plateforme
            </td>
            <td style="text-align: left">Moyenne</td>
            <td style="text-align: left">
              Tests de montée en charge Flexibilité du dimensionnement des ressources cloud
            </td>
          </tr>
          <tr class="odd">
            <td style="text-align: left">Juridique</td>
            <td style="text-align: left">Attaque par un usager (RGPD, droit à l’image…)</td>
            <td style="text-align: left">Perte financière</td>
            <td style="text-align: left">Faible</td>
            <td style="text-align: left">Conseil juridique (DPO et cabinet d’avocats)</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
      <h3 id="stratégies-de-continuité">3. Stratégies de Continuité</h3>
      <ul>
        <li>
          <strong>Sauvegarde des Données</strong>
          :
          <ul>
            <li>
              <strong>Fréquence</strong>
              : Quotidienne
              <br />
            </li>
            <li>
              <strong>Méthode</strong>
              : Sauvegardes automatisées sur le cloud géo-répliqué, et vérifié
            </li>
          </ul>
        </li>
        <li>
          <strong>Plan de Reprise après Sinistre</strong>
          :
          <ul>
            <li>
              <strong>Infrastructure</strong>
              : géo réplication des serveurs de secours et de solutions de cloud computing.
              Déploiement des services via infra-as code, facile à redéployer.
              <br />
            </li>
            <li>
              <strong>Restauration des Services</strong>
              : Procédures pour la restauration rapide des services en cas de défaillance majeure.
            </li>
          </ul>
        </li>
        <li>
          <strong>Plan de Communication d’Urgence</strong>
          :
          <ul>
            <li>
              <strong>Contacts Clés</strong>
              : DevOps (principal), dev back (secondaire).
              <br />
            </li>
            <li>
              <strong>Canaux de communication</strong>
              : messagerie instantanée, téléphone mobile, email.
            </li>
          </ul>
        </li>
      </ul>
    </section>
    <section>
      <h3 id="rôles-et-responsabilités">4. Rôles et Responsabilités</h3>
      <ul>
        <li>
          <p>
            <strong>Responsable de la Continuité d’Activité</strong>
            : Stanislas Bruhière, DevOps, chargé de la mise en œuvre et de la gestion du PCA.
          </p>
        </li>
        <li>
          <p>
            <strong>Équipe de Réponse à la Crise</strong>
            : Responsable de la Plateforme, DevOps, CIO, Développeur Back, Développeur Front.
          </p>
        </li>
        <li>
          <p>
            <strong>Support Technique</strong>
            : support 1er niveau, puis escalade au personnel technique
          </p>
        </li>
      </ul>
    </section>
    <section>
      <h3 id="procédures-durgence">5. Procédures d’Urgence</h3>
      <ul>
        <li>
          <strong>Identification et Évaluation de l’Incident</strong>
          :
          <ul>
            <li>
              <strong>Détection</strong>
              : Méthodes de détection précoce des incidents :
              <ul>
                <li>
                  Scripts automatisés de détection d’incident (uptime monitoring, alerting via
                  messagerie instantanée)
                  <br />
                </li>
                <li>
                  Canaux de remontée d’incident par les usagers : messagerie dédiée, email.
                  <br />
                </li>
                <li>
                  Notification à l’ANSSI (sous 24h après détection d’un incident majeur)
                  <br />
                </li>
              </ul>
            </li>
            <li>
              <strong>Évaluation</strong>
              : Processus pour évaluer la gravité et l’impact de l’incident sous le contrôle du
              support niveau 1.
            </li>
          </ul>
        </li>
        <li>
          <strong>Réponse Immédiate</strong>
          :
          <ul>
            <li>
              <strong>Mesures</strong>
              : Isolation /arrêt des services compromis. Rotation des mots de passe. Processus
              d’escalade : support niveau 1, niveau 2, direction.
              <br />
            </li>
            <li>
              <strong>Notification</strong>
              : Information aux parties prenantes internes et externes : groupes email, messagerie
              interne à l’application
            </li>
          </ul>
        </li>
        <li>
          <strong>Gestion de la Crise</strong>
          :
          <ul>
            <li>
              <strong>Coordination</strong>
              : Réunions d’urgence pour coordonner la réponse. Implication du service de
              communication si nécessaire.
              <br />
            </li>
            <li>
              <strong>Documentation</strong>
              : Enregistrement des actions entreprises et des décisions prises sur le système de
              documentation. Débrief post mortem de l’incident.
            </li>
          </ul>
        </li>
      </ul>
    </section>
    <section>
      <h3 id="reprise-des-activités">6. Reprise des Activités</h3>
      <ul>
        <li>
          <strong>Évaluation de la Situation</strong>
          : Analyse de la situation après l’incident pour déterminer les étapes de reprise.
          <br />
        </li>
        <li>
          <strong>Plan de Reprise</strong>
          :
          <ul>
            <li>
              <strong>Priorités</strong>
              : Identification des services critiques à rétablir en premier.
              <br />
            </li>
            <li>
              <strong>Ressources</strong>
              : Allocation des ressources nécessaires pour la reprise.
              <br />
            </li>
          </ul>
        </li>
        <li>
          <strong>Tests de Reprise</strong>
          : Simulation de la reprise après sinistre pour évaluer l’efficacité du plan.
        </li>
      </ul>
    </section>
    <section>
      <h3 id="formation-et-sensibilisation">7. Formation et Sensibilisation</h3>
      <ul>
        <li>
          <strong>Formation des membres</strong>
          : Sessions de formation régulières pour tous les membres de l’équipe sur les procédures de
          continuité d’activité.
          <br />
        </li>
        <li>
          <strong>Ecriture d’un modèle de post-mortem</strong>
          <br />
        </li>
        <li>
          <strong>Simulations</strong>
          : Exercices réguliers pour tester la préparation et la réactivité de l’équipe en cas
          d’incident.
        </li>
      </ul>
    </section>
    <section>
      <h3 id="révision-et-mise-à-jour">8. Révision et Mise à Jour</h3>
      <ul>
        <li>
          <strong>Révision Régulière</strong>
          : Mise à jour du PCA tous les 6 mois pour tenir compte des changements dans les processus
          ou l’infrastructure.
          <br />
        </li>
        <li>
          <strong>Retour d’Expérience</strong>
          : Analyse des incidents passés pour améliorer les procédures.
        </li>
      </ul>
    </section>
    <section>
      <h3 id="documentation">9. Documentation</h3>
      <ul>
        <li>
          <strong>Documents du PCA</strong>
          : Stockage sécurisé des documents relatifs au PCA (plans, procédures, contacts) sur une
          plateforme en ligne dédiée à la documentation (Confluence)
          <br />
        </li>
        <li>
          <strong>Accès</strong>
          : les membres de l’équipe ont un accès rapide et facile aux documents essentiels en cas de
          crise.
        </li>
      </ul>
    </section>
    <p class="last-updated">Dernière mise à jour : 29 septembre 2025</p>
  </div>
</template>
