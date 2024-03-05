<template>
    <DrawerLayout
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="false"
        :is-opened="isOpened"
        :title="form.id ? $t('event.drawer.edit') : $t('event.drawer.create')"
        class="small"
        @close="closeDrawer"
        @confirm="saveEvent"
    >
        <EventForm v-model="form" v-if="form" />
    </DrawerLayout>
</template>
<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import EventForm from '@/components/lpikit/EventForm/EventForm.vue'

function defaultForm() {
    return {
        name: '',
        information: '',
        date: '',
        groups: {},
    }
}

export default {
    name: 'EditEventDrawer',

    components: {
        EventForm,
        DrawerLayout,
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },

        event: {
            type: [Object, null],
            default: null,
        },
    },

    data() {
        return {
            form: defaultForm(),
        }
    },

    watch: {
        event: {
            handler(event) {
                if (event) {
                    this.form = {
                        ...event,
                        groups: event.groups.reduce((acc, group) => {
                            acc[group.id] = true
                            return acc
                        }, {}),
                    }
                } else {
                    this.form = defaultForm()
                }
            },
            immediate: true,
        },
    },

    methods: {
        saveEvent() {
            console.log('saveEvent', this.form)
            this.closeDrawer()
        },
        closeDrawer() {
            console.log('closeDrawer')
            this.$emit('close')
        },
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-bottom: pxToRem(60px);
}
</style>
