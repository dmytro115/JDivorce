export interface Experience {
  title: string
  subtitle: string,
  from_timestamp: any,
  to_timestamp: any,
  current_work: boolean
}

export interface AddExperienceData {
  element: Experience,
  isEdit: boolean,
  index: number
}
