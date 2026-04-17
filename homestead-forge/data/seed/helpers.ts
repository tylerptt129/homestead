export interface SeedModule {
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

export interface SeedStep {
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
  resources: { links: never[]; books: never[]; videos: never[] };
  createdAt: string;
}

export function mod(
  id: string, slug: string, order: number, title: string, desc: string,
  icon: string, color: string, hours: number, diff: 'beginner' | 'intermediate' | 'advanced'
): SeedModule {
  return { id, slug, title, description: desc, iconName: icon, displayOrder: order, color, estimatedHours: hours, difficulty: diff, createdAt: '' };
}

export function step(
  id: string, modId: string, order: number, title: string, desc: string,
  guide: string, tips: string[], costLow: number, costHigh: number,
  time: string, deps: string[], tags: string[], seasons: string[]
): SeedStep {
  return {
    id, moduleId: modId, title, description: desc, detailedGuide: guide, tips,
    estimatedCostLow: costLow, estimatedCostHigh: costHigh, estimatedTime: time,
    displayOrder: order, dependsOn: deps, tags, seasonRelevance: seasons,
    resources: { links: [], books: [], videos: [] }, createdAt: '',
  };
}
