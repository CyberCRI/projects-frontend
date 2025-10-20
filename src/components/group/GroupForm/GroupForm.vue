<template>
  <div v-if="loading" class="loader-ctn">
    <LoaderSimple />
  </div>
  <form v-else class="group-form">
    <!--  Group Name -->
    <div>
      <TextInput
        v-model="form.name"
        :placeholder="namePlaceholder"
        space-below-label="large-space"
        data-test="group-name-input"
        @blur="validation.form.name.$validate"
      >
        <label>
          {{ isAddMode ? `${$t('group.form.name-label')} *` : `${$t('group.form.edit-name')} *` }}
        </label>
      </TextInput>
      <FieldErrors :errors="validation.form.name.$errors" />
    </div>

    <!-- Email -->
    <div class="input">
      <TextInput
        v-model="form.email"
        :placeholder="emailPlaceholder"
        space-below-label="large-space"
        data-test="group-email-input"
        @blur="validation.form.email.$validate"
      >
        <label>{{ $t('group.form.email-label') }}</label>
      </TextInput>
      <FieldErrors :errors="validation.form.email.$errors" />
    </div>

    <!-- Short Description-->
    <div class="input">
      <TextInput
        v-model="form.short_description"
        :placeholder="shortDescriptionPlaceholder"
        space-below-label="large-space"
        data-test="group-short-desciption"
        @blur="validation.form.short_description.$validate"
      >
        <label>{{ $t('group.form.short-description-label') }}</label>
      </TextInput>
      <FieldErrors :errors="validation.form.short_description.$errors" />
    </div>

    <!-- Image -->
    <div class="img-ctn">
      <label>{{ capitalize($t('group.image-header')) }}</label>
      <ImageEditor
        v-model:image-sizes="form.imageSizes"
        v-model:picture="form.header_image"
        :picture-alt="`${form.name} image`"
        :contain="true"
        :round-picture="true"
        :default-picture="defaultPictures"
      />
    </div>

    <div class="spacer" />

    <!-- Description -->
    <div class="description">
      <label>
        {{ capitalize($t('group.form.description-label')) }}

        <LpiButton
          v-if="!form.description || isAddMode"
          class="add-btn"
          :btn-icon="form.description ? 'Pen' : 'Plus'"
          data-test="add-description"
          :label="capitalize($t(form.description ? 'group.form.edit' : 'group.form.add'))"
          @click="descriptionIsOpened = true"
        />
      </label>
      <div v-if="form.description">
        <TipTapOutput class="description-content" :content="form.description" />
        <!-- TODO htmllimiter-->
      </div>
    </div>

    <div class="spacer" />

    <template v-if="!isReducedMode">
      <!-- Team -->
      <div class="team">
        <GroupTeamSection v-model="form.members" />
      </div>

      <div class="spacer" />

      <!-- Featured projects -->
      <div class="project">
        <ProjectSection v-model="form.featuredProjects" />
      </div>

      <div class="spacer" />
    </template>
    <!-- Parent group -->
    <div class="parent-group">
      <ParentGroupSection v-model="form.parentGroup" :groups="groups" />
    </div>

    <div class="spacer" />

    <!-- Visibility -->
    <div class="visibility">
      <label>{{ capitalize($t('group.form.visibility.title')) }}</label>
      <div class="visibility-options">
        <template v-for="visibility in visibilities" :key="visibility.id">
          <label
            class="checkbox-item"
            :data-test="`${visibility.name}`"
            :class="{ selected: form.publication_status == visibility.id }"
          >
            <span class="label form-control">
              <input
                v-model="form.publication_status"
                :value="visibility.id"
                type="radio"
                name="visibility"
                :data-test="`visibility-${visibility.name.toLowerCase()}`"
              />
              {{ visibility.name }}
            </span>
          </label>
          <span class="checkbox-description">{{ visibility.description }}</span>
        </template>
      </div>
      <FieldErrors :errors="validation.form.publication_status.$errors" />
    </div>

    <div v-if="$route.params.groupId" class="delete-group">
      <label>
        <span class="section-title">{{ $t('group.form.delete') }}</span>
        <LpiButton
          :label="$t('group.form.delete')"
          btn-icon="TrashCanOutline"
          secondary
          data-test="delete-group-button"
          @click="openRemoveOrQuit"
        />
      </label>
    </div>
  </form>
  <GroupDescriptionDrawer
    :original-description="form.description"
    :is-add-mode="isAddMode"
    :is-opened="descriptionIsOpened"
    @close="closeDescription"
    @update-description="updateDescription"
  />

  <ConfirmModal
    v-if="showRemoveQuit"
    :content="$t('common.remove-group')"
    :title="$t('project.remove-group')"
    :cancel-button-label="'common.cancel'"
    :confirm-button-label="'project.remove-group'"
    @cancel="toggleShowRemoveGroupVisible"
    @confirm="removeGroup"
  />
</template>

<script>
import { capitalize } from 'es-toolkit'

import { deleteGroup, getHierarchyGroups } from '@/api/groups.service.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { useRuntimeConfig } from '#imports'
export default {
  name: 'GroupForm',

  props: {
    isAddMode: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: Object,
      required: true,
    },

    validation: {
      type: Object,
      default: () => {},
    },
    isReducedMode: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue', 'close'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    const runtimeConfig = useRuntimeConfig()
    return {
      organizationsStore,
      runtimeConfig,
      capitalize,
    }
  },

  data() {
    const defaultPictures = [1, 2, 3, 4, 5, 6].map((index) => {
      return `${
        this.runtimeConfig.public.appPublicBinariesPrefix
      }/patatoids-project/Patatoid-${index}.png`
    })
    return {
      loading: false,
      currentPatatoidIndex: 1,
      visibilities: [
        {
          id: 'public',
          name: this.$t('group.form.visibility.public'),
          description: this.$t('group.form.visibility.public_description'),
        },
        {
          id: 'org',
          name: this.$t('group.form.visibility.members'),
          description: this.$t('group.form.visibility.members_description'),
        },
        {
          id: 'private',
          name: this.$t('group.form.visibility.private'),
          description: this.$t('group.form.visibility.private_description'),
        },
      ],
      form: {
        name: '',
        description: '',
        short_description: '',
        email: '',
        type: '', // TODO ??? "club" | "group"?
        parentGroup: null, // group object
        organization: '',
        members: [],
        featuredProjects: [],
        header_image: null,
        imageSizes: null,
        publication_status: 'public',
      },
      formIsSetup: false,

      descriptionIsOpened: false,
      showRemoveQuit: false,
      groups: [],
      defaultPictures,
    }
  },

  computed: {
    namePlaceholder() {
      return this.$t('group.form.name-placeholder')
    },

    emailPlaceholder() {
      return this.$t('group.form.email-placeholder')
    },

    shortDescriptionPlaceholder() {
      return this.$t('group.form.short-description-placeholder')
    },
  },

  watch: {
    form: {
      deep: true,
      handler: function () {
        if (this.formIsSetup) {
          // console.log('from handler')
          this.$emit('update:modelValue', this.form)
        }
      },
    },
  },

  async mounted() {
    // lopad groups tree
    await this.loadGroups()
    this.form = {
      ...this.form,
      ...this.modelValue,
    }
    this.formIsSetup = true
  },

  methods: {
    async loadGroups() {
      this.loading = true
      // use group's org code if availabe
      // to allow edition of groups on the meta portal (PROJ-1032)
      const orgCode = this.modelValue.organization
        ? this.modelValue.organization
        : this.organizationsStore.current.code
      this.groups = (await getHierarchyGroups(orgCode)).children

      this.loading = false
    },

    openRemoveOrQuit() {
      this.showRemoveQuit = true
    },

    updateDescription(description) {
      this.form.description = description
    },
    closeDescription() {
      this.descriptionIsOpened = false
    },
    toggleShowRemoveGroupVisible() {
      this.showRemoveQuit = !this.showRemoveQuit
    },
    async removeGroup() {
      this.loading = true
      let organization = this.organizationsStore.current.code
      await deleteGroup(organization, this.$route.params.groupId)
      this.loading = false
      this.$router.push({
        name: 'HomeRoot',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.loader-ctn {
  padding: $space-xl 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group-form {
  margin-top: 2rem;

  .input {
    margin: $space-xl 0;
  }

  .category-ctn {
    margin-bottom: $space-xl;
  }

  .category-select {
    width: 100%;

    select {
      width: 100%;
    }
  }

  .team,
  .parent-group,
  .project {
    margin-bottom: $space-xl;
  }

  .description {
    margin-bottom: $space-xl;
  }

  .completed-form-snackbar {
    width: fit-content;
    margin: $space-xl auto;
    border: $border-width-s solid $salmon;
  }

  .visibility {
    margin-bottom: $space-xl;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &-options {
      display: grid;
      grid-template-columns: min-content max-content;
      align-items: center;

      @media screen and (max-width: $med-mobile) {
        display: flex;
        flex-flow: column;
        align-items: stretch;
      }
    }

    .checkbox-description {
      width: 70%;

      @media screen and (max-width: $med-mobile) {
        width: 100%;
        padding: $space-2xs 0 $space-s 0;
      }
    }

    .checkbox-item {
      border: 1px solid $primary-dark;
      padding: $space-m;
      margin: $space-s pxToRem(16px) $space-s 0;
      border-radius: $border-radius-xs;
      display: flex;
      align-items: center;
      text-align: right;

      &:hover {
        background-color: $primary-lighter;
      }

      > .label {
        font-weight: 700;
        font-size: $font-size-m;
        line-height: $line-height-compact;
        color: $primary-dark;
        margin: 0;
        cursor: pointer;
      }

      &.selected {
        background-color: $primary-dark;
        color: $white;

        > .label {
          color: $white;
        }
      }
    }

    .form-control {
      font-size: $font-size-m;
      color: $primary-dark;
      font-weight: 400;
      display: grid;
      grid-template-columns: 1em auto;
      gap: $space-m;
    }

    .form-control + .form-control {
      margin-top: 1em;
    }

    input[type='radio'] {
      appearance: none;
      background-color: $white;
      margin: 0;
      font: inherit;
      width: pxToRem(20px);
      height: pxToRem(20px);
      border: $border-width-s solid $primary-dark;
      border-radius: 50%;
      transform: translateY(-0.075em);
      display: grid;
      place-content: center;
      cursor: pointer;
    }

    input[type='radio']::before {
      content: '';
      width: pxToRem(12px);
      height: pxToRem(12px);
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1em 1em $primary-dark;
      border-radius: 50%;
    }

    input[type='radio']:checked::before {
      transform: scale(1);
    }

    input[type='radio']:disabled {
      border: $border-width-s solid $mid-gray;
      color: $mid-gray;
      cursor: not-allowed;
    }

    .form-control--disabled {
      color: $mid-gray;
      cursor: not-allowed;
    }
  }

  .delete-group {
    label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      width: 100%;
      font-size: $font-size-m;
      margin-bottom: $space-l;

      .section-title {
        color: $black;
        font-weight: bold;
        display: block;
      }
    }

    .img-ctn {
      margin-bottom: $space-xl;
      display: flex;
      flex-direction: column;
      align-items: center;

      label {
        align-self: flex-start;
      }
    }
  }

  .description label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    margin-bottom: $space-l;

    .section-title {
      font-size: $font-size-s;
      color: $black;
      font-weight: bold;
      display: block;
    }
  }

  label {
    margin-bottom: $space-l;
    font-size: $font-size-m;
    color: $black;
    font-weight: bold;
    display: block;
  }

  .spacer {
    border-top: 1px solid $lighter-gray;
    margin-bottom: 34px;
  }
}
</style>
