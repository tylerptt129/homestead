-- Seed: Module 12 — Community & Skills
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'community',
    'Community & Skills',
    'No homestead is an island. This module helps you honestly assess your skills, prioritize what to learn, find mentors and community, and build the human connections that make homesteading sustainable and joyful long-term.',
    'users', 12, '#9370DB', 30, 'beginner'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Skill Gap Assessment',
   'Honestly evaluate your current skills across all homesteading domains and identify critical gaps that need to be addressed.',
   'Create a skills matrix covering every major homesteading domain: construction (carpentry, plumbing, electrical, masonry), mechanical (small engines, welding, equipment repair), agricultural (gardening, animal husbandry, soil science, preservation), domestic (cooking from scratch, sewing, first aid), and administrative (budgeting, record keeping, planning). Rate yourself honestly in each area: proficient, basic, or no experience. Then cross-reference with your homestead plan — what skills are critical for your Phase 1 priorities? A skill gap in an area you won''t tackle for years is not urgent. A skill gap in something you need next month is. This assessment becomes your personal development roadmap and helps you know when to DIY, when to hire, and when to learn before doing.',
   ARRAY['Be brutally honest — overestimating your skills leads to costly mistakes', 'Cross-reference skill gaps with your phased plan to prioritize what to learn first', 'Some skills are better learned before starting (welding, electrical) while others can be learned while doing (gardening, cooking)'],
   0, 50, '2-4 hours', 1, '{}', ARRAY['beginner','critical'], '{}', '{}'),

  (mod_id, 'Priority Skills to Learn',
   'Identify and begin developing the 3-5 most critical skills for your immediate homesteading needs.',
   'Based on your skill gap assessment, identify the 3-5 skills most critical for your next 6-12 months of homestead development. Learning methods in order of effectiveness: hands-on mentorship (find someone experienced and work alongside them), structured classes (community college trades programs, extension service workshops), practice on low-stakes projects (build a chicken coop before building a house), and supplemental self-study (books, videos, online courses). The most universally valuable homesteading skills to develop early: basic carpentry (framing, measuring, cutting, fastening), basic plumbing (PEX and PVC connections, fixture installation), safe chainsaw operation, food growing basics, and cooking from scratch with whole ingredients. Do not try to learn everything at once — pick 2-3 skills per season and focus your learning energy.',
   ARRAY['Focus on 2-3 new skills per season — trying to learn everything at once leads to mastery of nothing', 'Hands-on mentorship is 10x more effective than watching videos alone', 'Practice new skills on low-stakes projects before applying them to critical homestead work'],
   0, 500, 'Ongoing — plan per season', 2, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Local Mentor Network',
   'Find experienced homesteaders, farmers, and tradespeople in your area who can mentor you through the learning curve.',
   'A good mentor shortens your learning curve by years and helps you avoid expensive mistakes. Find mentors through: your local agricultural extension office (they exist to help and their advice is free), farmers markets (talk to vendors — many are happy to share knowledge), local farming and homesteading groups (check Facebook, Meetup, and bulletin boards at feed stores), 4-H and FFA programs (even as an adult, you can volunteer and learn), and grange halls or farming cooperatives. The best way to find a mentor is to volunteer — offer to help an experienced farmer or homesteader with their work in exchange for learning. Be respectful of their time, come ready to work, and follow through on commitments. Most experienced homesteaders are generous with knowledge because someone helped them the same way.',
   ARRAY['Volunteer to work alongside experienced homesteaders — it is the fastest way to learn', 'Your county extension agent is a free resource specifically funded to help people like you', 'Feed stores and farmers markets are where the local farming community congregates — go there'],
   0, 100, 'Ongoing', 3, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Barter & Trade Connections',
   'Build a barter and trade network to exchange goods, services, and skills with other homesteaders and community members.',
   'Bartering is a deeply rooted homesteading tradition and an effective way to get what you need without cash. Common barter arrangements: trade eggs for milk with a dairy neighbor, exchange garden surplus for meat, swap labor (help build a fence in exchange for tractor work on your property), trade skills (you wire their barn, they plumb your bathroom), and exchange seedlings and starts. Establish fair trade values by agreeing on a rough equivalent: a dozen eggs might equal a quart of milk or a bag of salad greens. Be generous and reliable — the reputation you build in a barter network is your most valuable currency. Online local exchange groups (Buy Nothing, local homesteading Facebook groups) are modern barter platforms. Keep barter simple and equitable, and remember to track fair market value for tax purposes if amounts are significant.',
   ARRAY['Be generous in barter — your reputation is your most valuable currency in a trade network', 'Common fair trades: dozen eggs = quart of milk = bag of salad greens = hour of light labor', 'Track significant barter at fair market value for tax purposes'],
   0, 50, 'Ongoing', 4, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Community Resources Map',
   'Map all local resources relevant to your homestead: feed stores, hardware stores, equipment dealers, vets, extension office, and emergency services.',
   'Create a resource map documenting: feed and farm supply stores (prices and product range vary — find the best), hardware stores and lumberyards, equipment dealers and repair shops, large animal veterinarian, farrier (if you have horses), butcher or processing facility, county extension office, seed and plant suppliers, farmers markets, local food co-ops, fuel suppliers, well drillers, septic services, and emergency services (fire department, hospital, sheriff). Note hours, phone numbers, and distance from your property. Identify which resources require advance scheduling (vet appointments, butcher dates, well service). Build relationships with the staff at your local feed store and hardware store — they are a goldmine of local knowledge about what works in your area, what suppliers are reliable, and what other homesteaders in the area are doing.',
   ARRAY['Your local feed store staff knows every farmer in the area — build that relationship', 'Map driving distances and plan supply runs to combine multiple stops efficiently', 'Some critical services (butcher dates, vet calls) need to be scheduled weeks in advance'],
   0, 100, '1 day', 5, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Volunteer & Work Trade',
   'Find and participate in volunteer and work trade opportunities to build skills, relationships, and community while getting help on your own projects.',
   'Work trade is the homesteading economy at its best. Platforms and opportunities: WWOOF (Worldwide Opportunities on Organic Farms) connects you with experienced farms where you can work in exchange for room, board, and learning. Many local farms welcome weekend volunteers during busy seasons. Barn-raising traditions (where the community gathers to help build a structure) still exist in many rural areas — participate when neighbors need help and they will show up for you. Habitat for Humanity builds teach construction skills while helping your community. Master Gardener programs through your extension office train you in exchange for volunteer hours. The key is showing up consistently and following through — the community remembers who is reliable and who is not.',
   ARRAY['WWOOF is an excellent way to learn from experienced farms before starting your own', 'Show up consistently for community work projects — your reliability builds your reputation', 'Barn-raising traditions still exist — help your neighbors build and they will help you'],
   0, 50, 'Ongoing', 6, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Online Communities',
   'Join online homesteading communities for knowledge, support, troubleshooting, and connection with others on the same journey.',
   'Online communities complement your local network with a vast knowledge base available at any hour. Key platforms: Reddit communities (r/homestead, r/BackyardChickens, r/gardening, r/Permaculture), Permies.com (the largest permaculture and homesteading forum, deeply knowledgeable community), Facebook groups specific to your interests and region, YouTube channels (many experienced homesteaders share detailed how-to content), and Instagram for inspiration and connection. Use online communities wisely: search before asking (your question has probably been answered), be specific in your questions (include your location, zone, soil type, etc.), take advice with appropriate skepticism (not all advice online is good), and give back by sharing your own experiences. Online forums are especially valuable during your first year when you have daily questions and may not yet have a strong local network.',
   ARRAY['Permies.com is the gold standard for homesteading and permaculture knowledge', 'Search before posting — most beginner questions have extensive existing answers', 'Be specific when asking questions: include your zone, soil type, and what you have tried'],
   0, 50, '1-2 hours exploring', 7, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Library & Reference Materials',
   'Build a physical and digital reference library covering the key topics for your homestead plan.',
   'Every homestead needs a solid reference library. Essential books: The Encyclopedia of Country Living by Carla Emery (the single most comprehensive homesteading reference), The Market Gardener by Jean-Martin Fortier (intensive food production), Storey''s Guide series (one for each species of livestock you plan to keep), The Ball Complete Book of Home Preserving, The Backyard Homestead by Carleen Madigan, Gaia''s Garden by Toby Hemenway (permaculture design), and a comprehensive first aid manual. Add region-specific references: your state extension service publications (free online), local gardening guides, and wild plant identification guides for your area. Keep practical manuals where you use them — the preserving book in the kitchen, the livestock guide in the barn. Many critical extension service publications are free downloads. Start with 5-10 core books and build your library over time as your interests and needs develop.',
   ARRAY['The Encyclopedia of Country Living by Carla Emery is the single most essential homesteading book', 'State extension service publications are free, region-specific, and research-backed', 'Keep reference books where you use them — the canning guide in the kitchen, animal guides in the barn'],
   50, 300, '2-4 hours to research and order', 8, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Teaching & Sharing Skills',
   'Share your developing skills and knowledge with others. Teaching deepens your own understanding and strengthens your community.',
   'Once you have skills and experience to share — even after just one or two seasons — teaching others deepens your own understanding and builds your community. Start by helping new homesteaders in your local group with questions you can answer from experience. Host a workshop on something you have learned well — seed starting, composting, basic canning, or chicken keeping are all popular topics. Write about your experiences (blog, social media, local newsletter) to reach people beyond your immediate area. Teach your children homesteading skills — it is education in its purest form. The homesteading community has a strong tradition of passing knowledge forward. By teaching, you also attract people who share your values and may become future friends, trading partners, or mutual-aid network members.',
   ARRAY['You do not need to be an expert to teach — one season of experience is valuable to a complete beginner', 'Teaching a skill forces you to understand it more deeply than just practicing it', 'Start with informal skill-sharing with neighbors before hosting formal workshops'],
   0, 100, 'Ongoing', 9, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Long-Term Self-Sufficiency Roadmap',
   'Create your personal roadmap from where you are today toward your vision of self-sufficiency, with realistic milestones and timelines.',
   'Self-sufficiency is a spectrum, not a destination — and nobody achieves 100%. Define what self-sufficiency means to you personally: growing 50% of your food? Energy independence? Debt-free homesteading? A thriving homestead that supports itself financially? Create a 1-year, 3-year, 5-year, and 10-year vision. For each time horizon, identify: what skills you will have developed, what infrastructure will be in place, what percentage of food you will produce, what your financial position will look like, and what your daily life will feel like. This roadmap is your north star — it keeps you motivated during the hard days and helps you make decisions aligned with your long-term vision. Review and update it annually. Celebrate milestones along the way. Remember that the journey itself — learning, building, growing — is the point, not some imagined finish line.',
   ARRAY['Define self-sufficiency as a personal spectrum, not an impossible 100% goal', 'Create 1-year, 3-year, 5-year, and 10-year milestones to mark your progress', 'Review and celebrate progress annually — the journey itself is the reward'],
   0, 50, '4-8 hours initial planning + annual review', 10, '{}', ARRAY['beginner','critical'], '{}', '{}');

END $$;
