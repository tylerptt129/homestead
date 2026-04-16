-- Seed: Module 5 — Food Production: Garden
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'garden',
    'Food Production — Garden',
    'Growing your own food is the soul of homesteading. This module takes you from selecting the perfect garden site through building beds, managing soil, and mastering the skills to produce abundance from your land season after season.',
    'sprout', 5, '#228B22', 100, 'beginner'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Garden Site Selection',
   'Choose the best location for your main garden based on sun exposure, water access, soil quality, and proximity to the kitchen.',
   'Your garden needs at least 6-8 hours of direct sunlight per day — south-facing and open to the sky is ideal. Walk your property at different times of day and note where shadows fall. The garden should be close to a water source and as near to the kitchen as practical (you will visit it multiple times daily). Good air circulation reduces disease, but avoid the windiest spots. Slightly sloped land (2-5%) provides natural drainage; avoid low spots where cold air pools (frost pockets). Proximity to the house also deters deer and other wildlife. If your best sun spot has poor soil, that is fine — you can build soil with raised beds and amendments. Starting with even a small 200 square foot garden is enough to learn the rhythms of your specific microclimate before expanding.',
   ARRAY['A 200 sq ft garden is enough to start learning — expand as your skills grow', 'Close to the kitchen means you will actually harvest daily instead of forgetting', 'Avoid frost pockets — cold air flows downhill and pools in low spots'],
   0, 50, '1-2 hours of observation', 1, '{}', ARRAY['beginner','critical'], ARRAY['spring'], '{}'),

  (mod_id, 'Soil Amendment Plan',
   'Build rich, living soil through composting, cover cropping, and targeted amendments based on your soil test results.',
   'Great gardens are built on great soil, and great soil is built over time. Start with your soil test results to guide amendments. Most garden soils benefit from generous additions of organic matter — compost, aged manure, leaf mold, or cover crop residue. Aim for 5-8% organic matter content. Adjust pH if needed: lime raises pH (for acidic soils), sulfur lowers it. Add targeted amendments for specific deficiencies (bone meal for phosphorus, greensand for potassium, etc.). For new garden plots, a first-year strategy of heavy composting plus a cover crop can transform mediocre soil remarkably fast. Apply 4-6 inches of quality compost and work it into the top 8-12 inches of soil. Plant a cover crop of clover, vetch, or winter rye to fix nitrogen and build soil structure. The best ongoing strategy is annual composting and cover cropping — feed the soil and the soil feeds the plants.',
   ARRAY['Aim for 5-8% organic matter — most gardens need 4-6 inches of compost worked in the first year', 'Cover crops like crimson clover fix nitrogen and build soil structure for free', 'Wood ash from your stove is an excellent source of potassium and raises pH slightly'],
   50, 500, '1-2 weekends', 2, '{}', ARRAY['beginner','diy','seasonal'], ARRAY['spring','fall'], '{}'),

  (mod_id, 'Raised Bed Construction',
   'Build raised beds for improved drainage, soil control, easier access, and extended growing seasons. Raised beds are the workhorse of productive homestead gardens.',
   'Standard raised beds are 4 feet wide (reachable from both sides without stepping in), 8-12 feet long, and 10-12 inches deep. Use rot-resistant lumber: untreated cedar, locust, or hemlock boards (2x10 or 2x12). Avoid pressure-treated lumber near food crops. Alternative materials include stone, concrete blocks, galvanized stock tanks, or even logs. Fill with a mix of 60% topsoil, 30% compost, and 10% coarse perlite or vermiculite for excellent drainage and fertility. Line the bottom with hardware cloth to prevent gopher and mole damage. Space beds with 2-3 foot paths between them (wide enough for a wheelbarrow). Orient beds north-south for even sun exposure on both sides. Raised beds warm up earlier in spring, drain better in wet weather, and can be covered easily with hoops and row cover for frost protection.',
   ARRAY['4 feet wide is the maximum for comfortable reaching from both sides', 'Line bottoms with hardware cloth to stop gophers and moles from below', 'Cedar lasts 10-15 years without any treatment and is food-safe'],
   100, 1000, '1-2 weekends', 3, '{}', ARRAY['beginner','diy'], ARRAY['spring','fall'], '{}'),

  (mod_id, 'Seed Starting Setup',
   'Build an indoor seed starting station with proper lighting, heat, and ventilation to grow your own transplants and save money.',
   'Starting your own transplants extends your growing season by 6-8 weeks and gives you access to hundreds of varieties not available as starts at nurseries. You need: a shelving unit, shop lights with T8 or LED grow bulbs (keep lights 2-4 inches above seedlings, 14-16 hours per day), seedling heat mats (especially for peppers and tomatoes), a fan for air circulation (strengthens stems), seed starting trays with cells and humidity domes, and a quality seed starting mix (not garden soil — too heavy and disease-prone). Start a seed starting calendar: count back from your last frost date for each crop. Tomatoes and peppers need 6-8 weeks head start; brassicas 4-6 weeks; cucurbits just 2-3 weeks. Harden off seedlings gradually over 7-10 days before transplanting outdoors.',
   ARRAY['LED shop lights work great and cost less to run than specialty grow lights', 'A gentle fan for 30 minutes twice daily strengthens stems and prevents damping off', 'Harden off seedlings over 7-10 days — start with 1 hour outdoors and increase gradually'],
   50, 300, '1 day setup, ongoing seasonal use', 4, '{}', ARRAY['beginner','diy','seasonal'], ARRAY['winter','spring'], '{}'),

  (mod_id, 'Companion Planting Map',
   'Design your garden layout using companion planting principles to naturally deter pests, improve pollination, and maximize space.',
   'Companion planting is the art of placing plants that benefit each other nearby. Classic companions: tomatoes with basil (improves flavor, repels pests), corn with beans and squash (Three Sisters — beans fix nitrogen, squash shades soil, corn provides bean trellis), carrots with onions (each repels the other''s fly pest), and marigolds with everything (repel nematodes and many insects). Plan your layout on paper before planting. Group plants by water needs and sun requirements. Use tall crops (corn, sunflowers, trellised beans) on the north side so they do not shade shorter crops. Interplant fast-maturing crops (radishes, lettuce) with slow ones (tomatoes, peppers) to double your harvest from the same space. Succession plant quick crops every 2-3 weeks for continuous harvest rather than one overwhelming glut.',
   ARRAY['The Three Sisters (corn, beans, squash) is a time-tested companion planting system', 'Marigolds planted throughout the garden repel many common pest insects', 'Succession plant lettuce, radishes, and beans every 2-3 weeks for continuous harvest'],
   0, 50, '2-4 hours planning', 5, '{}', ARRAY['beginner','diy'], ARRAY['spring'], '{}'),

  (mod_id, 'Garden Irrigation System',
   'Install efficient irrigation that delivers water directly to plant roots, reduces waste, and saves hours of hand-watering time.',
   'Drip irrigation is the best choice for garden beds — it delivers water directly to roots with 90-95% efficiency compared to overhead watering. For raised beds, install a main header line with drip tape or 1/2-inch soaker hose running the length of each bed. Connect to a timer for automated watering. Water deeply and less frequently (2-3 times per week for established plants) to encourage deep root growth. A simple system: hose bib timer, filter, pressure regulator (drip runs at 25 PSI), mainline header, and individual bed lines with shut-off valves. Mulch over the drip lines to reduce evaporation further. For containers and individual plants, use drip emitters. The whole system can be set up in an afternoon with basic fittings and no special tools.',
   ARRAY['Water deeply 2-3 times per week rather than lightly every day — this builds deep roots', 'Mulch over drip lines to reduce evaporation by another 30-40%', 'Install shut-off valves for each bed so you can adjust watering by crop needs'],
   100, 1000, '1 weekend', 6, '{}', ARRAY['beginner','diy'], ARRAY['spring','summer'], '{}'),

  (mod_id, 'Season Extension',
   'Extend your growing season with cold frames, row covers, hoop houses, and greenhouses to grow food more months of the year.',
   'Season extension techniques can add 4-8 weeks to each end of your growing season — or even enable year-round production. Start simple: floating row cover (Agribon AG-19 for light frost, AG-50 for hard frost) draped over hoops made from PVC or wire adds 4-8 degrees of frost protection. Cold frames — bottomless boxes with angled glass or polycarbonate lids — create miniature greenhouses for hardening off seedlings and growing cold-hardy greens through winter. A hoop house (unheated greenhouse made from PVC or metal hoops covered in greenhouse poly) is the game-changer: it allows you to grow year-round in most climates. Even a small 10x20 foot hoop house dramatically increases your production. Place it with the long axis east-west for maximum winter sun exposure.',
   ARRAY['A simple row cover over hoops adds 4-8 degrees of frost protection for under $50', 'Cold frames are perfect winter salad gardens — lettuce, spinach, and kale thrive in them', 'A hoop house is the single best investment for extending your growing season dramatically'],
   200, 3000, '1 weekend for cold frames, 1 week for hoop house', 7, '{}', ARRAY['diy','seasonal'], ARRAY['fall','spring'], '{}'),

  (mod_id, 'Composting System',
   'Build a composting system that turns kitchen scraps, garden waste, and animal bedding into black gold for your garden beds.',
   'Every homestead needs a composting system scaled to match its waste streams. A three-bin system is the classic approach: one bin receiving new material, one actively composting, and one with finished compost ready to use. Build bins from pallets, wire mesh, or concrete blocks — 3x3x3 feet minimum per bin. Layer brown materials (carbon: dried leaves, straw, cardboard, wood chips) with green materials (nitrogen: kitchen scraps, fresh grass, garden trimmings, animal manure) at roughly a 3:1 brown-to-green ratio by volume. Keep the pile moist like a wrung-out sponge and turn it every 1-2 weeks for fastest decomposition. Hot composting (maintained at 130-150 degrees F) kills weed seeds and pathogens and produces finished compost in 4-8 weeks. Cold composting takes 6-12 months but requires minimal effort.',
   ARRAY['A 3:1 ratio of browns to greens by volume is the sweet spot for fast composting', 'Turn the pile every 1-2 weeks and keep it moist like a wrung-out sponge', 'Chicken bedding mixed with straw is composting gold — perfect carbon-nitrogen balance'],
   50, 500, '1 weekend to build, ongoing', 8, '{}', ARRAY['beginner','diy'], '{}', '{}'),

  (mod_id, 'Harvest Tracking',
   'Track what you harvest, when, and how much. Harvest data reveals what varieties perform best and helps plan next year with confidence.',
   'Keep a simple harvest log — date, crop, variety, weight or quantity, and any notes on quality. This data is incredibly valuable over time. After a few seasons, you will know exactly which tomato varieties produce best in your microclimate, how many bean plants feed your family, and whether that new squash variety was worth the seed cost. Use a simple notebook, spreadsheet, or this app to log harvests at the end of each garden session. Weigh produce on a kitchen scale before bringing it inside — it takes 10 seconds and creates priceless data. Track surplus for preservation and what you gave away or composted (over-production that could be reduced). Many homesteaders are amazed to discover they produce over $2,000-5,000 worth of food annually from a modest garden.',
   ARRAY['Weigh every harvest — even a rough estimate beats no data at all', 'Track variety names to know what to plant again and what to drop', 'Calculate the dollar value of your harvest using local grocery or farmers market prices'],
   0, 50, 'Ongoing — 5 minutes per harvest', 9, '{}', ARRAY['beginner','diy'], ARRAY['summer','fall'], '{}'),

  (mod_id, 'Seed Saving',
   'Learn to save seeds from your best-performing plants to develop locally adapted varieties and reduce dependence on seed companies.',
   'Seed saving is a powerful self-sufficiency skill that creates varieties uniquely adapted to your microclimate over time. Start with easy crops: tomatoes (ferment seeds in water for 3 days, rinse, dry), beans and peas (let pods dry on the plant, shell and store), and lettuce (let plants bolt, harvest dry seed heads). For cross-pollinating crops like squash, corn, and brassicas, you need isolation distances or hand pollination techniques to maintain variety purity. Always save seeds from your best-performing, healthiest plants — this is how you develop a locally adapted seed bank over generations. Dry seeds thoroughly (below 8% moisture), store in airtight containers with silica gel packets in a cool, dark place. Properly stored seeds remain viable for 2-10 years depending on the species. Label everything with variety name, date, and any performance notes.',
   ARRAY['Start seed saving with tomatoes, beans, and lettuce — they are the easiest crops', 'Save from your best plants to develop locally adapted varieties over time', 'Dry seeds thoroughly and store in airtight containers with silica gel packets in a cool dark place'],
   0, 100, '1-2 hours per crop', 10, '{}', ARRAY['beginner','diy','seasonal'], ARRAY['summer','fall'], '{}');

END $$;
