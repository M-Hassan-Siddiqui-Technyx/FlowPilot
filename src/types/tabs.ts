export type WorkflowTabId = 'plan' | 'automate' | 'collaborate'

export type WorkflowTab = {
  id: WorkflowTabId
  label: string
  title: string
  description: string
  stat: {
    value: string
    label: string
    /** Fill of the progress bar, 0–100. */
    progress: number
  }
}
