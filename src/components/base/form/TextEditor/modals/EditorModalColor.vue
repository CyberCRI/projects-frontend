<template>
    <DialogModal @close="closeModal" @submit="setColor" :is-small="true">
        <template #header
            >{{
                $filters.capitalize(
                    mode === 'add'
                        ? $t('multieditor.color.set-color')
                        : $t('multieditor.color.change-color')
                )
            }}
        </template>

        <template #body>
            <h5 class="inter-title">{{ $t('multieditor.color.pick') }}</h5>
            <div class="swatches">
                <span
                    class="swatch"
                    v-for="preset in presets"
                    :key="preset"
                    :class="{ selected: preset == color }"
                    :style="{ 'background-color': preset }"
                    @click="color = preset"
                ></span>
            </div>
            <h5 class="inter-title">{{ $t('multieditor.color.choose') }}</h5>
            <div class="pick">
                <input
                    type="color"
                    v-model="color"
                    :class="{ selected: !presets.includes(color) }"
                />
            </div>

            <h5 class="inter-title">{{ $t('multieditor.color.current') }}</h5>
            <div class="current">
                <span class="swatch" :style="{ 'background-color': color }"></span>
            </div>
        </template>

        <template #button-1>{{ $t('common.cancel') }}</template>

        <template #extra-buttons>
            <button
                v-if="mode === 'edit'"
                type="button"
                @click="removeColor"
                class="button-footer button-delete"
                aria-label="delete-button"
                data-test="delete-color-button"
            >
                <span>{{ $t('common.delete') }}</span>
            </button>
        </template>

        <template #button-2>{{ mode === 'add' ? $t('common.add') : $t('common.edit') }}</template>
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'

export default {
    name: 'EditorModalColor',

    emits: ['closeModal'],

    components: { DialogModal },

    data() {
        return {
            color: undefined,
            presets: [
                '#00BDA7', // Carribean green
                '#1D727C', // Ming
                '#99FFE7', // Aquamarine
                '#F0FFFB', // Mint Cream
                '#FF9473', // Light Salmon
                '#FFCC00', // Sun glow
                '#D6A2FF', // Mauve
                '#6CD5FF', // Baby Blue
                '#FF3C00', // Coquelicot
            ],
        }
    },

    props: {
        editor: {
            type: Object,
            required: true,
        },
    },

    mounted() {
        this.color = this.currentColor || '#000000'
    },

    computed: {
        currentColor() {
            return this.editor.getAttributes('textStyle').color
        },
        mode() {
            return this.currentColor !== undefined ? 'edit' : 'add'
        },
    },

    methods: {
        closeModal() {
            this.$emit('closeModal')
        },

        setColor() {
            this.handleColorModalConfirmed(this.color)
        },

        removeColor() {
            this.handleColorModalConfirmed(null)
        },

        handleColorModalConfirmed(data) {
            if (data) {
                this.editor.chain().focus().setColor(data).run()
            } else {
                this.editor.chain().focus().unsetColor().run()
            }

            this.closeModal()
        },
    },
}
</script>

<style lang="scss" scoped>
.button-delete {
    cursor: pointer;
    color: $white;
    background: $salmon;
    margin-left: pxToRem(16px);
    padding: $space-m pxToRem(11px);
    border: $border-width-s solid $primary-dark;
    font-weight: 700;
    border-radius: 24px;
    text-transform: capitalize;

    &:hover {
        color: $white;
        background: $primary-dark;
    }
}

.inter-title {
    text-align: center;
    margin-bottom: $space-m;
    margin-top: $space-xl;
}

.swatches {
    display: flex;
    gap: $space-m;
    justify-content: center;
}

.current,
.pick {
    display: flex;
    justify-content: center;
}

.swatch,
[type='color'] {
    display: inline-block;
    width: $space-xl;
    height: $space-xl;
    border: 2px solid transparent;
    background: none;
    padding: 2px;
    cursor: pointer;
}

[type='color'] {
    width: 54px;
    height: 54px;
}

.selected {
    border: 2px solid black;
}
</style>
