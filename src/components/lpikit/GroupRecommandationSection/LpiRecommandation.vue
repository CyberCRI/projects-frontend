<template>
    <div class="recommandation">
        <div class="img-ctn">
            <img :src="recommandation.image" :alt="recommandation.name" />

            <div v-if="recommandation.type === 'group'" class="user-quantity">
                <span>{{ recommandation.usersQuantity }}</span>
                <IconImage name="Account" />
            </div>
        </div>

        <div class="name">{{ recommandation.name }}</div>

        <div class="description">{{ description }}</div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'LpiRecommandation',

    components: { IconImage },

    props: {
        recommandation: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        description() {
            return this.recommandation.type === 'group'
                ? this.recommandation.description
                : this.recommandation.job
        },
    },
}
</script>

<style lang="scss" scoped>
.recommandation {
    color: $white;
    display: flex;
    flex-direction: column;
    align-items: center;

    .img-ctn {
        position: relative;
        margin-bottom: $space-m;

        img {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            object-fit: cover;
        }

        .user-quantity {
            display: flex;
            align-items: center;
            background: $white;
            width: fit-content;
            height: 18px;
            padding: $space-3xs $space-2xs;
            border-radius: $border-radius-l;
            position: absolute;
            bottom: -9px;
            left: 50%;
            transform: translateX(-50%);

            span {
                color: $primary-dark;
                font-size: $font-size-2xs;
                font-weight: 700;
            }

            svg {
                fill: $primary-dark;
                width: 12px;
                height: 12px;
            }
        }
    }

    .name {
        font-weight: 700;
    }

    .description {
        text-align: center;
        font-size: $font-size-s;
        font-weight: 400;
    }
}
</style>
