<template>
  <form>
    <div class="form-section img-ctn">
      <label>{{ $t('news.form.image.label') }}</label>
      <ImageEditor
        picture-alt="news image"
        :contain="true"
        :image-sizes="model.imageSizes"
        :picture="model.header_image"
        :default-picture="defaultPictures"
        :picture-ratio="4 / 3"
        @update:image-sizes="updateForm({ imageSizes: $event })"
        @update:picture="updateForm({ header_image: $event })"
      />
    </div>

    <div class="form-section">
      <TextInput
        :model-value="model.title"
        :label="$t('news.form.title.label')"
        :placeholder="$t('news.form.title.placeholder')"
        class="input-field"
        @update:model-value="updateForm({ title: $event })"
        @blur="v$.title.$validate"
      />
      <FieldErrors :errors="v$.title.$errors" />
    </div>

    <DateField
      v-model="model.publication_date"
      :label="$t('news.form.publication_date.label')"
      :errors="v$.publication_date.$errors"
    />

    <div class="form-section">
      <!-- locations -->
      <div v-if="!model.location" class="news-location">
        <label>
          {{ $t('location.default-title') }}
        </label>
        <LpiButton
          class="add-btn"
          :btn-icon="model.location ? 'Pen' : 'Plus'"
          data-test="add-location"
          :label="$t(model.location ? 'group.form.edit' : 'group.form.add')"
          @click="openModals('LocationDrawer')"
        />
      </div>
      <LocationList
        :locations="model.location ? [model.location] : []"
        editable
        :focus="false"
        @edit="openModals('LocationForm')"
        @delete="updateLocation(null)"
      />
      <LocationForm
        v-if="stateModals.LocationForm"
        v-model="model.location"
        :location-types="LOCATION_TYPES"
        @close="closeModals('LocationForm')"
        @submit="closeModals('LocationForm')"
        @delete="updateLocation(null)"
      />
      <LocationDrawer
        :is-opened="stateModals.LocationDrawer"
        :locations="model.location ? [model.location] : []"
        editable
        :location-types="LOCATION_TYPES"
        @close="closeModals('LocationDrawer')"
        @submit="updateLocation($event)"
        @delete="updateLocation(null)"
      />
    </div>

    <div class="form-section">
      <label>{{ $t('news.form.content.label') }}</label>
      <TipTapEditor
        ref="tiptapEditor"
        :model-value="model.content"
        :save-image-callback="saveOrganizationImage"
        class="input-field content-editor no-max-height"
        mode="full"
        @update:model-value="updateForm({ content: $event })"
        @blur="v$.content.$validate"
      />

      <FieldErrors :errors="v$.content.$errors" />
    </div>

    <div class="form-section">
      <label>{{ $t('news.form.visibility.label') }}</label>
      <LpiCheckbox v-model="model.visible_by_all" :label="$t('news.form.visibility.notice')" />
    </div>

    <div v-if="selectedGroup" class="form-section">
      <label>{{ $t('news.form.groups.label') }}</label>
      <p class="notice">
        {{ $t('news.form.groups.notice') }}
      </p>

      <MultiGroupPicker
        :model-value="model.people_groups"
        @update:model-value="updateForm({ people_groups: $event })"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import { postOrganizationImage } from '@/api/organizations.service'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import TextInput from '@/components/base/form/TextInput.vue'
import DateField from '@/components/base/form/DateField.vue'
import { usePatatoids } from '@/composables/usePatatoids'
import { helpers, required } from '@vuelidate/validators'
import type { NewsForm } from '@/models/news.model'
import type { LocationType } from '@/models/types'
import useVuelidate from '@vuelidate/core'
import { defaultForm } from '@/form/news'

import { throttle } from 'es-toolkit'

const LOCATION_TYPES: LocationType[] = ['news']
withDefaults(
  defineProps<{
    selectedGroup?: boolean
  }>(),
  { selectedGroup: true }
)

const model = defineModel<NewsForm>({ default: defaultForm() })
const { stateModals, openModals, closeModals } = useModals({
  LocationForm: false,
  LocationDrawer: false,
  DatePicker: false,
})

const emit = defineEmits<{
  invalid: [boolean]
}>()

const organizationsStore = useOrganizationsStore()
const defaultPictures = usePatatoids()
const { t } = useNuxtI18n()

const rules = computed(() => {
  return {
    title: {
      required: helpers.withMessage(t('news.form.title.required'), required),
    },
    content: {
      required: helpers.withMessage(t('news.form.content.required'), required),
    },
    publication_date: {
      required: helpers.withMessage(t('news.form.publication_date.required'), required),
    },
  }
})

const v$ = useVuelidate(rules, model)
defineExpose({
  v$,
})

const updateForm = throttle((data) => {
  // short throttling is mandatory here
  // because ImageEditor is emitting two event on image change (one for the image and one for the image sizes)
  // and without a delay model dont have time to be updated in the second event
  // resulting in lost of the first event data (eg the picture)
  // TODO: find a cleaner way to fix the issue (maybe rewrite ImageEditor to emit only one event with all the data needed)
  model.value = {
    ...model.value,
    ...data,
  }

  // trigger only "field" changed validations validations
  Object.keys(data).forEach((key) => {
    v$.value[key]?.$touch()
  })
}, 16)

const organization = computed(() => organizationsStore.current)

watch(
  () => v$.value.$invalid,
  (isInvalid) => {
    emit('invalid', isInvalid)
  }
)

const saveOrganizationImage = (file) => {
  const formData = new FormData()
  formData.append('file', file, file.name)
  return postOrganizationImage({
    orgCode: organization.value.code,
    body: formData,
  })
}

const updateLocation = (location) => {
  updateForm({ location })
  closeModals('LocationDrawer', 'LocationForm')
}
</script>

<style lang="scss" scoped>
.input-field {
  margin: $space-l;
  margin-bottom: $space-xs;
}

.content-editor {
  flex-grow: 1;
  min-height: pxToRem(300px);
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

.form-section + .form-section {
  margin-top: $space-xl;
}

label {
  font-size: 0.875rem;
  font-weight: bold;
  color: $black;
  display: block;
}

.display-date {
  margin-left: 1rem;
}

label,
.notice {
  margin-bottom: $space-l !important;
}

// TODO fix cleanly
:deep(.input-ctn),
:deep(.input-field) {
  margin: 0;
}

.news-location {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
