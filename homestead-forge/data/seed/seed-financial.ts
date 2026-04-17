import { mod, step } from './helpers';

const M = 'mod-financial';
export const financialMod = mod(M, 'financial', 11, 'Financial Planning', 'Build a realistic budget, track expenses, identify income streams, and plan for long-term sustainability.', 'DollarSign', '#2E8B57', 40, 'beginner');

export const financialSteps = [
  step('step-fin-1', M, 1, 'Total Budget Estimation',
    'Calculate the total homestead build-out cost across all modules and phases.',
    'Go through each module and estimate costs for every step. Add 20-30% contingency for surprises. Include land payments, materials, labor, permits, tools, and living expenses during build-out. Most homesteads cost $50-200K to fully develop over 3-5 years beyond land cost.',
    ['Add 30% contingency — homestead projects always cost more than estimated', 'Include your living expenses during build-out, not just materials'],
    0, 0, '1-2 days', [], ['planning', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-fin-2', M, 2, 'Phase-by-Phase Budget',
    'Break total budget into manageable phases matching your timeline and income.',
    'Phase 1: Essential infrastructure (water, shelter, power). Phase 2: Food production (garden, orchard). Phase 3: Livestock and preservation. Phase 4: Refinements and expansion. Assign realistic dollar amounts and timelines to each phase. Build what you can afford without debt if possible.',
    ['Complete each phase fully before starting the next — half-finished projects waste money', 'Prioritize infrastructure that eliminates ongoing costs (well vs. hauling water)'],
    0, 0, '1 day', ['step-fin-1'], ['planning'], ['spring', 'summer', 'fall', 'winter']),

  step('step-fin-3', M, 3, 'Income Stream Identification',
    'Identify potential income sources: eggs, produce, honey, firewood, crafts, or agritourism.',
    'List every possible income stream from your property: farm stand, eggs, meat birds, honey, maple syrup, firewood, hay, cut flowers, value-added products (jams, soap), farm stays, classes, or remote work. Focus on 2-3 streams that match your skills and local market demand.',
    ['Start selling before you feel ready — farmers markets want more vendors', 'Value-added products (jam, salsa, soap) have higher margins than raw produce'],
    0, 0, '1-2 days', [], ['planning', 'research'], ['spring', 'summer', 'fall', 'winter']),

  step('step-fin-4', M, 4, 'Emergency Fund',
    'Build 3-6 months of expenses as a safety net before major investments.',
    'Homesteading has unpredictable expenses: equipment breakdowns, vet bills, weather damage, crop failures. Build at least 3 months of living expenses in accessible savings before major spending. This fund prevents financial stress from derailing your homestead plans.',
    ['Three months of expenses is the minimum — six months gives real peace of mind', 'Keep emergency funds in a separate account so you do not accidentally spend them'],
    0, 0, 'ongoing', [], ['planning', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-fin-5', M, 5, 'Insurance Review',
    'Review homeowner, farm, liability, and equipment insurance needs.',
    'Standard homeowner insurance may not cover farm activities or livestock. Look into farm owner policies that bundle property, liability, and equipment coverage. Liability insurance is essential if you sell products or have visitors. Insure major equipment and structures against loss.',
    ['Farm owner policies are often cheaper than separate homeowner plus farm policies', 'Liability insurance is non-negotiable if you sell any product to the public'],
    500, 3000, '1 day', [], ['planning', 'research'], ['spring', 'summer', 'fall', 'winter']),

  step('step-fin-6', M, 6, 'Tax Considerations',
    'Research agricultural tax exemptions, homestead exemptions, and deductible expenses.',
    'Many states offer agricultural tax exemptions that significantly reduce property taxes. Homestead exemptions protect your primary residence. Farm expenses are deductible if you can show profit intent. Keep every receipt. Consult a tax professional familiar with agricultural tax law.',
    ['Agricultural tax exemptions can save thousands per year — research your state requirements', 'Keep every receipt — farm expenses are deductible against farm income'],
    0, 500, '1-2 days', [], ['research', 'planning'], ['winter', 'spring']),

  step('step-fin-7', M, 7, 'Record Keeping System',
    'Set up bookkeeping for all homestead income and expenses.',
    'Use a simple spreadsheet or accounting software. Track every expense by category and module. Record all income by source. Save all receipts (photo them immediately). Separate personal and farm finances with a dedicated bank account. Monthly reviews keep you on track.',
    ['A dedicated farm bank account makes tax time dramatically easier', 'Photo receipts immediately — paper receipts fade and get lost'],
    0, 200, '1 day', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-fin-8', M, 8, 'ROI Tracking',
    'Track return on investment for each module to see what saves or makes money.',
    'Calculate what your garden actually saves you versus grocery store prices. Track cost per dozen eggs, per gallon of milk, per cord of firewood. Some modules save money (garden, firewood), some generate income (eggs, honey), and some are pure cost (shelter). Know which is which.',
    ['Your garden probably saves more money than you think when tracked carefully', 'ROI is not just financial — quality of life, food security, and self-reliance have value'],
    0, 0, 'ongoing', ['step-fin-7'], ['planning'], ['spring', 'summer', 'fall', 'winter']),

  step('step-fin-9', M, 9, '5-Year Financial Projection',
    'Project costs, income, and break-even points for your homestead journey.',
    'Map out expected expenses and income for each of the next 5 years. Year 1 is heaviest on infrastructure spending. Income typically starts year 2-3 and grows. Most homesteads approach cost-neutral by year 4-5 on food expenses. A clear projection helps maintain motivation during expensive early years.',
    ['Be conservative on income projections and generous on expense estimates', 'Review and update your 5-year plan annually — it should be a living document'],
    0, 0, '1 day', ['step-fin-1', 'step-fin-3'], ['planning'], ['spring', 'summer', 'fall', 'winter']),
];
