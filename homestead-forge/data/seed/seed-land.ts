import { mod, step } from './helpers';

const M = 'mod-land';
export const landMod = mod(M, 'land', 1, 'Land Assessment & Site Planning', 'Evaluate your property terrain, soil, climate, and legal requirements before breaking ground.', 'Map', '#8B7355', 80, 'beginner');

export const landSteps = [
  step('step-land-1', M, 1, 'Survey Property Boundaries',
    'Walk and mark your property lines using deed descriptions and markers.',
    'Start by obtaining your deed and plat map from the county recorder. Walk the entire perimeter with flagging tape, marking corners and boundaries. If lines are disputed or unclear, hire a licensed surveyor — the cost is worth avoiding future legal headaches. Check for easements and right-of-ways that may cross your land.',
    ['Get a copy of your plat map from the county before walking lines', 'Take GPS coordinates of each corner pin for your records'],
    300, 800, '1-2 days', [], ['planning', 'beginner'], ['spring', 'summer', 'fall']),

  step('step-land-2', M, 2, 'Soil Testing',
    'Collect soil samples from multiple zones to test pH, nutrients, and contamination.',
    'Take samples from 6-8 locations across your property at 6-inch depth. Mix samples from similar areas together. Send to your county extension office or a private lab. Test for pH, N-P-K, organic matter, and heavy metals if near old structures. Results guide everything from garden placement to septic design.',
    ['Your county extension office often provides free or low-cost soil testing', 'Test different zones separately — hilltop soil differs from valley bottom'],
    20, 200, '2-4 hours', ['step-land-1'], ['beginner', 'diy'], ['spring', 'fall']),

  step('step-land-3', M, 3, 'Topography Mapping',
    'Map elevation changes, slopes, and flat buildable zones across your property.',
    'Use a combination of satellite imagery and on-foot observation. Note slope direction and steepness, flat building sites, and low-lying areas. Slopes over 15% are challenging to build on. South-facing slopes are warmer and ideal for gardens. Mark potential building sites on your map.',
    ['Free topo maps are available at USGS.gov for your area', 'A simple A-frame level helps you map contour lines on foot'],
    0, 500, '1 day', ['step-land-1'], ['planning', 'diy'], ['spring', 'summer', 'fall']),

  step('step-land-4', M, 4, 'Sun Exposure Analysis',
    'Track sun patterns to identify full-sun, partial-shade, and shaded zones.',
    'Observe your property at morning, midday, and evening across seasons if possible. South-facing areas get the most sun. Note where trees, hills, and structures cast shadows. Gardens need 6-8 hours of direct sun. Solar panels need unobstructed southern exposure. Mark sun zones on your site map.',
    ['Use a solar pathfinder app to simulate sun angles across all seasons', 'Remember that deciduous trees block summer sun but allow winter light through'],
    0, 50, '1-2 days', ['step-land-3'], ['planning', 'diy'], ['spring', 'summer']),

  step('step-land-5', M, 5, 'Wind Patterns',
    'Observe prevailing winds and plan windbreaks and sheltered building zones.',
    'Note wind direction during storms and calm periods over several weeks. Prevailing winds in most of the US come from the west or northwest. Plan windbreaks of evergreen trees on the windward side. Position animal shelters and gardens on the leeward side. Wind affects heating costs, fire risk, and crop success.',
    ['Plant windbreak trees 50-100 feet from structures for best protection', 'Flags or ribbons on stakes help you track wind patterns over time'],
    0, 30, '1 week observation', ['step-land-3'], ['planning'], ['spring', 'fall', 'winter']),

  step('step-land-6', M, 6, 'Drainage Assessment',
    'Observe water flow during rain and identify wet areas and drainage needs.',
    'Walk your property during and after heavy rain. Note where water pools, which direction it flows, and where it exits. Poor drainage affects foundations, septic systems, and gardens. Plan swales or French drains for problem areas. Wetlands may have building restrictions.',
    ['Walk the property during a heavy rain — you will learn more in one storm than weeks of dry observation', 'Mark wet areas with stakes so you remember them when it dries out'],
    0, 100, '1-2 rain events', ['step-land-3'], ['planning', 'seasonal'], ['spring']),

  step('step-land-7', M, 7, 'Access Roads',
    'Plan vehicle access, emergency routes, and equipment delivery paths.',
    'Ensure your building site has year-round vehicle access. Consider fire truck access requirements (usually 12-foot wide minimum). Plan for heavy equipment delivery during construction. Gravel roads need proper drainage and a crown for water runoff. Budget for road maintenance.',
    ['A 14-foot wide gravel road handles most equipment and emergency vehicles', 'Install culverts at low points to prevent road washout'],
    500, 5000, '1-2 weekends', [], ['diy', 'contractor-needed'], ['summer', 'fall']),

  step('step-land-8', M, 8, 'Zoning & Permits',
    'Research local zoning, building codes, and agricultural exemptions.',
    'Visit your county planning office and ask about zoning for your parcel. Check setback requirements, building height limits, and livestock restrictions. Many rural areas have agricultural exemptions that simplify building. Get well and septic permits early — they can take months. Some counties require permits for even small outbuildings.',
    ['Ask specifically about agricultural exemptions — they can save thousands in permit fees', 'Building without permits can result in forced demolition — always check first'],
    50, 500, '1-2 weeks', [], ['planning', 'research'], ['spring', 'summer', 'fall', 'winter']),

  step('step-land-9', M, 9, 'Utility Access Evaluation',
    'Assess existing electrical, water, sewer, and internet access and connection costs.',
    'Contact local utility companies for connection cost estimates. Power line extensions can cost $10-30 per foot. Well drilling costs vary by depth and geology. Check internet options: cable, DSL, satellite, or cellular. Factor utility costs into your site selection — building closer to existing infrastructure saves money.',
    ['Get written quotes from utilities — verbal estimates are often inaccurate', 'Consider off-grid options if utility connection costs exceed $10-15k'],
    0, 200, '1-2 days', [], ['planning', 'research'], ['spring', 'summer', 'fall', 'winter']),

  step('step-land-10', M, 10, 'Create Master Site Plan',
    'Combine all assessments into a comprehensive property plan.',
    'Draw a scaled map of your property showing boundaries, contours, sun zones, wind patterns, water flow, access roads, and utility connections. Mark planned locations for house, garden, orchard, livestock areas, and outbuildings. This plan becomes your roadmap for all future development. Update it as you build.',
    ['Use graph paper at 1 inch = 20 feet for a readable hand-drawn plan', 'Keep both a paper copy in your binder and a digital backup'],
    0, 2000, '1-2 weeks', ['step-land-1', 'step-land-2', 'step-land-3'], ['planning'], ['spring', 'summer', 'fall', 'winter']),
];
