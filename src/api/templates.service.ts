import { ImageTemplateOutput, ImageTemplateInput } from '@/models/image.model'
import { axios } from '@/api/api.config'
import { TemplateCreateInput, TemplateOutput } from '@/models/template.model'

export async function createTemplate(template: TemplateCreateInput): Promise<TemplateOutput> {
    return (await axios.post(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/template/`, template))
        .data
}

export async function patchTemplate(template: TemplateCreateInput): Promise<TemplateOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/template/${
                template.project_categories_ids
            }`,
            template
        )
    ).data
}

export async function postTemplateImage({
    id,
    body,
}: {
    id: number
    body: ImageTemplateInput
}): Promise<ImageTemplateOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/category/${id}/template-image/`,
            body
        )
    ).data
}
