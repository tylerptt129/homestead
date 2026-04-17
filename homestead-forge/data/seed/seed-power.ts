import { mod, step } from './helpers';

const M = 'mod-power';
export const powerMod = mod(M, 'power', 4, 'Power & Energy', 'Design an energy system balancing solar, wind, generator, and grid resources for reliable power.', 'Zap', '#DAA520', 100, 'intermediate');

export const powerSteps = [
  step('step-power-1', M, 1, 'Energy Audit & Needs Assessment',
    'Calculate daily kWh usage for all planned loads and appliances.',
    'List every electrical device you plan to use with its wattage and daily hours of use. Multiply watts by hours to get watt-hours, then divide by 1000 for kWh. A typical off-grid home uses 5-15 kWh/day. Prioritize energy-efficient appliances — a propane fridge uses zero electricity.',
    ['Propane for cooking and refrigeration dramatically reduces your electrical needs', 'LED lighting uses 75% less energy than incandescent'],
    0, 300, '1-2 days', [], ['planning', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-power-2', M, 2, 'Solar Panel Sizing',
    'Size your solar array based on energy needs and peak sun hours for your location.',
    'Divide your daily kWh need by your location peak sun hours (3-6 hours depending on region) to get required kW of panels. Add 25% for system losses. South-facing roof or ground mount at your latitude angle. Ground mounts are easier to clean and adjust.',
    ['Ground-mounted panels are easier to maintain and can be adjusted seasonally', 'Start with enough panels for current needs — you can always add more'],
    3000, 20000, '1-2 days planning', ['step-power-1'], ['planning', 'contractor-needed'], ['spring', 'summer']),

  step('step-power-3', M, 3, 'Battery Bank Design',
    'Size battery storage for nighttime use and cloudy day autonomy.',
    'Plan for 2-3 days of autonomy without sun. Lithium iron phosphate (LiFePO4) batteries are the best value now — they last 10+ years and handle deep discharge. Lead-acid is cheaper upfront but needs replacement every 3-5 years. Never discharge lead-acid below 50%.',
    ['LiFePO4 batteries cost more upfront but are cheaper per cycle over their lifetime', 'Keep batteries in a temperature-controlled space for maximum life'],
    2000, 15000, '1 day planning', ['step-power-2'], ['planning'], ['spring', 'summer', 'fall', 'winter']),

  step('step-power-4', M, 4, 'Inverter Selection',
    'Choose inverter type and size to match your panel and battery configuration.',
    'Pure sine wave inverters are required for modern electronics. Size your inverter for peak load plus 20% headroom. Hybrid inverters combine charge controller and inverter in one unit. For grid-tied systems, choose a grid-interactive inverter that can sell back power.',
    ['A hybrid inverter simplifies your system and reduces wiring complexity', 'Buy an inverter with monitoring capability to track system performance'],
    1000, 5000, '1 day', ['step-power-3'], ['planning'], ['spring', 'summer', 'fall', 'winter']),

  step('step-power-5', M, 5, 'Generator Backup',
    'Select and size a backup generator for extended cloudy periods or high-demand tasks.',
    'A generator fills the gap during extended cloudy weather or for heavy loads like welding. Dual-fuel models (propane/gasoline) offer flexibility. Size for your largest load plus battery charging. An auto-start generator activates when batteries get low.',
    ['Propane generators start more reliably in cold weather than gasoline', 'Store enough fuel for at least 72 hours of continuous generator run time'],
    500, 5000, '1 day', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-power-6', M, 6, 'Wiring Plan',
    'Design electrical distribution from panels and batteries to your main panel.',
    'Follow NEC code for all wiring. Use appropriately sized wire for each run to minimize voltage drop. Separate critical circuits (well pump, fridge, lights) from non-essential loads. Install a proper disconnect switch accessible to firefighters. Label every breaker clearly.',
    ['Hire a licensed electrician for the main panel and utility connection', 'Oversized wire costs a little more but reduces voltage drop significantly'],
    500, 5000, '1-2 weeks', ['step-power-4'], ['contractor-needed'], ['spring', 'summer', 'fall']),

  step('step-power-7', M, 7, 'Wind Power Evaluation',
    'Assess wind resources to determine if a turbine is worthwhile for your site.',
    'You need average wind speeds of 10+ mph to justify a wind turbine. Turbines need to be at least 30 feet above any obstacle within 300 feet. Small wind is more expensive per watt than solar in most locations. Consider wind as a complement to solar, not a replacement.',
    ['Most small wind turbines underperform their rated output — check independent reviews', 'Wind and solar complement each other well since wind often picks up when sun is low'],
    200, 10000, '1-2 weeks evaluation', [], ['research', 'intermediate'], ['fall', 'winter']),

  step('step-power-8', M, 8, 'Energy Monitoring',
    'Install monitoring to track production, consumption, and system health.',
    'A good monitoring system shows real-time production, consumption, battery state, and historical trends. Most modern inverters include monitoring apps. Add a whole-house energy monitor to track individual circuit usage. Data helps you identify waste and optimize your system.',
    ['Check your monitoring daily for the first month to understand your patterns', 'Set alerts for low battery voltage or production anomalies'],
    100, 500, '2-4 hours', ['step-power-6'], ['diy', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-power-9', M, 9, 'Grid Tie-in or Disconnect',
    'Decide on grid-tied, off-grid, or hybrid configuration and handle paperwork.',
    'Grid-tied systems let you sell excess power and use the grid as backup. Off-grid means complete independence but requires more battery storage. Hybrid systems use grid as backup while minimizing grid dependence. Check net metering policies in your state.',
    ['Grid-tied with battery backup gives you the best of both worlds', 'Some utilities charge fees for grid-tied solar — read the fine print'],
    200, 2000, '1-2 weeks', ['step-power-6'], ['planning', 'research'], ['spring', 'summer', 'fall', 'winter']),
];
