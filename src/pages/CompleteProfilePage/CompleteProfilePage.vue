<template>
    <div class="complete-profile-page page-section-wide">
        <header>
            <h1 class="title">{{ $t('complete-profile.title') }}</h1>
            <p class="notice">
                {{ $t('complete-profile.notice.intro') }}<br />
                {{ $t('complete-profile.notice.help') }}
                <RouterLink class="link" :to="{ name: 'Help' }">{{
                    $t('complete-profile.notice.help')
                }}</RouterLink>
            </p>
        </header>
        <main>
            <ProfileEditBlock>
                <h2 class="section-title">{{ $t('complete-profile.personal.title') }}</h2>
                <div class="two-columns">
                    <div class="column">
                        <label class="field-title"
                            >{{ $t('complete-profile.personal.firstname') }} *</label
                        >
                        <input
                            type="text"
                            :placeholder="$t('complete-profile.personal.firstname-placeholder')"
                        />
                        <label class="field-title"
                            >{{ $t('complete-profile.personal.lastname') }} *</label
                        >
                        <input
                            type="text"
                            :placeholder="$t('complete-profile.personal.lastname-placeholder')"
                        />

                        <label class="field-title"
                            >{{ $t('complete-profile.personal.email') }} *</label
                        >
                        <input
                            type="email"
                            :placeholder="$t('complete-profile.personal.email-placeholder')"
                        />

                        <label class="field-title"
                            >{{ $t('complete-profile.personal.headline') }} *</label
                        >
                        <input
                            type="text"
                            :placeholder="$t('complete-profile.personal.headline-placeholder')"
                        />
                    </div>
                    <div class="column">
                        <div class="picture-block">
                            <div class="preview"></div>
                            <div class="text">
                                <label class="field-title">{{
                                    $t('complete-profile.personal.picture')
                                }}</label>
                                <p class="field-notice">
                                    {{ $t('complete-profile.personal.picture-notice') }}
                                </p>
                                <LpiButton
                                    secondary
                                    no-border
                                    left-icon="Pen"
                                    :label="$t('complete-profile.personal.picture-modify')"
                                ></LpiButton>
                            </div>
                        </div>
                    </div>
                </div>
            </ProfileEditBlock>
            <ProfileEditBlock>
                <h2 class="section-title">{{ $t('complete-profile.skills.title') }}</h2>
                <div class="two-columns">
                    <div class="column">
                        <label class="field-title">{{ $t('complete-profile.skills.sdg') }} *</label>
                        <p class="field-notice">{{ $t('complete-profile.skills.sdg-notice') }}</p>
                    </div>
                    <div class="column">
                        <label class="field-title"
                            >{{ $t('complete-profile.skills.skills') }} *</label
                        >
                        <p class="field-notice">
                            {{ $t('complete-profile.skills.skills-notice') }}
                        </p>
                        <input
                            type="text"
                            :placeholder="$t('complete-profile.skills.skills-placeholder')"
                        />
                    </div>
                </div>
            </ProfileEditBlock>
            <ProfileEditBlock>
                <h2 class="section-title">{{ $t('complete-profile.bio.title') }}</h2>
                <p class="section-notice">
                    {{ $t('complete-profile.bio.notice') }}
                </p>
                <div class="two-columns">
                    <div class="column">
                        <label class="field-title"
                            >{{ $t('complete-profile.bio.short-bio') }}
                        </label>
                        <p class="field-notice">
                            {{ $t('complete-profile.bio.short-bio-notice') }}
                        </p>
                        <textarea
                            rows="2"
                            :placeholder="$t('complete-profile.bio.short-bio-placeholder')"
                        ></textarea>
                        <label class="field-title"
                            >{{ $t('complete-profile.bio.personal-bio') }}
                        </label>
                        <p class="field-notice">
                            {{ $t('complete-profile.bio.personal-bio-notice') }}
                        </p>

                        <textarea
                            rows="8"
                            :placeholder="$t('complete-profile.bio.personal-bio-placeholder')"
                        ></textarea>
                    </div>
                    <div class="column">
                        <label class="field-title"
                            >{{ $t('complete-profile.bio.long-bio') }}
                        </label>
                        <p class="field-notice">
                            {{ $t('complete-profile.bio.long-bio-notice') }}
                        </p>
                        <textarea
                            rows="15"
                            :placeholder="$t('complete-profile.bio.long-bio-placeholder')"
                        ></textarea>
                    </div>
                </div>
            </ProfileEditBlock>
            <ProfileEditBlock>
                <div class="three-columns">
                    <div class="column">
                        <h2 class="section-title">
                            {{ $t('complete-profile.resources.title') }} (0)
                        </h2>
                    </div>
                    <div class="column">
                        <p class="section-notice">{{ $t('complete-profile.resources.notice') }}</p>
                    </div>
                    <div class="column">
                        <LpiButton
                            secondary
                            no-border
                            left-icon="Plus"
                            :label="$t('complete-profile.resources.add')"
                        ></LpiButton>
                    </div>
                </div>
            </ProfileEditBlock>
        </main>
        <footer>
            <LpiButton secondary :label="$t('complete-profile.cancel')"></LpiButton>

            <LpiButton :label="$t('complete-profile.save-and-next')"></LpiButton>
        </footer>
    </div>
</template>
<script>
import ProfileEditBlock from './ProfileEditBlock.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
export default {
    name: 'CompleteProfilePage',
    components: {
        ProfileEditBlock,
        LpiButton,
    },
    data() {
        return {
            user: null,
        }
    },

    async mounted() {
        await this.loadUser()
    },

    methods: {
        async loadUser() {
            try {
                this.user = await getUser(this.$store.getters['users/kid'])
            } catch (error) {
                console.error(error)
            }
        },
    },
}
</script>
<style scoped lang="scss">
.complete-profile-page {
    margin-top: $navbar-height;
}

.title {
    font-size: $font-size-5xl;
    line-height: 1;
    margin-bottom: pxToRem(22px);
}

.notice {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: pxToRem(48px);
}

.link {
    color: $primary-dark;
    text-decoration: underline;
    font-weight: 700;
}

.profile-edit-block + .profile-edit-block {
    margin-top: 2rem;
}

.section-title {
    font-size: $font-size-2xl;
    font-weight: 700;
    margin-bottom: 41px;
}

.section-notice {
    font-size: $font-size-m;
    line-height: 1.5;
    margin-bottom: pxToRem(23px);
}

.two-columns {
    display: flex;
    justify-content: stretch;
    align-items: stretch;

    .column {
        flex-grow: 1;
        flex-basis: 50%;
    }

    .column:first-child {
        padding-right: pxToRem(62px);
        border-right: $border-width-s solid $gray-10;
    }

    .column + .column {
        padding-left: pxToRem(62px);
        border-left: $border-width-s solid $gray-10;
    }
}

.three-columns {
    display: flex;
    gap: pxToRem(130px);
    justify-content: stretch;
    align-items: center;

    .column {
        flex-grow: 1;
        flex-basis: 33.33%;
    }
}

.field-title {
    display: block;
    font-size: $font-size-m;
    font-weight: 700;
    margin-bottom: pxToRem(13px);
}

.field-notice {
    font-size: $font-size-s;
    margin-bottom: pxToRem(13px);
}

input,
textarea {
    display: block;
    width: 100%;
    margin-bottom: pxToRem(21px);
    font-size: 1rem;
    padding: 11px;
    border: $border-width-s solid $gray-10;

    &::placeholder {
        color: $gray-10;
        opacity: 1;
    }
}

.picture-block {
    display: flex;
    justify-content: stretch;
    align-items: center;
    width: 100%;
    gap: 2rem;

    .preview {
        border: 1px solid red;
        width: 10rem;
        height: 10rem;
        flex-basis: 10rem;
        flex-shrink: 0;
    }

    .text {
        flex-grow: 1;
    }
}

footer {
    border-top: $border-width-m solid $gray-10;
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: pxToRem(28px) 0;
    margin-top: pxToRem(74px);
}
</style>
