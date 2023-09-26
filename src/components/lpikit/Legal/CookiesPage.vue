<template>
    <div class="cookies">
        <h1>Politique Cookies</h1>

        <section>
            <h3>1. Introduction</h3>
            <p>
                Notre plateforme https://projects.directory et tous ses sous-portails (ci-après: «
                le site web ») utilise des cookies et autres technologies liées (par simplification,
                toutes ces technologies sont désignées par le terme « cookies »). Dans cette
                politique ci-dessous, nous vous informons de l’utilisation des cookies sur notre
                site web.
            </p>
            <h3>2. Que sont les cookies ?</h3>
            <p>
                Un cookie est un petit fichier simple envoyé avec les pages de ce site web et stocké
                par votre navigateur sur le disque dur de votre ordinateur ou d’un autre appareil.
                Les informations qui y sont stockées peuvent être renvoyées à nos serveurs ou aux
                serveurs des tierces parties concernées lors d’une visite ultérieure.
            </p>
            <h3>3. Cookies</h3>
            <h4>3.1 Cookies techniques ou fonctionnels</h4>
            <p>
                Certains cookies assurent le fonctionnement correct de certaines parties du site web
                et la prise en compte de vos préférences en tant qu’utilisateur. En plaçant des
                cookies fonctionnels, nous vous facilitons la visite de notre site web. Ainsi, vous
                n’avez pas besoin de saisir à plusieurs reprises les mêmes informations lors de la
                visite de notre site web et, par exemple, les éléments restent dans votre panier
                jusqu’à votre paiement. Nous pouvons placer ces cookies sans votre consentement.
            </p>
            <h4>3.2 Cookies statistiques</h4>
            <p>
                Nous utilisons des cookies statistiques afin d’optimiser l’expérience des
                utilisateurs sur notre site web. Avec ces cookies statistiques, nous obtenons des
                observations sur l’utilisation de notre site web. Nous demandons votre permission
                pour placer des cookies statistiques.
            </p>
            <h4>3.3 Cookies de marketing/suivi</h4>
            <p>
                Les cookies de marketing/suivi sont des cookies ou toute autre forme de stockage
                local, utilisés pour créer des profils d’utilisateurs afin d’afficher de la
                publicité ou de suivre l’utilisateur sur ce site web ou sur plusieurs sites web dans
                des finalités marketing similaires.
            </p>
            <h3>4. Consentement</h3>
            <p>
                Lorsque vous visitez notre site web pour la première fois, nous vous montrerons une
                bannière avec une explication sur les cookies. Dès que vous cliquez sur «
                Enregistrer mes préférences » vous nous autorisez à utiliser les catégories de
                cookies et d’extensions que vous avez sélectionnés dans la fenêtre contextuelle,
                comme décrit dans la présente politique de cookies. Vous pouvez désactiver
                l’utilisation des cookies via votre navigateur, mais veuillez noter que notre site
                web pourrait ne plus fonctionner correctement.
            </p>
            <h3>5. Activer/désactiver et supprimer les cookies</h3>
            <p>
                Vous pouvez utiliser votre navigateur internet pour supprimer automatiquement ou
                manuellement les cookies. Vous pouvez également spécifier que certains cookies ne
                peuvent pas être placés. Une autre option consiste à modifier les réglages de votre
                navigateur Internet afin que vous receviez un message à chaque fois qu’un cookie est
                placé. Pour plus d’informations sur ces options, reportez-vous aux instructions de
                la section Aide de votre navigateur. Veuillez noter que notre site web peut ne pas
                marcher correctement si tous les cookies sont désactivés. Si vous supprimez les
                cookies dans votre navigateur, ils seront de nouveau placés après votre consentement
                lorsque vous revisiterez nos sites web.
            </p>
        </section>
    </div>
</template>

<script>
export default {
    name: 'CookiesPage',
}
</script>

<style lang="scss" scoped>
.cookies {
    color: $black;
    margin-top: calc(30px + $navbar-height);

    @media screen and (min-width: $max-tablet) {
        .cookies {
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
