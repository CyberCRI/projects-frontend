<script setup>
import funct from '@/functs/functions.ts'
import TipTapEditorContainer from '@/components/base/form/TextEditor/TipTapEditorContainer.vue'
import TipTapEditorContent from '@/components/base/form/TextEditor/TipTapEditorContent.vue'

import TipTapCollaborativeConnectedStatus from '@/components/base/form/TextEditor/TipTapCollaborativeConnectedStatus.vue'
import TipTapCollaborativeReconnectionStatus from '@/components/base/form/TextEditor/TipTapCollaborativeReconnectionStatus.vue'
import TipTapCollaborativeConnectingStatus from '@/components/base/form/TextEditor/TipTapCollaborativeConnectingStatus.vue'

import { Editor } from '@tiptap/vue-3'
import { ClearHistoryWS } from './tiptap-extensions/ClearHistoryWS.ts'

import TipTapModals from '@/components/base/form/TextEditor/TipTapModals.vue'

import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { toRaw } from 'vue'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

import {
    emitsDefinitions,
    propsDefinitions,
    useTipTap,
} from '@/components/base/form/TextEditor/useTipTap.js'
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()

// grace period before freezing the editor on socket deconnection (in milliseconds)
// server heartbeat is 30s and is checked every tenth of this interval
const DISCONNECTION_GRACE_DURATION =
    import.meta.env.VITE_APP_DISCONNECTION_GRACE_DURATION || 6 * 1000

const emit = defineEmits([...emitsDefinitions, 'socket-ready'])

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

    providerParams: {
        type: Object,
        default: () => {},
    },
})

const { editor, editorInited, appendTranslationsStyle, destroyEditor, getExtensions } = useTipTap({
    props,
    emit,
    store,
    t,
})

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
    return ''
}

function initCollaborativeEditor() {
    // this prevents multiple init of editor
    // (that causes duplicate user/content bugs)
    if (!props.wsData.room) return

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
// TODO really ?
watch(
    () => accessToken.value,
    () => {
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
        if (old !== neo) {
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
        if (old !== neo) {
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
    <TipTapEditorContainer v-if="editor" :mode="mode">
        <template v-if="firstSync">
            <TipTapCollaborativeConnectedStatus
                :online-and-connected="onlineAndConnected"
                :status="status"
                :users="editor.storage.collaborationCursor.users"
            />

            <TipTapModals
                :editor="editor"
                :parent="parent"
                :mode="mode"
                :selected-category="selectedCategory"
                :show-menu="disconnectionGrace"
                :save-icon-visible="saveIconVisible"
                @image="emit('image', $event)"
                @update="emit('update', $event)"
                @destroy="emit('destroy', $event)"
                @saved="emit('saved', $event)"
            />
            <TipTapCollaborativeReconnectionStatus
                v-if="!onlineAndConnected"
                :disconnection-grace="disconnectionGrace"
                :status="status"
            />

            <TipTapEditorContent
                :editor="editor"
                :editor-frozen="!disconnectionGrace"
                is-connected
            />
        </template>
        <TipTapCollaborativeConnectingStatus v-else :cnx-timedout="cnxTimedout" :status="status" />
    </TipTapEditorContainer>
</template>

<!--SCOPED TO FIX BUG ON DEFAULT EDITOR, UN-SCOPE IF NEEDED LATER-->
<!--style lang="scss" scoped>
// TODO dead code ???
// .connecting,
// .disconnected {
//     padding: 20px;
//     text-align: center;
// }
</style-->
