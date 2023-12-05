<template>
    <div class="loader-ctn" v-if="loading">
        <LoaderSimple />
    </div>
    <form v-else>
        <!--  Group Name -->
        <div>
            <TextInput
                v-model="form.name"
                :placeholder="namePlaceholder"
                space-below-label="large-space"
                data-test="group-name-input"
                @blur="validation.form.name.$validate"
            >
                <label>{{
                    isAddMode
                        ? `${$t('group.form.name-label')} *`
                        : `${$t('group.form.edit-name')} *`
                }}</label>
            </TextInput>
            <p
                v-for="error of validation.form.name.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>

        <!-- Email -->
        <div class="input">
            <TextInput
                v-model="form.email"
                :placeholder="emailPlaceholder"
                space-below-label="large-space"
                data-test="group-email-input"
                @blur="validation.form.email.$validate"
                ><label>{{ $t('group.form.email-label') }}</label>
            </TextInput>
            <p
                v-for="error of validation.form.email.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>

        <!-- Short Description-->
        <div class="input">
            <TextInput
                v-model="form.short_description"
                :placeholder="shortDescriptionPlaceholder"
                space-below-label="large-space"
                data-test="group-short-desciption"
                @blur="validation.form.short_description.$validate"
                ><label>{{ $t('group.form.short-description-label') }}</label>
            </TextInput>
            <p
                v-for="error of validation.form.short_description.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>

        <!-- Image -->
        <div class="img-ctn">
            <label>{{ $filters.capitalize($t('group.image-header')) }}</label>
            <div class="img-inner">
                <div class="img-preview">
                    <div class="preview-wrapper-outer">
                        <CroppedImage
                            :alt="`${form.name} image`"
                            :contain="true"
                            :image-sizes="form.imageSizes"
                            :src="displayedImage"
                            class="preview-wrapper-inner"
                        />
                    </div>
                </div>
                <div class="img-actions">
                    <LpiButton
                        :label="$filters.capitalize($t('group.random-image'))"
                        :secondary="true"
                        class="next-patatoid-btn"
                        btn-icon="RotateRight"
                        @click="showNextPatatoid"
                        data-test="random-image-button"
                    />

                    <ImageInput
                        id="header_image"
                        :label="$t('group.form.upload-image')"
                        @upload-image="uploadImage"
                    />

                    <LpiButton
                        :label="$t('group.form.resize-image')"
                        :secondary="true"
                        class="next-patatoid-btn"
                        btn-icon="Pen"
                        @click="openImageResizer"
                    />
                </div>
            </div>
        </div>

        <DrawerLayout
            :confirm-action-name="$t('common.confirm')"
            :is-opened="showImageResizer"
            :title="$t('group.form.resize-image')"
            class="medium"
            @close="showImageResizer = false"
            @confirm="saveImageSizes"
        >
            <ImageResizer
                v-if="showImageResizer"
                ref="imageResizer"
                :image="displayedImage"
                :image-sizes="form.imageSizes"
            />
        </DrawerLayout>

        <div class="spacer"></div>

        <!-- Description -->
        <div class="description">
            <label>
                {{ $filters.capitalize($t('group.form.description-label')) }}
                <span
                    class="add-btn"
                    @click="descriptionIsOpened = true"
                    data-test="add-description"
                >
                    <IconImage v-if="!form.description" name="Plus" />
                    <IconImage v-else name="Pen" />
                    <span v-if="!form.description">{{
                        $filters.capitalize($t('group.form.add'))
                    }}</span>
                    <span v-else>{{ $filters.capitalize($t('group.form.edit')) }}</span>
                </span>
            </label>
            <div v-if="form.description">
                <div class="description-content" v-html="form.description"></div>
                <!-- TODO htmllimiter-->
            </div>
        </div>

        <div class="spacer"></div>

        <!-- Team -->
        <div class="team">
            <GroupTeamSection v-model="form.members" />
        </div>

        <div class="spacer"></div>

        <!-- Featured projects -->
        <div class="project">
            <ProjectSection v-model="form.featuredProjects" />
        </div>

        <div class="spacer"></div>

        <!-- Parent group -->
        <div class="parent-group">
            <ParentGroupSection v-model="form.parentGroup" :groups="groups" />
        </div>

        <div class="spacer"></div>

        <!-- Visibility -->
        <div class="visibility">
            <label>{{ $filters.capitalize($t('group.form.visibility.title')) }}</label>
            <div class="visibility-options">
                <template v-for="visibility in visibilities" :key="visibility.id">
                    <label
                        class="checkbox-item"
                        :class="{ selected: form.publication_status == visibility.id }"
                    >
                        <span class="label form-control">
                            <input
                                v-model="form.publication_status"
                                :value="visibility.id"
                                type="radio"
                                name="visibility"
                                :data-test="`visibility-${visibility.name.toLowerCase()}`"
                            />{{ visibility.name }}
                        </span>
                    </label>
                    <span class="checkbox-description">{{ visibility.description }}</span>
                </template>
            </div>
            <p
                v-for="error of validation.form.publication_status.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>

        <div v-if="$route.params.groupId" class="delete-group">
            <label>{{ $t('group.form.delete') }}</label>
            <LpiButton
                :label="$t('group.form.delete')"
                btn-icon="TrashCanOutline"
                :secondary="true"
                data-test="delete-group-button"
                @click="openRemoveOrQuit"
            />
        </div>

        <DrawerLayout
            :confirm-action-name="$t('common.confirm')"
            :is-opened="showImageResizer"
            :title="$t('group.form.resize-image')"
            class="medium"
            @close="showImageResizer = false"
            @confirm="saveImageSizes"
        >
            <ImageResizer
                v-if="showImageResizer"
                ref="imageResizer"
                :image="displayedImage"
                :image-sizes="form.imageSizes"
            />
        </DrawerLayout>

        <GroupDescriptionDrawer
            :original-description="form.description"
            :is-add-mode="isAddMode"
            :is-opened="descriptionIsOpened"
            @close="closeDescription"
            @update-description="updateDescription"
        />

        <ConfirmModal
            v-if="showRemoveQuit"
            :content="$t('common.remove-group')"
            :title="$t('project.remove-group')"
            :cancel-button-label="'common.cancel'"
            :confirm-button-label="'project.remove-group'"
            @cancel="toggleShowRemoveGroupVisible"
            @confirm="removeGroup"
        />
    </form>
</template>

<script>
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import ImageInput from '@/components/lpikit/ImageInput/ImageInput.vue'
import GroupTeamSection from './GroupTeamSection.vue'
import ProjectSection from './ProjectSection.vue'
import ParentGroupSection from './ParentGroupSection.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import utils from '@/functs/functions.ts'
import GroupDescriptionDrawer from './GroupDescriptionDrawer.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import ImageResizer from '@/components/lpikit/ImageResizer/ImageResizer.vue'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import { getHierarchyGroups } from '@/api/group.service.ts'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import { deleteGroup } from '@/api/groups.service'

export default {
    name: 'GroupForm',

    mixins: [imageMixin],

    emits: ['update:modelValue', 'close'],

    components: {
        TextInput,
        GroupTeamSection,
        ProjectSection,
        ParentGroupSection,
        ImageInput,
        LpiButton,
        IconImage,
        GroupDescriptionDrawer,
        DrawerLayout,
        ImageResizer,
        CroppedImage,
        LoaderSimple,
        ConfirmModal,
    },

    props: {
        isAddMode: {
            type: Boolean,
            default: true,
        },
        modelValue: {
            type: Object,
            required: true,
        },

        validation: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            loading: false,
            displayedImage: '',
            currentPatatoidIndex: 1,
            visibilities: [
                {
                    id: 'public',
                    name: this.$t('group.form.visibility.public'),
                    description: this.$t('group.form.visibility.public_description'),
                },
                {
                    id: 'org',
                    name: this.$t('group.form.visibility.members'),
                    description: this.$t('group.form.visibility.members_description'),
                },
                {
                    id: 'private',
                    name: this.$t('group.form.visibility.private'),
                    description: this.$t('group.form.visibility.private_description'),
                },
            ],
            form: {
                name: '',
                description: '',
                short_description: '',
                email: '',
                type: '', // TODO ??? "club" | "group"?
                parentGroup: null, // group object
                organization: '',
                members: [],
                featuredProjects: [],
                header_image: null,
                imageSizes: null,
                publication_status: 'public',
            },

            descriptionIsOpened: false,
            showImageResizer: false,
            showRemoveQuit: false,
            groups: [],
        }
    },

    async mounted() {
        // lopad groups tree
        await this.loadGroups()
        // initialize header image
        if (!this.modelValue.header_image) {
            this.displayedImage = `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-${this.currentPatatoidIndex}.png`

            this.form.header_image = await utils.getPatatoidFile(this.currentPatatoidIndex)
        } else {
            this.displayedImage = this.modelValue.header_image
        }
        // udpate form with eventual edited group data
        this.form = {
            ...this.form,
            ...this.modelValue,
        }
    },

    computed: {
        namePlaceholder() {
            return this.$t('group.form.name-placeholder')
        },

        emailPlaceholder() {
            return this.$t('group.form.email-placeholder')
        },

        shortDescriptionPlaceholder() {
            return this.$t('group.form.short-description-placeholder')
        },
    },

    watch: {
        form: {
            deep: true,
            handler: function () {
                this.$emit('update:modelValue', this.form)
            },
        },
    },

    methods: {
        async loadGroups() {
            this.loading = true
            // use group's org code if availabe
            // to allow edition of groups on the meta portal (PROJ-1032)
            const orgCode = this.modelValue.organization
                ? this.modelValue.organization
                : this.$store.state.organizations.current.code
            this.groups = (await getHierarchyGroups(orgCode)).children

            this.loading = false
        },

        async showNextPatatoid() {
            if (this.currentPatatoidIndex !== 6) this.currentPatatoidIndex += 1
            else this.currentPatatoidIndex = 1

            this.form.header_image = await utils.getPatatoidFile(this.currentPatatoidIndex)
            this.displayedImage = `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-${this.currentPatatoidIndex}.png`
            // reinit image cropping data
            this.form.imageSizes = null
        },

        uploadImage(image) {
            this.displayedImage = ''

            const fileReader = new FileReader()
            fileReader.readAsDataURL(image)

            fileReader.onload = (fileReaderEvent) => {
                this.displayedImage = fileReaderEvent.target.result
            }

            this.form.header_image = image
            // reinit image cropping data
            this.form.imageSizes = null
        },

        saveImageSizes() {
            this.form.imageSizes = {
                scaleX: this.$refs.imageResizer.scaleX,
                scaleY: this.$refs.imageResizer.scaleY,
                left: this.$refs.imageResizer.left,
                top: this.$refs.imageResizer.top,
                naturalRatio: this.$refs.imageResizer.naturalRatio,
            }
            this.showImageResizer = false
        },

        openImageResizer() {
            this.showImageResizer = true
        },
        openRemoveOrQuit() {
            this.showRemoveQuit = true
        },

        updateDescription(description) {
            this.form.description = description
        },
        closeDescription() {
            this.descriptionIsOpened = false
        },
        toggleShowRemoveGroupVisible() {
            this.showRemoveQuit = !this.showRemoveQuit
        },
        async removeGroup() {
            this.loading = true
            let organization = this.$store.getters['organizations/current'].code
            await deleteGroup(organization, this.$route.params.groupId)
            this.loading = false
            this.$router.push({
                name: 'HomeRoot',
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.loader-ctn {
    padding: $space-xl 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.group-form {
    .input {
        margin: $space-xl 0;
    }

    .category-ctn {
        margin-bottom: $space-xl;
    }

    .category-select {
        width: 100%;

        select {
            width: 100%;
        }
    }

    .team,
    .parent-group,
    .project {
        margin-bottom: $space-xl;
    }

    .description {
        margin-bottom: $space-xl;
    }

    .completed-form-snackbar {
        width: fit-content;
        margin: $space-xl auto;
        border: $border-width-s solid $salmon-dark;
    }

    .visibility {
        margin-bottom: $space-xl;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        &-options {
            display: grid;
            grid-template-columns: min-content max-content;
            align-items: center;

            @media screen and (max-width: $med-mobile) {
                display: flex;
                flex-flow: column;
                align-items: stretch;
            }
        }

        .checkbox-description {
            width: 70%;

            @media screen and (max-width: $med-mobile) {
                width: 100%;
                padding: $space-2xs 0 $space-s 0;
            }
        }

        .checkbox-item {
            border: 1px solid $primary-dark;
            padding: $space-m;
            margin: $space-s pxToRem(16px) $space-s 0;
            border-radius: $border-radius-xs;
            display: flex;
            align-items: center;
            text-align: right;

            > .label {
                font-weight: 700;
                font-size: $font-size-m;
                line-height: 18px;
                color: $primary-dark;
                margin: 0;
                cursor: pointer;
            }

            &.selected {
                background-color: $primary-dark;
                color: $white;

                > .label {
                    color: $white;
                }
            }
        }

        .form-control {
            font-size: $font-size-m;
            color: $primary-dark;
            font-weight: 400;
            line-height: 12px;
            display: grid;
            grid-template-columns: 1em auto;
            gap: $space-m;
        }

        .form-control + .form-control {
            margin-top: 1em;
        }

        input[type='radio'] {
            appearance: none;
            background-color: $white;
            margin: 0;
            font: inherit;
            width: pxToRem(20px);
            height: pxToRem(20px);
            border: $border-width-s solid $primary-dark;
            border-radius: 50%;
            transform: translateY(-0.075em);
            display: grid;
            place-content: center;
            cursor: pointer;
        }

        input[type='radio']::before {
            content: '';
            width: pxToRem(12px);
            height: pxToRem(12px);
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em $primary-dark;
            border-radius: 50%;
        }

        input[type='radio']:checked::before {
            transform: scale(1);
        }

        input[type='radio']:disabled {
            border: $border-width-s solid $disabled;
            color: $disabled;
            cursor: not-allowed;
        }

        .form-control--disabled {
            color: $disabled;
            cursor: not-allowed;
        }
    }

    .delete-group {
        border-top: $border-width-s solid $gray-10;
        padding: 24px 0;
    }

    .img-ctn {
        margin-bottom: $space-xl;
        display: flex;
        flex-direction: column;
        align-items: center;

        label {
            align-self: flex-start;
        }

        .img-inner {
            width: 100%;
            display: flex;
            gap: $space-m;

            .img-actions {
                width: 100%;
                display: flex;
                flex-flow: column;
                gap: $space-m;
                align-items: flex-end;
            }

            .img-preview {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                flex-shrink: 0;
                border: $border-width-s solid $green;
                background-color: $white;
                overflow: hidden;
            }
        }

        .preview-wrapper-outer {
            width: 100%;
            padding-bottom: 100%;
            position: relative;
        }

        .preview-wrapper-inner {
            position: absolute;
            inset: 0;
        }
    }

    .error-description {
        color: $salmon-dark;
        margin-top: $space-s;
        font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;
        font-size: $font-size-s;
    }

    .description label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        width: 100%;
        margin-bottom: $space-l;

        .section-title {
            font-size: $font-size-s;
            color: $black;
            font-weight: bold;
            display: block;
        }

        .add-btn {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            background: $white;
            color: $primary-dark;
            cursor: pointer;
            font-weight: 700;

            svg {
                width: 18px;
                fill: $primary-dark;
            }
        }
    }

    label {
        margin-bottom: $space-l;
        font-size: $font-size-m;
        color: $black;
        font-weight: bold;
        display: block;
    }

    .spacer {
        border-top: 1px solid $gray-10;
        margin-bottom: 34px;
    }
}
</style>
