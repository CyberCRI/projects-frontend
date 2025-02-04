import type { ImageTemplateOutput, ImageTemplateInput } from '@/models/image.model'
import useAPI from '@/composables/useAPI'

export async function postTemplateImage({ id, body }: { id: number; body: ImageTemplateInput }) {
    return (await useAPI(`/category/${id}/template-image/`, { body, method: 'POST' })).data
}
