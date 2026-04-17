import { supabase } from '../supabase/client';
import type { Module, Step } from '../../types';

function mapModule(row: Record<string, unknown>): Module {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string,
    iconName: row.icon_name as string,
    displayOrder: row.display_order as number,
    color: row.color as string,
    estimatedHours: row.estimated_hours as number,
    difficulty: row.difficulty as Module['difficulty'],
    createdAt: row.created_at as string,
  };
}

function mapStep(row: Record<string, unknown>): Step {
  return {
    id: row.id as string,
    moduleId: row.module_id as string,
    title: row.title as string,
    description: row.description as string,
    detailedGuide: row.detailed_guide as string,
    tips: (row.tips as string[]) || [],
    estimatedCostLow: row.estimated_cost_low as number,
    estimatedCostHigh: row.estimated_cost_high as number,
    estimatedTime: row.estimated_time as string,
    displayOrder: row.display_order as number,
    dependsOn: (row.depends_on as string[]) || [],
    tags: (row.tags as string[]) || [],
    seasonRelevance: (row.season_relevance as string[]) || [],
    resources: (row.resources as Step['resources']) || {
      links: [],
      books: [],
      videos: [],
    },
    createdAt: row.created_at as string,
  };
}

export async function fetchModules(): Promise<Module[]> {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('display_order');

  if (error) throw error;
  return (data || []).map(mapModule);
}

export async function fetchStepsForModule(moduleId: string): Promise<Step[]> {
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('module_id', moduleId)
    .order('display_order');

  if (error) throw error;
  return (data || []).map(mapStep);
}
