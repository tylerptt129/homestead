-- Seed: Module 9 — Tools, Equipment & Workshop
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'tools',
    'Tools, Equipment & Workshop',
    'The right tools make every job easier and safer. This module helps you inventory what you need, set up an efficient workshop, maintain your equipment, and build the repair skills that keep a homestead running without constant outside help.',
    'wrench', 9, '#708090', 40, 'beginner'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Essential Hand Tools Inventory',
   'Build a complete inventory of hand tools needed for homestead construction, maintenance, gardening, and livestock care.',
   'Start with the essentials and buy quality over quantity. Core hand tools every homestead needs: framing hammer, claw hammer, tape measure (25-foot), speed square, torpedo level and 4-foot level, handsaw, hacksaw, pry bar, set of screwdrivers (Phillips and flat), adjustable wrenches (8-inch and 12-inch), pliers (slip-joint, needle-nose, channel-lock), socket set, Allen key set, utility knife, wire cutters, tin snips, wood chisels, files and rasps, a sharpening stone, and a come-along winch. For gardening: digging fork, spade, round-point shovel, garden rake, hoe, hand pruners, loppers, bow saw, and wheelbarrow. Quality tools last a lifetime — buy the best you can afford and maintain them. Watch estate sales, farm auctions, and online marketplaces for quality used tools at a fraction of retail.',
   ARRAY['Buy quality tools once rather than cheap tools repeatedly — they last a lifetime', 'Estate sales and farm auctions are goldmines for quality used tools at fraction of retail', 'A good sharpening stone and learning to use it makes every edged tool work better'],
   200, 1000, '1 day to inventory and purchase', 1, '{}', ARRAY['beginner','critical'], '{}', '{}'),

  (mod_id, 'Power Tools Assessment',
   'Evaluate which power tools are worth investing in based on your planned projects and decide between corded, cordless, and stationary options.',
   'Power tools dramatically speed up construction and maintenance work. Essential power tools for a homestead: drill/driver (cordless, 20V lithium), circular saw (for framing and sheet goods), reciprocating saw (demolition and pruning), jigsaw (curved cuts), angle grinder (metal cutting and grinding), and an impact driver (lag bolts and deck screws). Nice to have: miter saw (accurate crosscuts), table saw (ripping boards), planer and jointer (milling rough lumber), and a welder (MIG is easiest to learn). Standardize on one battery platform for cordless tools to share batteries. Stationary tools (table saw, drill press, band saw) are more precise and powerful but require workshop space. If you plan to mill your own lumber, a chainsaw mill or bandsaw mill opens up tremendous possibilities using trees from your own land.',
   ARRAY['Standardize on one cordless battery platform — sharing batteries saves hundreds of dollars', 'A cordless drill/driver and circular saw handle 80% of homestead building tasks', 'A MIG welder is the easiest welding method to learn and handles most farm repairs'],
   500, 3000, '2-4 hours research + shopping', 2, '{}', ARRAY['beginner','diy'], '{}', '{}'),

  (mod_id, 'Workshop Layout',
   'Design an efficient workshop layout with zones for woodworking, metalwork, repair, and project staging.',
   'A well-designed workshop has zones for different activities: a woodworking area centered around the workbench and table saw, a metalworking and welding area (separated from wood dust for fire safety), a repair and maintenance bench, and a project staging area where you can spread out. Place the workbench near a window for natural light and supplement with good overhead lighting and task lighting. Install a dust collection system or at minimum a shop vacuum near each stationary tool. Run electrical circuits dedicated to the workshop with plenty of outlets (every 4 feet along the bench, plus 220V for a welder and air compressor). A concrete floor is ideal — it is durable, easy to clean, and supports heavy equipment. Wall-mount tools and supplies to keep floor space clear. A woodstove or infrared heater makes the workshop usable year-round.',
   ARRAY['Separate metalworking from woodworking areas for fire safety', 'Good lighting is essential — supplement overhead lights with adjustable task lights', 'A concrete floor is the best workshop surface — durable, cleanable, and supports heavy loads'],
   200, 2000, '1-2 weekends', 3, '{}', ARRAY['diy'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Tool Storage & Organization',
   'Set up organized, accessible tool storage that keeps everything protected, visible, and easy to find when you need it.',
   'The cardinal rule of tool organization: a place for everything and everything in its place. Pegboard or French cleat systems on the wall above your workbench keep frequently used tools visible and within reach. Shadow outlines (trace each tool on the pegboard) make it obvious when something is missing. Use drawer units for small items: screws, nails, bolts, fittings, and hardware sorted by type and size. Keep garden tools in a dedicated area near the garden — wall hooks or a pallet-based vertical rack work well. Oil metal tools before storing to prevent rust. Keep an inventory list of all tools, especially if multiple family members use the workshop. Invest in a quality toolbox or tool bag for carrying tools to job sites around the property — you should not have to walk back to the workshop for forgotten tools.',
   ARRAY['Shadow outlines on pegboard make it immediately obvious when a tool is missing', 'Oil metal tools before long-term storage to prevent rust', 'A dedicated carry bag for common tools saves countless trips back to the workshop'],
   100, 1000, '1 weekend', 4, '{}', ARRAY['beginner','diy'], '{}', '{}'),

  (mod_id, 'Equipment Maintenance Schedule',
   'Create a regular maintenance schedule for all equipment. Preventive maintenance costs a fraction of repairs and keeps everything running when you need it.',
   'Create a maintenance calendar for every piece of equipment on the homestead. For engines (mower, tiller, chainsaw, generator, tractor): change oil per manufacturer schedule, replace air and fuel filters annually, inspect spark plugs, check tire pressure, grease fittings, and run stabilized fuel or drain carburetors for seasonal storage. For hand tools: sharpen blades and edges regularly, oil wooden handles annually, tighten loose heads, and replace worn grips. For power tools: clean sawdust and debris after each use, check blades and bits for dullness, lubricate per manual, and inspect cords for damage. Schedule annual maintenance days — one in spring (prep for season) and one in fall (prep for storage). Well-maintained equipment lasts 2-3 times longer and is safer to use than neglected equipment.',
   ARRAY['Schedule maintenance days in spring (prep for season) and fall (winterize and store)', 'Sharp tools are safer than dull ones — they require less force and are more predictable', 'Run fuel stabilizer in any gasoline engine that sits for more than 30 days'],
   50, 200, '1 day setup + quarterly maintenance', 5, '{}', ARRAY['beginner','diy'], ARRAY['spring','fall'], '{}'),

  (mod_id, 'Chainsaw & Forestry Gear',
   'Equip and learn to safely use a chainsaw and basic forestry tools. Chainsaws are essential for firewood, clearing, and lumber processing.',
   'A chainsaw is arguably the most important power tool on a wooded homestead. Buy a quality saw from a professional brand (Stihl, Husqvarna) — a 16-20 inch bar handles most homestead tasks. Essential safety gear (non-negotiable): chainsaw chaps, safety helmet with face screen and hearing protection, heavy leather gloves, and steel-toe boots. Learn proper technique: attend a chainsaw safety course, watch reputable instructional videos, and practice with an experienced operator before felling trees. Key skills: safe felling with proper notch cuts, limbing, bucking, and basic sharpening. Additional forestry tools: felling wedges, a peavey or log cant hook for rolling logs, a splitting maul and wedges for firewood, and a log arch or ATV winch for skidding. A cord of firewood requires about 3-4 hours of chainsaw work and 6-8 hours of splitting for an experienced operator.',
   ARRAY['Chainsaw chaps, helmet with face screen, and hearing protection are NON-NEGOTIABLE safety gear', 'Take a chainsaw safety course before felling your first tree — it could save your life', 'Keep the chain sharp — a sharp chain cuts fast with light pressure; a dull chain is dangerous'],
   200, 1500, '1 day for gear + ongoing skills', 6, '{}', ARRAY['critical','diy'], ARRAY['fall','winter'], '{}'),

  (mod_id, 'Vehicle & ATV Needs',
   'Assess your vehicle and ATV needs for property access, hauling, and daily homestead operations.',
   'Evaluate your transportation needs: a reliable 4WD truck is the backbone — it hauls feed, supplies, lumber, compost, and livestock. Consider payload capacity (3/4 ton or 1 ton for heavy homestead use), towing capacity (trailers are essential), and ground clearance for rough roads. An ATV or UTV is incredibly useful for daily chores, fence checking, firewood hauling, and general property access on trails too narrow for a truck. A utility trailer (6x10 or 6x12) multiplies your hauling capacity for minimal cost. For larger properties, a compact tractor (25-50 HP) with a front-end loader, box blade, and mowing deck handles an enormous range of tasks from grading roads to moving hay bales. Buy used where possible — good used trucks, ATVs, and tractors at auction cost 30-50% of new.',
   ARRAY['A 3/4-ton 4WD truck handles most homestead hauling, towing, and rough road needs', 'A UTV or ATV with a small trailer is invaluable for daily chores and property access', 'Buy quality used equipment at auction — 30-50% savings over new is common'],
   0, 500, '2-4 hours assessment', 7, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Fuel Storage',
   'Set up safe, code-compliant fuel storage for gasoline, diesel, and propane that keeps your equipment running and your homestead prepared.',
   'Store fuel safely and legally. Gasoline: use approved safety cans (no more than 5 gallons each) stored in a cool, well-ventilated area away from the house and any ignition sources. For larger volumes, use an above-ground fuel tank on a secondary containment pad. Add fuel stabilizer (Sta-Bil or equivalent) to gasoline that will sit more than 30 days. Diesel stores much longer than gasoline but can grow algae — add a biocide for long-term storage. Propane: store 20-lb cylinders outdoors (never inside a building) on a level surface. For a permanent propane installation, a licensed dealer will set up a 250-500 gallon tank with proper clearances and connections. Keep a minimum emergency fuel reserve: enough gasoline to run your generator for 3-5 days and enough propane or firewood for 2 weeks of heating.',
   ARRAY['Gasoline degrades in 30-60 days without fuel stabilizer — always add stabilizer for storage', 'Store propane cylinders outdoors, upright, on a level surface away from the building', 'Maintain a 3-5 day fuel reserve for your generator as emergency preparedness'],
   100, 500, '1 day', 8, '{}', ARRAY['critical','diy'], '{}', '{}'),

  (mod_id, 'Repair Skills Inventory',
   'Assess your current repair skills and identify key skills to develop. Self-reliance means fixing things yourself when the repair shop is an hour away.',
   'Create an honest assessment of your current skills in: basic carpentry, plumbing, electrical, small engine repair, welding, sewing, and mechanical repair. Rate yourself beginner, intermediate, or advanced in each area. Then identify which skills are most critical for your homestead plan — if you heat with wood, chainsaw and wood stove maintenance are essential; if you have livestock, basic fence repair and animal first aid are must-haves. Build skills incrementally: take a community college welding class, watch YouTube repair videos and practice on low-stakes projects, attend extension service workshops, and find a mentor for hands-on learning. The most valuable homestead skill is problem-solving: the ability to diagnose an issue, research solutions, and improvise with available materials. Start a reference library of repair manuals for your specific equipment.',
   ARRAY['Rate your current skills honestly and prioritize learning the gaps most critical to your plan', 'Community college and extension service classes are affordable ways to build trade skills', 'Keep equipment manuals organized and accessible — they are invaluable during repairs'],
   0, 500, '2-4 hours assessment + ongoing learning', 9, '{}', ARRAY['beginner','diy'], '{}', '{}'),

  (mod_id, 'Borrowing & Sharing Network',
   'Build a network of neighbors and friends for sharing expensive, infrequently used tools and equipment.',
   'No homestead needs to own every tool. Build relationships with neighbors for sharing equipment that is expensive and infrequently used: post hole diggers, wood chippers, stump grinders, cement mixers, pressure washers, large trailers, and specialized agricultural equipment. Formalize sharing with clear expectations: who maintains the equipment, fuel costs, what happens if something breaks, and scheduling. Many rural communities have informal tool libraries or equipment co-ops. Start by being the generous neighbor — lend freely and establish trust. Some homesteaders form buying co-ops to purchase bulk materials (fence posts, gravel, feed) at lower per-unit costs. The relationships you build through sharing equipment often become the most valuable resource on your homestead — far more valuable than any tool.',
   ARRAY['Be the generous neighbor first — lend freely and the sharing culture will grow', 'Set clear expectations before sharing expensive equipment — maintenance, fuel, and breakage', 'Buying co-ops for bulk materials can save everyone 20-40% on common supplies'],
   0, 50, '2-4 hours to build initial contacts', 10, '{}', ARRAY['beginner'], '{}', '{}');

END $$;
