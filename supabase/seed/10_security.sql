-- Seed: Module 10 — Security & Safety
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'security',
    'Security & Safety',
    'A safe homestead is a sustainable homestead. This module covers property security, fire prevention, emergency preparedness, communication systems, and building a community safety network that keeps your family and property protected.',
    'shield', 10, '#B22222', 30, 'intermediate'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Property Perimeter Assessment',
   'Walk and evaluate your entire property perimeter to identify vulnerabilities, access points, and areas needing attention.',
   'Walk every foot of your property boundary with fresh eyes toward security. Note all access points — roads, trails, paths, and gaps in vegetation where someone could enter. Identify natural barriers (cliffs, dense brush, water) and areas needing reinforcement. Check sight lines from the house — can you see the driveway and main approach? Note blind spots created by terrain or vegetation. Assess your property from an outsider perspective: where would you enter if you wanted to remain unseen? Mark locations for future gates, cameras, or lighting. Many rural properties have unused old roads or logging trails that provide unmonitored access. This assessment should inform your fencing, lighting, and communication plans.',
   ARRAY['Walk your boundary from an outsider perspective — where are the blind spots?', 'Old logging roads and game trails can provide unmonitored access to your property', 'Good sight lines from the house to the driveway are your first layer of awareness'],
   0, 100, '2-4 hours', 1, '{}', ARRAY['beginner','critical'], '{}', '{}'),

  (mod_id, 'Fencing & Gates',
   'Install perimeter fencing and gates that define your property boundary, manage livestock, and control access.',
   'Fencing serves multiple purposes: livestock containment, wildlife exclusion, property boundary marking, and access control. A gated entry with a visible address marker is both practical (emergency services need to find you) and sends a clear signal that the property is actively managed. For the main entrance, install a substantial gate that can be locked — pipe gates, ranch gates, or automated gates depending on your budget. Cross-fence interior areas for livestock management and to create zones. Fence your garden area to exclude deer (8-foot fence) or use electric fence. Consider a fenced yard around the house for children and dogs. All fencing should be maintained regularly — a sagging, broken fence invites both animal escapes and human trespassing.',
   ARRAY['A visible, well-maintained entrance gate signals that the property is actively managed', 'Post your property address clearly at the road for emergency services', 'Maintain fences regularly — a broken fence invites problems from all directions'],
   500, 5000, '1-3 weeks', 2, '{}', ARRAY['diy','contractor-needed'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Lighting Plan',
   'Design exterior lighting that illuminates key areas, deters intruders, and helps you navigate safely during predawn and evening chores.',
   'Strategic lighting improves both security and daily quality of life. Key areas to illuminate: the driveway and main approach, all building entrances, the area between house and outbuildings (your chore path), and livestock areas. Solar-powered motion-sensor lights are ideal for homesteads — no wiring needed, no ongoing electricity cost, and the motion activation provides immediate awareness of activity. Place lights at building corners to eliminate dark spots. Use warm-temperature LEDs (2700-3000K) to minimize light pollution and maintain your night sky view. Pathway lights along chore routes prevent twisted ankles during dark winter morning chores. Consider a manually controlled floodlight for the main yard that you can switch on if you hear disturbances. Avoid always-on lighting — it wastes energy, disrupts wildlife, and provides constant illumination that actually helps intruders see what they are doing.',
   ARRAY['Solar-powered motion sensor lights require no wiring and provide instant awareness', 'Light your chore paths for safe predawn and evening livestock tending', 'Motion-activated is better than always-on — it alerts you and startles intruders'],
   200, 2000, '1-2 weekends', 3, '{}', ARRAY['diy'], '{}', '{}'),

  (mod_id, 'Communication Systems',
   'Establish reliable communication for emergencies, daily coordination, and staying connected despite rural cell coverage challenges.',
   'Rural homesteads often have poor or no cell service. Build redundancy into your communication systems. Options to evaluate: cell signal boosters (WeBoost or similar can dramatically improve weak signals), satellite internet (Starlink provides broadband anywhere with a view of the sky), ham radio (reliable emergency communications independent of all infrastructure — get your amateur radio license), GMRS or FRS two-way radios (excellent for on-property communication between family members doing separate chores), CB radio (short-range but requires no license), satellite messenger (Garmin inReach or SPOT for emergency SOS anywhere), and a landline if available (works during power outages unlike most cell service). Post emergency numbers prominently: fire, ambulance, poison control, your vet, and trusted neighbors.',
   ARRAY['A cell signal booster can transform unusable signal into reliable service', 'GMRS radios are invaluable for coordinating between family members across the property', 'A ham radio license gives you emergency communication independent of all infrastructure'],
   100, 1000, '1-2 days', 4, '{}', ARRAY['critical','diy'], '{}', '{}'),

  (mod_id, 'Fire Safety & Prevention',
   'Implement comprehensive fire prevention and suppression measures. Rural properties are often far from fire departments and must be prepared for self-reliance.',
   'Fire is one of the most devastating risks on a homestead. Create defensible space around all structures: clear dry vegetation, overhanging branches, and combustible materials within 30 feet of buildings (100 feet in fire-prone areas). Install smoke detectors in every building and test them monthly. Keep fire extinguishers (minimum ABC-rated) in the house, workshop, barn, and near any heat source. Install a fire extinguisher at each building entrance. For rural properties far from a fire department, consider a water supply dedicated to firefighting — a pond, tank, or hydrant that fire trucks can access. Clean chimneys annually (creosote buildup causes chimney fires). Store flammable materials (gasoline, solvents, oily rags) in approved containers away from structures. Create and practice a family fire escape plan from every building.',
   ARRAY['Create 30 feet of defensible space around every structure — more in fire-prone areas', 'Clean wood stove chimneys annually — creosote buildup is the leading cause of chimney fires', 'Keep fire extinguishers at every building entrance — you need them immediately, not in the back room'],
   100, 500, '1-2 weekends', 5, '{}', ARRAY['critical','diy'], ARRAY['fall','spring'], '{}'),

  (mod_id, 'First Aid Station',
   'Set up comprehensive first aid kits and establish emergency medical protocols. Rural homesteads need more extensive first aid capability than suburban homes.',
   'Build a substantial first aid kit that goes well beyond the basic drugstore variety. Homestead injuries tend toward cuts, punctures, burns, sprains, splinters, insect stings, and animal-related injuries. Essential supplies: various bandages and gauze, medical tape, butterfly closures and wound closure strips, antibiotic ointment, burn cream, antiseptic (betadine, alcohol), pain relief (ibuprofen, acetaminophen), antihistamines (Benadryl for allergic reactions), tweezers, scissors, SAM splint, elastic bandages, tourniquet, emergency blanket, and a comprehensive first aid manual. Take a Wilderness First Aid or First Responder course — rural response times can be 30-60+ minutes. Stock medications for common livestock emergencies too. Keep first aid kits in the house, workshop, vehicle, and a grab-bag by the door.',
   ARRAY['Take a Wilderness First Aid course — rural ambulance response times can exceed 30 minutes', 'Keep first aid kits in the house, workshop, vehicle, AND a grab-bag by the door', 'Learn to use butterfly closures for wound closure — many cuts can be managed without stitches'],
   100, 500, '1 day', 6, '{}', ARRAY['critical','beginner'], '{}', '{}'),

  (mod_id, 'Emergency Evacuation Plan',
   'Create a comprehensive evacuation plan for fire, flood, and other emergencies. Know exactly what to grab and where to go.',
   'Create written evacuation plans for multiple scenarios: wildfire, flood, severe weather, and structure fire. For each scenario, document: primary and alternate escape routes from the property, a meeting point for all family members, what to take (go-bags packed and ready), who handles which livestock evacuation tasks, destination points (neighbor, shelter, hotel), and communication plan if separated. Keep go-bags packed with: documents (copies of deeds, insurance, IDs), 72 hours of medications, cash, phone chargers, change of clothes, water, and food bars. For livestock evacuation, pre-plan: which animals load first, where they will go (pre-arrange with a neighbor or fairgrounds), and practice loading animals into trailers regularly so they are not panicked during a real emergency. Review and practice your plan twice a year.',
   ARRAY['Pre-pack go-bags with documents, medications, cash, and 72 hours of essentials', 'Practice livestock loading regularly so it is not chaotic during a real emergency', 'Pre-arrange an evacuation destination for your animals with a neighbor or local fairgrounds'],
   0, 100, '1 day to plan + biannual practice', 7, '{}', ARRAY['critical','beginner'], '{}', '{}'),

  (mod_id, 'Weather Preparedness',
   'Prepare for severe weather events common to your region: winter storms, tornadoes, hurricanes, extreme heat, and power outages.',
   'Identify the severe weather risks specific to your region and prepare for each. Winter storms: ensure adequate firewood (minimum 4 cords for primary wood heat), insulated pipes with heat tape on vulnerable sections, food and water reserves, and battery-powered weather radio. Tornadoes: identify shelter areas (basement, interior room), secure outdoor items that become projectiles, and maintain weather alerts. Extreme heat: shade for livestock, extra water reserves, cooling options. All scenarios: maintain a minimum 2-week supply of food, water, medications, and fuel. A weather station on your property provides hyperlocal data. Sign up for NOAA weather alerts for your county. If your property is in a flood zone, elevate critical infrastructure and have a flood response plan. The key to weather preparedness is completing it before you need it — everything is harder in an emergency.',
   ARRAY['Stock a minimum 2-week supply of food, water, medications, and fuel', 'A NOAA weather radio with battery backup provides alerts even during power outages', 'Complete all preparations before storm season — everything is harder in an emergency'],
   200, 1000, '1-2 weekends', 8, '{}', ARRAY['critical','seasonal'], ARRAY['fall','spring'], '{}'),

  (mod_id, 'Firearm Safety',
   'If firearms are part of your homestead plan, establish safe storage, handling practices, and training for predator defense and wildlife management.',
   'Many homesteaders keep firearms for predator defense (protecting livestock from coyotes, bears, or mountain lions), wildlife management, and hunting for food. If firearms are part of your plan, safety is paramount. Essential practices: store all firearms in a locked safe or cabinet, separate from ammunition; every person who may handle a firearm must complete a safety course; establish and enforce the four fundamental rules (treat every firearm as loaded, never point at anything you are not willing to destroy, keep finger off trigger until ready to shoot, know your target and what is beyond it). For predator defense, identify what predators are active in your area and what caliber and firearm type is appropriate. Practice regularly at a range. If firearms are not part of your plan, implement alternative predator deterrents: livestock guardian dogs, electric fencing, lights, and alarms.',
   ARRAY['Store firearms locked and separate from ammunition — no exceptions', 'Every person on the homestead who may handle firearms must complete a safety course', 'The four fundamental rules of firearm safety are non-negotiable: always treat as loaded, mind your muzzle, trigger discipline, know your backstop'],
   100, 500, '1 day course + ongoing practice', 9, '{}', ARRAY['intermediate'], '{}', '{}'),

  (mod_id, 'Neighbor & Community Network',
   'Build a network of trusted neighbors who look out for each other, share resources, and provide mutual aid during emergencies.',
   'Your neighbors are your most valuable security and safety resource. Introduce yourself to every neighbor within a mile of your property. Exchange phone numbers and establish a communication plan (group text, radio channel). Share information about suspicious activity. Offer help and accept help — the reciprocity builds trust and creates a community that watches out for each other. Join or start a neighborhood watch or rural mutual aid group. Know which neighbors have medical training, heavy equipment, generators, or other capabilities that complement yours. Many rural communities have volunteer fire departments — consider joining. Attend local community events, town meetings, and farmers markets to build your network. In a serious emergency (extended power outage, severe weather, wildfire), your community network is your most important resource.',
   ARRAY['Introduce yourself to every neighbor within a mile — exchange phone numbers', 'Join the volunteer fire department if one exists — it builds deep community connections', 'Mutual aid during emergencies is the single most valuable safety resource you can have'],
   0, 100, 'Ongoing — start immediately', 10, '{}', ARRAY['beginner','critical'], '{}', '{}');

END $$;
