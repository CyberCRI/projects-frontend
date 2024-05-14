<template>
    <div class="instruction-item">
        <div class="instruction-title-ctn">
            <h3 class="instruction-title">{{ instruction.title }}</h3>

            <ContextActionMenu
                class="instruction-actions"
                @edit="$emit('edit-instruction', instruction)"
                :can-edit="canEditInstruction"
                @delete="$emit('delete-instruction', instruction)"
                :can-delete="canDeleteInstruction"
            />
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
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'
import permissions from '@/mixins/permissions.ts'
import ContextActionMenu from '@/components/lpikit/ContextActionMenu/ContextActionMenu.vue'

export default {
    name: 'InstructionItem',

    mixins: [permissions],

    emits: ['delete-instruction', 'edit-instruction'],

    components: {
        HtmlLimiter,
        ContextActionMenu,
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

.instruction-title {
    font-size: $font-size-xl;
    color: $primary-dark;
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

    * {
        color: $primary-dark !important;
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
