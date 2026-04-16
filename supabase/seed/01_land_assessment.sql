-- Seed: Module 1 — Land Assessment & Site Planning
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'land-assessment',
    'Land Assessment & Site Planning',
    'Everything starts with knowing your land. This module walks you through evaluating your property from soil to skyline, ensuring every future decision is grounded in solid data about what you are working with.',
    'map-pin', 1, '#8B7355', 40, 'beginner'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Survey Property Boundaries',
   'Walk and document every boundary of your property. Know exactly where your land begins and ends before you build anything.',
   'Start by obtaining your plat map or deed description from the county recorder. Walk the entire perimeter with a GPS device or smartphone app, marking corners and noting any discrepancies with the official survey. Look for existing markers like iron pins, stone monuments, or blazed trees. If boundaries are unclear or disputed, hire a licensed surveyor — this investment prevents costly legal battles later. Document everything with photos and GPS coordinates. Pay special attention to easements, rights-of-way, and setback requirements that affect where you can build.',
   ARRAY['Always get a professional survey before building near property lines', 'Check for utility easements that cross your property — they limit what you can build', 'Walk boundaries with neighbors to establish good relationships early'],
   200, 800, '1-2 days', 1, '{}', ARRAY['beginner','critical'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Soil Testing',
   'Test your soil composition, pH, nutrients, and drainage capacity. Soil quality drives decisions about gardens, foundations, septic systems, and water management.',
   'Collect soil samples from multiple locations across your property at different depths (6 inches for gardens, 2-4 feet for building sites and septic). Send samples to your county extension office or a private lab for comprehensive analysis including pH, organic matter, NPK levels, micronutrients, and heavy metals. A perc test is essential if you plan on a septic system. Understanding your soil type — clay, sand, loam, or rocky — determines foundation requirements, drainage solutions, and what will grow. Map the results to identify your best building sites, garden areas, and problem zones.',
   ARRAY['Your county extension office often provides free or low-cost soil testing', 'Test in multiple seasons — soil conditions change with moisture levels', 'Keep a soil map and retest garden areas every 2-3 years as you amend'],
   50, 200, '1 day collection, 2-3 weeks for results', 2, '{}', ARRAY['beginner','diy'], ARRAY['spring','fall'], '{}'),

  (mod_id, 'Topography Mapping',
   'Map the elevation changes, slopes, and natural contours of your property. Topography determines water flow, building sites, and erosion management.',
   'Use a combination of satellite imagery, USGS topographic maps, and on-the-ground observation to map your land contours. Free tools like Google Earth Pro, CalTopo, or the USGS National Map viewer provide excellent starting points. Walk the property and note ridgelines, valleys, swales, and flat areas. Mark slopes steeper than 15% as they require special consideration for building and erosion control. Identify natural terraces and benches that make ideal building or garden sites. Understanding water flow across your landscape is crucial — contour lines reveal where water collects, flows, and where you might need swales or berms.',
   ARRAY['Download free USGS topo maps for your area from the National Map website', 'Use a basic handheld GPS to mark key elevation points as you walk', 'After a heavy rain, walk the property to see actual water flow patterns'],
   0, 500, '1-2 days', 3, '{}', ARRAY['beginner','diy'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Sun Exposure Analysis',
   'Track how sunlight moves across your property throughout the day and across seasons. Sun exposure determines optimal placement for gardens, solar panels, and living spaces.',
   'Spend a full day (ideally during equinox for balanced data) tracking sun and shade patterns across your property. Note which areas get full sun (6+ hours), partial sun (4-6 hours), and shade. Use a solar pathfinder or smartphone app like Sun Surveyor to predict seasonal changes. South-facing slopes get the most sun in the northern hemisphere. Consider how existing trees and structures cast shadows, especially in winter when the sun is low. Your best garden sites need full southern exposure. Solar panel placement requires unobstructed southern sky. The house should be positioned to maximize passive solar gain in winter while providing shade in summer.',
   ARRAY['Take photos from potential building sites at sunrise, noon, and sunset', 'Remember that deciduous trees block summer sun but allow winter sun through', 'South-facing slopes can be 1-2 USDA zones warmer than north-facing slopes on the same property'],
   0, 50, '2-4 hours observation + analysis', 4, '{}', ARRAY['beginner','diy'], ARRAY['spring','summer'], '{}'),

  (mod_id, 'Wind Pattern Assessment',
   'Observe and document prevailing wind directions and intensity. Wind affects building orientation, windbreaks, heating costs, and livestock comfort.',
   'Monitor wind patterns over at least a week, ideally across seasons. Note prevailing wind directions (usually from the west or northwest in most of the US), seasonal shifts, and how terrain features channel or block wind. Install a simple weather station or wind sock. Talk to neighbors about their experience with wind on the ridge or in the valley. Wind exposure dramatically affects heating costs — a house on an exposed ridge can cost 30-50% more to heat than one sheltered in a valley. Plan windbreaks using evergreen trees on the windward side of your homestead. Position livestock shelters with their backs to prevailing winter winds.',
   ARRAY['Prevailing winter winds and summer breezes often come from different directions', 'A good windbreak of evergreen trees can reduce heating costs by 25-30%', 'Valley floors can create frost pockets — cold air flows downhill and pools there'],
   0, 100, '1 week of observation', 5, '{}', ARRAY['beginner','diy','seasonal'], ARRAY['winter','fall'], '{}'),

  (mod_id, 'Drainage Assessment',
   'Evaluate how water moves across and through your property. Understanding drainage prevents flooded basements, failed septic systems, and erosion damage.',
   'Walk your property during and after a heavy rainstorm to observe actual drainage patterns. Note where water pools, where it flows, and where the ground stays saturated. Check for springs, seeps, and high water table areas. Dig test holes in potential building sites and check water level after 24 hours. Look for hydric soil indicators like mottled gray coloring or standing water. Map natural drainage channels and swales. A failed drainage assessment is one of the most expensive mistakes in homesteading — a flooded foundation or failed septic system costs thousands. Consider where you might need French drains, swales, rain gardens, or grading work.',
   ARRAY['Visit the property during the wettest season before committing to a building site', 'A perc test is required for septic permits and reveals drainage at depth', 'Look for cattails, willows, or rushes — they indicate persistently wet ground'],
   0, 300, '1 day + rainstorm observation', 6, '{}', ARRAY['beginner','critical','diy'], ARRAY['spring','winter'], '{}'),

  (mod_id, 'Access Roads',
   'Plan and establish reliable year-round access to your property. Good access is essential for construction, deliveries, emergency vehicles, and daily life.',
   'Evaluate your existing driveway or access road for all-season reliability. Can a fire truck reach your building site? Can a concrete truck or lumber delivery navigate the turns? Grade and surface are critical — a 12-15% maximum grade is ideal, with proper drainage ditches and culverts at low points. Gravel roads need a good base layer (6-8 inches of compacted road base) topped with 2-4 inches of crushed surface stone. Plan turnouts if the road is long and narrow. Consider snowplowing needs and mud season challenges. If building a new road, minimize cuts and fills, follow contour lines where possible, and always plan water crossings properly with culverts rated for your area peak flow.',
   ARRAY['A 12-foot-wide road is minimum for two-way traffic; 16 feet is comfortable', 'Install culverts at every low point and natural drainage crossing', 'Budget for annual grading and gravel replenishment — roads need maintenance'],
   500, 5000, '1-2 weeks', 7, '{}', ARRAY['diy','contractor-needed','critical'], ARRAY['summer','fall'], '{}'),

  (mod_id, 'Zoning & Permits',
   'Research all zoning regulations, building codes, and permit requirements that apply to your property. Understanding the rules prevents costly violations and project shutdowns.',
   'Visit your county planning and zoning office (or their website) to obtain a copy of all regulations affecting your parcel. Key things to determine: zoning classification (agricultural, residential, rural), minimum lot sizes, setback requirements from property lines and roads, building height limits, septic system requirements, well permits, livestock restrictions, and whether accessory dwelling units are allowed. Check for conservation easements, wetland designations, flood zones (FEMA maps), and historic district rules. Some counties require permits for driveways, ponds, and even fences. Understanding these rules before you plan saves enormous headaches. Build relationships with your local building inspector — they are usually willing to answer questions informally before you apply for permits.',
   ARRAY['County agricultural zoning is often the most permissive for homesteading activities', 'Some states have right-to-farm laws that protect agricultural activities from nuisance complaints', 'Check if your county has adopted the International Residential Code or has its own building standards'],
   100, 1000, '1-4 weeks of research', 8, '{}', ARRAY['critical','beginner'], '{}', '{}'),

  (mod_id, 'Utility Access Evaluation',
   'Assess the availability, cost, and feasibility of connecting to utilities or establishing off-grid alternatives for power, water, communications, and waste.',
   'Contact local utility companies to determine connection costs and feasibility for electric, natural gas (if available), water, sewer, phone, and internet. Get written quotes — utility extension costs can range from a few hundred to tens of thousands of dollars depending on distance from existing infrastructure. For rural properties, evaluate well drilling costs (contact local well drillers for typical depths and yields in your area), septic system requirements and costs, solar or wind power feasibility, and internet options (satellite, fixed wireless, cellular). Create a comparison spreadsheet of grid-connected vs. off-grid costs for each utility over 5, 10, and 20 years. Sometimes the cost of extending power lines makes solar more economical, or the cost of a septic system makes composting toilets worth considering.',
   ARRAY['Get at least 3 quotes for utility line extensions — costs vary dramatically', 'Check if fiber optic or fixed wireless internet is available or planned for your area', 'Well drilling costs vary by depth — ask neighbors about their well depths and yields'],
   0, 200, '1-2 days of research and calls', 9, '{}', ARRAY['beginner','critical'], '{}', '{}'),

  (mod_id, 'Create Master Site Plan',
   'Synthesize all your assessment data into a comprehensive site plan that maps out where everything will go on your property for the next 5-20 years.',
   'This is where all your research comes together into a single master plan. Using graph paper, drafting software, or a tool like Google Earth overlay, create a scaled map showing: property boundaries, contour lines, drainage patterns, sun/shade zones, wind exposure, existing features (trees, rocks, water), and proposed locations for house, outbuildings, garden, orchard, pastures, roads, water systems, and utilities. Apply permaculture zone planning — Zone 1 (most visited, closest to house: herb garden, chicken coop), Zone 2 (daily visit: main garden, compost, orchard), Zone 3 (occasional: pastures, field crops), Zone 4 (semi-wild: woodlot, foraging), Zone 5 (wild: nature preserve). Consider phasing — what you build first, second, third over the years. Get input from experienced homesteaders or hire a permaculture designer for a consultation. This plan is a living document that will evolve, but starting with a thoughtful master plan prevents random placement that causes problems later.',
   ARRAY['Use permaculture zone planning to minimize daily walking distances', 'Plan for 20 years even if you are building in phases — it costs nothing to plan ahead', 'Consider prevailing wind when placing compost, livestock, and smoke-producing activities downwind from the house'],
   0, 2000, '1-2 weeks', 10, '{}', ARRAY['beginner','critical'], '{}', '{}');

END $$;
