<template>
    <div class="register-page">
        <div class="logos-ctn">
            <img :src="organizationLogo" alt="" />
            <hr class="separator" />
            <ProjectLogo class="directory-logo" />
        </div>
        <div class="form-ctn">
            <h1 class="title">{{ $t('register.title') }}</h1>
            <div class="confirm" v-if="confirm">
                <p>{{ $t('register.confirmation') }}</p>
            </div>
            <div class="form" v-else>
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
                        v-model="form.job"
                        :label="$t('register.job.label')"
                        :placeholder="$t('register.job.placeholder')"
                        @blur="v$.form.job.$validate"
                    />
                    <p v-for="error of v$.form.job.$errors" :key="error.$uid" class="error-message">
                        {{ error.$message }}
                    </p>
                </div>
                <div class="action">
                    <LpiButton
                        :disabled="v$.$errors.length || asyncing"
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
    </div>
</template>
<script>
import useVuelidate from '@vuelidate/core'
import { postUser } from '@/api/people.service.ts'
import { postUserImage } from '@/api/auth/auth.service.ts'
import { helpers, required, email } from '@vuelidate/validators'
import { imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import imageMixin from '@/mixins/imageMixin.ts'
import utils from '@/functs/functions.ts'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ProjectLogo from '@/components/svgs/ProjectLogo.vue'

export default {
    name: 'RegisterPage',

    mixins: [imageMixin],

    components: {
        ProjectLogo,
        TextInput,
        LpiButton,
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
                job: '',
                profile_picture: '',
            },
            asyncing: false,
            confirm: false,
            currentPatatoidIndex: 1,
            v$: useVuelidate(),
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
                job: {
                    required: helpers.withMessage(this.$t('register.job.is-required'), required),
                },
            },
        }
    },

    computed: {
        organizationLogo() {
            return this.$store.getters['organizations/current']?.logo_image?.variations?.medium
        },
    },
    methods: {
        async register() {
            this.asyncing = true

            try {
                this.form.profile_picture = await utils.getPatatoidFile(this.currentPatatoidIndex)

                const formData = new FormData()
                imageSizesFormData(formData)

                if (this.form.profile_picture instanceof File) {
                    formData.append(
                        'file',
                        this.form['profile_picture'],
                        this.form['profile_picture'].name
                    )
                }

                const user = await postUser(this.token, {
                    ...this.form,
                })

                if (user) {
                    await postUserImage(user.keycloak_id, formData)
                }

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
    },
}
</script>
<style lang="scss" scoped>
.register-page {
    display: flex;
    gap: $space-2xl;
    padding: $space-xl 0;
    margin: $navbar-height auto;
    min-width: 70vw;
}

.form-ctn {
    flex-basis: 66%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.logos-ctn {
    flex-basis: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.separator {
    margin: $space-l auto;
    width: 50%;
    padding: 0;
    border: $border-width-s solid $gray-10;
}

.title {
    font-size: $font-size-2xl;
    margin-bottom: $space-unit;
    text-align: center;
}

.form,
.confirm {
    border-radius: $border-radius-m;
    padding: $space-xl;
}

.form {
    box-shadow: 0 0 6px 0 #00000026;
    width: pxToRem(382px); // 382px + (2*36px) padding => 450px
}

.confirm {
    background-color: $primary-lighter;
    max-width: 20rem;
    line-height: 1.5;
    font-size: $font-size-l;
}

.error-message {
    color: $salmon-dark;
    margin-top: $space-xs;
    font-size: $font-size-s;
}

.action {
    display: flex;
    padding-bottom: 24px;
    flex-direction: column;
    align-items: center;

    .tos {
        font-size: 12px;
        line-height: 18px;
        padding-top: 12px;

        .link {
            color: $primary-dark;
            font-weight: bold;
        }
    }

    .register-btn {
        width: 100%;
        text-transform: capitalize;
    }
}

.directory-logo {
    width: pxToRem(200px);
    height: auto;
}
</style>
