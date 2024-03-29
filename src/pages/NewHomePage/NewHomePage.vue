<template>
    <div v-if="loggedIn">
        <div class="page-section-medium title-container">
            <h1 class="main-title">{{ organization.dashboard_title }}</h1>
        </div>
        <!-- TODO keepin for testing purpose to remove when all is set -->
        <!-- div class="debug" style="background-color: rgba(255, 0, 0, 1); text-align: center">
            <label>
                projects <input v-model="summaryMaxProjects" type="number" min="0" max="3"
            /></label>
            <label>
                events <input v-model="summaryMaxEvents" type="number" min="0" max="3"
            /></label>

            <label>
                insturctions <input v-model="summaryMaxInstructions" type="number" min="0" max="1"
            /></label>
        </div -->
        <div v-if="summaryCardsExist && !isLoading" class="summary-cards">
            <div class="summary-container page-section-wide">
                <ProjectSummaryBlock
                    :projects="displayableProjects"
                    :inlined="numberOfSummaryBlock < 2"
                />

                <EventSummaryBlock
                    :events="displayableEvents"
                    v-if="displayableEvents.length"
                    :inlined="numberOfSummaryBlock < 2"
                />
                <InstructionSummaryBlock
                    :instructions="displayableInstructions"
                    v-if="displayableInstructions.length"
                    :inlined="numberOfSummaryBlock < 2"
                />
            </div>
        </div>
        <LpiLoader v-else class="loading" type="simple" />
    </div>
    <div v-else class="page-section-wide introduction">
        <div v-if="organization && organization.banner_image" class="banner-image">
            <h1 class="mobile-not-connected-main-title">
                {{ organization.dashboard_title }}
            </h1>
            <img :src="organization.banner_image.url" alt="logo" class="organization-banner" />
            <div class="introduction-container">
                <h1 class="image-main-title">
                    {{ organization.dashboard_title }}
                </h1>
                <div class="introduction-text">
                    {{ organization.dashboard_subtitle }}
                </div>
                <div class="image-account-buttons">
                    <LpiButton :label="$t('home.login')" :secondary="false" @click="logInUser" />
                    <LpiButton
                        :label="$t('home.account-request')"
                        :secondary="true"
                        class="login-button"
                        @click="$router.push({ name: 'RequestAccess' })"
                    />
                </div>
            </div>
        </div>
        <div v-else class="banner">
            <h1 class="centered-main-title">
                {{ organization.dashboard_title }}
            </h1>
            <div class="centered-introduction">
                {{ organization.dashboard_subtitle }}
            </div>
            <div class="account-buttons">
                <LpiButton :label="$t('home.login')" :secondary="false" />
                <LpiButton
                    :label="$t('home.account-request')"
                    :secondary="true"
                    class="login-button"
                />
            </div>
        </div>
    </div>
    <div class="page-section-medium">
        <div class="search-input-container">
            <SearchOptions
                class="search-options"
                :show-section-filter="true"
                :search-button="true"
                @search="goTo"
            ></SearchOptions>
        </div>
    </div>
    <div class="page-section-wide bottom-page">
        <div class="projects-and-people">
            <ProjectCategoriesDropdown />
            <div v-if="loggedIn" class="home-buttons">
                <HomeButtons :buttons="homeButtons" />
            </div>
            <div class="recommandations">
                <RecommendationBlock :organization="organization" :logged-in="loggedIn" />
            </div>
        </div>
        <div class="all-news">
            <div class="select-news"></div>
            <div class="news">
                <div v-if="topNews" class="top-news"></div>
                <div class="other-news">
                    <HomeNews :organization="organization" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchOptions from '@/components/lpikit/SearchOptions/SearchOptions.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ProjectCategoriesDropdown from '@/components/lpikit/Dropdown/ProjectCategoriesDropdown.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import permissions from '@/mixins/permissions.ts'
import RecommendationBlock from '@/components/lpikit/Recommendations/RecommendationBlock.vue'
import HomeButtons from '@/components/lpikit/HomeButtons/HomeButtons.vue'
import HomeNews from '@/components/lpikit/HomeNews/HomeNews.vue'
import ProjectSummaryBlock from '@/components/lpikit/SummaryCards/ProjectSummaryBlock.vue'
import EventSummaryBlock from '@/components/lpikit/SummaryCards/EventSummaryBlock.vue'
import InstructionSummaryBlock from '@/components/lpikit/SummaryCards/InstructionSummaryBlock.vue'
import { searchProjects } from '@/api/projects.service'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'

export default {
    name: 'NewHomePage',

    mixins: [imageMixin, permissions],

    components: {
        SearchOptions,
        LpiButton,
        ProjectCategoriesDropdown,
        RecommendationBlock,
        HomeButtons,
        HomeNews,
        LpiLoader,
        ProjectSummaryBlock,
        EventSummaryBlock,
        InstructionSummaryBlock,
    },

    data() {
        return {
            open_categories: false,
            recommendations: [],
            isLoading: true,
            homeButtons: [
                {
                    label: this.$t('home.new-project'),
                    action: () => this.$router.push({ name: 'createProject' }),
                    dataTest: 'create-project',
                },
            ],
            topNews: null,
            projects: [],
            events: [],
            instructions: [],
            summaryCardsExist: false,
            summaryMaxEvents: 3,
            summaryMaxProjects: 3,
            summaryMaxInstructions: 1,
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },

        loggedIn() {
            return this.$store.getters['users/isLoggedIn']
        },

        displayableEvents() {
            return this.events.slice(0, this.summaryMaxEvents)
        },

        displayableInstructions() {
            return this.instructions.slice(0, this.summaryMaxInstructions)
        },

        displayableProjects() {
            return this.projects.slice(0, this.summaryMaxProjects)
        },

        numberOfSummaryBlock() {
            let res = 0
            if (this.loggedIn) res++ // my projects block always visible (at leat create project button)
            if (this.displayableEvents.length > 0) res++
            if (this.displayableInstructions.length > 0) res++

            return res
        },
    },

    async mounted() {
        const filters = {
            limit: 3,
            ordering: '-updated_at',
            members: [this.$store.getters['users/id']],
            member_role: ['owners', 'members', 'reviewers'],
            organizations: this.$store.getters['organizations/current'].code,
        }
        const response = await searchProjects('', filters)
        this.projects = response.results

        this.summaryCardsExist = this.loggedIn && this.projects.length > 0

        await Promise.all([this.loadEvents(), this.loadInstructions()])

        this.isLoading = false
    },

    methods: {
        goTo(section, filters) {
            this.$router.push({ name: 'Search', query: { section, ...filters } })
        },

        logInUser() {
            goToKeycloakLoginPage()
        },

        async loadEvents() {
            this.events = [
                {
                    id: 1,
                    date: '2024-03-25',
                    name: 'Event 1',
                    information: 'Information 1',
                    groups: [],
                    date_edited: '2024-01-25T12:00:00Z',
                },
                {
                    id: 2,
                    date: '2024-03-28',
                    name: 'Event 2',
                    information: 'Information 2',
                    groups: [
                        {
                            id: 3,
                            name: 'Researchers',
                        },
                        {
                            id: 159,
                            name: 'R&D Staff',
                        },
                    ],
                    date_edited: '2024-03-05T12:00:00Z',
                },
                {
                    id: 3,
                    date: '2024-04-02',
                    name: 'Event 3',
                    information: 'Information 3',
                    groups: [],
                    date_edited: '2024-03-03T12:00:00Z',
                },
            ]
        },

        async loadInstructions() {
            this.instructions = [
                {
                    id: 1,
                    title: 'Instruction 1',
                    publication_date: '2024-03-01T16:09:34.882Z',
                    notify: false,
                    groups: [
                        {
                            id: 159,
                            name: 'R&D Staff',
                        },
                    ],
                    content: `<h2>Pourquoi?</h2><p>Le <em>CRI héberge</em> une communauté de passionnés, des projets inspirants qui y sont lancés tous les jours.</p><p>Néanmoins, il es<span style="color: rgb(255, 148, 115)">t difficile de savoir ce qu'il s'y déroule quotidiennement, et nous passons tous "à côté" de nombreuses et quotidiennes réalisations.</span></p><p><span style="color: rgb(255, 148, 115)">Faute de visibilité, certains projets perdent l'occasion d'un meilleur accompagnement, certaines forces se dispersent sur des idées redondantes ...</span></p><p><span style="color: rgb(255, 148, 115)">Afin de mieux partager ces idées avec tous, nous avons créé </span><strong><em><span style="color: rgb(255, 148, 115)">CRI Projects</span></em></strong><span style="color: rgb(255, 148, 115)">, une plateforme de présentation et de référencement de tous les projets au CRI.</span></p><p><span style="color: rgb(255, 148, 115)">Cette plate-forme se veut coll</span>aborative et simple d'accès, elle permettra à chacun de disposer d'un annuaire des très nombreux travaux menés au sein du CRI et de présenter ses propres réalisations.</p><p>Nous pensons également que d'autres organisations ont ce même besoin d'un meilleur partage de projets. Nous proposons de leur faire bénéficier de cet outil.</p><p></p><p></p><p></p><h2>Aider la communauté</h2><p>Nous pensons que cela pourra également permettre de plus facilement former des équipes sur certains sujets en leur permettant de mieux identifier les compétences, les réalisations déjà disponibles ou en gestation.</p><p>C'est aussi un moyen de mieux connaitre les personnes de la communauté ou qui gravitent autour du de l’organisation et de ses projets, en lien avec les objectifs du développement durable définis par les Nations-Unies.</p><p><br><img src="/v1/project/PyimxKq5/image/4086" class=" custom-image-full"><br></p><h2>Mieux communiquer</h2><p>Cette plate-forme renforcera l'impact de l'organisation en présentant simplement l'étendu de sa force créatrice et de ses potentiels.</p><p>Cela bénéficiera à tous, chaque projet bénéficiant d'une communication centralisée et plus large.</p><p>En effet CRI projects est, au même titre que CRI people, une source de donnée pour tous les moyens de communication digitaux du CRI, évitant les informations - mal - dupliquées.</p><p><br></p><h1>A qui est destinée cette plateforme?</h1><p>CRI Projects est d'abord construit pour la communauté du CRI : ses chercheurs, étudiants, personnels, alumni, mais aussi les personnes qui gravitent autour du CRI : participants à des ateliers, à des conférences, aux activités des Savanturiers, aux chercheurs associés, aux <em>utilisateurs</em> du MakerLab...</p><p><em>Nous</em> souhaitons aller plus loin et en faire bénéficier à d'autres organisations et communautés liées à la société apprenante. Nous le proposons en "software as a service" (SAAS) en plusieurs langues. Nous souhaitons également rendre son code open-source d'ici quelques mois (fin 2020). Certaines communautés ont déjà leur propre Projects (Savanturiers, HEP... ). Deux ministères et plusieurs autres organisations le testent également.</p><p><br></p><h1>Quels contenus dans un projet?</h1><p><em>Lorsque</em> vous créez un nouveau projet, vous lui créez un titre, une image, des contributeurs et vous pouvez l'annoter par objectifs de développement durable de l'UNESCO auquel(s) et par mots-clés. Ces mots-clés sont choisis parmi l'ensemble des titres d'articles de Wikipedia disponibles. Ils permettent de retrouver des projets ayant des similarités facilement. Dans la suite, ils permettront également d'être visualisés et partagés sur la cartographie de <a target="_blank" rel="noopener noreferrer nofollow" href="https://welearn.cri-paris.org/pages/onboarding.html">WeLearn.</a></p><p>Lorsque le projet est créé, vous pouvez créer :</p><ul><li><p>Un résumé et une description plus étayée (comme celle-ci) avec liens, images, vidéos...</p></li><li><p>Des objectifs et suivre leur avancement</p></li><li><p>Un blog pour documenter au fur et à mesure</p></li><li><p>Des liens vers des ressources extérieures</p></li><li><p>Une page pour que des personnes de la communauté puissent commenter</p></li></ul><p>Le tout reste modifiable si besoin par les membres de l'équipe.</p><p><br></p><h1>Un peu de technique...</h1><p>L'architecture de la plate-forme repose sur les techniques web modernes API / Client.</p><p></p><h2>Côté serveur</h2><p>Le serveur d'API CRI projects est développé en Python à l'aide du micro framework Flask.</p><p>Les données de la plate-forme sont stockées dans MongoDB.</p><p>Un serveur socket.IO fonctionnant sous python</p><p></p><h2>Côté client</h2><p>Le client browser de l'application est développé à l'aide de VueJS.</p><p>Les interactions collaboratives sont gérées par les librairies cliente socket.io et prosemirror.</p><p>blabla</p>`,
                },
                {
                    id: 2,
                    title: 'Instruction 2',
                    publication_date: '2024-03-01T16:09:34.882Z',
                    notify: false,
                    groups: [
                        {
                            id: 3,
                            name: 'Researchers',
                        },
                        {
                            id: 159,
                            name: 'R&D Staff',
                        },
                    ],
                    content: `<p>Hello word</p><pre class="lpi-code-block theme-dark tab-2"><code class="language-javascript" spellcheck="false">var sqs= "sdfsd"
 </code></pre><p></p><p>drop some style</p><pre class="lpi-code-block theme-dark tab-2"><code class="language-scss" spellcheck="false">
.status-bar {
    justify-content: center;
    top: 30px;

    &amp;.editor-frozen {
        top: 0;
    }

    .connection-status {
        padding: 0 2rem;
    }
}
</code></pre><p></p><pre class="lpi-code-block theme-dark tab-2"><code class="language-javascript" spellcheck="false">console.log("fpp");
const foo = 123</code></pre><table style="minWidth: 900px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th></tr><tr><td colspan="1" rowspan="1" style="background-color: null"><p></p></td><td colspan="1" rowspan="1" style="background-color: null"><p></p></td><td colspan="1" rowspan="1" style="background-color: null"><p></p></td></tr><tr><td colspan="1" rowspan="1" style="background-color: null"><p></p></td><td colspan="1" rowspan="1" style="background-color: null"><p></p></td><td colspan="1" rowspan="1" style="background-color: null"><p></p></td></tr></tbody></table>`,
                },
            ]
        },
    },
}
</script>

<style lang="scss" scoped>
.title-container {
    margin-top: $space-3xl;
    margin-bottom: $space-l;
}

.loading {
    display: flex;
    justify-content: center;
    padding-top: $space-l;
}

.introduction {
    margin-top: $space-3xl;
    margin-bottom: $space-2xl;

    .mobile-not-connected-main-title {
        font-size: $font-size-xl;
        text-align: center;
        margin-bottom: $space-xl;

        @media screen and (min-width: $min-tablet) {
            display: none;
        }
    }

    .banner-image {
        display: flex;
        flex-direction: column;

        @media screen and (min-width: $min-tablet) {
            flex-direction: row;
        }

        .organization-banner {
            margin-bottom: $space-l;

            @media screen and (min-width: $min-tablet) {
                margin-bottom: 0;
                margin-right: $space-2xl;
            }
        }

        .introduction-container {
            flex-direction: column;

            .image-main-title {
                display: none;
            }

            @media screen and (min-width: $min-tablet) {
                .image-main-title {
                    display: flex;
                    font-weight: 700;
                    font-size: $font-size-4xl;
                    margin-bottom: $space-l;
                }
            }

            .image-account-buttons {
                display: flex;
                margin-top: $space-l;
            }
        }
    }

    .banner {
        margin-inline: 0;
        padding-inline: 0;
        border: 1px solid red;

        @media screen and (min-width: $min-tablet) {
            margin-inline: $space-3xl;
            padding-inline: $space-3xl;
        }

        .centered-main-title {
            font-weight: 700;
            font-size: $font-size-xl;
            text-align: center;
            margin-bottom: $space-xl;

            @media screen and (min-width: $min-tablet) {
                font-size: $font-size-4xl;
                margin-bottom: $space-l;
            }
        }

        .centered-introduction {
            text-align: center;
        }

        .account-buttons {
            display: flex;
            justify-content: center;
            margin-top: $space-l;
        }
    }
}

.login-button {
    margin-left: $space-s;
}

.main-title {
    font-weight: 700;
    font-size: $font-size-xl;
    text-align: center;

    @media (min-width: $min-tablet) {
        padding-top: $space-m;
        font-weight: 700;
        font-size: $font-size-4xl;
        line-height: 1;
        text-align: center;
    }
}

.summary-cards {
    padding-inline: 0;

    .summary-container {
        background-color: $green-lighter;

        @media screen and (min-width: $min-tablet) {
            padding: $space-l;
            display: flex;
            gap: $space-unit;
            align-items: flex-start;

            & > :deep(*) {
                flex-basis: 33%;
                flex-grow: 1;
            }
        }
    }
}

.search-input-container {
    display: flex;
    padding-top: $space-l;
    padding-bottom: $space-l;
    border-radius: $border-radius-17;
    flex-direction: row;

    @media (min-width: $min-tablet) {
        padding-left: $space-2xl;
        padding-right: $space-2xl;
    }
}

.search-options {
    position: relative;
    cursor: pointer;
}

.search-options {
    padding-top: $space-unit;
}

.bottom-page {
    display: flex;
    margin-bottom: $space-l;
    border-radius: $border-radius-17;
    flex-direction: column;
    gap: $space-2xl;

    @media (min-width: $min-tablet) {
        flex-direction: row;
    }
}

.projects-and-people {
    margin-bottom: $space-xl;

    @media (min-width: $min-tablet) {
        flex-basis: 35%;
        margin-bottom: 0;
    }

    button {
        background-color: $white;
        cursor: pointer;
    }

    .categories {
        border: 1px solid $gray-10;
        border-radius: $border-radius-s;
        height: pxToRem(50px);
        display: flex;
        justify-content: space-between;
        padding-inline: $space-m;
        align-items: center;
        width: 100%;

        @media (min-width: $min-tablet) {
            margin-top: $space-l;
        }

        .categories-btn {
            color: $primary-dark;
            font-size: $font-size-m;
            font-weight: 700;
        }

        .caret {
            margin-left: $space-l;
            fill: $primary-dark;
            width: pxToRem(20px);
        }
    }

    .home-buttons {
        margin-top: $space-l;
        background-color: $primary-lighter;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        padding-block: $space-s;
    }

    .recommandations {
        margin-top: $space-l;
        border: 1px solid $green;
        border-radius: $border-radius-s;
    }
}

.all-news {
    height: fit-content;

    @media (min-width: $min-tablet) {
        flex-basis: 65%;
    }

    .select-news {
        height: $space-l;
    }

    .news {
        height: fit-content;

        .top-news {
            height: pxToRem(274px);
            border: 1px solid red;
        }
    }
}
</style>
