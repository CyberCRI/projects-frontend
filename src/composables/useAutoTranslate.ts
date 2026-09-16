import {
  getTranslatableField as $getTranslatableField,
  translateEntity,
  translateMany,
  translateProject as $translateProject,
  translateComment as $translateComment,
  translateAnnouncement as $translateAnnouncement,
  translateReview as $translateReview,
  translateLink as $translateLink,
  translateFile as $translateFile,
  translateBlogEntry as $translateBlogEntry,
  translateGoal as $translateGoal,
  translateLocation as $translateLocation,
  translateProjectMessage as $translateProjectMessage,
  translateProjectLocation as $translateProjectLocation,
  translatedProjectLinked as $translatedProjectLinked,
  translateUser as $translateUser,
  translateTag as $translateTag,
  translateGroup as $translateGroup,
  translatePeopleGroupLocation as $translatePeopleGroupLocation,
  translateOrganization as $translateOrganization,
  translateOneNews as $translateOneNews,
  translateOneNewsLocation as $translateOneNewsLocation,
  translateEvent as $translateEvent,
  translateEventsLocation as $translateEventsLocation,
  translateInstruction as $translateInstruction,
  translateNewsFeed as $translateNewsFeed,
  translateCategory as $translateCategory,
  translateTemplate as $translateTemplate,
  translateResearcherDocument as $translateResearcherDocument,
  translateProjectTab as $translateProjectTab,
  translateProjectTabItem as $translateProjectTabItem,
  translateSkill as $translateSkill,
  translateClassification as $translateClassification,
} from 'shared-projects-frontend/translate'
import type {
  GeneralLocationPeopleGroup,
  AttachmentLinkModel,
  AttachmentFileModel,
  SkillModel,
  TagClassificationModel,
  ProjectModel,
  CommentModel,
  AnnouncementModel,
  ReviewModel,
  BlogEntryModel,
  GoalModel,
  LocationModel,
  ProjectMessageModel,
  UserModel,
  TagModel,
  PeopleGroupModel,
  OrganizationModel,
  NewsModel,
  NewsLocation,
  EventModel,
  EventLocation,
  InstructionModel,
  NewsfeedModel,
  ProjectCategoryModel,
  TemplateModel,
  ResearcherDocument,
  ProjectTab,
  ProjectTabItem,
  LinkedProject,
  Language,
} from 'shared-projects-frontend/models'
import type { Agent } from '~~/prisma-chatbot-db/generated/prisma/browser'
import type { TranslatedAgent } from '~/models/agent.model'
import type { RefOrRaw } from '~/interfaces/utils'

const $translateAgent = (data: Agent, locale: Language | null): TranslatedAgent => {
  if (!data) {
    return null
  }
  return translateEntity<TranslatedAgent>(
    unref(data),
    ['description', 'startMessage', 'title'],
    locale
  )
}

export default function useAutoTranslate() {
  // TODO: memoize in local storage / user prefs
  const isAutoTranslateActivated = useState('isAutoTranslateActivated', () => true)

  const { locale } = useNuxtI18n()

  const language = computed(() => {
    if (isAutoTranslateActivated.value) {
      return null
    }
    return locale.value
  })

  const getTranslatableField = (data: RefOrRaw<any>, field) =>
    computed(() => $getTranslatableField(unref(data), field, language.value))

  const translateAgent = (data: RefOrRaw<Agent>) =>
    computed<TranslatedAgent>(() => $translateAgent(unref(data), language.value))
  const translateAgents = (data: RefOrRaw<Agent[]>) =>
    computed<TranslatedAgent[]>(() => translateMany($translateAgent, unref(data), language.value))

  const translateProject = (data: RefOrRaw<ProjectModel>) =>
    computed(() => $translateProject(unref(data), language.value))
  const translateProjects = (data: RefOrRaw<ProjectModel[]>) =>
    computed(() => translateMany($translateProject, unref(data), language.value))
  const translateComment = (data: RefOrRaw<CommentModel>) =>
    computed(() => $translateComment(unref(data), language.value))
  const translateComments = (data: RefOrRaw<CommentModel[]>) =>
    computed(() => translateMany($translateComment, unref(data), language.value))
  const translateAnnouncement = (data: RefOrRaw<AnnouncementModel>) =>
    computed(() => $translateAnnouncement(unref(data), language.value))
  const translateAnnouncements = (data: RefOrRaw<AnnouncementModel[]>) =>
    computed(() => translateMany($translateAnnouncement, unref(data), language.value))
  const translateReview = (data: RefOrRaw<ReviewModel>) =>
    computed(() => $translateReview(unref(data), language.value))
  const translateReviews = (data: RefOrRaw<ReviewModel[]>) =>
    computed(() => translateMany($translateReview, unref(data), language.value))
  const translateLink = (data: RefOrRaw<AttachmentLinkModel>) =>
    computed(() => $translateLink(unref(data), language.value))
  const translateLinks = (data: RefOrRaw<AttachmentLinkModel[]>) =>
    computed(() => translateMany($translateLink, unref(data), language.value))
  const translateFile = (data: RefOrRaw<AttachmentFileModel>) =>
    computed(() => $translateFile(unref(data), language.value))
  const translateFiles = (data: RefOrRaw<AttachmentFileModel[]>) =>
    computed(() => translateMany($translateFile, unref(data), language.value))
  const translateBlogEntry = (data: RefOrRaw<BlogEntryModel>) =>
    computed(() => $translateBlogEntry(unref(data), language.value))
  const translateBlogEntries = (data: RefOrRaw<BlogEntryModel[]>) =>
    computed(() => translateMany($translateBlogEntry, unref(data), language.value))
  const translateGoal = (data: RefOrRaw<GoalModel>) =>
    computed(() => $translateGoal(unref(data), language.value))
  const translateGoals = (data: RefOrRaw<GoalModel[]>) =>
    computed(() => translateMany($translateGoal, unref(data), language.value))
  const translateLocation = (data: RefOrRaw<LocationModel>) =>
    computed(() => $translateLocation(unref(data), language.value))
  const translateLocations = (data: RefOrRaw<LocationModel[]>) =>
    computed(() => translateMany($translateLocation, unref(data), language.value))
  const translateProjectMessage = (data: RefOrRaw<ProjectMessageModel>) =>
    computed(() => $translateProjectMessage(unref(data), language.value))
  const translateProjectMessages = (data: RefOrRaw<ProjectMessageModel[]>) =>
    computed(() => translateMany($translateProjectMessage, unref(data), language.value))
  const translateProjectLocation = (data: RefOrRaw<LocationModel>) =>
    computed(() => $translateProjectLocation(unref(data), language.value))
  const translateProjectLocations = (data: RefOrRaw<LocationModel[]>) =>
    computed(() => translateMany($translateProjectLocation, unref(data), language.value))
  const translatedProjectLinked = (data: RefOrRaw<LinkedProject>) =>
    computed(() => $translatedProjectLinked(unref(data), language.value))
  const translatedProjectLinkeds = (data: RefOrRaw<LinkedProject[]>) =>
    computed(() => translateMany($translatedProjectLinked, unref(data), language.value))
  const translateUser = (data: RefOrRaw<UserModel>) =>
    computed(() => $translateUser(unref(data), language.value))
  const translateUsers = (data: RefOrRaw<UserModel[]>) =>
    computed(() => translateMany($translateUser, unref(data), language.value))
  const translateTag = (data: RefOrRaw<TagModel>) =>
    computed(() => $translateTag(unref(data), language.value))
  const translateTags = (data: RefOrRaw<TagModel[]>) =>
    computed(() => translateMany($translateTag, unref(data), language.value))
  const translateGroup = (data: RefOrRaw<PeopleGroupModel>) =>
    computed(() => $translateGroup(unref(data), language.value))
  const translateGroups = (data: RefOrRaw<PeopleGroupModel[]>) =>
    computed(() => translateMany($translateGroup, unref(data), language.value))
  const translatePeopleGroupLocation = (data: RefOrRaw<GeneralLocationPeopleGroup>) =>
    computed(() => $translatePeopleGroupLocation(unref(data), language.value))
  const translatePeopleGroupLocations = (data: RefOrRaw<GeneralLocationPeopleGroup[]>) =>
    computed(() => translateMany($translatePeopleGroupLocation, unref(data), language.value))
  const translateOrganization = (data: RefOrRaw<OrganizationModel>) =>
    computed(() => $translateOrganization(unref(data), language.value))
  const translateOrganizations = (data: RefOrRaw<OrganizationModel[]>) =>
    computed(() => translateMany($translateOrganization, unref(data), language.value))
  const translateOneNews = (data: RefOrRaw<NewsModel>) =>
    computed(() => $translateOneNews(unref(data), language.value))
  const translateNews = (data: RefOrRaw<NewsModel[]>) =>
    computed(() => translateMany($translateOneNews, unref(data), language.value))
  const translateOneNewsLocation = (data: RefOrRaw<NewsLocation>) =>
    computed(() => $translateOneNewsLocation(unref(data), language.value))
  const translateNewsLocations = (data: RefOrRaw<NewsLocation[]>) =>
    computed(() => translateMany($translateOneNewsLocation, unref(data), language.value))
  const translateEvent = (data: RefOrRaw<EventModel>) =>
    computed(() => $translateEvent(unref(data), language.value))
  const translateEvents = (data: RefOrRaw<EventModel[]>) =>
    computed(() => translateMany($translateEvent, unref(data), language.value))
  const translateEventsLocation = (data: RefOrRaw<EventLocation>) =>
    computed(() => $translateEventsLocation(unref(data), language.value))
  const translateEventsLocations = (data: RefOrRaw<EventLocation[]>) =>
    computed(() => translateMany($translateEventsLocation, unref(data), language.value))
  const translateInstruction = (data: RefOrRaw<InstructionModel>) =>
    computed(() => $translateInstruction(unref(data), language.value))
  const translateInstructions = (data: RefOrRaw<InstructionModel[]>) =>
    computed(() => translateMany($translateInstruction, unref(data), language.value))
  const translateNewsfeed = (data: RefOrRaw<NewsfeedModel[]>) =>
    computed(() => $translateNewsFeed(unref(data), language.value))
  const translateCategory = (data: RefOrRaw<ProjectCategoryModel>) =>
    computed(() => $translateCategory(unref(data), language.value))
  const translateCategories = (data: RefOrRaw<ProjectCategoryModel[]>) =>
    computed(() => translateMany($translateCategory, unref(data), language.value))
  const translateTemplate = (data: RefOrRaw<TemplateModel>) =>
    computed(() => $translateTemplate(unref(data), language.value))
  const translateTemplates = (data: RefOrRaw<TemplateModel[]>) =>
    computed(() => translateMany($translateTemplate, unref(data), language.value))
  const translateResearcherDocument = (data: RefOrRaw<ResearcherDocument>) =>
    computed(() => $translateResearcherDocument(unref(data), language.value))
  const translateResearcherDocuments = (data: RefOrRaw<ResearcherDocument[]>) =>
    computed(() => translateMany($translateResearcherDocument, unref(data), language.value))
  const translateProjectTab = (data: RefOrRaw<ProjectTab>) =>
    computed(() => $translateProjectTab(unref(data), language.value))
  const translateProjectTabs = (data: RefOrRaw<ProjectTab[]>) =>
    computed(() => translateMany($translateProjectTab, unref(data), language.value))
  const translateProjectTabItem = (data: RefOrRaw<ProjectTabItem>) =>
    computed(() => $translateProjectTabItem(unref(data), language.value))
  const translateProjectTabItems = (data: RefOrRaw<ProjectTabItem[]>) =>
    computed(() => translateMany($translateProjectTabItem, unref(data), language.value))
  const translateSkill = (data: RefOrRaw<SkillModel>) =>
    computed(() => $translateSkill(unref(data), language.value))
  const translateSkills = (data: RefOrRaw<SkillModel[]>) =>
    computed(() => translateMany($translateSkill, unref(data), language.value))
  const translateClassification = (data: RefOrRaw<TagClassificationModel>) =>
    computed(() => $translateClassification(unref(data), language.value))
  const translateClassifications = (data: RefOrRaw<TagClassificationModel[]>) =>
    computed(() => translateMany($translateClassification, unref(data), language.value))

  return {
    isAutoTranslateActivated,
    getTranslatableField,

    // project
    translateProject,
    translateProjects,
    translateComment,
    translateComments,
    translateAnnouncement,
    translateAnnouncements,
    translateReview,
    translateReviews,
    translateLink,
    translateLinks,
    translateFile,
    translateFiles,
    translateBlogEntry,
    translateBlogEntries,
    translateGoal,
    translateGoals,
    translateLocation,
    translateLocations,
    translateProjectMessage,
    translateProjectMessages,

    translateProjectLocation,
    translateProjectLocations,

    translatedProjectLinked,
    translatedProjectLinkeds,

    // people
    translateUser,
    translateUsers,
    translateTag,
    translateTags,

    // groups
    translateGroup,
    translateGroups,
    translatePeopleGroupLocation,
    translatePeopleGroupLocations,

    // org
    translateOrganization,
    translateOrganizations,

    // news
    translateOneNews,
    translateNews,
    translateOneNewsLocation,
    translateNewsLocations,

    // evnts
    translateEvent,
    translateEvents,
    translateEventsLocation,
    translateEventsLocations,

    // instructions
    translateInstruction,
    translateInstructions,

    // newsfeed
    translateNewsfeed,

    // categories
    translateCategory,
    translateCategories,

    // templates
    translateTemplate,
    translateTemplates,

    // researcher document (publications, conferences ...ect)
    translateResearcherDocument,
    translateResearcherDocuments,

    // projects tabs
    translateProjectTab,
    translateProjectTabs,
    translateProjectTabItem,
    translateProjectTabItems,
    // agent
    translateAgent,
    translateAgents,

    // skills
    translateSkill,
    translateSkills,

    // classifications
    translateClassification,
    translateClassifications,
  }
}
