import projectsStore from '@/store/modules/projects'
import {
    addLinkedProject,
    createProject,
    deleteLinkedProject,
    deleteProject,
    duplicateProject,
    getAllProjects,
    getAllRandomProjects,
    getAllRecommendedProjects,
    getProject,
    patchProject,
    lockUnlockProject,
    patchLinkedProject,
} from '@/api/projects.service'

import analytics from '@/analytics'

import { ProjectFactory, ProjectOutputFactory } from '../../../factories/project.factory'
import { BlogEntryFactory } from '../../../factories/blog-entry.factory'
import { GoalFactory } from '../../../factories/goal.factory'
import { AttachmentFileFactory } from '../../../factories/attachment-file.factory'
import { AttachmentLinkFactory } from '../../../factories/attachment-link.factory'
import { AnnouncementFactory } from '../../../factories/announcement.factory'
import { FollowFactory } from '../../../factories/follow.factory'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'
import { ReviewFactory } from '../../../factories/review.factory'
import TagFactory from '../../../factories/wikipedia-tag.factory'
import LocationFactory from '../../../factories/location.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/projects.service')
vi.mock('@/analytics')

vi.mock('vuex')
const rootState = {
    projects: {
        project: {
            ...ProjectFactory.generate(),
            linked_projects: [{ id: 1, project: ProjectFactory.generate(), reason: 'Inspiré de' }],
        },
    },

    organizations: { current: OrganizationOutputFactory.generate() },
}

const getters = {
    'users/id': () => 123,
}

describe('Store module | projects | getters', () => {
    const project = ProjectOutputFactory.generate()
    const state = {
        project: project,
        currentProjectId: project.id,
        currentProjectSlug: project.slug,
        projectMembers: [
            ...project.team.owners,
            ...project.team.reviewers,
            ...project.team.members,
        ],
    }

    it('project', () => {
        const result = projectsStore.getters.project(state)

        expect(result).toBe(state.project)
    })
    it('currentProjectId', () => {
        const result = projectsStore.getters.currentProjectId(state)

        expect(result).toBe(state.currentProjectId)
    })
    it('currentProjectSlug', () => {
        const result = projectsStore.getters.currentProjectSlug(state)

        expect(result).toBe(state.currentProjectSlug)
    })
    it.skip('projectMembers', () => {
        const result = projectsStore.getters.projectMembers(state)

        expect(result).toStrictEqual(state.projectMembers)
    })
})

describe('Store module | projects | actions', () => {
    const commit = vi.fn()
    const dispatch = vi.fn()

    it('addProject', async () => {
        const project = ProjectOutputFactory.generate()
        const formData = new FormData()
        for (const key in project) {
            formData.append(key, project[key])
        }
        const createProjectMock = createProject as Mock
        const createMock = analytics.project.create as Mock

        createProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.addProject({ dispatch, getters }, formData)

        expect(createProjectMock).toHaveBeenCalledWith(formData)
        expect(result).toBe(project)
        expect(createMock).toHaveBeenCalledWith({ id: result.id, title: result.title })
    })

    it('updateProject', async () => {
        const project = ProjectOutputFactory.generate()
        const patchProjectMock = patchProject as Mock

        patchProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.updateProject(
            { commit },
            { id: project.id, project, scope: 'scope' }
        )

        expect(patchProjectMock).toHaveBeenCalledWith(project.id, project)
        expect(result).toBe(project)
        expect(commit).toHaveBeenCalledWith('SET_CURRENT_PROJECT', result)
    })

    it('deleteProject', async () => {
        const project = ProjectOutputFactory.generate()
        const deleteProjectMock = deleteProject as Mock
        const deleteMock = analytics.project.delete as Mock

        deleteProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.deleteProject({}, project.id)

        expect(deleteProjectMock).toHaveBeenCalledWith(project.id)
        expect(result).toBe(project)
        expect(deleteMock).toHaveBeenCalledWith({ id: project.id })
    })

    it('duplicateProject', async () => {
        const project = ProjectOutputFactory.generate()
        const duplicateProjectMock = duplicateProject as Mock
        const duplicateMock = analytics.project.duplicate as Mock

        duplicateProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.duplicateProject(
            { dispatch, getters },
            project.id
        )

        expect(duplicateProjectMock).toHaveBeenCalledWith(project.id)
        expect(result).toBe(project)
        expect(duplicateMock).toHaveBeenCalledWith(project.id, result.id)
    })

    it('addLinkedProject', async () => {
        const target = ProjectOutputFactory.generate()
        const project = ProjectOutputFactory.generate()
        const addLinkedProjectMock = addLinkedProject as Mock
        const addLinkedProjectAnalyticsMock = analytics.linkedProject.addLinkedProject as Mock

        const projectList = [
            {
                project_id: project.id,
                target_id: target.id,
            },
        ]

        const body = { projects: projectList }

        target.linked_projects = []
        target.linked_projects.push({ id: 1, project: project })

        addLinkedProjectMock.mockResolvedValue(target)

        const result = await projectsStore.actions.addLinkedProject(
            { commit, rootState },
            { id: target.id, body: body }
        )

        expect(addLinkedProjectMock).toHaveBeenCalledWith({ id: target.id, body: body })
        expect(result).toBe(target)
        expect(commit).toHaveBeenCalledWith('ADD_LINKED_PROJECT', result.linked_projects[0])
        expect(addLinkedProjectAnalyticsMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            linkedProject: result.linked_projects[0],
        })
    })

    it('patchLinkedProject', async () => {
        const project = ProjectOutputFactory.generate()
        const patchLinkedProjectMock = patchLinkedProject as Mock
        const patchLinkedProjectAnalyticsMock = analytics.linkedProject.patchLinkedProject as Mock

        patchLinkedProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.patchLinkedProject(
            { commit, rootState },
            { target_id: project.id, id: 1, body: project }
        )

        expect(patchLinkedProjectMock).toHaveBeenCalledWith({
            target_id: project.id,
            id: 1,
            body: project,
        })
        expect(result).toBe(project)
        expect(commit).toHaveBeenCalledWith('PATCH_LINKED_PROJECT', result)
        expect(patchLinkedProjectAnalyticsMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            linkedProject: result,
        })
    })

    it('deleteLinkedProject', async () => {
        const project = ProjectOutputFactory.generate()
        const linkedProject = ProjectFactory.generate()

        const projectWithLinkedProject = {
            ...project,
            linked_projects: [{ id: 1, project: linkedProject, reason: 'inspiré de' }],
        }

        const deleteLinkedProjectMock = deleteLinkedProject as Mock
        const removeLinkedProjectMock = analytics.linkedProject.removeLinkedProject as Mock

        deleteLinkedProjectMock.mockResolvedValue(projectWithLinkedProject)

        await projectsStore.actions.deleteLinkedProject(
            { commit, rootState },
            { id: 1, project_id: projectWithLinkedProject.id }
        )

        expect(removeLinkedProjectMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            linkedProject: rootState.projects.project.linked_projects[0],
        })
        expect(deleteLinkedProjectMock).toHaveBeenCalledWith({
            id: 1,
            project_id: projectWithLinkedProject.id,
        })
        expect(commit).toHaveBeenCalled()
    })

    it('getProject', async () => {
        const project = ProjectOutputFactory.generate()
        const getProjectMock = getProject as Mock

        getProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.getProject({ commit }, project.id)

        expect(getProjectMock).toHaveBeenCalledWith(project.id)
        expect(result).toBe(project)
        expect(commit).toHaveBeenCalledWith('SET_CURRENT_PROJECT', result)
    })

    it('getAllRecommendedProjects', async () => {
        const projects = ProjectOutputFactory.generateMany(2)
        const getAllRecommendedProjectsMock = getAllRecommendedProjects as Mock
        const params = {
            organizations: [rootState.organizations.current.code],
        }

        getAllRecommendedProjectsMock.mockResolvedValue(projects)

        const result = await projectsStore.actions.getAllRecommendedProjects({ rootState }, {})

        expect(getAllRecommendedProjectsMock).toHaveBeenCalledWith(params)
        expect(result).toBe(projects)
    })

    it('getAllRandomProjects', async () => {
        const projects = ProjectOutputFactory.generateMany(2)
        const getAllRandomProjectsMock = getAllRandomProjects as Mock
        const params = {
            organizations: [rootState.organizations.current.code],
        }

        getAllRandomProjectsMock.mockResolvedValue(projects)

        const result = await projectsStore.actions.getAllRandomProjects({ rootState }, {})

        expect(getAllRandomProjectsMock).toHaveBeenCalledWith(params)
        expect(result).toBe(projects)
    })

    it('getAllProjects', async () => {
        const projects = ProjectOutputFactory.generateMany(2)
        const getAllProjectsMock = getAllProjects as Mock
        const searchProjectsMock = analytics.project.search as Mock
        const params = {
            organizations: [rootState.organizations.current.code],
        }

        getAllProjectsMock.mockResolvedValue(projects)

        const result = await projectsStore.actions.getAllProjects({ rootState }, {})

        expect(getAllProjectsMock).toHaveBeenCalledWith(params)
        expect(searchProjectsMock).toHaveBeenCalledWith(params)
        expect(result).toBe(projects)
    })

    it('lockUnlockProject context lock', async () => {
        const project = ProjectOutputFactory.generate()
        const getLockUnlockProjectMock = lockUnlockProject as Mock
        const params = {
            project_id: project.id,
            context: 'lock',
        }

        getLockUnlockProjectMock.mockResolvedValue(project)

        const result = await projectsStore.actions.lockUnlockProject(
            { commit },
            {
                project_id: project.id,
                context: 'lock',
            }
        )

        expect(getLockUnlockProjectMock).toHaveBeenCalledWith(params)
        expect(result).toBe(project)
        expect(commit).toHaveBeenLastCalledWith('SET_PROJECT_LOCK', true)
    })
})

describe('Store module | projects | mutations', () => {
    const state = {
        project: ProjectOutputFactory.generate(),
        projectNotification: null,
        projectFollowNotification: null,
    }

    // PROJECT
    it('SET_CURRENT_PROJECT', () => {
        const payload = ProjectOutputFactory.generate()
        projectsStore.mutations.SET_CURRENT_PROJECT(state, payload)

        expect(state.project).toEqual(payload)
    })

    it('DELETE_CURRENT_PROJECT', () => {
        projectsStore.mutations.DELETE_CURRENT_PROJECT(state)

        expect(state.project).toEqual(null)

        // Set again current project after last delete to continue testing
        const payload = ProjectOutputFactory.generate()
        projectsStore.mutations.SET_CURRENT_PROJECT(state, payload)
    })

    it('SET_PROJECT_DESCRIPTION', () => {
        const payload = '123456'
        projectsStore.mutations.SET_PROJECT_DESCRIPTION(state, payload)

        expect(state.project.description).toEqual(payload)
    })

    it('SET_PROJECT_VISIBILITY', () => {
        const payload = 'public'
        projectsStore.mutations.SET_PROJECT_VISIBILITY(state, payload)

        expect(state.project.publication_status).toEqual(payload)
    })

    it('SET_PROJECT_LOCK', () => {
        const payload = true
        projectsStore.mutations.SET_PROJECT_LOCK(state, payload)

        expect(state.project.is_locked).toEqual(payload)
    })

    // BLOG ENTRIES
    it('SET_BLOG_ENTRIES', () => {
        const blogEntries = BlogEntryFactory.generateMany(2)
        projectsStore.mutations.SET_BLOG_ENTRIES(state, blogEntries)

        expect(state.project.blog_entries).toEqual(blogEntries)
    })

    it('ADD_BLOG_ENTRY', () => {
        const blogEntry = BlogEntryFactory.generate()
        projectsStore.mutations.ADD_BLOG_ENTRY(state, blogEntry)

        expect(state.project.blog_entries[0]).toEqual(blogEntry)
    })

    it('DELETE_BLOG_ENTRY', () => {
        const lengthBeforeDelete = state.project.blog_entries.length
        projectsStore.mutations.DELETE_BLOG_ENTRY(state, 0)

        expect(state.project.blog_entries.length).toEqual(lengthBeforeDelete - 1)
    })

    it('UPDATE_BLOG_ENTRY', () => {
        const entry = BlogEntryFactory.generate()
        projectsStore.mutations.UPDATE_BLOG_ENTRY(state, { index: 0, entry })

        expect(state.project.blog_entries[0]).toEqual(entry)
    })

    // GOALS
    it('SET_GOALS', () => {
        const goals = GoalFactory.generateMany(2)
        projectsStore.mutations.SET_GOALS(state, goals)

        expect(state.project.goals).toEqual(goals)
    })

    it('ADD_GOAL', () => {
        const goal = GoalFactory.generate()
        projectsStore.mutations.ADD_GOAL(state, goal)

        expect(state.project.goals[state.project.goals.length - 1]).toEqual(goal)
    })

    it('DELETE_GOAL', () => {
        const lengthBeforeDelete = state.project.goals.length
        projectsStore.mutations.DELETE_GOAL(state, 0)

        expect(state.project.goals.length).toEqual(lengthBeforeDelete - 1)
    })

    it('UPDATE_GOAL', () => {
        const goal = GoalFactory.generate()
        projectsStore.mutations.UPDATE_GOAL(state, { index: 0, goal })

        expect(state.project.goals[0]).toEqual(goal)
    })

    // MEMBERS
    it('SET_PROJECT_MEMBERS', () => {
        const payload = ProjectOutputFactory.generate()
        projectsStore.mutations.SET_PROJECT_MEMBERS(state, payload)

        expect(state.project.team.members).toEqual(payload.team.members)
    })

    // TAGS
    it('SET_PROJECT_TAGS', () => {
        const payload = TagFactory.generateMany(2)
        projectsStore.mutations.SET_PROJECT_TAGS(state, payload)

        expect(state.project.tags).toEqual(payload)
    })

    // LINKED PROJECTS
    it('ADD_LINKED_PROJECT', () => {
        const linkedProject = ProjectFactory.generate()

        projectsStore.mutations.ADD_LINKED_PROJECT(state, {
            id: 1,
            project: linkedProject,
            reason: 'inspiré de',
        })

        expect(state.project.linked_projects).toStrictEqual([
            { id: 1, project: linkedProject, reason: 'inspiré de' },
        ])
    })

    it('PATCH_LINKED_PROJECT', () => {
        const linkedProject = ProjectOutputFactory.generate()

        projectsStore.mutations.PATCH_LINKED_PROJECT(state, {
            id: 1,
            project: { linked_projects: linkedProject },
            reason: 'inspiré de',
        })

        expect(state.project.linked_projects).toStrictEqual([
            { id: 1, project: { linked_projects: linkedProject }, reason: 'inspiré de' },
        ])
    })

    it('DELETE_LINKED_PROJECT', () => {
        projectsStore.mutations.DELETE_LINKED_PROJECT(state, 0)

        expect(state.project.linked_projects).toStrictEqual([])
    })

    // FILES
    it('ADD_ATTACHMENT_FILE', () => {
        const file = AttachmentFileFactory.generate()
        projectsStore.mutations.ADD_ATTACHMENT_FILE(state, file)

        expect(state.project.files[state.project.files.length - 1]).toEqual(file)
    })

    it('UPDATE_ATTACHMENT_FILE', () => {
        const file = AttachmentFileFactory.generate()
        projectsStore.mutations.UPDATE_ATTACHMENT_FILE(state, { index: 0, file })

        expect(state.project.files[0]).toEqual(file)
    })

    it('DELETE_ATTACHMENT_FILE', () => {
        const lengthBeforeDelete = state.project.files.length
        projectsStore.mutations.DELETE_ATTACHMENT_FILE(state, 0)

        expect(state.project.files.length).toEqual(lengthBeforeDelete - 1)
    })

    // LINKS
    it('ADD_ATTACHMENT_LINK', () => {
        const link = AttachmentLinkFactory.generate()
        projectsStore.mutations.ADD_ATTACHMENT_LINK(state, link)

        expect(state.project.links[state.project.links.length - 1]).toEqual(link)
    })

    it('UPDATE_ATTACHMENT_LINK', () => {
        const link = AttachmentLinkFactory.generate()
        projectsStore.mutations.UPDATE_ATTACHMENT_LINK(state, { index: 0, link })

        expect(state.project.links[0]).toEqual(link)
    })

    it('DELETE_ATTACHMENT_LINK', () => {
        const lengthBeforeDelete = state.project.links.length
        projectsStore.mutations.DELETE_ATTACHMENT_LINK(state, 0)

        expect(state.project.links.length).toEqual(lengthBeforeDelete - 1)
    })

    // REVIEWS
    it('SET_REVIEWS', () => {
        const reviews = ReviewFactory.generateMany(2)
        projectsStore.mutations.SET_REVIEWS(state, reviews)

        expect(state.project.reviews).toEqual(reviews)
    })

    it('ADD_REVIEW', () => {
        const review = ReviewFactory.generate()
        projectsStore.mutations.ADD_REVIEW(state, review)

        expect(state.project.reviews[state.project.reviews.length - 1]).toEqual(review)
    })

    it('DELETE_REVIEW', () => {
        const lengthBeforeDelete = state.project.reviews.length
        projectsStore.mutations.DELETE_REVIEW(state, 0)

        expect(state.project.reviews.length).toEqual(lengthBeforeDelete - 1)
    })

    it('UPDATE_REVIEW', () => {
        const review = ReviewFactory.generate()
        projectsStore.mutations.UPDATE_REVIEW(state, { index: 0, review })

        expect(state.project.reviews[0]).toEqual(review)
    })

    // ANNOUNCEMENTS
    it('ADD_ANNOUNCEMENT', () => {
        const announcement = AnnouncementFactory.generate()
        projectsStore.mutations.ADD_ANNOUNCEMENT(state, announcement)

        expect(state.project.announcements[state.project.announcements.length - 1]).toEqual(
            announcement
        )
    })

    it('UPDATE_ANNOUNCEMENT', () => {
        const announcement = AnnouncementFactory.generate()
        projectsStore.mutations.UPDATE_ANNOUNCEMENT(state, { index: 0, announcement })

        expect(state.project.announcements[0]).toEqual(announcement)
    })

    it('DELETE_ANNOUNCEMENT', () => {
        const lengthBeforeDelete = state.project.announcements.length
        projectsStore.mutations.DELETE_ANNOUNCEMENT(state, 0)

        expect(state.project.announcements.length).toEqual(lengthBeforeDelete - 1)
    })

    // FOLLOWS
    it('SET_FOLLOWS', () => {
        const follows = FollowFactory.generateMany(2)
        projectsStore.mutations.SET_FOLLOWS(state, follows)

        expect(state.project.follows).toEqual(follows)
    })

    // LOCATIONS
    it('ADD_PROJECT_LOCATIONS', () => {
        const payload = LocationFactory.generate()

        expect(state.project.locations.length).toEqual(2)

        projectsStore.mutations.ADD_PROJECT_LOCATIONS(state, payload)

        expect(state.project.locations.length).toEqual(3)
        expect(state.project.locations[2]).toEqual(payload)
    })

    it('SET_PROJECT_LOCATIONS', () => {
        const selectedLocation = state.project.locations[1]
        const payload = LocationFactory.generate()
        payload.id = selectedLocation.id
        payload.type = 'impact'

        expect(selectedLocation.id === payload.id).toBeTruthy()
        expect(selectedLocation.type !== payload.type).toBeTruthy()

        projectsStore.mutations.SET_PROJECT_LOCATIONS(state, payload)

        expect(state.project.locations[1].type).toEqual(payload.type)
    })

    it('ADD_FOLLOW', () => {
        const follow = FollowFactory.generate()
        projectsStore.mutations.ADD_FOLLOW(state, follow)

        expect(state.project.is_followed).toEqual({
            is_followed: true,
            follow_id: follow.id,
        })
    })

    it('DELETE_FOLLOW', () => {
        projectsStore.mutations.DELETE_FOLLOW(state)

        expect(state.project.is_followed).toEqual({
            is_followed: false,
            follow_id: null,
        })
    })

    it('DELETE_PROJECT_LOCATIONS', () => {
        const payload = LocationFactory.generate()
        payload.id = state.project.locations[0].id

        expect(state.project.locations.length).toEqual(3)

        projectsStore.mutations.DELETE_PROJECT_LOCATIONS(state, payload)

        expect(state.project.locations.length).toEqual(2)
    })
})
