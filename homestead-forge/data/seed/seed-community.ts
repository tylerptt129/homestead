import { mod, step } from './helpers';

const M = 'mod-community';
export const communityMod = mod(M, 'community', 12, 'Community & Skills', 'Assess your skills, find mentors, build trade networks, and chart your path to self-sufficiency.', 'Users', '#6A5ACD', 40, 'beginner');

export const communitySteps = [
  step('step-comm-1', M, 1, 'Skill Gap Assessment',
    'Honestly evaluate your abilities across all homestead domains and identify critical gaps.',
    'Rate yourself 1-5 in each area: carpentry, plumbing, electrical, mechanical repair, gardening, animal husbandry, food preservation, financial management, and first aid. Be honest — identifying gaps now prevents dangerous mistakes later. Focus on safety-critical skills first.',
    ['Rate yourself honestly — overestimating your skills leads to costly mistakes', 'Safety-critical skills (chainsaw operation, electrical work) should be learned from experts, not YouTube'],
    0, 0, '2-4 hours', [], ['planning', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-comm-2', M, 2, 'Priority Skills to Learn',
    'Rank skills by urgency and importance, focusing on safety-critical abilities first.',
    'Put safety skills first: first aid, chainsaw safety, electrical basics, and fire safety. Then build skills in order of your homestead phases: if water is Phase 1, learn plumbing first. Pair book learning with hands-on practice. One new skill per month is a sustainable pace.',
    ['Learn one new skill thoroughly per month rather than dabbling in many at once', 'Pair YouTube tutorials with actual hands-on practice for real skill development'],
    0, 500, 'ongoing', ['step-comm-1'], ['planning'], ['spring', 'summer', 'fall', 'winter']),

  step('step-comm-3', M, 3, 'Local Mentor Network',
    'Find experienced homesteaders, farmers, and tradespeople willing to teach and advise.',
    'Attend your county extension office events, farmers markets, and local agricultural fairs. Introduce yourself and express genuine interest in learning. Offer to help on established farms in exchange for knowledge. Many experienced homesteaders love teaching and rarely get asked.',
    ['Offer to help with their projects in exchange for teaching — most farmers appreciate an extra hand', 'The county extension office is an underused free resource for agricultural knowledge'],
    0, 0, 'ongoing', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-comm-4', M, 4, 'Barter & Trade Connections',
    'Build a network for trading goods, skills, and labor with neighbors and other homesteaders.',
    'Trade your surplus for what you lack: eggs for firewood, garden produce for equipment use, labor for skills training. Keep trades fair and informal. Build a reputation as reliable and generous. A good barter network reduces cash needs and builds community bonds.',
    ['Always give a little more than expected in trades — generosity builds strong trade relationships', 'Keep a list of what you can offer and what you need so you are ready when opportunities arise'],
    0, 0, 'ongoing', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-comm-5', M, 5, 'Community Resources Map',
    'Map nearby feed stores, hardware stores, vets, hospitals, co-ops, and essential services.',
    'Create a list with addresses, hours, and phone numbers for: nearest hospital, fire station, vet, feed store, hardware store, farm supply, co-op, lumber yard, and equipment dealer. Include driving times. Having this list ready saves critical time in emergencies.',
    ['Keep this list posted on your fridge and saved in your phone', 'Visit each business in person and introduce yourself — personal relationships get you better service'],
    0, 0, '1 day', [], ['planning', 'beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-comm-6', M, 6, 'Online Communities',
    'Join homesteading forums, subreddits, YouTube channels, and social media groups.',
    'Reddit r/homesteading, Permies.com, and BackYardChickens.com are active and helpful. YouTube channels offer visual learning for nearly any skill. Join regional groups for location-specific advice. Be a contributor, not just a consumer — sharing your experiences helps others.',
    ['Permies.com has the deepest homesteading knowledge base online', 'Regional Facebook groups are great for finding local resources, livestock, and equipment'],
    0, 0, '1 day', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-comm-7', M, 7, 'Library & Reference Materials',
    'Build a reference library of essential homesteading books and guides.',
    'Essential books: The Encyclopedia of Country Living (Carla Emery), The Backyard Homestead (Carleen Madigan), Mini Farming (Brett Markham), and your regional gardening guide. Keep equipment manuals organized. Bookmark reliable websites. A physical library works when the internet does not.',
    ['The Encyclopedia of Country Living is the single most comprehensive homesteading reference', 'Keep equipment manuals in a binder in the workshop — you will reference them often'],
    50, 300, 'ongoing', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-comm-8', M, 8, 'Teaching & Sharing Skills',
    'Share what you know with others through teaching, writing, or mentoring newcomers.',
    'Teaching solidifies your own knowledge. Offer workshops, write blog posts, or mentor new homesteaders. You do not need to be an expert — being one step ahead is enough to help someone behind you. Teaching also builds your community reputation and often leads to valuable connections.',
    ['You do not need to be an expert to teach — being one step ahead of a beginner is enough', 'Teaching a skill is the best way to truly master it yourself'],
    0, 0, 'ongoing', [], ['beginner'], ['spring', 'summer', 'fall', 'winter']),

  step('step-comm-9', M, 9, 'Self-Sufficiency Roadmap',
    'Create a long-term plan mapping your journey from beginner to self-sufficient homesteader.',
    'Define what self-sufficiency means to you — it is a spectrum, not a binary state. Set 1-year, 3-year, and 5-year goals. Identify which dependencies you want to eliminate first (food, energy, water). Celebrate milestones along the way. The journey matters as much as the destination.',
    ['Self-sufficiency is a direction, not a destination — every step toward it improves your life', 'Celebrate each milestone — you are doing something most people only dream about'],
    0, 0, '1 day', ['step-comm-1'], ['planning'], ['spring', 'summer', 'fall', 'winter']),
];
