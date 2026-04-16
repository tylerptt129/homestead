-- Seed: Module 6 — Food Production: Orchard & Perennials
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'orchard',
    'Food Production — Orchard & Perennials',
    'Plant once, harvest for decades. Fruit trees, berry bushes, nut trees, and perennial herbs and vegetables form the permanent food-producing backbone of your homestead. This module guides you from planning through planting to long-term orchard management.',
    'tree-deciduous', 6, '#6B8E23', 80, 'intermediate'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Site Selection & Soil Prep',
   'Choose and prepare the best location for your orchard. Proper site selection prevents years of frustration with poor fruit production.',
   'Fruit trees need full sun (8+ hours), good air drainage to prevent frost pockets, well-drained soil, and protection from harsh winds. South or southeast-facing slopes are ideal in cold climates — they warm up earlier in spring and the slight angle improves frost drainage. Avoid low-lying areas where cold air pools on still spring nights, damaging blossoms. Test soil pH: most fruit trees prefer 6.0-7.0. Amend a full year before planting if possible — work in compost, adjust pH, and plant a cover crop to build soil biology. Prepare planting holes that are twice the width of the root ball but no deeper. If your soil has a hardpan or clay layer, break through it with a post hole digger or auger beneath each planting hole to ensure drainage.',
   ARRAY['South-facing slopes warm earlier in spring and provide natural frost drainage', 'Prepare soil at least one season before planting for best results', 'Break through hardpan beneath planting holes — standing water in the root zone kills fruit trees'],
   100, 500, '1-2 weekends', 1, '{}', ARRAY['beginner','seasonal','diy'], ARRAY['fall','spring'], '{}'),

  (mod_id, 'Fruit Tree Variety Selection',
   'Choose fruit tree varieties suited to your climate zone, pollination needs, and family preferences. The right varieties make all the difference.',
   'Start by identifying your USDA hardiness zone and chill hours (the number of hours below 45°F your area receives in winter — fruit trees need specific chill hours to set fruit). Select varieties from a reputable local or regional nursery that specializes in varieties proven in your area. Consider pollination requirements: some apples, pears, and cherries need a different variety nearby for cross-pollination. Plant at least 2-3 apple varieties that bloom at the same time. Choose a mix of early, mid, and late-season varieties to spread your harvest over months rather than weeks. Dwarf and semi-dwarf rootstocks are easier to manage, prune, and harvest than full-size trees. Plan for about 20-25 fruit trees to provide year-round fruit for a family of four when trees reach maturity.',
   ARRAY['Choose varieties proven in your specific area from a regional nursery', 'Mix early, mid, and late-season varieties to spread harvest over months', 'Semi-dwarf rootstock is the best balance of tree size, production, and manageability'],
   200, 2000, '2-4 hours research + ordering', 2, '{}', ARRAY['beginner','seasonal'], ARRAY['winter','spring'], '{}'),

  (mod_id, 'Planting Layout',
   'Design your orchard layout for optimal spacing, sun exposure, access, and future management. A well-planned layout simplifies decades of care.',
   'Space trees based on their mature size: dwarf trees 8-10 feet apart, semi-dwarf 12-15 feet, standard 20-25 feet. Orient rows north-south for even sun on both sides. Leave access lanes wide enough for a mowing path or small tractor (8-10 feet minimum). Consider a high-density planting with dwarfs on trellis (espalier) for small properties. Interplant nitrogen-fixing companions: comfrey around the drip line of each tree (dynamic accumulator, mulch producer), white clover as ground cover between rows (fixes nitrogen, attracts pollinators), and guilds of beneficial plants around each tree. Plan for irrigation access to every tree. Create a map with species, variety, rootstock, and planting date for each tree position — this becomes invaluable as trees grow.',
   ARRAY['Orient rows north-south for even sunlight on both sides of each tree', 'Plant comfrey at the drip line of each tree — it mines minerals and produces excellent mulch', 'Keep a detailed orchard map with variety, rootstock, and planting date for every tree'],
   0, 100, '2-4 hours planning', 3, '{}', ARRAY['beginner','diy'], ARRAY['winter','spring'], '{}'),

  (mod_id, 'Berry Bushes & Brambles',
   'Plant berry bushes and brambles for quick production. Berries produce years before fruit trees and provide early returns on your food forest investment.',
   'Berries are the fastest-producing perennial fruit — blueberries, raspberries, blackberries, and currants can produce within 1-2 years of planting. Blueberries need acidic soil (pH 4.5-5.5) — use sulfur and pine needle mulch to acidify. Plant at least 3 varieties for best cross-pollination and extended harvest. Raspberries and blackberries spread aggressively — plant in a dedicated row with a trellis system and mow around them to prevent unwanted spreading. Summer-bearing raspberries produce on second-year canes; everbearing types produce on first-year canes in fall. Plant 6-10 blueberry bushes, a 25-foot row each of raspberries and blackberries, and a few currant or gooseberry bushes. This provides enough for fresh eating, freezing, and jam for a family. Strawberries (technically perennial) are another must — plant 25-50 plants for a family.',
   ARRAY['Blueberries need acidic soil — test pH and amend with sulfur before planting', 'Berries produce 1-2 years after planting while you wait for fruit trees to mature', 'A 25-foot row of raspberries produces 30-50 pints per season when established'],
   100, 800, '1-2 weekends', 4, '{}', ARRAY['beginner','diy','seasonal'], ARRAY['spring','fall'], '{}'),

  (mod_id, 'Nut Trees',
   'Plant nut trees for long-term protein and fat production. Nut trees are among the most productive and lowest-maintenance food trees you can grow.',
   'Nut trees are a long game — most take 5-10 years to begin producing — but a mature nut tree can produce hundreds of pounds of nutrient-dense food for decades. Choose species suited to your climate: chestnuts (zones 5-9, produce in 3-5 years from grafted stock), hazelnuts/filberts (zones 4-8, shrub-size, produce in 3-4 years), walnuts (zones 4-9, long-lived, valuable timber too), pecans (zones 6-9, massive production when mature), and almonds (zones 7-9, need dry conditions). Most nut trees need cross-pollination, so plant at least 2 of each species. Consider Chinese chestnuts as a staple crop — they produce prolifically, have no serious pest issues, and the nuts are versatile in cooking. Plant nut trees on the north side of your property or food forest so they do not shade smaller fruit trees and gardens as they grow to full size.',
   ARRAY['Chinese chestnuts are the best nut tree for beginners — few pests and fast production', 'Plant nut trees on the north side so they don''t shade smaller trees as they mature', 'Hazelnuts are shrub-sized and can produce within 3-4 years — great for small properties'],
   200, 1500, '1-2 days planting', 5, '{}', ARRAY['diy','seasonal'], ARRAY['spring','fall'], '{}'),

  (mod_id, 'Herb Garden',
   'Establish a permanent herb garden near the kitchen with culinary, medicinal, and pollinator-attracting herbs for daily use.',
   'Place your herb garden as close to the kitchen door as possible — you will use herbs daily if they are within arm''s reach. Perennial herbs form the backbone: rosemary, thyme, oregano, sage, chives, mint (in a contained area — it spreads aggressively), lemon balm, and lavender. Add annual herbs each spring: basil, cilantro, dill, and parsley. Many herbs are Mediterranean natives and thrive in poor, well-drained soil with full sun — they actually produce more essential oils and flavor when not over-fertilized. Raised beds or containers work well for herbs. A spiral herb garden (stones arranged in a spiral mound) creates microclimates — dry and sunny at the top for rosemary and thyme, moist and shaded at the base for mint and parsley. Medicinal herbs to include: echinacea, chamomile, calendula, comfrey, and elderberry.',
   ARRAY['Place herbs within arm''s reach of the kitchen door for maximum daily use', 'Mediterranean herbs like rosemary and thyme produce better flavor in lean, well-drained soil', 'Contain mint in a pot or bordered bed — it will take over your garden otherwise'],
   50, 300, '1 weekend', 6, '{}', ARRAY['beginner','diy'], ARRAY['spring'], '{}'),

  (mod_id, 'Perennial Vegetables',
   'Plant perennial vegetables that come back year after year with minimal care, providing early spring harvests and reliable production.',
   'Perennial vegetables are the low-maintenance workhorses of a food forest. Asparagus is the king — a well-established bed produces for 20+ years with minimal care. Plant 20-50 crowns for a family, expect first light harvest in year 2, full harvest by year 3. Rhubarb thrives in cold climates and produces heavily for decades. Jerusalem artichokes (sunchokes) are virtually indestructible and produce abundant starchy tubers — but plant them in a contained area as they spread. Walking onions, perennial kale (like Daubenton''s), sorrel, lovage, horseradish, and good King Henry are other excellent perennial vegetables. Most perennial vegetables are among the first foods available in spring when you are hungrest for fresh produce. Plant them once, mulch heavily, and they reward you year after year.',
   ARRAY['Asparagus takes 2-3 years to establish but then produces for 20+ years', 'Plant Jerusalem artichokes in a contained area — they are wonderful but spread aggressively', 'Perennial vegetables provide the earliest spring harvests when you need fresh food most'],
   50, 400, '1-2 weekends', 7, '{}', ARRAY['beginner','diy','seasonal'], ARRAY['spring','fall'], '{}'),

  (mod_id, 'Pollinator Habitat',
   'Create habitat for bees, butterflies, and beneficial insects that pollinate your food crops and control garden pests naturally.',
   'Pollinators are essential for fruit and vegetable production. Create habitat by planting a diverse mix of flowers that bloom from early spring through late fall — there should always be something in flower. Include native wildflowers, which support native pollinators best. Plant in clusters rather than individual plants. Provide nesting sites: leave some bare ground for ground-nesting bees (70% of native bees nest in the ground), build or buy mason bee houses, and leave dead wood and hollow stems for cavity-nesting species. Avoid pesticides, especially neonicotinoids. A wildflower border around your garden or orchard serves double duty as pollinator habitat and beneficial insect nursery. Consider keeping honey bees if you have the interest — even 1-2 hives can dramatically improve pollination and provide honey, wax, and propolis.',
   ARRAY['Plant flowers that bloom in sequence from early spring through late fall', 'Leave bare ground patches and dead wood for native bee nesting sites', 'A wildflower border around the garden attracts both pollinators and pest-eating beneficial insects'],
   50, 300, '1 weekend', 8, '{}', ARRAY['beginner','diy','seasonal'], ARRAY['spring','summer'], '{}'),

  (mod_id, 'Pruning Schedule',
   'Learn and schedule proper pruning for all fruit trees and berry plants. Good pruning is the most important skill for productive fruit growing.',
   'Pruning maintains tree health, controls size, improves fruit quality, and ensures good air circulation to prevent disease. Most fruit trees are pruned in late winter while dormant (February-March, before buds swell). The basic goals: remove dead, diseased, and crossing branches first, then open the center for light and air, and maintain the desired shape (central leader for apples and pears, open vase for stone fruits). Summer pruning controls vigor and removes water sprouts. Berry pruning schedules differ: summer-bearing raspberries — remove canes that fruited immediately after harvest; blueberries — remove old unproductive wood in late winter; grapes — aggressive dormant pruning to last year''s growth. Invest in quality tools: bypass pruners, loppers, and a folding pruning saw. Learn the specific pruning style for each fruit type — it is a skill that improves with practice and dramatically impacts production.',
   ARRAY['Prune most fruit trees in late winter before buds swell — sharp cuts heal fastest then', 'Remove dead, diseased, and crossing branches first — that alone improves the tree significantly', 'Sharp tools make clean cuts that heal quickly — invest in quality bypass pruners and keep them sharp'],
   20, 200, '2-4 hours per session, annual', 9, '{}', ARRAY['diy','seasonal'], ARRAY['winter','spring'], '{}'),

  (mod_id, 'Grafting & Propagation',
   'Learn to propagate your own fruit trees through grafting, cuttings, and layering. These skills let you multiply your best performers and share with neighbors.',
   'Grafting is the art of joining a scion (a cutting from a desired variety) to a rootstock (which controls tree size and disease resistance). It is how all named fruit varieties are reproduced. Learn cleft grafting first — it is the easiest and most reliable method. Collect scion wood in late winter while trees are dormant, store in the refrigerator in moist paper towels, and graft in early spring just as rootstock buds begin to swell. You can order rootstock from nursery suppliers. With basic grafting skills, you can create your own custom fruit trees, top-work existing trees to better varieties, and produce trees for a fraction of nursery cost. Berry propagation is even simpler: raspberries and blackberries propagate from root suckers, blueberries from softwood cuttings, and grapes from hardwood cuttings. These skills make you a source of plants for your community.',
   ARRAY['Start with cleft grafting — it is the most forgiving technique for beginners', 'Collect scion wood in January-February while fully dormant and refrigerate until grafting time', 'A single grafting class or workshop accelerates your learning dramatically'],
   20, 200, '2-4 hours per session, seasonal', 10, '{}', ARRAY['intermediate','diy','seasonal'], ARRAY['winter','spring'], '{}');

END $$;
