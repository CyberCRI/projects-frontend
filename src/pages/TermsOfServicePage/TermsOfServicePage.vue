<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  useLpiHead(
    useRequestURL().toString(),
    'Conditions générales d’utilisation',
    organization?.dashboard_subtitle,
    organization?.banner_image?.variations?.medium
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="page-section-narrow legal-page terms-of-service page-top">
    <h1 class="page-title">Conditions générales d’utilisation</h1>

    <section>
      <h3>1. Objet</h3>
      <div>
        <p>
          Le Learning Planet Institute a développé et exploite une plateforme depuis l’adresse
          internet
          <a href="https://projects.directory">https://projects.directory</a>
          (ci-après la «
          <span>Plateforme</span>
          »).
        </p>
        <p>
          La Plateforme permet aux chercheurs, étudiants, entreprises, collectivités publiques,
          associations et autres organisations académiques qui y sont inscrits (ci-après,
          individuellement, le «
          <span>Contributeur</span>
          ») de décrire les projets de recherche qu’ils mènent (ci-après, les «
          <span>Projets</span>
          ») et d’interagir avec les autres Contributeurs par échange de commentaires sur les
          Projets (ci-après les «
          <span>Commentaires</span>
          »).
        </p>
        <p>
          Les Contributeurs sont ci-après désignés ensemble la «
          <span>Communauté</span>
          »
        </p>
        <p>
          La Plateforme permet également à tout visiteur non inscrit (ci-après, le «
          <span>Visiteur</span>
          ») de consulter les Projets, de consulter les Commentaires et de répondre à des annonces
          et offres de collaboration sur les Projets (ci-après, les «
          <span>Offres de collaboration</span>
          »).
        </p>
        <p>
          L’ensemble des services ainsi proposés sur la Plateforme sont dénommés ci-après ensemble,
          les «
          <span>Services</span>
          ».
        </p>
        <p>
          Les Contributeurs et les Visiteurs sont ci-après désignés ensemble les «
          <span>Utilisateurs</span>
          ». Le Learning Planet Institute et les Utilisateurs sont ci-après désignés ensemble ou
          individuellement les «
          <span>Partie(s)</span>
          ».
        </p>
        <p>
          Les présentes conditions générales d’utilisation (ci-après les «
          <span>Conditions Générales</span>
          ») ont pour objet de fixer les modalités et conditions de fourniture des Services aux
          Utilisateurs par le Learning Planet Institute, ainsi que de définir les droits et
          obligations des Parties dans ce cadre.
        </p>
        <p>
          Les Services font l’objet de modalités et conditions spécifiques aux Visiteurs (
          <span>Partie I</span>
          ) et aux Contributeurs (
          <span>Partie II</span>
          ) ainsi que de modalités et conditions communes(
          <span>Partie III</span>
          ).
        </p>
        <p>
          Les Conditions Générales expriment l’intégralité de l’accord des Parties et annulent et
          remplacent tout accord, lettre, offre ou autre document écrit ou oral antérieur ayant le
          même objet.
        </p>
        <p>
          Elles sont accessibles et imprimables à tout moment par un lien direct en page d’accueil
          de la Plateforme.
        </p>
      </div>

      <h3>2. Exploitant de la Plateforme</h3>
      <div>
        <p>
          La Plateforme et les Services sont exploités par le Learning Planet Institute, association
          domiciliée au 8/10 Rue Charles V, 75004 Paris.
        </p>
        <p>
          Pour toute demande concernant la Plateforme et les Services, le Learning Planet Institute
          peut être contacté à l’adresse électronique suivante :
          <a href="mailto:projects.platform@learningplanetinstitute.org">
            projects.platform@learningplanetinstitute.org
          </a>
        </p>
      </div>

      <h2>PARTIE I : MODALITES ET CONDITIONS SPECIFIQUES APPLICABLES AUX VISITEURS</h2>
      <div>
        <p>
          Tout Visiteur peut accéder et consulter librement les Projets référencés publics (excluant
          les projets limités à la Communauté et les Projets privés) et les Commentaires ainsi que
          répondre à des Offres de collaboration, sans inscription préalable.
        </p>
      </div>

      <h3>3. Acceptation des Conditions Générales</h3>
      <div>
        <p>
          Le Visiteur déclare en accédant aux Services dans les conditions prévues ci-après à
          l’article « Accès à la Plateforme et aux Services », avoir pris connaissance des présentes
          Conditions Générales et les accepter expressément.
        </p>
        <p>
          Cette acceptation, qui est matérialisée par une case à cocher au moment de la visite sur
          la Plateforme, ne peut être que pleine et entière, sans modification de quelque nature que
          ce soit.
        </p>
        <p>
          Toute adhésion sous réserve est considérée comme nulle et non avenue. Le Visiteur qui
          n’accepte pas d’être lié par les présentes Conditions Générales ne doit pas utiliser les
          Services, ni accéder à la Plateforme.
        </p>
      </div>

      <h3>4. Description des Services à destination des Visiteurs</h3>
      <div>
        <p>
          Le Visiteur a accès aux Services qui suivent sous une forme et selon les moyens techniques
          que le Learning Planet Institute juge les plus appropriés pour toute la durée des
          présentes.
        </p>
        <p>
          Le Visiteur reconnaît et accepte qu’à l’exception du Service de consultation des Projets
          référencés et de réponse aux Offres de collaborations, il ne peut accéder à l’ensemble des
          Services qu’une fois son inscription sur la Plateforme définitivement validée.
        </p>
      </div>

      <h4>4.1 Consultation des Projets et des Commentaires</h4>
      <div>
        <p>
          Tout Visiteur accède à la base de données regroupant les Projets publiés par la communauté
          sur la Plateforme, étant précisé que la liste des Projets n’est pas exhaustive.
        </p>
        <p>
          La recherche de Projets se fait par mots clefs et par catégories, ou selon différents
          critères que le Learning Planet Institute jugera les plus appropriés pour fournir les
          Services.
        </p>
        <p>
          Chaque Visiteur peut consulter une Fiche du Projet ainsi que les Commentaires afférents
          audit Projet, sous réserve que celle-ci soit diffusée publiquement sans restriction
          d’accès.
        </p>
      </div>

      <h4>4.2 Consultation des Offres de collaboration</h4>
      <div>
        <p>
          Chaque Visiteur peut consulter les Offres de collaboration afférente à un Projet
          déterminé, accessibles sur la Fiche dudit Projet, et répondre aux Offres en remplissant le
          formulaire de postulation mis à sa disposition sur le Plateforme.
        </p>
        <p>
          Pour postuler, le Visiteur est tenu de renseigner les informations requises dans le
          formulaire de postulation et à la possibilité de téléverser son curriculum vitae ainsi
          qu’une lettre de motivation, le cas échéant.
        </p>
        <p>
          Le Visiteur garantit que les informations renseignées lors de la postulation sont exactes
          et qu’elles ne sont entachées d’aucun caractère trompeur.
        </p>
        <p>
          Toute réponse à sa candidature sera faite à l’adresse email personnel que le Visiteur aura
          renseignée, en dehors de la Plateforme. Le Visiteur reconnaîtet accepte que le Learning
          Planet Institute n’intervient à aucun moment dans le processus de recrutement relatif à un
          Projet, et ne saurait être tenu responsable en cas de refus ou de défaut de réponse, ou du
          délai dans le traitement dans sa candidature à un Projet.
        </p>
        <p>
          Par ailleurs, le Visiteur est informé que le Learning Planet Institute ne saurait être
          responsable des informations publiées par la Communauté quant à l’Offre de collaboration à
          un Projet, ce qu’il reconnaît et accepte expressément.
        </p>
      </div>

      <h4>4.3 Foire aux questions</h4>
      <div>
        <p>
          Le Learning Planet Institute met à la disposition de l’Utilisateur une page d’aide
          relative à l’utilisation des Services (FAQ), selon les moyens qu’il juge les plus
          appropriés.
        </p>
      </div>

      <h3>5. Conditions financières</h3>
      <div>
        <p>
          Les Services sont fournis aux Visiteurs à titre gratuit, étant entendu que le Visiteur
          prend à sa charge exclusive tous frais d’accès à l’Internet ainsi que le coût de ses
          communications.
        </p>
      </div>

      <h2>PARTIE II : MODALITES ET CONDITIONS SPECIFIQUES APPLICABLES AUX CONTRIBUTEURS</h2>
      <div>
        <p>
          L’utilisation des Services, tels que la création et la modification de Projet, la
          rédaction et publication de Commentaires et d’Offres de collaboration, requièrent la
          création d’un compte dont les conditions sont détaillées ci-après.
        </p>
      </div>

      <h3>6. Acceptation des Conditions Générales</h3>
      <div>
        <p>
          Le Contributeur déclare en accédant aux Services dans les conditions prévues ci-après à
          l’article « Accès à la Plateforme et aux Services », avoir pris connaissance des présentes
          Conditions Générales et les accepter expressément.
        </p>
        <p>
          Cette acceptation, qui est matérialisée par une case à cocher au moment de l’inscription
          pour le Contributeur, ne peut être que pleine et entière, sans modification de quelque
          nature que ce soit.
        </p>
        <p>
          Toute adhésion sous réserve est considérée comme nulle et non avenue. Le Contributeur qui
          n’accepte pas d’être lié par les présentes Conditions Générales ne doit pas utiliser les
          Services, ni accéder à la Plateforme.
        </p>
      </div>

      <h3>7. Inscription sur la Plateforme</h3>
      <div>
        <p>
          Tout Contributeur est tenu d’ouvrir un compte sur la Plateforme pour bénéficier de
          l’intégralité des Services (ci-après le «
          <span>Compte</span>
          »).
        </p>
        <p>L’inscription du Contributeur est volontaire.</p>
        <p>
          Pour créer un Compte, le Contributeur doit obligatoirement renseigner toutes les
          informations requises, notamment son nom, son prénom, son adresse email, et sa fonction.
          Il doit ensuite choisir un mot de passe.
        </p>
        <p>
          Le Contributeur garantit le Learning Planet Institute que les informations obligatoires
          renseignées lors de l’inscription sont exactes et qu’elles ne sont entachées d’aucun
          caractère trompeur. Il peut retrouver et gérer les informations le concernant depuis son
          Compte. Le Contributeur s’engage à informer le Learning Planet Institute sans délai de
          tout changement dans lesdites informations à l’adresse de contact indiquée à l’article «
          Exploitant de la Plateforme » des présentes. Le Contributeur reconnaît et accepte que les
          informations saisies aux fins de création ou de mise à jour de son Compte valent preuve de
          son identité.
        </p>
        <p>
          Le Learning Planet Institute se réserve le droit, à sa libre discrétion, et à tout moment
          après la demande d’inscription et pendant toute la durée des présentes, de mettre en œuvre
          tout processus de vérification qu’elle jugera utile, portant notamment sur son identité ou
          ses coordonnées sous réserve des lois applicables. Le Contributeur reconnait et accepte
          que le Learning Planet Institute se réserve la faculté de suspendre ou de supprimer
          immédiatement tout Compte ouvert sur la base d’informations faussement renseignées par le
          Contributeur.
        </p>
        <p>
          L’inscription sur la Plateforme entraîne automatiquement l’attribution d’un espace
          personnel sous une forme et selon les moyens techniques que le Learning Planet Institute
          juge les plus appropriés pour rendre les Services (ci-après «
          <span>l’Espace personnel</span>
          »).
        </p>
        <p>
          Le Contributeur se voit attribuer un profil public sur son Espace personnel (ci-après le «
          <span>Profil</span>
          ») consultable par tous les Utilisateurs de la Plateforme. Le Contributeur peut mettre une
          photo sur son Profil. Le Contributeur peut, en outre, rédiger une description de son
          parcours professionnel et/ou académique, une photo, et saisir ses compétences et ses
          souhaits d’apprentissage, dont le contenu est libre.
        </p>
        <p>
          Le Contributeur accède à son Compte en renseignant l’identifiant composé de ses noms et
          prénoms et le mot de passe choisis lors de l’inscription.
        </p>
        <p>
          En cas de perte ou d’oubli du mot de passe, le Contributeur peut réinitialiser son mot de
          passe en adressant sa demande à travers un formulaire automatique disponible sur la page
          de connexion de la Plateforme. La procédure décrivant la réinitialisation du mot de passe
          lui sera ensuite envoyée par email à l’adresse renseignée sur son Compte.
        </p>
      </div>

      <h3>8. Usage strictement personnel</h3>
      <div>
        <p>
          Le Contributeur s’engage à utiliser les Services personnellement, et à ne permettre à
          aucun tiers de les utiliser à sa place ou pour son propre compte, y compris à un autre
          Utilisateur des Services, sauf à en supporter l’entière responsabilité.
        </p>
        <p>
          Le Contributeur est par ailleurs responsable du maintien de la confidentialité de ses
          identifiant et mot de passe et reconnaît expressément que toute utilisation des Services
          depuis son Compte sera réputée avoir été effectuée par lui-même.
        </p>
        <p>
          Dans l’hypothèse où le Contributeur constaterait que son Compte est ou a été utilisé à son
          insu, il s’engage à en avertir le Learning Planet Institute dans les plus brefs délais, à
          l’adresse email indiquée à l’article « Exploitant de la Plateforme et de l’Application ».
        </p>
        <p>
          Sauf dans l’hypothèse où le Contributeur est une entreprise, collectivité publique,
          association et autres organisations académiques exploitant la Plateforme en marque blanche
          dans le cadre d’un contrat séparé, le Contributeur s’engage à ne créer qu’un seul Compte,
          le Learning Planet Institute se réservant la possibilité le cas échéant de supprimer tout
          compte supplémentaire créé par le même Contributeur et/ou de fusionner les Comptes
          supplémentaires pour éviter tout cumul.
        </p>
        <p>
          Le Contributeur reconnaît également être informé que dans l’hypothèse où le Learning
          Planet Institute se réserve la faculté de supprimer tout Compte inactif pendant une
          période continue de douze (12) mois. Dans l’hypothèse où le Learning Planet Institute
          déciderait de suspendre ou de fermer son Compte, conformément aux présentes Conditions
          Générales, le dit Utilisateur ne pourra plus créer de nouveau Compte sur la Plateforme. Le
          Learning Planet Institute se réserve la possibilité de supprimer tout nouveau Compte créé
          par un Utilisateur dont le précédent Compte a été supprimé sur décision du Learning Planet
          Institute.
        </p>
      </div>

      <h3>9. Fermeture du Compte</h3>
      <div>
        <p>
          Le Contributeur peut se désinscrire à tout moment des Services et fermer son Compte en
          adressant sa demande à l’adresse indiquée à l’article « Exploitant de la Plateforme ». La
          désactivation du Compte est immédiate. Le Contributeur fera son affaire de récupérer les
          données sur le support et sous le format de son choix, ce qu’il reconnaît et accepte.
        </p>
        <p>
          Le Contributeur pourra réactiver son Compte en adressant sa demande à l’adresse indiquée à
          l’article « Exploitant de la Plateforme », à tout moment pendant une durée de trois (3)
          ans à compter de la date de désactivation de son Compte, sauf dans l’hypothèse où le
          Compte aurait été fermé par le Learning Planet Institute pour faute du Contributeur.
          Au-delà de cette période de trois (3) ans, le Compte sera définitivement fermé, les
          données récupérées par le Learning Planet Institute lors de l’inscription, ainsi que les
          Contenus et informations stockés sur le Compte du Contributeur seront détruites par le
          Learning Planet Institute, conformément aux dispositions de la loi n°78-17 du 6 janvier
          1978 relative à l’informatique, aux fichiers et aux libertés.
        </p>
        <p>
          Le Contributeur reconnaît expressément que la responsabilité du Learning Planet Institute
          ne pourra en aucun cas être recherchée pour toute perte ou altération des Contenus et
          informations stockés par le Contributeur sur son Compte, quel qu’en soit la cause, et
          notamment suite à des opérations de maintenance et/ou de mise à jour de la Plateforme.
        </p>
      </div>

      <h3>10. Descriptions des Services à destination des Contributeurs</h3>
      <h4>10.1 Publication de Fiche du Projet</h4>
      <div>
        <p>
          Par l’intermédiaire d’un formulaire mise à sa disposition depuis son Espace Personnel,
          chaque Contributeur peut rédiger une description du Projet, les objectifs poursuivis, les
          éventuels liens URL renvoyant vers le blog ou autres ressources relatives au Projet, le
          nom des membres de l'équipe en charge du Projet, (ci-après, la «
          <span>Fiche du Projet</span>
          »), dans la limite du nombre de caractère et selon les champs disponibles dans le
          formulaire de publication.
        </p>
        <p>
          Le Contributeur peut, en outre, accorder des droits d’édition, comprenant la rédaction et
          la modification d’une Fiche Projet, à tout membre de l’équipe. Le Contributeur peut
          également choisir de rendre publique la Fiche du Projet ou de restreindre l’accès soit à
          la Communauté, soit aux seuls membres de l’équipe en charge du Projet.
        </p>
        <p>
          Une fois validée, la Fiche du Projet sera publiée automatiquement sur la Plateforme, selon
          l’option de diffusion publique ou privée sélectionnée, sans modération préalable du
          Learning Planet Institute.
        </p>
      </div>

      <h4>10.2 Publication d’une Offre de collaboration</h4>
      <div>
        <p>
          Chaque Contributeur peut diffuser des Offres de collaboration afférente à un Projet
          déterminé, en remplissant le formulaire de publication mis à sa disposition sur la
          Plateforme.
        </p>
        <p>
          Dans ce cas, le Contributeur doit renseigner les informations requises dans le formulaire
          de publication telle que la fonction, les missions, la durée de l’Offre, et a la
          possibilité de téléverser tout document sur la Plateforme, dans la limite de l’espace de
          stockage tel qu’indiqué sur la Plateforme.
        </p>
        <p>
          L’Offre de collaboration sera automatiquement diffusée sur la Fiche du Projet concerné, et
          sera accessible à tout Utilisateur.
        </p>
        <p>
          Le Contributeur reconnait et accepte qu’il est seul responsable des informations qu’il
          publie dans l’Offre de collaboration ainsi que du processus de recrutement, dans lequel le
          Learning Planet Institute restera totalement étranger.
        </p>
        <p>
          Le Learning Planet Institute ne saurait, en aucun cas, être tenue responsable des réponses
          transmises au Contributeur suite aux Offres de collaboration publiées sur la Plateforme.
        </p>
      </div>

      <h4>10.3 Commentaires</h4>
      <h5>10.3.1 Publication d’un Commentaire</h5>
      <div>
        <p>
          Le Contributeur inscrit sur la Plateforme peut publier un Commentaire sur un Projet
          référencé, conformément aux conditions prévues ci-après.
        </p>
        <p>
          Le Contributeur est informé que le nombre de publication de Commentaires sur un ou
          plusieurs Projets n’est pas limité, sauf indication contraire.
        </p>
        <p>
          Pour publier un Commentaire sur un Projet, le Contributeur doit remplir le formulaire de
          publication mis à sa disposition sur la Plateforme, et rédiger un commentaire libre sur
          son opinion ou tout autre élément d’appréciation, dans la limite du nombre de caractères
          autorisé. Le Commentaire est publié automatiquement sous l’identifiant choisi lors de
          l’inscription, sans modération préalable du Learning Planet Institute.
        </p>
        <p>
          Une fois son Commentaire publié, le Contributeur ne peut pas modifier son Commentaire. Le
          Contributeur a en revanche la possibilité de supprimer son Commentaire s’il le souhaite et
          d’émettre un nouveau Commentaire sur ce même Projet référencé.
        </p>
        <p>
          Les commentaires sont classés dans l’ordre chronologique par défaut, du plus récent au
          plus ancien.
        </p>
      </div>

      <h5>10.3.2 Droit de réponse</h5>
      <div>
        <p>
          Le Contributeur dispose, à tout moment, d’un droit de réponse sur les Commentaires émis.
          La réponse sera publiée à la suite des Commentaires publiés par la Communauté, par ordre
          chronologique.
        </p>
      </div>

      <h4>10.4 Assistance technique</h4>
      <div>
        <p>
          Le Learning Planet Institute propose au Contributeur une assistance technique accessible
          suivante:
          <a href="mailto:projects.platform@learningplanetinstitute.org">
            projects.platform@learningplanetinstitute.org
          </a>
          du lundi au vendredi, de 9 heures à 17 heures, sauf jours fériés selon le calendrier
          français.
        </p>
      </div>

      <h3>11. Conditions financières</h3>
      <div>
        <p>La création d’un Compte est gratuite.</p>
        <p>
          Les Services sont fournis gratuitement. Cependant le Learning Planet Institute peut signer
          des accords de partenariat avec certains Contributeurs. Dans ce cas, l’utilisation des
          Services par les Contributeurs peuvent faire l’objet d’un abonnement payant, selon les
          conditions et modalités définies dans le contrat de partenariat applicable entre le
          Learning Planet Institute et le Contributeur.
        </p>
        <p>
          L’Utilisateur reconnait et accepte de prendre à sa charge exclusive tous frais d’accès à
          l’Internet ainsi que le coût de ses communications liées à l’utilisation des Services.
        </p>
      </div>

      <h2>PARTIE III : MODALITES ET CONDITIONS COMMUNES</h2>

      <h3>12. Accès à la Plateforme et aux Services</h3>
      <div>
        <p>La Plateforme et les Services sont accessibles :</p>
        <ul>
          <li>
            à toute personne physique disposant de la pleine capacité juridique pour s’engager au
            titre des présentes Conditions Générales ;
          </li>
          <li>
            à toute personne morale agissant par l’intermédiaire d’une personne physique disposant
            de la capacité juridique pour contracter au nom et pour le compte de la personne morale.
          </li>
        </ul>
        <p>
          L’Utilisateur reconnaît et accepte que pour accéder aux Services, il doit préalablement
          disposer d'une connexion à Internet.
        </p>
      </div>

      <h3>13. Usage non commercial</h3>
      <div>
        <p>
          L’Utilisateur s’interdit de monnayer, vendre, concéder, échanger et plus généralement,
          négocier tout ou partie de l’accès aux Services, sans l’autorisation préalable et expresse
          du Learning Planet Institute
        </p>
        <p>
          Le Learning Planet Institute peut, néanmoins, signer des accords de partenariat avec
          certains Contributeurs, prévoyant la commercialisation de la Plateforme.
        </p>
      </div>

      <h3>14. Autres Services</h3>
      <div>
        <p>
          Le Learning Planet Institute se réserve la faculté de proposer tout autre Service aux
          Visiteurs, aux Contributeurs et plus généralement aux Utilisateurs, sous une forme et
          selon les fonctionnalités et moyens techniques qu’il estimera les plus appropriés pour
          rendre lesdits Services.
        </p>
      </div>

      <h3>
        15. Signalement et contrôle des contenus publiés sur la Plateforme par le Learning Planet
        Institute
      </h3>
      <div>
        <p>
          Chaque Utilisateur et membre de la Communauté peut signaler tout contenu publié sur la
          Plateforme à l’adresse indiquée à l’article « Exploitant de l’Application », si celui-ci
          lui apparait inapproprié ou mensonger.
        </p>
        <p>
          On entend par «
          <span>Contenus</span>
          » les Commentaires, réponses aux Offres de collaboration, Fiches de Projets publiés par
          les Utilisateurs et/ou la Communauté sur la Plateforme.
        </p>
        <p>
          Le Learning Planet Institute procédera, dans les meilleurs délais, à l’examen de toute
          demande de signalement motivée, puis au retrait du Contenu, le cas échéant.
        </p>
        <p>
          S’il est notifié au Learning Planet Institute, à quelque titre que ce soit, qu’un Contenu
          présente un caractère mensonger, inexact ou illicite, le Learning Planet Institute pourra
          procéder à la suppression immédiate dudit Contenu, suite à une procédure de contrôle
          réalisée a posteriori par les équipes du Learning Planet Institute, via des outils
          informatiques et/ou des personnes humaines.
        </p>
        <p>
          Conformément à la loi pour la confiance dans l'économie numérique, no 2004-575 du 21 juin
          2004, le Learning Planet Institute s’engage en tant qu’hébergeur de contenus, à mettre en
          œuvre les moyens appropriés pour assurer un contrôle a posteriori objectif et efficace des
          Contenus, sur la base notamment de leur caractère licite.
        </p>
        <p>
          Par conséquent, le Learning Planet Institute se réserve le droit de supprimer tout Contenu
          qu’elle juge mensonger, inexact, injurieux, dénigrant, incitant à la discrimination, la
          haine ou la violence ou portant atteinte au droit au respect de la vie privée d’autrui,
          sans que cette liste soit limitative.
        </p>
        <p>
          Ce contrôle résulte d’une analyse des informations globales recueillies, du contexte de la
          rédaction du Contenu, et notamment :
        </p>
        <ul>
          <li>
            L’implication de l’Utilisateur sur la Plateforme (fréquence et nombre de Contenus
            publiés)
          </li>
          <li>Des Contenus rédigés par des profils créés avec de fausses informations</li>
          <li>
            Des Contenus rédigés dans le but de porter atteinte à la réputation de la Communauté ou
            à la légitimité d’un Projet
          </li>
          <li>Des Contenus émanant de systèmes robotisés</li>
          <li>Le langage utilisé lors de la rédaction du Contenu</li>
        </ul>
        <p>
          Le Compte de l’Utilisateur à l’origine du Contenu signalé pourra être supprimé et bloqué.
        </p>
        <p>
          Dans tous les cas, il sera informé par email, dans un délai raisonnable, du ou des
          motif(s) de refus ou de suppression du Contenu.
        </p>
      </div>

      <h3>16. Durée</h3>
      <div>
        <p>
          Les présentes Conditions Générales s’appliquent pendant toute la durée d’utilisation des
          Services par l’Utilisateur.
        </p>
      </div>

      <h3>17. Garantie de niveau de services</h3>
      <div>
        <p>
          Le Learning Planet Institute fera ses meilleurs efforts pour que la Plateforme fonctionne
          sans interruption 24 heures sur 24 heures et 7 jours sur 7 jours, sauf en cas de force
          majeure.
        </p>
        <p>
          En cas de nécessité, le Learning Planet Institute se réserve la possibilité de limiter ou
          de suspendre l’accès à la Plateforme, pour procéder à toute opération de maintenance et/ou
          d’amélioration. Dans cette hypothèse, le Learning Planet Institute s’engage à faire ses
          meilleurs efforts pour informer à l’avance par message informatif général sur la page
          d’accueil de la Plateforme de ces opérations de maintenance et/ou d’amélioration.
        </p>
        <p>
          Dans le cadre de ces opérations de maintenance et/ou d’évolution, le Learning Planet
          Institute s’engage à faire ses meilleurs efforts pour effectuer les sauvegardes des
          Contenus, afin de permettre sa restauration, en l’état à la date desdites opérations de
          maintenance et/ou d’évolution.
        </p>
        <p>
          La responsabilité du Learning Planet Institute ne saurait en aucun cas être engagée en cas
          de perte de Contenus au cours des opérations de maintenance et/ou d’évolution.
        </p>
        <p>
          Le Learning Planet Institute s’engage également à prendre toutes précautions utiles, au
          regard de la nature des données et des risques présentés par les traitements automatisés
          de données mis en œuvre pour les besoins des Services, pour préserver la sécurité des
          données, et notamment empêcher qu’elles soient déformées, endommagées ou que des tiers non
          autorisés y aient accès.
        </p>
      </div>

      <h3>18. Obligations de l’Utilisateur</h3>
      <p>
        Sans préjudice des autres obligations prévues aux présentes, l’Utilisateur s’engage à
        respecter les obligations qui suivent.
      </p>
      <ol>
        <li>
          <p>
            L’Utilisateur s’engage, dans son usage des Services, à respecter les lois et règlements
            en vigueur et à ne pas porter atteinte aux droits de tiers ou à l’ordre public.
          </p>
          <p>
            Il est en outre seul responsable du bon accomplissement de toutes les formalités
            notamment administratives, fiscales et/ ou sociales et de tous les paiements de
            cotisations, taxes ou impôts de toutes natures qui lui incombent le cas échéant en
            relation avec son utilisation des Services.
          </p>
        </li>
        <li>
          L’Utilisateur reconnaît avoir pris connaissance des caractéristiques et contraintes,
          notamment techniques, de l’ensemble des Services ;
        </li>
        <li>
          Tout Utilisateur des Services s’interdit de proposer et/ou de solliciter des prestations
          aux autres Utilisateurs des Services, par quelque moyen que ce soit, et notamment par
          l’intermédiaire du service de Commentaires proposé sur la Plateforme. Cette sollicitation
          ne comprend pas la postulation aux offres de collaboration aux Projets dans le cadre des
          Services ;
        </li>
        <li>
          L’Utilisateur garantit le Learning Planet Institute qu’il dispose de tous les droits et
          autorisations nécessaires à la diffusion des Contenus de toute nature qu’il diffuse sur la
          Plateforme dans le cadre de l’utilisation des Services. Il s’engage à ce que les dits
          Contenus soient licites, ne portent pas atteinte à l’ordre public, aux bonnes mœurs ou aux
          droits de tiers, n’enfreignent aucune disposition législative ou règlementaire et plus
          généralement, ne soient aucunement susceptibles de mettre en jeu la responsabilité civile
          ou pénale du Learning Planet Institute.
        </li>
      </ol>
      <p>
        L’Utilisateur s’interdit ainsi de diffuser, notamment et sans que cette liste soit
        exhaustive :
      </p>
      <ul>
        <li>
          des contenus pornographiques, des contenus et propos obscènes, indécents choquants ou
          inadaptés à un public familial, diffamatoires, injurieux, violents, racistes, xénophobes
          ou révisionnistes ;
        </li>
        <li>des contenus contrefaisants.</li>
        <li>des contenus et propos attentatoires à l’image d’un tiers.</li>
        <li>
          des contenus et propos mensongers, trompeurs ou proposant ou promouvant des activités
          illicites, frauduleuses ou trompeuses ;
        </li>
        <li>
          des contenus nuisibles aux systèmes informatiques de tiers (tels que virus, vers, chevaux
          de Troie, etc) ;
        </li>
        <li>
          et plus généralement tout contenu et propos susceptible de porter atteinte aux droits de
          tiers ou d’être préjudiciable à des tiers, de quelque manière et sous quelque forme que ce
          soit.
        </li>
      </ul>
      <p>
        Chaque Utilisateur est seul responsable des propos, contenus, informations qu’il diffuse sur
        la Plateforme et pour lesquels le Learning Planet Institute ne saurait être tenu
        responsable, ce qu’il reconnaît et accepte.
      </p>
      <p>
        L’Utilisateur s’engage à respecter les mentions de propriété figurant sur le Projet et toute
        documentation s’y attachant.
      </p>
      <p>
        Dans ce cadre, l’Utilisateur garantit le Learning Planet Institute contre toute plainte,
        revendication et/ou action d’un ou plusieurs autres Utilisateurs et/ou de tout tiers
        soutenant que les contenus et propos qu’il publie constitueraient une violation de ses
        droits, quels qu’ils soient et notamment ses droits de propriété intellectuelle, droit à
        l’image et à la protection de la vie privée. En conséquence, l’Utilisateur s’engage à
        indemniser le Learning Planet Institute de tout préjudice qu’elle subirait et à prendre à sa
        charge tous les dommages-intérêts, ainsi que les frais, charges et dépens auxquels le
        Learning Planet Institute pourrait être condamné, ou qui seraient prévus par un accord
        transactionnel signé par le Learning Planet Institute après avoir obtenu l’accord préalable
        de l’Utilisateur.
      </p>

      <h3>19. Comportements prohibés</h3>
      <div>
        <p>Il est strictement interdit d’utiliser les Services aux fins suivantes :</p>
        <ul>
          <li>
            l’exercice d’activités illégales, frauduleuses ou portant atteinte aux droits ou à la
            sécurité des tiers,
          </li>
          <li>l’atteinte à l’ordre public ou la violation des lois et règlements en vigueur,</li>
          <li>
            l’intrusion dans le système informatique d’un tiers ou toute activité de nature à nuire,
            contrôler, interférer, ou intercepter tout ou partie du système informatique d’un tiers,
            en violer l’intégrité ou la sécurité,
          </li>
          <li>
            l’aide ou l’incitation, sous quelque forme et de quelque manière que ce soit, à un ou
            plusieurs des actes et activités décrits ci-dessus,
          </li>
          <li>
            l’utilisation de robots permettant de collecter et de télécharger du contenu et/ou des
            données de manière massive sur la Plateforme.
          </li>
          <li>
            et plus généralement toute pratique détournant les Services à des fins autres que celles
            pour lesquelles ils ont été conçus.
          </li>
        </ul>
        <p>
          Il est strictement interdit à tout Utilisateur de copier et/ou de détourner à ses fins ou
          à celles de tiers le concept, les technologies ou tout autre élément de la Plateforme.
        </p>
        <p>
          Sont également strictement interdits : (i) tous comportements de nature à interrompre,
          suspendre, ralentir ou empêcher la continuité des Services, (ii) toutes intrusions ou
          tentatives d’intrusions dans les systèmes du Learning Planet Institute, (iii) tous
          détournements des ressources système de la Plateforme, (iv) toutes actions de nature à
          imposer une charge disproportionnée sur les infrastructures du Learning Planet Institute,
          (v) toutes atteintes aux mesures de sécurité et d’authentification, (vi) tous actes de
          nature à porter atteinte aux droits et intérêts financiers ou moraux du Learning Planet
          Institute, et enfin plus généralement (vii) tout manquement aux présentes Conditions
          Générales.
        </p>
      </div>

      <h3>20. Sanction des manquements</h3>
      <div>
        <p>
          En cas de manquement à l’une quelconque des dispositions des présentes Conditions
          Générales ou plus généralement, d’infraction aux lois et règlements par l’Utilisateur, le
          Learning Planet Institute se réserve le droit de :
        </p>
        <ul>
          <li>
            suspendre de manière temporaire ou définitive, sans délai, l’accès aux Services de
            l’Utilisateur auteur du manquement ou de l’infraction, ou y ayant participé, et
            notamment, en cas de fourniture d’informations erronées, incomplètes, mensongères ou
            périmées lors de l’inscription,
          </li>
          <li>
            supprimer tout contenu en lien avec le manquement ou l’infraction considéré(e), en
            totalité ou en partie,
          </li>
          <li>prendre toutes mesures appropriées et engager toute action en justice,</li>
          <li>
            avertir le cas échéant les autorités compétentes, coopérer avec elles et leur fournir
            toutes les informations utiles à la recherche et à la répression d’activités illégales
            ou illicites.
          </li>
        </ul>
        <p>
          En cas de manquement de l’Utilisateur à une obligation essentielle découlant des présentes
          Conditions Générales, ou de violation répétée de celles-ci, le Learning Planet Institute
          se réserve le droit de résilier l’accès de l’Utilisateur à tout ou partie des Services,
          avec effet immédiat, par email. La résiliation prend effet de plein droit à la date
          d’envoi, par le Learning Planet Institute de l’écrit adressé à l’Utilisateur en
          application de la présente clause. Elle entraîne automatiquement et sans mise en demeure
          préalable la suppression du Compte de l’Utilisateur, sans préjudice des autres
          conséquences éventuellement induites en application des présentes Conditions Générales.
        </p>
      </div>

      <h3>21. Exclusion de responsabilité et de garantie du Learning Planet Institute</h3>
      <div>
        <p>
          Le Learning Planet Institute s’engage à faire ses meilleurs efforts pour fournir les
          Services avec diligence et selon les règles de l’art, étant précisé qu’il pèse sur elle
          une obligation de moyens, à l’exclusion de toute obligation de résultat, ce que
          l’Utilisateur reconnaît et accepte expressément.
        </p>
        <p>
          Sa responsabilité est exclusivement limitée à la fourniture des Services selon les
          modalités décrites aux présentes, à l’exclusion de toute autre prestation. L’Utilisateur
          reconnaît et accepte en outre que les Services sont fournis tel quel sans aucune garantie
          d’aucune sorte, expresse ou implicite. Notamment, le Learning Planet Institute ne garantit
          pas que :
        </p>
        <ul>
          <li>
            les Services, soumis à une recherche constante pour en améliorer notamment la
            performance et le progrès, seront totalement exempts d’erreurs, de vices ou défauts ;
          </li>
          <li>
            les Services étant standards et nullement proposés à la seule intention de l’Utilisateur
            en fonction de ses propres contraintes personnelles, répondront spécifiquement aux
            besoins et attentes de l’Utilisateur ;
          </li>
          <li>
            la Plateforme fonctionnera de manière ininterrompue, le Learning Planet Institute se
            réservant la faculté d’interrompre momentanément l’accès à la Plateforme pour des
            raisons de maintenance dans les conditions de l’article « Garantie de niveau de service
            », et ne pouvant en aucun cas être tenue responsable des perturbations ou défaillances
            du réseau internet ou du réseau de télécommunication, et plus généralement qui auraient
            leur origine dans des circonstances qui lui sont extérieures ou découlant de la force
            majeure.
          </li>
        </ul>
        <p>
          Le Learning Planet Institute décline également toute responsabilité en cas de perte
          éventuelle des informations accessibles sur le Compte de l’Utilisateur, l’Utilisateur
          devant s’assurer de sauvegarder une copie des informations qu’il juge nécessaires et ne
          pouvant prétendre à aucun dédommagement à ce titre.
        </p>
        <p>
          Le Learning Planet Institute ne pourra être redevable envers l’Utilisateur du paiement de
          quelconque dommages-intérêts, de quelque nature que ce soit, directs ou indirects,
          matériels, financiers ou moraux, en raison de l’utilisation qu’il fait des Services et de
          la Plateforme.
        </p>
        <p>
          L’Utilisateur déclare être parfaitement informé qu’il accède notamment via la Plateforme à
          des Contenus pour lesquels il n’exerce aucune modération et intervient en qualité
          d’hébergeur, conformément à la loi pour la confiance dans l'économie numérique, no
          2004-575 du 21 juin 2004. L’Utilisateur reconnait et accepte que les informations
          disponibles sur la Fiche du Projet, les Commentaires, et les Offres de collaboration sont
          publiées directement par la Communauté sur la Plateforme, et que le Learning Planet
          Institute ne saurait être tenu responsable en cas d’informations mensongères, inexactes ou
          illicites.
        </p>
        <p>
          Le Learning Planet Institute ne peut être tenu pour responsable, en sa qualité de simple
          hébergeur, des Commentaires, sur la Fiche du Projet et/ou des Offres de collaboration dont
          les auteurs sont des Utilisateurs, toute réclamation éventuelle devant être dirigée en
          premier lieu vers l’auteur dudit Contenu en question.
        </p>
        <p>
          En outre, l’Utilisateur reconnaît et accepte que le Learning Planet Institute intervient
          en qualité d’intermédiaire entre la Communauté et les Utilisateurs, en ce qu’il met à la
          disposition des Utilisateurs et de la Communauté les outils et moyens techniques leur
          permettant d’entrer en relation par l’intermédiaire de la Plateforme. La responsabilité du
          Learning Planet Institute se limite à la fourniture de ces moyens dans le cadre des
          Services, tels que décrits aux présentes.
        </p>
        <p>
          Le Learning Planet Institute ne saurait en aucun cas être partie à quelques litiges
          éventuels que ce soit entre les Utilisateurs et/ou la Communauté, concernant notamment les
          Offres de collaboration ou toutes autres déclarations ou obligations quelconques
          auxquelles les Utilisateurs seraient tenus dans ce cadre. A ce titre, le Learning Planet
          Institute n’est responsable d’aucune conséquence directe ou indirecte des liens créés à
          travers la Plateforme entre les différentes personnes physiques. Il ne saurait être partie
          à quelques litiges éventuels que ce soit entre elles.
        </p>
        <p>
          L’Utilisateur ne pourra en aucun cas se réclamer des dispositions des présentes pour
          revendiquer, en aucune manière, la qualité d’agent, de représentant ou d’employé du
          Learning Planet Institute, ni engager celle-ci à l’égard de tiers, au-delà des Services
          prévus par les dispositions des présentes. Aux termes des présentes, il n’est pas formé de
          structure juridique particulière entre le Learning Planet Institute et l’Utilisateur,
          chacun conservant son entière autonomie et ses responsabilités.
        </p>
        <p>
          L’Utilisateur reconnaît que les Services lui offrent une solution supplémentaire, non
          alternative, de consulter les Fiches des Projets, de consulter ou publier des
          Commentaires, et de Postuler aux offres de collaboration à un Projet, et que cette
          solution ne saurait se substituer aux autres moyens dont il peut disposer par ailleurs
          pour atteindre les mêmes objectifs.
        </p>
      </div>

      <h3>22. Propriété intellectuelle</h3>
      <div>
        <p>
          Les présentes Conditions Générales ne confèrent à l’Utilisateur aucun droit de propriété
          intellectuelle d’aucune sorte sur la Plateforme, en ce compris les présentes Conditions
          Générales, les marques, noms commerciaux et logos, les logiciels, structures,
          infrastructures et bases de données utilisés par le Learning Planet Institute au sein de
          la Plateforme, qui demeurent la propriété exclusive, pleine et entière du Learning Planet
          Institute.
        </p>
        <p>
          Tout acte de désassemblage, décompilation, décryptage, extraction, réutilisation, et plus
          généralement toute reproduction, représentation, distribution, adaptation,
          commercialisation de la Plateforme et/ou des textes, images, contenus audio-visuels et
          autres contenus exploités par le Learning Planet Institute sur la Plateforme par
          l’Utilisateur, non conforme aux dispositions des présentes Conditions Générales, sont
          interdits et pourront faire l’objet de poursuites judiciaires.
        </p>
        <p>
          Chaque Contributeur accorde au Learning Planet Institute, à la Communauté et aux Visiteurs
          une licence gratuite, avec droit de sous-licence, pendant toute la durée de protection
          légale des droits de propriété intellectuelle applicables et pour le monde entier, aux
          fins de fixer, reproduire, d’utiliser et de communiquer au public, sur tout support,
          l’ensemble des textes, images, contenus audio-visuels et autres contenus dont il est
          auteur et mis en ligne sur la Plateforme relative à un Projet (ci-après ensemble les «
          <span>Publications</span>
          »), ainsi qu’aux fins de créer des œuvres dérivées de ces Publications.
        </p>
        <p>
          En contrepartie, le Learning Planet Institute, la Communauté et les Utilisateurs
          s’engagent à respecter les mentions de propriété figurant sur les Publications.
        </p>
        <p>
          Le Learning Planet Institute, la Communauté et les Utilisateurs s’engagent, en outre, à
          accorder des droits de sous-licence sur les Publications strictement dans les mêmes termes
          et conditions que ceux prévus au présent article, et s’interdisent d’exploiter les
          Publications à des fins commerciales.
        </p>
      </div>

      <h3>23. Données à caractère personnel</h3>
      <div>
        <p>
          Le Learning Planet Institute pratique une politique de protection des données personnelles
          dont les caractéristiques sont explicitées dans le document intitulé «
          <span class="underlined">
            Charte relative à la protection des données à caractère personnel
          </span>
          », accessible sur la page d’accueil de la plateforme et de l’application et dont
          l’utilisateur est expressément invité à prendre connaissance.
        </p>
        <p>
          Le Learning Planet Institute déclare notamment respecter toutes les obligations
          réglementaires qui lui incombent en matière de protection des données à caractère
          personnel visant à garantir notamment la sécurité et la confidentialité des données
          collectées et traitées.
        </p>
        <p>
          Le Learning Planet Institute n’est en aucun cas responsable de tout traitement de données
          à caractère personnel réalisé par un Utilisateur et/ou les membres de la Communauté au
          titre des activités réalisées par l’intermédiation de la Plateforme, et auxquelles le
          Learning Planet Institute est strictement étranger. Il appartient à tout Utilisateur et
          aux membres de la Communauté, le cas échéant de respecter toutes les obligations
          règlementaires qui lui incombent à ce titre.
        </p>
      </div>

      <h3>24. Liens et sites tiers</h3>
      <div>
        <p>
          Le Learning Planet Institute ne pourra en aucun cas être tenu pour responsable de la
          disponibilité technique de sites web exploités par des tiers (y compris ses éventuels
          partenaires) auxquels l’Utilisateur accéderait par l'intermédiaire de la Plateforme.
        </p>
        <p>
          Le Learning Planet Institute n'endosse aucune responsabilité au titre des contenus,
          publicités, produits et/ou services disponibles sur de tels sites tiers dont il est
          rappelé qu’ils sont régis par leurs propres conditions d’utilisation.
        </p>
        <p>
          Le Learning Planet Institute n'est pas non plus responsable des relations entre
          l’Utilisateur et un quelconque annonceur, professionnel ou commerçant (y compris ses
          éventuels partenaires) vers lequel l’Utilisateur serait orienté par l'intermédiaire de la
          Plateforme et ne saurait en aucun cas être partie à quelques litiges éventuels que ce soit
          avec ces tiers.
        </p>
      </div>

      <h3>25. Renonciation</h3>
      <div>
        <p>
          Le fait pour l’une des Parties de ne pas avoir exercé un quelconque droit ou pouvoir en
          application des dispositions des présentes Conditions Générales, ou de l’avoir exercé en
          retard, ne pourra être interprété comme une renonciation à exercer tout ou partie de ce
          droit ou pouvoir, et tout exercice unique ou partiel de tout droit ou pouvoir ne pourra
          empêcher une nouvelle mise en œuvre de ce droit ou pouvoir.
        </p>
      </div>

      <h3>26. Force majeure</h3>
      <div>
        <p>
          Le Learning Planet Institute ne pourra être tenue responsable vis-à-vis de l’Utilisateur
          dans l’hypothèse où l’exécution de ses obligations serait retardée, restreinte ou rendue
          impossible du fait de la survenance d’un évènement de force majeure. Sont notamment
          considérées comme cas de force majeure, les hypothèses habituellement reconnues par la
          jurisprudence et les tribunaux français.
        </p>
        <p>
          La survenance d’un évènement de force majeure suspendra dans un premier temps l’exécution
          des Services pendant une durée qui ne pourra être supérieure à trois (3) mois. Dans
          l’hypothèse où le cas de force majeure se poursuivrait au-delà de la période susvisée, les
          Parties pourront résilier les présentes Conditions générales, de plein droit, sans
          formalité judiciaire, sans préavis et sans droit à indemnités de quelque nature que ce
          soit, par l’envoi d’une lettre recommandée avec accusé de réception ayant effet immédiat.
        </p>
      </div>

      <h3>27. Nullité</h3>
      <div>
        <p>
          Si l’une quelconque des dispositions des présentes Conditions Générales venait à être
          déclarée nulle ou non applicable en raison d’une loi, d’un règlement ou à la suite d’une
          décision définitive rendue par une juridiction compétente, seule cette disposition serait
          frappée de nullité, les autres dispositions garderont toute leur force et leur portée.
        </p>
      </div>

      <h3>28. Modification des Conditions Générales</h3>
      <div>
        <p>
          Le Learning Planet Institute se réserve la faculté de modifier à tout moment les présentes
          Conditions Générales. Le Learning Planet Institute se réserve notamment la possibilité de
          modifier et/ou d’arrêter de proposer tout ou partie des Services, à tout moment à sa libre
          discrétion.
        </p>
        <p>
          L’Utilisateur sera informé de ces modifications par tout moyen utile, au moins quinze
          jours avant leur entrée en vigueur. Les Conditions Générales modifiées s’appliqueront
          immédiatement à tout Utilisateur des Services dès leur mise en ligne sur la Plateforme.
        </p>
        <p>
          L’Utilisateur qui n’accepte pas les Conditions Générales modifiées doit ne pas utiliser et
          se désinscrire des Services.
        </p>
        <p>
          Tout Utilisateur qui a recours aux Services postérieurement à l’entrée en vigueur des
          Conditions Générales modifiées est réputé avoir accepté ces modifications qui lui seront
          pleinement applicables.
        </p>
      </div>

      <h3>29. Entrée en vigueur</h3>
      <div>
        <p>
          Les présentes Conditions Générales sont entrées en vigueur le
          <span>8 décembre 2021</span>
        </p>
      </div>
    </section>
  </div>
</template>
