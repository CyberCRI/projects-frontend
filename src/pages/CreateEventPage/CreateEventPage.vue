<template>
    <div class="page-section-narrow page-top">
        <h1 class="page-title">{{ $t('event.create.title') }}</h1>
        <EventForm />
    </div>
</template>
<script>
import EventForm from '@/components/lpikit/EventForm/EventForm.vue'
export default {
    name: 'EditEventDrawer',

    components: {
        EventForm,
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-bottom: pxToRem(60px);
}
</style>
