import { mod, step } from './helpers';

const M = 'mod-orchard';
export const orchardMod = mod(M, 'orchard', 6, 'Food Production — Orchard & Perennials', 'Plant fruit trees, berry bushes, nut trees, and perennial food sources for long-term yields.', 'TreePine', '#6B8E23', 100, 'intermediate');

export const orchardSteps = [
  step('step-orchard-1', M, 1, 'Site Selection & Soil Prep',
    'Choose well-drained, full-sun areas with good air circulation to prevent frost pockets.',
    'Fruit trees need full sun and well-drained soil. Avoid frost pockets (low areas where cold air settles). Gentle slopes with good air drainage are ideal. Prep soil by testing pH and amending — most fruit trees prefer 6.0-7.0. Add compost to improve drainage and fertility.',
    ['Cold air flows downhill — plant orchards on slopes, not in valleys', 'Test soil a full year before planting so amendments have time to work'],
    0, 200, '1-2 days', [], ['planning', 'beginner'], ['fall', 'spring']),

  step('step-orchard-2', M, 2, 'Fruit Tree Variety Selection',
    'Select disease-resistant varieties suited to your climate zone and chill hours.',
    'Match varieties to your USDA zone and chill hours (hours below 45F each winter). Choose disease-resistant varieties to minimize spraying. Plant at least two varieties of each fruit for cross-pollination. Semi-dwarf trees are easiest to manage and harvest. Order from reputable nurseries.',
    ['Disease-resistant varieties save you years of spraying headaches', 'Semi-dwarf trees produce nearly as much fruit as full-size but are much easier to manage'],
    25, 75, '1-2 days research', [], ['research', 'planning'], ['winter', 'spring']),

  step('step-orchard-3', M, 3, 'Planting Layout',
    'Plan tree spacing, pollination partners, and future canopy size.',
    'Semi-dwarf trees need 12-15 feet between trees. Standard trees need 20-25 feet. Place pollination partners within 50 feet of each other. Consider permaculture guilds: plant nitrogen fixers, ground covers, and companion plants around each tree. Orient rows north-south for even sun.',
    ['Draw your orchard plan to scale — trees grow bigger than you expect', 'Plant nitrogen-fixing plants like clover or comfrey in the understory'],
    0, 100, '1 day', ['step-orchard-1', 'step-orchard-2'], ['planning', 'diy'], ['winter', 'spring']),

  step('step-orchard-4', M, 4, 'Berry Bushes & Brambles',
    'Plant blueberries, raspberries, blackberries, and currants for quick-producing fruit.',
    'Berries produce fruit 1-2 years after planting — much faster than trees. Blueberries need acidic soil (pH 4.5-5.5). Raspberries and blackberries need trellising. Currants and gooseberries tolerate shade. Plant thornless blackberry varieties near paths for easy picking.',
    ['Berries give you fruit while you wait for trees to mature', 'Blueberries need acidic soil — amend with sulfur and pine needles'],
    10, 30, '1-2 weekends', [], ['diy', 'beginner'], ['spring', 'fall']),

  step('step-orchard-5', M, 5, 'Nut Trees',
    'Plant chestnuts, hazelnuts, walnuts, or pecans appropriate to your climate zone.',
    'Nut trees are a long-term investment — most take 5-10 years to produce. Chestnuts and hazelnuts produce earliest. Black walnuts are valuable timber and food. Plant nut trees on the property perimeter where they have room to grow large. Note: black walnuts inhibit many nearby plants.',
    ['Hazelnuts produce in 3-4 years and make excellent hedgerows', 'Keep black walnuts at least 50 feet from gardens due to juglone toxicity'],
    30, 100, '1 weekend', [], ['diy', 'intermediate'], ['fall', 'spring']),

  step('step-orchard-6', M, 6, 'Herb Garden',
    'Establish perennial herbs for cooking, medicine, and pollinator support.',
    'Perennial herbs like rosemary, thyme, sage, oregano, and chives come back year after year. Plant near the kitchen door for easy access. Most herbs prefer well-drained soil and full sun. Mint spreads aggressively — contain it in pots. Herbs attract beneficial insects to your garden.',
    ['Plant herbs near the kitchen door — if they are not convenient you will not use them', 'Contain mint in pots or buried barriers — it will take over any bed'],
    30, 100, '1 day', [], ['beginner', 'diy'], ['spring']),

  step('step-orchard-7', M, 7, 'Perennial Vegetables',
    'Plant asparagus, rhubarb, sorrel, and other vegetables that return each year.',
    'Asparagus produces for 20+ years once established but takes 2-3 years to start harvesting. Rhubarb is nearly indestructible. Walking onions, sorrel, and Jerusalem artichokes require minimal care. Perennial vegetables reduce your annual planting workload significantly.',
    ['Asparagus beds produce for decades — invest in good site prep upfront', 'Jerusalem artichokes spread aggressively — plant them in a contained area'],
    20, 100, '1 weekend', [], ['diy', 'beginner'], ['spring']),

  step('step-orchard-8', M, 8, 'Pollinator Habitat',
    'Plant native wildflowers and flowering herbs to support bees and beneficial insects.',
    'Pollinators are essential for fruit production. Plant a diverse mix of native flowers that bloom from early spring through fall. Leave some areas unmowed for ground-nesting bees. Provide a shallow water source with landing stones. Avoid pesticides near flowering plants.',
    ['A diversity of bloom times from March through October supports pollinators all season', 'Leave some bare ground and dead wood for native bee nesting habitat'],
    20, 200, '1 day', [], ['diy', 'beginner'], ['spring', 'fall']),

  step('step-orchard-9', M, 9, 'Pruning Schedule',
    'Learn proper pruning techniques and schedule annual maintenance for each species.',
    'Prune most fruit trees in late winter while dormant. Summer pruning controls size. Remove dead, diseased, and crossing branches first. Open the center for light and air circulation. Berries need annual pruning to remove spent canes. Sharp, clean tools prevent disease spread.',
    ['Prune fruit trees in late winter — you can see the branch structure without leaves', 'Clean pruning tools with rubbing alcohol between trees to prevent disease spread'],
    0, 100, 'ongoing', [], ['intermediate', 'seasonal'], ['winter', 'spring']),
];
