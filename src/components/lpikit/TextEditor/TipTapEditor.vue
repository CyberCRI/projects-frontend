<template>
    <div
        v-if="editor"
        :class="'editor editor-' + mode + ' lang-' + $store.state.languages.current"
        @click.self="focusEditor"
    >
        <template v-if="socket">
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
                        v-if="disconnectionGrace"
                        :editor="editor"
                        :open-link-modal="openLinkModal"
                        class="editorlinkmenu"
                    />
                    <VideoMenuBar v-if="disconnectionGrace" :editor="editor" />
                    <ImageMenuBar v-if="disconnectionGrace" :editor="editor" />
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
        </template>
        <template v-else>
            <ConfirmModal
                v-if="activeModals.destroy"
                :content="`${$t('description.delete')} ${$t('description.edit-saved')}`"
                :title="$t('description.quit-without-saving-title')"
                @cancel="activeModals.destroy = false"
                @confirm="activeModals.destroy = false"
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

            <MenuBar
                :editor="editor"
                :mode="mode"
                :open-color-modal="openColorModal"
                :open-destroy-modal="openDestroyModal"
                :open-image-modal="openImageModal"
                :open-link-modal="openLinkModal"
                :open-video-modal="openVideoModal"
                :save-icon-visible="saveIconVisible"
                class="editor-header"
                @saved="$emit('saved')"
            />

            <div class="content-wrapper">
                <TableMenuBar v-if="mode === 'full'" :editor="editor" class="editortablemenu" />

                <LinkMenuBar
                    :editor="editor"
                    :open-link-modal="openLinkModal"
                    class="editorlinkmenu"
                />

                <ImageMenuBar :editor="editor" />

                <VideoMenuBar :editor="editor" />

                <EditorContent
                    ref="editorContent"
                    :editor="editor"
                    class="editor-content custom-scrollbar"
                    data-test="input-editor-content-simple"
                />
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import funct from '@/functs/functions.ts'
import UserCard from '@/components/shrcomponents/UserCard.vue'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Color from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
// import History from '@tiptap/extension-history'
import TextStyle from '@tiptap/extension-text-style'

import CustomTableCell from './tiptap-extensions/CustomTableCell.ts'
import ExternalVideo from './tiptap-extensions/ExternalVideo.ts'
import { ClearHistoryWS } from './tiptap-extensions/ClearHistoryWS.ts'

import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import EditorModalImage from './modals/EditorModalImage.vue'
import EditorModalLink from './modals/EditorModalLink.vue'
import EditorModalColor from './modals/EditorModalColor.vue'
import EditorModalVideo from './modals/EditorModalVideo.vue'

import MenuBar from './MenuBar.vue'
import TableMenuBar from './TableMenuBar.vue'
import LinkMenuBar from './LinkMenuBar.vue'

import CustomImage from './tiptap-extensions/CustomImage.ts'
import ImageMenuBar from './ImageMenuBar.vue'
import VideoMenuBar from './VideoMenuBar.vue'

import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { toRaw } from 'vue'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

// grace period before freezing the editor on socket deconnection (in milliseconds)
// server heartbeat is 30s and is checked every tenth of this interval
const DISCONNECTION_GRACE_DURATION =
    import.meta.env.VITE_APP_DISCONNECTION_GRACE_DURATION || 6 * 1000

export default {
    name: 'TipTapEditor',

    emits: ['saved', 'update', 'destroy', 'image', 'blur', 'socket-ready'],

    components: {
        EditorContent,
        MenuBar,
        ConfirmModal,
        EditorModalImage,
        EditorModalLink,
        EditorModalVideo,
        EditorModalColor,
        UserCard,
        TableMenuBar,
        LinkMenuBar,
        ImageMenuBar,
        VideoMenuBar,
    },

    props: {
        color: {
            type: String,
            // choose a random color for every user
            default: '#' + Math.floor(Math.random() * Math.pow(2, 24)).toString(16),
        },
        mode: {
            // mode supports 3 values 'simple' | 'medium' | 'full'
            type: String,
            default: 'simple',
        },
        socket: {
            type: Boolean,
            default: false,
        },
        wsData: {
            type: Object,
            required: true,
        },
        saveIconVisible: {
            type: Boolean,
            default: true,
        },

        parent: {
            type: String,
            default: '',
        },

        selectedCategory: {
            type: Object,
            default: () => {},
        },
        providerParams: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        ...mapGetters({
            user: 'users/userFromApi',
            accessToken: 'users/accessToken',
        }),

        linkHref() {
            return this.editor.getAttributes('link').href
        },

        currentColor() {
            return this.editor.getAttributes('textStyle').color
        },

        onlineAndConnected() {
            return this.online && this.status === 'connected'
        },

        socketReady() {
            return !this.cnxTimedout && this.onlineAndConnected
        },
    },

    data() {
        return {
            editor: null,
            type: null,
            provider: null,
            activeModals: {
                destroy: false,
                image: false,
                link: false,
                video: false,
                color: false,
            },
            sockerserver: import.meta.env.VITE_APP_WSS_HOST,
            status: 'offline',
            online: navigator.onLine,
            synced: false, // current sync status
            firstSync: false, // was synced at least once
            editorInited: false,
            disconnectionGraceTimeout: null,
            disconnectionGrace: true, // only false when disconnected AND grace period has expired AND no reconnection occured
            cnxOpen: false,
            cnxTimedout: false,
            cnxTimeout: 3000,
            cnxTimer: null,
        }
    },

    mounted() {
        this.appendTranslationsStyle()
        this.initEditor()
    },

    beforeUnmount() {
        this.destroyEditor()
        window.removeEventListener('offline', this.setOffline)
        window.removeEventListener('online', this.setOnline)
    },

    methods: {
        focusEditor() {
            if (this.editor) {
                this.editor.commands.focus('start')
            }
        },

        appendTranslationsStyle() {
            if (!document.getElementById('multieditor-translations')) {
                let css = ''
                this.$store.state.languages.all.forEach((langcode) => {
                    css += `.lang-${langcode} .ProseMirror-focused .custom-video-wrapper.ProseMirror-selectednode:after { content: '${this.$t(
                        'multieditor.click-to-play-video',
                        langcode
                    )}'; }
                    `
                })
                const head = document.head || document.getElementsByTagName('head')[0]
                const style = document.createElement('style')
                style.innerHTML = css
                style.id = 'multieditor-translations'
                head.appendChild(style)
            }
        },

        initEditor() {
            // this prevents multiple init of editor
            // (that causes duplicate user/content bugs)
            if (this.socket && !this.wsData.room) return
            if (this.editorInited) return
            this.editorInited = true
            if (this.socket) {
                this.status = 'connecting'
                // this.ydoc = new Y.Doc()

                const providerParams = {
                    ...this.providerParams,
                }

                // there's no way in provide to detect failure if server is not reached at least once
                // so we use a simple timeout that check if the connection was ever open
                // and if not display a message and kill the editor
                // if there has been at least one connection, the provider will try to reconnect on a grace delay will be used
                this.cnxTimer = setTimeout(() => {
                    if (!this.cnxOpen) {
                        this.cnxTimedout = true
                        this.destroyEditor()
                    }
                }, this.cnxTimeout)

                this.provider = new HocuspocusProvider({
                    url: this.sockerserver,
                    name: this.wsData.room,
                    token: this.accessToken,
                    parameters: providerParams,
                    onOpen: () => {
                        this.cnxOpen = true
                        // clear "unconnectable" timeout
                        if (this.cnxTimer) clearTimeout(this.cnxTimer)
                    },
                    onAuthenticationFailed: () => {
                        this.$emit('destroy')
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('multieditor.unauthorized'),
                            type: 'error',
                        })
                    },
                    // it tell us if server is down or not
                    // status is only reliable if we have a working connection
                    onStatus: (event) => {
                        this.status = event.status
                    },

                    onSynced: (event) => {
                        if (event && !this.firstSync) {
                            this.firstSync = true

                            // TODO may skip this since the history is kept by server now
                            // reset history so we can't undo past the initial content (e.g. to an empty content)
                            this.editor.chain().focus('start').clearHistoryWS().run()

                            // set cursor at start of document
                            setTimeout(
                                () =>
                                    this.editor &&
                                    this.editor.commands &&
                                    this.editor.commands.focus('start'),
                                100 // content is not synchronously updated
                            )
                        }
                        this.synced = event
                    },
                })

                // so also listen to client connection status
                window.addEventListener('offline', this.setOffline)
                window.addEventListener('online', this.setOnline)
            }

            const getExtensions = () => {
                let exts = [
                    // Collaborative (socket) use its own history
                    StarterKit.configure({ history: !this.socket }),
                    Link.configure({
                        openOnClick: false,
                    }),
                    TextStyle,
                    Color,
                    // TODO: Check if need history
                    // History,
                    Underline,
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                        alignments: ['left', 'center', 'right'],
                    }),
                    ExternalVideo,
                    Table.configure({
                        resizable: true,
                    }),
                    TableRow,
                    TableHeader,
                    CustomTableCell,
                    CustomImage,
                ]

                if (this.socket) {
                    exts.push(
                        Collaboration.configure({
                            document: toRaw(this.provider.document),
                        })
                    )
                    exts.push(
                        CollaborationCursor.configure({
                            provider: toRaw(this.provider),
                            user: {
                                name: this.user.given_name + ' ' + this.user.family_name,
                                color: this.color,
                                pid: this.user.id,
                                picture: this.user.profile_picture
                                    ? this.user.profile_picture.variations.medium
                                    : null,
                                imageSizes: pictureApiToImageSizes(this.user.profile_picture),
                            },
                        })
                    )
                    exts.push(ClearHistoryWS.configure({}))
                }

                return exts
            }

            const getContent = () => {
                // if it is socket driven
                // add nothing to the socket initially
                // either we'll fetch the socket content if we're not alone
                // or we'll set the content to the original description if we're the first to connect
                if (this.socket) return ''
                // else render previous conetnt
                return this.wsData.originalContent
            }

            if (this.editor) this.destroyEditor()

            this.editor = new Editor({
                content: getContent(),
                extensions: getExtensions(),
                parseOptions: {
                    preserveWhitespace: 'full',
                },
            })
            this.editor.on('update', () => {
                this.$emit('update', this.editor.getHTML())
            })
            this.editor.on('blur', (e) => {
                this.$emit('blur', e)
            })
        },

        setOnline() {
            this.online = true
        },

        setOffline() {
            this.online = false
        },

        handleDisconnection() {
            this.disconnectionGrace = true
            this.disconnectionGraceTimeout = setTimeout(() => {
                this.disconnectionGrace = false
                this.editor.setEditable(false)
            }, DISCONNECTION_GRACE_DURATION)
        },

        handleReconnection() {
            this.disconnectionGrace = true
            this.editor.setEditable(true)
            clearTimeout(this.disconnectionGraceTimeout)
        },

        openLinkModal() {
            this.activeModals.link = true
        },

        openColorModal() {
            this.activeModals.color = true
        },

        openVideoModal() {
            this.activeModals.video = true
        },

        openImageModal() {
            this.activeModals.image = true
        },

        openDestroyModal() {
            this.activeModals.destroy = true
        },

        handleLinkModalConfirmed(data) {
            // set the link if there's data from popup
            if (data) {
                this.editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink({
                        href: (funct.isValidUrl(data.href) ? '' : 'http://') + data.href,
                    })
                    .run()
                // if link made from empty selection, add the entered text as content
                if (data.text) {
                    const selection = this.editor.view.state.selection
                    this.editor
                        .chain()
                        .focus()
                        .insertContentAt(
                            {
                                from: selection.from,
                                to: selection.to,
                            },
                            data.text
                        )
                        .run()
                }
            } else {
                // if there is no data, unset the link
                this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
            }

            this.activeModals.link = false
        },

        handleColorModalConfirmed(data) {
            if (data) {
                this.editor.chain().focus().setColor(data).run()
            } else {
                this.editor.chain().focus().unsetColor().run()
            }

            this.activeModals.link = false
        },

        handleVideoModalConfirmed(data) {
            this.editor.chain().focus().setExternalVideo({ src: data.src }).run()

            this.activeModals.video = false
        },

        handleDestroyModalConfirmed() {
            // reset modification
            this.$emit('update', this.wsData.originalContent)
            this.editor.commands.setContent(this.wsData.originalContent)

            this.activeModals.destroy = false
            this.$emit('destroy')
        },

        handleImageModalConfirmed(img) {
            const attrsw = img.sizeX < 1100 ? img.sizeX : 1100
            const attrsh = img.sizeX < 1100 ? img.sizeY : img.sizeY * (1100 / parseFloat(img.sizeX))

            this.editor
                .chain()
                .focus()
                .setImage({
                    src: img.src,
                    width: attrsw,
                    height: attrsh,
                })
                .run()

            this.activeModals.image = false
        },

        handleImage(img) {
            this.$emit('image', img)
        },

        destroyEditor() {
            if (this.cnxTimer) clearTimeout(this.cnxTimer)
            if (this.editor) {
                this.editor.off('update')
                this.editor.destroy()
            }
            if (this.provider) this.provider.destroy()
        },
    },

    watch: {
        // re-set the cookie when token change
        accessToken: function () {
            funct.setTokenForWS(this.accessToken)
        },

        wsData: function () {
            this.editorInited = false
            // Reinit editor so that changes in wsData props are visible in editor
            this.initEditor()
        },

        onlineAndConnected: function (neo, old) {
            if (this.socket && old !== neo) {
                if (neo) {
                    this.handleReconnection()
                } else {
                    this.handleDisconnection()
                }
            }
        },
        socketReady: {
            handler: function (neo, old) {
                if (this.socket && old !== neo) {
                    this.$emit('socket-ready', neo)
                }
            },
            immediate: true,
        },
    },
}
</script>

<!--SCOPED TO FIX BUG ON DEFAULT EDITOR, UN-SCOPE IF NEEDED LATER-->
<style lang="scss" scoped>
.editor {
    overflow: hidden;
    border-radius: $border-radius-l;
    border: $border-width-s solid $green;
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
        border-bottom: $border-width-s solid $green;
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
    table {
        th {
            background-color: $gray-2;
            padding: $space-s $space-m;
            color: $gray-3;
        }

        td,
        th {
            border: 1px solid $gray-4 !important;
        }
    }

    /* Give a remote user a caret */
    .collaboration-cursor__caret {
        position: relative;
        margin-left: -1px;
        margin-right: -1px;
        border-left: 1px solid $gray-5;
        border-right: 1px solid $gray-5;
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
        line-height: normal;
        user-select: none;
        color: $white;
        padding: 0.1rem 0.3rem;
        border-radius: 3px 3px 3px 0;
        white-space: nowrap;
        opacity: 0.7;
        pointer-events: none;
    }

    .custom-image-small {
        width: 25%;
    }

    .custom-image-medium {
        width: 50%;
    }

    .custom-image-large {
        width: 75%;
    }

    .custom-image-full {
        width: 100%;
    }

    .custom-image-original {
        width: initial;
        max-width: 100%;
    }

    .custom-video-wrapper {
        margin: 0 auto;
        height: 0;
        padding-bottom: 100% * calc(9 / 16);
        position: relative;

        &.custom-video-wrapper-left {
            margin-left: 0;
        }

        &.custom-video-wrapper-right {
            margin-right: 0;
        }

        &::after {
            content: '';
            position: absolute;
            width: 100% !important;
            height: 100% !important;
            z-index: 100;
            inset: 0;
        }
    }

    .ProseMirror-focused .custom-video-wrapper.ProseMirror-selectednode::after {
        color: white;
        font-size: 16px;
        text-align: center;
        padding: 15%;
        background-color: rgb(0 0 0 / 50%);
        pointer-events: none;
        box-sizing: border-box;
    }

    .custom-video {
        position: absolute;
        z-index: 1;
        inset: 0;
        background: black
            url('data:image/gif;base64,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')
            center center no-repeat;
    }

    .custom-video-wrapper-small,
    .custom-video-wrapper-medium,
    .custom-video-wrapper-large,
    .custom-video-wrapper-full {
        .custom-video {
            width: 100% !important;
            height: 100% !important;
        }
    }

    .custom-video-wrapper-small {
        width: 25%;
        padding-bottom: 25% * calc(9 / 16);
    }

    .custom-video-wrapper-medium {
        width: 50%;
        padding-bottom: 50% * calc(9 / 16);
    }

    .custom-video-wrapper-large {
        width: 75%;
        padding-bottom: 75% * calc(9 / 16);
    }

    .custom-video-wrapper-full {
        width: 100%;
        padding-bottom: 100% * calc(9 / 16);
    }

    .custom-video-wrapper.custom-video-wrapper-custom {
        position: relative;
        display: inline-block;
        width: auto;
        padding-bottom: 0;

        .custom-video {
            position: static;
        }
    }

    .not-synced {
        padding: 20px;
    }

    .editor .selectedCell {
        outline: $green dashed 1px;
    }

    .editor * {
        word-break: break-word;
        hyphens: auto;
    }

    .editor table {
        max-width: 100% !important;
        min-width: auto !important;
    }

    .editor th {
        background-color: $gray-1;
        color: $white;
    }

    .editor-frozen .ProseMirror {
        background-color: $gray-6;
    }
}
</style>
