<template>
    <div ref="grid" class="dynamic-grid" :style="gridStyle">
        <slot></slot>
    </div>
</template>
<script>
import throttle from 'lodash/throttle'
export default {
    name: 'DynamicGrid',

    props: {
        minGap: {
            type: Number,
            default: 0,
        },
    },

    data() {
        /*
            we need one instance of the function per instance of the component
            because other throttle will act globally (ie one throttle for all instances)
            and so create a mess when we have multiple instances of the component in the same page
        */
        const _computeColumnCount = () => {
            const gridWidth = this.$refs.grid?.getBoundingClientRect()?.width
            const childWidth = this.$refs.grid?.children[0]?.getBoundingClientRect()?.width
            if (gridWidth && childWidth) {
                // the maths : cols * (childWidth + gap) - gap = gridWidth
                const columns = Math.floor((gridWidth + this.minGap) / (childWidth + this.minGap))
                this.columns = columns > 0 ? columns : 1
                this.childWidth = childWidth
            }
        }
        return {
            columns: 4,
            childWidth: 0,
            computeColumnCount: throttle(_computeColumnCount, 50),
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
}
</script>
<style lang="scss" scoped>
.dynamic-grid {
    display: grid;
    justify-content: space-between;
}
</style>
