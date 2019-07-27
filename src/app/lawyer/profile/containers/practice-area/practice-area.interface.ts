export interface PracticeArea {
  title: string,
  relative_percentage: number
}

export interface AddPracticeAreaData {
  element: PracticeArea,
  isEdit: boolean,
  index: number
}
