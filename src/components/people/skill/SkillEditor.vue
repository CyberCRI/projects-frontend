<script setup>
import { ref, onMounted, computed } from 'vue'
import IconImage from '@/components/base/media/IconImage.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'
import useSkillLevels from '@/composables/useSkillLevels.js'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import EditMentorshipDrawer from '@/components/people/skill/EditMentorshipDrawer.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import ToolTip from '@/components/base/ToolTip.vue'
const props = defineProps({
    skill: { type: Object, required: true },
    type: { type: String, required: true }, // "skills" or "hobbies"
    scrollIntoView: { type: Boolean, default: false },
})
const emit = defineEmits(['set-level', 'update-mentorship', 'delete'])

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

const editMentorship = ref(false)
function onUpdateMentorship(mentorship) {
    emit('update-mentorship', mentorship)
    editMentorship.value = false
}
</script>
<template>
    <div
        class="entry"
        :class="{ 'delay-animation': needDelay }"
        :data-test="`${type}-editor-${skill.id}`"
        ref="el"
    >
        <h4 class="skill-name">
            <span>{{ skillTexts.title(skill) }}</span>

            <div class="edit-action mobile">
                <LpiButton
                    v-if="skill.can_mentor || skill.needs_mentor"
                    secondary
                    @click="editMentorship = true"
                    label=""
                    btn-icon="Pen"
                    class="borderless"
                />
                <span v-else>&nbsp;</span>
            </div>
            <div class="delete-action mobile">
                <IconImage
                    name="TrashCanOutline"
                    :data-test="`delete-${type}-${skill.id}`"
                    class="delete-icon"
                    @click="confirmDelete = true"
                />
            </div>
        </h4>
        <div class="level-editor">
            <label
                class="level"
                :class="{ active: level.value == clampLevel(skill.level) }"
                v-for="level in skillLevels"
                @click.prevent="$emit('set-level', { skill, level: level.value })"
                :key="level.value"
            >
                <input type="radio" :checked="level.value == clampLevel(skill.level)" />
                <span class="level-name">{{ level.label }}</span>
            </label>
        </div>
        <div class="mentorship">
            <LpiButton
                class="squarish"
                v-if="!skill.can_mentor && !skill.needs_mentor"
                secondary
                @click="editMentorship = true"
                :label="$t('profile.edit.skills.mentorship.choose')"
            />

            <ToolTip :content="skill.comment" v-else-if="skill.can_mentor" placement="bottom">
                <LpiButton
                    class="squarish"
                    secondary
                    reversed-order
                    btn-icon="ChatBubble"
                    :label="$t('profile.edit.skills.mentorship.can-mentor')"
                />
            </ToolTip>
            <ToolTip :content="skill.comment" v-else-if="skill.needs_mentor" placement="bottom">
                <LpiButton
                    class="squarish"
                    secondary
                    reversed-order
                    btn-icon="ChatBubble"
                    :label="$t('profile.edit.skills.mentorship.needs-mentor')"
                />
            </ToolTip>
        </div>
        <div class="edit-action desktop">
            <LpiButton
                v-if="skill.can_mentor || skill.needs_mentor"
                secondary
                @click="editMentorship = true"
                label=""
                btn-icon="Pen"
                class="borderless"
            />
            <span v-else>&nbsp;</span>
        </div>
        <div class="delete-action desktop">
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
        <EditMentorshipDrawer
            :is-opened="editMentorship"
            :skill="skill"
            @update-mentorship="onUpdateMentorship"
            @close="editMentorship = false"
        />
    </div>
</template>
<style scoped lang="scss">
.entry {
    display: flex;
    flex-flow: row nowrap;
    justify-content: stretch;
    gap: $space-unit;
    align-items: center;
    border-bottom: $border-width-s solid $lighter-gray;
    padding: $space-l 0;

    @media screen and (max-width: $min-tablet) {
        flex-flow: column nowrap;
        align-items: flex-start;
    }

    &:last-child {
        border-bottom: $border-width-s solid $lighter-gray;
    }

    .skill-name {
        font-weight: 400;
        flex-basis: 30%;
    }

    .level-editor {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: $space-m;
        flex: 1 0 40%;

        .level {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            gap: $space-s;
            margin: 0;
            font-size: $font-size-m;
            border: $border-width-s solid $primary-dark;
            border-radius: $border-radius-s;
            position: relative;
            padding: $space-2xs $space-s;
            cursor: pointer;

            .level-name {
                color: $primary-dark;
                font-weight: 400;
            }

            &.active {
                background-color: $primary-dark;
                cursor: default;

                .level-name {
                    color: $white;
                    font-weight: 700;
                }
            }

            input[type='radio'] {
                visibility: hidden;
                position: absolute;
            }

            /*
            input[type='radio'] {
                appearance: none;
                background-color: $white;
                margin: 0;
                font: inherit;
                width: $layout-size-l;
                height: $layout-size-l;
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
                width: $layout-size-xs;
                height: $layout-size-xs;
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
                */
        }
    }

    .mentorship {
        flex-basis: 30%;
        display: flex;
        gap: $space-unit;
        justify-content: center;
    }

    .delete-action,
    .edit-action {
        flex-basis: $layout-size-l;
        flex-shrink: 0;

        .delete-icon {
            width: $layout-size-l;
            height: $layout-size-l;
            fill: $primary-dark;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
        }

        &.mobile {
            display: none;

            @media screen and (max-width: $min-tablet) {
                display: block;
            }
        }

        &.desktop {
            display: block;

            @media screen and (max-width: $min-tablet) {
                display: none;
            }
        }
    }
}

@media screen and (max-width: $min-tablet) {
    .entry {
        flex-wrap: wrap;

        .skill-name {
            align-self: stretch;
            width: 100%;
            flex-basis: 100%;
            flex-shrink: 0;
            display: flex;
            justify-content: stretch;
            align-items: center;
            gap: $space-unit;

            span {
                flex-grow: 1;
            }
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
