<template>
    <div v-if="verifyingLink" class="loader">
        <LoaderSimple />
    </div>
    <div v-else>
        <div v-if="!isLinkValid" class="link-expired">
            <div>
                <h1 class="title">
                    {{ $t('page404.title') }}
                </h1>
                <p class="extra-informations">
                    {{ $t('invitation.expired-link') }}
                    <a :href="`mailto:${contactEmail}`">
                        {{ contactEmail }}
                    </a>
                </p>
                <div
                    class="illustration"
                    :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
                >
                    <p class="expired-text">
                        {{ $t('invitation.expired-link-image') }}
                    </p>
                </div>
            </div>
        </div>
        <div v-else>
            <SignUpWrapper
                :sign-up-title="confirm ? $t('register.title-confirm') : $t('register.title')"
            >
                <transition name="fade" mode="out-in">
                    <div class="confirm-message" v-if="confirm">
                        <i18n-t keypath="register.confirmation" tag="p">
                            <strong>{{ form.email }}</strong>
                        </i18n-t>
                    </div>
                    <div class="form" v-else>
                        <div class="form-group">
                            <TextInput
                                v-model="form.given_name"
                                :label="$t('register.given_name.label')"
                                :placeholder="$t('register.given_name.placeholder')"
                                @blur="v$.form.given_name.$validate"
                                data-test="first-name"
                            />
                            <p
                                v-for="error of v$.form.given_name.$errors"
                                :key="error.$uid"
                                class="error-message"
                            >
                                {{ error.$message }}
                            </p>
                        </div>
                        <div class="form-group">
                            <TextInput
                                v-model="form.family_name"
                                :label="$t('register.family_name.label')"
                                :placeholder="$t('register.family_name.placeholder')"
                                @blur="v$.form.family_name.$validate"
                                data-test="last-name"
                            />
                            <p
                                v-for="error of v$.form.family_name.$errors"
                                :key="error.$uid"
                                class="error-message"
                            >
                                {{ error.$message }}
                            </p>
                        </div>
                        <div class="form-group">
                            <TextInput
                                v-model="form.email"
                                :label="$t('register.email.label')"
                                input-type="email"
                                :placeholder="$t('register.email.placeholder')"
                                @blur="v$.form.email.$validate"
                                data-test="email"
                            />
                            <p
                                v-for="error of v$.form.email.$errors"
                                :key="error.$uid"
                                class="error-message"
                            >
                                {{ error.$message }}
                            </p>
                        </div>
                        <div class="form-group">
                            <TextInput
                                input-type="password"
                                v-model="form.password"
                                :label="$t('register.password.label')"
                                :placeholder="$t('register.password.placeholder')"
                                @blur="v$.form.password.$validate"
                                data-test="password"
                            />
                            <p
                                v-for="error of v$.form.password.$errors"
                                :key="error.$uid"
                                class="error-message"
                            >
                                {{ error.$message }}
                            </p>
                        </div>
                        <div class="action">
                            <LpiButton
                                :disabled="v$.form.$error || asyncing"
                                @click="register"
                                :label="$t('common.confirm')"
                                :btn-icon="asyncing ? 'LoaderSimple' : null"
                                class="register-btn"
                                data-test="register-btn"
                            />
                            <i18n-t keypath="register.tos" tag="p" class="tos">
                                <template #term>
                                    <router-link to="/terms-of-service" class="link"
                                        >{{ $t('register.term') }}
                                    </router-link>
                                </template>

                                <template #privacy>
                                    <router-link to="/personal-data" class="link"
                                        >{{ $t('register.privacy') }}
                                    </router-link>
                                </template>
                            </i18n-t>
                        </div>
                    </div>
                </transition>
                <template #post-box>
                    <div class="extra-links" :class="{ 'is-confirm': confirm }">
                        <p v-if="!confirm" class="extra-link extra-login">
                            {{ $t('register.have-account') }}
                            <a href="#" @click.prevent="login" class="link">{{
                                $t('register.login')
                            }}</a>
                        </p>
                        <p class="extra-link extra-help">
                            {{ $t('register.need-help') }}
                            <a href="#" @click.prevent="showContactUsDrawer = true" class="link">{{
                                $t('register.contact-us')
                            }}</a>
                        </p>
                    </div>
                </template>
            </SignUpWrapper>
        </div>
    </div>

    <ContactDrawer :is-opened="showContactUsDrawer" @close="closeDrawer" />
</template>
<script>
import useVuelidate from '@vuelidate/core'
import { postUserWithInvitation } from '@/api/people.service.ts'
import { helpers, required, email } from '@vuelidate/validators'
import { imageSizesFormDataPost } from '@/functs/imageSizesUtils.ts'
import imageMixin from '@/mixins/imageMixin.ts'
import utils from '@/functs/functions.ts'
import TextInput from '@/components/base/form/TextInput.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import ContactDrawer from '@/components/app/ContactDrawer.vue'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import { getInvitation } from '@/api/invitations.service'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import SignUpWrapper from '@/components/app/SignUpWrapper.vue'
export default {
    name: 'RegisterPage',

    mixins: [imageMixin],

    components: {
        TextInput,
        LpiButton,
        ContactDrawer,
        LoaderSimple,
        SignUpWrapper,
    },

    props: {
        token: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            form: {
                email: '',
                given_name: '',
                family_name: '',
                password: '',
                profile_picture: '',
            },
            asyncing: false,
            confirm: false,
            currentPatatoidIndex: 1,
            v$: useVuelidate(),
            showContactUsDrawer: false,
            isLinkValid: false,
            contactEmail: '',
            verifyingLink: true,
        }
    },

    validations() {
        return {
            form: {
                email: {
                    required: helpers.withMessage(this.$t('register.email.is-required'), required),
                    email: helpers.withMessage(this.$t('register.email.is-invalid'), email),
                },
                given_name: {
                    required: helpers.withMessage(
                        this.$t('register.given_name.is-required'),
                        required
                    ),
                },
                family_name: {
                    required: helpers.withMessage(
                        this.$t('register.family_name.is-required'),
                        required
                    ),
                },
                password: {
                    required: helpers.withMessage(
                        this.$t('register.password.is-required'),
                        required
                    ),
                },
            },
        }
    },
    async mounted() {
        this.isLinkValid = await this.validateToken()
        this.verifyingLink = false
        this.contactEmail = this.$store.getters['organizations/current']?.contact_email
    },
    computed: {
        backgroundImageUrl() {
            return `${import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX}/page404/page-404.png`
        },
    },
    methods: {
        async validateToken() {
            try {
                const token = await getInvitation(
                    this.$store.getters['organizations/current'].code,
                    this.token
                )
                const expirationDate = Date.parse(token.expire_at)
                if (expirationDate > new Date()) {
                    return true
                }
            } catch (error) {
                console.error(error)
            }
            return false
        },
        async register() {
            this.v$.form.$validate()
            if (this.v$.form.$error) {
                return
            }
            this.asyncing = true
            try {
                this.form.profile_picture = await utils.getPatatoidFile(this.currentPatatoidIndex)

                const formData = new FormData()
                imageSizesFormDataPost(formData)

                if (this.form.profile_picture instanceof File) {
                    formData.append(
                        'profile_picture_file',
                        this.form['profile_picture'],
                        this.form['profile_picture'].name
                    )
                }

                ;['given_name', 'family_name', 'password', 'email'].forEach((key) => {
                    formData.append(key, this.form[key])
                })

                formData.append('language', this.$store.getters['languages/current'])

                await postUserWithInvitation(this.token, formData)

                this.confirm = true
            } catch (error) {
                if (error?.response?.status === 409) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('register.email-already-exists')}`,
                        type: 'error',
                    })
                } else {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('register.save-error')} ${
                            error?.response?.data?.error || ''
                        }`,
                        type: 'error',
                    })
                }

                console.error(error)
            } finally {
                this.asyncing = false
            }
        },

        login() {
            goToKeycloakLoginPage()
        },

        closeDrawer() {
            this.showContactUsDrawer = false
        },
    },
}
</script>
<style lang="scss" scoped>
.confirm {
    border-radius: $border-radius-m;
    padding: $space-xl;
}

.error-message {
    color: $salmon-dark;
    margin-top: $space-xs;
    font-size: $font-size-s;
}

.action {
    display: flex;
    padding-bottom: pxToRem(24px);
    flex-direction: column;
    align-items: center;

    .tos {
        font-size: pxToRem(12px);
        padding-top: pxToRem(12px);
    }

    .register-btn {
        width: 100%;
        text-transform: capitalize;
    }
}

.extra-links {
    margin-top: pxToRem(29px);
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    gap: $space-unit;

    .extra-link {
        flex-basis: 50%;
    }

    .extra-login {
        text-align: left;
    }

    .extra-help {
        text-align: right;
    }

    &.is-confirm {
        .extra-link {
            flex-basis: 100%;
        }

        .extra-help {
            text-align: center;
        }
    }
}

.link {
    display: inline-block; // avoid breaking link on new line
    color: $primary-dark;
    text-decoration: underline;
    font-weight: 400;

    &:hover {
        text-decoration: none;
    }
}

.link-expired {
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 90px auto;
}

.expired-text {
    font-size: pxToRem(40px);
    line-height: 1;
    text-align: center;
    color: $green;
    font-weight: 700;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 20px;
    filter: drop-shadow(8px 0 0 #20393d) drop-shadow(-8px 0 0 #20393d) drop-shadow(0 8px 0 #20393d)
        drop-shadow(0 -8px 0 #20393d);
}

.illustration {
    max-width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: end;
    background-size: cover;
    text-align: center;
    margin: 0 auto;
}

.extra-informations {
    // font-size: smaller;
    text-align: center;
    padding-bottom: 40px;

    a {
        font-weight: 700;
        color: $primary-dark;
        text-decoration: underline;
    }
}

.confirm-message strong {
    font-weight: 700;
    color: $primary-dark;
}

.fade-leave-active,
.fade-enter-active {
    transition:
        transform 200ms ease-in-out,
        opacity 200ms ease-in-out;
    transform: scale(1);
    opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
    transform: scale(0);

    $opacity: 0;
}
</style>
