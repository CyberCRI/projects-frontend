<template>
    <div class="wrapper">
        <div v-for="name in names" :key="name" class="cell">
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
            ],
        }
    },
}
</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-flow: row wrap;
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
</style>
