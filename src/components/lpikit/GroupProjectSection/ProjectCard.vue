<template>
    <div class="project-card">
        <div class="img-ctn">
            <img :src="require('./challenge-institute.png')" :alt="project.name" />
            <div v-if="project.life_status === 'ongoing'" class="green-dot" />
        </div>

        <div class="content">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-purpose">{{ project.purpose }}</p>
            <p class="category-and-status">{{ categoryAndStatus }}</p>
        </div>

        <MaterialHeart class="heart-icon" />
    </div>
</template>

<script>
import MaterialHeart from '@/components/svgs/material/MaterialHeart.vue'

export default {
    name: 'ProjectCard',

    components: { MaterialHeart },

    props: {
        project: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        categoryAndStatus() {
            return this.project.categories && this.project.categories.length
                ? `${this.project.categories[0].name} • ${this.project.life_status}`
                : this.project.life_status
        },
    },
}
</script>

<style lang="scss" scoped>
.project-card {
    padding: $space-m;
    border: $border-width-s solid $primary;
    border-radius: $border-radius-m;
    position: relative;
    display: flex;

    .img-ctn {
        position: relative;
        width: fit-content;
        margin-right: $space-l;

        img {
            border-radius: $border-radius-s;
            width: 140px;
            object-fit: cover;
            border: $border-width-s solid $primary-dark;
        }

        .green-dot {
            background: $primary;
            border-radius: 50%;
            width: 21px;
            height: 21px;
            position: absolute;
            top: -12px;
            right: -12px;
            border: $border-width-l solid $white;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: $space-m 0;

        .project-name {
            font-size: $font-size-l;
            font-weight: 700;
            margin: 0;
        }

        p {
            margin: 0;
        }

        .category-and-status {
            text-transform: uppercase;
            color: $primary-dark;
            font-weight: 700;
        }
    }

    .heart-icon {
        position: absolute;
        top: $space-m;
        right: $space-m;
        cursor: pointer;
        fill: $primary;
        width: 20px;
        height: 20px;
    }
}
</style>
