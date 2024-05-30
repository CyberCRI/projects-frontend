<template>
    <div class="links-list">
        <h2 class="title">{{ $t('invitation.list.title') }}</h2>
        <div class="intro">
            <div class="notice">
                <p>{{ $t('invitation.list.intro') }}</p>
            </div>
            <div class="action">
                <LinkButton
                    :label="$t('invitation.generate-link')"
                    class="btn btn-create-link"
                    btn-icon="Plus"
                    data-test="create-link"
                    :to="{ name: 'linksCreate' }"
                />
            </div>
        </div>
        <div class="list">
            <table>
                <thead>
                    <tr>
                        <th>
                            {{ $t('invitation.list.group-column') }}
                            <IconImage
                                :name="
                                    sortOn == 'people_group.name' && sortOrder == 'asc'
                                        ? 'MenuUp'
                                        : 'MenuDown'
                                "
                                class="sort-icon"
                                :class="{ active: sortOn == 'people_group.name' }"
                                @click="sortLinks('people_group.name')"
                            />
                        </th>
                        <th>
                            {{ $t('invitation.list.created-by-column') }}
                            <IconImage
                                :name="
                                    sortOn == 'creator' && sortOrder == 'asc'
                                        ? 'MenuUp'
                                        : 'MenuDown'
                                "
                                class="sort-icon"
                                :class="{ active: sortOn == 'creator' }"
                                @click="sortLinks('creator')"
                            />
                        </th>
                        <th>
                            {{ $t('invitation.list.description-column') }}
                        </th>
                        <th>
                            {{ $t('invitation.list.link-column') }}
                        </th>
                        <th>
                            {{ $t('invitation.list.expire-column') }}
                            <IconImage
                                :name="
                                    sortOn == 'expire_at' && sortOrder == 'asc'
                                        ? 'MenuUp'
                                        : 'MenuDown'
                                "
                                class="sort-icon"
                                :class="{ active: sortOn == 'expire_at' }"
                                @click="sortLinks('expire_at')"
                                data-test="sort-expire"
                            />
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td class="loader" colspan="6">
                            <LoaderSimple />
                        </td>
                    </tr>
                    <tr v-else v-for="link in links" :key="link.id">
                        <td>{{ link.people_group.name }}</td>
                        <td>{{ userName(link.owner) }}</td>
                        <td>{{ link.description }}</td>
                        <td>
                            <LinkButton
                                class="btn copy-link"
                                :label="$t('invitation.copy-link')"
                                :data-test="`cpy-link-${link.id}`"
                                @click="copyLink(link.token)"
                            />
                        </td>
                        <td>
                            <BadgeItem
                                class="date-watch"
                                :label="formatDate(link.expire_at)"
                                :colors="dateColor(link.expire_at)"
                            />
                        </td>
                        <td>
                            <LinkButton
                                class="btn"
                                btn-icon="TrashCanOutline"
                                :data-test="`delete-cpy-link-${link.id}`"
                                @click="deleteLink(link.id)"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <ConfirmModal
                v-if="linkToDelete"
                :title="$t('invitation.delete-confirm-title')"
                @cancel="hideConfirmModal"
                @confirm="onDeleteLinkConfirmed"
            ></ConfirmModal>
        </div>
    </div>
</template>
<script>
import { getInvitations, deleteInvitation } from '@/api/invitations.service.ts'
import LinkButton from '@/components/base/button/LinkButton.vue'
import BadgeItem from '@/components/base/BadgeItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
export default {
    name: 'LinksListTab',
    components: {
        LinkButton,
        BadgeItem,
        ConfirmModal,
        IconImage,
        LoaderSimple,
    },

    data() {
        return {
            links: [],
            linkToDelete: null,
            sortOn: 'null',
            sortOrder: 'desc',
            loading: true,
        }
    },
    async mounted() {
        await this.loadInvitations()
    },
    methods: {
        async loadInvitations() {
            this.loading = true
            this.links = (
                await getInvitations(this.$store.state.organizations.current.code)
            ).results
            this.loading = false
        },

        async copyLink(token) {
            let link =
                window.location.origin +
                this.$router.resolve({
                    name: 'Register',
                    params: { token },
                }).href
            try {
                await navigator.clipboard.writeText(link)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('common.link-copied-success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('common.link-copied-failed'),
                    type: 'success',
                })
                console.error('Failed to copy: ', err)
            }
        },
        formatDate(isoDate) {
            const date = new Date(isoDate)
            return date.toLocaleDateString()
        },
        deleteLink(id) {
            this.linkToDelete = id
        },
        hideConfirmModal() {
            this.linkToDelete = null
        },
        async onDeleteLinkConfirmed() {
            let linkId = this.linkToDelete
            this.hideConfirmModal()

            try {
                await deleteInvitation(this.$store.state.organizations.current.code, linkId)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('invitation.delete.delete-success'),
                    type: 'success',
                })
                this.loadInvitations()
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('invitation.delete.deleted-failed')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            }
        },
        dateColor(iso_date) {
            const date = new Date(iso_date)
            const now = new Date()
            const diff = date - now
            if (diff < 0) {
                // expired
                return 'disabled'
            }
            if (diff < 1000 * 60 * 60 * 24 * 7) {
                // less than seven days
                return 'warning'
            }
            return 'ok'
        },
        sortLinks(key) {
            function accessKey(obj, key) {
                return key.split('.').reduce((o, x) => {
                    return o[x]
                }, obj)
            }

            if (this.sortOn == key) {
                this.sortOrder = this.sortOrder == 'asc' ? 'desc' : 'asc'
            } else {
                this.sortOrder = 'desc'
            }
            this.sortOn = key
            this.links.sort((a, b) => {
                if (this.sortOrder == 'asc') {
                    return accessKey(a, key) > accessKey(b, key) ? 1 : -1
                } else {
                    return accessKey(a, key) < accessKey(b, key) ? 1 : -1
                }
            })
        },

        userName(user) {
            return user ? `${user.family_name} ${user.given_name}` : '???'
        },
    },
}
</script>
<style lang="scss" scoped>
.title {
    font-style: normal;
    font-weight: 700;
    font-size: $font-size-5xl;
    line-height: 1.2;
    text-align: center;
    margin-bottom: $font-size-l;
}

.intro {
    display: flex;
    gap: $space-l;

    .action {
        flex-grow: 1;
    }
}

.list {
    margin-top: $space-2xl;
}

.copy-link {
    padding: 0 !important;
}

table {
    width: 100%;
    border-collapse: unset;
    border: 1px solid #00dba7;
    border-radius: 8px;
    overflow: hidden;

    thead {
        background-color: $primary-lighter;

        tr th {
            border-bottom: 1px solid $green;
        }
    }

    tbody {
        tr {
            &:not(:last-child) {
                td {
                    border-bottom: 1px solid $green;
                }
            }
        }
    }

    td,
    th {
        padding: $space-unit;
        vertical-align: middle;
        text-align: left;
        white-space: nowrap;
    }

    .loader {
        padding: $space-2xl;
        text-align: center;

        svg {
            display: inline-block;
            margin: 0 auto;
        }
    }
}

.btn-create-link {
    white-space: nowrap;
}

.sort-icon {
    fill: $black;
    width: $font-size-m;
    display: inline-block;
    cursor: pointer;

    &.active {
        fill: $green;
    }
}
</style>
