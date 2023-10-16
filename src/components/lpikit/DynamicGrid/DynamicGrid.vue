<template>
    <div ref="grid" class="dynamic-grid" :style="gridStyle">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'DynamicGrid',

    props: {
        minGap: {
            type: Number,
            default: 0,
        },
    },

    data() {
        return {
            columns: 4,
            childWidth: 0,
        }
    },

    mounted() {
        this.computeColumnCount()
        window.addEventListener('resize', this.computeColumnCount)
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.computeColumnCount)
    },

    computed: {
        gridStyle() {
            return {
                'grid-template-columns': `repeat(${this.columns}, ${this.childWidth}px)`,
                gap: `${this.minGap}px`,
            }
        },
    },
    methods: {
        computeColumnCount() {
            const gridWidth = this.$refs.grid?.getBoundingClientRect()?.width
            const childWidth = this.$refs.grid?.children[0]?.getBoundingClientRect()?.width
            if (gridWidth && childWidth) {
                // cols * (childWidth + gap) - gap = gridWidth
                const columns = Math.floor((gridWidth + this.minGap) / (childWidth + this.minGap))
                this.columns = columns > 0 ? columns : 1
                this.childWidth = childWidth
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.dynamic-grid {
    display: grid;
    justify-content: space-between;
}
</style>
