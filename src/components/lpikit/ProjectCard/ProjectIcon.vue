<template>
    <div class="main-icon" :style="projectIconColor">
        <IconImage :name="projectIcon" :style="projectIconColor" />
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'ProjectIcon',

    components: {
        IconImage,
    },

    props: {
        project: {
            type: Object,
            required: true,
        },

        privacyIconVisible: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        projectIcon() {
            if (this.privacyIconVisible) {
                if (this.project.publication_status === 'public') return 'Eye'
                else if (this.project.publication_status === 'private') return 'EyeSlash'
                return 'Users'
            }
            if (this.project.life_status === 'running') return 'Spinner'
            return 'Check'
        },

        projectIconColor() {
            if (this.privacyIconVisible) {
                if (this.project.publication_status === 'public')
                    return { 'background-color': '#00B288', fill: '#fff' }
                else if (this.project.publication_status === 'private')
                    return { 'background-color': '#F0FFFB', fill: '#1D727C' }
                return { 'background-color': '#C2FFF0', fill: '#1D727C' }
            }
            if (this.project.life_status === 'running')
                return { 'background-color': '#f0fffb', fill: '#1d727c' }
            return { 'background-color': '#00dba7', fill: '#fff' }
        },
    },
}
</script>

<style lang="scss" scoped>
.main-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: $border-width-l solid $primary-dark;
    padding: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
}
</style>
