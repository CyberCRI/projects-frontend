<template>
    <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
        <template #actions>
            <LinkButton
                v-if="featuredProjects.length"
                btn-icon="Pen"
                :label="$t('common.edit')"
                @click="editFeaturedProjects = true"
            />
            <LinkButton
                v-else
                btn-icon="Plus"
                :label="$t('common.add')"
                @click="editFeaturedProjects = true"
            />
        </template>
        <template #default>
            <FeaturedProjectAdminListItem
                v-for="featuredProject in featuredProjects"
                :key="featuredProject.id"
                :project="featuredProject"
            ></FeaturedProjectAdminListItem>
        </template>
    </AdminBlock>
    <PickProjectsDrawer
        :is-opened="editFeaturedProjects"
        @close="editFeaturedProjects = false"
        :pre-selected-projects="featuredProjects"
        @picked-projects="onPickProjects"
        :max-pick="maxProjects"
        :drawer-title="$t('featured-projects.drawer.title')"
    />
</template>
<script>
import AdminBlock from '../AdminBlock.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import PickProjectsDrawer from '@/components/lpikit/PickProjectsDrawer/PickProjectsDrawer.vue'
import FeaturedProjectAdminListItem from './FeaturedProjectAdminListItem.vue'

const dummyFeaturedProjects = [
    {
        id: 'mA6MwT0N',
        title: 'Learning Planet Assembly aims at scaling up SDG-based pedagogies to engage all students worldwide, in learning about our common problems and designing sustainable solutions',
        slug: 'learning-planet-assembly',
        purpose:
            'The Learning Planet initiative aims at scaling up SDG-based pedagogies to engage all students worldwide, in learning about our common problems and designing sustainable solutions',
        language: 'en',
        organizations: [
            {
                id: 1,
                code: 'CRI',
                is_logo_visible_on_parent_dashboard: true,
                background_color: '#9CF7FD',
                website_url: 'https://cri.projects.k8s.lp-i.dev',
                name: 'Learning Planet Institute',
                logo_image: {
                    id: 208085,
                    name: 'logo LPII.PNG',
                    url: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=JdkRgv898WTT0h2wTP57QrqE%2Bjy3i9RXiiXRpUyRNSo%3D',
                    height: 527,
                    width: 594,
                    natural_ratio: null,
                    scale_x: null,
                    scale_y: null,
                    left: null,
                    top: null,
                    created_at: '2024-02-20T16:35:10.682429Z',
                    variations: {
                        full: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.full.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=wiyuGgk3/dX44N7pHlqmo2JTZYLie62j7jUzgauYe/M%3D',
                        large: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.large.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=yCeLbCq6cPW3jpL3zPOWKtqRCJMvxOZNHyjrYtaeMFw%3D',
                        medium: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.medium.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=9pgnOVZT17QpI2YrGFzl/GJ4OveOVrYARIteGEMqbTI%3D',
                        small: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.small.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=A4piA3LhVY8rZunteiMfo8Xc9%2BaY9vTbewiz5tx5ozM%3D',
                        original:
                            'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=JdkRgv898WTT0h2wTP57QrqE%2Bjy3i9RXiiXRpUyRNSo%3D',
                    },
                },
            },
        ],
        header_image: {
            id: 1712,
            name: 'mA6MwT0N_header_image.jpeg',
            url: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/40d6466d-52d3-4f04-95d3-27ef91180774mA6MwT0N_header_image.jpeg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=ouiExLYEAu3BSMKVSjEXwniA23bZSRhiuvYDZ4UF6T0%3D',
            height: 934,
            width: 1880,
            natural_ratio: null,
            scale_x: null,
            scale_y: null,
            left: null,
            top: null,
            created_at: '2022-05-09T04:42:16.185966Z',
            variations: {
                full: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/40d6466d-52d3-4f04-95d3-27ef91180774mA6MwT0N_header_image.full.jpeg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=ozmtntOgbNExRwNP6uNjOKXFrBiYGZH5UpcIAgbLWp0%3D',
                large: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/40d6466d-52d3-4f04-95d3-27ef91180774mA6MwT0N_header_image.large.jpeg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=gx7hRC4TDvoCHwKGpcoM2dy4S0uY43RRAp1MlMPYCgg%3D',
                medium: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/40d6466d-52d3-4f04-95d3-27ef91180774mA6MwT0N_header_image.medium.jpeg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=SJYN1VO42qBoRTBdJV/sOWE0aS6PMrS8AHf0y/14%2BhE%3D',
                small: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/40d6466d-52d3-4f04-95d3-27ef91180774mA6MwT0N_header_image.small.jpeg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=MuIEa82Q0iqkyhj7DuHB6qCBUluQb7hu1PB8jn6gAr0%3D',
                original:
                    'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/40d6466d-52d3-4f04-95d3-27ef91180774mA6MwT0N_header_image.jpeg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=ouiExLYEAu3BSMKVSjEXwniA23bZSRhiuvYDZ4UF6T0%3D',
            },
        },
        categories: [],
        created_at: '2019-06-11T06:52:35Z',
        updated_at: '2023-10-16T14:33:17.529344Z',
        publication_status: 'public',
        sdgs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        life_status: 'completed',
        is_followed: {
            is_followed: false,
            follow_id: null,
        },
    },
    {
        id: 'kVLkE9jc',
        title: 'test 25 11',
        slug: 'test-25-11',
        purpose: 'tester',
        language: 'fr',
        organizations: [
            {
                id: 1,
                code: 'CRI',
                is_logo_visible_on_parent_dashboard: true,
                background_color: '#9CF7FD',
                website_url: 'https://cri.projects.k8s.lp-i.dev',
                name: 'Learning Planet Institute',
                logo_image: {
                    id: 208085,
                    name: 'logo LPII.PNG',
                    url: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=JdkRgv898WTT0h2wTP57QrqE%2Bjy3i9RXiiXRpUyRNSo%3D',
                    height: 527,
                    width: 594,
                    natural_ratio: null,
                    scale_x: null,
                    scale_y: null,
                    left: null,
                    top: null,
                    created_at: '2024-02-20T16:35:10.682429Z',
                    variations: {
                        full: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.full.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=wiyuGgk3/dX44N7pHlqmo2JTZYLie62j7jUzgauYe/M%3D',
                        large: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.large.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=yCeLbCq6cPW3jpL3zPOWKtqRCJMvxOZNHyjrYtaeMFw%3D',
                        medium: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.medium.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=9pgnOVZT17QpI2YrGFzl/GJ4OveOVrYARIteGEMqbTI%3D',
                        small: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.small.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=A4piA3LhVY8rZunteiMfo8Xc9%2BaY9vTbewiz5tx5ozM%3D',
                        original:
                            'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/f3cea318-571a-4fc3-a786-5d2589c19dddlogo_LPII.PNG?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=JdkRgv898WTT0h2wTP57QrqE%2Bjy3i9RXiiXRpUyRNSo%3D',
                    },
                },
            },
        ],
        header_image: {
            id: 8742,
            name: 'heartandbrainwant.jpg',
            url: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ef6fdc05-3efb-474f-ae3f-5c4c04efb7dfheartandbrainwant.jpg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=FSHgl6bKaWb%2Bm2De4au2Gt%2B74vBVPQXlD4uLFzIZJiU%3D',
            height: 1440,
            width: 1440,
            natural_ratio: null,
            scale_x: null,
            scale_y: null,
            left: null,
            top: null,
            created_at: '2022-11-25T16:06:44.538969Z',
            variations: {
                full: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ef6fdc05-3efb-474f-ae3f-5c4c04efb7dfheartandbrainwant.full.jpg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=7m6X3j3288zKNRagFh0rJEZE%2BYawmhb5bG58L%2Bn6m78%3D',
                large: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ef6fdc05-3efb-474f-ae3f-5c4c04efb7dfheartandbrainwant.large.jpg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=WiX5NQPj9AXPwrTLh8tXbreUDzBL30vx0cbxIM8mgZk%3D',
                medium: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ef6fdc05-3efb-474f-ae3f-5c4c04efb7dfheartandbrainwant.medium.jpg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=dNUZMYhBXnOWC/EJP3GVI%2BlNPmJmjgX8SGJl%2B%2B%2BMbW8%3D',
                small: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ef6fdc05-3efb-474f-ae3f-5c4c04efb7dfheartandbrainwant.small.jpg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=b5ykQhccrLLwRgL0uXwVsAVaEFl%2BNFYM6FcvK%2BIg%2Bfc%3D',
                original:
                    'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/ef6fdc05-3efb-474f-ae3f-5c4c04efb7dfheartandbrainwant.jpg?se=2024-03-26T11%3A57%3A55Z&sp=r&sv=2022-11-02&sr=b&sig=FSHgl6bKaWb%2Bm2De4au2Gt%2B74vBVPQXlD4uLFzIZJiU%3D',
            },
        },
        categories: [
            {
                id: 4,
                name: 'Student Projects',
                background_color: '#ed7613',
                foreground_color: '',
            },
        ],
        created_at: '2022-11-25T16:06:41.906456Z',
        updated_at: '2023-10-16T14:35:48.979151Z',
        publication_status: 'private',
        sdgs: [2, 1, 4, 7, 8, 6],
        life_status: 'completed',
        is_followed: {
            is_followed: false,
            follow_id: null,
        },
    },
]

export default {
    name: 'FeaturedProjectAdminBlock',

    components: {
        AdminBlock,
        LinkButton,
        PickProjectsDrawer,
        FeaturedProjectAdminListItem,
    },

    data() {
        return {
            featuredProjects: [],
            isLoading: true,
            editFeaturedProjects: false,
            maxProjects: 4,
            asyncing: false,
        }
    },

    computed: {
        blockTitle() {
            let extra = this.isLoading
                ? ''
                : ` (${this.featuredProjects.length} ${this.$t('common.of')} ${this.maxProjects})`
            return this.$t('admin.portal.featured-projects') + extra
        },
    },

    async mounted() {
        await this.loadFeaturedProjects()
    },

    methods: {
        async loadFeaturedProjects() {
            this.isLoading = true
            this.featuredProjects = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(dummyFeaturedProjects)
                }, 1000)
            })
            this.isLoading = false
        },

        async onPickProjects(projects) {
            this.isLoading = true
            try {
                // TODO: save event and remove log
                console.log('save Featured projects', projects)
                await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call her
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('featured-projects.save.success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('featured-projects.save.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.isLoading = false
            }
        },
    },
}
</script>
