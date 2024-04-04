<template>
    <div class="news-list-page page-section-medium">
        <h1 class="page-title">{{ $t('news.list.title') }}</h1>

        <div class="create-news-button-ctn">
            <LpiButton
                v-if="canCreateNews"
                primary
                :label="$filters.capitalize($t('news.list.create'))"
                @click="createNews"
                data-test="create-news-button"
                btn-icon="Plus"
                class="create-news-button"
            />
        </div>
        <div class="loader-ctn" v-if="loading">
            <LoaderSimple />
        </div>
        <div v-else class="news-list">
            <NewsListItem
                :news="news"
                v-for="news in allNews"
                :key="news.id"
                @edit-news="editedNews = news"
                @delete-news="newsToDelete = news"
            />
        </div>
    </div>

    <EditNewsDrawer :is-opened="!!editedNews" :news="editedNews" @close="editedNews = null" />

    <ConfirmModal
        v-if="newsToDelete"
        :content="$t('news.delete.message')"
        :title="$t('news.delete.title')"
        cancel-button-label="common.cancel"
        confirm-button-label="common.delete"
        @cancel="newsToDelete = null"
        @confirm="deleteNews"
        :asyncing="isDeletingNews"
    />
</template>
<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import NewsListItem from '@/components/lpikit/NewsListItem/NewsListItem.vue'
import EditNewsDrawer from '@/components/lpikit/EditNewsDrawer/EditNewsDrawer.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
export default {
    name: 'NewsListPage',
    components: {
        LpiButton,
        LoaderSimple,
        NewsListItem,
        EditNewsDrawer,
        ConfirmModal,
    },

    data() {
        return {
            allNews: [],
            loading: false,
            editedNews: null,
            newsToDelete: null,
            isDeletingNews: false,
        }
    },

    mounted() {
        this.loadNews()
    },
    computed: {
        canCreateNews() {
            // TODO: implement this
            return true
        },
    },

    methods: {
        createNews() {
            this.$router.push({ name: 'CreateNewsPage' })
        },

        async deleteNews() {
            // TODO: delete news
            console.log('delete news', this.newsToDelete)
            this.isDeletingNews = true
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call her
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('news.delete.success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('news.delete.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.newsToDelete = null
                this.isDeletingNews = false
            }
        },

        async loadNews() {
            this.loading = true
            // TODO: Fetch news
            await new Promise((resolve) => setTimeout(resolve, 1000))
            this.allNews = [
                {
                    id: 1,
                    title: 'News 1',
                    publication_date: '2024-03-01T16:09:34.882Z',
                    groups: [
                        {
                            id: 159,
                            name: 'R&D Staff',
                        },
                    ],
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
                    publication_date: '2024-03-01T16:09:34.882Z',
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
.page-title {
    margin-top: pxToRem(60px);
    margin-bottom: pxToRem(60px);
}

.create-news-button-ctn {
    margin: 2rem 0;
}

.create-news-button {
    margin-left: auto;
}

.loader-ctn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5rem 0;
}

.news-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 4rem;
}
</style>
