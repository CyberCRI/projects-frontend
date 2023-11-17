import { ImageTemplateOutput, ImageTemplateInput } from '@/models/image.model'
import { axios } from '@/api/api.config'

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
