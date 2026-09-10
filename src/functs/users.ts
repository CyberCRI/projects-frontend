// project members can  be group or user
import { patchUserPicture, postUserPicture, deleteUserPicture } from 'shared-projects-frontend/apis'
import type { UserModel, UserForm } from 'shared-projects-frontend/models'
import { imageAdded, imageDeleted, imageUpdated } from '~/form/base'
import { imageSizesFormData } from '~/functs/imageSizesUtils'

/**
 * check if user is anonymous
 *
 * @function
 * @name isAnonymousUser
 * @kind variable
 * @param {UserModel} user
 * @returns {boolean}
 * @exports
 */
export const isAnonymousUser = (user: UserModel) => {
  // TODO(remi): return boolean from backend for annonymous user
  return !user.id || (user.given_name === 'Anonymous' && user.family_name === 'User')
}

/**
 * handle profile picture updates
 *
 * @function
 * @name isAnonymousUser
 * @kind variable
 * @param {number>} userdId
 * @param {Ref<UserForm>} form
 * @param {UserModel} user
 * @returns {UserModel}
 * @exports
 */
export const checkProfilePicture = async (
  userId: number,
  new_profile_picture: UserForm['profile_picture'],
  imageSizes: UserForm['imageSizes'],
  old_profile_picture: UserModel['profile_picture']
) => {
  let pictureId = old_profile_picture?.id

  if (imageDeleted({ picture: new_profile_picture, imageSizes: imageSizes }, old_profile_picture)) {
    await deleteUserPicture(userId, old_profile_picture.id)
  }

  if (imageAdded({ picture: new_profile_picture, imageSizes: imageSizes }, old_profile_picture)) {
    const file = new_profile_picture as File
    const body = new FormData()
    imageSizesFormData(body, imageSizes)
    body.append('file', file, file.name)

    pictureId = (await postUserPicture(userId, body)).id
  }

  if (imageUpdated({ picture: new_profile_picture, imageSizes: imageSizes }, old_profile_picture)) {
    const body = new FormData()
    imageSizesFormData(body, imageSizes)

    await patchUserPicture(userId, pictureId, body)
  }
}
