<template>
    <div class="groups-tab">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'GroupsTab',
}
</script>

<style lang="scss" scoped>
.groups-tab {
    padding: $space-xl 0;
}
</style>
