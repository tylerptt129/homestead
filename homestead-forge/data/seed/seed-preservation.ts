import { mod, step } from './helpers';

const M = 'mod-preservation';
export const preservationMod = mod(M, 'preservation', 8, 'Food Preservation & Storage', 'Set up canning, drying, fermenting, and cold storage to preserve your harvest year-round.', 'Archive', '#B8860B', 80, 'beginner');

export const preservationSteps = [
  step('step-pres-1', M, 1, 'Root Cellar / Cold Storage',
    'Design underground or basement cold storage with proper ventilation and humidity control.',
    'A root cellar keeps produce at 32-40F and 85-95% humidity. Even a corner of an unheated basement works. Insulate the ceiling to keep heat out. Install an intake vent low and an exhaust vent high for air circulation. Root vegetables, apples, and canned goods store well here for months.',
    ['An unheated basement corner can serve as a root cellar with minimal modification', 'Separate ethylene-producing fruits (apples) from vegetables that are sensitive to it'],
    200, 5000, '1-2 weeks', [], ['diy', 'intermediate'], ['summer', 'fall']),

  step('step-pres-2', M, 2, 'Canning Equipment & Setup',
    'Acquire water bath and pressure canners, jars, lids, and learn safe canning practices.',
    'A water bath canner handles high-acid foods: fruits, pickles, tomatoes, jams. A pressure canner is required for low-acid foods: vegetables, meats, soups. Use only tested recipes from the USDA or Ball Blue Book. Never modify canning recipes — acidity and processing times are calculated for safety.',
    ['Only use tested recipes from USDA or Ball — improperly canned food can cause botulism', 'Buy jars at yard sales but always use new lids'],
    100, 400, '1-2 days', [], ['beginner', 'diy'], ['summer', 'fall']),

  step('step-pres-3', M, 3, 'Dehydration Station',
    'Set up food dehydrator for fruits, herbs, vegetables, and jerky.',
    'A good electric dehydrator costs $50-200 and handles most drying needs. Dry herbs, fruit leather, jerky, tomatoes, and peppers. Dehydrated food stores for 1-2 years in airtight containers. Solar dehydrators work well in dry climates for free. Properly dried food should snap, not bend.',
    ['An Excalibur dehydrator is the gold standard but any unit with a fan and thermostat works', 'Vacuum seal dehydrated food for maximum shelf life'],
    50, 300, '1 day', [], ['beginner', 'diy'], ['summer', 'fall']),

  step('step-pres-4', M, 4, 'Fermentation Workspace',
    'Set up space for sauerkraut, kimchi, pickles, kombucha, and other fermented foods.',
    'Fermentation needs a consistent 60-75F temperature and a clean workspace. Start with sauerkraut — just cabbage and salt. Fermentation crocks or wide-mouth jars with airlocks work best. Fermented foods are alive with probiotics and preserve vegetables for months without canning or refrigeration.',
    ['Start with sauerkraut — it requires only two ingredients: cabbage and salt', 'Airlock lids prevent mold while allowing fermentation gases to escape'],
    30, 200, '1 day', [], ['beginner', 'diy'], ['fall', 'winter']),

  step('step-pres-5', M, 5, 'Freezer Inventory System',
    'Organize freezers with inventory tracking and efficient storage.',
    'Chest freezers are more energy-efficient but harder to organize. Use stackable bins or milk crates inside. Label everything with contents and date. Keep a whiteboard inventory list on the freezer door. Rotate stock — first in, first out. Consider a generator or backup plan for extended power outages.',
    ['A whiteboard on the freezer door saves you from opening it to check contents', 'Freeze items flat in bags first, then stack vertically like files for easy access'],
    200, 800, '2-4 hours', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-pres-6', M, 6, 'Smoking & Curing',
    'Build or buy a smoker for meat, fish, and cheese preservation.',
    'Cold smoking (below 90F) flavors food without cooking. Hot smoking (225-275F) cooks and preserves. A simple DIY smoker can be built from a metal drum. Learn proper curing salt ratios for safe meat preservation. Start with simple projects like bacon or smoked cheese before tackling sausage.',
    ['Start with hot smoking — it is more forgiving than cold smoking for beginners', 'Use curing salt (Prague powder) precisely — too little is unsafe, too much is toxic'],
    100, 1000, '1-2 weekends', [], ['intermediate', 'diy'], ['fall', 'winter']),

  step('step-pres-7', M, 7, 'Pantry Organization',
    'Design and stock a working pantry with a first-in, first-out rotation system.',
    'A well-organized pantry stores 3-6 months of shelf-stable food. Use deep shelves with can organizers that auto-rotate. Group items by category. Mark purchase dates on everything. Store in cool, dark, dry conditions. Rotate stock consistently — eat the oldest items first.',
    ['Can organizers that load from the back and dispense from the front automate rotation', 'A cool, dark, dry pantry extends shelf life of canned goods to 2-5 years'],
    50, 500, '1 weekend', [], ['beginner', 'diy'], ['spring', 'summer', 'fall', 'winter']),

  step('step-pres-8', M, 8, 'Preservation Calendar',
    'Create a seasonal schedule showing what to preserve and when.',
    'Map your harvest dates to preservation methods. June: strawberry jam. July: pickles, salsa. August: tomato sauce, peach preserves. September: apple butter, sauerkraut. October: root cellar storage. Plan your canning supplies and jar inventory before the harvest rush hits.',
    ['Print your preservation calendar and post it in the kitchen during harvest season', 'Buy jars and lids in spring when they are stocked — they sell out by August'],
    0, 0, '2-4 hours', [], ['planning', 'beginner'], ['spring']),

  step('step-pres-9', M, 9, 'Emergency Food Reserves',
    'Build a 3-6 month emergency food supply with proper rotation.',
    'Store what you eat and eat what you store. Focus on staples: rice, beans, wheat, oats, honey, salt, oil, and canned goods. Store in food-grade buckets with mylar bags and oxygen absorbers for long-term storage. Rotate stock by incorporating stored food into regular meals. Include comfort foods and spices.',
    ['Store what you actually eat — emergency food should be familiar, not exotic', 'Mylar bags with oxygen absorbers can preserve dry goods for 25+ years'],
    500, 2000, 'ongoing', [], ['planning', 'beginner'], ['spring', 'summer', 'fall', 'winter']),
];
