<script setup>
import { ref, onMounted, computed } from 'vue'
import IconImage from '@/components/base/media/IconImage.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'
import useSkillLevels from '@/composables/useSkillLevels.js'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'

const props = defineProps({
    skill: { type: Object, required: true },
    type: { type: String, required: true }, // "skills" or "hobbies"
    scrollIntoView: { type: Boolean, default: false },
})
const emit = defineEmits(['set-level', 'delete'])

const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect()
    const { innerHeight, innerWidth } = window
    return partiallyVisible
        ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
              ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
        : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth
}

const el = ref(null)
const needDelay = computed(
    () => props.scrollIntoView && el.value && !elementIsVisibleInViewport(el.value, true)
)
onMounted(() => {
    if (props.scrollIntoView) {
        el.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
})

const skillTexts = useSkillTexts()

const { skillLevels, clampLevel } = useSkillLevels()

const confirmDelete = ref(false)
const asyncing = ref(false)
function deleteSkill() {
    asyncing.value = true
    emit('delete', props.skill)
}
</script>
<template>
    <div
        class="entry"
        :class="{ 'delay-animation': needDelay }"
        :data-test="`${type}-editor-${skill.id}`"
        ref="el"
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
                @click="confirmDelete = true"
            />
        </div>
        <ConfirmModal
            v-if="confirmDelete"
            :title="$t('common.confirm-delete')"
            content=""
            cancel-button-label="common.no"
            confirm-button-label="common.yes"
            :asyncing="asyncing"
            @cancel="confirmDelete = false"
            @confirm="deleteSkill"
        />
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
            font-size: $font-size-m;

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

@media screen and (max-width: $min-tablet) {
    .entry {
        flex-wrap: wrap;

        .skill-name {
            flex-basis: 100%;
            flex-shrink: 0;
        }
    }
}

@media screen and (max-width: $max-mobile) {
    .entry {
        flex-direction: column;

        .level-editor {
            flex-direction: column;
            align-items: flex-start;
        }
    }
}

/* see TransitionGroup in ProfileSkillsEditTab */

.skill-move {
    transform: 0.4s ease-in-out;
}

.skill-enter-active {
    &.delay-animation {
        // in effect: block transition until elemet has scrolled in view
        transition-delay: 0.4s;
    }

    transition: transform 0.4s 0s ease-in-out;
}

.skill-enter-from {
    transform: translateX(-100%);
}

.skill-leave-active {
    transition:
        opacity 0.4s ease-in-out,
        transform 0.4s 0.2s ease-in-out;

    .level-editor,
    .delete-action {
        visibility: hidden;
    }
}

.skill-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>
