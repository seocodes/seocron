export const themeIds = [
  'nord',
  'dracula',
  'solarized-light',
  'solarized-dark',
  'ocean-blue',
  'signal-red',
  'midnight',
  'lab-1986',
  'pit-lane',
  'marine-instrument',
] as const

export type ThemeId = (typeof themeIds)[number]
export type FontId = 'jetbrains' | 'space' | 'vt323' | 'dseg7'

export interface ThemeTokens {
  background: string
  surface: string
  surfaceElevated: string
  textPrimary: string
  textSecondary: string
  accent: string
  accentHover: string
  accentSoft: string
  onAccent: string
  border: string
  focusRing: string
  danger: string
}

export interface ThemeDefinition {
  id: ThemeId
  label: string
  tokens: ThemeTokens
}

export const themes: ThemeDefinition[] = [
  {
    id: 'nord',
    label: 'Nord',
    tokens: {
      background: '#20242c',
      surface: '#2b303b',
      surfaceElevated: '#3b4350',
      textPrimary: '#f2f4f8',
      textSecondary: '#d5dbe5',
      accent: '#88c0d0',
      accentHover: '#9acbd8',
      accentSoft: '#3a5360',
      onAccent: '#172027',
      border: '#8793a6',
      focusRing: '#ebcb8b',
      danger: '#ffb4ab',
    },
  },
  {
    id: 'dracula',
    label: 'Dracula',
    tokens: {
      background: '#1e1f29',
      surface: '#282a36',
      surfaceElevated: '#3a3d4d',
      textPrimary: '#f8f8f2',
      textSecondary: '#dedde7',
      accent: '#bd93f9',
      accentHover: '#caa7fa',
      accentSoft: '#503f68',
      onAccent: '#201a2b',
      border: '#85899e',
      focusRing: '#f1fa8c',
      danger: '#ff9ca4',
    },
  },
  {
    id: 'solarized-light',
    label: 'Solarized Light',
    tokens: {
      background: '#fdf6e3',
      surface: '#eee8d5',
      surfaceElevated: '#ded7c3',
      textPrimary: '#002b36',
      textSecondary: '#40575d',
      accent: '#006d8f',
      accentHover: '#005f7d',
      accentSoft: '#c9e2e9',
      onAccent: '#ffffff',
      border: '#667b80',
      focusRing: '#984c00',
      danger: '#a51d2d',
    },
  },
  {
    id: 'solarized-dark',
    label: 'Solarized Dark',
    tokens: {
      background: '#002b36',
      surface: '#073642',
      surfaceElevated: '#164b58',
      textPrimary: '#fdf6e3',
      textSecondary: '#d7d1bf',
      accent: '#d7a900',
      accentHover: '#e9ba15',
      accentSoft: '#4d491e',
      onAccent: '#15242a',
      border: '#789094',
      focusRing: '#eee8d5',
      danger: '#ffaaa5',
    },
  },
  {
    id: 'ocean-blue',
    label: 'Ocean Blue',
    tokens: {
      background: '#071b2d',
      surface: '#0d2a42',
      surfaceElevated: '#193c56',
      textPrimary: '#f2f8ff',
      textSecondary: '#cbddeb',
      accent: '#5ecdf5',
      accentHover: '#7bd8f8',
      accentSoft: '#1d536c',
      onAccent: '#052032',
      border: '#6f94ae',
      focusRing: '#ffd166',
      danger: '#ffaaa5',
    },
  },
  {
    id: 'signal-red',
    label: 'Signal Red',
    tokens: {
      background: '#241719',
      surface: '#351f22',
      surfaceElevated: '#4a2c30',
      textPrimary: '#fff5f3',
      textSecondary: '#ead6d2',
      accent: '#ff8a80',
      accentHover: '#ff9d95',
      accentSoft: '#653b3b',
      onAccent: '#2a1010',
      border: '#a78384',
      focusRing: '#ffd166',
      danger: '#ffb4ab',
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    tokens: {
      background: '#090d18',
      surface: '#111827',
      surfaceElevated: '#243044',
      textPrimary: '#f8fafc',
      textSecondary: '#d4dce8',
      accent: '#93c5fd',
      accentHover: '#a9d2ff',
      accentSoft: '#294665',
      onAccent: '#0b1b30',
      border: '#718198',
      focusRing: '#fcd34d',
      danger: '#fda4af',
    },
  },
  {
    id: 'lab-1986',
    label: 'Lab 1986',
    tokens: {
      background: '#c8b98f',
      surface: '#e3d5ae',
      surfaceElevated: '#f1e4c3',
      textPrimary: '#1c2118',
      textSecondary: '#3f4935',
      accent: '#8a4b00',
      accentHover: '#713d00',
      accentSoft: '#c6ab64',
      onAccent: '#fff7e6',
      border: '#626143',
      focusRing: '#502a00',
      danger: '#8b1820',
    },
  },
  {
    id: 'pit-lane',
    label: 'Pit Lane',
    tokens: {
      background: '#111315',
      surface: '#24272a',
      surfaceElevated: '#34383d',
      textPrimary: '#f6f0e5',
      textSecondary: '#d7d0c6',
      accent: '#ff665e',
      accentHover: '#ff7e77',
      accentSoft: '#6a2f2c',
      onAccent: '#270605',
      border: '#8e979f',
      focusRing: '#ffd166',
      danger: '#ffaaa5',
    },
  },
  {
    id: 'marine-instrument',
    label: 'Marine Instrument',
    tokens: {
      background: '#071820',
      surface: '#102a35',
      surfaceElevated: '#1c3d49',
      textPrimary: '#fff8e7',
      textSecondary: '#d9d4c5',
      accent: '#e6c56a',
      accentHover: '#f3d67e',
      accentSoft: '#4b4a2d',
      onAccent: '#1d220f',
      border: '#81969a',
      focusRing: '#ffd166',
      danger: '#ffaaa5',
    },
  },
]

export const fonts: Array<{ id: FontId; label: string }> = [
  { id: 'jetbrains', label: 'JetBrains Mono' },
  { id: 'space', label: 'Space Mono' },
  { id: 'vt323', label: 'VT323 · CRT' },
  { id: 'dseg7', label: 'DSEG7 · LCD clássico' },
]
