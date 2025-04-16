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
    <h1 class="page-title">
      Plan de Continuit&eacute; d&#39;Activit&eacute; (PCA) pour l&#39;&Eacute;quipe Plateforme du
      Learning Planet Institute
    </h1>
    <section>
      <h3>1. Objectifs du PCA</h3>
      <ul>
        <li>
          Assurer la continuit&eacute; des op&eacute;rations en cas de crise ou de perturbation.
        </li>
        <li>Minimiser les impacts sur les services et les utilisateurs.</li>
        <li>Garantir une reprise rapide et efficace des activit&eacute;s normales.</li>
      </ul>
      <p></p>
    </section>
    <section>
      <h3>2. &Eacute;valuation des Risques</h3>

      <ul>
        <li>
          <strong>Identification des risques :</strong>
          Liste des risques potentiels (pannes techniques, cyberattaques, d&eacute;sastres naturels,
          absences prolong&eacute;es de membres cl&eacute;s).
        </li>
        <li>
          <strong>D&eacute;tail :</strong>
          type de risque pr&eacute;cis &nbsp;
        </li>
        <li>
          <strong>Analyse de l&#39;Impact :</strong>
          &Eacute;valuation des cons&eacute;quences de chaque risque sur les op&eacute;rations.
        </li>
        <li>
          <strong>Probabilit&eacute; d&#39;Occurrence :</strong>
          &Eacute;valuation de la probabilit&eacute; que chaque risque se produise.
        </li>
        <li>
          <strong>Action(s) pr&eacute;ventive(s) :</strong>
          actions mises en place qui r&eacute;duire le risque ou limiter les cons&eacute;quences de
          son activation
        </li>
      </ul>
      <p></p>
      <table>
        <thead>
          <tr>
            <th colspan="1" rowspan="1">
              <p>Risque</p>
            </th>
            <th colspan="1" rowspan="1">
              <p>D&eacute;tail</p>
            </th>
            <th colspan="1" rowspan="1">
              <p>Analyse d&#39;impact</p>
            </th>
            <th colspan="1" rowspan="1">
              <p>Probabilit&eacute; d&#39;occurrence</p>
            </th>
            <th colspan="1" rowspan="1">
              <p>Action(s) pr&eacute;ventive(s)</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colspan="1" rowspan="5">
              <p>Cyber attaque - intrusion</p>
              <p></p>
            </th>
            <td colspan="1" rowspan="1">
              <p>Vol de donn&eacute;es</p>
              <p></p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Cons&eacute;quences juridiques</p>
              <p></p>
              <p>R&eacute;utilisation ill&eacute;gale des donn&eacute;es</p>
              <p></p>
              <p>Perte de cr&eacute;dibilit&eacute; de la plateforme</p>
              <p></p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Faible</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>S&eacute;curisation des mots de passe</p>
              <p></p>
              <p>
                Limitation de l&#39;acc&egrave;s sur tous les environnement (production et
                d&eacute;veloppement)
              </p>
              <p></p>
              <p>S&eacute;paration des droits</p>
            </td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">
              <p></p>
              <p>Perte de donn&eacute;es</p>
              <p></p>
              <p></p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Perte de cr&eacute;dibilit&eacute; de la plateforme</p>
              <p></p>
              <p></p>
              <p>Incapacit&eacute; d&rsquo;utiliser les services</p>
              <p></p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Moyenne - erreur humaine</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>S&eacute;curisation des mots de passe</p>
              <p></p>
              <p>Limitation de l&#39;acc&egrave;s</p>
              <p></p>
              <p>Proc&eacute;dure de backups</p>
            </td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">
              <p>D&eacute;gradation volontaire</p>
              <p></p>
              <p></p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Perte de cr&eacute;dibilit&eacute; de la plateforme</p>
              <p></p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Moyenne</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Proc&eacute;dure de signalisation puis correction rapide</p>
              <p></p>
              <p>S&eacute;curisation des mots de passe</p>
              <p></p>
              <p>Limitation de l&#39;acc&egrave;s</p>
              <p></p>
            </td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">
              <p>Utilisation frauduleuse et clandestine des serveurs</p>
              <p></p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Extension du blast radius &agrave; d&rsquo;autres services num&eacute;riques</p>
              <p></p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Faible</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>S&eacute;curisation des mots de passe</p>
              <p></p>
              <p>Limitation de l&#39;acc&egrave;s</p>
              <p></p>
              <p>Monitoring de l&#39;activit&eacute;</p>
            </td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">
              <p>Phishing et impersonation de compte</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Extension du blast radius &agrave; d&rsquo;autres services num&eacute;riques</p>
              <p></p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Moyenne - erreur humaine</p>
              <p></p>
              <p>Risque accru d&#39;impersonation d&ucirc; &agrave; l&rsquo;IA</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>S&eacute;curisation des mots de passe</p>
              <p></p>
              <p>Limitation de l&#39;acc&egrave;s</p>
              <p></p>
              <p>Double authentification g&eacute;n&eacute;ralis&eacute;e</p>
            </td>
          </tr>
          <tr>
            <th colspan="1" rowspan="1">
              <p>Cyber attaque - d&eacute;ni de service</p>
            </th>
            <td colspan="1" rowspan="1">
              <p>Attaque informatis&eacute;e</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Perte de cr&eacute;dibilit&eacute; de la plateforme</p>
              <p></p>
              <p>Incapacit&eacute; d&rsquo;utiliser les services</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Moyenne</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Limitation de sur-utilisation des services</p>
            </td>
          </tr>
          <tr>
            <th colspan="1" rowspan="2">
              <p>Humain</p>
              <p></p>
            </th>
            <td colspan="1" rowspan="1">
              <p>Absence de Personnel Cl&eacute;</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Incapacit&eacute; &agrave; maintenir la plateforme op&eacute;rationnelle</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Moyenne</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Duplication des comp&eacute;tences</p>
              <p>
                <br />
                Documentation des proc&eacute;dures cl&eacute;s
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">
              <p>Non paiement d&rsquo;un prestataire cl&eacute;</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Incapacit&eacute; d&rsquo;utiliser les services</p>
              <p></p>
              <p>Perte de donn&eacute;es</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Faible</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Processus de rappel et de suivi en commun avec les services financiers</p>
            </td>
          </tr>
          <tr>
            <th colspan="1" rowspan="2">
              <p>Technique</p>
              <p></p>
            </th>
            <td colspan="1" rowspan="1">
              <p>
                Interruption totale ou partielle du prestataire Cloud et/ou de services
                num&eacute;riques critiques
              </p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Incapacit&eacute; d&rsquo;utiliser les services</p>
              <p></p>
              <p>Perte de donn&eacute;es</p>
              <p></p>
              <p>Perte d&rsquo;activit&eacute; contractuelle</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Faible</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>G&eacute;o-r&eacute;plication</p>
            </td>
          </tr>
          <tr>
            <td colspan="1" rowspan="1">
              <p>Baisse de performance en cas de pic de charge</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Incapacit&eacute; d&rsquo;utiliser les services</p>
              <p></p>
              <p>Perte de cr&eacute;dibilit&eacute; de la plateforme</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Moyenne</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Tests de mont&eacute;e en charge</p>
              <p></p>
              <p>Flexibilit&eacute; du dimensionnement des ressources cloud</p>
            </td>
          </tr>
          <tr>
            <th colspan="1" rowspan="1">
              <p>Juridique</p>
            </th>
            <td colspan="1" rowspan="1">
              <p>Attaque par un usager (RGPD, droit &agrave; l&rsquo;image&hellip;)</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Perte financi&egrave;re</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Faible</p>
            </td>
            <td colspan="1" rowspan="1">
              <p>Conseil juridique (DPO et cabinet d&rsquo;avocats)</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p></p>
    </section>
    <section>
      <h3>3. Strat&eacute;gies de Continuit&eacute;</h3>
      <h4>Sauvegarde des Donn&eacute;es :</h4>
      <ul>
        <li>
          <strong>Fr&eacute;quence :</strong>
          Quotidienne
        </li>
        <li>
          <strong>M&eacute;thode :</strong>
          Sauvegardes automatis&eacute;es sur le cloud g&eacute;o-r&eacute;pliqu&eacute;, et
          v&eacute;rifi&eacute;
        </li>
      </ul>
      <p></p>
      <h4>Plan de Reprise apr&egrave;s Sinistre :</h4>
      <ul>
        <li>
          <strong>Infrastructure :</strong>
          g&eacute;o r&eacute;plication des serveurs de secours et de solutions de cloud computing.
          D&eacute;ploiement des services via infra-as code, facile &agrave; red&eacute;ployer.
        </li>
        <li>
          <strong>Restauration des Services :</strong>
          Proc&eacute;dures pour la restauration rapide des services en cas de d&eacute;faillance
          majeure.
        </li>
      </ul>
      <p></p>
      <h4>Plan de Communication d&#39;Urgence :</h4>
      <ul>
        <li>
          <strong>Contacts Cl&eacute;s :</strong>
          DevOps (principal), dev back (secondaire).
        </li>
        <li>
          <strong>Canaux de communication :</strong>
          messagerie instantan&eacute;e, t&eacute;l&eacute;phone mobile, email.
        </li>
      </ul>
      <p></p>
    </section>
    <section>
      <h3>4. R&ocirc;les et Responsabilit&eacute;s</h3>
      <ul>
        <li>
          <strong>Responsable de la Continuit&eacute; d&#39;Activit&eacute; :</strong>
          Stanislas Bruhi&egrave;re, DevOps, charg&eacute; de la mise en &oelig;uvre et de la
          gestion du PCA.
        </li>
      </ul>
      <p></p>
      <ul>
        <li>
          <strong>&Eacute;quipe de R&eacute;ponse &agrave; la Crise :</strong>
          Responsable de la Plateforme, DevOps, CIO, D&eacute;veloppeur Back, D&eacute;veloppeur
          Front.
        </li>
      </ul>
      <p></p>
      <ul>
        <li>
          <strong>Support Technique :</strong>
          support 1er niveau, puis escalade au personnel technique
        </li>
      </ul>
      <p></p>
    </section>
    <section>
      <h3>5. Proc&eacute;dures d&rsquo;Urgence</h3>
      <h4>Identification et &Eacute;valuation de l&rsquo;Incident :</h4>
      <ul>
        <li>
          <strong>D&eacute;tection :</strong>
          M&eacute;thodes de d&eacute;tection pr&eacute;coce des incidents :
          <ul>
            <li>
              scripts automatis&eacute;s de d&eacute;tection d&rsquo;incident (uptime monitoring,
              alerting via messagerie instantan&eacute;e)
            </li>
            <li>
              <strong>Canaux de remont&eacute;e d&rsquo;incident par les usagers :</strong>
              messagerie d&eacute;di&eacute;e, email.
            </li>
            <li>
              Notification &agrave; l&rsquo;ANSSI (sous 24h apr&egrave;s d&eacute;tection d&rsquo;un
              incident majeur)
            </li>
          </ul>
        </li>
      </ul>

      <ul>
        <li>
          <strong>&Eacute;valuation :</strong>
          Processus pour &eacute;valuer la gravit&eacute; et l&rsquo;impact de l&rsquo;incident sous
          le contr&ocirc;le du support niveau 1.
        </li>
      </ul>
      <p></p>
      <h4>R&eacute;ponse Imm&eacute;diate :</h4>
      <ul>
        <li>
          <strong>Mesures :</strong>
          Isolation /arr&ecirc;t des services compromis. Rotation des mots de passe.
          <strong>Processus d&rsquo;escalade :</strong>
          support niveau 1, niveau 2, direction.
        </li>
        <li>
          <strong>Notification :</strong>
          Information aux parties prenantes internes et externes : groupes email, messagerie interne
          &agrave; l&rsquo;application
        </li>
      </ul>
      <p></p>
      <h4>Gestion de la Crise :</h4>
      <ul>
        <li>
          <strong>Coordination :</strong>
          R&eacute;unions d&rsquo;urgence pour coordonner la r&eacute;ponse. Implication du service
          de communication si n&eacute;cessaire.
        </li>
        <li>
          <strong>Documentation :</strong>
          Enregistrement des actions entreprises et des d&eacute;cisions prises sur le
          syst&egrave;me de documentation. D&eacute;brief post mortem de l&rsquo;incident.
        </li>
      </ul>
      <p></p>
    </section>
    <section>
      <h3>6. Reprise des Activit&eacute;s</h3>
      <ul>
        <li>
          <strong>&Eacute;valuation de la Situation :</strong>
          Analyse de la situation apr&egrave;s l&rsquo;incident pour d&eacute;terminer les
          &eacute;tapes de reprise.
        </li>
        <li><strong>Plan de Reprise :</strong></li>
      </ul>
      <ul>
        <li>
          <strong>Priorit&eacute;s :</strong>
          Identification des services critiques &agrave; r&eacute;tablir en premier.
        </li>
        <li>
          <strong>Ressources :</strong>
          Allocation des ressources n&eacute;cessaires pour la reprise.
        </li>
      </ul>
      <ul>
        <li>
          <strong>Tests de Reprise :</strong>
          Simulation de la reprise apr&egrave;s sinistre pour &eacute;valuer
          l&rsquo;efficacit&eacute; du plan.
        </li>
      </ul>
      <p></p>
    </section>
    <section>
      <h3>7. Formation et Sensibilisation</h3>
      <ul>
        <li>
          <strong>Formation des membres :</strong>
          Sessions de formation r&eacute;guli&egrave;res pour tous les membres de
          l&rsquo;&eacute;quipe sur les proc&eacute;dures de continuit&eacute;
          d&rsquo;activit&eacute;.
        </li>
        <li><strong>Ecriture d&#39;un mod&egrave;le de post-mortem</strong></li>
        <li>
          <strong>Simulations :</strong>
          Exercices r&eacute;guliers pour tester la pr&eacute;paration et la
          r&eacute;activit&eacute; de l&rsquo;&eacute;quipe en cas d&rsquo;incident.
        </li>
      </ul>
      <p></p>
    </section>
    <section>
      <h3>8. R&eacute;vision et Mise &agrave; Jour</h3>
      <ul>
        <li>
          <strong>R&eacute;vision R&eacute;guli&egrave;re :</strong>
          Mise &agrave; jour du PCA tous les 6 mois pour tenir compte des changements dans les
          processus ou l&rsquo;infrastructure.
        </li>
        <li>
          <strong>Retour d&rsquo;Exp&eacute;rience :</strong>
          Analyse des incidents pass&eacute;s pour am&eacute;liorer les proc&eacute;dures.
        </li>
      </ul>
      <p></p>
    </section>
    <section>
      <h3>9. Documentation</h3>
      <ul>
        <li>
          <strong>Documents du PCA :</strong>
          Stockage s&eacute;curis&eacute; des documents relatifs au PCA (plans, proc&eacute;dures,
          contacts) sur une plateforme en ligne d&eacute;di&eacute;e &agrave; la documentation
          (Confluence)
        </li>
        <li>
          <strong>Acc&egrave;s :</strong>
          les membres de l&rsquo;&eacute;quipe ont un acc&egrave;s rapide et facile aux documents
          essentiels en cas de crise.
        </li>
      </ul>
    </section>
  </div>
</template>
