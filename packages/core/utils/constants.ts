// ---------------------------------------------------------------------------
// Homestead Forge - Application Constants
// ---------------------------------------------------------------------------

import type { BudgetCategory, Mood, StepStatus, ThemeMode } from '../types';

// ---- US States ------------------------------------------------------------

export interface USState {
  name: string;
  abbreviation: string;
}

export const US_STATES: USState[] = [
  { name: 'Alabama', abbreviation: 'AL' },
  { name: 'Alaska', abbreviation: 'AK' },
  { name: 'Arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' },
];

// ---- Climate Zones --------------------------------------------------------

export interface ClimateZone {
  id: string;
  label: string;
  description: string;
}

export const CLIMATE_ZONES: ClimateZone[] = [
  { id: '1', label: 'Zone 1', description: 'Extremely cold (-60F to -50F)' },
  { id: '2', label: 'Zone 2', description: 'Very cold (-50F to -40F)' },
  { id: '3', label: 'Zone 3', description: 'Cold (-40F to -30F)' },
  { id: '4', label: 'Zone 4', description: 'Cool (-30F to -20F)' },
  { id: '5', label: 'Zone 5', description: 'Moderate (-20F to -10F)' },
  { id: '6', label: 'Zone 6', description: 'Mild (-10F to 0F)' },
  { id: '7', label: 'Zone 7', description: 'Warm (0F to 10F)' },
  { id: '8', label: 'Zone 8', description: 'Hot (10F to 20F)' },
  { id: '9', label: 'Zone 9', description: 'Very hot (20F to 30F)' },
  { id: '10', label: 'Zone 10', description: 'Tropical (30F to 40F)' },
  { id: '11', label: 'Zone 11', description: 'Very tropical (40F to 50F)' },
  { id: '12', label: 'Zone 12', description: 'Subtropical (50F to 60F)' },
  { id: '13', label: 'Zone 13', description: 'Equatorial (60F to 70F)' },
];

// ---- Months ---------------------------------------------------------------

export const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// ---- Module slugs ---------------------------------------------------------

export const MODULE_SLUGS = [
  'water-systems',
  'garden-planning',
  'food-preservation',
  'livestock',
  'energy-power',
  'shelter-structures',
  'tools-equipment',
  'soil-composting',
  'security-safety',
  'finances-legal',
] as const;

export type ModuleSlug = (typeof MODULE_SLUGS)[number];

// ---- Step statuses --------------------------------------------------------

export const STEP_STATUSES: StepStatus[] = [
  'not_started',
  'in_progress',
  'completed',
  'skipped',
];

// ---- Mood options ---------------------------------------------------------

export interface MoodOption {
  value: Mood;
  label: string;
  emoji: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { value: 'great', label: 'Great', emoji: '\u{1F929}' },
  { value: 'good', label: 'Good', emoji: '\u{1F60A}' },
  { value: 'neutral', label: 'Neutral', emoji: '\u{1F610}' },
  { value: 'tough', label: 'Tough', emoji: '\u{1F62B}' },
  { value: 'rough', label: 'Rough', emoji: '\u{1F622}' },
];

// ---- Budget categories ----------------------------------------------------

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  'materials',
  'tools',
  'labor',
  'permits',
  'equipment',
];

// ---- Theme modes ----------------------------------------------------------

export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'auto'];

// ---- Misc -----------------------------------------------------------------

export const AUTOSAVE_DEBOUNCE_MS = 3_000;
export const MAX_PHOTOS_PER_ENTRY = 10;
export const MAX_NOTE_LENGTH = 10_000;
export const DEFAULT_APP_SETTINGS = {
  theme: 'auto' as ThemeMode,
  notifications: true,
  units: 'imperial' as const,
};
