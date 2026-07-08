import { createFactory } from 'faker-create-factory'

import { SdgModel } from 'shared-projects-frontend/models'
import { SDGS } from '~/functs/constants'

const SdgFactory = createFactory<SdgModel>((faker) => {
  const num = faker.datatype.number(SDGS.length - 1)

  return structuredClone(SDGS[num])
})

export default SdgFactory
