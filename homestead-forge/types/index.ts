export type GridStatus = 'on_grid' | 'off_grid' | 'hybrid';

export type StepStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export type Mood = 'great' | 'good' | 'neutral' | 'tough' | 'rough';

export type BudgetCategory = 'materials' | 'tools' | 'labor' | 'permits' | 'equipment';

export interface Profile {
  id: string;
  displayName: string;
  homesteadName: string;
  locationState: string;
  acreage: number;
  climateZone: string;
  gridStatus: GridStatus;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  displayOrder: number;
  color: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

export interface Resource {
  title: string;
  url: string;
}

export interface Step {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  detailedGuide: string;
  tips: string[];
  estimatedCostLow: number;
  estimatedCostHigh: number;
  estimatedTime: string;
  displayOrder: number;
  dependsOn: string[];
  tags: string[];
  seasonRelevance: string[];
  resources: {
    links: Resource[];
    books: Resource[];
    videos: Resource[];
  };
  createdAt: string;
}

export interface UserStepProgress {
  id: string;
  userId: string;
  stepId: string;
  status: StepStatus;
  startedAt: string;
  completedAt: string;
  notes: string;
  photos: string[];
  actualCost: number;
  customData: Record<string, unknown>;
  updatedAt: string;
}

export interface WeatherData {
  temp: number;
  conditions: string;
  wind: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  moduleId: string | null;
  title: string;
  content: string;
  mood: Mood;
  weather: WeatherData | null;
  photos: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  userId: string;
  moduleId: string;
  stepId: string;
  description: string;
  amount: number;
  category: BudgetCategory;
  vendor: string;
  receiptUrl: string;
  date: string;
  createdAt: string;
}

export interface SeasonalTask {
  id: string;
  userId: string;
  moduleId: string;
  title: string;
  description: string;
  month: number;
  recurring: boolean;
  completedYear: number;
  createdAt: string;
}

export interface OnboardingData {
  homesteadName: string;
  locationState: string;
  acreage: number;
  gridStatus: GridStatus;
  priorityModules: string[];
}
