/**
 * @name SdgModel
 * @description Sdg goal of a project
 */
export interface SdgModel {
  id: number
  background_color: string
}

export type SdgOutput = Required<SdgModel>
