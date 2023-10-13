<template>
    <div class="register-page">
        <div class="logos-ctn left">
            <img :src="organizationLogo" :alt="organizationName" />
            <hr class="separator" />
            <ProjectLogo class="directory-logo" />
        </div>
        <div class="right">
            <div class="box-ctn">
                <h1 class="title">
                    {{ confirm ? $t('register.title-confirm') : $t('register.title') }}
                </h1>
                <div class="box confirm-message" v-if="confirm">
                    <p>{{ $t('register.confirmation', { email: form.email }) }}</p>
                </div>
                <div class="box form" v-else>
                    <div class="form-group">
                        <TextInput
                            v-model="form.given_name"
                            :label="$t('register.given_name.label')"
                            :placeholder="$t('register.given_name.placeholder')"
                            @blur="v$.form.given_name.$validate"
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
                            :left-icon="asyncing ? 'LoaderSimple' : null"
                            class="register-btn"
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
            </div>
            <div class="extra-links" :class="{ 'is-confirm': confirm }">
                <p v-if="!confirm" class="extra-link extra-login">
                    {{ $t('register.have-account') }}
                    <a href="#" @click.prevent="login" class="link">{{ $t('register.login') }}</a>
                </p>
                <p class="extra-link extra-help">
                    {{ $t('register.need-help') }}
                    <a href="#" @click.prevent="showContactUsDrawer = true" class="link">{{
                        $t('register.contact-us')
                    }}</a>
                </p>
            </div>
        </div>
    </div>
    <DrawerLayout
        :is-opened="showContactUsDrawer"
        :has-footer="false"
        class="medium"
        confirm-action-name=""
        :title="$t('footer.contact')"
        @close="closeDrawer"
    >
        <ContactDrawer v-if="showContactUsDrawer" @close="closeDrawer" />
    </DrawerLayout>
</template>
<script>
import useVuelidate from '@vuelidate/core'
import { postUserWithInvitation } from '@/api/people.service.ts'
import { helpers, required, email } from '@vuelidate/validators'
import { imageSizesFormDataPost } from '@/functs/imageSizesUtils.ts'
import imageMixin from '@/mixins/imageMixin.ts'
import utils from '@/functs/functions.ts'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ProjectLogo from '@/components/svgs/ProjectLogo.vue'
import ContactDrawer from '@/components/Drawers/ContactDrawer.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'

export default {
    name: 'RegisterPage',

    mixins: [imageMixin],

    components: {
        ProjectLogo,
        TextInput,
        LpiButton,
        ContactDrawer,
        DrawerLayout,
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

    computed: {
        organizationLogo() {
            return this.$store.getters['organizations/current']?.logo_image?.variations?.medium
        },
        organizationName() {
            return this.$store.getters['organizations/current']?.name || ''
        },
    },
    methods: {
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

                await postUserWithInvitation(this.token, formData)

                this.confirm = true
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('register.save-error')}`,
                    type: 'error',
                })
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
$form-max-width: pxToRem(326px);
$form-horizontal-padding: pxToRem(62px);
$column-gap: $space-2xl;
$container-horizontal-padding: $space-xl;

$form-max-total-width: $form-max-width + 2 * $form-horizontal-padding;
$min-width-horizontal-layout: 2 * $form-max-total-width + $column-gap + 2 *
    $container-horizontal-padding;

.register-page {
    display: flex;
    gap: $column-gap;
    margin: $navbar-height auto;
    flex-flow: column nowrap;
    padding: $space-xl $space-l;

    @media all and (min-width: $min-width-horizontal-layout) {
        padding: $space-xl $container-horizontal-padding;
        width: 100%;
        max-width: $min-width-horizontal-layout;
        flex-flow: row nowrap;
        box-sizing: border-box;
    }
}

.right,
.left,
.box-ctn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

@media all and (min-width: $min-width-horizontal-layout) {
    .left,
    .right {
        flex-basis: 50%;
        flex-grow: 0;
        flex-shrink: 0;
        max-width: $form-max-total-width;
    }
}

.separator {
    margin: $space-l auto;
    width: 50%;
    padding: 0;
    border: $border-width-s solid $gray-10;
}

.title {
    font-size: $font-size-2xl;
    margin-bottom: $space-l;
    text-align: center;
}

.confirm {
    border-radius: $border-radius-m;
    padding: $space-xl;
}

.box {
    width: 100%;
    padding: pxToRem(40px) 0;
    box-sizing: border-box;

    @media all and (min-width: $min-width-horizontal-layout) {
        max-width: $form-max-total-width;
        padding: pxToRem(40px) $form-horizontal-padding;
        box-shadow: 0 0 6px 0 #00000026;
        border-radius: $border-radius-m;
    }
}

.confirm-message {
    line-height: 1.5;
    font-size: $font-size-m;
    @media all and (max-width: $min-width-horizontal-layout) {
        max-width: 30rem;
    }
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
        line-height: pxToRem(18px);
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
    font-weight: bold;
    text-decoration: underline;
    font-weight: 400;
    &:hover {
        text-decoration: none;
    }
}

.directory-logo {
    width: pxToRem(200px);
    height: auto;
}
</style>
