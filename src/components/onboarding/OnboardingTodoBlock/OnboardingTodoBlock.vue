<template>
  <div class="onboarding-todo-block" :class="{ collapsed }">
    <transition name="todo-btn">
      <button
        v-if="collapsed"
        class="plateform-tour-button blue-patatoid-bg"
        @click="collapsed = false"
      >
        <span class="btn-label">{{ $t('onboarding-todo.platform-tour') }}</span>
        <span class="arrow-btn">
          <IconImage name="ArrowRight" />
        </span>
      </button>
    </transition>
    <transition name="todo-list">
      <div v-if="!collapsed" class="onboarding-todos blue-patatoid-bg">
        <LpiButton class="close-btn" btn-icon="Close" secondary @click="collapsed = true" />

        <i18n-t keypath="onboarding-todo.welcome" tag="h2" class="welcome-title">
          <span>{{ username }}</span>
        </i18n-t>

        <ul class="todo-list">
          <OnboardingTodo
            :todo-label="$t('onboarding-todo.complete-profile')"
            :todo-done="!complete_profile"
            :asyncing="asyncing.complete_profile"
            :passive="anyAsyncing"
            @click="completeProfile"
          />

          <OnboardingTodo
            :todo-label="$t('onboarding-todo.explore-projects')"
            :todo-done="!explore_projects"
            :asyncing="asyncing.explore_projects"
            :passive="anyAsyncing"
            @click="exploreProjects"
          />

          <OnboardingTodo
            :todo-label="$t('onboarding-todo.create-project')"
            :todo-done="!create_project"
            :asyncing="asyncing.create_project"
            :passive="anyAsyncing"
            @click="createProject"
          />

          <OnboardingTodo
            :todo-label="$t('onboarding-todo.take-tour')"
            :todo-done="!take_tour"
            :asyncing="asyncing.take_tour"
            :passive="anyAsyncing"
            @click="takeTour"
          />
        </ul>

        <div class="extra-actions">
          <LinkButton
            :label="$t('onboarding-todo.dont-show-again')"
            :btn-icon="asyncing.show_progress ? 'LoaderSimple' : ''"
            @click="dontShowAgain"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import OnboardingTodo from '@/components/onboarding/OnboardingTodoBlock/OnboardingTodo.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import { patchUser } from '@/api/people.service.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'OnboardingTodoBlock',

  components: {
    OnboardingTodo,
    LpiButton,
    IconImage,
    LinkButton,
  },

  setup() {
    const usersStore = useUsersStore()
    return {
      usersStore,
    }
  },

  data() {
    return {
      collapsed: false,
      asyncing: {
        complete_profile: false,
        explore_projects: false,
        create_project: false,
        take_tour: false,
        show_progress: false,
      },
    }
  },

  computed: {
    user() {
      return this.usersStore.userFromApi
    },

    username() {
      return this.user?.given_name
    },

    isConnected() {
      return this.usersStore.isConnected
    },
    status() {
      return (this.isConnected && this.user?.onboarding_status) || {}
    },
    complete_profile() {
      return this.status.complete_profile
    },
    explore_projects() {
      return this.status.explore_projects
    },
    create_project() {
      return this.status.create_project
    },
    take_tour() {
      return this.status.take_tour
    },

    anyAsyncing() {
      return Object.values(this.asyncing).some((v) => v)
    },
  },

  methods: {
    async updateStatus(key, val) {
      this.asyncing[key] = true
      const payload = { onboarding_status: { ...this.status, [key]: val } }
      try {
        await patchUser(this.user.id, payload)
        await this.usersStore.getUser(this.user.id)
      } catch (err) {
        console.error(err)
      } finally {
        this.asyncing[key] = false
      }
    },

    async completeProfile() {
      if (this.anyAsyncing) return
      // TODO check with and remove eventually
      // await this.updateStatus('complete_profile', false)
      this.$router.push({ name: 'ProfileEditGeneral' })
    },

    async exploreProjects() {
      if (this.anyAsyncing) return
      // TODO check with and remove eventually
      // await this.updateStatus('explore_projects', false)
      this.$router.push({ name: 'Search' })
    },

    async createProject() {
      if (this.anyAsyncing) return
      // TODO check with and remove eventually
      // await this.updateStatus('create_project', false)
      this.$router.push({ name: 'createProject' })
    },

    async takeTour() {
      if (this.anyAsyncing) return
      // TODO check with and remove eventually
      // await this.updateStatus('take_tour', false)
      this.$router.push({ name: 'HelpVideoTab' })
    },

    async dontShowAgain() {
      this.show_progress = true
      await this.updateStatus('show_progress', false)
    },
  },
}
</script>
<style lang="scss" scoped>
.onboarding-todo-block {
  position: relative;
  margin-top: $navbar-height;
}

.extra-actions {
  position: absolute;
  right: 2rem;
  bottom: 1rem;
}

.plateform-tour-button {
  appearance: none;
  background-color: $white;
  display: flex;
  width: max-content;
  align-items: center;
  height: 2.2rem;
  border-radius: 2rem;
  padding: 0.2rem 1rem;
  position: absolute;
  right: 1rem;
  top: 1rem;
  border: $border-width-s solid $blue;
  cursor: pointer;

  .btn-label {
    font-weight: 700;
    padding-right: 3rem;
  }

  .arrow-btn {
    display: inline-block;
    position: absolute;
    right: 0.2rem;
    top: 50%;
    transform: translateY(-50%);
    height: 2rem;
    width: 2rem;
    background-color: white;
    border-radius: 100%;

    svg {
      height: 1.6rem;
      width: 1.6rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      fill: $primary-dark;
    }
  }

  &:hover {
    svg {
      animation-name: arrowbounce;
      animation-duration: 1s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      transform-origin: left center;
      transition: transform 0.2s ease-in-out;
    }
  }
}

@keyframes arrowbounce {
  0% {
    transform: scale(1, 1) translate(-50%, -50%);
  }

  30% {
    transform: scale(0.7, 1) translate(-70%, -50%);
  }

  50% {
    transform: scale(1, 1) translate(-50%, -50%);
  }

  70% {
    transform: scale(0.7, 1) translate(20%, -50%);
  }

  100% {
    transform: scale(1, 1) translate(-50%, -50%);
  }
}

.onboarding-todos {
  display: flex;
  flex-flow: column nowrap;
  padding: 4rem;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: $white;

  .close-btn {
    position: absolute;
    right: 1rem;
    top: 1rem;
    background-color: $white;
  }
}

.blue-patatoid-bg {
  background-image: url('data:image/svg+xml;utf8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%0A%3Csvg%0A%20%20%20width%3D%221440%22%0A%20%20%20height%3D%22255%22%0A%20%20%20viewBox%3D%220%200%20381%2067.469%22%0A%20%20%20xml%3Aspace%3D%22preserve%22%0A%20%20%20version%3D%221.1%22%0A%20%20%20id%3D%22svg12%22%0A%20%20%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%0A%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%0A%20%20%20%20%20id%3D%22defs12%22%20%2F%3E%3Cg%0A%20%20%20%20%20opacity%3D%22.4%22%0A%20%20%20%20%20fill%3D%22%236cd5ff%22%0A%20%20%20%20%20id%3D%22a%22%3E%3Cpath%0A%20%20%20%20%20%20%20d%3D%22M33.81%2098.206a385.497%20385.497%200%200%201-19.62%2045.424%20308.968%20308.968%200%200%200-22.644%2055.344%20204.125%20204.125%200%200%200-8.3%2055.439h-.288c5.709%209.584%2010.507%2019.79%2016.072%2029.469-.576-36.656%2016.839-69.671%2033.582-101.631%205.037-9.392%2010.363-19.455%2015.16-29.038%2027.49-59.992%2029.457-122.81%205.47-172.5-10.028.719-20.006%201.246-29.985%201.869%2019.19%2042.598%2022.596%2080.5%2010.794%20115.719m98.587-67.177c5.469%208.337%2010.602%2016.243%2015.064%2023.958%2025.858%2045.473-10.794%2087.831-40.203%20121.852a1126.602%201126.602%200%200%200-9.02%2010.494%20487.482%20487.482%200%200%201-9.594%2011.021C60.1%20231.655%2024.838%20272.864%2030.787%20317.186a95.211%2095.211%200%200%200%2028.785%208.769%2063.9%2063.9%200%200%201%204.222-25.683c18.47-31.242%2040.827-56.686%2064.526-83.615%2014.393-16.339%2029.217-33.254%2043.177-51.654%2027.826-36.465%2010.219-74.271-6.86-110.783-5.229-11.213-10.171-21.85-13.913-32.44a53.305%2053.305%200%200%201-2.542-14.806%20185.829%20185.829%200%200%200-42.074-23.671h-.528a274.383%20274.383%200%200%200%2026.674%2047.916%22%0A%20%20%20%20%20%20%20transform%3D%22translate%28-17.693%20-5.24%29%20scale%28.26458%29%22%0A%20%20%20%20%20%20%20id%3D%22path1%22%20%2F%3E%3Cpath%0A%20%20%20%20%20%20%20d%3D%22M137.771%20262.848a262.71%20262.71%200%200%201%2034.734-38.094c14.008-13.465%2028.545-27.408%2038.763-44.419a80.563%2080.563%200%200%200%2010.747-59.848c-1.631-7.667-3.742-15.19-5.805-22.425a170.963%20170.963%200%200%201-8.54-46.862c-18.47-14.376-36.892-28.32-55.89-41.784l-1.056-.767c.175%204.304.95%208.561%202.303%2012.65%203.694%2010.494%208.635%2021.036%2013.817%2032.248%2017.319%2037.088%2035.213%2075.421%206.62%20112.892-14.056%2018.448-28.785%2035.411-43.177%2051.75-23.652%2026.882-45.96%2052.229-64.286%2083.184a62.702%2062.702%200%200%200-3.838%2025.06c7.724%201.006%2015.496%201.486%2023.171%201.725%2010.628.521%2021.279.201%2031.856-.958a107%20107%200%200%201%2020.821-64.352%22%0A%20%20%20%20%20%20%20transform%3D%22translate%28-17.693%20-5.24%29%20scale%28.26458%29%22%0A%20%20%20%20%20%20%20id%3D%22path2%22%20%2F%3E%3Cpath%0A%20%20%20%20%20%20%20d%3D%22M249.265%2093.223a108.039%20108.039%200%200%200-28.353-31.625%20588.77%20588.77%200%200%200-11.13-8.721%20173.762%20173.762%200%200%200%208.395%2044.658c2.063%207.284%204.174%2014.807%205.853%2022.569a82.33%2082.33%200%200%201-10.986%2061.334c-10.362%2017.25-24.995%2031.289-39.099%2044.85a261.105%20261.105%200%200%200-34.542%2037.806%20104.664%20104.664%200%200%200-20.438%2062.867%2092.072%2092.072%200%200%200%2021.445-5.415c24.659-9.583%2042.746-31.242%2056.563-53.81%2017.223-28.032%2035.933-57.5%2049.27-87.305%2012.329-27.552%2017.415-60.758%203.022-87.208zM63.411%20188.672c11.802-15.716%2023.987-32.008%2034.542-49.354a120.813%20120.813%200%200%200%2015.927-74.894C109.707%2033.087%2088.79%204.29%2068.448-20.58L55.16-19.286c23.988%2050.168%2021.877%20113.323-5.757%20173.554-4.797%209.871-9.93%2019.742-14.968%2029.325C17.355%20215.506-.204%20249.047.996%20286.039v1.581c1.343%202.205%202.686%204.361%204.173%206.421v-.479c9.596-40.49%2033.295-71.875%2058.098-104.89%22%0A%20%20%20%20%20%20%20transform%3D%22translate%28-17.693%20-5.24%29%20scale%28.26458%29%22%0A%20%20%20%20%20%20%20id%3D%22path3%22%20%2F%3E%3Cpath%0A%20%20%20%20%20%20%20d%3D%22M145.927%2056.28c-4.461-7.859-9.595-15.717-15.016-23.959a264.353%20264.353%200%200%201-27.441-49.738%2085.545%2085.545%200%200%200-32.48-3.21c20.198%2024.82%2040.731%2053.523%2044.953%2084.908a123.31%20123.31%200%200%201-16.215%2076.236c-10.603%2017.394-22.837%2033.542-34.686%2049.498-24.66%2032.967-47.975%2064.065-57.57%20104.123l-.48%202.3A73.7%2073.7%200%200%200%2021.001%20311.1a59.632%2059.632%200%200%200%207.58%205.032c-4.798-44.611%2030.368-85.675%2058.913-118.834%203.262-3.785%206.429-7.427%209.595-11.021%203.166-3.593%205.949-6.9%209.019-10.493%2028.785-33.542%2065.102-75.278%2040.011-119.505M20.81-17.368%206.416-16.362c8.875%2049.786-8.636%2097.702-25.81%20138.336-11.899%2031.769-13.626%2083.039-4.798%20121.756a110.92%20110.92%200%200%201%204.222%205.99c.431.623.815%201.294%201.247%201.964a211.593%20211.593%200%200%201%208.3-53.091%20314.08%20314.08%200%200%201%2022.836-55.728%20384.533%20384.533%200%200%200%2019.621-45.329c11.706-34.835%208.06-72.498-11.034-115%22%0A%20%20%20%20%20%20%20transform%3D%22translate%28-17.693%20-5.24%29%20scale%28.26458%29%22%0A%20%20%20%20%20%20%20id%3D%22path4%22%20%2F%3E%3Cpath%0A%20%20%20%20%20%20%20d%3D%22m-10.135-14.828-6.572.766c1.055%2038.334-14.92%2078.44-27.874%20110.832-12.953%2032.392-7.58%2068.329-1.679%20103.021%201.343%207.954%202.735%2016.148%203.838%2023.958a193.504%20193.504%200%200%201%2015.208%2016.148c-7.724-38.333-5.709-87.879%205.949-118.929C-4.234%2080.766%2013.229%2033.424%204.593-15.93a2.06%202.06%200%200%200%200-.24c-4.797.383-9.595.815-14.68%201.342%22%0A%20%20%20%20%20%20%20transform%3D%22translate%28-17.693%20-5.24%29%20scale%28.26458%29%22%0A%20%20%20%20%20%20%20id%3D%22path5%22%20%2F%3E%3C%2Fg%3E%3Cuse%0A%20%20%20%20%20xlink%3Ahref%3D%22%23a%22%0A%20%20%20%20%20transform%3D%22translate%2869.27%20-61.52%29%22%0A%20%20%20%20%20id%3D%22use5%22%20%2F%3E%3Cuse%0A%20%20%20%20%20xlink%3Ahref%3D%22%23a%22%0A%20%20%20%20%20transform%3D%22translate%2879.434%2043.165%29%22%0A%20%20%20%20%20id%3D%22use6%22%20%2F%3E%3Cuse%0A%20%20%20%20%20xlink%3Ahref%3D%22%23a%22%0A%20%20%20%20%20transform%3D%22translate%28145.288%20-20.426%29%22%0A%20%20%20%20%20id%3D%22use7%22%20%2F%3E%3Cuse%0A%20%20%20%20%20xlink%3Ahref%3D%22%23a%22%0A%20%20%20%20%20transform%3D%22translate%28208.173%2052.615%29%22%0A%20%20%20%20%20id%3D%22use8%22%20%2F%3E%3Cuse%0A%20%20%20%20%20xlink%3Ahref%3D%22%23a%22%0A%20%20%20%20%20transform%3D%22translate%28236.044%20-36.778%29%22%0A%20%20%20%20%20id%3D%22use9%22%20%2F%3E%3Cuse%0A%20%20%20%20%20xlink%3Ahref%3D%22%23a%22%0A%20%20%20%20%20transform%3D%22translate%28300.129%2041.357%29%22%0A%20%20%20%20%20id%3D%22use10%22%20%2F%3E%3Cuse%0A%20%20%20%20%20xlink%3Ahref%3D%22%23a%22%0A%20%20%20%20%20transform%3D%22translate%28326.722%20-53.07%29%22%0A%20%20%20%20%20id%3D%22use11%22%20%2F%3E%3Cuse%0A%20%20%20%20%20xlink%3Ahref%3D%22%23a%22%0A%20%20%20%20%20transform%3D%22translate%28388.766%2020.92%29%22%0A%20%20%20%20%20id%3D%22use12%22%20%2F%3E%3C%2Fsvg%3E');
}

.welcome-title {
  font-size: $font-size-2xl;
  font-weight: 700;
  line-height: $line-height-tight;
  text-align: center;
}

.todo-list {
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  gap: $space-unit;
  padding: $space-unit;
  background-color: rgb(108 213 255 / 40%);
  border-radius: $border-radius-8;

  @media screen and (max-width: $min-tablet) {
    flex-flow: column nowrap;
  }
}

.action-link {
  color: $primary-dark;
  font-weight: 700;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
}

.todo-btn-enter-active,
.todo-btn-leave-active {
  transition: all 0.5s ease;
}

.todo-btn-enter-from,
.todo-btn-leave-to {
  opacity: 0;
  transform: translateX(200%);
}

.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.5s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateY(-200%);
}
</style>
