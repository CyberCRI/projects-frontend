<template>
    <div id="about">
        <a
            :class="{ visible: !scrollAtTop }"
            :style="{
                'background-image': `url(${PUBLIC_BINARIES_PREFIX}/discover/icons/icon-top.svg)`,
            }"
            class="button btn-top"
            href="#"
            @click.prevent="goTo('#about')"
        ></a>

        <div
            :style="{
                'background-image': `url(${PUBLIC_BINARIES_PREFIX}/discover/bg-projects-cri.jpg)`,
            }"
            class="header"
        >
            <div class="container">
                <h2>{{ $t('about.HEADER.title') }}</h2>
            </div>
        </div>

        <div class="block-about block-intro">
            <div class="container">
                <h3>{{ $t('about.WHY.title') }}</h3>

                <div class="des">
                    <i18n-t keypath="about.WHY.des" tag="p">
                        <a href="https://cri-paris.org/" place="link" target="_blank">CRI</a>
                    </i18n-t>
                    <p>{{ $t('about.WHY.des1') }}</p>
                    <i18n-t keypath="about.WHY.des2" tag="p">
                        <a href="http://projects.directory" place="link">{{
                            $t('about.WHY.platform')
                        }}</a>
                    </i18n-t>
                </div>

                <div class="buttons">
                    <LpiButton
                        :label="$t('about.WHY.button_blog.text')"
                        href="https://projects.cri-paris.org/projects/PyimxKq5"
                        level="primary"
                        target="_blank"
                    />
                </div>
            </div>
        </div>

        <div class="block-about block-goal bg-light">
            <div class="container">
                <h3>{{ $t('about.GOAL.title') }}</h3>

                <div class="des">
                    <i18n-t keypath="about.GOAL.des" tag="p">
                        <a href="https://learning-planet.org/" place="lpiLink">#LearningPlanet</a>
                    </i18n-t>
                    <p>
                        {{ $t('about.GOAL.des1') }}
                    </p>
                    <i18n-t keypath="about.GOAL.des2" tag="p">
                        <a href="https://welearn.cri-paris.org/" place="weLearnLink">WeLearn</a>
                        <a href="https://projects.cri-paris.org/projects/bsHSydgN" place="skillLink"
                            >CRI Skills</a
                        >
                    </i18n-t>
                </div>

                <div class="buttons">
                    <LpiButton
                        :label="$t('about.GOAL.button_community.text')"
                        href="https://forms.gle/hVYD1751YaGh7cmD7"
                        level="primary"
                        target="_blank"
                    />
                </div>
            </div>
        </div>

        <div class="block-about block-core">
            <div class="container">
                <h3>{{ $t('about.TEAM_CORE.title') }}</h3>

                <p>{{ $t('about.TEAM_CORE.des') }}</p>

                <ul class="people">
                    <li v-for="(coreTeamPerson, index) in coreTeam" :key="index" class="person">
                        <a :href="`${peopleUrl}/people/${coreTeamPerson.id}`" target="_blank">
                            <span
                                :style="{
                                    'background-image': `url(${PUBLIC_BINARIES_PREFIX}/discover/people/${coreTeamPerson.pic})`,
                                }"
                                class="img"
                            ></span>

                            <span class="name" v-html="coreTeamPerson.name"></span>

                            <span class="title">{{
                                $t(`about.TEAM_CORE.list[${index}].title`)
                            }}</span>

                            <span class="des">{{ $t(`about.TEAM_CORE.list[${index}].des`) }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="block-about block-contrib bg-light">
            <div class="container">
                <h3>{{ $t('about.TEAM_CONTRIB.title') }}</h3>

                <div>{{ $t('about.TEAM_CONTRIB.des') }}</div>

                <ul class="people">
                    <li v-for="(contributor, index) in contributors" :key="index" class="person">
                        <a :href="`${peopleUrl}/people/${contributor.id}`" target="_blank">
                            <span
                                :style="{
                                    'background-image': `url(${PUBLIC_BINARIES_PREFIX}/discover/people/${contributor.pic})`,
                                }"
                                class="img"
                            ></span>

                            <span class="name" v-html="contributor.name"></span>

                            <span class="title">{{
                                $t(`about.TEAM_CONTRIB.list[${index}].title`)
                            }}</span>

                            <span class="des">{{
                                $t(`about.TEAM_CONTRIB.list[${index}].des`)
                            }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="block-about block-jobs bg-dark">
            <div class="container">
                <h3>{{ $t('about.JOBS.title') }}</h3>

                <div>
                    <p>
                        {{ $t('about.JOBS.des') }}
                    </p>
                    <p>
                        {{ $t('about.JOBS.des1') }}
                    </p>
                </div>

                <div class="buttons">
                    <LpiButton
                        :label="$t('about.JOBS.button_jobboard.text')"
                        href="https://www.welcometothejungle.com/fr/companies/cri"
                        level="primary"
                        target="_blank"
                    />
                    <LpiButton
                        :label="$t('about.JOBS.button_contact.text')"
                        href="mailto:projects.platform@learningplanetinstitute.org"
                        level="primary"
                        target="_blank"
                    />
                </div>
            </div>
        </div>

        <CriPartners />
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import LpiButton from '@/components/base/button/LpiButton.vue'
import CriPartners from '@/components/CriPartners.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import pageTitle from '@/mixins/pageTitle.ts'

export default {
    name: 'AboutPage',

    mixins: [imageMixin, pageTitle],

    components: { LpiButton, CriPartners },

    pageTitle() {
        return this.$t('about.page-title')
    },

    data() {
        return {
            peopleUrl: process.env.NUXT_PUBLIC_APP_PEOPLE,
            currentOffset: 0,
            scrollAtTop: true,
            coreTeam: [
                {
                    id: 'b9afa4d6-9640-4f77-99af-7b3861c0207c',
                    name: 'Julien Joubin',
                    pic: 'julien.jpg',
                },
                {
                    id: 'cadf5827-e757-4910-96b2-5cc74f8ab6b3',
                    name: 'Iryna Nikolayeva',
                    pic: 'iryna.jpg',
                },
                {
                    id: '59dd46e8-65bb-4ffc-83bc-98cc8d5bd057',
                    name: 'Nicolas Pigelet',
                    pic: 'nicop.jpg',
                },
                {
                    id: '720deaa8-5f28-4411-a8f6-f8ecf8e0a101',
                    name: 'Eric Cherel',
                    pic: 'eric.jpg',
                },
                {
                    id: 'aed0e73b-f49a-489e-94b3-fc1787464bb6',
                    name: 'Jean-Marc Sevin',
                    pic: 'jeanmarc.jpg',
                },
                {
                    id: 'a99d8fb2-8edc-4a15-be2a-d22659f0ee68',
                    name: 'Nicolas Zilberman',
                    pic: 'nicoz.jpg',
                },
                {
                    id: '11f84d3f-8ffc-4360-b168-0df3d8a2a89f',
                    name: 'Andrea Giraldo Sevilla',
                    pic: 'andrea.jpg',
                },
                {
                    id: '3e64510a-4ac3-44f7-a653-e85eb785dcc7',
                    name: 'Roy Saurahb',
                    pic: 'roy.jpg',
                },
            ],
            contributors: [
                {
                    id: 'd5aa7350-d123-4ca8-bdea-5c7447a59e08',
                    name: 'Nadia Allam-mi ',
                    pic: 'nadia.jpg',
                },
                {
                    id: 'c7946a22-d065-4663-a7ed-71b5b5ef53f2',
                    name: 'Ignacio Atal',
                    pic: 'ignacio.jpg',
                },
                {
                    id: '77118d11-cccd-42be-a72c-761090c59508',
                    name: 'Pleen Lejeune',
                    pic: 'pleen.jpg',
                },
                {
                    id: '5764f1d8-c26e-46db-ae63-0b4d07e61211',
                    name: 'David Jung',
                    pic: 'david.jpg',
                },
                {
                    id: '572124b7-f570-4cbe-b9a1-6ac44dfa175a',
                    name: 'Prashant Sinha',
                    pic: 'prashant.jpg',
                },
                {
                    id: '87d6ffae-9905-49a9-a242-8b156d26386d',
                    name: 'Federica Minichiello',
                    pic: 'federica.jpg',
                },
                {
                    id: '7c7a2665-b2e5-4f1b-aae0-ac920e417697',
                    name: 'Gaell Mainguy',
                    pic: 'gaell.jpg',
                },
                {
                    id: '330b37fd-8768-4764-94db-bc47a91828e5',
                    name: 'François Taddei',
                    pic: 'francois.jpg',
                },
            ],
        }
    },

    mounted() {
        this.toggleTopBtn = debounce(
            () => {
                this.currentOffset = document.querySelector('#scrollview').scrollTop
                this.scrollAtTop = this.currentOffset > 500 ? false : true
            },
            150,
            { leading: false, trailing: true }
        )

        document.querySelector('#scrollview').addEventListener('scroll', this.toggleTopBtn)
    },

    methods: {
        goTo(anchor) {
            document.querySelector(anchor).scrollIntoView({
                behavior: 'smooth',
            })
        },
    },

    beforeUnmount() {
        document.querySelector('#scrollview').removeEventListener('scroll', this.toggleTopBtn)
    },
}
</script>

<style lang="scss" scoped>
#APP.About #maintopbar {
    background: rgb(0 0 0 / 30%);
}

#about {
    background: $white;
    color: black;
    font-family: Roboto, 'Noto Sans SC', helvetica, arial, sans-serif;
    padding-bottom: 0;
    text-align: center;
    scroll-behavior: smooth;

    a:focus {
        outline: none;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-weight: bold;
        letter-spacing: 1px;
        line-height: $line-height-squashed;
        text-transform: uppercase;
    }

    .thin {
        font-weight: normal !important;
    }

    .bold {
        font-weight: bold !important;
    }

    h2 {
        font-size: 36px;
    }

    h3 {
        font-size: 36px;
    }

    h4 {
        font-size: 24px;
    }

    h6 {
        font-size: 20px;
    }

    p {
        font-size: $font-size-m;
        letter-spacing: 0.2px;
    }

    .bg-light {
        background-color: lightgrey;
    }

    .bg-dark {
        background-color: darkgrey;
        color: $white;
    }

    .header {
        margin-top: -50px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        background-color: black;
        color: $white;
        height: 480px;
        overflow: hidden;
        position: relative;
    }

    .header .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        text-align: left;
    }

    .header .container h2 {
        margin-bottom: 20px;
    }

    .header .container p {
        margin-bottom: 20px;
    }

    .btn + .btn {
        margin-left: 10px;
    }

    .header::after {
        border-bottom: 60px solid $white;
        border-right: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        bottom: 0;
        width: 0;
    }

    .btn-top {
        background-color: #00c172;
        color: $white;
        opacity: 0;
        padding: 10px;
        position: fixed;
        right: 50px;
        bottom: 50px;
        visibility: hidden;
        z-index: 9999;
        text-decoration: none;
        text-transform: uppercase;
        transition:
            opacity 0.2s linear,
            visibility 0s linear 0.2s,
            bottom 0.2s ease;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100%;
        display: block;
        height: 38px;
        width: 38px;
        min-width: 0;
    }

    .btn-top.visible {
        opacity: 1;
        visibility: visible;
        transition:
            opacity 0.2s linear,
            visibility 0s linear,
            bottom 0.2s ease;
    }

    .block-about {
        overflow: hidden;
        padding: 100px 0;
        position: relative;
    }

    .block-about::before {
        border-top: 60px solid #00c172;
        border-left: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        top: -1px;
        width: 0;
        border-top-color: lightgrey;
    }

    .block-intro::before {
        content: none;
        display: none;
    }

    .block-intro {
        padding-top: 20px;
    }

    .block-about h3 {
        margin: 50px 0;
    }

    .block-about .des {
        margin: 0 auto;
        max-width: 800px;
        text-align: left;
    }

    .block-about p {
        color: darkgrey;
        margin: 20px 0;
    }

    .block-about p a {
        color: darkgrey;
        text-decoration: underline;
    }

    .block-about p a:hover {
        text-decoration: none;
    }

    .block-about.bg-dark p {
        color: $white;
    }

    .block-about.bg-dark p a {
        color: lightgrey;
    }

    .block-about.bg-light::before {
        border-top-color: $white;
    }

    .block-about .buttons {
        display: flex;
        margin: 50px auto 0;
        justify-content: center;
    }

    .people {
        display: flex;
        flex-wrap: wrap;
        margin-top: 50px;
    }

    .person {
        margin-bottom: 50px;
        width: 25%;
    }

    .person a {
        align-items: center;
        color: black;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-decoration: none;
    }

    .person .img {
        background-position: 50% 20%;
        background-size: cover;
        border-radius: 50%;
        height: 200px;
        margin-bottom: 30px;
        max-height: 200px;
        max-width: 200px;
        width: 100%;
    }

    .person .name {
        font-weight: bold;
        letter-spacing: 0.8px;
        margin-bottom: 5px;
        text-transform: uppercase;
    }

    .person .title {
        font-size: 14px;
    }

    .person .des {
        color: darkgrey;
        font-size: 14px;
        margin: 0 40px 20px;
        text-align: center;
    }

    @media screen and (width <= 1424px) {
        .container {
            margin: 0 40px;
            max-width: 100%;
        }

        .feature-list-item h6 {
            white-space: normal;
        }
    }

    @media screen and (width <= 768px) {
        .people {
            flex-direction: column;
        }

        .person {
            width: 100%;
        }
    }
}
</style>
