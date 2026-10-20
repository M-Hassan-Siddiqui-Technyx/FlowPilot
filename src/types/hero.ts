/** Mockup copy has a shorter variant for the narrow mobile dashboard ("\n" breaks a line there). */
export type ResponsiveLabel = {
  label: string
  shortLabel?: string
}

export type DashboardStat = ResponsiveLabel & {
  id: string
  value: string
}

/** Colour of a row's status text: the design's In Progress / Completed / Upcoming colours. */
export type StatusTone = 'warning' | 'success' | 'subtle'

export type DashboardRow = ResponsiveLabel & {
  id: string
  status: string
  tone: StatusTone
}

export type DashboardScreenId = 'overview' | 'tasks' | 'automations' | 'team' | 'analytics' | 'settings'

/** One sidebar entry of the hero dashboard and the screen it shows. Every screen has the same layout as Overview. */
export type DashboardScreen = {
  id: DashboardScreenId
  /** Sidebar label. */
  label: string
  title: string
  subtitle: ResponsiveLabel
  stats: [DashboardStat, DashboardStat, DashboardStat]
  listTitle: string
  rows: DashboardRow[]
}
