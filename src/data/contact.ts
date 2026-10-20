import type { DemoTime, SelectOption, TeamSize } from '../types/contact'

export const teamSizeOptions: SelectOption<TeamSize>[] = [
  { value: '1-10', label: '1 - 10 members' },
  { value: '11-50', label: '11 - 50 members' },
  { value: '51-200', label: '51 - 200 members' },
  { value: '200+', label: '200+ members' },
]

/** Team sizes that unlock the Preferred Demo Time field. */
export const demoTeamSize: TeamSize = '200+'

export const demoTimeOptions: SelectOption<DemoTime>[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
]

export const messageLength = { min: 20, max: 300 } as const

/** Exact wording required by the brief. */
export const successMessage = 'Thanks! Our team will contact you shortly.'
