<template>
    <div class="news-list-page page-section-medium" v-if="news">
        <div class="news-header">
            <div class="news-img-ctn">
                <CroppedImage
                    :alt="`${news.title} image`"
                    :image-sizes="imageSizes"
                    :src="croppedImageSrc"
                    class="picture"
                />
            </div>
            <div class="header-texts">
                <BreadCrumbs :breadcrumbs="breadcrumbs" />
                <h1 class="page-title">NEWS {{ slugOrId }}</h1>
                <p>{{ publicationDate }}</p>
            </div>
        </div>
    </div>

    <div class="page-section-narrow" v-if="news">
        <div class="news-content" v-html="news.content"></div>
    </div>

    <div class="other-news page-section-narrow">
        <h3 class="other-news-title">{{ $t('news.page.others') }}</h3>
        <NewsListItem :news="anotherNews" v-for="anotherNews in otherNews" :key="anotherNews.id" />
    </div>
</template>
<script>
import BreadCrumbs from '@/components/lpikit/BreadCrumbs/BreadCrumbs.vue'
import NewsListItem from '@/components/lpikit/NewsListItem/NewsListItem.vue'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'

export default {
    name: 'NewsPage',

    mixins: [imageMixin],

    components: {
        BreadCrumbs,
        CroppedImage,
        NewsListItem,
    },
    props: {
        slugOrId: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            news: null,
            otherNews: [],
            loading: false,
            style: {},
        }
    },

    mounted() {
        this.loadNews()
        this.loadOtherNews()
    },

    computed: {
        breadcrumbs() {
            return [
                {
                    name: 'News',
                    route: { name: 'NewsListPage' },
                },
            ]
        },

        publicationDate() {
            return this.news?.date_publication
                ? new Date(this.news.date_publication).toLocaleDateString()
                : ''
        },

        imageSizes() {
            if (
                this.news &&
                this.news.header_image &&
                this.news.header_image.scale_x &&
                this.news.header_image.scale_y &&
                this.news.header_image.natural_ratio
            ) {
                return {
                    scaleX: this.news.header_image.scale_x,
                    scaleY: this.news.header_image.scale_y,
                    naturalRatio: this.news.header_image.natural_ratio,
                    left: this.news.header_image.left || 0,
                    top: this.news.header_image.top || 0,
                }
            }
            return null
        },

        croppedImageSrc() {
            return this.news && this.news.header_image
                ? this.news.header_image.variations.small
                : `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-1.png`
        },
    },

    methods: {
        async loadNews() {
            this.loading = true
            // TODO: Fetch news
            await new Promise((resolve) => setTimeout(resolve, 1000))
            this.news = {
                id: 1,
                title: 'News 1',
                date_publication: '2024-03-01T16:09:34.882Z',
                content: `<h2>Pourquoi?</h2><p>Le <em>CRI héberge</em> une communauté de passionnés, des projets inspirants qui y sont lancés tous les jours.</p><p>Néanmoins, il es<span style="color: rgb(255, 148, 115)">t difficile de savoir ce qu'il s'y déroule quotidiennement, et nous passons tous "à côté" de nombreuses et quotidiennes réalisations.</span></p><p><span style="color: rgb(255, 148, 115)">Faute de visibilité, certains projets perdent l'occasion d'un meilleur accompagnement, certaines forces se dispersent sur des idées redondantes ...</span></p><p><span style="color: rgb(255, 148, 115)">Afin de mieux partager ces idées avec tous, nous avons créé </span><strong><em><span style="color: rgb(255, 148, 115)">CRI Projects</span></em></strong><span style="color: rgb(255, 148, 115)">, une plateforme de présentation et de référencement de tous les projets au CRI.</span></p><p><span style="color: rgb(255, 148, 115)">Cette plate-forme se veut coll</span>aborative et simple d'accès, elle permettra à chacun de disposer d'un annuaire des très nombreux travaux menés au sein du CRI et de présenter ses propres réalisations.</p><p>Nous pensons également que d'autres organisations ont ce même besoin d'un meilleur partage de projets. Nous proposons de leur faire bénéficier de cet outil.</p><p></p><p></p><p></p><h2>Aider la communauté</h2><p>Nous pensons que cela pourra également permettre de plus facilement former des équipes sur certains sujets en leur permettant de mieux identifier les compétences, les réalisations déjà disponibles ou en gestation.</p><p>C'est aussi un moyen de mieux connaitre les personnes de la communauté ou qui gravitent autour du de l’organisation et de ses projets, en lien avec les objectifs du développement durable définis par les Nations-Unies.</p><p><br><img src="/v1/project/PyimxKq5/image/4086" class=" custom-image-full"><br></p><h2>Mieux communiquer</h2><p>Cette plate-forme renforcera l'impact de l'organisation en présentant simplement l'étendu de sa force créatrice et de ses potentiels.</p><p>Cela bénéficiera à tous, chaque projet bénéficiant d'une communication centralisée et plus large.</p><p>En effet CRI projects est, au même titre que CRI people, une source de donnée pour tous les moyens de communication digitaux du CRI, évitant les informations - mal - dupliquées.</p><p><br></p><h1>A qui est destinée cette plateforme?</h1><p>CRI Projects est d'abord construit pour la communauté du CRI : ses chercheurs, étudiants, personnels, alumni, mais aussi les personnes qui gravitent autour du CRI : participants à des ateliers, à des conférences, aux activités des Savanturiers, aux chercheurs associés, aux <em>utilisateurs</em> du MakerLab...</p><p><em>Nous</em> souhaitons aller plus loin et en faire bénéficier à d'autres organisations et communautés liées à la société apprenante. Nous le proposons en "software as a service" (SAAS) en plusieurs langues. Nous souhaitons également rendre son code open-source d'ici quelques mois (fin 2020). Certaines communautés ont déjà leur propre Projects (Savanturiers, HEP... ). Deux ministères et plusieurs autres organisations le testent également.</p><p><br></p><h1>Quels contenus dans un projet?</h1><p><em>Lorsque</em> vous créez un nouveau projet, vous lui créez un titre, une image, des contributeurs et vous pouvez l'annoter par objectifs de développement durable de l'UNESCO auquel(s) et par mots-clés. Ces mots-clés sont choisis parmi l'ensemble des titres d'articles de Wikipedia disponibles. Ils permettent de retrouver des projets ayant des similarités facilement. Dans la suite, ils permettront également d'être visualisés et partagés sur la cartographie de <a target="_blank" rel="noopener noreferrer nofollow" href="https://welearn.cri-paris.org/pages/onboarding.html">WeLearn.</a></p><p>Lorsque le projet est créé, vous pouvez créer :</p><ul><li><p>Un résumé et une description plus étayée (comme celle-ci) avec liens, images, vidéos...</p></li><li><p>Des objectifs et suivre leur avancement</p></li><li><p>Un blog pour documenter au fur et à mesure</p></li><li><p>Des liens vers des ressources extérieures</p></li><li><p>Une page pour que des personnes de la communauté puissent commenter</p></li></ul><p>Le tout reste modifiable si besoin par les membres de l'équipe.</p><p><br></p><h1>Un peu de technique...</h1><p>L'architecture de la plate-forme repose sur les techniques web modernes API / Client.</p><p></p><h2>Côté serveur</h2><p>Le serveur d'API CRI projects est développé en Python à l'aide du micro framework Flask.</p><p>Les données de la plate-forme sont stockées dans MongoDB.</p><p>Un serveur socket.IO fonctionnant sous python</p><p></p><h2>Côté client</h2><p>Le client browser de l'application est développé à l'aide de VueJS.</p><p>Les interactions collaboratives sont gérées par les librairies cliente socket.io et prosemirror.</p><p>blabla</p>`,

                header_image: {
                    id: 206151,
                    name: 'a-chicken.jpg',
                    url: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=4PnRMg5cbi%2BwYMgmtfGp8j9ovr%2BE5W4GqqV2Z6IbJ6Y%3D',
                    height: 461,
                    width: 615,
                    natural_ratio: 1.334056399132321,
                    scale_x: 1.3022598870056497,
                    scale_y: 1.3022598870056497,
                    left: -23.739837398373982,
                    top: -8.026030368763557,
                    created_at: '2023-11-27T16:51:32.471695Z',
                    variations: {
                        full: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.full.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=JT3vKtDWiMoorUa6mbbPpXZ%2BXh3AiQcRe7Jj31YcgtE%3D',
                        large: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.large.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=sbiFbVQkgPiKcpQ0bfbAzHndldD7Tt0v5dNYUc6tfFA%3D',
                        medium: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.medium.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=5M1SzzqTq6oawbOQw0Brr6CQx/rY/awdYkOhDipwX8g%3D',
                        small: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.small.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=3Ah26RJkv/FLEjqg4iNbrTLE%2Bsqu68QAcbaHPF6g6F8%3D',
                        original:
                            'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=4PnRMg5cbi%2BwYMgmtfGp8j9ovr%2BE5W4GqqV2Z6IbJ6Y%3D',
                    },
                },
            }

            this.loading = false
        },

        async loadOtherNews() {
            this.loading = true
            // TODO: Fetch other news
            await new Promise((resolve) => setTimeout(resolve, 1000))
            this.otherNews = [
                {
                    id: 1,
                    title: 'News 1',
                    content: `<h2>Pourquoi?</h2><p>Le <em>CRI héberge</em> une communauté de passionnés, des projets inspirants qui y sont lancés tous les jours.</p><p>Néanmoins, il es<span style="color: rgb(255, 148, 115)">t difficile de savoir ce qu'il s'y déroule quotidiennement, et nous passons tous "à côté" de nombreuses et quotidiennes réalisations.</span></p><p><span style="color: rgb(255, 148, 115)">Faute de visibilité, certains projets perdent l'occasion d'un meilleur accompagnement, certaines forces se dispersent sur des idées redondantes ...</span></p><p><span style="color: rgb(255, 148, 115)">Afin de mieux partager ces idées avec tous, nous avons créé </span><strong><em><span style="color: rgb(255, 148, 115)">CRI Projects</span></em></strong><span style="color: rgb(255, 148, 115)">, une plateforme de présentation et de référencement de tous les projets au CRI.</span></p><p><span style="color: rgb(255, 148, 115)">Cette plate-forme se veut coll</span>aborative et simple d'accès, elle permettra à chacun de disposer d'un annuaire des très nombreux travaux menés au sein du CRI et de présenter ses propres réalisations.</p><p>Nous pensons également que d'autres organisations ont ce même besoin d'un meilleur partage de projets. Nous proposons de leur faire bénéficier de cet outil.</p><p></p><p></p><p></p><h2>Aider la communauté</h2><p>Nous pensons que cela pourra également permettre de plus facilement former des équipes sur certains sujets en leur permettant de mieux identifier les compétences, les réalisations déjà disponibles ou en gestation.</p><p>C'est aussi un moyen de mieux connaitre les personnes de la communauté ou qui gravitent autour du de l’organisation et de ses projets, en lien avec les objectifs du développement durable définis par les Nations-Unies.</p><p><br><img src="/v1/project/PyimxKq5/image/4086" class=" custom-image-full"><br></p><h2>Mieux communiquer</h2><p>Cette plate-forme renforcera l'impact de l'organisation en présentant simplement l'étendu de sa force créatrice et de ses potentiels.</p><p>Cela bénéficiera à tous, chaque projet bénéficiant d'une communication centralisée et plus large.</p><p>En effet CRI projects est, au même titre que CRI people, une source de donnée pour tous les moyens de communication digitaux du CRI, évitant les informations - mal - dupliquées.</p><p><br></p><h1>A qui est destinée cette plateforme?</h1><p>CRI Projects est d'abord construit pour la communauté du CRI : ses chercheurs, étudiants, personnels, alumni, mais aussi les personnes qui gravitent autour du CRI : participants à des ateliers, à des conférences, aux activités des Savanturiers, aux chercheurs associés, aux <em>utilisateurs</em> du MakerLab...</p><p><em>Nous</em> souhaitons aller plus loin et en faire bénéficier à d'autres organisations et communautés liées à la société apprenante. Nous le proposons en "software as a service" (SAAS) en plusieurs langues. Nous souhaitons également rendre son code open-source d'ici quelques mois (fin 2020). Certaines communautés ont déjà leur propre Projects (Savanturiers, HEP... ). Deux ministères et plusieurs autres organisations le testent également.</p><p><br></p><h1>Quels contenus dans un projet?</h1><p><em>Lorsque</em> vous créez un nouveau projet, vous lui créez un titre, une image, des contributeurs et vous pouvez l'annoter par objectifs de développement durable de l'UNESCO auquel(s) et par mots-clés. Ces mots-clés sont choisis parmi l'ensemble des titres d'articles de Wikipedia disponibles. Ils permettent de retrouver des projets ayant des similarités facilement. Dans la suite, ils permettront également d'être visualisés et partagés sur la cartographie de <a target="_blank" rel="noopener noreferrer nofollow" href="https://welearn.cri-paris.org/pages/onboarding.html">WeLearn.</a></p><p>Lorsque le projet est créé, vous pouvez créer :</p><ul><li><p>Un résumé et une description plus étayée (comme celle-ci) avec liens, images, vidéos...</p></li><li><p>Des objectifs et suivre leur avancement</p></li><li><p>Un blog pour documenter au fur et à mesure</p></li><li><p>Des liens vers des ressources extérieures</p></li><li><p>Une page pour que des personnes de la communauté puissent commenter</p></li></ul><p>Le tout reste modifiable si besoin par les membres de l'équipe.</p><p><br></p><h1>Un peu de technique...</h1><p>L'architecture de la plate-forme repose sur les techniques web modernes API / Client.</p><p></p><h2>Côté serveur</h2><p>Le serveur d'API CRI projects est développé en Python à l'aide du micro framework Flask.</p><p>Les données de la plate-forme sont stockées dans MongoDB.</p><p>Un serveur socket.IO fonctionnant sous python</p><p></p><h2>Côté client</h2><p>Le client browser de l'application est développé à l'aide de VueJS.</p><p>Les interactions collaboratives sont gérées par les librairies cliente socket.io et prosemirror.</p><p>blabla</p>`,

                    header_image: {
                        id: 206151,
                        name: 'a-chicken.jpg',
                        url: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=4PnRMg5cbi%2BwYMgmtfGp8j9ovr%2BE5W4GqqV2Z6IbJ6Y%3D',
                        height: 461,
                        width: 615,
                        natural_ratio: 1.334056399132321,
                        scale_x: 1.3022598870056497,
                        scale_y: 1.3022598870056497,
                        left: -23.739837398373982,
                        top: -8.026030368763557,
                        created_at: '2023-11-27T16:51:32.471695Z',
                        variations: {
                            full: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.full.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=JT3vKtDWiMoorUa6mbbPpXZ%2BXh3AiQcRe7Jj31YcgtE%3D',
                            large: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.large.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=sbiFbVQkgPiKcpQ0bfbAzHndldD7Tt0v5dNYUc6tfFA%3D',
                            medium: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.medium.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=5M1SzzqTq6oawbOQw0Brr6CQx/rY/awdYkOhDipwX8g%3D',
                            small: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.small.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=3Ah26RJkv/FLEjqg4iNbrTLE%2Bsqu68QAcbaHPF6g6F8%3D',
                            original:
                                'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/d45fa676-536d-46bb-8d15-aa09aa4924a9a-chicken.jpg?se=2024-03-07T15%3A15%3A43Z&sp=r&sv=2022-11-02&sr=b&sig=4PnRMg5cbi%2BwYMgmtfGp8j9ovr%2BE5W4GqqV2Z6IbJ6Y%3D',
                        },
                    },
                },
                {
                    id: 2,
                    title: 'News 2',
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
                    header_image: {
                        id: 208044,
                        name: 'Patatoid-1.png',
                        url: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ce5f29f7-2f90-4133-b0d9-07d05782b41fPatatoid-1.png?se=2024-03-07T15%3A17%3A41Z&sp=r&sv=2022-11-02&sr=b&sig=fG3D4XRrxC7cKiAY4T1nyDlEluSXRoeJID93P12M7/Y%3D',
                        height: 469,
                        width: 469,
                        natural_ratio: null,
                        scale_x: null,
                        scale_y: null,
                        left: null,
                        top: null,
                        created_at: '2024-02-19T13:51:45.835501Z',
                        variations: {
                            full: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ce5f29f7-2f90-4133-b0d9-07d05782b41fPatatoid-1.full.png?se=2024-03-07T15%3A17%3A41Z&sp=r&sv=2022-11-02&sr=b&sig=ZytTijzQjDDYuFV8u76FF0U%2BRuc3HvzQ8Eyf/DtqVy4%3D',
                            large: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ce5f29f7-2f90-4133-b0d9-07d05782b41fPatatoid-1.large.png?se=2024-03-07T15%3A17%3A41Z&sp=r&sv=2022-11-02&sr=b&sig=2kmcC1ElMo%2B%2B2F1ilXldOdM5w3OVLpPwbqOgNcnDtGE%3D',
                            medium: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ce5f29f7-2f90-4133-b0d9-07d05782b41fPatatoid-1.medium.png?se=2024-03-07T15%3A17%3A41Z&sp=r&sv=2022-11-02&sr=b&sig=knyisOgvkn2WEhIRrde1VvMG7Q/xGXqFx/63v3mV8ts%3D',
                            small: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ce5f29f7-2f90-4133-b0d9-07d05782b41fPatatoid-1.small.png?se=2024-03-07T15%3A17%3A41Z&sp=r&sv=2022-11-02&sr=b&sig=Rlnfqw1dohWkEfeU6S6gloNh1oGXOBS2cpsHd7Id4IE%3D',
                            original:
                                'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ce5f29f7-2f90-4133-b0d9-07d05782b41fPatatoid-1.png?se=2024-03-07T15%3A17%3A41Z&sp=r&sv=2022-11-02&sr=b&sig=fG3D4XRrxC7cKiAY4T1nyDlEluSXRoeJID93P12M7/Y%3D',
                        },
                    },
                },
            ]

            this.loading = false
        },
    },
}
</script>
<style lang="scss" scoped>
.news-header {
    margin-top: 70px;
    margin-bottom: 3rem;

    --news-dimension: 16rem;

    display: flex;
    gap: 2rem;
    height: var(--news-dimension);
    overflow: hidden;
    padding: 1rem;
    border: $border-width-s solid $gray-10;
    border-radius: 1rem;
}

.news-img-ctn {
    flex-basis: var(--news-dimension);
    height: var(--news-dimension);
    flex-shrink: 0;
}

.news-texts {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
}

.page-title {
    font-size: $font-size-3xl;
}

.other-news {
    .other-news-title {
        font-size: $font-size-xl;
        margin-bottom: 2rem;
        text-align: center;
    }

    display: flex;
    flex-flow: column;
    gap: 1rem;
    margin: 4rem auto;
}

.cropped-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1rem;
}
</style>
