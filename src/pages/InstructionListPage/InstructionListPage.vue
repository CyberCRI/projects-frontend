<template>
    <div class="instruction-list-page page-section-medium">
        <h1 class="page-title">{{ $t('instructions.list.title') }}</h1>

        <div class="create-instruction-button-ctn">
            <LpiButton
                v-if="canCreateInstruction"
                primary
                :label="$filters.capitalize($t('instructions.list.create'))"
                @click="createInstruction"
                data-test="create-instruction-button"
                btn-icon="Plus"
                class="create-instruction-button"
            />
        </div>
        <div class="loader-ctn" v-if="loading">
            <LoaderSimple />
        </div>
        <div v-else class="instruction-list">
            <InstructionListItem
                :instruction="instruction"
                v-for="instruction in allInstructions"
                :key="instruction.id"
                @edit-instruction="editedInstruction = instruction"
                @delete-instruction="instructionToDelete = instruction"
            />
        </div>
    </div>
    <EditInstructionDrawer
        :is-opened="!!editedInstruction"
        :instruction="editedInstruction"
        @close="editedInstruction = null"
    />
    <ConfirmModal
        v-if="instructionToDelete"
        :content="$t('instructions.delete.message')"
        :title="$t('instructions.delete.title')"
        cancel-button-label="common.cancel"
        confirm-button-label="common.delete"
        @cancel="instructionToDelete = null"
        @confirm="deleteInstruction"
        :asyncing="isDeletingInstruction"
    />
</template>
<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import InstructionListItem from '@/components/lpikit/InstructionListItem/InstructionListItem.vue'
import EditInstructionDrawer from '@/components/lpikit/EditInstructionDrawer/EditInstructionDrawer.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
export default {
    name: 'InstructionListPage',
    components: {
        LpiButton,
        LoaderSimple,
        InstructionListItem,
        EditInstructionDrawer,
        ConfirmModal,
    },

    data() {
        return {
            allIinstructions: [],
            loading: false,
            editedInstruction: null,
            instructionToDelete: null,
            isDeletingInstruction: false,
        }
    },

    mounted() {
        this.loadInstructions()
    },
    computed: {
        canCreateInstruction() {
            // TODO: implement this
            return true
        },
    },

    methods: {
        createInstruction() {
            this.$router.push({ name: 'CreateInstructionPage' })
        },

        async loadInstructions() {
            this.loading = true
            // TODO: Fetch news
            await new Promise((resolve) => setTimeout(resolve, 1000))
            this.allInstructions = [
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

            this.loading = false
        },

        async deleteInstruction() {
            // TODO: delete intstuction
            console.log('delete instruction', this.instructionToDelete)
            this.isDeletingInstruction = true
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call her
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('instructions.delete.success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('instructions.delete.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.instructionToDelete = null
                this.isDeletingInstruction = false
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-top: pxToRem(60px);
    margin-bottom: pxToRem(60px);
}

.create-instruction-button-ctn {
    margin: 2rem 0;
}

.create-instruction-button {
    margin-left: auto;
}

.loader-ctn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5rem 0;
}

.instruction-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 4rem;
}
</style>
