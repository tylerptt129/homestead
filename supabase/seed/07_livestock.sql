-- Seed: Module 7 — Livestock & Animals
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'livestock',
    'Livestock & Animals',
    'Animals bring a homestead to life — and add a new dimension of responsibility. From choosing the right species for your land to housing, feeding, health care, and processing, this module covers the complete livestock journey.',
    'egg', 7, '#CD853F', 120, 'intermediate'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Species Selection for Your Land',
   'Choose livestock species and breeds that match your land, climate, experience level, and homesteading goals.',
   'Start by honestly assessing your land capacity, time commitment, and experience. Chickens are the universal starter animal — they are affordable, productive (eggs daily), educational, and forgiving of beginner mistakes. A flock of 6-12 hens suits most families. Goats are excellent for smaller properties — dairy goats provide milk, cheese, and yogurt; meat goats are hardy grazers. Sheep are quieter than goats and provide wool plus meat. Pigs are efficient converters of kitchen scraps and garden waste into meat but need sturdy fencing. Cattle require the most land (2-5 acres per cow-calf pair minimum) and infrastructure. Consider the rule of starting small: begin with one species, learn its rhythms, then add another after a full year cycle. Match breeds to your climate — heritage breeds are typically hardier and more self-sufficient than commercial breeds.',
   ARRAY['Start with chickens — they teach you animal husbandry basics with low risk', 'Heritage breeds are hardier, more self-sufficient, and better foragers than commercial breeds', 'Add one new species per year maximum — each animal has a full year of learning cycles'],
   0, 100, '1-2 weeks of research', 1, '{}', ARRAY['beginner','critical'], '{}', '{}'),

  (mod_id, 'Housing Design',
   'Design and build appropriate shelter for each species. Good housing protects animals from weather, predators, and disease.',
   'Every species needs shelter that provides protection from rain, wind, and temperature extremes while maintaining good ventilation (ammonia buildup from manure is a serious respiratory hazard). Chicken coops need 4 square feet per bird inside plus 10 square feet per bird in a run, with roosts, nesting boxes (1 per 3-4 hens), and predator-proof construction. Goat shelters need 15-20 square feet per goat with draft-free walls but open ventilation at the roofline. Use three-sided shelters that face away from prevailing winter winds. All livestock housing needs easy-to-clean floors, good drainage, and convenient access for daily chores. Build with durability in mind — animals are hard on structures. Plan manure management from the start: a composting area near each shelter turns waste into garden gold.',
   ARRAY['Ventilation matters more than warmth — ammonia from manure causes respiratory disease', 'Build predator-proof from day one — hardware cloth, not chicken wire, on coops', 'Design for easy cleaning — you will muck out shelters hundreds of times'],
   500, 5000, '1-3 weekends', 2, '{}', ARRAY['diy','critical'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Fencing Plan',
   'Design and install fencing appropriate for each species. Good fencing is the foundation of stress-free livestock management.',
   'The right fence depends on the animal: chickens need enclosed runs with hardware cloth (buried 12 inches to prevent digging predators) or electric poultry netting for rotational grazing; goats need 4-foot woven wire with a hot wire along the top (they test every fence relentlessly); sheep need 4-foot woven wire or 5-strand electric; pigs need strong panels or electric at nose height; cattle need 4-5 strand barbed or high-tensile electric. Portable electric fencing is invaluable for rotational grazing — moving animals to fresh pasture improves their health, distributes manure, and prevents parasite loads. Use a quality solar-powered fence charger. Plan your fencing layout around rotational paddocks, water access points, handling areas, and connection paths between pastures and shelter. Install proper gates — wide enough for equipment, easy to open and close with one hand (because the other will be holding a bucket).',
   ARRAY['Electric poultry netting is the easiest way to rotate chickens on fresh pasture', 'Goats are the Houdinis of livestock — they will find and exploit any fence weakness', 'One-hand operable gates are essential — you will always be carrying something in the other hand'],
   500, 5000, '1-2 weeks', 3, '{}', ARRAY['diy','critical'], ARRAY['spring','summer','fall'], '{}'),

  (mod_id, 'Feed Sourcing & Storage',
   'Plan reliable feed sources, proper storage, and feeding systems. Consistent nutrition is the foundation of animal health and productivity.',
   'Calculate feed needs for each species: laying hens eat about 1/4 pound of feed per day; dairy goats need 3-5 pounds of hay plus 1-2 pounds of grain while milking; pigs on pasture need 5-8 pounds of feed daily. Find local feed suppliers and compare quality and prices. Buy in bulk when possible — a ton of feed is significantly cheaper per pound than 50-pound bags. Store all feed in rodent-proof containers: metal trash cans with locking lids, galvanized bins, or a dedicated feed room with solid walls and a concrete floor. Hay needs a dry, ventilated storage area — a simple pole barn with a roof keeps hay in good condition. For long-term self-sufficiency, plan to grow some of your own feed: corn, oats, sunflowers, mangels (fodder beets), and comfrey are all excellent homestead livestock feeds.',
   ARRAY['Metal trash cans with locking lids are affordable rodent-proof feed storage', 'Buy feed in bulk to save 20-40% compared to individual bag prices', 'Growing comfrey patches provides free, nutrient-rich supplemental feed for almost any animal'],
   200, 2000, '2-4 hours setup + ongoing', 4, '{}', ARRAY['beginner','diy'], '{}', '{}'),

  (mod_id, 'Water Systems for Animals',
   'Set up reliable, clean water access for all livestock. Fresh water is the single most important nutrient for every animal.',
   'Animals need fresh, clean water available at all times. Chickens drink about 1 pint per bird per day (more in heat); goats need 2-4 gallons per day; cattle need 10-30 gallons per day. Automatic watering systems save enormous time: nipple waterers for poultry, float-valve troughs for ruminants, and heated waterers for freezing climates. In winter, frozen water is the biggest daily chore challenge on a homestead — invest in heated waterers or tank heaters. Position water points to be easily refillable (near a hydrant or hose bib) and on ground that drains well (water areas get muddy fast). Consider gravity-fed systems from a higher-elevation tank to reduce reliance on electricity. Clean water containers weekly and check daily — livestock can go longer without food than without water.',
   ARRAY['Heated waterers or tank de-icers are essential investments for cold climates', 'Position water troughs on well-drained ground — the area around water gets muddy fast', 'Automatic float valves save massive time and ensure water is always available'],
   100, 1000, '1-2 days', 5, '{}', ARRAY['diy','critical'], '{}', '{}'),

  (mod_id, 'Health & Veterinary Plan',
   'Establish a health management plan including preventive care, common ailment treatment, and emergency veterinary contacts.',
   'Find a large-animal veterinarian in your area before you need one — emergency is not the time to search. Build a livestock first aid kit: wound spray, blood stop powder, syringes and needles, thermometer, hoof trimmers, dewormer, electrolyte powder, and antibiotics prescribed by your vet. Learn the normal vital signs for each species so you can detect problems early. Establish a vaccination schedule appropriate for your area (your vet and county extension agent can advise). Implement a parasite management plan — rotational grazing is the best prevention, supplemented by targeted deworming based on fecal egg counts rather than routine blanket deworming (which breeds resistant parasites). Keep health records for every animal: vaccinations, deworming dates, illnesses, treatments, and breeding history.',
   ARRAY['Find a large-animal vet before you need one — emergencies are not the time to search', 'Learn normal vital signs for your species so you can spot problems early', 'Use fecal egg counts to guide deworming rather than routine blanket treatment'],
   100, 1000, 'Ongoing — plan setup 1 day', 6, '{}', ARRAY['critical','intermediate'], '{}', '{}'),

  (mod_id, 'Breeding Program',
   'Plan a sustainable breeding program to maintain or grow your herd/flock without constantly purchasing new stock.',
   'A breeding program gives you control over your livestock genetics and eliminates the ongoing cost and disease risk of buying replacement stock. For chickens, keep or borrow a rooster and an incubator or broody hen to hatch replacement pullets annually. For goats and sheep, you can keep a buck/ram (requires separate housing and sturdy fencing) or arrange seasonal breeding with a neighbor''s male or use artificial insemination. Keep detailed breeding records: sire, dam, breeding date, birth date, number of offspring, and any complications. Select your best animals for breeding based on the traits you value most: production, hardiness, temperament, mothering ability, and foraging skill. Cull (sell or process) animals that do not meet your standards — this improves your flock or herd over generations.',
   ARRAY['A broody hen or simple incubator lets you hatch your own replacement chicks', 'Keep detailed breeding records from the start — genetics improvement compounds over years', 'Select breeders for hardiness and mothering ability, not just production numbers'],
   0, 500, 'Ongoing — seasonal planning', 7, '{}', ARRAY['intermediate','seasonal'], ARRAY['fall','winter','spring'], '{}'),

  (mod_id, 'Processing Setup',
   'Set up a clean, efficient processing area for eggs, milk, or meat. Proper processing ensures food safety and makes the work sustainable.',
   'Whether you are processing eggs (washing, candling, packaging), milk (straining, pasteurizing or culturing, cheese making), or meat (humane slaughter, plucking/skinning, butchering, packaging), you need a dedicated, clean workspace. For poultry processing, set up an outdoor station with: kill cones, a scalding pot (145-150°F), a plucking area (mechanical plucker if processing more than a few birds), a stainless steel table for evisceration, and a chill tank with ice water. For dairy, you need a milk stand, stainless steel pail, strainer and filters, and refrigeration. For larger animals, research your state''s regulations — many states allow on-farm slaughter for personal use. Learn proper techniques from experienced mentors and process your first animals with someone who has done it before.',
   ARRAY['Process your first animals alongside an experienced mentor — it makes a huge difference', 'Check your state regulations on on-farm processing and sales', 'Invest in quality stainless steel equipment — it is easier to clean and lasts forever'],
   200, 2000, '1-2 weekends to set up', 8, '{}', ARRAY['intermediate','diy'], ARRAY['fall'], '{}'),

  (mod_id, 'Predator Protection',
   'Implement a multi-layered predator protection strategy. Predators are the number one cause of livestock losses on homesteads.',
   'Predator protection requires multiple layers: physical barriers (hardware cloth, not chicken wire — raccoons reach through chicken wire), electric fencing (hot wire deters everything from raccoons to bears), livestock guardian animals (dogs, llamas, and donkeys all protect against different predators), secure nighttime housing (lock animals in at dusk — most predation happens at night), and deterrents (motion-activated lights and alarms, predator decoys). Know your local predator species: aerial predators (hawks, owls, eagles) require overhead cover or netting; canine predators (coyotes, foxes, dogs) require solid fencing and guardians; climbing predators (raccoons, bears) require electric and secure latches. A livestock guardian dog is the single most effective predator deterrent for pastured animals. Never use lethal traps near areas where children, pets, or non-target wildlife might encounter them.',
   ARRAY['Hardware cloth is predator-proof; chicken wire is NOT — raccoons easily tear through it', 'Lock all birds in a secure coop at dusk — most predation happens at night', 'A livestock guardian dog is the single most effective protection for pastured animals'],
   200, 2000, '1-2 weekends', 9, '{}', ARRAY['critical','diy'], '{}', '{}'),

  (mod_id, 'Record Keeping',
   'Establish a comprehensive record keeping system for all livestock. Good records drive better decisions about breeding, health, feed efficiency, and profitability.',
   'Track for every animal: acquisition date and source, identification (band number, ear tag, name), breed and lineage, vaccination and deworming history, breeding dates and offspring, health events and treatments, production data (eggs per day, milk per milking, weight gain), and feed consumption. For flocks of chickens, track at the flock level rather than individual birds (unless you have a small flock of named birds). Production records reveal which animals are worth keeping and which should be culled. Health records help your vet diagnose recurring issues. Breeding records prevent inbreeding and track genetic improvement. Feed records calculate your true cost of production — what does each dozen eggs or gallon of milk actually cost you? This data transforms homesteading from guesswork into informed management. Use this app, a dedicated notebook, or a simple spreadsheet.',
   ARRAY['Track production weekly at minimum — egg counts, milk volume, weight gains', 'Calculate your actual cost per dozen eggs or per gallon of milk — the numbers may surprise you', 'Good records for 2-3 years reveal patterns you can not see in a single season'],
   0, 100, 'Ongoing — 10 minutes daily', 10, '{}', ARRAY['beginner','diy'], '{}', '{}');

END $$;
