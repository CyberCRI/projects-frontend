<template>
  <div class="search-input-container">
    <SearchOptions v-bind="$attrs" />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.search-input-container {
  display: flex;
  padding: variables.$space-l;
  background: variables.$primary-lighter;
  align-items: center;
  border-radius: variables.$border-radius-17;
  flex-direction: column;
  margin: variables.$space-xl 0;

  .search-input {
    margin-bottom: variables.pxtorem(16px);
  }

  @media screen and (min-width: variables.$min-tablet) {
    padding: variables.pxtorem(32px) variables.pxtorem(84px);
    border-radius: 17px;
    flex-direction: row;

    .search-input {
      margin-right: variables.$space-l;
      margin-bottom: 0;
    }
  }
}

:deep(.search-block) {
  flex-grow: 1;
}

:deep(.search-input-ctn--full) {
  max-width: 52rem;
  width: 100%;
}
</style>
