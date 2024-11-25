import useLanguagesStore from '@/stores/useLanguages'

export default function useTagTexts() {
    const languagesStore = useLanguagesStore()

    const title = (tag) => {
        return tag[`title_${languagesStore.current}`] || tag.title
    }

    const description = (tag) => {
        return tag[`description_${languagesStore.current}`] || tag.description
    }

    return {
        title,
        description,
    }
}
