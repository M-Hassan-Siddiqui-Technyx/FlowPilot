import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// Paths exported from Figma (`npm run figma:assets`); colours come from `currentColor`.
const icons = {
  menu: {
    viewBox: '0 0 18 17',
    body: (
      <path
        d="M18 3.15324H0V0H18V3.15324ZM18 9.85182H0V6.69859H18V9.85182ZM18 16.5308H0V13.3776H18V16.5308Z"
        fill="currentColor"
      />
    ),
  },
  close: {
    viewBox: '0 0 20 20',
    body: (
      <path
        d="M5 15L15 5M5 5L15 15"
        stroke="currentColor"
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  chevronRight: {
    viewBox: '0 0 16 16',
    body: (
      <path
        d="M6 3.33334L10.6667 8L6 12.6667"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  chevronDown: {
    viewBox: '0 0 21 21',
    body: (
      <path
        d="M6.3 8.4L10.5 12.6L14.7 8.4"
        stroke="currentColor"
        strokeWidth="1.575"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  check: {
    viewBox: '0 0 9.66 10',
    body: (
      <path
        d="M9.65893 0.297533C7.29318 3.67441 4.86212 6.79971 2.36575 9.67344C2.17707 9.89115 2.01258 10 1.87228 10C1.71263 10 1.42477 9.5791 1.00871 8.7373C0.336236 7.37784 0 6.56507 0 6.29898C0 6.20223 0.065312 6.08853 0.195936 5.95791C0.476536 5.6628 0.674891 5.51524 0.791001 5.51524C0.897436 5.51524 1.01113 5.68457 1.13208 6.02322C1.45138 6.88437 1.78761 7.65119 2.14078 8.32366C4.58878 5.84664 7.01016 3.07209 9.40493 0L9.65893 0.297533Z"
        fill="currentColor"
      />
    ),
  },
  checkbox: {
    viewBox: '0 0 14 14',
    body: (
      <path
        d="M10.6811 4.19393C11.0227 4.53562 11.0227 5.08949 10.6811 5.43118L6.30612 9.80618C5.96443 10.1478 5.41055 10.1478 5.06887 9.80618L3.31887 8.05618C2.98726 7.71285 2.99201 7.16711 3.32952 6.82959C3.66704 6.49207 4.21278 6.48733 4.55612 6.81893L5.68749 7.95031L9.44387 4.19393C9.78555 3.85235 10.3394 3.85235 10.6811 4.19393Z"
        fill="currentColor"
      />
    ),
  },
  star: {
    // One glyph of the "★★★★★" rating, including its 1.4px letter-spacing advance.
    viewBox: '0 0 15.4 21',
    body: (
      <path
        d="M13.1387 8.73828L9.35156 11.5137L10.7734 15.957L7.01367 13.2227L3.25391 15.8887L4.64844 11.5137L0.861328 8.73828H5.56445L7.01367 4.25391L8.44922 8.73828H13.1387Z"
        fill="currentColor"
      />
    ),
  },
  pause: {
    viewBox: '0 0 16 16',
    body: (
      <>
        <rect x="4" y="3" width="2.75" height="10" rx="1" fill="currentColor" />
        <rect x="9.25" y="3" width="2.75" height="10" rx="1" fill="currentColor" />
      </>
    ),
  },
  play: {
    viewBox: '0 0 16 16',
    body: <path d="M5 3.6v8.8a.8.8 0 0 0 1.2.7l7-4.4a.8.8 0 0 0 0-1.4l-7-4.4A.8.8 0 0 0 5 3.6Z" fill="currentColor" />,
  },
  // Social marks from Simple Icons (CC0), used by the brief footer variant.
  linkedin: {
    viewBox: '0 0 24 24',
    body: (
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        fill="currentColor"
      />
    ),
  },
  x: {
    viewBox: '0 0 24 24',
    body: (
      <path
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
        fill="currentColor"
      />
    ),
  },
  github: {
    viewBox: '0 0 24 24',
    body: (
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill="currentColor"
      />
    ),
  },
  logoMark: {
    viewBox: '0 0 13.02 19.5',
    body: <path d="M2.52 4.20097H13.3333L10.8133 10.8676H0L2.52 4.20097Z" fill="currentColor" />,
  },
  // The mobile footer frame (Figma 2:1077) sets its mark as the text "▰", which Inter lacks, so Figma draws its
  // missing-glyph box: a 4.5×15 outline with a grey interior. Reproduced as designed (D-39). Drawn at 2× units.
  logoMarkMobile: {
    viewBox: '0 0 9 30',
    body: (
      <>
        <rect x="1" y="1" width="7" height="28" fill="currentColor" fillOpacity="0.55" />
        <rect x="1" y="1" width="7" height="28" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  featurePlan: {
    viewBox: '0 0 14 14',
    body: (
      <path
        d="M13.9829 14H0V0H13.9829V14ZM13.2829 13.3V0.7H0.7V13.3H13.2829ZM11.5415 11.6098H2.44146V2.44146H11.5415V11.6098Z"
        fill="currentColor"
      />
    ),
  },
  featureTeam: {
    viewBox: '0 0 16 15',
    body: (
      <path
        d="M16 2.80288H9.22742V0H16V2.80288ZM6.89445 2.80868L0 2.80288V0L6.89445 0.0116061V2.80868ZM16 8.75717H9.22742V5.9543H16V8.75717ZM6.89445 8.76298L0 8.75717V5.9543L6.89445 5.9659V8.76298ZM16 14.6941H9.22742V11.8912H16V14.6941ZM6.89445 14.6999L0 14.6941V11.8912L6.89445 11.9028V14.6999Z"
        fill="currentColor"
      />
    ),
  },
} satisfies Record<string, { viewBox: string; body: ReactNode }>

export type IconName = keyof typeof icons

type IconProps = ComponentPropsWithoutRef<'svg'> & { name: IconName }

/** Decorative SVG icon; size it with `size-*`/`w-* h-*` and colour it with `text-*`. */
export function Icon({ name, ...props }: IconProps) {
  const { viewBox, body } = icons[name]
  return (
    <svg viewBox={viewBox} fill="none" aria-hidden="true" focusable="false" {...props}>
      {body}
    </svg>
  )
}
