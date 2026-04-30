import type { OrganizationModel } from '~/models/organization.model'
import { imageSkeletons } from '~/skeletons/image.skeletons'

export const organizationSkeleton = (def?: OrganizationModel): OrganizationModel => ({
  background_color: '#fff',
  auto_translate_content: true,
  banner_image: imageSkeletons(),
  chat_button_text: '',
  children: [],
  code: 'code',
  contact_email: 'email@email.email',
  dashboard_subtitle: 'Ipsum nostrud officia dolor esse exercitation',
  dashboard_title: 'Ipsum nostrud officia dolor esse exercitation',
  description: 'Ipsum nostrud officia dolor esse exercitation',
  enabled_projects_tag_classifications: [],
  enabled_skills_tag_classifications: [],
  faq: null,
  id: -1,
  is_logo_visible_on_parent_dashboard: true,
  language: 'en',
  languages: [],
  logo_image: imageSkeletons(),
  main_org_logo_visibility: true,
  name: 'Ipsum nostrud',
  onboarding_enabled: false,
  terms_and_conditions: null,
  website_url: '#',
  ...(def ?? {}),
})
