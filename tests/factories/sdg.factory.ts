import { createFactory } from 'faker-create-factory'

import { SdgModel } from '~/models/sdg.model'
import { SDGS } from '~/functs/constants'

const SdgFactory = createFactory<SdgModel>((faker) => {
  const num = faker.datatype.number(SDGS.length - 1)

  return structuredClone(SDGS[num])
})

export default SdgFactory
