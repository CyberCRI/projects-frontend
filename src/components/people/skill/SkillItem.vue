<template>
    <div
        class="skill"
        :class="{ white, 'is-editable': isEditable, editing }"
        @click="setEditing"
        v-click-outside="unsetEditing"
    >
        <span>{{ $filters.capitalize(label) }}</span>

        <div class="extras">
            <div class="edit-actions" v-if="editing">
                <ContextActionButton
                    action-icon="Pen"
                    class="edit-btn small"
                    secondary
                    no-border
                    @click="$emit('edit-skill')"
                />
                <ContextActionButton
                    action-icon="TrashCanOutline"
                    class="edit-btn small"
                    secondary
                    no-border
                    @click="$emit('delete-skill')"
                />
            </div>

            <div v-if="comment" v-show="!editing" class="comment">
                <ToolTip hover placement="top">
                    <template #custom-content>
                        <p class="comment-content">{{ comment }}</p>
                    </template>
                    <IconImage class="comment-icon" name="TextBoxOutline" />
                </ToolTip>
            </div>
            <SkillSteps
                v-show="!editing"
                :white="white"
                :active-step="level"
                :steps="steps"
                class="steps"
            />
        </div>
    </div>
</template>
<script>
import SkillSteps from '@/components/people/skill/SkillSteps.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import ToolTip from '@/components/base/ToolTip.vue'
export default {
    name: 'SkillItem',
    emits: ['edit-skill', 'delete-skill'],
    components: { SkillSteps, ContextActionButton, IconImage, ToolTip },
    props: {
        label: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
        steps: {
            type: Number,
            default: 4,
        },
        white: {
            type: Boolean,
            default: false,
        },
        isEditable: {
            type: Boolean,
            default: false,
        },

        comment: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            editing: false,
        }
    },

    methods: {
        setEditing() {
            if (this.isEditable) {
                this.editing = true
            }
        },
        unsetEditing() {
            this.editing = false
        },
    },
}
</script>
<style lang="scss" scoped>
.skill {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-s;
    border-radius: $border-radius-m;

    span {
        &::first-letter {
            text-transform: capitalize;
        }

        font-size: $font-size-m;
        font-weight: 400;
        color: $black;
    }

    .steps {
        margin: unset;
        flex-grow: unset;
    }

    .extras {
        display: flex;
        align-items: center;
    }

    .comment {
        line-height: 0;
    }

    .comment-content {
        max-width: 20rem;
        padding: 1rem;
        line-height: normal;
    }

    .comment-icon {
        width: 1.2em;
        height: 1.2em;
        fill: $primary-dark;
    }
}

.edit-actions {
    display: flex;
    gap: $space-m;

    --context-action-button-bg-color: transparent;
}

.is-editable {
    cursor: pointer;

    span {
        color: $black;
    }

    &.editing {
        background: $primary-light;

        span {
            color: $black;
        }

        .comment-icon {
            fill: $primary-dark;
        }
    }
}

.white {
    span {
        color: $white;
    }

    .comment-icon {
        fill: $white;
    }
}
</style>
