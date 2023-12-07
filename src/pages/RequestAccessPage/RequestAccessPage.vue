<template>
    <SignUpWrapper
        :sign-up-title="confirm ? $t('request-access.title-confirm') : $t('request-access.title')"
    >
        <transition name="fade" mode="out-in">
            <div class="confirm-message" v-if="confirm">
                <i18n-t keypath="request-access.confirmation" tag="p">
                    <strong>{{ form.email }}</strong>
                </i18n-t>
            </div>
            <div v-else class="form">
                <p class="notice">{{ $t('request-access.notice') }}</p>
                <div class="form-group">
                    <TextInput
                        v-model="form.given_name"
                        :label="$t('request-access.given_name.label')"
                        :placeholder="$t('request-access.given_name.placeholder')"
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
                        :label="$t('request-access.family_name.label')"
                        :placeholder="$t('request-access.family_name.placeholder')"
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
                        :label="$t('request-access.email.label')"
                        input-type="email"
                        :placeholder="$t('request-access.email.placeholder')"
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
                        v-model="form.title"
                        :label="$t('request-access.profile-title.label')"
                        :placeholder="$t('request-access.profile-title.placeholder')"
                        data-test="title"
                    />
                </div>
                <div class="form-group">
                    <TextInput
                        v-model="form.message"
                        :label="$t('request-access.message.label')"
                        input-type="textarea"
                        :placeholder="$t('request-access.message.placeholder')"
                        data-test="message"
                    />
                </div>

                <div class="action">
                    <LpiButton
                        :disabled="asyncing"
                        @click="cancel"
                        secondary
                        :label="$t('common.cancel')"
                        :btn-icon="asyncing ? 'LoaderSimple' : null"
                        class="cancel-btn"
                        data-test="cancel-btn"
                    />
                    <LpiButton
                        :disabled="v$.form.$error || asyncing"
                        @click="requestAccess"
                        :label="$t('common.confirm')"
                        :btn-icon="asyncing ? 'LoaderSimple' : null"
                        class="register-btn"
                        data-test="register-btn"
                    />
                </div>
            </div>
        </transition>
        <template #post-box>
            <div class="extra-links" :class="{ 'is-confirm': confirm }">
                <p v-if="!confirm" class="extra-link extra-login">
                    {{ $t('request-access.have-account') }}
                    <a href="#" @click.prevent="login" class="link">{{
                        $t('request-access.login')
                    }}</a>
                </p>
                <p class="extra-link extra-help">
                    {{ $t('request-access.need-help') }}
                    <a href="#" @click.prevent="showContactUsDrawer = true" class="link">{{
                        $t('request-access.contact-us')
                    }}</a>
                </p>
            </div>
        </template>
    </SignUpWrapper>
    <DrawerLayout
        :is-opened="showContactUsDrawer"
        :has-footer="false"
        class="medium"
        confirm-action-name=""
        :title="$t('footer.contact')"
        @close="closeDrawer"
    >
        <ContactForm v-if="showContactUsDrawer" @close="closeDrawer" />
    </DrawerLayout>
</template>
<script>
import useVuelidate from '@vuelidate/core'
import utils from '@/functs/functions.ts'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ContactForm from '@/components/Drawers/ContactForm.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import SignUpWrapper from '@/components/lpikit/SignUpWrapper/SignUpWrapper.vue'
import { helpers, required, email } from '@vuelidate/validators'
export default {
    name: 'RequestAccessPage',

    components: {
        TextInput,
        LpiButton,
        ContactForm,
        DrawerLayout,
        SignUpWrapper,
    },

    data() {
        return {
            form: {
                email: '',
                given_name: '',
                family_name: '',
                profile_picture: '',
                title: '',
                message: '',
            },
            asyncing: false,
            confirm: false,
            v$: useVuelidate(),
            showContactUsDrawer: false,
        }
    },

    validations() {
        return {
            form: {
                email: {
                    required: helpers.withMessage(
                        this.$t('request-access.email.is-required'),
                        required
                    ),
                    email: helpers.withMessage(this.$t('request-access.email.is-invalid'), email),
                },
                given_name: {
                    required: helpers.withMessage(
                        this.$t('request-access.given_name.is-required'),
                        required
                    ),
                },
                family_name: {
                    required: helpers.withMessage(
                        this.$t('request-access.family_name.is-required'),
                        required
                    ),
                },
            },
        }
    },
    async mounted() {
        this.contactEmail = this.$store.getters['organizations/current']?.contact_email
    },

    methods: {
        async requestAccess() {
            this.v$.form.$validate()
            if (this.v$.form.$error) {
                return
            }
            this.asyncing = true
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000))

                this.confirm = true
            } catch (error) {
                if (error?.response?.status === 409) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('register.email-already-exists')}`, // TODO
                        type: 'error',
                    })
                } else {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('register.save-error')} ${
                            // TODO
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

        cancel() {
            this.$router.push({ name: 'HomeRoot' })
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

.notice {
    font-size: $font-size-m;
    line-height: 1.5;
    margin-bottom: $space-l;
}

.action {
    display: flex;
    padding-bottom: pxToRem(24px);
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: $space-l;

    .register-btn,
    .cancel-btn {
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

    // padding-top: pxToRem(20px);
}

.title {
    font-size: pxToRem(40px);
    font-weight: 900;
    color: $primary-dark;
    line-height: 1.125;
    margin-bottom: pxToRem(15px);
}

.expired-text {
    font-size: pxToRem(40px);
    line-height: pxToRem(40px);
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
    line-height: pxToRem(30px);
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
