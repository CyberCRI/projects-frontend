import analytics from '@/analytics'
import { SearchParams } from '@/api/projects.service'
import { ProjectMembersAddInput, ProjectMembersDeleteInput } from '@/models/project-member.model'

export interface ProjectAnalytic {
    id: string // Project id (in OLD API was called shortid)
    title?: string
}

export interface MemberAnalytic {
    project: {
        id: string
    }
    members: ProjectMembersAddInput | ProjectMembersDeleteInput
}

export default {
    /**
     * "Create project" analytic event
     * @param project
     */
    create(project: ProjectAnalytic): void {
        analytics.track('create_project', {
            project: {
                id: project.id,
                title: project.title,
            },
        })
    },
    /**
     * "Delete project" analytic event
     * @param project
     */
    delete(project: ProjectAnalytic): void {
        analytics.track('delete_project', {
            project: {
                id: project.id,
            },
        })
    },
    /**
     * "duplicate project" analytic event
     * @param project_id
     * @param new_project_id
     */
    duplicate(project_id: string, new_project_id: string): void {
        analytics.track('duplicate_project', {
            project: {
                id: project_id,
            },
            newProject: {
                id: new_project_id,
            },
        })
    },
    /**
     * "Update Description project" analytic event
     * @param project
     */
    updateDescription(project: ProjectAnalytic): void {
        analytics.track('update_project_description', {
            project: {
                id: project.id,
            },
        })
    },
    /**
     * "Update life_status" analytic event
     * @param project
     */
    updateStatus(project: ProjectAnalytic): void {
        analytics.track('update_project_status', {
            project: {
                id: project.id,
            },
        })
    },
    /**
     * "Update visibility" analytic event
     * @param project
     */
    updateVisibility(project: ProjectAnalytic): void {
        analytics.track('update_project_visibility', {
            project: {
                id: project.id,
            },
        })
    },
    /**
     * "Review project" analytic event
     * @param project
     * @param reviewId
     */
    review(project: ProjectAnalytic, reviewId: string): void {
        analytics.track('review_project', {
            project: {
                shortid: project.id,
            },
            review_id: reviewId,
        })
    },
    /**
     * "Search project" analytic event
     * @param filters
     */
    search(filters: SearchParams): void {
        analytics.track('search_project', { filters })
    },
    /**
     * "Update project sort" analytic event
     * @param filter
     */
    updateSort(filter: string): void {
        analytics.track('update_sort_project', { filter })
    },

    /**
     * "Add teamMember" analytic event
     * @param member
     */
    addMember(member: MemberAnalytic): void {
        analytics.track('add_team_member_project', member)
    },
    /**
     * "Remove team member" analytic event
     * @param member
     */
    removeTeamMember(member: MemberAnalytic): void {
        analytics.track('remove_team_member_project', member)
    },
}
