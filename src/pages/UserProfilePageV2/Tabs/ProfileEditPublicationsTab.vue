<template>
  <div class="profile-publications">
    <div>
      <h4 class="title">
        {{ title }}
        <span>({{ user.publications.length }})</span>
      </h4>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ProfileEditPublicationsTab',
})
</script>
