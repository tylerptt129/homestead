import { mod, step } from './helpers';

const M = 'mod-water';
export const waterMod = mod(M, 'water', 2, 'Water Systems', 'Design and install reliable water sourcing, storage, filtration, and distribution.', 'Droplets', '#4A90B8', 120, 'intermediate');

export const waterSteps = [
  step('step-water-1', M, 1, 'Identify Water Sources',
    'Survey wells, springs, creeks, and municipal water access on and near your property.',
    'Check your deed for water rights. Walk the property looking for springs, seeps, and creek access. Ask neighbors about their well depths and flow rates. Contact your county about municipal water availability. Multiple water sources provide redundancy.',
    ['Neighbors\' well logs are public record and tell you what to expect', 'Springs that flow year-round are more valuable than seasonal ones'],
    0, 100, '1-2 days', [], ['planning', 'research'], ['spring', 'summer', 'fall', 'winter']),

  step('step-water-2', M, 2, 'Well Drilling / Assessment',
    'Test existing well or plan new drilling. Assess flow rate and water quality.',
    'If you have an existing well, test flow rate and water quality. For new wells, get quotes from 2-3 drillers. Typical residential wells are 100-400 feet deep. A minimum flow rate of 5 GPM is needed for a household. Well drilling costs $15-50 per foot depending on geology.',
    ['Always get a guaranteed flow rate in your drilling contract', 'Test water quality before investing in the well infrastructure'],
    3000, 15000, '1-3 days', ['step-water-1'], ['contractor-needed'], ['spring', 'summer', 'fall']),

  step('step-water-3', M, 3, 'Rainwater Catchment Design',
    'Calculate roof area, annual rainfall, and storage needs for rainwater harvesting.',
    'Every 1,000 sq ft of roof collects about 600 gallons per inch of rain. Calculate your annual rainfall to estimate total collection potential. Design gutters with leaf screens and first-flush diverters to keep water clean. Check local regulations — some states restrict rainwater collection.',
    ['A first-flush diverter keeps the dirtiest water out of your tanks', 'Dark-colored tanks prevent algae growth'],
    200, 2000, '1-2 weekends', [], ['diy', 'beginner'], ['spring', 'summer']),

  step('step-water-4', M, 4, 'Storage Tank Sizing',
    'Calculate daily water usage and size tanks for your needs plus emergency reserves.',
    'Average household uses 50-100 gallons per person per day. Livestock and gardens add significantly. Size storage for at least 3 days without resupply. Buried tanks stay cooler and save space. Elevated tanks provide gravity-fed pressure without a pump.',
    ['Oversize your storage by 25% — you will always use more water than you estimate', 'Two smaller tanks are more flexible than one large tank'],
    500, 5000, '1 day planning', ['step-water-3'], ['planning', 'diy'], ['spring', 'summer', 'fall', 'winter']),

  step('step-water-5', M, 5, 'Filtration System',
    'Choose filtration based on your water source: sediment, carbon, UV, or reverse osmosis.',
    'Well water typically needs sediment and iron filtration. Surface water needs more treatment: sediment, carbon, and UV sterilization at minimum. Test your water first to know what you are treating for. Whole-house filters protect plumbing; point-of-use filters ensure drinking quality.',
    ['Always filter based on your actual water test results, not guesses', 'UV sterilizers need annual bulb replacement — budget for it'],
    200, 3000, '1 day', ['step-water-1'], ['diy'], ['spring', 'summer', 'fall', 'winter']),

  step('step-water-6', M, 6, 'Plumbing Rough-in',
    'Plan pipe runs from source to house and outbuildings.',
    'Use PEX for interior runs — it is flexible, freeze-resistant, and DIY-friendly. Bury supply lines below your frost line. Plan for shutoff valves at each building and fixture group. Insulate all exposed pipes. Consider a manifold system for easier maintenance.',
    ['PEX is much more forgiving than copper for DIY plumbing', 'Install shutoff valves generously — you will thank yourself during repairs'],
    500, 5000, '1-2 weeks', ['step-water-4'], ['diy', 'contractor-needed'], ['spring', 'summer', 'fall']),

  step('step-water-7', M, 7, 'Hot Water System',
    'Choose between tankless, tank, solar thermal, or wood-fired hot water.',
    'Propane tankless heaters are efficient and compact. Solar thermal pre-heaters can cut hot water costs 50-70%. Wood-fired water heaters work well as backup. Consider a heat pump water heater for electricity-based systems. Size your system for peak demand.',
    ['A solar thermal pre-heater paired with a tankless backup is highly efficient', 'Insulate all hot water pipes to reduce heat loss and wait time'],
    500, 4000, '1-2 days', [], ['diy', 'contractor-needed'], ['spring', 'summer', 'fall', 'winter']),

  step('step-water-8', M, 8, 'Greywater Recycling',
    'Design a greywater system to reuse sink and shower water for garden irrigation.',
    'Greywater from sinks, showers, and laundry can irrigate fruit trees and non-root-vegetable gardens. Use biodegradable soaps. Simple systems gravity-feed to mulch basins around trees. Check local codes — greywater regulations vary widely by state and county.',
    ['Never use greywater on root vegetables or leafy greens', 'Branched drain systems distribute water evenly without pumps'],
    200, 1500, '1 weekend', [], ['diy'], ['spring', 'summer']),

  step('step-water-9', M, 9, 'Irrigation Planning',
    'Layout drip irrigation or gravity-fed systems for gardens and orchards.',
    'Drip irrigation saves 30-50% of water compared to sprinklers. Use timers for consistency. Plan zones by water need: vegetables need more than established trees. Gravity-fed systems work if your water source is uphill. Mulch heavily to reduce irrigation needs.',
    ['Drip irrigation with a timer will save you hours of hand watering', 'Group plants by water needs into irrigation zones'],
    100, 2000, '1-2 weekends', [], ['diy', 'seasonal'], ['spring']),

  step('step-water-10', M, 10, 'Water Testing & Treatment',
    'Test water quality annually and maintain treatment systems.',
    'Test annually for bacteria, nitrates, and pH at minimum. Test for heavy metals and chemicals if near agriculture or old mining. Keep treatment system maintenance on a calendar. Replace filters on schedule. Retest after any system changes or contamination events.',
    ['Set a calendar reminder for annual water testing', 'After heavy rains or flooding, retest immediately'],
    50, 300, '2-4 hours', ['step-water-5'], ['beginner'], ['spring', 'summer', 'fall', 'winter']),
];
