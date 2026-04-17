import { mod, step } from './helpers';

const M = 'mod-tools';
export const toolsMod = mod(M, 'tools', 9, 'Tools, Equipment & Workshop', 'Inventory, organize, and maintain the tools and equipment your homestead needs.', 'Wrench', '#708090', 60, 'beginner');

export const toolsSteps = [
  step('step-tools-1', M, 1, 'Essential Hand Tools Inventory',
    'Audit what you have and identify gaps in shovels, axes, hammers, saws, and wrenches.',
    'Every homestead needs: a quality axe, a bow saw, a digging shovel, a garden fork, a framing hammer, a pry bar, screwdrivers, pliers, wrenches, and a tape measure. Buy the best quality you can afford — cheap tools break when you need them most. Check yard sales for vintage quality tools.',
    ['Buy quality hand tools once rather than replacing cheap ones repeatedly', 'Yard sales and estate sales are gold mines for quality vintage hand tools'],
    200, 1000, '2-4 hours', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-tools-2', M, 2, 'Power Tools Assessment',
    'Evaluate power tool needs: circular saw, drill, chainsaw, grinder, and more.',
    'Start with a cordless drill/driver and a circular saw — they handle 80% of projects. Add a reciprocating saw for demolition and a grinder for metal work. Chainsaw is essential if you have timber. Choose one battery platform and stick with it for tool compatibility.',
    ['Pick one cordless battery platform (DeWalt, Milwaukee, etc.) and buy within that system', 'A corded circular saw is more powerful and cheaper than cordless — fine for shop use'],
    200, 2000, '1-2 days', ['step-tools-1'], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-tools-3', M, 3, 'Workshop Layout',
    'Design efficient workshop with workbench, storage, dust collection, and good lighting.',
    'A minimum 12x16 workshop handles most homestead projects. Place the workbench near a window and under good lighting. Mount frequently used tools on pegboard within arm reach. Plan electrical circuits for power tools. A dust collection system keeps your lungs and shop clean. Insulate if possible.',
    ['Put your workbench where natural light falls — you will work there the most', 'Install twice as many electrical outlets as you think you need'],
    200, 3000, '1-2 weekends', [], ['diy'], ['spring', 'summer', 'fall']),

  step('step-tools-4', M, 4, 'Tool Storage & Organization',
    'Build pegboards, shelving, and labeled storage to keep tools accessible and protected.',
    'The rule is: every tool has a home and every tool goes home after use. Outline tools on pegboard so missing items are obvious. Use clear bins with labels for small parts. Keep bladed tools sharp and oiled. Store power tools off the floor to prevent moisture damage.',
    ['Outline tools on pegboard — you can instantly see what is missing', 'A thin coat of oil on metal tools prevents rust in humid climates'],
    50, 500, '1 weekend', ['step-tools-3'], ['diy', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-tools-5', M, 5, 'Equipment Maintenance Schedule',
    'Create a maintenance calendar for all tools and equipment.',
    'Regular maintenance prevents costly breakdowns. Sharpen blades and chains before each use season. Change oil in engines every 50-100 hours. Grease fittings monthly on heavy equipment. Replace air filters annually. A laminated maintenance checklist posted in the workshop keeps you on track.',
    ['Sharpen tools at the end of the season so they are ready when you need them', 'Keep a maintenance log for each piece of equipment with dates and work done'],
    50, 200, 'ongoing', [], ['beginner'], ['spring', 'fall']),

  step('step-tools-6', M, 6, 'Chainsaw & Forestry Gear',
    'Select the right chainsaw and safety gear: chaps, helmet, ear protection, gloves.',
    'A 16-18 inch bar handles most homestead tasks. Always wear chainsaw chaps, a helmet with face screen and ear protection, and steel-toe boots. Never cut alone. Learn proper felling techniques before cutting large trees. Keep two chains sharp and ready for each saw.',
    ['Never operate a chainsaw without chaps — they have saved countless legs', 'Take a chainsaw safety course — many extension offices offer them free'],
    300, 1000, '1-2 days', [], ['intermediate'], ['fall', 'winter']),

  step('step-tools-7', M, 7, 'Vehicle & ATV Needs',
    'Assess whether you need a truck, tractor, ATV, or utility vehicle for your property.',
    'A pickup truck is the most versatile homestead vehicle. Compact tractors (25-40 HP) handle most acreage tasks with attachments. ATVs or UTVs are useful for daily property rounds. Buy used equipment — a well-maintained older tractor costs half of new with 90% of the capability.',
    ['A compact tractor with a front-end loader is the most versatile homestead machine', 'Buy used from a retiring farmer — equipment is often well-maintained and half price'],
    2000, 30000, '1-2 weeks research', [], ['research', 'planning'], ['spring', 'summer', 'fall', 'winter']),

  step('step-tools-8', M, 8, 'Fuel Storage',
    'Set up safe, legal fuel storage for gasoline, diesel, and propane.',
    'Store gasoline in approved containers away from structures. Diesel is safer to store and lasts longer with stabilizer. Propane tanks should be placed per code distance from buildings. Treat stored gasoline with stabilizer — it degrades in 3-6 months. Rotate fuel stock regularly.',
    ['Treat all stored gasoline with fuel stabilizer — stale gas damages engines', 'Keep a minimum 30-day fuel supply for your generator and essential equipment'],
    100, 500, '1 day', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-tools-9', M, 9, 'Repair Skills Inventory',
    'Assess your mechanical, electrical, plumbing, and carpentry abilities and plan learning.',
    'Rate yourself honestly in: basic carpentry, plumbing, electrical, small engine repair, welding, and vehicle maintenance. Focus on learning the skills you will use most often. YouTube is an incredible resource, but hands-on practice is essential. Take local community college continuing education courses.',
    ['Small engine repair is the most frequently needed skill on a homestead', 'Practice new skills on low-stakes projects before tackling critical repairs'],
    0, 500, 'ongoing', [], ['planning', 'beginner'], ['spring', 'summer', 'fall', 'winter']),
];
