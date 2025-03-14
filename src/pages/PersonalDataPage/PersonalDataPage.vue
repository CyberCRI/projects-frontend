<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  useLpiHead(
    useRequestURL().toString(),
    'Politique de protection des données personnelles',
    organization?.dashboard_subtitle,
    organization?.banner_image?.variations?.medium
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="page-section-narrow legal-page personal-data page-top">
    <h1 class="page-title">Politique de protection des données personnelles</h1>

    <section>
      <h3>1. Préambule</h3>
      <div>
        <p>
          Le responable de chaque portail et le Learning Planet Institute, désigné ci-après LPI,
          attachent une grande importance à la protection des Données à caractère personnel qu’il
          ont à collecter et traiter en tant que co-responsables de traitement.
        </p>
        <p>
          Ils veillent conjointement au respect des dispositions du Règlement européen n° 2016/679
          relatif à la protection des personnes physiques à l'égard du traitement des données à
          caractère personnel (ci-après « RGPD ») et de la loi n° 78-17 du 6 janvier 1978 modifiée
          relative à l'informatique, aux fichiers et aux libertés.
        </p>
        <p>
          Ainsi, la collecte et le Traitement des Données à caractère personnel effectué par les
          co-responsables de traitement relativement à ses Utilisateur, ci-après définis, sont régis
          par la présente politique de protection des données (ci-après désignée « la Politique »).
        </p>
        <p>
          Pour une bonne compréhension de la présente Politique, les termes employés avec une
          majuscule ont la définition qui leur est donnée ci-après. Les termes ont la même
          définition qu’ils soient employés au singulier ou au pluriel :
        </p>
        <ul>
          <li>
            Les « Responsables du traitement » désigne le LPI, dont le siège social est situé au 8
            bis rue Charles V, 75 004 Paris, ainsi que l’organisme responsable de ce portail. Ce
            dernier est la personne morale qui détermine les finalités et les moyens des
            Traitements;
          </li>
          <li>
            Une « Donnée à caractère personnel » est toute information relative à une personne
            physique susceptible d'être identifiée, directement ou indirectement.
          </li>
          <li>
            Le « Sous-traitant » s’entend de toute personne physique ou morale qui traite des
            données à caractère personnel pour le compte du responsable du traitement. Il s’agit en
            pratique des prestataires avec lesquels le LPI travaille et qui interviennent sur les
            données à caractère personnel;
          </li>
          <li>
            Les « Personnes concernées » sont les personnes qui peuvent être identifiées,
            directement ou indirectement, et leurs données à caractère personnel font l’objet d’une
            collecte par le Responsable du traitement, en l'occurrence, au titre des présentes,
            l’ensemble des Utilisateurdu LPI, Alumni ou Candidats du LPI. Dans le cadre des
            recherches menées par le LPI, les sujets dont les données seront traitées sont
            considérées in fine comme des Personnes concernées.
          </li>
          <li>
            Les « Utilisateurs » sont les usagers de la plateforme, dans le but de partager leurs
            projets, profils et compétences au sein de leur organisation et potentiellement auprès
            du grand public.
          </li>
          <li>
            Les « Destinataires » des données s’entendent des personnes physiques ou morales qui
            reçoivent communication des données à caractère personnel. Les destinataires des données
            peuvent donc être aussi bien des membres du personnels du LPI,que des organismes
            extérieurs (établissements, organismes sociaux, gestionnaire de bourse, etc.).
          </li>
        </ul>
        <p />
      </div>
      <h3>2. Objet</h3>
      <p>
        Cette Politique a pour but de présenter aux Personnes concernées la manière dont les
        Responsables du traitement traitent les Données à caractère personnel.
      </p>
      <p>
        Les Personnes concernées sont ainsi invitées à lire attentivement la présente Politique pour
        connaître et comprendre les pratiques des Responsables du traitement quant aux Traitements
        des Données à caractère personnel qu’ils mettent en œuvre les concernant.
      </p>
      <h3>3. Portée</h3>
      <p>
        Cette Politique ne porte que sur les traitements sur le portail dont les Responsables du
        traitement sont responsables et ne vise donc pas les traitements qui ne seraient pas
        validés, créés ou exploités par eux- mêmes.
      </p>
      <p>
        Le Traitement de données à caractère personnel peut être géré directement par eux ou par le
        biais d’un sous- traitant spécifiquement désigné.
      </p>
      <p>
        Ce document est indépendant de tout autre document pouvant s’appliquer aux Responsables du
        traitement, notamment les chartes des systèmes d’information, et les chartes administratives
        par exemple.
      </p>
      <h3>4. Opposabilité</h3>
      <p>Le présent document est opposable :</p>
      <ul>
        <li>
          LPI et le responsable du Portail en leur qualité de « co-responsable du traitement » au
          sens du RGPD ;
        </li>
        <li>Aux Utilisateurs du tels que définis au paragraphe 1 des présentes;</li>
        <li>
          Aux personnes à qui sont communiquées ces Données (ci-après « Destinataire des données »)
          ;
        </li>
        <li>
          Aux prestataires du LPI qui traitent des données pour son compte (ci-après les «
          sous-traitants »).
        </li>
      </ul>
      <p />

      <h3>5. Principes généraux</h3>
      <p>
        Aucun traitement n’est mis en œuvre par le LPI concernant des Données à caractère personnel
        des Personnes concernées s’il n’a pas été préalablement approuvé par le Délégué à la
        Protection des Données (DPD) désigné par le LPI et/ou s’il ne répond pas aux principes
        généraux du RGPD.
      </p>
      <p>
        Tout nouveau Traitement, modification ou suppression d’un Traitement existant sera porté à
        la connaissance des Personnes concernées.
      </p>
      <p>
        La collecte et le traitement des données des Personnes concernées par la Présente Politique
        sont fondés sur les bases légales suivantes :
      </p>
      <ul>
        <li>D’un consentement explicite;</li>
        <li>
          L’exécution des missions relevant de l’intérêt légitime du responsable de traitement;
        </li>
        <li>Dans le cadre du respect d’obligations légales;</li>
        <li>L’exécution d’un contrat.</li>
      </ul>
      <p />

      <h3>6. Finalités</h3>
      <p>
        Les données sont collectées pour assurer le bon fonctionnement et permettre
        l’accomplissement des missions de l’organisme responsable du portail ou de respecter des
        obligations légales.
      </p>
      <p>
        Ainsi le porteur du portail traite les données des Personnes concernées pour les finalités
        suivantes :
      </p>

      <h4>6.1 Partage de projets</h4>
      <ul>
        <li>
          Documentation de projets par leurs participants, dans le but de les faire connaître à
          d’autres équipes.
        </li>
        <li>
          Partage d’information sur ces projets sur le Web en vue de promouvoir ceux-ci et les
          activités des membres de l’équipe, sous le contrôle total de chaque contributeur à la
          plateforme.
        </li>
        <li>
          Selon les cas, la finalité peut-être pédagogique, de vulgarisation scientifique ou pour
          faire connaître les activités de la structure.
        </li>
        <li>
          Traitements statistiques des données des projets, en vue de regrouper ceux-ci pour les
          présenter aux Utilisateurs par thématiques spécifiques.
        </li>
      </ul>
      <p />

      <h4>6.2 Partage de profil d’Utilisateur</h4>
      <ul>
        <li>
          Partage volontaire, optionnel et sous son contrôle des données de profil de l’Utilisateur,
          qui décide de leur visibilité : nom, prénom, titre, biographie succinte, lieu de travail,
          principales activités, centres d’intérêt, comptes de réseaux sociaux professionnels et
          personnels.
        </li>
        <li>
          Affichage des compétences et centre d’intérêt de l’Utilisateur, sous son contrôle, en vue
          d’un apprentissage ou de la mise en avant de son portfolio de compétences.
        </li>
        <li>
          L’objectif des Utilisateurs est de promouvoir leur profil et leurs activités, au sein de
          leur communauté locale ou sur le web, de façon totalement volontaire et sous leur contrôle
          personnel.
        </li>
      </ul>
      <p />

      <h4>6.3 Gestion de la plateforme</h4>
      <ul>
        <li>
          Permettre à l’Utilisateur de créer un compte Utilisateur en vue d’accéder à la plateforme;
        </li>
        <li>
          Analyser les usages faits de la plateforme pour optimiser celle-ci, et pour développer de
          nouvelles fonctionnalités;
        </li>
        <li>
          Permettre la sauvegarde de documents et travaux scolaires via l’ENT et/ou l’intranet;
        </li>
        <li>
          Analyser les données internes à la plateforme pour proposer au sein de celle-ci des
          recommandations personnalisées de personnes, contenus ou projets aux Utilisateurs.
        </li>
      </ul>
      <p />

      <h3>7. Destinataires des données - habilitation et traçabilité</h3>
      <p>
        Les co-responsables du traitement de données s’assurent que les Données personnelles que les
        Utilisateurs n’ont pas souhaité rendre explicitement publiques sur le Web ne sont
        accessibles qu’à des destinataires internes ou externes autorisés et habilités par elle
        conformément à sa politique d’habilitation.
      </p>
      <p>Ces personnes sont soumises à une obligation de confidentialité.</p>
      <p>
        Ce partage reste limité aux données strictement nécessaires à l’exécution des finalités
        telles que décrites au point 6 des présentes. Dans ce cadre, peuvent être considérés comme
        Destinataires :
      </p>
      <ul>
        <li>
          Les services internes au LPI amenés à traiter les Données dans le cadre de leurs activités
          et habilités à cet effet;
        </li>
        <li>Les administrateurs du portail;</li>
        <li>
          Les sous-traitants du LPI, dans le cadre du traitement technique des certaines données,
          soumis à une stricte exigence de confidentialité.
        </li>
      </ul>
      <p>
        Les prestataires commerciaux des plateformes d&#39;enseignement en ligne ne seront
        destinataires d&#39;aucune Donnée à caractère personnel. Aucune des Données à caractère
        personnel transmises à des partenaires privés ne sont susceptibles de réutilisation
        commerciale.
      </p>
      <p>
        Les responsables du traitement des données ne sont en aucun cas responsables des dommages de
        toute nature qui peuvent résulter d’un accès illicite aux données à caractère personnel.
      </p>

      <h3>8. Durée de conservation</h3>
      <p>
        Les responsables de traitement se conforment aux durées d’utilité administrative établies
        dans le respect des délais de prescription en matière civile, commerciale ou pénale, fondés
        sur les textes. Par défaut, les données sont conservées pendant la durée de publication des
        projets associés.
      </p>
      <p>
        Passés ces délais, ou lors de la suppression explicite des données par un utilisateur, ces
        données peuvent être, soit :
      </p>
      <ul>
        <li>Supprimées immédiatement de l’interface de l’application ;</li>
        <li>
          Archivées à titre conservatoire un an, notamment pour des raisons de sécurité et de
          sauvegarde ;
        </li>
      </ul>
      <p>
        Il est rappelé que la suppression ou l’anonymisation sont des opérations irréversibles et
        que le LPI n’est plus, par la suite, en mesure de les restaurer.
      </p>

      <h3>9. Droit RGPD</h3>
      <p>
        La Personne concernée par un traitement dans le cadre des présentes dispose d’un ensemble de
        droits prévus par le Règlement Générale sur la Protection des Données:
      </p>
      <ul>
        <li>Droit à l’information préalable</li>
        <li>Droit d’accès</li>
        <li>Droit de rectification</li>
        <li>Droit d’effacement et droit à l’oubli</li>
        <li>Droit d’opposition</li>
        <li>Droit à la portabilité</li>
        <li>Droit à la limitation</li>
      </ul>
      <p>
        En cas de demande, les responsables de traitement s’engagent à répondre dans les meilleurs
        délais (un mois maximum par défaut, étendu à 2 mois en cas de difficultés techniques
        particulières) aux demandes légitimes d’exercice des droits.
      </p>
      <p>Les modalités d’exercice de droits sont les suivantes :</p>
      <ul>
        <li>
          La demande doit émaner de la personne elle-même. En cas de doute raisonnable sur
          l’identité du demandeur et pour éviter les usurpations d’identité, les responsables de
          traitement peuvent être amenés à demander de joindre tout document permettant de prouver
          son identité (par exemple une copie de la carte d’identité);
        </li>
        <li>Être formulée par écrit à l’adresse suivante : dpo@learningplanetinstitute.org</li>
      </ul>
      <p>
        En cas de demande de copie supplémentaire, le LPI pourra exiger la prise en charge
        financière de ce coût par la personne concernée.
      </p>
      <p>
        La Personne concernée qui présente la demande recevra les informations sous une forme
        électronique d’usage courant, sauf demande contraire.
      </p>
      <p>
        Le droit d’accès ne doit pas être exercé de manière abusive c’est-à-dire réalisé de manière
        régulière dans le seul but de déstabiliser le service concerné.
      </p>
      <h3>10. Mise à jour - Actualisation et rectification</h3>
      <p>
        Afin de permettre une mise à jour régulière des données à caractère personnel collectées
        dans le cadre des présentes, les responsables de traitement pourront solliciter la Personne
        concernée qui aura pour obligation de satisfaire aux demandes.
      </p>
      <p>
        En cas de modification des informations de la Personne concernée par les responsables de
        traitement, cette dernière en sera informée.
      </p>
      <p>
        La Personne concernée dispose également d’un droit à la rectification de ses données. Pour
        ce faire, les responsables de traitement mettent à disposition tous les moyens nécessaires
        en ligne ou hors ligne pour que la Personne concernée lui fasse part de toutes modifications
        sur ses données à caractère personnel. Cette obligation ne saurait toutefois s’imposer
        lorsqu’une telle démarche s’avère impossible ou exige des efforts disproportionnés.
      </p>
      <h3>11. Droit à l'effacement</h3>
      <p>
        Le droit à l’effacement de la Personne concernée ne sera pas applicable dans les cas où le
        Traitement de données est mis en œuvre pour répondre à une obligation légale.
      </p>
      <p>
        En dehors de cette situation, la Personne concernée pourra demander l’effacement de ses
        données dans les cas limitatifs suivants :
      </p>
      <ul>
        <li>
          Les données à caractère personnel ne sont plus nécessaires au regard des finalités pour
          lesquelles elles ont été collectées ou traitées d’une autre manière ;
        </li>
        <li>
          Lorsque la Personne concernée retire le consentement sur lequel est fondé le traitement et
          qu’il n’existe pas d’autre fondement juridique au traitement ;
        </li>
        <li>
          La Personne concernée s’oppose à un traitement fondé sur l’exécution d’une mission
          d’intérêt public ou nécessaire aux fins des intérêts légitimes poursuivis par les
          responsables de traitement s’il n’existe pas de motif légitime impérieux pour le
          Traitement ;
        </li>
        <li>
          La Personne concernée s’oppose à un Traitement de ses données à caractère personnel à des
          fins de prospection, y compris au profilage ;
        </li>
        <li>Les Données à caractère personnel ont fait l’objet d’un traitement illicite ;</li>
        <li>
          Les Données à caractère personnel doivent être effacées pour respecter une obligation
          légale qui est prévue par le droit de l’Union ou par le droit de l’État membre auquel les
          responsables de traitement sont soumis.
        </li>
      </ul>
      <p>
        Conformément à la législation sur la protection des données à caractère personnel, la
        Personne concernée est informée qu’il s'agit d'un droit individuel qui ne peut être exercé
        par elle seule, relativement à ses propres informations. Pour des raisons de sécurité, le
        service concerné devra donc vérifier son identité afin d'éviter toute communication
        d'informations confidentielles le concernant à une personne autre que celle-ci.
      </p>

      <h3>12. Droit à la limitation</h3>
      <p>
        Les Personnes concernées disposent du droit à la limitation du traitement de leurs données.
        Celui-ci s’applique dans le cas où une Personne concernée souhaite contester l’exactitude de
        ses données. Les responsables de traitement s’engagent dans un délai d’un mois pour répondre
        à la demande de rectification ou d’opposition et peut prolonger ce délai si la demande est
        complexe ou nécessite une étude complémentaire. C’est dans cette période de prolongation que
        les responsables de traitement devront suspendre les traitements des données concernées et
        ne plus les utiliser.
      </p>

      <h3>13. Droit à la portabilité</h3>
      <p>
        Le droit à la portabilité donne la possibilité aux Personnes concernées de demander à
        récupérer les données qu’elles ont fournies sur une plateforme, pour un usage personnel ou
        pour les transmettre à un tiers de leur choix. La Personne concernée pourra, sur demande,
        exercer son droit à la portabilité sur les seules données qu’elle a elle-même communiquées.
        Ces données lui seront communiquées dans un format structuré, couramment utilisé et lisible
        par une machine.
      </p>

      <h3>14. Droit post mortem</h3>
      <p>
        La Personne concernée dispose du droit de formuler des directives concernant la
        conservation, l’effacement et la communication de ses données post-mortem. La communication
        de directives spécifiques post-mortem et l’exercice de leurs droits s’effectuent par
        courrier électronique à l’adresse suivante : dpo@learningplanetinstitute.org
      </p>

      <h3>15. Caractère facultatif ou obligatoire des réponses</h3>
      <p>
        La Personne concernée est informée sur chaque formulaire de collecte des données à caractère
        personnel du caractère obligatoire ou facultatif des réponses par la présence d’un
        astérisque.
      </p>
      <p>
        Dans le cas où des réponses sont obligatoires, les responsables de traitement indiquent à la
        Personne concernée les conséquences d’une absence de réponse.
      </p>

      <h3>16. Sous-traitance</h3>
      <p>
        Le LPI peut être amenée à faire intervenir tout sous-traitant de son choix dans le cadre des
        Traitements qu’elle met en œuvre.
      </p>
      <p>
        Dans ce cas, le LPI s’assure du respect par le sous-traitant de ses obligations en vertu du
        RGPD.
      </p>
      <p>
        Le LPI s’engage à imposer aux sous-traitants les mêmes obligations en matière de protection
        des données qu’elle-même. De plus, il se réserve le droit de demander auprès des
        sous-traitants, leur politique de conformité au RGPD.
      </p>

      <h3>17. Origine des données collectées</h3>
      <p>Les données collectées par le LPI sont soit :</p>
      <ul>
        <li>Collectées directement auprès des Personnes concernées;</li>
        <li>Collectées de manière indirecte.</li>
      </ul>
      <p />

      <h3>17.1 Données collectées directement</h3>
      <p>La collecte directe des données prend différentes formes :</p>
      <ul>
        <li>
          Données collectées lors de l’inscription ou de la réinscription d’un Utilisateur sur la
          plateforme (nom, prénom, organisation, email);
        </li>
        <li>
          Données saisies directement par un Utilisateur sur son profil, ses projets ou ses
          compétences;
        </li>
        <li>
          Données techniques (données de connexion ou de trafic) liées à l’usage des services
          informatique ou numérique du LPI;
        </li>
        <li>
          Données collectées lors des événements ou opérations organisées par les responsables de
          traitement;
        </li>
        <li>...</li>
      </ul>
      <p />

      <h3>17.2 Données collectées de manière indirecte</h3>
      <p>La collecte indirecte des données peuvent prendre différentes formes :</p>
      <ul>
        <li>
          Données collectées via la connexion de plateformes tierces dans des cadres spécifiquement
          encadrés : connexion à Moodle d’un portail d’apprentissage, connexion à la base de comptes
          d’une entreprise.
        </li>
        <li>
          Le cas échéant, ces cas de figure seront encadrés par des documents spécifiques au cas par
          cas.
        </li>
      </ul>
      <p />

      <h3>18. Sécurité</h3>
      <p>
        Le LPI définit et met en œuvre les mesures techniques et organisationnelles de sécurité,
        physique ou logique, qu’elle estime appropriées pour lutter contre la destruction, la perte,
        l’altération ou la divulgation non autorisée des données de manière accidentelle ou illicite
        ou toute autre forme de violation définie par le RGPD.
      </p>
      <p>
        Pour ce faire, le LPI peut se faire assister de tout tiers de son choix pour procéder, aux
        fréquences qu’elle estimera nécessaire, à des audits de vulnérabilité ou des tests
        d’intrusion.
      </p>
      <p>
        Le LPI s’engage, en cas de changement des moyens visant à assurer la sécurité et la
        confidentialité des données à caractère personnel, à les remplacer par des moyens d’une
        performance identique ou supérieure. Aucune évolution ne pourra conduire à une régression du
        niveau de sécurité.
      </p>
      <p>
        En cas de sous-traitance d’une partie ou de la totalité d’un traitement de données à
        caractère personnel, le LPI s’engage à imposer contractuellement à ses sous-traitants des
        garanties de sécurité par le biais de mesures techniques de protection de ces données et les
        moyens humains appropriés.
      </p>

      <h3>19. Violation des données</h3>
      <p>Les coordonnées du délégué à la protection des données du LPIsont les suivantes :</p>
      <ul class="list">
        <li>Délégué à la protection des données personnelles du LPI</li>
        <li>8 rue Charles V</li>
        <li>75004 Paris</li>
        <li>Mail : dpo@learningplanetinstitute.org</li>
      </ul>
      <p>
        Si la Personne concernée souhaite obtenir une information ou souhaite poser une question
        particulière, il lui est possible de saisir le délégué à la protection des données à
        l’adresse postale ou électronique ci-avant exposée, qui lui donnera une réponse dans un
        délai raisonnable au regard de la question posée ou de l’information requise.
      </p>
      <p>
        En cas de problème rencontré avec le Traitement des données à caractère personnel, la
        Personne concernée peut saisir le délégué à la protection des données à l’adresse postale ou
        électronique ci-avant exposée.
      </p>

      <h3>21. Flux transfrontières</h3>
      <p>
        Le transfert de données ou de dossiers à l&#39;étranger effectué dans le cadre de la
        mobilité internationale des étudiants est soumis au recueil du consentement exprès de
        l&#39;intéressé.
      </p>
      <p>
        Le LPI s’engage si nécessaire à signer un ou plusieurs contrats permettant d’encadrer les
        flux transfrontières de données.
      </p>
      <p>
        Les dispositions relatives aux flux transfrontières sont opposables au LPI, sauf dans les
        cas dérogatoires prévus à l’article 49 du RGPD.
      </p>

      <h3>22. Registre des traitements</h3>
      <p>
        Les Responsables de Traitement tiennent chacun à jour un registre de toutes les activités de
        Traitement effectuées dans le cadre des présentes. Ces registres permettent de recenser
        l’ensemble des Traitements mis en œuvre par les Responsables de traitement.
      </p>
      <p>
        Les Responsables de traitment s’engagent à fournir à l’autorité de contrôle, les
        renseignements permettant à ladite autorité de vérifier la conformité des Traitements à la
        règlementation informatique et libertés en vigueur.
      </p>

      <h3>23. Droit d'introduire une réclamation auprès de la CNIL</h3>
      <p>
        Toute Personne concernée par le Traitement de ses données à caractère personnel est informé
        de son droit d’introduire une plainte auprès d&#39;une autorité de contrôle, à savoir la
        Cnil, si celle-ci estime que le Traitement de Données à caractère personnel le concernant
        n&#39;est pas conforme à la règlementation, à l’adresse suivante :
      </p>
      <ul class="list">
        <li>CNIL</li>
        <li>Service des plaintes</li>
        <li>3, place de Fontenoy – TSA 80715</li>
        <li>75334 PARIS Cedex 7</li>
        <li>Tél : 01 53 73 22 22</li>
      </ul>
      <p />

      <h3>24. Evolution</h3>
      <p>
        Les Responsables de traitment peuvent être amenés à modifier, compléter ou mettre à jour la
        présente Politique. Nous vous invitons à consulter régulièrement la dernière version en
        vigueur, accessible sur le site internet de l’établissement.
      </p>
    </section>
  </div>
</template>
