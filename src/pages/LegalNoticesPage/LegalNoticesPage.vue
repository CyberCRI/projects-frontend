<script setup lang="ts">
import { getOrganizationByCode } from '@/api/organizations.service'

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    'Mentions légales',
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
// TODO(remi): i18n legal notices
</script>
<template>
  <div class="page-section-narrow legal-page legal-notices page-top">
    <h1 class="page-title">Mentions légales</h1>

    <section>
      <h3>1. Identification</h3>
      <div>
        <p>
          Le site "https://projects.directory" et tous ses sous-portails constituent une publication
          du Learning Planet Institute – anciennement Centre de Recherches Interdisciplinaires (CRI)
          – Association de loi 1901 dont le siège social est situé au 8 bis rue Charles V, 75004
          Paris, ci-après dénommée “l’Association”.
        </p>
      </div>
      <h3>Renseignements généraux</h3>
      SITUATION AU REPERTOIRE SIRENE
      <ul>
        <li>Entreprise active depuis le 28/11/2006</li>
        <li>Identifiant SIREN : 494 470 453</li>
        <li>Identifiant SIRET : 494 470 453 00049</li>
        <li>Dénomination : LEARNING PLANET INSTITUTE – Sigle : LPI</li>
        <li>Catégorie juridique : 9220 – Association déclarée</li>
        <li>N° Répertoire National des Associations (RNA) : W751178793</li>
        <li>Activité Principale Exercée (APE) : 85.42Z – Enseignement supérieur</li>
        <li>Appartenance au champ de l’Économie Sociale et Solidaire (ESS) : Oui</li>
        <li>Contacts : +33 (0)1.84.24.42.87/ projects@learningplanetinstitute.org</li>
      </ul>
      <p />
      <h3>2. Publications et hébergement</h3>
      <ul>
        <li>
          Directeur de la publication & Représentant légal de l’Association en France : Monsieur
          François TADDEI
        </li>
        <li>Hébergeur : Microsoft Azure</li>
        <li>Siège social : 8 rue Charles V, 75004 Paris</li>
        <li>Site web : https://www.azure.com/</li>
        <li>Localisation du serveur : France</li>
      </ul>
      <h3>3. Propriété intellectuelle</h3>
      <p>
        Le contenu du site "https://projects.directory" et tous ses sous-portails sont sous licence
        Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0).
        Cela signifie que vous êtes libre de partager (copier, distribuer et communiquer le matériel
        par tous moyens et sous tous formats ) et d'adapter (remixer, transformer et construire à
        partir du matériel) selon les termes suivants :
      </p>
      <ul>
        <li>
          Attribution : Vous devez créditer l'Œuvre, intégrer un lien vers la licence et indiquer si
          des modifications ont été effectuées à l'Oeuvre. Vous devez indiquer ces informations par
          tous les moyens raisonnables, sans toutefois suggérer que l'Offrant vous soutient ou
          soutient la façon dont vous avez utilisé son Oeuvre.
        </li>
        <li>
          Pas d’Utilisation Commerciale : Vous n'êtes pas autorisé à faire un usage commercial de
          cette Oeuvre, tout ou partie du matériel la composant.
        </li>
        <li>
          Partage dans les Mêmes Conditions : Dans le cas où vous effectuez un remix, que vous
          transformez, ou créez à partir du matériel composant l'Oeuvre originale, vous devez
          diffuser l'Oeuvre modifiée dans les même conditions, c'est à dire avec la même licence
          avec laquelle l'Oeuvre originale a été diffusée.
        </li>
        <li>
          Pas de restrictions complémentaires : Vous n'êtes pas autorisé à appliquer des conditions
          légales ou des mesures techniques qui restreindraient légalement autrui à utiliser
          l'Oeuvre dans les conditions décrites par la licence.
        </li>
      </ul>
    </section>
  </div>
</template>
