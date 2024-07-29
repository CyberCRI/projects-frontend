<script setup>
import funct from '@/functs/functions.ts'
import UserCard from './UserPresenceCard.vue'

import { Editor, EditorContent } from '@tiptap/vue-3'
import { ClearHistoryWS } from './tiptap-extensions/ClearHistoryWS.ts'

import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import EditorModalImage from './modals/EditorModalImage.vue'
import EditorModalLink from './modals/EditorModalLink.vue'
import EditorModalColor from './modals/EditorModalColor.vue'
import EditorModalVideo from './modals/EditorModalVideo.vue'

import MenuBar from './MenuBar.vue'
import TableMenuBar from './TableMenuBar.vue'
import LinkMenuBar from './LinkMenuBar.vue'

import ImageMenuBar from './ImageMenuBar.vue'
import VideoMenuBar from './VideoMenuBar.vue'

import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { toRaw } from 'vue'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

import { propsDefinitions, useTipTap } from '@/components/base/form/TextEditor/tiptap-base.js'
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

/*
TODO
    - remove socket props
    - use useTipTap
    - remove this
    - use .value
*/

const store = useStore()
const { t } = useI18n()

// grace period before freezing the editor on socket deconnection (in milliseconds)
// server heartbeat is 30s and is checked every tenth of this interval
const DISCONNECTION_GRACE_DURATION =
    import.meta.env.VITE_APP_DISCONNECTION_GRACE_DURATION || 6 * 1000

// TODO merge bas emis
const emit = defineEmits(['saved', 'update', 'destroy', 'image', 'blur', 'socket-ready'])

const props = defineProps({
    ...propsDefinitions,
    color: {
        type: String,
        // choose a random color for every user
        default: () => {
            function randomIntInRange(fromInclusive, toInclusive) {
                return Math.floor(Math.random() * (toInclusive - fromInclusive + 1) + fromInclusive)
            }
            const hue = randomIntInRange(0, 360) // any tint
            const saturation = randomIntInRange(50, 100) // not too grey
            const lightness = randomIntInRange(20, 60) // neither too dark nor too light
            return `hsl(${hue}deg ${saturation}% ${lightness}%)`
        },
    },

    socket: {
        type: Boolean,
        default: false,
    },

    providerParams: {
        type: Object,
        default: () => {},
    },
})

const {
    editor,
    editorInited,
    activeModals,
    linkHref,
    currentColor,
    focusEditor,
    openLinkModal,
    openColorModal,
    openVideoModal,
    openImageModal,
    openDestroyModal,
    handleLinkModalConfirmed,
    handleColorModalConfirmed,
    handleVideoModalConfirmed,
    handleImageModalConfirmed,
    handleImage,
    appendTranslationsStyle,
    destroyEditor,
    getExtensions,
} = useTipTap({ props, emit, store, t })

// data
const provider = ref(null)
// TODO ref ?
const sockerserver = import.meta.env.VITE_APP_WSS_HOST
const status = ref('offline')
const online = ref(navigator.onLine)
const synced = ref(false) // current sync status
const firstSync = ref(false) // was synced at least once
const disconnectionGraceTimeout = ref(null)
const disconnectionGrace = ref(true) // only false when disconnected AND grace period has expired AND no reconnection occured
const cnxOpen = ref(false)
const cnxTimedout = ref(false)
const cnxTimeout = ref(3000)
const cnxTimer = ref(null)

// computed:
const user = computed(() => store.getters['users/userFromApi'])
const accessToken = computed(() => store.getters['users/accessToken'])

const onlineAndConnected = computed(() => online.value && status.value === 'connected')

const socketReady = computed(() => !cnxTimedout.value && onlineAndConnected)

// methods

function getCollaborativeExtensions() {
    //     let exts = [
    //         // Collaborative (socket) use its own history
    //         StarterKit.configure({ history: !props.socket }),
    //         Link.configure({
    //             openOnClick: false,
    //         }),
    //         TextStyle,
    //         Color,
    //         // TODO: Check if need history
    //         // History,
    //         Underline,
    //         TextAlign.configure({
    //             types: ['heading', 'paragraph'],
    //             alignments: ['left', 'center', 'right'],
    //         }),
    //         ExternalVideo,
    //         Table.configure({
    //             resizable: true,
    //             cellMinWidth: 300,
    //         }),
    //         TableRow,
    //         TableHeader,
    //         CustomTableCell,
    //         CustomImage,
    //         Gapcursor,
    //         LpiCodeBlock.configure({
    //             lowlight,
    //         }),
    //     ]

    const exts = getExtensions()

    exts.push(
        Collaboration.configure({
            document: toRaw(provider.value.document),
        })
    )
    exts.push(
        CollaborationCursor.configure({
            provider: toRaw(provider.value),
            user: {
                name: user.value.given_name + ' ' + user.value.family_name,
                color: props.color,
                pid: user.value.id,
                picture: user.value.profile_picture
                    ? user.value.profile_picture.variations.medium
                    : null,
                imageSizes: pictureApiToImageSizes(user.value.profile_picture),
            },
        })
    )
    exts.push(ClearHistoryWS.configure({}))

    return exts
}

const getCollaborativeContent = () => {
    // if it is socket driven
    // add nothing to the socket initially
    // either we'll fetch the socket content if we're not alone
    // or we'll set the content to the original description if we're the first to connect
    if (props.socket) return ''
    // else render previous conetnt
    //return props.wsData.originalContent
}

function initCollaborativeEditor() {
    // this prevents multiple init of editor
    // (that causes duplicate user/content bugs)
    if (props.socket && !props.wsData.room) return

    if (editorInited.value) return
    editorInited.value = true

    status.value = 'connecting'
    // this.ydoc = new Y.Doc()

    const providerParams = {
        ...props.providerParams,
    }

    // there's no way in provide to detect failure if server is not reached at least once
    // so we use a simple timeout that check if the connection was ever open
    // and if not display a message and kill the editor
    // if there has been at least one connection, the provider will try to reconnect on a grace delay will be used
    cnxTimer.value = setTimeout(() => {
        if (!cnxOpen.value) {
            cnxTimedout.value = true
            destroyEditor()
        }
    }, cnxTimeout.value)

    console.log('in init', accessToken.value)

    provider.value = new HocuspocusProvider({
        url: sockerserver,
        name: props.wsData.room,
        token: accessToken.value,
        parameters: providerParams,
        onOpen: () => {
            cnxOpen.value = true
            // clear "unconnectable" timeout
            if (cnxTimer.value) clearTimeout(cnxTimer.value)
        },
        onAuthenticationFailed: () => {
            emit('destroy')
            store.dispatch('notifications/pushToast', {
                message: t('multieditor.unauthorized'),
                type: 'error',
            })
        },
        // it tell us if server is down or not
        // status is only reliable if we have a working connection
        onStatus: (event) => {
            status.value = event.status
        },

        onSynced: (event) => {
            if (event && !firstSync.value) {
                firstSync.value = true

                // TODO may skip this since the history is kept by server now
                // reset history so we can't undo past the initial content (e.g. to an empty content)
                editor.value.chain().focus('start').clearHistoryWS().run()

                // set cursor at start of document
                setTimeout(
                    () =>
                        editor.value &&
                        editor.value.commands &&
                        editor.value.commands.focus('start'),
                    100 // content is not synchronously updated
                )
            }
            synced.value = event
        },
    })

    // so also listen to client connection status
    window.addEventListener('offline', setOffline)
    window.addEventListener('online', setOnline)

    // almost base initEditor

    if (editor.value) destroyCollaborativeEditor()

    editor.value = new Editor({
        content: getCollaborativeContent(),
        extensions: getCollaborativeExtensions(),
        parseOptions: {
            preserveWhitespace: 'full',
        },
    })
    editor.value.on('update', () => {
        emit('update', editor.value.getHTML())
    })
    editor.value.on('blur', (e) => {
        emit('blur', e)
    })
}

function setOnline() {
    online.value = true
}

function setOffline() {
    online.value = false
}

function handleDisconnection() {
    disconnectionGrace.value = true
    disconnectionGraceTimeout.value = setTimeout(() => {
        disconnectionGrace.value = false
        editor.value.setEditable(false)
    }, DISCONNECTION_GRACE_DURATION)
}

function handleReconnection() {
    disconnectionGrace.value = true
    editor.value.setEditable(true)
    clearTimeout(disconnectionGraceTimeout.value)
}

function destroyCollaborativeEditor() {
    if (cnxTimer.value) clearTimeout(cnxTimer.value)
    destroyEditor()
    if (provider.value) provider.value.destroy()
}

// watch
// re-set the cookie when token change
watch(
    () => accessToken.value,
    () => {
        console.log('in wathc', accessToken.value)
        funct.setTokenForWS(accessToken.value)
    }
)

watch(
    () => props.wsData,
    () => {
        editorInited.value = false
        // Reinit editor so that changes in wsData props are visible in editor
        initCollaborativeEditor()
    }
)

watch(
    () => onlineAndConnected,
    (neo, old) => {
        if (props.socket && old !== neo) {
            if (neo) {
                handleReconnection()
            } else {
                handleDisconnection()
            }
        }
    }
)
watch(
    () => socketReady,
    (neo, old) => {
        if (props.socket && old !== neo) {
            emit('socket-ready', neo)
        }
    },
    {
        immediate: true,
    }
)

// lifecycle
onMounted(() => {
    appendTranslationsStyle()
    initCollaborativeEditor()
})

onBeforeUnmount(() => {
    destroyCollaborativeEditor()
    window.removeEventListener('offline', setOffline)
    window.removeEventListener('online', setOnline)
})
</script>
<template>
    <div
        v-if="editor"
        :class="'editor editor-' + mode + ' lang-' + $store.state.languages.current"
        @click.self="focusEditor"
    >
        <template v-if="firstSync">
            <ConfirmModal
                v-if="activeModals.destroy"
                :content="`${$t('description.delete')} ${$t('description.edit-saved')}`"
                :title="$t('description.quit-without-saving-title')"
                confirm-button-label="common.continue"
                @cancel="activeModals.destroy = false"
                @confirm="handleDestroyModalConfirmed"
            />

            <EditorModalImage
                v-if="activeModals.image"
                :parent="parent"
                :selected-category="selectedCategory"
                @close-modal="activeModals.image = false"
                @image="handleImage"
                @on-confirm="handleImageModalConfirmed"
            />

            <EditorModalLink
                v-if="activeModals.link"
                :link-href="linkHref"
                :has-selection="!editor.view.state.selection.empty"
                @close-modal="activeModals.link = false"
                @on-confirm="handleLinkModalConfirmed"
            />

            <EditorModalColor
                v-if="activeModals.color"
                :current-color="currentColor"
                @close-modal="activeModals.color = false"
                @on-confirm="handleColorModalConfirmed"
            />

            <EditorModalVideo
                v-if="activeModals.video"
                @close-modal="activeModals.video = false"
                @on-confirm="handleVideoModalConfirmed"
            />

            <div class="editor-socket">
                <div :class="`editor-status editorstatus--${status}`">
                    <div v-if="onlineAndConnected" class="list currenteditors">
                        <UserCard
                            v-for="(u, index) in editor.storage.collaborationCursor.users"
                            :key="index"
                            :user="{
                                name: u.name,
                                id: u.clientId,
                                people_id: u.pid,
                                color: u.color,
                                picture: u.picture,
                                imageSizes: u.imageSizes,
                            }"
                            mode="full"
                            size="s"
                            tint="inverse"
                        />
                    </div>
                </div>
            </div>
            <MenuBar
                v-if="disconnectionGrace"
                :editor="editor"
                :mode="mode"
                :open-color-modal="openColorModal"
                :open-destroy-modal="openDestroyModal"
                :open-image-modal="openImageModal"
                :open-link-modal="openLinkModal"
                :open-video-modal="openVideoModal"
                :room="wsData.room"
                :save-icon-visible="saveIconVisible"
                class="editor-header"
                @saved="$emit('saved')"
            />
            <div
                v-if="!onlineAndConnected"
                :class="{ 'editor-frozen': !disconnectionGrace }"
                class="status-bar"
            >
                <div
                    v-if="!online"
                    class="connection-status"
                    v-text="$t(`multieditor.offline`)"
                ></div>
                <div
                    v-if="online && status === 'connecting'"
                    class="connection-status"
                    v-text="$t(`multieditor.server-connecting`)"
                ></div>
                <div
                    v-if="online && status === 'disconnected'"
                    class="connection-status"
                    v-text="$t(`multieditor.server-disconnected`)"
                ></div>
                <div
                    v-if="!disconnectionGrace"
                    class="connection-status"
                    v-text="$t(`multieditor.frozen`)"
                ></div>
            </div>

            <div class="content-wrapper">
                <TableMenuBar
                    v-if="disconnectionGrace && mode === 'full'"
                    :editor="editor"
                    class="editortablemenu"
                />

                <LinkMenuBar
                    v-if="mode !== 'none' && disconnectionGrace"
                    :editor="editor"
                    :open-link-modal="openLinkModal"
                    class="editorlinkmenu"
                />
                <VideoMenuBar v-if="mode !== 'none' && disconnectionGrace" :editor="editor" />
                <ImageMenuBar v-if="mode !== 'none' && disconnectionGrace" :editor="editor" />
                <EditorContent
                    ref="editorContent"
                    :class="{ 'editor-frozen': !disconnectionGrace }"
                    :editor="editor"
                    class="editor-content custom-scrollbar"
                    data-test="input-editor-content-connected"
                />
            </div>
        </template>
        <template v-else>
            <p v-if="cnxTimedout" class="not-synced">
                {{ $t(`multieditor.server-unconnectable`) }}
            </p>
            <div v-else>
                <p class="not-synced">{{ $t('multieditor.not-synced') }}</p>
                <p class="not-synced">{{ $t('multieditor.server-' + status) }}</p>
            </div>
        </template>
    </div>
</template>

<!--SCOPED TO FIX BUG ON DEFAULT EDITOR, UN-SCOPE IF NEEDED LATER-->
<style lang="scss" scoped>
.editor {
    overflow: hidden;
    border-radius: $border-radius-l;
    border: $border-width-s solid $primary;
    display: flex;
    flex-flow: column nowrap;

    .not-synced {
        padding: 20px;
    }

    .content-wrapper {
        display: flex;
        flex-grow: 1;
        overflow: hidden;
    }

    .editor-content {
        color: $black;
        padding: 8px;
        overflow-y: auto;
        max-height: 430px;
        min-height: 100px;
        flex-grow: 1;
        margin-right: $space-2xs;

        .ProseMirror {
            outline: none;
            padding: 30px;
            border: none;
            background: $primary-lighter;

            & * {
                word-wrap: break-word !important;
            }
        }

        .anchor-element {
            display: block;
            position: relative;
            visibility: hidden;
        }
    }

    &.no-max-height {
        .editor-content {
            max-height: none;
        }
    }

    &.min-height-100 {
        .editor-content {
            min-height: 100%;
        }
    }

    .status-bar,
    .editor-header {
        background: $white;
        color: $primary-dark;
        display: flex;
        padding: 5px 20px;
        position: sticky;
        z-index: 10;
        width: 100%;
    }

    .editor-header {
        justify-content: space-between;
        border-bottom: $border-width-s solid $primary;
        top: 0;

        .icons {
            align-items: center;
            display: flex;

            .menu-item {
                color: $primary-dark;
            }
        }
    }

    .editor-socket {
        align-items: center;
        background: $primary-lighter;
        display: flex;
        justify-content: space-between;
    }

    .editor-status {
        align-items: center;
        color: $white;
        display: flex;
        justify-content: space-between;
        padding: 5px 20px;

        .list {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
    }
}

.connecting,
.disconnected {
    padding: 20px;
    text-align: center;
}

.status-bar {
    justify-content: center;
    top: 30px;

    &.editor-frozen {
        top: 0;
    }

    .connection-status {
        padding: 0 2rem;
    }
}

// TODO: this  break vue 3 compilation fix this later
:deep(.content),
:deep(.editor-content) {
    /* Give a remote user a caret */
    .collaboration-cursor__caret {
        position: relative;
        margin-left: -1px;
        margin-right: -1px;
        border-left: 1px solid $almost-black;
        border-right: 1px solid $almost-black;
        word-break: normal;
        pointer-events: none;
    }

    /* Render the username above the caret */
    .collaboration-cursor__label {
        font-family: Roboto, 'Noto Sans SC', helvetica, arial, sans-serif;
        position: absolute;
        top: -1em;
        left: -1px;
        font-size: $font-size-2xs;
        font-style: normal;
        font-weight: 600;
        line-height: $line-height-tight;
        user-select: none;
        color: $white;
        padding: 0.1rem 0.3rem;
        border-radius: 3px 3px 3px 0;
        white-space: nowrap;
        opacity: 0.7;
        pointer-events: none;
    }

    .not-synced {
        padding: 20px;
    }

    .editor .selectedCell {
        outline: $primary dashed 1px;
    }

    .editor * {
        overflow-wrap: break-word;
        hyphens: auto;
    }

    .editor table {
        max-width: 100% !important;
        min-width: auto !important;
    }

    .editor th {
        background-color: $almost-black;
        color: $white;
    }

    .editor-frozen .ProseMirror {
        background-color: $almost-white;
    }
}
</style>
