-- Seed: Module 4 — Power & Energy
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'power',
    'Power & Energy',
    'From solar panels to backup generators, this module helps you design a reliable energy system that matches your lifestyle. Whether you are going fully off-grid or building a resilient hybrid system, every step is covered.',
    'zap', 4, '#DAA520', 60, 'intermediate'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Energy Audit & Needs Assessment',
   'Calculate your actual energy needs by auditing every appliance and system. Accurate numbers prevent both under-sizing and expensive over-building.',
   'List every electrical device and appliance you plan to use with its wattage and daily hours of operation. Multiply watts by hours to get watt-hours per day. A typical off-grid homestead uses 5-15 kWh per day. Major loads to account for: refrigerator (1-2 kWh/day), well pump (0.5-2 kWh/day), lighting (0.5-1 kWh), washing machine (0.5 kWh per load), and seasonal loads like space heating fans or cooling. Choose energy-efficient appliances from the start — a propane refrigerator or DC compressor fridge uses far less than a standard AC model. Identify loads that can run on non-electric alternatives: propane for cooking and water heating, wood for space heating. The smaller your electrical load, the less your power system costs.',
   ARRAY['A kill-a-watt meter is invaluable for measuring actual appliance power consumption', 'Propane cooking and water heating dramatically reduces your electrical system size', 'An energy-efficient homestead can function well on 5-8 kWh per day — less than half the US average'],
   0, 200, '2-4 hours', 1, '{}', ARRAY['beginner','critical','diy'], '{}', '{}'),

  (mod_id, 'Solar Panel Sizing',
   'Calculate and design your solar array based on your energy audit, location sun hours, and roof or ground-mount options.',
   'Divide your daily energy need (kWh) by your location peak sun hours (check the NREL PVWatts calculator for your address) to determine the minimum array size in kW. Add 25% for system losses (inverter efficiency, wire losses, panel degradation, dust). Example: 10 kWh/day ÷ 5 peak sun hours = 2 kW minimum, plus 25% = 2.5 kW array. Modern panels are 400-450 watts each, so roughly 6 panels. Choose monocrystalline panels for best efficiency per square foot. Ground mounts are easier to maintain, clean, and adjust seasonally; roof mounts save ground space but require roof structural assessment. Ensure the array faces south with minimal shading from 9 AM to 3 PM. Even partial shading on one panel can dramatically reduce output of the entire string — use microinverters or optimizers if shading is unavoidable.',
   ARRAY['Use the free NREL PVWatts calculator to model your exact location production', 'Ground-mounted arrays are easier to clean and maintain than roof mounts', 'Even small amounts of shading cause big losses — ensure full southern exposure 9 AM to 3 PM'],
   5000, 20000, '2-5 days installation', 2, '{}', ARRAY['diy','contractor-needed'], '{}', '{}'),

  (mod_id, 'Battery Bank Design',
   'Size and configure your battery storage to bridge nighttime and cloudy day gaps. Batteries are the heart of any off-grid or backup power system.',
   'Size your battery bank to provide 2-3 days of autonomy (the number of cloudy days you can run without solar production). Multiply daily energy use by autonomy days, then account for depth of discharge (DOD). Lithium iron phosphate (LiFePO4) batteries are now the gold standard: 80-100% usable DOD, 5,000+ cycle life, no maintenance, lighter weight, and dropping in price rapidly. Lead-acid (flooded or AGM) costs less upfront but has only 50% usable DOD, 500-1,500 cycle life, and requires maintenance. For a 10 kWh/day system with 2 days autonomy at 80% DOD: 10 x 2 ÷ 0.8 = 25 kWh of battery capacity. Common configurations: 24V or 48V systems (48V is more efficient for larger systems). Install batteries in a temperature-controlled space — extreme cold and heat reduce capacity and lifespan.',
   ARRAY['LiFePO4 batteries have higher upfront cost but far lower lifetime cost than lead-acid', 'Keep batteries in a temperature-controlled space — extreme cold dramatically reduces capacity', '48V systems are more efficient for larger installations and allow thinner wire runs'],
   3000, 15000, '1-2 days', 3, '{}', ARRAY['intermediate','diy'], '{}', '{}'),

  (mod_id, 'Inverter Selection',
   'Choose an inverter that matches your system voltage, panel configuration, battery bank, and peak load requirements.',
   'The inverter converts DC battery/solar power to AC household power. For off-grid, you need an inverter-charger that also manages battery charging from solar and generator. Key specs: continuous wattage (must exceed your peak simultaneous load — add up everything that could run at once), surge capacity (motors in well pumps and compressors need 2-3x their rated watts to start), waveform (pure sine wave is essential for sensitive electronics and motor longevity), and input voltage (must match your battery bank voltage — 24V or 48V). Top off-grid brands include Victron, Outback, Sol-Ark, and Schneider. Size for future growth — it is much easier to add panels and batteries than to replace an undersized inverter. Consider a split-phase 120/240V inverter if you plan to run well pumps, dryers, or other 240V loads.',
   ARRAY['Always choose pure sine wave — modified sine wave damages motors and electronics', 'Size your inverter for peak simultaneous load plus the largest motor surge', 'A split-phase 240V inverter lets you run well pumps and other large appliances off-grid'],
   1000, 5000, '1 day', 4, '{}', ARRAY['intermediate'], '{}', '{}'),

  (mod_id, 'Generator Backup',
   'Select and install a backup generator for extended cloudy periods, heavy loads, and emergency power. Even great solar systems need a backup plan.',
   'A generator serves as your insurance policy during extended cloudy weather, system maintenance, or unexpectedly high loads. For off-grid homesteads, a dual-fuel (gasoline/propane) or diesel generator in the 5,000-10,000 watt range covers most needs. Propane generators are ideal for standby use — propane does not degrade like gasoline and stores indefinitely. Size the generator to handle your inverter-charger input capacity so it can charge batteries efficiently while running household loads. Install the generator in a weatherproof enclosure with proper ventilation and exhaust routing, away from the house (carbon monoxide safety). Wire it through a transfer switch or let your inverter-charger manage the generator input. A well-designed solar system should only need the generator 20-40 hours per year in most climates.',
   ARRAY['Propane-fueled generators are ideal for standby — fuel stores indefinitely without degradation', 'Run the generator monthly for 15 minutes to keep it maintained and ready', 'A 7,500W generator is the sweet spot for most off-grid homesteads'],
   500, 5000, '1 day', 5, '{}', ARRAY['diy','critical'], '{}', '{}'),

  (mod_id, 'Wiring Plan',
   'Design the electrical wiring for your homestead including the solar equipment room, main panel, subpanels, and circuits.',
   'Design your electrical system starting from the power source (solar, generator) through the inverter, main breaker panel, and out to individual circuits. Follow the National Electrical Code (NEC) and your local amendments. Key considerations: wire sizing must match circuit breaker ratings and run lengths (voltage drop increases with distance — use a voltage drop calculator), all solar DC wiring must be properly fused and use appropriate connectors (MC4 for panels), the battery bank needs properly rated DC disconnects and fuses, and your main panel should have room for future expansion (buy a larger panel than you need today). Hire a licensed electrician for the final inspection-required connections even if you do the rough wiring yourself. Proper grounding is critical — install a grounding rod system per NEC requirements.',
   ARRAY['Buy a panel with more spaces than you currently need — expansion is almost guaranteed', 'Use a voltage drop calculator for long runs — undersized wire wastes energy as heat', 'Even if you do most wiring yourself, have a licensed electrician verify your work for safety'],
   500, 3000, '1-2 weeks', 6, '{}', ARRAY['diy','contractor-needed','critical'], '{}', '{}'),

  (mod_id, 'Wind Power Evaluation',
   'Assess whether wind power is viable for your site. Wind can complement solar excellently, especially in winter when solar production drops.',
   'Wind power requires consistent, strong winds to be worthwhile. You need an average annual wind speed of at least 10-12 mph at your planned tower height (typically 80-120 feet) for a small turbine to be cost-effective. Use the NREL Wind Prospector tool to check wind data for your area, but local terrain dramatically affects actual wind at your site. Trees, hills, and buildings create turbulence that reduces production and stresses equipment. Ideally, install an anemometer at your planned tower height for 6-12 months before investing. Small wind turbines (1-10 kW) are most effective on open ridgetops or in plains states. Wind complements solar beautifully — wind is often strongest in winter and at night when solar production is lowest. However, small wind turbines have higher maintenance than solar and shorter equipment lifespans.',
   ARRAY['You need 10-12 mph average wind speed at tower height for wind to be cost-effective', 'Wind and solar complement each other seasonally — wind is strongest when sun is weakest', 'Install an anemometer for 6-12 months before committing to a wind turbine investment'],
   0, 500, '6-12 months evaluation', 7, '{}', ARRAY['intermediate','diy'], '{}', '{}'),

  (mod_id, 'Hydroelectric Assessment',
   'If you have flowing water on your property, evaluate micro-hydro potential. A small stream with consistent flow can provide 24/7 baseload power.',
   'Micro-hydro is the holy grail of off-grid power — it produces electricity 24 hours a day, 365 days a year (if your stream flows year-round). The power available depends on two factors: head (vertical drop in feet) and flow (gallons per minute). Power in watts ≈ head (feet) × flow (GPM) ÷ 10. Example: 50 feet of head with 20 GPM flow = 100 watts continuous = 2.4 kWh per day. Even modest micro-hydro can significantly reduce battery cycling and generator use. Equipment needed: intake with trash screen, penstock (pipe from intake to turbine), turbine generator (Pelton wheel for high head/low flow, turgo or crossflow for moderate conditions), and charge controller. Water rights and permits are essential — check your state regulations. A consistent 200-500 watt micro-hydro system can be the backbone of an off-grid power system.',
   ARRAY['Even 100 watts continuous from micro-hydro equals 2.4 kWh/day — better than several solar panels in winter', 'Measure stream flow during the driest season to know your minimum production', 'Water rights and permits are required in most states — check before developing'],
   0, 500, '1-3 days assessment', 8, '{}', ARRAY['intermediate'], ARRAY['spring','summer'], '{}'),

  (mod_id, 'Energy Monitoring',
   'Install monitoring equipment to track production, consumption, and battery state. Good data leads to better energy decisions and early problem detection.',
   'Install a monitoring system that shows you real-time and historical data on solar production, battery state of charge, energy consumption, and generator run time. Most modern inverter-chargers (Victron, Sol-Ark, Outback) include built-in monitoring via smartphone apps and web portals. Add a whole-house energy monitor (like Emporia Vue or Sense) to track individual circuit consumption and identify energy hogs. Set up alerts for low battery state of charge, abnormal consumption patterns, and solar production drops that could indicate a panel or wiring issue. Review your data monthly to understand seasonal patterns and optimize your usage. Energy monitoring typically pays for itself quickly by revealing waste and optimizing generator use.',
   ARRAY['Set up low-battery alerts so you can start the generator before batteries are damaged', 'Review monthly production data to catch panel shading issues or equipment degradation early', 'Track individual circuits to identify energy waste and optimize your daily usage patterns'],
   100, 500, '2-4 hours', 9, '{}', ARRAY['diy','beginner'], '{}', '{}'),

  (mod_id, 'Grid Tie-In or Disconnect',
   'If grid power is available, decide whether to connect, go fully off-grid, or build a hybrid system that uses the grid as backup.',
   'This decision has major financial and lifestyle implications. Grid-tied with battery backup gives you net metering (sell excess solar), grid power as infinite backup, and battery for outages — the most financially safe option. Fully off-grid eliminates monthly utility bills and gives complete energy independence, but requires a larger system with generator backup and more careful energy management. Hybrid systems connect to the grid but can operate independently during outages (requires anti-islanding protection per NEC). Calculate the break-even point: if grid connection costs $20,000+ (common for remote properties), that money buys a substantial off-grid system. If the grid is already at your property line, a grid-tied system with battery backup often makes the most financial sense. Consider your values too — many homesteaders choose off-grid for independence even when the grid is available.',
   ARRAY['If grid connection costs more than $15-20K, off-grid solar may be cheaper from day one', 'Grid-tied with battery backup gives you the best of both worlds — net metering plus outage protection', 'Anti-islanding protection is required by code for any system that can back-feed the grid'],
   500, 5000, '1-3 days', 10, '{}', ARRAY['critical','contractor-needed'], '{}', '{}');

END $$;
