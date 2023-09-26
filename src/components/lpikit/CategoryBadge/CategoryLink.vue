<template>
    <a :href="link" target="_blank" v-if="isOuterOrganization" @click.stop="noop"><slot /></a>
    <router-link v-else :to="link" @click.stop="noop"><slot /></router-link>
</template>

<script>
export default {
    name: 'CategoryLink',

    props: {
        category: {
            type: Object,
            required: true,
        },
        project: {
            type: Object,
            required: true,
        },
    },

    computed: {
        isOuterOrganization() {
            return (
                !this.$store.state.organizations.current ||
                this.category.organization != this.$store.state.organizations.current.code
            )
        },

        link() {
            let url = `/category/${this.category.id}`
            if (this.isOuterOrganization) {
                const org = this.project.organizations.find(
                    (org) => org.code == this.category.organization
                )
                if (org) url = org.website_url + url
            }

            return url
        },
    },
    methods: {
        noop() {},
    },
}
</script>
