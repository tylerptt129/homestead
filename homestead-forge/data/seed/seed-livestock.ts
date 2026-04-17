import { mod, step } from './helpers';

const M = 'mod-livestock';
export const livestockMod = mod(M, 'livestock', 7, 'Livestock & Animals', 'Choose, house, feed, and manage animals suited to your land, climate, and goals.', 'Bird', '#CD853F', 160, 'intermediate');

export const livestockSteps = [
  step('step-livestock-1', M, 1, 'Species Selection',
    'Evaluate which animals fit your land size, climate, goals, and experience level.',
    'Start with the easiest animals: chickens for eggs, then add as you gain experience. Match animals to your acreage — you need roughly 2 acres per cow, 1/4 acre per goat. Consider your goals: eggs, meat, milk, fiber, or pest control. Check local ordinances for livestock restrictions.',
    ['Start with chickens — they are the easiest livestock and produce within months', 'Do not get a single animal of any social species — they need companions'],
    0, 0, '1-2 weeks research', [], ['planning', 'research', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-livestock-2', M, 2, 'Housing Design',
    'Design shelters for each species: coops, barns, shelters, stalls.',
    'Every animal needs shelter from weather and predators. Chickens need 4 sq ft per bird inside, 10 sq ft in the run. Goats need a dry, draft-free shelter with 15 sq ft per goat. Provide adequate ventilation without drafts. Build sturdy — animals are hard on structures.',
    ['Ventilation is critical — ammonia buildup causes respiratory disease', 'Build structures stronger than you think necessary — livestock will test everything'],
    200, 5000, '1-2 weeks', ['step-livestock-1'], ['diy'], ['spring', 'summer', 'fall']),

  step('step-livestock-3', M, 3, 'Fencing Plan',
    'Design perimeter and rotational fencing for each animal type.',
    'Good fencing is the most important livestock infrastructure. Electric netting works well for poultry and goats. Woven wire with a hot wire on top handles most livestock. Plan rotational paddocks to prevent overgrazing. Budget more for fencing than you think — it is always the biggest expense.',
    ['Electric fencing is cheaper, more flexible, and easier to move than permanent fencing', 'Goats will test every fence — add a hot wire at nose height'],
    500, 5000, '1-2 weeks', ['step-livestock-1'], ['diy'], ['spring', 'summer', 'fall']),

  step('step-livestock-4', M, 4, 'Feed Sourcing & Storage',
    'Locate feed suppliers and plan pest-proof, moisture-proof feed storage.',
    'Find 2-3 feed suppliers and compare prices. Buy in bulk when possible. Store feed in metal trash cans or bins with tight lids to prevent rodents. Keep feed dry — wet feed grows mold and makes animals sick. Calculate monthly feed costs per animal before committing to livestock.',
    ['Metal trash cans with bungee-cord lids are the cheapest rodent-proof storage', 'Know your monthly feed cost per animal before buying the animals'],
    100, 500, 'ongoing', ['step-livestock-1'], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-livestock-5', M, 5, 'Water Systems for Animals',
    'Install automatic waterers, heated buckets, or gravity-fed watering systems.',
    'Clean water is essential — animals drink more than you expect. Chickens need about 1 pint per bird per day. A single goat drinks 2-4 gallons daily. Heated waterers prevent freezing in winter. Automatic waterers save daily chore time. Position water away from feed to keep it clean.',
    ['Heated water buckets are worth every penny in cold climates', 'Dirty water is the most common cause of reduced egg and milk production'],
    50, 500, '1-2 days', [], ['diy', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-livestock-6', M, 6, 'Health & Veterinary Plan',
    'Find a large animal vet and learn basic health assessment skills.',
    'Find a farm vet before you need one — emergency vet visits cost double. Learn to check body condition, identify common parasites, and recognize illness signs. Build a livestock first aid kit. Plan vaccination schedules with your vet. Prevention is far cheaper than treatment.',
    ['Establish a relationship with a farm vet before you have an emergency', 'Learn to do your own fecal egg counts for parasite monitoring — it saves hundreds per year'],
    100, 500, 'ongoing', ['step-livestock-1'], ['research'], ['spring', 'summer', 'fall', 'winter']),

  step('step-livestock-7', M, 7, 'Breeding Program',
    'Plan breeding schedules and select genetics for your goals.',
    'Decide if you will breed your own animals or buy replacements. Keep breeding records meticulously. Time breeding so babies arrive in mild weather (spring). Separate males when not breeding to prevent unplanned pregnancies. Consider AI (artificial insemination) to access better genetics without owning a male.',
    ['Time births for spring when weather is mild and forage is growing', 'Keep detailed breeding records — good genetics compound over generations'],
    0, 1000, 'ongoing', ['step-livestock-1'], ['intermediate'], ['spring', 'fall']),

  step('step-livestock-8', M, 8, 'Predator Protection',
    'Install predator-proof fencing, guardian animals, or electric deterrents.',
    'Know your local predators: hawks, foxes, coyotes, raccoons, bears. Bury hardware cloth 12 inches deep around chicken coops. Close all animals in secure housing at night. Guardian dogs, donkeys, or llamas deter coyotes and dogs. Electric fencing is the most versatile predator deterrent.',
    ['A single night of a predator getting in can wipe out your entire flock', 'Livestock guardian dogs are the most effective predator deterrent for larger properties'],
    200, 2000, '1-2 weekends', ['step-livestock-3'], ['diy'], ['spring', 'summer', 'fall', 'winter']),

  step('step-livestock-9', M, 9, 'Record Keeping',
    'Track breeding dates, health events, production, and expenses per animal.',
    'Record feed costs, production (eggs, milk, meat weights), health treatments, and breeding dates. Calculate your actual cost per dozen eggs or per gallon of milk. Good records help you identify your best and worst producers. A simple notebook or spreadsheet works fine.',
    ['Track cost per unit of production — you may be surprised which animals are profitable', 'Color-coded leg bands make it easy to identify individual birds'],
    0, 50, 'ongoing', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),
];
