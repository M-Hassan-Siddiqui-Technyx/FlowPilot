import type { WorkflowTab } from '../types/tabs'

// Only the Plan tab is designed in Figma; Automate and Collaborate copy is placeholder (docs/decisions.md).
export const workflowTabs: WorkflowTab[] = [
  {
    id: 'plan',
    label: 'Plan',
    title: 'Break goals into clear tasks',
    description: 'AI-assisted planning keeps priorities visible and actionable.',
    // The design's bar is filled to 279.72 of 420px.
    stat: { value: '40%', label: 'Less manual work', progress: 66.6 },
  },
  {
    id: 'automate',
    label: 'Automate',
    title: 'Put busywork on autopilot',
    description: 'Trigger routine updates, reminders and hand-offs without lifting a finger.',
    stat: { value: '12h', label: 'Saved per person each week', progress: 75 },
  },
  {
    id: 'collaborate',
    label: 'Collaborate',
    title: 'Keep everyone in sync',
    description: 'Shared boards, comments and live status updates keep the whole team aligned.',
    stat: { value: '3x', label: 'Faster team hand-offs', progress: 85 },
  },
]
