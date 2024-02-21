<template>
    <div class="search-bar">
        <input type="search" v-model="search" placeholder="Search a name to filter list" />
    </div>
    <p class="notice">Click on an icon to copy its name</p>
    <div class="wrapper">
        <div v-for="name in displayableName" :key="name" class="cell" @click="copy(name)">
            <div class="icon">
                <IconImage :name="name"></IconImage>
            </div>
            <div>
                <strong class="name">{{ name }}</strong>
            </div>
        </div>
    </div>
</template>
<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'IconList',

    components: { IconImage },

    data() {
        return {
            search: '',
            names: [
                'Account',
                'Alert',
                'AlertOutline',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUpRightFromSquare',
                'Article',
                'Ban',
                'BarsStaggered',
                'Bell',
                'Briefcase',
                'Bug',
                'Calendar',
                'Cancel',
                'ChatBubble',
                'ChartBox',
                'Check',
                'ChevronDown',
                'ChevronLeft',
                'ChevronRight',
                'ChevronUp',
                'Circle',
                'CircleOutline',
                'Close',
                'CloseCircle',
                'Cog',
                'Copy',
                'DotsHorizontal',
                'Earth',
                'Email',
                'EmailOutline',
                'ExclamationMark',
                'Expand',
                'Eye',
                'EyeSlash',
                'Facebook',
                'File',
                'FileTreeOutline',
                'Flag',
                'Globe',
                'Heart',
                'HeartOutline',
                'HelpCircle',
                'HelpCircleOutline',
                'Home',
                'Lifebuoy',
                'Linkedin',
                'LinkRotated',
                'ListCheck',
                'Lock',
                'Logout',
                'Map',
                'MapMarker',
                'MenuDown',
                'MenuUp',
                'Minus',
                'MultiplePerson',
                'Paperclip',
                'Pen',
                'PeopleGroup',
                'Phone',
                'Plus',
                'Poll',
                'QuestionMark',
                'Reply',
                'RotateRight',
                'Search',
                'Share',
                'Skype',
                'Spinner',
                'TrashCanOutline',
                'Twitter',
                'Tune',
                'Upload',
                'Users',
                'CheckBoxOutline',
                'CheckBoxBlankOutline',
                'CropFree',
            ],
        }
    },

    computed: {
        displayableName() {
            return this.names.filter((name) => {
                return name.toLowerCase().includes(this.search.toLowerCase())
            })
        },
    },

    methods: {
        async copy(name) {
            await navigator.clipboard.writeText(name)
            this.$store.dispatch('notifications/pushToast', {
                message: `"${name}" copied to clipboard`,
                type: 'success',
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
}

.cell {
    border: 1px solid #aaa;
    padding: 1rem;
    text-align: center;
    flex-basis: 10rem;
    flex-shrink: 0;
}

.name {
    font-size: 0.75rem;
}

.notice {
    font-style: italic;
    text-align: center;
    padding: 1rem;
}

.search-bar {
    padding: 1rem;
    display: flex;
    justify-content: stretch;
    align-items: center;

    input {
        flex-grow: 1;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid #aaa;
    }
}
</style>
