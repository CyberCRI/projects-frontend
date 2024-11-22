<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconImage from '@/components/base/media/IconImage.vue'
import useLanguagesStore from '@/stores/useLanguages'

defineProps({
    skill: { type: Object, required: true },
    type: { type: String, required: true }, // "skills" or "hobbies"
})
defineEmits(['set-level', 'delete'])

const { t } = useI18n()
const languagesStore = useLanguagesStore()

const skillLevels = computed(() =>
    // CAUTION : this must be ordered from lowest to highest (see clampLevel())
    [
        {
            label: t('profile.edit.skills.levels.curious'),
            value: 1,
        },
        {
            label: t('profile.edit.skills.levels.basic'),
            value: 2,
        },
        {
            label: t('profile.edit.skills.levels.competent'),
            value: 3,
        },
        {
            label: t('profile.edit.skills.levels.expert'),
            value: 4,
        },
    ]
)

function skillLabel(skill) {
    return tagLabel(skill.tag)
}

function tagLabel(tag) {
    return tag[`title_${languagesStore.current}`] || tag.title
}

function clampLevel(level) {
    const levels = skillLevels.value
    const min = levels[0].value
    const max = levels[levels.length - 1].value
    return Math.min(Math.max(level, min), max)
}
</script>
<template>
    <div
        class="entry"
        :key="`${skill.id}-${skill.level}`"
        :data-test="`${type}-editor-${skill.id}`"
    >
        <h4 class="skill-name">{{ skillLabel(skill) }}</h4>
        <div class="level-editor">
            <label
                class="level"
                v-for="level in skillLevels"
                @click="$emit('set-level', { skill, level: level.value })"
                :key="level.value"
            >
                <input type="radio" :checked="level.value == clampLevel(skill.level)" />
                <span class="level-name">{{ level.label }}</span>
            </label>
        </div>
        <div class="delete-action">
            <IconImage
                name="TrashCanOutline"
                :data-test="`delete-${type}-${skill.id}`"
                class="delete-icon"
                @click="$emit('delete', skill)"
            />
        </div>
    </div>
</template>
<style scoped lang="scss">
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
</style>
