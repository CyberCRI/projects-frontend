<template>
    <div class="instruction-item">
        <div class="instruction-title-ctn">
            <h3 class="instruction-title">{{ instruction.title }}</h3>
            <div class="instruction-actions" v-if="canEditInstruction || canDeleteInstruction">
                <ContextActionButton
                    action-icon="Pen"
                    class="edit-btn small"
                    @click="$emit('edit-instruction', instruction)"
                    v-if="canEditInstruction"
                />
                <ContextActionButton
                    action-icon="Close"
                    class="remove-btn small"
                    @click="$emit('delete-instruction', instruction)"
                    v-if="canDeleteInstruction"
                />
            </div>
        </div>
        <div class="instruction-excerpt" :style="style">
            <HtmlLimiter
                :html="instruction.content"
                :striped-tags="['table']"
                class="description-content"
                @computed="layoutComputed"
                @computing="computeLayout"
            />
        </div>
    </div>
</template>
<script>
import ContextActionButton from '@/components/lpikit/LpiButton/ContextActionButton.vue'
import HtmlLimiter from '@/components/lpikit/AnnouncementCard/HtmlLimiter.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'InstructionItem',

    mixins: [permissions],

    emits: ['delete-instruction', 'edit-instruction'],

    components: {
        HtmlLimiter,
        ContextActionButton,
    },

    props: {
        instruction: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            style: {},
        }
    },

    methods: {
        computeLayout() {
            this.style = {}
        },
        layoutComputed(event) {
            this.style = { height: event.height + 'px' }
        },
    },
}
</script>
<style scoped lang="scss">
.instruction-item {
    --instruction-dimension: 15rem;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
    height: var(--instruction-dimension);
    overflow: hidden;
}

.instruction-title-ctn {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.instruction-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.instruction-title {
    font-size: $font-size-xl;
}

.instruction-excerpt {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-flow: column;

    h1 {
        font-size: $font-size-2xl;
        font-weight: 700;
    }

    h2 {
        font-size: $font-size-xl;
        font-weight: 500;
    }

    h3 {
        font-size: $font-size-l;
        font-weight: 500;
    }

    h4 {
        font-size: $font-size-m;
        font-weight: 500;
    }
}

.read-more-ctn {
    flex-shrink: 0;
    padding: 1rem 0;

    .read-button {
        width: min-content;
        padding-left: 0;
    }
}
</style>
