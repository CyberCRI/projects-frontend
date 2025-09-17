export default function useAutoTranslate() {
  // TODO: memoize in local storage / user prefs
  const isAutoTranslateActivated = useState('isAutoTranslateActivated', () => true)

  const { locale } = useI18n()

  // base functions
  const getDetectedLanguage = (entity, field) => {
    return entity[`${field}_detected_language`]
  }

  const getTranslatableField = (entity: any, field: string, defaultValue: any = '') =>
    computed(() => {
      const _entity = unref(entity)
      const _field = unref(field)
      const _defaultValue = unref(defaultValue)
      if (!_entity || !_field) return _defaultValue
      if (!isAutoTranslateActivated.value) return _entity[_field] || _defaultValue
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
        else if (!isAutoTranslateActivated.value) res[_field] = _entity[_field] || _defaultValue
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
    computed(() => entities?.map((entity) => unref(translateFn(entity)) || []))

  // --------------------
  // Projects
  const translateProject = (project) =>
    translateEntity(project, ['title', 'description', 'purpose'])
  const translateProjects = (projects) => translateEntities(projects, translateProject)

  const translateComment = (comment) => translateEntity(comment, ['content'])
  const translateComments = (comments) => translateEntities(comments, translateComment)

  const translateAnnouncement = (announcement) =>
    translateEntity(announcement, ['title', 'description'])
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

  // -------
  // full

  const translateUserFull = (user) =>
    computed(() => {
      const res = unref(translateUser(user))
      if (res) {
        res.people_groups = unref(translateGroups(res.people_groups))
        res.skills = unref(translateTags(res.skills))
      }
      return res
    })

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
  }
}
