<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50"
    height="50"
    fill="none"
    class="loader-simple"
    viewBox="0 0 99 99"
  >
    <path
      fill="#00dba7"
      d="M21.3 81.933a42.8 42.8 0 0 0 17.103 9.088c22.939 6.146 46.517-7.467 52.664-30.406a.5.5 0 0 1 .108-.202c.663-2.544 1.1-5.18 1.287-7.886.114-1.653 1.446-3 3.103-3s3.01 1.346 2.91 3c-1.551 25.665-22.856 46-48.91 46a48.8 48.8 0 0 1-31.103-11.135A49 49 0 0 1 8.085 75.624C1.057 64.474-1.48 50.538 2.2 36.804 8.945 11.637 34.101-3.68 59.292 1.466c1.624.332 2.574 1.987 2.145 3.587s-2.075 2.539-3.701 2.22a43 43 0 0 0-7.951-.797.5.5 0 0 1-.22.05c-23.749 0-43 19.252-43 43 0 12.929 5.705 24.524 14.735 32.407"
    />
  </svg>
</template>

<style scoped lang="scss">
.loader-simple {
  animation: rotation 1s infinite linear;

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(359deg);
    }
  }
}
</style>
