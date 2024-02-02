<template>
    <div class="profile-edit-privacy" :class="{ frozen: asyncing }">
        <div class="privacy-field">
            <div class="wording">
                <label>{{ $t('profile.edit.privacy.publication-status.label') }}</label>
                <p class="notice">{{ $t('profile.edit.privacy.publication-status.notice') }}</p>
            </div>
            <div class="actions">
                <GroupButton
                    v-model="form.publication_status"
                    :options="groupOptions.publication_status"
                    :has-icon="true"
                    size="default"
                    @update:model-value="save"
                />
            </div>
        </div>

        <!-- picture -->
        <div class="privacy-field">
            <div class="wording">
                <label>{{ $t('profile.edit.privacy.picture.label') }}</label>
                <p class="notice">{{ $t('profile.edit.privacy.picture.notice') }}</p>
            </div>
            <div class="actions">
                <GroupButton
                    v-model="form.profile_picture"
                    :options="groupOptions.profile_picture"
                    :has-icon="true"
                    size="default"
                    @update:model-value="save"
                />
            </div>
        </div>
        <!-- personal mail -->
        <div class="privacy-field">
            <div class="wording">
                <label>{{ $t('profile.edit.privacy.personal-email.label') }}</label>
                <p class="notice">{{ $t('profile.edit.privacy.personal-email.notice') }}</p>
            </div>
            <div class="actions">
                <GroupButton
                    v-model="form.personal_email"
                    :options="groupOptions.personal_email"
                    :has-icon="true"
                    size="default"
                    @update:model-value="save"
                />
            </div>
        </div>

        <!-- personal phone -->
        <div class="privacy-field">
            <div class="wording">
                <label>{{ $t('profile.edit.privacy.personal-phone.label') }}</label>
                <p class="notice">{{ $t('profile.edit.privacy.personal-phone.notice') }}</p>
            </div>
            <div class="actions">
                <GroupButton
                    v-model="form.mobile_phone"
                    :options="groupOptions.mobile_phone"
                    :has-icon="true"
                    size="default"
                    @update:model-value="save"
                />
            </div>
        </div>

        <!-- skills & hobbies  -->
        <div class="privacy-field">
            <div class="wording">
                <label>{{ $t('profile.edit.privacy.skills-hobbies.label') }}</label>
                <p class="notice">{{ $t('profile.edit.privacy.skills-hobbies.notice') }}</p>
            </div>
            <div class="actions">
                <GroupButton
                    v-model="form.skills"
                    :options="groupOptions.skills"
                    :has-icon="true"
                    size="default"
                    @update:model-value="save"
                />
            </div>
        </div>
        <!-- socials -->
        <div class="privacy-field">
            <div class="wording vertical">
                <label>{{ $t('profile.edit.privacy.socials.label') }}</label>
                <p class="notice">{{ $t('profile.edit.privacy.socials.notice') }}</p>
            </div>
            <div class="actions">
                <GroupButton
                    v-model="form.socials"
                    :options="groupOptions.socials"
                    :has-icon="true"
                    size="default"
                    @update:model-value="save"
                />
            </div>
        </div>
        <LoaderSimple v-if="asyncing" class="loader" />
    </div>
</template>
<script>
import GroupButton from '@/components/lpikit/GroupButton/GroupButton.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import { patchUserPrivacy } from '@/api/people.service.ts'
import { getUser } from '@/api/people.service.ts'

function defaultForm() {
    return {
        publication_status: 'pub',
        profile_picture: 'org',
        personal_email: 'hide',
        mobile_phone: 'hide',
        skills: 'hide',
        socials: 'org',
    }
}

function dataMapping() {
    return {
        publication_status: ['publication_status'],
        profile_picture: ['profile_picture'],
        personal_email: ['personal_email'],
        mobile_phone: ['mobile_phone'],
        skills: ['skills'],
        socials: ['socials'],
    }
}

export default {
    name: 'ProfilePrivacyEditTab',

    emits: ['update:modelValue', 'profile-edited'],

    components: {
        GroupButton,
        LoaderSimple,
    },

    props: {
        user: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            form: defaultForm(),
            asyncing: false,
        }
    },

    computed: {
        optionsMap() {
            return {
                hide: {
                    label: this.$t('profile.edit.privacy.options.hide'),
                    iconName: 'EyeSlash',
                    value: 'hide',
                    rank: 0,
                },
                org: {
                    label: this.$t('profile.edit.privacy.options.org'),
                    iconName: 'PeopleGroup',
                    value: 'org',
                    rank: 1,
                },
                pub: {
                    label: this.$t('profile.edit.privacy.options.pub'),
                    iconName: 'Eye',
                    value: 'pub',
                    rank: 2,
                },
            }
        },
        settingsList() {
            return Object.values(this.optionsMap)
                .sort((a, b) => a.rank - b.rank)
                .map((option) => option.value)
        },
        groupOptions() {
            return {
                profile_picture: [this.optionsMap.org, this.optionsMap.pub],
                personal_email: [this.optionsMap.hide, this.optionsMap.org, this.optionsMap.pub],
                mobile_phone: [this.optionsMap.hide, this.optionsMap.org, this.optionsMap.pub],
                skills: [this.optionsMap.hide, this.optionsMap.org, this.optionsMap.pub],
                socials: [this.optionsMap.org, this.optionsMap.pub],
                publication_status: [
                    this.optionsMap.hide,
                    this.optionsMap.org,
                    this.optionsMap.pub,
                ],
            }
        },
    },
    watch: {
        user: {
            handler(neo) {
                if (neo) this.resetForm()
            },
            immediate: true,
        },
    },
    methods: {
        async save() {
            this.asyncing = true
            try {
                const apiData = this.adaptFormToApi()
                await patchUserPrivacy(this.user.id, apiData)

                if (this.user.id === this.$store.getters['users/id'])
                    this.$store.dispatch('users/getUser', this.user.id)
                else getUser(this.user.id)

                this.$emit('profile-edited')

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('profile.edit.privacy.save-success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('profile.edit.privacy.save-error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.asyncing = false
            }
        },
        resetForm() {
            if (this.user) {
                this.form = this.adaptApiToForm(this.user.privacy_settings)
            } else {
                this.form = defaultForm()
            }
        },

        adaptFormToApi() {
            const mapping = dataMapping()
            const apiData = {}

            for (let key in mapping) {
                const targets = mapping[key]
                const value = this.form[key]
                targets.forEach((target) => {
                    apiData[target] = value
                })
            }
            return apiData
        },

        adaptApiToForm(apiSettings) {
            // api is more fine grained than front
            // so we need to adapt it

            const mapping = dataMapping()
            const res = defaultForm()
            for (let key in mapping) {
                const targets = mapping[key]
                const ranks = targets
                    .map((apiSetting) => apiSettings[apiSetting])
                    .map((settingValue) => this.optionsMap[settingValue].rank)
                const minRank = Math.min(...ranks) // use the most private api setting
                const safeRank = Math.max(minRank, this.groupOptions[key][0].rank) // make sure it's not more private than allowed by the field
                res[key] = this.settingsList[safeRank]
            }
            return res
        },
    },
}
</script>

<style scoped lang="scss">
@import './profile-form';

.profile-edit-privacy {
    margin-top: $space-xl;
    position: relative;

    &.frozen {
        pointer-events: none;
        opacity: 0.6;
    }

    .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.privacy-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: $border-width-s solid $gray-10;

    .wording {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: $space-unit;
        padding: $space-l 0;

        &.vertical {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-end;
        }

        &:last-child {
            border-bottom: none;
        }

        label {
            font-size: $font-size-l;
            font-weight: 500;
            line-height: 1;
        }

        .notice {
            font-size: $font-size-m;
            font-weight: 400;
            line-height: 1;
        }
    }

    .actions {
        flex-shrink: 0;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
