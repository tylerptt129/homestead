import { mod, step } from './helpers';

const M = 'mod-garden';
export const gardenMod = mod(M, 'garden', 5, 'Food Production — Garden', 'Establish productive garden beds with soil building, irrigation, and season extension.', 'Sprout', '#228B22', 150, 'beginner');

export const gardenSteps = [
  step('step-garden-1', M, 1, 'Garden Site Selection',
    'Choose the sunniest, flattest area with good drainage close to water and your kitchen.',
    'Vegetables need 6-8 hours of direct sunlight minimum. Choose a level area or gentle south-facing slope. Proximity to a water source saves hours of hauling. Being near the kitchen means you will actually harvest daily. Avoid low spots where frost settles and areas under black walnut trees.',
    ['The best garden spot is the one you walk past every day', 'Start with a 200 sq ft plot — you can expand each year'],
    0, 0, '2-4 hours', [], ['beginner', 'planning'], ['spring', 'fall']),

  step('step-garden-2', M, 2, 'Soil Amendment Plan',
    'Based on soil tests, plan compost, lime, or sulfur additions to build fertile soil.',
    'Most garden soil benefits from 2-4 inches of compost worked into the top 6 inches. Adjust pH to 6.0-7.0 for most vegetables. Add lime to raise pH, sulfur to lower it. Cover crops in fall build organic matter and fix nitrogen. Healthy soil grows healthy plants with fewer pest problems.',
    ['Compost is the single best amendment for almost any soil type', 'Never work wet clay soil — it destroys soil structure for years'],
    50, 500, '1-2 days', ['step-garden-1'], ['beginner', 'diy'], ['spring', 'fall']),

  step('step-garden-3', M, 3, 'Raised Bed Construction',
    'Build raised beds from untreated lumber, stone, or galvanized metal.',
    'Standard raised beds are 4 feet wide (reachable from both sides) and 8-12 feet long. Use untreated cedar, hemlock, or galvanized metal. Make beds 10-12 inches deep for root crops. Fill with a mix of topsoil, compost, and peat or coconut coir. Level beds carefully for even irrigation.',
    ['4 feet wide is the maximum — you must reach the center without stepping in the bed', 'Cedar lasts 10-15 years without treatment; pine only 3-5'],
    50, 300, '1-2 weekends', ['step-garden-1'], ['diy', 'beginner'], ['spring', 'fall']),

  step('step-garden-4', M, 4, 'Seed Starting Setup',
    'Set up indoor seed starting with lights, heat mats, and proper trays.',
    'Start seeds 6-8 weeks before your last frost date. Use a shop light with daylight LED bulbs 2-3 inches above seedlings, 16 hours per day. Heat mats speed germination of tomatoes and peppers. Use cell trays with a quality seed starting mix. Harden off seedlings for a week before transplanting.',
    ['A $20 shop light works as well as expensive grow lights for seedlings', 'Label everything — seedlings all look the same at first'],
    100, 500, '1 day setup', [], ['beginner', 'diy', 'seasonal'], ['winter', 'spring']),

  step('step-garden-5', M, 5, 'Companion Planting Map',
    'Design your garden layout using companion planting and succession planting principles.',
    'Group compatible plants together: tomatoes with basil, corn with beans and squash (Three Sisters). Keep brassicas away from nightshades. Plan succession plantings every 2-3 weeks for continuous harvest. Rotate crop families each year to prevent disease buildup. Draw your layout on graph paper.',
    ['The Three Sisters (corn, beans, squash) is a proven companion planting system', 'Rotate crop families to new beds each year to break pest and disease cycles'],
    0, 30, '2-4 hours', ['step-garden-1'], ['beginner', 'planning'], ['winter', 'spring']),

  step('step-garden-6', M, 6, 'Irrigation System',
    'Install drip irrigation or soaker hoses with timers for consistent watering.',
    'Drip irrigation delivers water directly to roots, reducing waste and disease. Use a timer to water early morning when evaporation is lowest. Plan one drip line per row of plants. Include a filter to prevent clogged emitters. Soaker hoses are a simpler, cheaper alternative for raised beds.',
    ['Water early morning to reduce evaporation and fungal disease', 'A battery-powered timer costs $25 and saves hours of hand watering'],
    50, 500, '1 weekend', ['step-garden-3'], ['diy', 'beginner'], ['spring']),

  step('step-garden-7', M, 7, 'Season Extension',
    'Build cold frames, row covers, or a greenhouse to extend your growing season.',
    'Row covers add 4-8 degrees of frost protection and cost very little. Cold frames extend the season by 4-6 weeks on each end. A simple hoop house can give you nearly year-round growing. Even a small 8x12 greenhouse lets you start seeds and grow cool-season crops through winter.',
    ['Row cover fabric over wire hoops is the cheapest season extension method', 'A cold frame made from an old window and straw bales works surprisingly well'],
    50, 5000, '1-2 weekends', [], ['diy'], ['fall', 'spring']),

  step('step-garden-8', M, 8, 'Composting System',
    'Set up hot compost bins, worm bins, or tumbler composting to recycle organic waste.',
    'A three-bin system lets you have compost at different stages. Mix browns (carbon: leaves, straw, cardboard) and greens (nitrogen: kitchen scraps, grass) at a 3:1 ratio. Turn every 1-2 weeks for hot composting. Worm bins handle kitchen scraps year-round indoors. Finished compost is garden gold.',
    ['A hot compost pile reaches 130-160F and kills weed seeds and pathogens', 'Keep a small bucket in the kitchen for daily compost collection'],
    0, 300, '2-4 hours', [], ['beginner', 'diy'], ['spring', 'summer', 'fall']),

  step('step-garden-9', M, 9, 'Harvest Tracking',
    'Create a system to track yields by crop, bed, and season for continuous improvement.',
    'Weigh and record every harvest. Track which varieties produced best, which beds were most productive, and your total yield by crop. This data helps you decide what to grow more of next year and what to drop. A simple notebook or spreadsheet works fine.',
    ['Weigh your harvests — most gardeners vastly overestimate or underestimate yields', 'Calculate cost per pound to see which crops save you the most money'],
    0, 20, 'ongoing', [], ['beginner', 'planning'], ['summer', 'fall']),

  step('step-garden-10', M, 10, 'Seed Saving',
    'Learn to save seeds from open-pollinated varieties for long-term self-sufficiency.',
    'Start with easy crops: tomatoes, peppers, beans, peas, and lettuce. Use only open-pollinated varieties, not hybrids. Isolate varieties to prevent cross-pollination or hand-pollinate. Dry seeds thoroughly before storage. Properly stored seeds last 2-10 years depending on the crop.',
    ['Start seed saving with tomatoes and beans — they are the easiest and most reliable', 'Store dried seeds in labeled envelopes in a cool, dry, dark place'],
    0, 50, 'ongoing', [], ['intermediate', 'diy'], ['summer', 'fall']),
];
