-- Seed: Module 2 — Water Systems
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'water',
    'Water Systems',
    'Water is life on a homestead. This module covers everything from finding and securing a reliable water source to building filtration, storage, irrigation, and recycling systems that keep your homestead hydrated year-round.',
    'droplets', 2, '#4A90D9', 80, 'intermediate'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Identify Water Sources',
   'Locate and evaluate all potential water sources on and near your property including wells, springs, streams, ponds, and rainwater potential.',
   'Survey your property for every possible water source. Walk the land after rain and during dry spells to find springs, seeps, and seasonal streams. Check USGS water resource maps for aquifer data and well depth reports in your area. Talk to neighbors about their water sources, well depths, and flow rates. Evaluate each source for year-round reliability, water quality, legal water rights, and development cost. In the western US, water rights are a serious legal matter — verify what rights convey with your property. A reliable homestead typically needs 50-100 gallons per person per day plus livestock and irrigation needs.',
   ARRAY['Contact your state geological survey for well log data in your area', 'Springs that flow year-round are gold — protect and develop them carefully', 'In western states, check water rights thoroughly before purchasing property'],
   0, 500, '2-3 days research + field survey', 1, '{}', ARRAY['critical','beginner'], ARRAY['spring','summer'], '{}'),

  (mod_id, 'Well Drilling or Assessment',
   'If using a well, assess an existing well or plan for drilling a new one. Wells are the most common primary water source for rural homesteads.',
   'For existing wells, get a flow rate test (pump test), water quality lab analysis, and inspection of the casing, cap, and pump system. For new wells, obtain well log data from nearby properties to estimate drilling depth and likely yield. Get quotes from at least 3 licensed well drillers. Typical residential wells are 100-400 feet deep depending on your geology. A minimum yield of 5 gallons per minute is desirable for a household; 1-2 GPM can work with adequate storage tanks. Ensure your well is properly permitted, has a sanitary well cap, and meets setback distances from septic systems (typically 100 feet minimum). Budget for the pump, pressure tank, electrical connection, and water treatment.',
   ARRAY['Get well driller references and check reviews — a bad well is expensive to fix', 'Ask drillers about typical yields at various depths in your specific area', 'A low-yield well (1-2 GPM) paired with a large storage tank can work fine for most homesteads'],
   3000, 15000, '2-5 days drilling + setup', 2, '{}', ARRAY['contractor-needed','critical'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Rainwater Catchment Design',
   'Design a rainwater collection system using roof surfaces, gutters, and storage tanks. Rainwater is excellent for gardens, livestock, and with proper treatment, household use.',
   'Calculate your catchment potential: every 1,000 square feet of roof collects about 600 gallons per inch of rainfall. A 2,000 sq ft roof in an area with 40 inches of annual rainfall can collect nearly 48,000 gallons per year. Design your system with properly sized gutters (5-inch minimum for most roofs), first-flush diverters to discard the first dirty runoff, leaf screens, and food-grade storage tanks. Position tanks on the downhill side of buildings for gravity-fed distribution, or plan for a pump system. Consider buried cisterns in freeze-prone climates. Check local regulations — most states allow rainwater harvesting, but some have restrictions. A well-designed rainwater system can supplement or even replace a well for many homestead uses.',
   ARRAY['First-flush diverters are essential — they discard the first 10 gallons of dirty roof runoff', 'Dark-colored tanks prevent algae growth; keep tanks out of direct sunlight if possible', 'Check your state laws on rainwater harvesting — most encourage it, a few restrict it'],
   200, 2000, '1-2 weekends', 3, '{}', ARRAY['diy','beginner'], ARRAY['spring','summer'], '{}'),

  (mod_id, 'Storage Tank Sizing',
   'Calculate and install adequate water storage for your household, livestock, garden, and emergency needs. Proper storage bridges gaps between supply and demand.',
   'Size your storage based on daily consumption multiplied by the number of days you want as a buffer. A family of four uses roughly 200 gallons per day for household needs. Add livestock water (chickens: 0.5 gal/day each, goats: 2-4 gal/day, cattle: 30-50 gal/day) and garden irrigation. For well-dependent homesteads, a minimum 500-gallon pressure tank is recommended, with 1,500-2,500 gallons for low-yield wells. For rainwater systems, size tanks to bridge your longest dry period. Options include polyethylene tanks (most affordable), fiberglass (durable, UV resistant), concrete cisterns (permanent, underground), and stainless steel (food-grade, long-lasting). Install tanks on a level, compacted pad that can support the full weight (water weighs 8.34 lbs per gallon).',
   ARRAY['Water weighs 8.34 lbs per gallon — a 2,500-gallon tank weighs over 10 tons full', 'Underground tanks avoid freezing but require a pump', 'Always have a minimum 3-day emergency water reserve (1 gallon per person per day minimum)'],
   500, 5000, '1-2 days', 4, '{}', ARRAY['diy','critical'], '{}', '{}'),

  (mod_id, 'Filtration System',
   'Design and install water filtration and purification appropriate for your water source quality and intended uses.',
   'Start with a comprehensive water test from a certified lab — test for bacteria (coliform, E. coli), minerals (iron, manganese, hardness), pH, nitrates, arsenic, lead, and any local contaminants of concern. Match your filtration to what you actually need to remove. Common systems include sediment filters (5-20 micron for particles), activated carbon (taste, odor, chlorine, some chemicals), UV sterilization (bacteria and viruses), reverse osmosis (dissolved solids, heavy metals), and water softeners (hardness). A whole-house system typically starts with sediment, then carbon, then specific treatment. Point-of-use RO under the kitchen sink handles drinking water. Size your system for your actual flow rate needs. Budget for replacement filters and maintenance.',
   ARRAY['Get a lab test before choosing any filtration — don''t guess at what you need to remove', 'UV sterilization requires clear water to work properly — always pre-filter sediment', 'Whole-house systems need maintenance — set calendar reminders for filter changes'],
   200, 3000, '1-2 days', 5, '{}', ARRAY['diy','critical'], '{}', '{}'),

  (mod_id, 'Plumbing Rough-In',
   'Plan and install the main plumbing distribution system from your water source to your house, outbuildings, and outdoor fixtures.',
   'Design your plumbing layout starting from the water source, through treatment, to the pressure tank, and then distributed throughout the house and property. Use 1-inch main supply lines (minimum 3/4-inch for branches) and plan for future expansion. Bury supply lines below your local frost line (check NOAA frost depth maps for your area). Install shut-off valves at every branch point and at each building entry. Use PEX tubing for flexibility and freeze resistance, or copper for durability. A manifold system with home-run PEX lines to each fixture provides better pressure and easier maintenance than trunk-and-branch layouts. Include freeze protection: heat tape on exposed pipes, insulation on all accessible pipes, and drain valves at low points for winterization if needed.',
   ARRAY['Bury water lines below your frost line — check your county for the required depth', 'Install shut-off valves generously — you''ll thank yourself when repairs are needed', 'PEX tubing is more forgiving than copper in freezing conditions and easier to install DIY'],
   500, 5000, '1-2 weeks', 6, '{}', ARRAY['diy','contractor-needed'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Hot Water System',
   'Choose and install an efficient hot water system. Options include tank, tankless, solar thermal, and wood-fired systems.',
   'Evaluate your hot water needs based on household size and usage patterns. Tank water heaters (40-80 gallon) are simple and reliable but use standby energy. Tankless (on-demand) heaters save energy but have higher upfront costs and may struggle with very cold incoming water. Solar thermal is excellent for homesteads — a well-designed system can provide 60-80% of hot water needs. Wood-fired water heaters or thermosiphon coils in a wood stove provide hot water from heating fuel you may already use. Heat pump water heaters are highly efficient (2-3x more efficient than electric resistance) and work well in mild to moderate climates. Consider a hybrid approach: solar thermal primary with tankless backup, or a wood stove coil primary with electric backup for summer.',
   ARRAY['Solar thermal panels are most efficient when facing south at a tilt angle equal to your latitude', 'A thermosiphon coil in a wood stove provides free hot water whenever you heat', 'Heat pump water heaters dehumidify the space they are in — great for basements'],
   500, 4000, '1-3 days', 7, '{}', ARRAY['diy','contractor-needed'], '{}', '{}'),

  (mod_id, 'Greywater Recycling',
   'Design a greywater system to recycle sink, shower, and laundry water for landscape irrigation. Greywater recycling can reduce your fresh water needs by 30-50%.',
   'Greywater includes water from sinks, showers, bathtubs, and washing machines — not toilets (that is blackwater). A simple laundry-to-landscape system diverts washing machine water directly to mulched fruit trees or landscape plants through a branched drain system. More complex systems collect greywater from multiple fixtures into a surge tank, then distribute through subsurface drip irrigation. Key rules: greywater must infiltrate the soil within 24 hours (no ponding), use biodegradable soaps and detergents, never store greywater for more than 24 hours, and keep it away from root vegetables. Check your state and county regulations — many states now have simplified greywater permits for laundry systems. A well-designed greywater system turns a waste stream into a valuable irrigation resource.',
   ARRAY['Start with just your washing machine — it is the easiest greywater source to divert', 'Always use biodegradable, plant-friendly soap and detergent with greywater', 'Greywater must soak into soil — never spray it or let it pool on the surface'],
   200, 2000, '1-2 weekends', 8, '{}', ARRAY['diy','intermediate'], ARRAY['spring','summer'], '{}'),

  (mod_id, 'Irrigation Planning',
   'Design efficient irrigation for your gardens, orchard, and landscape based on your water sources, pressure, and the specific needs of each growing zone.',
   'Map your irrigation zones based on water needs: vegetable garden (highest need, daily in summer), orchard (deep weekly watering for establishment, then reduced), berry patches, herb garden, and landscape. Drip irrigation is the gold standard for homesteads — it delivers water directly to roots with 90-95% efficiency compared to 50-60% for overhead sprinklers. Calculate your total flow rate needs and ensure your water source can supply them. Use pressure regulators (most drip operates at 25 PSI), inline filters, and timer-controlled valves for each zone. Mulch heavily (4-6 inches) to reduce irrigation needs by 40-60%. Consider hugelkultur beds, swales, and rain gardens for passive water harvesting that reduces active irrigation dependency.',
   ARRAY['Drip irrigation saves 30-50% of water compared to overhead sprinklers', 'Mulch is the cheapest irrigation system — 4-6 inches reduces watering needs dramatically', 'Water early morning to minimize evaporation and disease pressure'],
   200, 3000, '1-2 weekends to install', 9, '{}', ARRAY['diy','seasonal'], ARRAY['spring','summer'], '{}'),

  (mod_id, 'Water Testing & Treatment',
   'Establish a regular water testing schedule and maintain ongoing treatment to ensure safe, clean water for your household and livestock year-round.',
   'After your initial comprehensive lab test, establish an ongoing testing schedule: test for bacteria (coliform) annually at minimum, after any major rain event or flooding, or any time water changes in taste, color, or odor. Test for chemical parameters every 2-3 years or if land use changes upstream. Keep a log of all test results to track trends over time. Maintain your treatment systems religiously — replace sediment and carbon filters on schedule, check UV bulb effectiveness annually (they lose effectiveness before burning out), service water softeners, and test RO membrane rejection rates. Stock spare filters and UV bulbs so you are never without treatment. For livestock water, test annually and watch animals for signs of water quality issues. Clean and inspect storage tanks annually.',
   ARRAY['Test your water after heavy rains, floods, or any work done near your well', 'Keep spare filters and UV bulbs on hand — don''t wait until something fails', 'A sudden change in water taste, smell, or appearance means test immediately'],
   50, 500, 'Ongoing — annual testing + quarterly maintenance', 10, '{}', ARRAY['critical','diy'], '{}', '{}');

END $$;
