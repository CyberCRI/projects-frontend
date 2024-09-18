<template>
    <div class="link-create">
        <h2 class="title">{{ $t('invitation.create.title') }}</h2>
        <div class="intro">
            <p>
                {{ $t('invitation.create.intro') }}
            </p>
            <p>
                {{ $t('invitation.create.notice') }}
                <RouterLink :to="{ name: 'Help' }" class="help-link">{{
                    $t('invitation.create.link')
                }}</RouterLink>
            </p>
        </div>
        <div class="form">
            <form>
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="label">{{ $t('invitation.create.field.validity.label') }}</h3>
                    </div>
                    <p class="notice">{{ $t('invitation.create.field.validity.notice') }}</p>
                    <div class="">
                        <button type="button" @click="setValidDate" class="validity-type-btn">
                            <IconImage
                                v-if="form.expire_at && validityType == 'pick-date'"
                                class="icon"
                                name="Circle"
                            />
                            <IconImage v-else class="icon" name="CircleOutline" />
                            <IconImage class="icon" name="Calendar" />
                            {{ $t('invitation.create.field.validity.pick-date') }}
                        </button>

                        <button
                            type="button"
                            @click="setValidOneYear"
                            class="validity-type-btn"
                            data-test="one-year"
                        >
                            <IconImage
                                v-if="form.expire_at && validityType == 'one-year'"
                                class="icon"
                                name="Circle"
                            />
                            <IconImage v-else class="icon" name="CircleOutline" />
                            {{ $t('invitation.create.field.validity.one-year') }}
                        </button>
                    </div>
                    <div>
                        <VueDatePicker
                            v-show="showDatePicker"
                            :on-click-outside="() => (showDatePicker = false)"
                            :inline="true"
                            :auto-apply="true"
                            :model-value="form.expire_at"
                            :enable-time-picker="false"
                            @update:model-value="onDateSelected"
                        />
                    </div>

                    <div v-if="form.expire_at" class="selected-validity">
                        <span>{{ $t('invitation.create.field.validity.valid-until') }}</span>
                        <strong>{{ displayDate }}</strong>
                    </div>
                </div>
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="label">{{ $t('invitation.create.field.description.label') }}</h3>
                    </div>
                    <p class="notice">{{ $t('invitation.create.field.description.notice') }}</p>
                    <TextInput
                        input-type="textarea"
                        :placeholder="$t('invitation.create.field.description.placeholder')"
                        v-model="form.description"
                    />
                </div>
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="label">{{ $t('invitation.create.field.group.label') }}</h3>
                        <LinkButton
                            :label="$t('invitation.create.field.group.add')"
                            class="btn"
                            btn-icon="Plus"
                            data-test="add-group"
                            @click="addGroup"
                        />
                    </div>
                    <p class="notice">
                        {{ $t('invitation.create.field.group.notice') }}
                    </p>
                    <div v-if="form.people_group_id" class="selected-group">
                        <span>
                            {{ $t('invitation.create.field.group.selected') }}
                        </span>
                        <GroupCard
                            v-if="selectedGroup"
                            :key="selectedGroup.id"
                            :group="selectedGroup"
                        />
                    </div>
                </div>
                <div class="actions">
                    <LpiButton
                        :label="$t('common.cancel')"
                        class="btn"
                        secondary
                        data-test="cancel-link"
                        @click="cancel"
                    />
                    <LpiButton
                        :disabled="!formNotEmpty || isSaving"
                        :label="$t('common.save')"
                        class="btn"
                        data-test="save-link"
                        @click="save"
                    />
                </div>
            </form>
        </div>
        <GroupSelectDrawer
            :is-opened="showGroupSelectDrawer"
            @close="showGroupSelectDrawer = false"
            @select-group="onGroupSelected"
        />
    </div>
</template>
<script>
import IconImage from '@/components/base/media/IconImage.vue'
import { postInvitation } from '@/api/invitations.service.ts'
import TextInput from '@/components/base/form/TextInput.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import useValidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import GroupSelectDrawer from '@/components/group/GroupSelectDrawer/GroupSelectDrawer.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import useToasterStore from '@/stores/useToaster.ts'
export default {
    name: 'LinkCreateTab',
    components: {
        IconImage,
        LpiButton,
        TextInput,
        VueDatePicker,
        GroupSelectDrawer,
        GroupCard,
        LinkButton,
    },
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

    data() {
        return {
            form: {
                people_group_id: null,
                description: '', // non mandatory but still can't be null for api
                expire_at: null,
            },
            v$: useValidate(),
            isSaving: false,
            validityType: null,
            showDatePicker: false,
            showGroupSelectDrawer: false,
            selectedGroup: null,
        }
    },

    validations() {
        return {
            form: {
                expire_at: {
                    required: helpers.withMessage(
                        this.$t('invitation.create.field.validity.error'),
                        required
                    ),
                },
                people_group_id: {
                    required: helpers.withMessage(
                        this.$t('invitation.create.field.group.error'),
                        required
                    ),
                },
            },
        }
    },
    methods: {
        cancel() {
            this.$router.push({ name: 'linksList' })
        },
        async save() {
            this.isSaving = true
            try {
                await postInvitation(this.$store.state.organizations.current.code, this.form)
                this.toaster.pushSuccess(this.$t('invitation.create.create-success'))

                this.$router.push({ name: 'linksList' })
            } catch (error) {
                this.toaster.pushError(`${this.$t('invitation.create.create-error')} (${error})`)
                console.error(error)
            } finally {
                this.isSaving = false
            }
        },
        addGroup() {
            this.showGroupSelectDrawer = true
        },

        onGroupSelected(group) {
            this.selectedGroup = group
            this.form.people_group_id = group.id
            this.showGroupSelectDrawer = false
        },

        setValidOneYear() {
            this.validityType = 'one-year'
            this.form.expire_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            this.fixDateTime()
        },
        setValidDate() {
            this.validityType = 'pick-date'
            this.showDatePicker = true
        },
        formatDate(isoDate) {
            const date = new Date(isoDate)
            return date.toLocaleDateString(this.$i18n.locale)
        },
        onDateSelected(modelData) {
            this.form.expire_at = modelData
            this.fixDateTime()
            this.showDatePicker = false
        },

        fixDateTime() {
            // make date expire at midnight
            let d = new Date(this.form.expire_at)
            d.setHours(23, 59, 59, 999)
            this.form.expire_at = d.toISOString()
        },
    },
    computed: {
        formNotEmpty() {
            return !!this.form.expire_at && !!this.form.people_group_id
        },
        displayDate() {
            if (this.form.expire_at) {
                return this.formatDate(this.form.expire_at)
            }
            return ''
        },
    },
}
</script>
<style lang="scss" scoped>
.links-tab {
    padding: $space-xl $space-l;
}

.title {
    font-style: normal;
    font-weight: 700;
    font-size: $font-size-5xl;
    line-height: $line-height-tight;
    text-align: center;
    margin-bottom: $font-size-l;
}

.form {
    margin: $space-2xl;

    .form-section {
        padding: $space-2xl 0;

        & + .form-section {
            border-top: $border-width-s solid $light-gray;
        }

        .section-header {
            display: flex;
            padding-bottom: $space-m;
            width: 100%;

            .label {
                flex-grow: 1;
            }

            .lpi-button {
                padding: 0 !important;
            }
        }

        .notice {
            margin: $space-m 0;
        }
    }

    .actions {
        margin-top: $space-3xl;
        display: flex;
        justify-content: center;
        gap: $space-l;
    }
}

.help-link {
    color: $primary-dark;
}

.validity-type-btn {
    padding: $space-s;
    background-color: $white;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-s;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    gap: $space-m;
    color: $primary-dark;
    font-weight: 700;
    cursor: pointer;

    &:hover {
        background-color: $primary-lighter;
    }

    & + .validity-type-btn {
        margin-left: $space-unit;
    }

    .icon {
        width: $font-size-2xl;
        fill: $primary-dark;
    }
}

.selected-validity {
    margin-top: $space-unit;
    display: flex;
    justify-content: center;
    gap: $space-s;
    font-size: $font-size-xl;

    strong {
        font-weight: 700;
    }
}

.selected-group {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-top: $space-unit;
    gap: $space-unit;
}
</style>
