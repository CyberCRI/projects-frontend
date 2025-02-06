<template>
    <div id="discover">
        <a
            :class="{ visible: !scrollAtTop }"
            :style="{
                'background-image': `url(${PUBLIC_BINARIES_PREFIX}/discover/icons/icon-top.svg)`,
            }"
            class="button btn-top"
            href="#"
            @click.prevent="goTo('#discover')"
        ></a>

        <div
            :style="{
                'background-image': `url(${PUBLIC_BINARIES_PREFIX}/discover/bg-projects-cri.jpg)`,
            }"
            class="header"
        >
            <div class="container">
                <h2>{{ $t('discover.HEADER.title') }}&nbsp;{{ $t('discover.HEADER.impact') }}</h2>

                <p>
                    {{ $t('discover.HEADER.des') }}&nbsp;{{
                        $t('discover.HEADER.facilitate')
                    }}&nbsp;{{ $t('discover.HEADER.common') }}
                </p>

                <div class="header-buttons">
                    <LpiButton
                        :label="$t('discover.HEADER.button_discover')"
                        level="primary"
                        to="/dashboard"
                    />

                    <LpiButton
                        :label="$t('discover.HEADER.button_access')"
                        href="#get-access"
                        level="primary"
                        @click.prevent="goTo('#get-access')"
                    />
                </div>
            </div>
        </div>

        <div class="intro bg-green">
            <div class="container">
                <h4>{{ $t('discover.INTRO.title') }}</h4>

                <div class="intro-list">
                    <div
                        v-for="(introListItem, index) in introList"
                        :key="index"
                        class="intro-item"
                    >
                        <div class="item-icon">
                            <img
                                :src="`${PUBLIC_BINARIES_PREFIX}/discover/icons/${introListItem.icon})`"
                            />
                        </div>

                        <div class="item-num" v-text="introListItem.num"></div>

                        <div class="item-title">
                            {{ $t(`discover.INTRO.list[${index}].title`) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="features">
            <div v-for="(feature, featindex) in features" :key="featindex" class="bloc-feature">
                <div class="feature-content">
                    <div class="container">
                        <div class="feature-icon">
                            <img
                                :src="`${PUBLIC_BINARIES_PREFIX}/discover/icons/${feature.icon})`"
                            />
                        </div>

                        <h3>{{ $t(`discover.FEATURES[${featindex}].title`) }}</h3>

                        <i18n-t :keypath="`discover.FEATURES[${featindex}].des`" tag="p">
                            <br />
                        </i18n-t>

                        <!-- TABS MODE -->
                        <div v-if="feature.type == 'tabs'" class="feature-tabs">
                            <ul class="tabs-img">
                                <li
                                    v-for="(item, index) in feature.list"
                                    :key="index"
                                    :class="currentTab == index ? 'selected' : ''"
                                >
                                    <a v-if="item.href" :href="item.href">
                                        <img
                                            :alt="
                                                $t(
                                                    `discover.FEATURES[${featindex}].list[${index}].title`
                                                )
                                            "
                                            :src="`${PUBLIC_BINARIES_PREFIX}/discover/feat/${item.pic})`"
                                        />
                                    </a>

                                    <img
                                        v-else
                                        :alt="
                                            $t(
                                                `discover.FEATURES[${featindex}].list[${index}].title`
                                            )
                                        "
                                        :src="`${PUBLIC_BINARIES_PREFIX}/discover/feat/${item.pic})`"
                                    />
                                </li>
                            </ul>

                            <ul class="tabs-title">
                                <li v-for="(item, index) in feature.list" :key="index">
                                    <a
                                        :class="currentTab == index ? 'selected' : ''"
                                        @click="currentTab = index"
                                        >{{
                                            $t(
                                                `discover.FEATURES[${featindex}].list[${index}].title`
                                            )
                                        }}</a
                                    >
                                </li>
                            </ul>

                            <ul class="tabs-content">
                                <li
                                    v-for="(item, index) in feature.list"
                                    :key="index"
                                    :class="currentTab == index ? 'selected' : ''"
                                >
                                    <p>
                                        {{
                                            $t(`discover.FEATURES[${featindex}].list[${index}].des`)
                                        }}
                                    </p>
                                </li>
                            </ul>
                        </div>

                        <!-- TABLE MODE -->
                        <div v-if="feature.type == 'table'" class="feature-table">
                            <img
                                :src="`${PUBLIC_BINARIES_PREFIX}/discover/feat/${feature.tablepic})`"
                            />

                            <div class="feature-table-list">
                                <p
                                    v-for="(item, index) in feature.list"
                                    :key="index"
                                    class="feature-table-item"
                                >
                                    {{ $t(`discover.FEATURES[${featindex}].list[${index}].des`) }}
                                </p>
                            </div>
                        </div>

                        <!-- LIST MODE -->
                        <div
                            v-if="feature.type == 'list'"
                            :class="'feature-list feature-list-' + feature.list.length"
                        >
                            <div
                                v-for="(item, index) in feature.list"
                                :key="index"
                                class="feature-list-item"
                            >
                                <img
                                    :alt="
                                        $t(`discover.FEATURES[${featindex}].list[${index}].title`)
                                    "
                                    :src="`${PUBLIC_BINARIES_PREFIX}/discover/feat/${item.pic})`"
                                    @click="
                                        zoommedImg = `${PUBLIC_BINARIES_PREFIX}/discover/feat/${item.pic})`
                                    "
                                />

                                <h6>
                                    {{ $t(`discover.FEATURES[${featindex}].list[${index}].title`) }}
                                </h6>

                                <p>
                                    {{ $t(`discover.FEATURES[${featindex}].list[${index}].des`) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="feature.pic"
                    :style="{
                        'background-image': `url(${PUBLIC_BINARIES_PREFIX}/discover/${feature.pic})`,
                    }"
                    class="feature-pic"
                ></div>
            </div>
        </div>

        <div class="testimonials-projects bg-dark">
            <div class="container">
                <h3>{{ $t('discover.PROJECT.title') }}</h3>

                <p>{{ $t('discover.PROJECT.des') }}</p>

                <a :href="`${getMetaPortalUrl}/projects/PyimxKq5/summary`" class="projects-item">
                    <img
                        :alt="$t('discover.PROJECT.project.title')"
                        :src="`${PUBLIC_BINARIES_PREFIX}/discover/project-0.jpg`"
                    />

                    <div class="projects-item-title">
                        <h6 v-text="$t('discover.PROJECT.project.title')"></h6>

                        <p v-text="$t('discover.PROJECT.project.des')"></p>
                    </div>
                </a>
            </div>
        </div>

        <div class="testimonials-quotes bg-green">
            <div class="container testimonials-container">
                <a
                    :style="{
                        'background-image': `url(${PUBLIC_BINARIES_PREFIX}/discover/icons/icon-left.svg)`,
                    }"
                    class="btn-prev"
                    href="#"
                    @click.prevent="slidePrev()"
                ></a>

                <div
                    v-for="(item, index) in testimonials"
                    :key="index"
                    :class="currentslide == index ? 'selected' : ''"
                    class="quote"
                >
                    <a
                        v-if="item.project"
                        :href="`${getMetaPortalUrl}/projects/${item.project.id}/summary`"
                        class="projects-item"
                        target="_blank"
                    >
                        <img
                            :alt="$t(`discover.TESTIMONIALS.list[${index}].project.title`)"
                            :src="`${PUBLIC_BINARIES_PREFIX}/discover/${item.project.pic})`"
                        />

                        <div class="projects-item-title">
                            <h6
                                v-text="$t(`discover.TESTIMONIALS.list[${index}].project.title`)"
                            ></h6>

                            <p v-text="$t(`discover.TESTIMONIALS.list[${index}].project.des`)"></p>
                        </div>
                    </a>

                    <div class="quote-container">
                        <div class="quote-title">
                            {{ $t(`discover.TESTIMONIALS.list[${index}].title`) }}
                        </div>

                        <p class="quote-des">
                            {{ $t(`discover.TESTIMONIALS.list[${index}].des`) }}
                        </p>

                        <div class="quote-content">
                            <i18n-t
                                :keypath="`discover.TESTIMONIALS.list[${index}].quote`"
                                class="quote-text"
                                tag="p"
                            >
                                <br />
                            </i18n-t>

                            <p class="quote-author">
                                {{ $t(`discover.TESTIMONIALS.list[${index}].author`) }}
                            </p>
                        </div>
                    </div>
                </div>

                <a
                    :style="{
                        'background-image': `url(${PUBLIC_BINARIES_PREFIX}/discover/icons/icon-right.svg)`,
                    }"
                    class="btn-next"
                    href="#"
                    @click.prevent="slideNext()"
                ></a>
            </div>

            <div class="quote-nav">
                <li v-for="(item, index) in testimonials" :key="index">
                    <a :class="currentslide == index ? 'selected' : ''" @click="onSlide(index)"></a>
                </li>
            </div>
        </div>

        <div id="get-access" class="get-access bg-light">
            <div class="container">
                <h3>{{ $t('discover.ACCESS.title') }}</h3>

                <i18n-t keypath="discover.ACCESS.des" tag="p">
                    <br />
                </i18n-t>

                <div class="access-buttons">
                    <a
                        class="button button-icon"
                        href="https://forms.gle/cXL1usQeN4S5HLP16"
                        target="_blank"
                    >
                        <img
                            :src="`${PUBLIC_BINARIES_PREFIX}/discover/icons/_icon-user-white.svg)`"
                        />

                        <span class="button-text">{{
                            $t('discover.ACCESS.button_personal.text')
                        }}</span>
                    </a>

                    <a
                        class="button button-icon"
                        href="https://forms.gle/hVYD1751YaGh7cmD7"
                        target="_blank"
                    >
                        <img
                            :src="`${PUBLIC_BINARIES_PREFIX}/discover/icons/_icon-community-white.svg`"
                        />

                        <span class="button-text">{{
                            $t('discover.ACCESS.button_community.text')
                        }}</span>
                    </a>
                </div>
            </div>
        </div>

        <CriPartners />

        <div class="contact bg-dark">
            <div class="container">
                <h3>{{ $t('discover.CONTACT.title') }}</h3>

                <i18n-t keypath="discover.CONTACT.des" tag="p">
                    <a
                        href="mailto:projects.platform@learningplanetinstitute.org"
                        place="link"
                        target="_blank"
                        >projects.platform@learningplanetinstitute.org</a
                    >
                </i18n-t>
            </div>
        </div>

        <div :class="zoommedImg ? 'visible' : ''" class="zoom" @click="zoommedImg = null">
            <img :src="zoommedImg" />
        </div>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import formatHtml from '@/mixins/formatHtml.ts'

import LpiButton from '@/components/base/button/LpiButton.vue'
import CriPartners from '@/components/CriPartners.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import pageTitle from '@/mixins/pageTitle.ts'

import { useRuntimeConfig } from '#imports'

export default {
    name: 'DiscoverPage',

    mixins: [formatHtml, imageMixin, pageTitle],

    components: { LpiButton, CriPartners },

    pageTitle() {
        return this.$t('discover.page-title')
    },

    setup() {
        const runtimeConfig = useRuntimeConfig()

        return {
            runtimeConfig,
        }
    },

    data() {
        return {
            currentTab: 0,
            currentslide: 0,
            currentOffset: 0,
            scrollAtTop: true,
            zoommedImg: null,
            introList: [
                {
                    num: '1280+',
                    icon: 'icon-project-white.svg',
                },
                {
                    num: '1850+',
                    icon: 'icon-user-white.svg',
                },
                {
                    num: '15+',
                    icon: 'icon-community-white.svg',
                },
            ],
            features: [
                {
                    type: 'tabs',
                    icon: 'icon-light-green.svg',
                    pic: 'illu1.jpg',
                    list: [
                        {
                            pic: 'feat-linked.jpg',
                        },
                        {
                            pic: 'feat-tag.jpg',
                            href: '/tags-map',
                        },
                        {
                            pic: 'feat-geo.jpg',
                            href: '/map',
                        },
                    ],
                },
                {
                    type: 'table',
                    icon: 'icon-share-green.svg',
                    pic: 'illu2.jpg',
                    tablepic: 'feat-share.jpg',
                },
                {
                    type: 'list',
                    icon: 'icon-teach-green.svg',
                    pic: 'illu6.jpg',
                    list: [
                        {
                            pic: 'feat-templates.jpg',
                        },
                        {
                            pic: 'feat-review.jpg',
                        },
                    ],
                },
                {
                    type: 'list',
                    icon: 'icon-community-green.svg',
                    list: [
                        {
                            pic: 'feat-portal.jpg',
                        },
                        {
                            pic: 'feat-admin.jpg',
                        },
                        {
                            pic: 'feat-external.jpg',
                        },
                    ],
                },
            ],
            testimonials: [
                {
                    project: {
                        id: 'vVfBTCl4',
                        pic: 'project-1.jpg',
                    },
                },
                {
                    project: {
                        id: 'IFJer642',
                        pic: 'project-2.jpg',
                    },
                },
                {
                    project: {
                        id: 'z1wzXjYk',
                        pic: 'project-3.jpg',
                    },
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

    computed: {
        maxSlide() {
            return this.testimonials.length
        },
        getMetaPortalUrl() {
            return this.runtimeConfig.public.appMetaPortalUrl
        },
    },

    beforeUnmount() {
        document.querySelector('#scrollview').removeEventListener('scroll', this.toggleTopBtn)
        document.title = 'Projects'
    },

    methods: {
        onSlide(index) {
            this.currentslide = index
        },

        goTo(anchor) {
            document.querySelector(anchor).scrollIntoView({
                behavior: 'smooth',
            })
        },

        slidePrev() {
            this.currentslide = this.currentslide > 0 ? this.currentslide - 1 : this.maxSlide - 1
        },

        slideNext() {
            this.currentslide = this.currentslide < this.maxSlide - 1 ? this.currentslide + 1 : 0
        },
    },
}
</script>

<style lang="scss" scoped>
#APP.Discover #maintopbar {
    background: rgb(0 0 0 / 30%);
}

#discover {
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

    .has-text-right {
        text-align: right;
    }

    .button,
    .bg-green {
        background-color: #81a617;
        color: $white;
    }

    .bg-dark {
        background-color: darkgrey;
        color: $white;
    }

    .bg-light {
        background-color: lightgrey;
    }

    .button {
        align-items: center;
        display: flex;
        font-family: Roboto, 'Noto Sans SC', helvetica, arial, sans-serif;
        font-size: 13px;
        justify-content: center;
        padding: 15px 20px;
        text-decoration: none;
        text-transform: uppercase;
        height: 100%;
    }

    .button:hover {
        filter: brightness(1.1);
    }

    .button-icon img {
        margin-right: 15px;
        max-height: 28px;
        max-width: 28px;
    }

    .container {
        margin: 0 auto;
        max-width: 1344px;

        .header-buttons .button {
            display: inline-block;
        }
    }

    .btn-top {
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

    .header {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        background-color: black;
        color: $white;
        height: 720px;
        max-height: 80vh;
        min-height: 480px;
        overflow: hidden;
        position: relative;
        margin-top: -50px;
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
        border-bottom: 60px solid #81a617;
        border-right: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        bottom: 0;
        width: 0;
    }

    .header .btn-primary {
        background: #81a617;
    }

    .intro {
        font-weight: bold;
        overflow: hidden;
        padding: 60px 0 160px;
        position: relative;
    }

    .intro::after {
        border-bottom: 60px solid $white;
        border-right: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        bottom: 0;
        width: 0;
    }

    .intro-list {
        align-items: center;
        display: flex;
        justify-content: center;
        margin: 70px 0 0;
    }

    .intro-item {
        margin: 0 10%;
    }

    .intro-item .item-icon {
        align-items: center;
        display: flex;
        justify-content: center;
        height: 38px;
        margin-bottom: 25px;
    }

    .intro-item img {
        max-height: 38px;
        max-width: 52px;
        min-width: 38px;
    }

    .intro-item .item-num {
        font-size: 72px;
        line-height: $line-height-squashed;
        margin-bottom: 30px;
    }

    .intro-item .item-title {
        font-size: 24px;
        letter-spacing: 1px;
        line-height: $line-height-squashed;
        text-transform: uppercase;
    }

    .bloc-feature {
        font-family: Roboto, 'Noto Sans SC', helvetica, arial, sans-serif;
        overflow: hidden;
        position: relative;
        text-align: center;
    }

    .feature-content {
        padding: 60px 0 100px;
    }

    .feature-content .feature-icon {
        margin: 0 auto;
        max-height: 70px;
        max-width: 70px;
        text-align: center;
    }

    .feature-content .feature-icon img {
        display: block;
        width: 100%;
    }

    .feature-content h3 {
        margin: 50px 0;
    }

    .feature-content p {
        color: darkgrey;
        margin: 20px 0;
    }

    .tabs-title {
        align-items: center;
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }

    .tabs-title li {
        margin: 0 10px;
    }

    .tabs-title li a {
        border-bottom: 1px solid #00c172;
        color: darkgrey;
        cursor: pointer;
        display: block;
        padding: 5px;
        text-transform: uppercase;
    }

    .tabs-title li a:hover {
        color: darkgrey;
    }

    .tabs-title li .selected {
        border-bottom: 2px solid #00c172;
        color: black;
    }

    .tabs-content {
        margin: 0 auto;
        max-width: 500px;
        min-height: 72px;
        position: relative;
    }

    .tabs-content p {
        margin: 0;
    }

    .tabs-img {
        margin: 50px 0;
        position: relative;
    }

    .tabs-img li:not(:first-of-type),
    .tabs-content li:not(:first-of-type) {
        left: 50%;
        position: absolute;
        top: -1px;
        transform: translateX(-50%);
        width: 100%;
    }

    .tabs-img img {
        display: block;
        margin: 0 auto;
        max-width: 800px;
        width: 100%;
    }

    .tabs-img li,
    .tabs-content li {
        opacity: 0;
        visibility: hidden;
        transition:
            opacity 0.2s linear,
            visibility 0s linear 0.2s;
    }

    .tabs-img li.selected,
    .tabs-content li.selected {
        opacity: 1;
        visibility: visible;
        transition:
            opacity 0.2s linear 0.2s,
            visibility 0s linear;
    }

    .feature-table img {
        display: block;
        margin: 50px auto;
        max-width: 800px;
        width: 100%;
    }

    .feature-table-list {
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
    }

    p.feature-table-item {
        margin: 20px;
        text-align: left;
        width: calc(50% - 40px);
    }

    p.feature-table-item::before {
        background: #00c172;
        content: '';
        display: block;
        height: 3px;
        margin-bottom: 20px;
        width: 100%;
    }

    .feature-list {
        align-items: flex-start;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 100px 0 50px;
    }

    .feature-list-2 .feature-list-item {
        width: calc(50% - 100px);
    }

    .feature-list-3 .feature-list-item {
        width: calc(33.33% - 100px);
    }

    .feature-list-item {
        margin: 0 50px;
    }

    .feature-list-item img {
        cursor: zoom-in;
        display: block;
        margin: 0 auto 50px;
        max-width: 450px;
        width: 100%;
    }

    .feature-pic {
        background-attachment: fixed;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        height: 400px;
        max-height: 50vh;
        min-height: 400px;
        overflow: hidden;
        position: relative;
    }

    .feature-pic::before {
        border-top: 60px solid $white;
        border-left: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        top: -1px;
        width: 0;
    }

    .feature-pic::after {
        border-bottom: 60px solid $white;
        border-right: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        bottom: 0;
        width: 0;
    }

    .testimonials-projects {
        overflow: hidden;
        padding: 80px 0;
        position: relative;
    }

    .testimonials-projects::before {
        border-top: 60px solid $white;
        border-left: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        top: -1px;
        width: 0;
    }

    .testimonials-projects h3 {
        margin: 50px 0;
    }

    .projects-item {
        background: $white;
        color: darkgrey;
        display: block;
        height: 320px;
        margin: 0 10px;
        padding: 10px;
        text-align: left;
        text-decoration: none;
        width: 320px;
        transition: transform 0.2s ease;
    }

    .projects-item:hover {
        transform: translateX(-2px) translateY(-4px);
    }

    .projects-item-title {
        padding: 20px 10px;
    }

    .projects-item img {
        width: 100%;
    }

    .projects-item h6 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: normal;
        line-height: $line-height-squashed;
        text-transform: none;
    }

    .projects-item p {
        font-size: 13px;
        font-weight: 500;
        letter-spacing: normal;
        line-height: $line-height-compact;
        margin-top: 10px;
    }

    .testimonials-projects .projects-item {
        display: flex;
        height: 200px;
        margin: 50px auto;
        max-width: 700px;
        width: calc(100% - 20px);
    }

    .testimonials-projects .projects-item-title {
        padding: 20px;
    }

    .testimonials-projects .projects-item img {
        height: 100%;
        width: auto;
    }

    .testimonials-projects .projects-item h6 {
        margin-bottom: 15px;
        padding-bottom: 15px;
        position: relative;
    }

    .testimonials-projects .projects-item h6::after {
        content: '';
        position: absolute;
        width: 20%;
        left: 0;
        bottom: 0;
        min-width: 20px;
        height: 2px;
        background: darkgrey;
    }

    .testimonials-quotes {
        overflow: hidden;
        position: relative;
    }

    .testimonials-quotes::before {
        border-top: 60px solid darkgrey;
        border-left: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        top: -1px;
        width: 0;
    }

    .testimonials-container {
        overflow: hidden;
        position: relative;
    }

    .testimonials-container .btn-prev,
    .testimonials-container .btn-next {
        background: no-repeat center center;
        background-size: 100px 100px;
        cursor: pointer;
        display: block;
        height: 100%;
        opacity: 0;
        position: absolute;
        top: 0;
        width: 150px;
        z-index: 2;
        transition: opacity 0.2s linear;
    }

    .testimonials-container .btn-prev {
        left: -50px;
    }

    .testimonials-container .btn-next {
        right: -50px;
    }

    .testimonials-container .btn-prev:hover,
    .testimonials-container .btn-next:hover {
        opacity: 1;
    }

    .quote {
        align-items: center;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        opacity: 0;
        padding: 150px 0 50px;
        position: relative;
        transition: opacity 0.2s linear;
    }

    .quote:not(:first-of-type) {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translate(-50%);
        width: 100%;
    }

    .quote.selected {
        opacity: 1;
        z-index: 1;
    }

    .quote-container {
        margin-left: 150px;
        max-width: 600px;
        text-align: left;
    }

    .quote .projects-item {
        flex-shrink: 0;
    }

    .quote-title {
        font-size: 24px;
        text-transform: uppercase;
        margin-bottom: 10px;
    }

    .quote-content {
        margin: 80px 0 40px;
        position: relative;
        text-align: left;
    }

    .quote-content::before,
    .quote-content::after {
        display: block;
        font-size: 300px;
        line-height: 0.5;
        opacity: 0.3;
        position: absolute;
    }

    .quote-content::before {
        content: '\201C';
        left: -90px;
        top: -8px;
    }

    .quote-content::after {
        bottom: -135px;
        content: '\201D';
        right: -90px;
    }

    .quote-author {
        margin-top: 20px;
    }

    .quote-nav {
        display: flex;
        justify-content: center;
        list-style: none;
        margin: 0 auto;
        padding: 0 0 20px;
    }

    .quote-nav li a {
        align-content: center;
        cursor: pointer;
        display: flex;
        margin: 0 2px;
        opacity: 0.5;
        overflow: hidden;
        padding: 10px 0;
        text-indent: -5000px;
        width: 40px;
        transition: opacity 0.2s linear;
    }

    .quote-nav li a::before {
        background: $white;
        content: '';
        display: block;
        height: 5px;
        width: 100%;
    }

    .quote-nav li a:hover {
        opacity: 0.8;
    }

    .quote-nav li a.selected {
        opacity: 1;
    }

    .get-access {
        overflow: hidden;
        padding: 100px 0;
        position: relative;
    }

    .get-access::before {
        border-top: 60px solid #81a617;
        border-left: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        top: -1px;
        width: 0;
    }

    .get-access h3 {
        margin: 50px 0;
    }

    .get-access p {
        color: darkgrey;
    }

    .access-buttons {
        align-items: center;
        display: flex;
        justify-content: center;
        margin-top: 50px;
    }

    .access-buttons .button {
        height: 50px;
        max-width: 100%;
        width: 400px;
    }

    .access-buttons .button + .button {
        margin-left: 50px;
    }

    .contact {
        overflow: hidden;
        padding: 100px 0;
        position: relative;
    }

    .contact::before {
        border-top: 60px solid $white;
        border-left: 100vw solid transparent;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        top: -1px;
        width: 0;
    }

    .contact h3 {
        margin: 50px 0;
    }

    .contact a {
        color: $white;
    }

    .contact a:hover {
        text-decoration: none;
    }

    .zoom {
        align-items: center;
        background: rgb(0 0 0 / 50%);
        cursor: zoom-out;
        display: flex;
        height: 100vh;
        justify-content: center;
        opacity: 0;
        position: fixed;
        right: 0;
        top: 0;
        visibility: hidden;
        width: 100vw;
        z-index: 999999;
        transition:
            opacity 0.2s linear,
            visibility 0s linear 0.2s;
    }

    .zoom.visible {
        opacity: 1;
        visibility: visible;
        transition:
            opacity 0.2s linear,
            visibility 0s linear;
    }

    .zoom img {
        display: block;
        max-height: 90vh;
        max-width: 90vw;
        margin: 5vh 5vw;
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

    @media screen and (width <= 1150px) {
        .quote {
            flex-direction: column;
            height: auto;
        }

        .quote-container {
            margin-left: 0;
        }

        .quote .projects-item {
            margin-bottom: 100px;
        }

        .quote:not(:first-of-type) {
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    @media screen and (width <= 768px) {
        .intro-list,
        .tabs-title,
        .feature-list,
        .projects-list,
        .access-buttons {
            flex-direction: column;
        }

        .intro-item {
            margin-bottom: 50px;
        }

        .feature-content p br {
            content: '';
        }

        .feature-content p br::after {
            content: '\00a0';
        }

        .feature-list-2 .feature-list-item,
        .feature-list-3 .feature-list-item {
            margin-bottom: 50px;
            width: calc(100% - 100px);
        }

        .projects-item {
            margin: 0 auto 50px;
        }

        .testimonials-projects .projects-item {
            flex-direction: column;
            height: 300px;
            width: 300px;
        }

        .testimonials-projects .projects-item img {
            height: auto;
            width: 100%;
        }

        .testimonials-projects .projects-item-title {
            padding: 20px 10px;
        }

        .quote {
            height: 920px;
            margin: 0 60px;
            width: auto;
        }

        .quote:not(:first-of-type) {
            left: 0;
            top: 0;
            transform: none;
        }

        .quote-content::before,
        .quote-content::after {
            content: none;
            display: none;
        }

        .quote-content {
            margin-top: 40px;
        }

        .access-buttons .button + .button {
            margin-left: 0;
            margin-top: 30px;
        }
    }

    @media screen and (width <= 500px) {
        p.feature-table-item {
            margin: 20px 0;
            width: 100%;
        }

        .quote {
            margin: 0;
        }

        .quote .projects-item {
            margin-bottom: 50px;
        }
    }
}
</style>
