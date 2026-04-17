import { mod, step } from './helpers';

const M = 'mod-shelter';
export const shelterMod = mod(M, 'shelter', 3, 'Shelter & Structures', 'Plan and build your primary dwelling and essential outbuildings from foundation to finish.', 'Home', '#A0522D', 200, 'advanced');

export const shelterSteps = [
  step('step-shelter-1', M, 1, 'Foundation Type Selection',
    'Choose slab, crawlspace, basement, or pier foundation based on soil and climate.',
    'Your soil type and frost depth determine the best foundation. Slabs are cheapest but limit access to plumbing. Crawlspaces provide access and work on slopes. Full basements add living or storage space. Pier foundations disturb less soil and work well on steep sites.',
    ['Get a soil percolation test before choosing — clay soil changes everything', 'Pier foundations are the most DIY-friendly option for small structures'],
    3000, 30000, '1-2 weeks', [], ['planning', 'contractor-needed'], ['spring', 'summer', 'fall']),

  step('step-shelter-2', M, 2, 'Floor Plan Design',
    'Design a layout that fits your family needs, budget, and building skills.',
    'Start small — you can always add on later. An open floor plan feels larger and costs less to build. Position the kitchen on the north side and living areas with south-facing windows for passive solar gain. Plan for mudroom entry, pantry storage, and a clear path from garden to kitchen.',
    ['Build smaller than you think you need — most homesteaders wish they had less house to maintain', 'A covered porch is the most-used space on a homestead'],
    0, 5000, '2-4 weeks', ['step-shelter-1'], ['planning', 'diy'], ['spring', 'summer', 'fall', 'winter']),

  step('step-shelter-3', M, 3, 'Framing Approach',
    'Choose stick-frame, timber frame, SIPs, or alternative building method.',
    'Stick framing is the most common, with widely available materials and labor. Timber framing is beautiful and strong but requires specialized skills. SIPs (Structural Insulated Panels) are fast and energy-efficient. Consider straw bale, cordwood, or cob if you want natural building methods.',
    ['Stick framing has the widest contractor availability and lowest material cost', 'Whatever method you choose, get the roof on fast to protect your investment'],
    5000, 40000, '2-6 weeks', ['step-shelter-2'], ['contractor-needed'], ['spring', 'summer']),

  step('step-shelter-4', M, 4, 'Roofing',
    'Select metal, shingle, or alternative roofing. Plan for rainwater catchment.',
    'Metal roofing lasts 50+ years, sheds snow well, and is ideal for rainwater catchment. Standing seam is best but costs more. Shingles are cheaper upfront but last only 20-30 years. Consider a steep pitch (8/12 or higher) for snow shedding and loft space.',
    ['Metal roofing is worth the extra cost — you will likely never replace it', 'Plan gutter placement during roofing, not after'],
    3000, 15000, '1-2 weeks', ['step-shelter-3'], ['contractor-needed', 'diy'], ['spring', 'summer', 'fall']),

  step('step-shelter-5', M, 5, 'Insulation Strategy',
    'Choose insulation type and R-value targets for your climate zone.',
    'Check your climate zone R-value recommendations. Spray foam provides the best air sealing but costs most. Mineral wool batts are fire-resistant and moisture-tolerant. Rigid foam board works well for exterior sheathing. Do not skimp on insulation — energy savings compound every year.',
    ['Air sealing matters as much as R-value — seal every penetration', 'Insulate to the highest R-value you can afford — you cannot easily add more later'],
    2000, 10000, '1-2 weeks', ['step-shelter-3'], ['diy', 'contractor-needed'], ['spring', 'summer', 'fall']),

  step('step-shelter-6', M, 6, 'Windows & Doors',
    'Select energy-efficient windows and plan for passive solar gain and ventilation.',
    'South-facing windows capture winter solar heat. Use low-E coatings to reduce summer heat gain. Operable windows on opposite walls create cross-ventilation. Invest in quality exterior doors with good weatherstripping. Triple-pane windows are worth it in cold climates.',
    ['Size south-facing windows to equal 7-10% of floor area for good passive solar', 'Casement windows seal tighter than double-hung when closed'],
    2000, 15000, '1 week', ['step-shelter-3'], ['contractor-needed'], ['spring', 'summer', 'fall']),

  step('step-shelter-7', M, 7, 'Interior Walls',
    'Plan room divisions, finishes, and built-in storage.',
    'Drywall is standard and inexpensive. Tongue-and-groove wood paneling adds warmth and character. Plan for built-in shelving and storage in every room. Leave some walls unfinished initially if budget is tight. Consider sound insulation between bedrooms.',
    ['Built-in storage is more efficient than furniture in small homes', 'Finish one room completely before moving to the next for morale'],
    1000, 8000, '1-2 weeks', ['step-shelter-5'], ['diy'], ['spring', 'summer', 'fall', 'winter']),

  step('step-shelter-8', M, 8, 'Exterior Finish',
    'Choose siding material for durability and weather protection.',
    'Board-and-batten siding is classic and DIY-friendly. Metal siding is maintenance-free and fireproof. Wood clapboard looks beautiful but needs regular painting. Cement fiber is durable but heavy. Whatever you choose, install proper house wrap and flashing underneath.',
    ['Proper flashing around windows and doors prevents 90% of moisture problems', 'Metal siding near ground level deters rodents from entering'],
    2000, 15000, '1-2 weeks', ['step-shelter-4'], ['diy', 'contractor-needed'], ['spring', 'summer', 'fall']),

  step('step-shelter-9', M, 9, 'Outbuildings Planning',
    'Plan locations and purposes for barn, coop, greenhouse, and storage buildings.',
    'Place outbuildings considering wind protection, sun exposure, and proximity to the house. Chicken coops should be visible from the kitchen window. The greenhouse goes on the south side. Tool sheds go near work areas. Plan for future expansion. Check setback requirements for each structure.',
    ['Build the most-needed outbuilding first and add others as budget allows', 'Portable structures avoid permit requirements in many jurisdictions'],
    500, 20000, '1-2 weeks planning', [], ['planning', 'diy'], ['spring', 'summer', 'fall', 'winter']),

  step('step-shelter-10', M, 10, 'Workshop / Barn',
    'Design and build your primary working outbuilding.',
    'A workshop is essential for repairs, projects, and processing. Minimum 12x16 feet for a basic shop, 24x32 for a multi-use barn. Include a workbench, tool storage, good lighting, and electrical outlets every 4 feet. A concrete or gravel floor is easiest to maintain. Plan vehicle access for equipment.',
    ['Insulate at least the workshop portion — working in an unheated shop is miserable', 'Install more electrical circuits than you think you need'],
    2000, 30000, '2-4 weeks', ['step-shelter-9'], ['diy', 'contractor-needed'], ['spring', 'summer', 'fall']),
];
