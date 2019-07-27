export interface RecentCase {
  title: string
}

export interface AddRecentCasesData {
  element: RecentCase,
  isEdit: boolean,
  index: number
}
