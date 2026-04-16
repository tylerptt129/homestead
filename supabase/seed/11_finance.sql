-- Seed: Module 11 — Financial Planning
DO $$
DECLARE
  mod_id UUID;
BEGIN
  INSERT INTO modules (slug, title, description, icon_name, display_order, color, estimated_hours, difficulty)
  VALUES (
    'finance',
    'Financial Planning',
    'Homesteading is a major financial undertaking. This module helps you budget realistically, track spending, identify income streams, and build the financial foundation that sustains your homestead long-term without constant money stress.',
    'dollar-sign', 11, '#2E8B57', 20, 'beginner'
  ) RETURNING id INTO mod_id;

  INSERT INTO steps (module_id, title, description, detailed_guide, tips, estimated_cost_low, estimated_cost_high, estimated_time, display_order, depends_on, tags, season_relevance, resources) VALUES
  (mod_id, 'Total Budget Estimation',
   'Calculate a realistic total budget for your homestead development based on your prioritized modules and research-backed cost estimates.',
   'Start by listing every major expense category: land purchase or improvements, shelter construction or renovation, water system, power system, fencing, outbuildings, tools and equipment, livestock startup, garden infrastructure, and a reserve for unexpected costs. Research costs specific to your area — building costs vary dramatically by region. Add up the estimated cost ranges from each module you plan to tackle. Be conservative — use the high end of estimates and add 20% contingency for unexpected costs (there will always be surprises). Separate one-time capital costs from ongoing operational costs (feed, fuel, maintenance, insurance). Create a total budget that shows the full picture, then prioritize what gets funded in which order based on immediate needs and available resources.',
   ARRAY['Always use the high end of cost estimates and add 20% contingency — surprises are guaranteed', 'Separate one-time capital costs from ongoing monthly operational expenses', 'Research costs specific to YOUR area — building costs vary enormously by region'],
   0, 100, '4-8 hours', 1, '{}', ARRAY['beginner','critical'], '{}', '{}'),

  (mod_id, 'Phase-by-Phase Budget',
   'Break your total budget into affordable phases that you can fund and execute over time without taking on excessive debt.',
   'Very few homesteaders can fund everything at once — phasing is both practical and wise. Phase 1 should cover your most critical needs: shelter (even if temporary), water, and access. Phase 2 addresses food production, basic livestock, and workshop. Phase 3 handles power optimization, preservation infrastructure, and outbuildings. Phase 4 is refinement and expansion. For each phase, create a detailed budget with line items, quantities, and prices. Assign a time frame and funding source (savings, income, loan, sweat equity). Build in pause points where you can stop and assess before committing to the next phase. Many successful homesteaders spend 3-5 years developing their property in phases. This approach lets you learn from each phase before committing resources to the next, and avoids the crushing debt that derails many homesteading dreams.',
   ARRAY['Phase over 3-5 years rather than trying to do everything at once', 'Build pause points between phases to assess and adjust before the next commitment', 'Each completed phase reduces ongoing expenses — a garden reduces food costs, solar reduces electric bills'],
   0, 50, '2-4 hours', 2, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Income Stream Identification',
   'Identify potential income streams from your homestead — from eggs and produce to remote work, consulting, or value-added products.',
   'Most homesteads need income to sustain themselves. Identify your income mix: off-property employment (remote work is ideal for homesteaders), on-property income from products (eggs, dairy, produce, meat, honey, value-added products like jams, soap, candles), services (farm stays, workshops, consulting), and passive income (timber, hunting leases, rental). Start with the easiest income first: surplus eggs and garden produce sell quickly at farmers markets and to neighbors. Value-added products (turning milk into cheese, fruit into jam, herbs into salves) dramatically increase your per-unit revenue. Consider your unique skills and assets — teaching workshops on homesteading skills, hosting farm stays, or consulting can leverage your experience. The most sustainable homestead income model combines a reliable primary income with multiple small homestead revenue streams.',
   ARRAY['Remote work is the ideal primary income for homesteaders — stable pay, flexible schedule', 'Value-added products (cheese, jam, salves) earn 3-10x more than raw ingredients', 'Start selling surplus eggs and produce locally — it is the easiest homestead income stream'],
   0, 200, '4-8 hours research', 3, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Emergency Fund',
   'Build and maintain an emergency fund that covers unexpected homestead expenses and income disruptions.',
   'An emergency fund is non-negotiable — homesteading has higher emergency potential than suburban living. Equipment breaks, animals get sick, weather damages structures, and unexpected repairs arise constantly. Target a minimum of 3-6 months of essential expenses (mortgage/land payment, utilities, feed, fuel, insurance, and basic living costs). Keep this fund liquid in a high-yield savings account, not invested in volatile assets. Beyond the cash emergency fund, maintain a reserve of essential supplies: spare parts for critical equipment, extra fencing materials, a basic lumber and hardware supply, and emergency animal feed. Many experienced homesteaders recommend a separate homestead emergency fund (for property and equipment) in addition to a personal emergency fund (for living expenses), each with 3 months of expenses.',
   ARRAY['Start with a $1,000 minimum emergency fund and build to 3-6 months of expenses', 'Keep emergency funds in a liquid, accessible high-yield savings account', 'Maintain a physical reserve of essential supplies alongside your cash emergency fund'],
   0, 50, '1-2 hours planning + ongoing saving', 4, '{}', ARRAY['critical','beginner'], '{}', '{}'),

  (mod_id, 'Insurance Review',
   'Review and obtain appropriate insurance coverage for your property, structures, equipment, livestock, and liability.',
   'Standard homeowner insurance often does not cover agricultural activities, outbuildings, livestock, or homestead-specific risks. Review your current policy and consider: farm or ranch owner policy (covers both residential and agricultural use), liability coverage (essential if anyone visits your property, buys your products, or if livestock escape), structure coverage for all outbuildings (barn, workshop, coops), equipment and tool coverage, livestock mortality insurance (for high-value breeding stock), and umbrella liability policy. If you sell products (eggs, produce, value-added goods), you need product liability coverage. If you have employees or volunteers, you need workers compensation. Shop multiple farm insurance providers — costs and coverage vary dramatically. Read policies carefully for exclusions. Update your coverage annually as you add structures, equipment, and livestock.',
   ARRAY['Standard homeowner insurance usually does NOT cover agricultural activities', 'Product liability insurance is essential if you sell any food products', 'Update your policy annually as you add structures, equipment, and livestock'],
   200, 2000, '4-8 hours research and shopping', 5, '{}', ARRAY['critical','beginner'], '{}', '{}'),

  (mod_id, 'Tax Considerations',
   'Understand the tax implications and advantages of homesteading including agricultural exemptions, Schedule F deductions, and property tax benefits.',
   'Homesteading has significant tax implications — most of them favorable if you structure things properly. Agricultural exemptions on property tax can save thousands annually — check your county requirements (often a minimum acreage and agricultural activity level). If your homestead generates income, you can file Schedule F (Profit or Loss from Farming) and deduct business expenses: equipment, feed, seed, fencing, vehicle use, depreciation on structures and equipment, and even a portion of your home if used for farm business. Keep meticulous records of all income and expenses — good records are your best defense in an audit. Consult a tax professional experienced with small farms and homesteads — the initial cost pays for itself many times over in deductions you would miss. Common missed deductions include mileage to the feed store, home office for farm business, and depreciation on buildings and major equipment.',
   ARRAY['Agricultural property tax exemptions can save thousands annually — check county requirements', 'Schedule F allows deducting equipment, feed, seed, fencing, and vehicle use as farm expenses', 'Hire a tax professional experienced with small farms — they pay for themselves in found deductions'],
   0, 500, '4-8 hours research + annual filing', 6, '{}', ARRAY['beginner','critical'], '{}', '{}'),

  (mod_id, 'Record Keeping System',
   'Set up a comprehensive financial record keeping system that tracks income, expenses, receipts, and gives you a clear picture of homestead finances.',
   'Good financial records are the foundation of sound homestead management and are required for tax purposes. Set up a simple system: categorize all expenses by module (water, power, garden, livestock, etc.) and type (materials, tools, labor, services, feed, fuel). Keep all receipts — scan or photograph them immediately and file digitally (a shoebox of paper receipts is not a system). Track income by source and type. Record all barter and trade at fair market value. Use a dedicated checking account or credit card for homestead expenses to simplify tracking. Review your finances monthly — 30 minutes per month prevents surprises and keeps you aware of spending trends. This app''s budget tracking feature is designed exactly for this purpose.',
   ARRAY['Photograph or scan every receipt immediately — paper receipts fade and get lost', 'Use a dedicated bank account or credit card for homestead expenses to simplify tracking', 'Review finances monthly for 30 minutes — this prevents surprises and reveals trends'],
   0, 200, '2-4 hours initial setup + monthly maintenance', 7, '{}', ARRAY['beginner','diy'], '{}', '{}'),

  (mod_id, 'ROI Tracking Per Module',
   'Track the return on investment for each homestead module to understand which investments pay for themselves and which are lifestyle choices.',
   'Not every homestead investment has a financial return — and that is okay. But tracking ROI helps you make informed decisions about where to invest next. For each module, track: total invested (materials, tools, infrastructure), annual operating costs (feed, fuel, maintenance, seed), annual production value (at retail or farmers market prices), and annual savings (reduced grocery, energy, or other bills). Example: a garden that cost $1,500 to establish and $200 per year to maintain might produce $3,000 worth of produce annually — that is an excellent ROI. Solar panels that cost $15,000 and save $150/month reach ROI in about 8 years. Chickens producing $20/week in eggs from $15/week in feed have modest direct ROI but tremendous lifestyle value. Understanding true ROI helps you communicate the value of homesteading to skeptical partners and make better investment priorities.',
   ARRAY['Track both direct income and avoided costs (grocery savings, reduced energy bills)', 'A productive garden often has the best ROI of any homestead investment', 'Some investments have low financial ROI but high lifestyle and food security value — that counts too'],
   0, 50, '2-4 hours quarterly', 8, '{}', ARRAY['beginner'], '{}', '{}'),

  (mod_id, 'Debt Reduction Plan',
   'Create a strategy to eliminate debt and achieve the financial independence that makes long-term homesteading sustainable.',
   'Debt is the number one killer of homesteading dreams. High debt payments drain the cash flow needed for development and create stress that undermines the quality of life you are homesteading to achieve. Create a debt inventory: list every debt with balance, interest rate, and minimum payment. Use either the avalanche method (pay off highest interest first for mathematical efficiency) or the snowball method (pay off smallest balance first for psychological momentum). Reduce expenses aggressively — the homestead lifestyle itself reduces many costs (food, energy, entertainment). Direct every dollar of homestead savings (garden produce, solar energy, reduced dining out) toward debt reduction. Many successful homesteaders report that the first 2-3 years of aggressive debt reduction, funded partly by homestead savings, put them on solid financial footing for the long term.',
   ARRAY['Direct homestead savings (food production, energy reduction) toward accelerated debt payoff', 'The homestead lifestyle naturally reduces many expenses that fund debt reduction', 'Every dollar of debt paid off is a dollar of monthly cash flow freed for homestead development'],
   0, 100, '2-4 hours planning + ongoing discipline', 9, '{}', ARRAY['critical','beginner'], '{}', '{}'),

  (mod_id, '5-Year Financial Projection',
   'Create a 5-year financial model that projects costs, income, savings, and the trajectory toward financial sustainability for your homestead.',
   'Build a year-by-year projection showing: annual capital investment per phase, annual operating costs (increasing as you add livestock and infrastructure), annual homestead income (growing as production ramps up), annual savings from reduced living costs (garden, energy, etc.), and net annual homestead cost or profit. In the early years, net costs will be high as you invest in infrastructure. By years 3-5, operating costs stabilize and income/savings grow. For most small homesteads, the realistic goal is reducing total living costs by 30-50% through food production, energy savings, and homestead income — not necessarily generating a net profit. Update your projection annually with actual numbers. This living document helps you stay on track, make informed decisions about new investments, and see the long-term trend toward sustainability.',
   ARRAY['Expect years 1-2 to be net investment; years 3-5 should show growing returns', 'Update projections annually with actual numbers to improve accuracy over time', 'A realistic goal is reducing total living costs by 30-50%, not necessarily generating net profit'],
   0, 100, '4-8 hours initial model + annual updates', 10, '{}', ARRAY['beginner'], '{}', '{}');

END $$;
