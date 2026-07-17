<template>
  <div class="link-create">
    <h2 class="title">
      {{ $t('invitation.create.title') }}
    </h2>
    <div class="intro">
      <p>
        {{ $t('invitation.create.intro') }}
      </p>
      <p>
        {{ $t('invitation.create.notice') }}
        <NuxtLink :to="{ name: 'Help' }" class="help-link">
          {{ $t('invitation.create.link') }}
        </NuxtLink>
      </p>
    </div>
    <div class="form">
      <form>
        <div class="form-section">
          <div class="section-header">
            <h3 class="label">
              {{ $t('invitation.create.field.validity.label') }}
            </h3>
          </div>
          <p class="notice">
            {{ $t('invitation.create.field.validity.notice') }}
          </p>
          <div class="">
            <button type="button" class="validity-type-btn" @click="setValidDate">
              <IconImage
                v-if="form.expire_at && validityType == 'pick-date'"
                class="icon"
                name="Circle"
              />
              <IconImage v-else class="icon" name="CircleOutline" />
              <IconImage class="icon" name="Calendar" />
              {{ $t('invitation.create.field.validity.pick-date') }}
            </button>

            <button
              type="button"
              class="validity-type-btn"
              data-test="one-year"
              @click="setValidOneYear"
            >
              <IconImage
                v-if="form.expire_at && validityType == 'one-year'"
                class="icon"
                name="Circle"
              />
              <IconImage v-else class="icon" name="CircleOutline" />
              {{ $t('invitation.create.field.validity.one-year') }}
            </button>
          </div>
          <div>
            <DatePickerModal
              v-if="showDatePicker"
              :model-value="form.expire_at"
              @update:model-value="onDateSelected"
              @close="closeDatePicker"
            />
          </div>

          <div v-if="form.expire_at" class="selected-validity">
            <span>{{ $t('invitation.create.field.validity.valid-until') }}</span>
            <DisplayDate :date="form.expire_at" :time="false" />
          </div>
        </div>
        <div class="form-section">
          <div class="section-header">
            <h3 class="label">
              {{ $t('invitation.create.field.description.label') }}
            </h3>
          </div>
          <p class="notice">
            {{ $t('invitation.create.field.description.notice') }}
          </p>
          <TextInput
            v-model="form.description"
            input-type="textarea"
            :placeholder="$t('invitation.create.field.description.placeholder')"
          />
        </div>
        <div class="form-section">
          <div class="section-header">
            <h3 class="label">
              {{ $t('invitation.create.field.group.label') }}
            </h3>
            <LpiButton
              :label="$t('invitation.create.field.group.add')"
              btn-icon="Plus"
              data-test="add-group"
              @click="addGroup"
            />
          </div>
          <p class="notice">
            {{ $t('invitation.create.field.group.notice') }}
          </p>
          <div v-if="form.people_group_id" class="selected-group">
            <span>
              {{ $t('invitation.create.field.group.selected') }}
            </span>
            <GroupCard v-if="selectedGroup" :key="selectedGroup.id" :group="selectedGroup" />
          </div>
        </div>
        <div class="actions">
          <LpiButton
            :label="$t('common.cancel')"
            class="btn"
            secondary
            data-test="cancel-link"
            @click="cancel"
          />
          <LpiButton
            :disabled="!formNotEmpty || isSaving"
            :label="$t('common.save')"
            class="btn"
            data-test="save-link"
            @click="save"
          />
        </div>
      </form>
    </div>
    <GroupSelectDrawer
      :is-opened="showGroupSelectDrawer"
      :max-selected="1"
      :selected-groups="selectedGroup ? [selectedGroup] : []"
      max-auto-confirm
      @close="showGroupSelectDrawer = false"
      @submit="onGroupSelected"
    />
  </div>
</template>
<script lang="ts">
import { postInvitation } from 'shared-projects-frontend/apis'

import DatePickerModal from '~/components/base/modal/DatePickerModal.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import DisplayDate from '~/components/base/DisplayDate.vue'
import GroupCard from '~/components/group/GroupCard.vue'

import GroupSelectDrawer from '~/components/drawer/Group/GroupSelectDrawer.vue'
import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

export default {
  name: 'LinkCreateTab',
  components: {
    IconImage,
    LpiButton,
    TextInput,
    DatePickerModal,
    GroupSelectDrawer,
    GroupCard,
    DisplayDate,
  },
  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()

    return {
      toaster,
      organizationsStore,
    }
  },

  data() {
    return {
      form: {
        people_group_id: null,
        description: '', // non mandatory but still can't be null for api
        expire_at: null,
      },
      isSaving: false,
      validityType: null,
      showDatePicker: false,
      showGroupSelectDrawer: false,
      selectedGroup: null,
    }
  },

  computed: {
    formNotEmpty() {
      return !!this.form.expire_at && !!this.form.people_group_id
    },
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'linksList' })
    },
    async save() {
      this.isSaving = true
      try {
        await postInvitation(this.organizationsStore.current.code, this.form)
        this.toaster.pushSuccess(this.$t('invitation.create.create-success'))

        this.$router.push({ name: 'linksList' })
      } catch (error) {
        this.toaster.pushError(`${this.$t('invitation.create.create-error')} (${error})`)
        console.error(error)
      } finally {
        this.isSaving = false
      }
    },
    addGroup() {
      this.showGroupSelectDrawer = true
    },

    closeDatePicker() {
      this.showDatePicker = false
    },

    onGroupSelected(groups) {
      this.selectedGroup = groups?.[0]
      this.form.people_group_id = this.selectedGroup?.id
      this.showGroupSelectDrawer = false
    },

    setValidOneYear() {
      this.validityType = 'one-year'
      this.form.expire_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      this.fixDateTime()
    },
    setValidDate() {
      this.validityType = 'pick-date'
      this.showDatePicker = true
    },

    onDateSelected(modelData) {
      this.form.expire_at = modelData
      this.fixDateTime()
    },

    fixDateTime() {
      // make date expire at midnight
      const d = new Date(this.form.expire_at)
      d.setHours(23, 59, 59, 999)
      this.form.expire_at = d.toISOString()
    },
  },
}
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.links-tab {
  padding: 0 variables.$space-l;
}

.title {
  font-style: normal;
  font-weight: 700;
  font-size: variables.$font-size-5xl;
  line-height: variables.$line-height-tight;
  text-align: center;
  margin-bottom: variables.$layout-size-l;
}

.form {
  margin: variables.$space-2xl;

  .form-section {
    padding: variables.$space-2xl 0;

    & + .form-section {
      border-top: variables.$border-width-s solid variables.$light-gray;
    }

    .section-header {
      display: flex;
      padding-bottom: variables.$space-m;
      width: 100%;

      .label {
        flex-grow: 1;
      }
    }

    .notice {
      margin: variables.$space-m 0;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: variables.$space-l;
  }
}

.help-link {
  color: variables.$primary-dark;
}

.validity-type-btn {
  padding: variables.$space-s;
  background-color: variables.$white;
  border: variables.$border-width-s solid variables.$primary-dark;
  border-radius: variables.$border-radius-s;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  gap: variables.$space-m;
  color: variables.$primary-dark;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: variables.$primary-lighter;
  }

  & + .validity-type-btn {
    margin-left: variables.$space-unit;
  }

  .icon {
    width: variables.$layout-size-2xl;
    fill: variables.$primary-dark;
  }
}

.selected-validity {
  margin-top: variables.$space-unit;
  display: flex;
  justify-content: center;
  gap: variables.$space-s;
  font-size: variables.$font-size-xl;

  strong {
    font-weight: 700;
  }
}

.selected-group {
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-top: variables.$space-unit;
  gap: variables.$space-unit;
  width: 100%;
}
</style>
