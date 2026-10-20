export type TeamSize = '1-10' | '11-50' | '51-200' | '200+'

export type DemoTime = 'morning' | 'afternoon' | 'evening'

export type ContactFormValues = {
  fullName: string
  workEmail: string
  companyName: string
  /** Empty until the user picks an option (the placeholder option has value ""). */
  teamSize: TeamSize | ''
  /** Only registered while Team Size is 200+. */
  demoTime?: DemoTime | ''
  message: string
  terms: boolean
}

export type SelectOption<Value extends string> = {
  value: Value
  label: string
}
