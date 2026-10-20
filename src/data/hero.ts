import type { DashboardScreen } from '../types/hero'

export const trustNotes = ['No credit card required', 'Set up in minutes', 'Trusted by 10,000+ teams']

/**
 * Screens of the hero dashboard, one per sidebar entry. Overview is the Figma design (1:619, mobile 2:1114); the other
 * five are placeholder copy in the same layout (D-31). To keep the mockup's height fixed when switching on mobile,
 * every subtitle breaks over two lines and every first stat label over two lines there, as in the design.
 */
export const dashboardScreens: DashboardScreen[] = [
  {
    id: 'overview',
    label: 'Overview',
    title: 'Good morning, Sarah!',
    subtitle: {
      label: "Here's what is happening with your team today.",
      shortLabel: "Here's what is happening with your\nteam today.",
    },
    stats: [
      { id: 'active-tasks', value: '12', label: 'Active Tasks', shortLabel: 'Active\nTasks' },
      { id: 'ai-suggestions', value: '4', label: 'AI Suggestions', shortLabel: 'AI Suggest.' },
      { id: 'progress', value: '85%', label: 'Project Progress', shortLabel: 'Progress' },
    ],
    listTitle: "Today's Tasks",
    rows: [
      { id: 'landing-page', label: 'Design landing page', status: 'In Progress', tone: 'warning' },
      { id: 'docs', label: 'Update documentation', shortLabel: 'Update docs', status: 'Completed', tone: 'success' },
      { id: 'sync', label: 'Team sync meeting', shortLabel: 'Team sync', status: 'Upcoming', tone: 'subtle' },
      { id: 'pull-requests', label: 'Review pull requests', shortLabel: 'Review PRs', status: 'Upcoming', tone: 'subtle' },
    ],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    title: 'Tasks this week',
    subtitle: {
      label: 'Plan, prioritise and track every task in one place.',
      shortLabel: 'Plan, prioritise and track every\ntask in one place.',
    },
    stats: [
      { id: 'open', value: '24', label: 'Open Tasks', shortLabel: 'Open\nTasks' },
      { id: 'due-today', value: '7', label: 'Due Today' },
      { id: 'done', value: '18', label: 'Done This Week', shortLabel: 'Done' },
    ],
    listTitle: 'Due Today',
    rows: [
      { id: 'landing-page', label: 'Design landing page', status: 'In Progress', tone: 'warning' },
      { id: 'release-notes', label: 'Write release notes', shortLabel: 'Release notes', status: 'Upcoming', tone: 'subtle' },
      { id: 'sign-in-bug', label: 'Fix sign-in bug', shortLabel: 'Fix sign-in', status: 'Completed', tone: 'success' },
      { id: 'roadmap', label: 'Plan Q3 roadmap', shortLabel: 'Q3 roadmap', status: 'Upcoming', tone: 'subtle' },
    ],
  },
  {
    id: 'automations',
    label: 'Automations',
    title: 'Automations',
    subtitle: {
      label: 'Rules that handle the repetitive work for you.',
      shortLabel: 'Rules that handle the repetitive\nwork for you.',
    },
    stats: [
      { id: 'rules', value: '8', label: 'Active Rules', shortLabel: 'Active\nRules' },
      { id: 'runs', value: '1.2k', label: 'Runs This Month', shortLabel: 'Runs' },
      { id: 'saved', value: '36h', label: 'Time Saved', shortLabel: 'Saved' },
    ],
    listTitle: 'Running Now',
    rows: [
      { id: 'assign-bugs', label: 'Assign new bugs to triage', shortLabel: 'Assign bugs', status: 'Running', tone: 'success' },
      { id: 'status-report', label: 'Weekly status report', shortLabel: 'Weekly report', status: 'Scheduled', tone: 'subtle' },
      { id: 'slack-sync', label: 'Sync tasks to Slack', shortLabel: 'Slack sync', status: 'Running', tone: 'success' },
      { id: 'stale-tasks', label: 'Close stale tasks', shortLabel: 'Stale tasks', status: 'Paused', tone: 'warning' },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    title: 'Team',
    subtitle: {
      label: 'See who is working on what today.',
      shortLabel: 'See who is working on\nwhat today.',
    },
    stats: [
      { id: 'members', value: '9', label: 'Team Members', shortLabel: 'Team\nMembers' },
      { id: 'online', value: '7', label: 'Online Now', shortLabel: 'Online' },
      { id: 'projects', value: '3', label: 'Active Projects', shortLabel: 'Projects' },
    ],
    listTitle: 'Online Now',
    rows: [
      { id: 'sarah', label: 'Sarah Chen', status: 'Online', tone: 'success' },
      { id: 'alex', label: 'Alex Kim', status: 'In a Meeting', tone: 'warning' },
      { id: 'priya', label: 'Priya Patel', status: 'Online', tone: 'success' },
      { id: 'tom', label: 'Tom Rivera', status: 'Away', tone: 'subtle' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    title: 'Analytics',
    subtitle: {
      label: 'How your team performed this week.',
      shortLabel: 'How your team performed\nthis week.',
    },
    stats: [
      { id: 'on-time', value: '92%', label: 'On-time Rate', shortLabel: 'On-time\nRate' },
      { id: 'cycle-time', value: '3.4d', label: 'Avg. Cycle Time', shortLabel: 'Cycle Time' },
      { id: 'throughput', value: '+18%', label: 'Throughput', shortLabel: 'Output' },
    ],
    listTitle: 'Project Health',
    rows: [
      { id: 'website', label: 'Website redesign', shortLabel: 'Website', status: 'On Track', tone: 'success' },
      { id: 'mobile-app', label: 'Mobile app launch', shortLabel: 'Mobile app', status: 'At Risk', tone: 'warning' },
      { id: 'api', label: 'API migration', status: 'On Track', tone: 'success' },
      { id: 'portal', label: 'Customer portal', shortLabel: 'Portal', status: 'Not Started', tone: 'subtle' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    title: 'Settings',
    subtitle: {
      label: 'Manage your workspace and preferences.',
      shortLabel: 'Manage your workspace and\npreferences.',
    },
    stats: [
      { id: 'plan', value: 'Pro', label: 'Current Plan', shortLabel: 'Current\nPlan' },
      { id: 'seats', value: '9/10', label: 'Seats Used', shortLabel: 'Seats' },
      { id: 'security', value: '2FA', label: 'Security' },
    ],
    listTitle: 'Workspace',
    rows: [
      { id: 'email', label: 'Email notifications', shortLabel: 'Email alerts', status: 'On', tone: 'success' },
      { id: 'ai', label: 'AI suggestions', status: 'On', tone: 'success' },
      { id: 'digest', label: 'Weekly digest', status: 'Off', tone: 'subtle' },
      { id: 'billing', label: 'Billing', status: 'Due in 5 days', tone: 'warning' },
    ],
  },
]
