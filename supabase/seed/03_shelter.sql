-- Seed: Module 3 — Shelter & Structures
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'shelter',
    'Shelter & Structures',
    'Your home is the heart of your homestead. From choosing the right foundation to finishing touches and outbuildings, this module guides you through building or renovating the structures that will shelter your family and support your homesteading operations.',
    'home', 3, '#A0522D', 500, 'advanced'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Foundation Type Selection',
   'Choose the right foundation for your soil type, climate, terrain, and building design. The foundation determines the longevity and structural integrity of everything above it.',
   'Your foundation choice depends on soil type, frost depth, slope, budget, and building design. Common options: concrete slab-on-grade (simplest, best for flat sites with stable soil), crawl space (allows access to utilities, good for mild climates), full basement (adds living or storage space, required in cold climates for frost protection), pier and beam (ideal for slopes and rocky soil, minimal excavation), and rubble trench (permaculture favorite — gravel-filled trench below frost line, affordable and effective). Get a soil bearing capacity test before choosing. In cold climates, your foundation must extend below the frost line. On slopes, stepped foundations or piers avoid massive excavation costs. Always include proper drainage around the foundation — interior and exterior French drains, waterproofing membrane, and gravel backfill.',
   ARRAY['A full basement doubles your usable square footage at a fraction of above-ground building costs', 'Rubble trench foundations are affordable, code-compliant in many jurisdictions, and drain beautifully', 'Get a soil bearing capacity test — soft soil may require engineered footings'],
   2000, 15000, '1-3 weeks', 1, '{}', ARRAY['contractor-needed','critical'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Floor Plan Design',
   'Design a floor plan that maximizes efficiency, natural light, passive solar gain, and works with your daily homestead workflow.',
   'A great homestead floor plan integrates your indoor and outdoor life. Orient the building with the long axis east-west to maximize south-facing windows for passive solar gain. Place the kitchen and main living areas on the south side with large windows. Put the mudroom entry near your barn and garden for a clean transition from dirty outdoor work. Include a large, functional mudroom with boot storage, coat hooks, a utility sink, and space for gear. Plan the kitchen for food processing — extra counter space, a second sink, and space for canning equipment. Consider a pantry or root cellar accessible from the kitchen. Plan bedrooms on the quiet north side. If building in phases, design the full plan first and build the essential section, leaving connection points for future expansion.',
   ARRAY['Orient the long axis east-west for maximum passive solar benefit', 'A generous mudroom is the most-used room on a working homestead', 'Design the full plan first, even if you build in phases — it prevents awkward additions later'],
   0, 5000, '2-4 weeks', 2, '{}', ARRAY['diy','critical'], '{}', '{}'),

  (mod_id, 'Framing Approach',
   'Select your framing method and materials. Options range from conventional stick framing to timber frame, SIPs, straw bale, and other alternative methods.',
   'Conventional 2x6 stick framing is the most common and gives you the widest contractor pool. However, homesteaders often explore alternatives: timber frame (beautiful, durable, can use local wood), structural insulated panels or SIPs (extremely energy efficient, fast to erect, fewer thermal bridges), straw bale (excellent insulation, uses agricultural waste, thick walls give wonderful character), cob (earthen building, virtually free materials, labor intensive), and cordwood (stack short logs in mortar, uses thinnings from your woodlot). Each method has different skill requirements, tool needs, code approval challenges, and costs. Many successful homestead buildings combine methods — a timber frame structure with SIP or straw bale infill, for example. Whatever you choose, ensure it meets your local building code requirements.',
   ARRAY['SIP panels go up incredibly fast and create an airtight, well-insulated shell', 'Timber framing with locally milled lumber connects your building to your land', 'Check with your local building department early — some alternative methods need engineering approval'],
   5000, 30000, '2-8 weeks', 3, '{}', ARRAY['contractor-needed','diy'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Roofing',
   'Choose roofing materials and design for your climate, snow load, rainwater collection needs, and long-term durability.',
   'Your roof is the first line of defense against weather and a primary rainwater collection surface. Metal roofing is the top choice for homesteads: it lasts 50+ years, sheds snow efficiently, is lightweight, ideal for rainwater harvesting, and comes in many profiles and colors. Standing seam metal is the gold standard but costs more than corrugated or exposed fastener panels. Other options: asphalt shingles (affordable, 20-30 year life, adequate for rainwater with first-flush diverter), cedar shakes (beautiful, 30-40 year life with maintenance, good in wooded settings), and slate or tile (virtually permanent but extremely heavy and expensive). Design your roof pitch for your climate — steeper pitches (8:12 or more) shed snow well, while moderate pitches (4:12 to 6:12) balance material costs with performance. Include generous overhangs (24-36 inches) to protect walls and create shaded outdoor work areas.',
   ARRAY['Standing seam metal roofing is ideal for both longevity and rainwater collection', 'Design overhangs of 24-36 inches to protect walls from rain and provide shade', 'Factor in snow load requirements for your area — check local building code for minimum'],
   3000, 15000, '1-2 weeks', 4, '{}', ARRAY['contractor-needed'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Insulation Strategy',
   'Choose insulation materials and strategies that create a comfortable, energy-efficient envelope suited to your climate and building method.',
   'Insulation is the single most impactful energy investment you can make. In cold climates, aim for R-40 or higher in walls and R-60+ in the ceiling. Common options: fiberglass batts (affordable, widely available, R-3.2 per inch), spray foam (closed cell R-6.5 per inch, also air and vapor barrier, more expensive), rigid foam board (R-5 per inch, excellent for continuous exterior insulation), cellulose (R-3.7 per inch, blown in, made from recycled paper, excellent for retrofits), mineral wool (R-4.3 per inch, fire resistant, moisture tolerant, soundproofing), and natural options like sheep wool, hemp, or straw. The key is continuous insulation with no thermal bridges — breaks in insulation create cold spots and condensation problems. Always pair insulation with proper air sealing and vapor management. A blower door test after construction verifies your building envelope tightness.',
   ARRAY['Air sealing matters as much as insulation — seal every penetration, gap, and joint', 'Continuous exterior rigid foam eliminates thermal bridging through studs', 'A blower door test is the best way to verify your building envelope performance'],
   1500, 8000, '3-7 days', 5, '{}', ARRAY['diy','contractor-needed'], '{}', '{}'),

  (mod_id, 'Windows & Doors',
   'Select and install windows and doors that balance natural light, ventilation, energy efficiency, and security for your homestead.',
   'Windows and doors are your biggest potential energy loss points and your connection to the landscape. Choose minimum double-pane, low-E glass for cold climates; triple-pane for very cold areas. U-factor below 0.30 is good; below 0.20 is excellent. South-facing windows should have high solar heat gain coefficient (SHGC) for passive solar; east and west windows should have low SHGC to prevent overheating. Fiberglass frames outperform vinyl in extreme temperatures and last longer. Plan operable windows for cross-ventilation — this is free cooling. Include screen doors on entries used during garden season. Exterior doors should be solid core (fiberglass or steel) with weatherstripping and a proper threshold. Consider a covered porch with a screen for three-season outdoor living that extends your comfortable space.',
   ARRAY['South windows with high SHGC can provide significant free heat in winter', 'Fiberglass frames expand and contract like the glass itself — no seal failures over time', 'Plan operable windows on opposite walls for effective cross-ventilation cooling'],
   2000, 10000, '3-7 days', 6, '{}', ARRAY['contractor-needed','diy'], '{}', '{}'),

  (mod_id, 'Interior Walls',
   'Frame and finish interior walls with appropriate materials for each room function, considering moisture, durability, and the working homestead lifestyle.',
   'Interior walls on a homestead need to handle more abuse than in a suburban home — muddy hands, moving firewood, canning splashes, and heavy use. Use moisture-resistant drywall (green board or DensArmor) in kitchens, bathrooms, and mudrooms. Consider beadboard wainscoting in high-traffic areas — it is beautiful, durable, and hides scuffs. Plaster over lath gives old-world character and excellent soundproofing if you want that mountain cabin feel. Plan for extra-wide doorways and hallways (36 inches minimum) to move equipment and furniture. Install backing boards behind drywall where you plan to mount shelves, cabinets, or heavy items. Leave walls open for inspection before closing them up — photograph all wiring and plumbing runs for future reference.',
   ARRAY['Photograph all wiring and plumbing before closing walls — you will need this reference later', 'Beadboard wainscoting in mudrooms and kitchens is practically indestructible and looks great', 'Use moisture-resistant drywall in any room where water is present'],
   1000, 5000, '1-2 weeks', 7, '{}', ARRAY['diy','contractor-needed'], '{}', '{}'),

  (mod_id, 'Exterior Finish',
   'Choose and apply exterior cladding that protects your structure, reflects your homestead aesthetic, and requires minimal long-term maintenance.',
   'Your exterior finish is the weather barrier and the face of your homestead. Board and batten siding is the classic homestead look — vertical boards with narrow battens covering the gaps. It can be done with locally milled lumber for minimal cost. Cedar or larch are naturally rot-resistant choices. Other excellent options: cedar shingles (timeless mountain cabin look), stone veneer (durable and beautiful on lower portions), and metal siding (maintenance-free, modern agricultural aesthetic). If using wood, leave it natural to weather to silver-gray, or finish with a penetrating oil stain (not paint — stain does not peel). Consider a stone or concrete base (first 18 inches above grade) to protect wood from splash-back. Include a rain screen gap behind any wood siding to allow drainage and drying. Generous overhangs protect siding and extend its life dramatically.',
   ARRAY['Board and batten from locally milled lumber is affordable and authentically beautiful', 'A rain screen gap behind wood siding prevents rot and dramatically extends its life', 'Let cedar or larch weather naturally — it turns a beautiful silver-gray and never needs repainting'],
   2000, 10000, '1-3 weeks', 8, '{}', ARRAY['diy','contractor-needed'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Outbuildings Planning',
   'Plan essential outbuildings — tool sheds, animal shelters, woodsheds, root cellars, and storage buildings that support daily homestead operations.',
   'A working homestead needs more than just a house. Plan outbuildings based on priority: a tool and equipment shed (protects valuable tools from weather), woodshed (keeps firewood dry, oriented for prevailing breeze to aid seasoning), animal shelters sized for your planned livestock, a root cellar or cool storage for food preservation, and a garden shed or potting bench near the garden. Position outbuildings along daily chore paths to minimize walking distance. Use the same architectural language as your house for visual harmony — matching roof pitch, materials, and color ties the homestead together. Many homesteaders build outbuildings first and even live in them temporarily while constructing the main house. Check zoning for any restrictions on outbuilding size, number, or setback distances.',
   ARRAY['Build the woodshed first — you need dry firewood before you need a fancy house', 'Match roof pitch and materials between buildings for a cohesive homestead look', 'Position outbuildings along your daily chore path to minimize steps'],
   1000, 10000, '1-4 weeks per building', 9, '{}', ARRAY['diy'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Workshop & Barn',
   'Plan and build a multi-purpose workshop or barn that serves as your homestead command center for repairs, projects, animal care, and equipment storage.',
   'A good workshop or barn is the operational heart of a homestead. Size it generously — everyone wishes they had built bigger. A minimum 24x32 foot building gives you a two-bay garage/workshop area plus storage. Key features: concrete floor in the shop area (easy to clean, supports heavy equipment), a workbench along one wall with good lighting, electrical outlets every 4 feet (220V for welders and air compressors), a wood stove for winter work sessions, wide doors (10 feet minimum) for tractor or truck access, and a loft for hay or materials storage. If including animal stalls, plan for concrete or packed earth floors with drainage, easy-clean surfaces, good ventilation (ridge vent plus low wall vents), and water access. Consider pole barn construction — it is the most cost-effective way to enclose a large area and is well within DIY skills.',
   ARRAY['Build 20% bigger than you think you need — you will fill it', 'Pole barn construction is affordable, fast, and well-suited to DIY builders', 'Plan 220V electrical service for the workshop — welders and compressors need it'],
   5000, 30000, '2-6 weeks', 10, '{}', ARRAY['diy','contractor-needed'], ARRAY['spring','summer','fall'], '{}');

END $$;
