export default function useAutoTranslate() {
  // TODO: memoize in local storage / user prefs
  const isAutoTranslateActivated = useState('isAutoTranslateActivated', () => true)

  // const { locale } = useI18n()
  // but we use auto translate in organization pinia store so
  // https://stackoverflow.com/questions/77594888/how-to-use-i18n-messages-in-a-nuxt3-pinia-store
  const locale = (useNuxtApp().$i18n as any).locale

  // base functions
  const getDetectedLanguage = (entity, field) => {
    return entity[`${field}_detected_language`]
  }

  const useOriginalValue = (entity, field) => {
    const _entity = unref(entity)
    const _field = unref(field)
    let res = !isAutoTranslateActivated.value
    if (!res && _entity && _field) res = _entity[`${_field}_detected_language`] === locale.value
    return res
  }

  const getTranslatableField = (entity: any, field: string, defaultValue: any = '') =>
    computed(() => {
      const _entity = unref(entity)
      const _field = unref(field)
      const _defaultValue = unref(defaultValue)
      if (!_entity || !_field) return _defaultValue
      if (useOriginalValue(_entity, _field)) return _entity[_field] || _defaultValue
      return _entity[`${_field}_${locale.value}`] || _entity[_field] || _defaultValue
    })

  const getTranslatableFields = (entity: any, fields: string[], defaultValue: any = '') =>
    computed(() => {
      const _entity = unref(entity)
      const _defaultValue = unref(defaultValue)
      const res = {}
      for (const field of fields) {
        const _field = unref(field)
        if (!_entity || !_field) continue
        else if (useOriginalValue(_entity, _field)) res[_field] = _entity[_field] || _defaultValue
        else res[_field] = _entity[`${_field}_${locale.value}`] || _entity[_field] || _defaultValue
      }
      return res
    })

  const translateEntity = (entity, fields) =>
    computed(() => ({
      ...unref(entity || {}),
      $t: unref(getTranslatableFields(entity, fields)),
    }))

  const translateEntities = (entities, translateFn) =>
    computed(() => {
      const _entities = unref(entities)
      return _entities?.map((entity) => unref(translateFn(entity)) || [])
    })

  // --------------------
  // Projects
  const translateProject = (project) =>
    translateEntity(project, ['title', 'description', 'purpose'])
  const translateProjects = (projects) => translateEntities(projects, translateProject)

  const translateComment = (comment) => {
    const _comment = unref(comment)
    if (_comment) _comment.replies = translateEntities(_comment.replies, translateComment)
    return translateEntity(_comment, ['content'])
  }
  const translateComments = (comments) => translateEntities(comments, translateComment)

  const translateAnnouncement = (announcement) =>
    computed(() => {
      if (!announcement) return announcement
      return {
        ...unref(translateEntity(announcement, ['title', 'description'])),
        project: unref(translateProject(announcement.project)),
      }
    })
  const translateAnnouncements = (announcements) =>
    translateEntities(announcements, translateAnnouncement)

  const translateReview = (review) => translateEntity(review, ['title', 'description'])
  const translateReviews = (reviews) => translateEntities(reviews, translateReview)

  const translateLink = (link) => translateEntity(link, ['title', 'description'])
  const translateLinks = (links) => translateEntities(links, translateLink)

  const translateFile = (file) => translateEntity(file, ['title', 'description'])
  const translateFiles = (files) => translateEntities(files, translateFile)

  const translateBlogEntry = (blogEntry) => translateEntity(blogEntry, ['title', 'content'])
  const translateBlogEntries = (blogEntries) => translateEntities(blogEntries, translateBlogEntry)

  const translateGoal = (goal) => translateEntity(goal, ['title', 'description'])
  const translateGoals = (goals) => translateEntities(goals, translateGoal)

  const translateLocation = (location) => translateEntity(location, ['title', 'description'])
  const translateLocations = (locations) => translateEntities(locations, translateLocation)

  const translateProjectMessage = (message) => translateEntity(message, ['content'])
  const translateProjectMessages = (messages) =>
    translateEntities(messages, translateProjectMessage)

  // --------------------
  // People
  const translateUser = (user) => translateEntity(user, ['description', 'short_description', 'job'])
  const translateUsers = (users) => translateEntities(users, translateUser)

  const translateTeam = (team) =>
    computed(() => {
      const _team = unref(team)
      return {
        owners: unref(translateUsers(_team.owners)),
        members: unref(translateUsers(_team.members)),
        reviewers: unref(translateUsers(_team.reviewers)),
      }
    })

  const translateTag = (tag) => translateEntity(tag, ['description', 'title'])
  const translateTags = (tags) => translateEntities(tags, translateTag)

  // -----------------
  // groups
  const translateGroup = (group) =>
    translateEntity(group, ['name', 'description', 'short_description'])
  const translateGroups = (groups) => translateEntities(groups, translateGroup)

  // orgs
  const translateOrganization = (org) =>
    translateEntity(org, [
      'name',
      'dashboard_title',
      'dashboard_subtitle',
      'description',
      'chat_button_text',
    ])
  const translateOrganizations = (orgs) => translateEntities(orgs, translateOrganization)

  // -------
  // use full

  const translateUserFull = (user) =>
    computed(() => {
      const res = unref(translateUser(user))
      if (res) {
        res.people_groups = unref(translateGroups(res.people_groups))
        res.skills = unref(translateTags(res.skills))
      }
      return res
    })

  // -----------
  // news
  const translateOneNews = (news) => translateEntity(news, ['title', 'content'])
  const translateNews = (news) => translateEntities(news, translateOneNews)

  // -----------
  // instructions
  const translateInstruction = (instruction) => translateEntity(instruction, ['title', 'content'])
  const translateInstructions = (instructions) =>
    translateEntities(instructions, translateInstruction)

  // -----------
  // events
  const translateEvent = (event) => translateEntity(event, ['title', 'content'])
  const translateEvents = (events) => translateEntities(events, translateEvent)

  // -----------
  // Newsfeed
  const translateNewsfeed = (items) =>
    computed(() => {
      const _items = unref(items)
      return _items?.map((item) => ({
        ...item,
        project: unref(translateProject(item.project)),
        news: unref(translateOneNews(item.news)),
        announcement: unref(translateAnnouncement(item.announcement)),
      }))
    })

  // -----------
  // categoris
  const translateCategory = (category) => {
    const rawCategory = unref(category)
    if (rawCategory.children)
      rawCategory.children = unref(translateEntities(rawCategory.children, translateCategory))
    if (rawCategory.hierarchy)
      rawCategory.hierarchy = unref(translateEntities(rawCategory.hierarchy, translateCategory))
    return translateEntity(rawCategory, ['name', 'description'])
  }
  const translateCategories = (categories) => translateEntities(categories, translateCategory)

  return {
    isAutoTranslateActivated,
    getTranslatableField,
    getDetectedLanguage,

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

    // people
    translateUser,
    translateUsers,
    translateTeam,
    translateUserFull,
    translateTag,
    translateTags,

    // groups
    translateGroup,
    translateGroups,

    // org
    translateOrganization,
    translateOrganizations,

    // news
    translateOneNews,
    translateNews,

    // evnts
    translateEvent,
    translateEvents,

    // instructions
    translateInstruction,
    translateInstructions,

    // newsfeed
    translateNewsfeed,

    // categories
    translateCategory,
    translateCategories,
  }
}
