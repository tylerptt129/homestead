import { mod, step } from './helpers';

const M = 'mod-security';
export const securityMod = mod(M, 'security', 10, 'Security & Safety', 'Protect your homestead with perimeter security, fire safety, emergency plans, and community networks.', 'Shield', '#CD5C5C', 60, 'beginner');

export const securitySteps = [
  step('step-sec-1', M, 1, 'Property Perimeter Assessment',
    'Walk your entire perimeter and identify access points, vulnerable areas, and sight lines.',
    'Walk every inch of your property boundary. Note where vehicles can access, where visibility is poor, and where fencing is needed. Identify natural barriers (cliffs, water) and gaps. Document everything with photos and notes on your site map.',
    ['Walk your perimeter at different times of day to understand visibility and lighting', 'Mark problem areas on your site map for prioritized improvement'],
    0, 0, '2-4 hours', [], ['planning', 'beginner'], ['spring', 'summer', 'fall']),

  step('step-sec-2', M, 2, 'Fencing & Gates',
    'Install perimeter fencing and secure gates based on your threat assessment.',
    'A visible fence deters casual trespassers. Locking gates control vehicle access. Choose fence type based on primary threats: wildlife, livestock containment, or security. A simple wire fence with a locked gate at the driveway is a good start. Post your property boundaries clearly.',
    ['A locked gate at your driveway entrance is the single best security investment', 'Post "Private Property" signs at regular intervals along your boundary'],
    1000, 10000, '1-2 weeks', ['step-sec-1'], ['diy', 'contractor-needed'], ['spring', 'summer', 'fall']),

  step('step-sec-3', M, 3, 'Lighting Plan',
    'Install motion-sensor and solar-powered lighting around buildings and paths.',
    'Motion-activated lights deter intruders and illuminate your way during chores. Solar-powered lights require no wiring. Light all building entrances, pathways, and the area around animal housing. Dark sky-friendly fixtures point down to avoid light pollution while still providing security.',
    ['Solar motion lights need no wiring and can be installed in 10 minutes each', 'Light the path between your house and animal housing — you will use it daily before dawn'],
    100, 1000, '1 weekend', [], ['diy', 'beginner'], ['spring', 'summer', 'fall']),

  step('step-sec-4', M, 4, 'Communication Systems',
    'Set up reliable communication: cell booster, radio, or satellite phone backup.',
    'Rural areas often have poor cell coverage. A cell signal booster can help. CB or ham radio provides communication when cell towers are down. A satellite communicator (like Garmin inReach) works anywhere. Program emergency numbers into all family members phones. Have a landline if available.',
    ['A cell signal booster often solves reception problems for under $300', 'Ham radio is free to use once licensed and works when all else fails'],
    50, 500, '1 day', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-sec-5', M, 5, 'Fire Safety & Prevention',
    'Create defensible space, position fire extinguishers, and plan water access for firefighting.',
    'Clear brush and flammable materials 30 feet around all structures (defensible space). Place fire extinguishers in the kitchen, workshop, barn, and each building. Ensure fire trucks can access your property. If you are far from a fire department, plan for self-reliance with water tanks and pumps.',
    ['Clear a 30-foot defensible space around every structure — this is your best wildfire protection', 'Keep ABC fire extinguishers in every building and check them annually'],
    100, 1000, '1-2 weekends', [], ['beginner', 'diy'], ['spring', 'summer']),

  step('step-sec-6', M, 6, 'First Aid Station',
    'Stock comprehensive first aid supplies and consider wilderness first aid training.',
    'Homestead injuries are common: cuts, burns, sprains, animal bites, insect stings. Stock a comprehensive first aid kit beyond a basic one: add a tourniquet, splints, burn dressings, and epinephrine if anyone has allergies. Take a wilderness first aid or EMT course. Know your nearest hospital route.',
    ['A wilderness first aid course is invaluable when help is 30+ minutes away', 'Stock a tourniquet and know how to use it — chainsaw and equipment injuries can be severe'],
    100, 500, '1 day', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-sec-7', M, 7, 'Emergency Evacuation Plan',
    'Create evacuation routes, go-bags, and a family communication plan.',
    'Plan two evacuation routes from your property. Pack go-bags for each family member with 72 hours of essentials. Include important documents, cash, medications, and pet supplies. Designate an out-of-area contact person. Practice the plan with your family at least once a year.',
    ['Keep go-bags by the door and check their contents every six months', 'Designate an out-of-area contact — local phones may be overloaded in emergencies'],
    50, 300, '1 day', [], ['planning', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-sec-8', M, 8, 'Weather Preparedness',
    'Prepare for your region-specific weather threats: storms, floods, extreme temperatures.',
    'Identify your biggest weather risks: tornadoes, hurricanes, ice storms, extreme heat, or blizzards. Prepare specific supplies for each threat. Ensure your shelter can handle the worst your area gets. Have backup heating, cooling, and water plans. A weather radio provides alerts when internet is down.',
    ['A NOAA weather radio with battery backup provides warnings when internet fails', 'Prepare for the worst weather event in your area in the last 50 years'],
    100, 1000, 'ongoing', [], ['planning', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-sec-9', M, 9, 'Neighbor & Community Network',
    'Build mutual aid relationships with neighbors for shared security and support.',
    'Introduce yourself to all neighbors within a mile. Exchange phone numbers and establish a check-in system. Discuss mutual aid: who has equipment to share, medical skills, or can watch your animals when you travel. A strong neighborhood network is your best security system.',
    ['Good neighbors are your most valuable security asset — invest in those relationships', 'Offer help first — lending a hand builds trust faster than anything'],
    0, 0, 'ongoing', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),
];
