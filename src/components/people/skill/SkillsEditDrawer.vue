<template>
    <BaseDrawer
        :confirm-action-disabled="asyncing"
        :confirm-action-name="
            selection && selection.length
                ? $t(`profile.edit.skills.${type}.drawer.${mode}.confirm`)
                : $t(`profile.edit.skills.${type}.drawer.edit.confirm`)
        "
        :is-opened="isOpen"
        :title="$t(`profile.edit.skills.${type}.drawer.${mode}.title`)"
        class="medium"
        @close="$emit('close')"
        @confirm="confirm"
    >
        <div class="add-skill-mode" v-if="mode == 'add'">
            <div class="selected-list no-shrink">
                <FilterValue
                    v-for="skill in selection"
                    :key="skill.tag.id"
                    :label="skillLabel(skill)"
                    icon="Close"
                    type="actionable"
                    @click="removeFromSelection(skill)"
                />
            </div>
            <div class="section">
                <p class="notice">{{ $t('search.pick-skill-classification') }}</p>

                <LpiSelect v-model="selectedClassificationId" :options="orgClassificationOptions" />
            </div>
            <div v-if="suggestedTags.length" class="section">
                <SuggestedTags
                    :current-tags="selectionAsTags"
                    :suggested-tags="suggestedTags"
                    @add-tag="addToSelection"
                    :loading="suggestedTagsisLoading"
                />
            </div>
            <div v-show="showTagSearch">
                <p class="notice">{{ $t(`profile.edit.skills.${type}.drawer.add.notice`) }}</p>
                <div class="search-field no-shrink">
                    <SearchInput
                        v-model="search"
                        @delete-query="onDeleteQuery"
                        @enter="doSearch"
                        :suggestions="suggestions"
                        @keyup="suggest"
                        :placeholder="$t(`profile.edit.skills.${type}.drawer.add.placeholder`)"
                    />
                    <LpiButton :label="$t(`profile.edit.skills.search`)" @click="doSearch" />
                </div>
            </div>
            <p v-if="confirmedSearch" class="notice no-shrink">
                {{ $t('search.choose-skill') }}
            </p>
            <TagResults
                class="flexed-search-results-ctn custom-scrollbar"
                v-if="confirmedSearch"
                :classification-id="selectedClassificationId"
                :existing-tags="selectionAsTags"
                inline
                :search="confirmedSearch"
                @add-tag="addToSelection"
            />
        </div>
        <div class="edit-skill-mode" v-else-if="mode == 'edit'">
            <p class="notice">
                {{ $t(`profile.edit.skills.${type}.drawer.edit.notice`) }}

                <SkillLevelTip>
                    <a href="#" class="help-link">
                        <IconImage name="HelpCircle" class="help-icon" />
                        {{ $t(`profile.edit.skills.${type}.drawer.edit.help`) }}
                    </a>
                </SkillLevelTip>
            </p>
            <div class="level-editor-list">
                <div class="entry" v-for="skill in selection" :key="skill.tag.id">
                    <h4 class="skill-name">{{ skillLabel(skill) }}</h4>
                    <div class="level-editor">
                        <label
                            class="level"
                            v-for="level in skillLevels"
                            @click="setSkillLevel(skill, level.value)"
                            :key="level.value"
                        >
                            <input type="radio" :checked="level.value == clampLevel(skill.level)" />
                            <span class="level-name">{{ level.label }}</span>
                        </label>
                    </div>
                    <div class="delete-action">
                        <IconImage
                            name="TrashCanOutline"
                            class="delete-icon"
                            @click="removeFromSelection(skill)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import TagResults from '@/components/search/FilterTags/TagResults.vue'
import { toRaw } from 'vue'
import { postUserSkill, patchUserSkill, deleteUserSkill } from '@/api/people.service.ts'
import isEqual from 'lodash.isequal'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useLanguagesStore from '@/stores/useLanguages'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import useTagSearch from '@/composables/useTagSearch.js'
import SuggestedTags from '@/components/search/FilterTags/SuggestedTags.vue'
export default {
    name: 'SkillsEditDrawer',

    emits: ['close', 'switch-mode', 'confirm', 'skills-updated'],

    inject: {
        reloadUser: {
            from: 'profileEditReloadUser',
            default: () => () => {},
        },
    },
    setup() {
        const toaster = useToasterStore()
        const languagesStore = useLanguagesStore()
        return {
            toaster,
            languagesStore,
            ...useTagSearch({ useSkills: true }),
        }
    },

    components: {
        BaseDrawer,
        IconImage,
        SearchInput,
        FilterValue,
        TagResults,
        SkillLevelTip,
        LpiButton,
        LpiSelect,
        SuggestedTags,
    },

    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String, // skills | hobbies
            required: true,
        },
        mode: {
            type: String, // add | edit
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            confirmedSearch: '',
            selection: [],
            asyncing: false,
        }
    },
    computed: {
        skillLevels() {
            // CAUTION : this must be ordered from lowest to highest (see clampLevel())
            return [
                {
                    label: this.$t('profile.edit.skills.levels.curious'),
                    value: 1,
                },
                {
                    label: this.$t('profile.edit.skills.levels.basic'),
                    value: 2,
                },
                {
                    label: this.$t('profile.edit.skills.levels.competent'),
                    value: 3,
                },
                {
                    label: this.$t('profile.edit.skills.levels.expert'),
                    value: 4,
                },
            ]
        },
        selectionAsTags() {
            return this.selection.map((s) => s.tag)
        },
        allSkills() {
            return this.user.skills || []
        },
        skills() {
            return this.allSkills.filter((s) => s.type === 'skill')
        },
        hobbies() {
            return this.allSkills.filter((s) => s.type === 'hobby')
        },
    },
    watch: {
        isOpen(neo) {
            if (neo) {
                this.search = ''
                this.confirmedSearch = ''
                this.selection = this.getSkillOfType(this.type)
                    ? this.getSkillOfType(this.type).map((item) => ({ ...toRaw(item) }))
                    : []
                this.$nextTick(this.focusInput)
            }
        },
    },
    methods: {
        getSkillOfType(type) {
            if (type == 'skills') return this.skills
            else return this.hobbies
        },
        focusInput() {
            const searchInput = this.$el.querySelector('.search-field input')
            this.$nextTick(() => {
                searchInput?.focus()
            })
        },

        doSearch() {
            this.suggestions = []
            this.confirmedSearch = this.search
        },

        onDeleteQuery() {
            this.search = ''
            this.confirmedSearch = ''
        },

        clampLevel(level) {
            return Math.min(
                Math.max(level, this.skillLevels[0].value),
                this.skillLevels[this.skillLevels.length - 1].value
            )
        },
        async confirm() {
            if (this.mode === 'add') {
                if (this.selection && this.selection.length) this.$emit('switch-mode', 'edit')
                else this.save() // no selection just delete everything and close
            } else {
                this.save()
            }
        },

        async save() {
            // save selection
            this.asyncing = true

            // talents to add don't have id yet
            const talentsToAdd = this.selection.filter((s) => !s.id)

            const selectionMap = this.selection.reduce((acc, talent) => {
                if (talent.id) acc[talent.id] = toRaw(talent)
                return acc
            }, {})

            // talents to delete are in the user but not in the selection
            const talentsToDelete = []
            // talents to update are in the user and in the selection but have different values
            const talentsToUpdate = []
            // filter talents to delete and update
            this.getSkillOfType(this.type).forEach((talent) => {
                const rawTalent = toRaw(talent)
                const selectedTalent = selectionMap[rawTalent.id]
                if (selectedTalent) {
                    if (!isEqual(rawTalent, selectedTalent)) {
                        talentsToUpdate.push(selectedTalent)
                    }
                } else {
                    talentsToDelete.push(rawTalent)
                }
            })

            let errorDuringSave = false
            // do needed api requests
            try {
                await Promise.all(
                    talentsToDelete.map((talent) => {
                        return deleteUserSkill(talent.id)
                    })
                )
            } catch (error) {
                errorDuringSave = true
                this.toaster.pushError(`${this.$t('profile.edit.skills.save-error')} (${error})`)
                console.error(error)
            }
            try {
                await Promise.all(
                    talentsToAdd.map((talent) => {
                        return postUserSkill({
                            ...talent,
                            tag: talent.tag.id,
                        })
                    })
                )
            } catch (error) {
                errorDuringSave = true
                if (error.response.status === 409) {
                    this.toaster.pushError(
                        `${this.$t(`profile.edit.skills.${this.type}.already-added`)}`
                    )
                } else {
                    this.toaster.pushError(
                        `${this.$t('profile.edit.skills.save-error')} (${error})`
                    )
                }
            }
            try {
                await Promise.all(
                    talentsToUpdate.map((talent) => {
                        return patchUserSkill(talent.id, {
                            ...talent,
                            tag: talent.tag.id,
                        })
                    })
                )
            } catch (error) {
                errorDuringSave = true
                this.toaster.pushError(`${this.$t('profile.edit.skills.save-error')} (${error})`)
                console.error(error)
            }

            // reload user
            this.reloadUser()
            // confirm success
            if (!errorDuringSave) {
                this.$emit('skills-updated')
                this.toaster.pushSuccess(this.$t('profile.edit.skills.save-success'))
            }
            this.asyncing = false
            this.$emit('close')
        },
        removeFromSelection(skill) {
            this.selection = this.selection.filter((s) => s.tag.id !== skill.tag.id)
        },
        addToSelection(tag) {
            const skill = {
                tag: tag,
                level: 1,
                level_to_reach: 1,
                type: this.type == 'hobbies' ? 'hobby' : 'skill',
                category: '', // TODO: check what this is
                user: this.user.id,
            }
            this.selection = [...this.selection, skill]
        },
        setSkillLevel(skill, level) {
            skill.level = level
        },

        skillLabel(skill) {
            return this.tagLabel(skill.tag)
        },

        tagLabel(tag) {
            return tag[`title_${this.languagesStore.current}`] || tag.title
        },
    },
}
</script>
<style lang="scss" scoped>
.no-shrink {
    flex-shrink: 0;
}

.add-skill-mode {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;

    .notice {
        font-size: $font-size-s;
        margin-bottom: $space-s;
    }

    .selected-list {
        margin-top: $space-m;
        display: flex;
        flex-flow: row wrap;
        gap: $space-m;
    }

    .search-field {
        margin-top: $space-m;
        display: flex;
        justify-content: stretch;
        align-items: center;
        gap: 1rem;

        .search-input-ctn {
            flex-grow: 1;

            :deep(.search-input) {
                width: 100%;
            }
        }
    }

    .flexed-search-results {
        overflow: auto;
    }

    .search-results {
        margin-top: $space-42;
        display: flex;
        flex-flow: row wrap;
        gap: $space-s;
        background-color: $primary-lighter;
        border-radius: $space-s;
        padding: $space-s;
    }

    .loader {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: $space-xl;
    }
}

.edit-skill-mode {
    .notice {
        margin-top: $space-m;
    }

    .level-editor-list {
        margin-top: $space-xl;

        .entry {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            gap: $space-unit;
            align-items: center;
            border-top: $border-width-s solid $lighter-gray;
            padding: $space-l 0;

            &:last-child {
                border-bottom: $border-width-s solid $lighter-gray;
            }

            .skill-name {
                font-weight: 700;
            }

            .level-editor {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-end;
                align-items: center;
                gap: $space-m;
                flex-shrink: 0;
                flex-grow: 1;

                .level {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    gap: $space-s;
                    margin: 0;
                    font-size: 1rem;

                    input[type='radio'] {
                        appearance: none;
                        background-color: $white;
                        margin: 0;
                        font: inherit;
                        width: $font-size-l;
                        height: $font-size-l;
                        border: $border-width-s solid $primary-dark;
                        border-radius: 100%;
                        transform: translateY(-0.075em);
                        display: inline-block;
                        position: relative;
                        cursor: pointer;
                    }

                    input[type='radio']::before {
                        content: '';
                        display: inline-block;
                        width: $font-size-xs;
                        height: $font-size-xs;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) scale(0);
                        transition: 120ms transform ease-in-out;
                        box-shadow: inset 1em 1em $primary-dark;
                        border-radius: 100%;
                    }

                    input[type='radio']:checked::before {
                        transform: translate(-50%, -50%) scale(1);
                    }

                    .level-name {
                        color: $primary-dark;
                        font-weight: 700;
                    }
                }
            }

            .delete-action {
                padding: 0 $space-m;
                flex-shrink: 0;

                .delete-icon {
                    width: $font-size-l;
                    height: $font-size-l;
                    fill: $primary-dark;
                    display: inline-block;
                    vertical-align: middle;
                    cursor: pointer;
                }
            }
        }
    }

    .help-link {
        color: $primary-dark;
        text-decoration: underline;
        font-weight: 700;
    }

    .help-icon {
        width: $font-size-l;
        height: $font-size-l;
        fill: $primary-dark;
        display: inline-block;
        vertical-align: middle;
    }
}
</style>
