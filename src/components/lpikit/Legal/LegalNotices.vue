<template>
    <div class="legal-notices">
        <h1>Mentions légales</h1>

        <section>
            <h3>1. Identification</h3>
            <div>
                <p>
                    Le site "https://projects.directory" et tous ses sous-portails constituent une
                    publication du Learning Planet Institute – anciennement Centre de Recherches
                    Interdisciplinaires (CRI) – Association de loi 1901 dont le siège social est
                    situé au 8 bis rue Charles V, 75004 Paris, ci-après dénommée “l’Association”.
                </p>
            </div>
            <h3>Renseignements généraux</h3>
            SITUATION AU REPERTOIRE SIRENE
            <li>Entreprise active depuis le 28/11/2006</li>
            <li>Identifiant SIREN : 494 470 453</li>
            <li>Identifiant SIRET : 494 470 453 00049</li>
            <li>Dénomination : LEARNING PLANET INSTITUTE – Sigle : LPI</li>
            <li>Catégorie juridique : 9220 – Association déclarée</li>
            <li>N° Répertoire National des Associations (RNA) : W751178793</li>
            <li>Activité Principale Exercée (APE) : 85.42Z – Enseignement supérieur</li>
            <li>Appartenance au champ de l’Économie Sociale et Solidaire (ESS) : Oui</li>
            <li>Contacts : +33 (0)1.84.24.42.87/ projects@learningplanetinstitute.org</li>
            <p></p>
            <h3>2. Publications et hébergement</h3>
            <li>
                Directeur de la publication & Représentant légal de l’Association en France :
                Monsieur François TADDEI
            </li>
            <li>Hébergeur : Microsoft Azure</li>
            <li>Siège social : 8 rue Charles V, 75004 Paris</li>
            <li>Site web : https://www.azure.com/</li>
            <li>Localisation du serveur : France</li>
        </section>
    </div>
</template>

<script>
export default {
    name: 'LegalNotices',
}
</script>

<style lang="scss" scoped>
.legal-notices {
    color: $black;
    margin-top: calc(30px + $navbar-height);

    @media screen and (min-width: $max-tablet) {
        .legal-notices {
            margin-top: calc(90px + $navbar-height);
        }
    }

    h1 {
        text-align: center;
        font-size: $font-size-6xl;
        font-weight: 700;
    }

    p {
        text-align: justify;
    }

    li {
        text-align: justify;
    }

    section {
        border-radius: $border-radius-l;
        background: $primary-lighter;
        padding: $space-l;
        max-width: 760px;
        margin: $space-xl auto;

        h2 {
            text-transform: uppercase;
            font-size: $space-l;
            font-weight: 700;
            margin: $space-xl auto;
        }

        h3 {
            font-size: $space-l;
            font-weight: 700;
            margin-bottom: $space-m;
        }

        h4 {
            font-size: $space-l;
            font-weight: 500;
            margin-bottom: $space-s;
        }

        h5 {
            font-size: $space-l;
            margin-bottom: $space-xs;
        }

        p {
            margin: $space-l 0;
        }

        a {
            color: $black;
        }

        ol {
            margin-left: $space-xl;
            list-style-type: auto;
        }

        ul {
            margin-left: $space-xl;
            list-style-type: disc;
        }

        .underlined {
            font-weight: 400;
            text-decoration: underline;
        }

        span {
            font-weight: 600;
        }
    }
}
</style>
