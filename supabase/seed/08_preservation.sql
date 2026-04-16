-- Seed: Module 8 — Food Preservation & Storage
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'preservation',
    'Food Preservation & Storage',
    'Growing food is only half the battle — preserving it feeds you year-round. This module covers every preservation method from root cellaring to canning, dehydrating, fermenting, and smoking, plus organizing your pantry for a full year of food security.',
    'archive', 8, '#8B4513', 60, 'beginner'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Root Cellar & Cold Storage',
   'Build or designate a cold storage space for root vegetables, apples, and other produce that keeps for months in cool, humid conditions.',
   'A root cellar maintains 32-40°F and 85-95% humidity — ideal for storing potatoes, carrots, beets, turnips, cabbage, apples, and winter squash for 4-6 months without electricity. A true below-ground root cellar is ideal: dig into a north-facing hillside or build a dedicated underground room. Simpler alternatives: an unheated corner of a basement (partition it off and add ventilation), a buried trash can or barrel, a cold closet against an exterior north wall, or an insulated section of an unheated garage. The key requirements are consistent cool temperature, high humidity, good ventilation (ethylene gas from apples must vent or it speeds ripening of other produce), and darkness. Store different crops separately when possible — apples and potatoes should not be stored together (ethylene gas from apples causes potatoes to sprout).',
   ARRAY['A north-facing hillside is the ideal location for a root cellar', 'Store apples separately from root vegetables — ethylene gas causes sprouting', 'An unheated basement corner partitioned off with insulation works well as a starter root cellar'],
   200, 5000, '1-4 weekends', 1, '{}', ARRAY['diy','seasonal'], ARRAY['fall'], '{}'),

  (mod_id, 'Canning Equipment & Setup',
   'Set up a canning station with proper equipment for both water bath and pressure canning. Canning is the backbone of long-term food preservation.',
   'You need two canning methods: water bath canning for high-acid foods (fruits, jams, pickles, tomatoes with added acid) and pressure canning for low-acid foods (vegetables, meats, soups, beans). Equipment: a large water bath canner or stockpot with rack, a quality pressure canner (All American or Presto are top brands — NOT a pressure cooker), mason jars in various sizes, lids and bands, jar lifter, funnel, bubble remover, and headspace gauge. Set up a dedicated canning area with good ventilation (steam), a strong flat surface, and a powerful burner. Follow tested recipes only — the USDA Complete Guide to Home Canning and the Ball Blue Book are your bibles. Never modify pressure canning recipes — botulism is a real and deadly risk from improperly canned low-acid foods.',
   ARRAY['Always use tested recipes from USDA or Ball — botulism from improvised canning is real and deadly', 'An All American pressure canner with a metal-to-metal seal lasts a lifetime', 'Set up your canning station with good ventilation — the steam is intense'],
   100, 500, '1 day setup', 2, '{}', ARRAY['beginner','critical','diy'], ARRAY['summer','fall'], '{}'),

  (mod_id, 'Dehydration Station',
   'Set up a food dehydrator for preserving fruits, vegetables, herbs, and jerky. Dehydrated food is lightweight, shelf-stable, and retains excellent nutrition.',
   'A food dehydrator is one of the most versatile preservation tools. Quality options: Excalibur (square trays, even airflow, best for most users), Nesco (affordable, round trays, great starter), or a DIY solar dehydrator for off-grid use. Dehydrating works for virtually everything: fruit leather, dried herbs, vegetable chips, beef jerky, tomato powder, dried mushrooms, and more. Key rules: slice food uniformly thin (1/8 to 1/4 inch), pre-treat fruits with lemon juice dip to prevent browning, dehydrate at 125°F for fruits and vegetables, 160°F for meat jerky. Dry until food is leathery or brittle with no moisture when squeezed. Store in airtight containers (mason jars, vacuum-sealed bags) with oxygen absorbers for maximum shelf life. Properly dehydrated food lasts 1-2 years at room temperature.',
   ARRAY['Slice food uniformly thin for even drying — a mandoline slicer helps enormously', 'Tomato powder (dehydrated and ground tomatoes) is incredibly versatile in cooking', 'Vacuum seal dehydrated food with oxygen absorbers for maximum shelf life'],
   50, 500, '1 day setup', 3, '{}', ARRAY['beginner','diy'], ARRAY['summer','fall'], '{}'),

  (mod_id, 'Fermentation Workspace',
   'Set up a fermentation station for sauerkraut, kimchi, pickles, kombucha, yogurt, cheese, and other cultured foods.',
   'Fermentation is the oldest and simplest preservation method — it requires no energy, improves nutrition (adds probiotics and increases vitamin availability), and produces incredibly flavorful foods. Equipment needed: wide-mouth mason jars or ceramic crocks, fermentation weights (glass or ceramic), airlocks or burping lids, a kitchen scale, and non-iodized salt. Start with sauerkraut (literally just cabbage and salt) and lacto-fermented pickles. Once comfortable, expand to kimchi, fermented hot sauce, water kefir, milk kefir, kombucha, yogurt, and cheese. The key to fermentation is keeping food submerged below the brine (anaerobic conditions) and maintaining appropriate temperature (60-75°F for most vegetable ferments). A cool basement corner or root cellar is ideal for slower, more complex ferments.',
   ARRAY['Start with sauerkraut — it is literally just cabbage and salt, and it is delicious', 'Keep ferments submerged below the brine — a glass weight or water-filled bag works', 'A cool basement corner (60-65°F) produces the best-flavored vegetable ferments'],
   50, 300, '1 day setup', 4, '{}', ARRAY['beginner','diy'], '{}', '{}'),

  (mod_id, 'Freezer Inventory System',
   'Organize and track your freezer contents to prevent waste, ensure rotation, and know exactly what food reserves you have.',
   'A well-organized freezer prevents the all-too-common scenario of finding forgotten, freezer-burned food in the bottom. Use a system: label everything with contents, date, and quantity before it goes in. Keep a running inventory list on the freezer door or in this app — update it every time you add or remove items. Organize by category: meats on one shelf, vegetables on another, fruits, prepared meals, and broths/stocks. Use the first-in-first-out (FIFO) method — new items go to the back, use from the front. Invest in a quality chest freezer (they hold temperature better during power outages than uprights) and a freezer alarm that alerts you to temperature rises. Vacuum sealing dramatically extends freezer life — vacuum-sealed meat lasts 2-3 years versus 4-12 months in standard packaging.',
   ARRAY['Label everything with contents, date, and quantity before freezing', 'A chest freezer holds temperature much longer during power outages than an upright', 'Vacuum sealing extends freezer life by 3-5x compared to standard freezer bags'],
   0, 100, '2-4 hours', 5, '{}', ARRAY['beginner','diy'], '{}', '{}'),

  (mod_id, 'Smoking & Curing',
   'Learn meat smoking and curing for bacon, ham, jerky, sausage, and smoked fish. These ancient methods produce incredible flavors and extended shelf life.',
   'Smoking and curing are the traditional methods for preserving meat without refrigeration. Curing uses salt, sugar, and sometimes nitrates/nitrites to draw moisture from meat and inhibit bacterial growth. Smoking adds flavor and creates an antimicrobial surface layer. Start with a simple cold or hot smoker — you can build one from an old refrigerator, a barrel, or masonry blocks. Hot smoking (225-275°F) cooks and smokes simultaneously — great for ribs, brisket, pulled pork, and chicken. Cold smoking (below 90°F) flavors without cooking — used for bacon, salmon, and cheese, but requires careful food safety practices. Essential equipment: a reliable thermometer (both smoker temp and internal meat temp), hardwood chunks or chips (hickory, apple, cherry, oak), and a good curing recipe from a tested source.',
   ARRAY['Always use a meat thermometer — internal temperature is the only safe way to judge doneness', 'Start with hot smoking — it is simpler and safer than cold smoking for beginners', 'Apple, cherry, and hickory are the most versatile smoking woods for all meats'],
   200, 1500, '1 weekend to build smoker, ongoing use', 6, '{}', ARRAY['intermediate','diy'], ARRAY['fall','winter'], '{}'),

  (mod_id, 'Pantry Organization',
   'Design and organize a pantry system that stores a year supply of preserved food with easy access and clear inventory tracking.',
   'A well-organized pantry is your homestead grocery store. Build sturdy shelving that can handle the weight of canned goods (a quart jar weighs about 2.5 pounds — a shelf of 50 jars is over 125 pounds). Use a rotation system: new items go to the back, use from the front. Group by category: canned fruits, canned vegetables, jams and preserves, pickles and ferments, dried goods, grains and flours, and cooking staples. Store all dry goods in airtight containers (rodents and pantry moths will find anything in paper or thin plastic). Keep a pantry inventory — knowing what you have prevents over-producing some items and under-producing others. A walk-in pantry is ideal; a repurposed closet or utility room works well. Keep the pantry cool, dark, and dry — heat and light degrade canned goods faster.',
   ARRAY['Group items by category and practice first-in-first-out rotation', 'Sturdy shelving is essential — a full shelf of quart jars weighs over 100 pounds', 'All dry goods should be in airtight containers to prevent rodent and insect damage'],
   50, 500, '1 weekend', 7, '{}', ARRAY['beginner','diy'], ARRAY['fall'], '{}'),

  (mod_id, 'Preservation Calendar',
   'Create a seasonal preservation calendar that maps what to preserve each month based on your harvest timing and climate zone.',
   'A preservation calendar ensures you are ready with equipment, supplies, and time when each crop comes in. Build your calendar based on your specific harvest dates: early summer brings strawberries (jam, freeze, dehydrate), mid-summer brings cucumbers (pickles, relish), late summer brings tomatoes (canning, sauce, paste, dehydrate), and fall brings apples (sauce, butter, cider, dehydrate) and root vegetables (root cellar). Plan your canning jar and lid purchases in spring before the rush. Schedule preservation days on your calendar — block full days when major harvests come in. Prepare by cleaning equipment, organizing workspace, and reviewing recipes in advance. Having a calendar prevents the overwhelm of suddenly having 50 pounds of tomatoes with no plan.',
   ARRAY['Plan and purchase jars and lids in spring before the summer canning rush', 'Block full days for preservation when major harvests come in — it is intensive work', 'Prep your workspace and review recipes before the harvest arrives'],
   0, 50, '2-4 hours planning', 8, '{}', ARRAY['beginner','seasonal'], ARRAY['spring'], '{}'),

  (mod_id, 'Emergency Food Reserves',
   'Build a deep pantry of long-term stored staples that provide food security for 3-12 months independent of fresh production.',
   'Beyond your home-preserved foods, build a reserve of long-term staples that store for 10-25+ years: white rice, hard wheat berries, dried beans, oats, pasta, sugar, salt, honey, powdered milk, and cooking oils. Store in food-grade 5-gallon buckets with gamma seal lids and oxygen absorbers for maximum shelf life. Calculate your family needs: roughly 400 pounds of grain, 60 pounds of beans, 60 pounds of sugar, and 12 pounds of salt per person per year for a basic survival diet. This is your insurance against crop failure, economic disruption, or any emergency. Rotate your reserves by using the oldest stock in daily cooking and replacing it. Add variety with canned meats, dried fruits, spices, and comfort foods. A well-stocked emergency pantry provides profound peace of mind.',
   ARRAY['White rice and dried beans in sealed 5-gallon buckets with oxygen absorbers last 25+ years', 'Plan 400 pounds of grain and 60 pounds of beans per person per year as a baseline', 'Rotate reserves into daily cooking and replace — this keeps your stock fresh'],
   200, 1000, '1-2 weekends to build initial stock', 9, '{}', ARRAY['critical','beginner'], '{}', '{}'),

  (mod_id, 'Rotation Tracking',
   'Implement a system to track expiration dates, rotation schedules, and consumption rates for all preserved and stored food.',
   'Without tracking, food gets lost, forgotten, and wasted. Implement a simple rotation system: label everything with the preservation date, mark your oldest items clearly, and check your inventory monthly. Track consumption rates so you know how much to preserve each year — if you canned 50 quarts of tomato sauce last year and still have 15 left, you may only need 35 this year (or you need to use more tomato sauce in your cooking). This data is invaluable for planning garden production, purchasing supplies, and ensuring nothing expires unused. Set monthly reminders to check pantry and freezer inventory. Move items approaching their best-by dates to the front for immediate use. A well-tracked preservation system eliminates waste and optimizes your production year over year.',
   ARRAY['Check your pantry and freezer inventory monthly — set a recurring reminder', 'Track consumption rates to optimize next year production quantities', 'Move items nearing their best-by date to the front for immediate use'],
   0, 50, 'Ongoing — 30 minutes monthly', 10, '{}', ARRAY['beginner','diy'], '{}', '{}');

END $$;
