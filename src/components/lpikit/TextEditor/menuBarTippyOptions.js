export default function (mebuBarComponent) {
    return {
        inlinePositioning: true,
        popperOptions: {
            strategy: 'fixed',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: ({ popper }) => {
                            const wrapper = mebuBarComponent.$el.closest('.content-wrapper')
                            if (wrapper) {
                                const selection = wrapper.querySelector('.ProseMirror-selectednode')
                                if (selection) {
                                    const wrapperBbox = wrapper.getBoundingClientRect()
                                    const selectionBbox = selection.getBoundingClientRect()

                                    let topOffset = 0

                                    if (selectionBbox.top > wrapperBbox.top + wrapperBbox.height) {
                                        // si la target est hors conteneur vers le bas,
                                        // clamper pour que le tip reste à la limite basse
                                        topOffset =
                                            selectionBbox.top -
                                            (wrapperBbox.top + wrapperBbox.height)
                                        topOffset += popper.height
                                    } else {
                                        // sinon la target est  éventuellemnt hors conteneur vers le heut,
                                        // clamper pour que le tip reste à la limite haute
                                        topOffset =
                                            selectionBbox.top - popper.height - wrapperBbox.top
                                        topOffset = Math.min(topOffset, 0)
                                    }
                                    return [0, topOffset]
                                }
                            }
                            return [0, 0]
                        },
                    },
                },
            ],
        },
    }
}
