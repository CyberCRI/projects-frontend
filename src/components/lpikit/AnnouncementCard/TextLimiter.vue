<template>
    <div ref="outer" class="outer" :class="{ computing: computing }" :style="style">
        <component :is="tag" ref="inner" class="inner">
            {{ croppedText }}
        </component>
    </div>
</template>
<script>
export default {
    name: 'TextLimiter',

    emits: ['computing', 'computed'],

    props: {
        text: {
            type: String,
            default: '',
        },
        tag: {
            type: String,
            default: 'div',
        },
    },

    data() {
        return {
            computing: true,
            limit: this.text.length,
            croppedText: this.text,
            style: {},
        }
    },

    mounted() {
        this.compute()
    },

    methods: {
        async compute() {
            const _timer = 0
            await new Promise((resolve) => setTimeout(resolve, _timer))
            this.style = {}
            this.$emit('computing')
            this.computing = true
            this.croppedText = this.text + '...'
            this.limit = this.text.length
            const outer = this.$refs.outer.getBoundingClientRect()
            let inner = this.$refs.inner.getBoundingClientRect()
            if (inner.height <= outer.height) {
                this.croppedText = this.text
            }
            await new Promise((resolve) => setTimeout(resolve, _timer))
            while (inner.height > outer.height && this.limit > 0) {
                await new Promise((resolve) => setTimeout(resolve, _timer))
                let ratio = outer.height / inner.height
                this.limit = Math.floor(this.limit * ratio)
                this.limit = this.croppedText.lastIndexOf(' ', this.limit)
                this.croppedText = this.croppedText.substring(0, this.limit)
                if (this.limit > 0) this.croppedText += '...'
                this.$refs.inner.innerText = this.croppedText
                inner = this.$refs.inner.getBoundingClientRect()
            }
            this.style = {
                'flex-basis': `${inner.height}px`,
            }
            this.computing = false
            this.$emit('computed')
        },
    },

    watch: {
        text(neo, old) {
            if (neo != old) this.compute()
        },
    },
}
</script>
<style lang="scss" scoped>
.outer {
    position: relative;
    flex-shrink: 0;
    flex-grow: 0;

    .inner {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 0;
        margin: 0;
    }

    &.computing {
        &.outer {
            flex: 1 1 100%;
        }

        .inner {
            opacity: 0;
        }
    }
}
</style>
