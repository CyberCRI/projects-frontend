<script setup>
import IconImage from '@/components/base/media/IconImage.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'
import useSkillLevels from '@/composables/useSkillLevels.js'

defineProps({
    skill: { type: Object, required: true },
    type: { type: String, required: true }, // "skills" or "hobbies"
})
defineEmits(['set-level', 'delete'])

const skillTexts = useSkillTexts()

const { skillLevels, clampLevel } = useSkillLevels()
</script>
<template>
    <div
        class="entry"
        :key="`${skill.id}-${skill.level}`"
        :data-test="`${type}-editor-${skill.id}`"
    >
        <h4 class="skill-name">{{ skillTexts.title(skill) }}</h4>
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
