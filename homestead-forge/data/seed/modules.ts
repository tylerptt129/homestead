import { landMod, landSteps } from './seed-land';
import { waterMod, waterSteps } from './seed-water';
import { shelterMod, shelterSteps } from './seed-shelter';
import { powerMod, powerSteps } from './seed-power';
import { gardenMod, gardenSteps } from './seed-garden';
import { orchardMod, orchardSteps } from './seed-orchard';
import { livestockMod, livestockSteps } from './seed-livestock';
import { preservationMod, preservationSteps } from './seed-preservation';
import { toolsMod, toolsSteps } from './seed-tools';
import { securityMod, securitySteps } from './seed-security';
import { financialMod, financialSteps } from './seed-financial';
import { communityMod, communitySteps } from './seed-community';

export const seedModules = [
  landMod, waterMod, shelterMod, powerMod, gardenMod, orchardMod,
  livestockMod, preservationMod, toolsMod, securityMod, financialMod, communityMod,
];

export const seedSteps: Record<string, any[]> = {
  land: landSteps,
  water: waterSteps,
  shelter: shelterSteps,
  power: powerSteps,
  garden: gardenSteps,
  orchard: orchardSteps,
  livestock: livestockSteps,
  preservation: preservationSteps,
  tools: toolsSteps,
  security: securitySteps,
  financial: financialSteps,
  community: communitySteps,
};
