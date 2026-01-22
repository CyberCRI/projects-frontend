<template>
  <FetchLoader :status="[status, statusAnalytics]" :with-data="!!documents" skeleton>
    <ResearcherDocumentsListBase
      :preview="preview"
      :pagination="pagination"
      :doc-type="docType"
      :documents="documents"
      :documents-analytics="documentAnalytics"
      @on-filter="onFilter"
    />
  </FetchLoader>
</template>

<script setup lang="ts">
import {
  getGroupResearchDocument,
  getGroupResearchDocumentAnalytics,
} from '@/api/v2/crisalid.service'
import ResearcherDocumentsListBase from '@/components/people/Researcher/ResearcherDocumentsListBase.vue'
import { DocumentType } from '@/interfaces/researcher'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { toArray } from '@/skeletons/base.skeletons'
import { documentAnalyticsSkeleton, researchDocumentSkeleton } from '@/skeletons/crisalid.skeletons'

const props = withDefaults(
  defineProps<{
    preview?: boolean
    limit?: number
    group: TranslatedPeopleGroupModel
    docType: DocumentType
  }>(),
  { preview: false, limit: null }
)
const orgaCode = useOrganizationCode()

const groupId = computed(() => props.group.id)
const query = ref({})
const onFilter = (filters) => (query.value = { ...filters })

const { data: documentAnalytics, status: statusAnalytics } = getGroupResearchDocumentAnalytics(
  orgaCode,
  groupId,
  props.docType,
  {
    query,
    default: () => documentAnalyticsSkeleton,
  }
)
const {
  pagination,
  data: documents,
  status,
} = getGroupResearchDocument(orgaCode, groupId, props.docType, {
  query,
  paginationConfig: {
    limit: props.limit,
  },
  default: () => toArray(researchDocumentSkeleton, props.limit),
})
</script>

<style lang="scss" scoped>
$profile-documents: 1rem;

.profile-documents-container {
  display: flex;
  flex-direction: column;
  justify-items: start;
  gap: $profile-documents;
}

.documents-list > *:not(:last-child)::after {
  content: '';
  display: inline-block;
  width: 100%;
  height: 1.5px;
  opacity: 0.7;
  background-color: #d4d4d4;
}

.profile-info-container {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto auto;
}

.profile-info-container:not(.preview) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .doc-year-container > h5 {
    text-align: center;
  }
}

@media screen and (width <=pxToRem(1000px)) {
  .profile-info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .doc-year-container > h5 {
      text-align: center;
    }
  }
}

.doc-year-container {
  display: inline-flex;
  justify-content: start;
  align-items: baseline;
  flex-direction: column;
  gap: 1rem;

  & > h5 {
    opacity: 0.7;
    font-size: 0.8rem;
    width: 100%;
  }
}

.doc-year {
  display: flex;
  justify-content: end;
  gap: 2rem;
}

.doc-year-info-minyear {
  align-self: baseline;
}

.doc-year-info-maxyear {
  align-self: flex-end;
}

.doc-year-bar {
  border: none;
  margin: 0 1px;

  --max-bar-height: 60;
  --min-bar-height: 5;

  width: 12.5px;
  display: inline-block;
  background-color: $primary-dark;
  height: calc((var(--max-bar-height) * (var(--bar-count) / 100) + var(--min-bar-height)) * 1px);
  transition: all 0.4s;
  transform-origin: bottom;
  border-radius: 20px;

  & > span {
    display: none;
  }

  &:not(.preview) {
    cursor: pointer;
    transform: translateZ(0);

    &:hover:not(.selected) {
      transform: translateZ(0) scale(120%);
    }

    &.selected:hover {
      transform: translateZ(0) scale(105%);
    }

    &:not(:hover).disabled {
      opacity: 0.5;
    }

    &.selected {
      width: 4rem;
      min-height: 1.5rem;
      display: inline-flex;
      vertical-align: bottom;

      & > span {
        color: white;
        font-weight: bold;
        text-align: center;
        margin: auto;
        display: block;
      }
    }
  }
}

.doc-year-info {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: baseline;
  font-weight: bold;
}

.doc-numbers-container {
  display: inline-flex;
  justify-content: end;
  gap: 2rem;
}

.doc-numbers {
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 12px;
  border: none;
  padding: 0.2rem 0.5rem;
  transition: all 0.2s;

  &:not(.preview) {
    cursor: pointer;

    &:hover,
    &.selected {
      background-color: $primary-dark;
      color: white;

      & :first-child {
        color: white;
      }
    }

    &.disabled {
      opacity: 0.6;
    }
  }

  & :first-child {
    color: $primary-dark;
    font-size: 2rem;
  }

  & :last-child {
    opacity: 0.6;
    text-transform: capitalize;
  }
}

.m-auto {
  margin: auto;
}

.documents-loading,
.documents-empty {
  width: 100%;
  text-align: center;
  opacity: 0.5;
  font-style: italic;
  font-weight: bold;
}

.doc-roles {
  margin: 0;
  border: 0;
  background-color: unset;

  > :not(.preview) {
    cursor: pointer;

    &.disaled {
      opacity: 0.4;
    }
  }
}
</style>
