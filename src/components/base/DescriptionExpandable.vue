<template>
    <div class="outer">
        <template v-if="showLess">
            <div :style="style" class="description description-limited">
                <HtmlLimiter
                    :html="description"
                    :striped-tags="['table']"
                    class="description-content"
                    @computed="layoutComputed"
                    @computing="computeLayout"
                />
            </div>
        </template>
        <div v-else class="description" v-html="description"></div>
        <div class="toggle-ctn" v-if="isLimited">
            <span class="toggle" @click="toggleDescription">
                {{ showLess ? $t('group.see-more') : $t('group.see-less') }}
            </span>
        </div>
    </div>
</template>

<script>
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'
export default {
    name: 'DescriptionExpandable',
    components: { HtmlLimiter },
    props: {
        description: {
            type: String,
            required: true,
        },
        heightLimit: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            showLess: true,
            isLimited: true,
            style: { height: `${this.heightLimit}px` },
        }
    },
    methods: {
        toggleDescription() {
            this.showLess = !this.showLess
        },

        computeLayout() {
            this.style = { height: `${this.heightLimit}px` }
        },
        layoutComputed(event) {
            this.style = { height: event.height + 'px' }
            this.isLimited = event.croppedHtml != this.description
        },
    },
}
</script>

<style lang="scss" scoped>
.description-limited {
    position: relative;
    display: flex;
    flex-flow: column;
}

.outer {
    .toggle {
        color: $primary-dark;
        font-size: $font-size-m;
        cursor: pointer;
        font-weight: 400;
        text-decoration: underline;
    }
}
</style>
