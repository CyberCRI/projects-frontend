<template>
    <div class="video-container">
        <div
            v-if="video"
            class="custom-video-wrapper custom-video-wrapper-full custom-video-wrapper-center video-player"
        >
            <iframe
                class="custom-video custom-video-full custom-video-center"
                :src="`${videoSrc}`"
                allow="autoplay"
                height="100%"
                width="100%"
            ></iframe>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TheVideoPlayer',

    data() {
        return {
            videos: {
                fr: [
                    {
                        title: 'Tutoriel Projects partie 1',
                        description: 'Description 1',
                        id: '557118437',
                        thumbnail: 'https://i.vimeocdn.com/video/1151481938_640',
                    },
                    {
                        title: 'Tutoriel Projects partie 2',
                        description: 'Description 2',
                        id: '557118584',
                        thumbnail: 'https://i.vimeocdn.com/video/1151482228_640',
                    },
                    {
                        title: 'Tutoriel Projects partie 3',
                        description: 'Description 3',
                        id: '557118498',
                        thumbnail: 'https://i.vimeocdn.com/video/1151482047_640',
                    },
                    {
                        title: 'Tutoriel Projects partie 4',
                        description: 'Description 4',
                        id: '557118551',
                        thumbnail: 'https://i.vimeocdn.com/video/1151482372_640',
                    },
                ],
                en: [
                    {
                        title: 'Projects tutorial part 1',
                        description: 'Description 1 EN',
                        id: '557116523',
                        thumbnail: 'https://i.vimeocdn.com/video/1151477986_640',
                    },
                    {
                        title: 'Projects tutorial part 1.5',
                        description: 'Description 1.5 EN',
                        id: '557116896',
                        thumbnail: 'https://i.vimeocdn.com/video/1151478970_640',
                    },
                    {
                        title: 'Projects tutorial part 2',
                        description: 'Description 2 EN',
                        id: '557116675',
                        thumbnail: 'https://i.vimeocdn.com/video/1151478343_640',
                    },
                    {
                        title: 'Projects tutorial part 3',
                        description: 'Description 3 EN',
                        id: '557116700',
                        thumbnail: 'https://i.vimeocdn.com/video/1151479038_640',
                    },
                ],
            },
            video: null,
        }
    },

    mounted() {
        if (this.videos) {
            this.video = this.videos[this.$store.state.languages.current][0]
        }
    },

    computed: {
        videoSrc() {
            return this.$store.state.languages.current === 'fr'
                ? 'https://www.youtube.com/embed/p5_DaK7CQUI?si=AH_F9MANlsPP_h1l'
                : 'https://www.youtube.com/embed/0DncVa2JWQY?si=RKu3bY4QQiOvnBHk'
        },
    },
}
</script>

<style lang="scss" scoped>
.video-container {
    display: flex;
    padding: 20px 0;
}

.video-player {
    width: 100%;

    iframe {
        width: 100%;
    }
}

.custom-video-wrapper-full {
    padding-bottom: 57.6307363927428%;
}

.video-title {
    margin-bottom: 20px;

    .title {
        display: block;
        font-size: 16px;
        margin-bottom: 0;
        text-transform: uppercase;
    }

    .description {
        font-size: 14px;
    }
}

.video-playlist {
    align-items: flex-start;
    display: flex;
    margin-top: 52px;

    li {
        margin: 10px 0;
    }

    a {
        align-items: center;
        color: black;
        display: flex;
        padding: 10px;

        &.selected {
            background: lightgrey;
        }

        span {
            margin-left: 10px;
        }
    }

    img {
        max-width: 100px;
    }
}
</style>
