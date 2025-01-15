<script setup>
import TipTapEditorContainer from '@/components/base/form/TextEditor/TipTapEditorContainer.vue'
import TipTapEditorContent from '@/components/base/form/TextEditor/TipTapEditorContent.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import TipTapCollaborativeConnectedStatus from '@/components/base/form/TextEditor/TipTapCollaborativeConnectedStatus.vue'
import TipTapCollaborativeReconnectionStatus from '@/components/base/form/TextEditor/TipTapCollaborativeReconnectionStatus.vue'
import TipTapCollaborativeConnectingStatus from '@/components/base/form/TextEditor/TipTapCollaborativeConnectingStatus.vue'

import { Editor } from '@tiptap/vue-3'
import { ClearHistoryWS } from './tiptap-extensions/ClearHistoryWS.ts'

import TipTapModals from '@/components/base/form/TextEditor/TipTapModals.vue'

import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { HocuspocusProvider } from '@hocuspocus/provider'

import LpiSnackbar from '@/components/base/LpiSnackbar.vue'

import {
    emitsDefinitions,
    propsDefinitions,
    useTipTap,
} from '@/components/base/form/TextEditor/useTipTap.js'
import { ref, watchEffect, computed, onMounted, onBeforeUnmount, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'

import useUsersStore from '@/stores/useUsers.ts'
const { t } = useI18n()
import useToasterStore from '@/stores/useToaster.ts'

// grace period before freezing the editor on socket deconnection (in milliseconds)
// server heartbeat is 30s and is checked every tenth of this interval
const DISCONNECTION_GRACE_DURATION =
    import.meta.env.VITE_APP_DISCONNECTION_GRACE_DURATION || 6 * 1000

const emit = defineEmits([
    ...emitsDefinitions,
    'socket-ready',
    'unauthorized',
    'falled-back-to-solo-edit',
])

const props = defineProps({
    ...propsDefinitions,
    room: {
        type: String,
        required: true,
    },
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

const toaster = useToasterStore()

const {
    editor,
    editorInited,
    appendTranslationsStyle,
    destroyEditor,
    getExtensions,
    initialContent,
    resetContent,
    onBlur,
    onDrop,
    onPaste,
} = useTipTap({
    props,
    emit,
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
const fallbackToSoloEdit = ref(false)
const hideSoloWarning = ref(false)

// prevent update until first sync
const updateIsBlocked = ref(true)

// computed:
const usersStore = useUsersStore()
const user = computed(() => usersStore.userFromApi)
const accessToken = computed(() => usersStore.accessToken)

const onlineAndConnected = computed(() => online.value && status.value === 'connected')

const socketReady = computed(() => !cnxTimedout.value && onlineAndConnected.value)

const onUpdate = ({ editor }) => {
    if (!updateIsBlocked.value) emit('update:modelValue', editor.getHTML())
}

// methods
function fallbackToSoloMode() {
    fallbackToSoloEdit.value = true
    emit('falled-back-to-solo-edit')
}

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
                profile_picture: user.value.profile_picture,
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
    updateIsBlocked.value = true

    // this prevents multiple init of editor
    // (that causes duplicate user/content bugs)
    if (!props.room) return

    if (editorInited.value) return
    initialContent.value = props.modelValue
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
            if (editor.value) destroyCollaborativeEditor()
        }
    }, cnxTimeout.value)

    provider.value = new HocuspocusProvider({
        appId: 'Foo000',
        url: sockerserver,
        name: props.room,
        token: accessToken.value,
        parameters: providerParams,
        onOpen: () => {
            cnxOpen.value = true
            // clear "unconnectable" timeout
            if (cnxTimer.value) clearTimeout(cnxTimer.value)
        },
        onAuthenticationFailed: () => {
            emit('unauthorized')
            toaster.pushError(t('multieditor.unauthorized'))
        },
        // it tell us if server is down or not
        // status is only reliable if we have a working connection
        onStatus: (event) => {
            status.value = event.status
        },

        onSynced: (event) => {
            if (event && !firstSync.value) {
                firstSync.value = true
                updateIsBlocked.value = false

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

    // debug
    // ;[
    //     'open',
    //     'connect',
    //     'authenticated',
    //     'authenticationFailed',
    //     'status',
    //     'message',
    //     'outgoingMessage',
    //     'synced',
    //     'close',
    //     'disconnect',
    //     'destroy',
    //     'awarenessUpdate',
    //     'awarenessChange',
    //     'stateless',
    // ].forEach((evt) => provider.value.on(evt, () => console.log('provider event ', evt)))

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
        onDrop,
        onBlur,
        onPaste,
        onUpdate,
    })
    // editor.value.on('update', onUpdate)
    // editor.value.on('blur', onBlur)
    // editor.value.on('onDrop', onDrop) // yes event naming is weird
    // editor.value.on('onPaste', onPaste) // yes event naming is weird
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
    if (disconnectionGraceTimeout.value) clearTimeout(disconnectionGraceTimeout.value)
    if (provider.value) {
        provider.value.destroy()
        provider.value = null
    }
    // editor.value?.off('update', onUpdate)
    // editor.value?.off('blur', onBlur)
    // editor.value?.off('drop', onDrop) // yes event naming is weird
    // editor.value?.off('onPaste', onPaste) // yes event naming is weird
    destroyEditor()
}

// watch
// re-set the cookie when token change
// TODO really ?
// watch(
//     () => accessToken.value,
//     () => {
//         funct.setTokenForWS(accessToken.value)
//     }
// )

watchEffect(() => {
    if (onlineAndConnected.value) {
        handleReconnection()
    } else {
        handleDisconnection()
    }
})
watchEffect(() => emit('socket-ready', socketReady.value), {
    immediate: true,
})

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

// expose
// editor needs to be accessed by parent (see HelpAdminTab.vue)
defineExpose({
    editor,
    resetContent,
})
</script>
<template>
    <template v-if="fallbackToSoloEdit">
        <LpiSnackbar
            v-if="!hideSoloWarning"
            class="solo-mode-warning"
            icon="AlertOutline"
            closable
            @close="hideSoloWarning = true"
            type="warning"
        >
            <span>{{ t(`multieditor.server-unconnectable.head-up-warning`) }}</span>
        </LpiSnackbar>
        <TipTapEditor
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
            :save-image-callback="saveImageCallback"
            :mode="mode"
            :save-icon-visible="false"
        />
    </template>
    <TipTapEditorContainer v-else :editor="editor" :mode="mode">
        <template v-if="firstSync">
            <TipTapCollaborativeConnectedStatus
                v-if="editor"
                :online-and-connected="onlineAndConnected"
                :status="status"
                :users="editor.storage.collaborationCursor.users"
            />

            <TipTapModals
                v-if="editor"
                :editor="editor"
                :mode="mode"
                :show-menu="disconnectionGrace"
                :save-icon-visible="saveIconVisible"
                :save-image-callback="saveImageCallback"
                @image="emit('image', $event)"
                @saved="emit('saved', $event)"
            />
            <TipTapCollaborativeReconnectionStatus
                v-if="!onlineAndConnected"
                :disconnection-grace="disconnectionGrace"
                :status="status"
            />

            <TipTapEditorContent
                v-if="editor"
                :editor="editor"
                :editor-frozen="!disconnectionGrace"
                is-connected
            />
        </template>
        <TipTapCollaborativeConnectingStatus
            v-else
            :cnx-timedout="cnxTimedout"
            :status="status"
            @do-fallback-edit="fallbackToSoloMode"
        />
    </TipTapEditorContainer>
</template>

<!--SCOPED TO FIX BUG ON DEFAULT EDITOR, UN-SCOPE IF NEEDED LATER-->
<style lang="scss" scoped>
// TODO dead code ???
// .connecting,
// .disconnected {
//     padding: 20px;
//     text-align: center;
// }

.solo-mode-warning {
    margin: 0 auto 1rem;
}
</style>
