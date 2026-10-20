import gearIcon from '../assets/feature-gear.png'
import type { Company, Feature } from '../types/features'

export const companies: Company[] = [
  { name: 'Google', colors: ['google-blue', 'google-red', 'google-yellow', 'google-blue', 'google-green', 'google-red'] },
  { name: 'slack', colors: ['slack'] },
  { name: 'Notion', colors: ['notion'], firstOnMobile: true },
  { name: 'Spotify', colors: ['spotify'] },
  { name: 'zoom', colors: ['zoom'] },
  { name: 'shopify', colors: ['shopify'], hideOnMobile: true },
]

export const features: Feature[] = [
  {
    id: 'planning',
    title: 'Smart Task Planning',
    description: 'Automatically break down goals into actionable tasks with AI.',
    shortDescription: 'Break goals into actionable tasks.',
    icon: { kind: 'svg', name: 'featurePlan' },
    tone: 'plan',
  },
  {
    id: 'suggestions',
    title: 'AI Suggestions',
    description: 'Get intelligent suggestions to improve your workflow.',
    shortDescription: 'Get intelligent workflow suggestions.',
    icon: { kind: 'text', text: 'AI' },
    tone: 'ai',
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Keep everyone aligned with real-time updates.',
    shortDescription: 'Keep everyone aligned in real time.',
    icon: { kind: 'svg', name: 'featureTeam' },
    tone: 'team',
  },
  {
    id: 'automation',
    title: 'Automated Workflows',
    description: 'Save time by automating repetitive tasks.',
    shortDescription: 'Automate repetitive work.',
    icon: { kind: 'image', src: gearIcon },
    tone: 'automation',
  },
]
