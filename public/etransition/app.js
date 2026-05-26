const TOPICS = [
  // PHASE I — FUNDAMENTALS
  { id: 'energy_basics', phase: 'fundamentals', priority: 'core', title: 'Energy chain &amp; units',
    desc: 'Primary, secondary, final, useful energy. The TPES vs TFC distinction. Units you have to convert without thinking: Mtoe, TJ, MWh, GJ.' },
  { id: 'history', phase: 'fundamentals', priority: 'light', title: 'Energy history &amp; transitions',
    desc: 'The four energy transitions (biomass, coal, oil, natural gas) and the one happening now. Long-run patterns of the energy mix.' },
  { id: 'indicators_pw1', phase: 'fundamentals', priority: 'core', title: 'GDP &amp; PW1 indicators',
    desc: 'GDP at market price vs basic price vs factor cost; nominal vs real vs PPP. The six PW1 indicators and what each one tells you.' },

  // PHASE II — TRANSITION
  { id: 'trilemma', phase: 'transition', priority: 'core', title: 'The energy trilemma',
    desc: 'Security, affordability, sustainability. The five dimensions of energy (physical, economic, environmental, geopolitical, social).' },
  { id: 'transition_drivers', phase: 'transition', priority: 'core', title: 'Why the transition is happening now',
    desc: 'Climate science, IPCC carbon budgets, the 1.5&deg;C and 2&deg;C pathways. EU Green Deal and the EU Fit for 55 package.' },
  { id: 'geopolitics', phase: 'transition', priority: 'core', title: 'Geopolitics &amp; Shannon',
    desc: 'Import dependency rate, Shannon diversification, country risk via WGI. How to assess supply-route concentration.' },

  // PHASE III — MARKETS
  { id: 'electricity_commodity', phase: 'markets', priority: 'core', title: 'Electricity as a commodity',
    desc: 'Why electricity is special: non-storable, instantaneous demand-supply balance, derived demand, the network is the market.' },
  { id: 'market_equilibrium', phase: 'markets', priority: 'core', title: 'Supply, demand, equilibrium',
    desc: 'Marginal cost, the merit order, the supply curve as ranked plants, demand curve, equilibrium price and quantity.' },
  { id: 'market_power_hhi', phase: 'markets', priority: 'core', title: 'Market power &amp; HHI',
    desc: 'Concentration, the Herfindahl-Hirschman Index, pivotal supplier test, reference markets, dominance thresholds.' },
  { id: 'market_classification', phase: 'markets', priority: 'core', title: 'Classification of electricity markets',
    desc: 'Day-ahead vs intraday vs balancing vs capacity vs ancillary services. What clears where, on what timescale.' },
  { id: 'bidding_clearing', phase: 'markets', priority: 'core', title: 'Bidding &amp; market clearing',
    desc: 'Pay-as-bid vs uniform-price auctions, the marginal accepted bid sets the price, block bids and complex orders.' },
  { id: 'network_clearing', phase: 'markets', priority: 'core', title: 'Network constraints &amp; LMP',
    desc: 'Locational marginal prices, congestion, zonal vs nodal pricing, the DC power flow approximation.' },

  // PHASE IV — OPTIMISATION & FINANCE
  { id: 'optimization_concepts', phase: 'optfin', priority: 'core', title: 'LP, KKT, and the power dispatch problem',
    desc: 'Standard form of an LP, feasible set, the simplex idea, KKT conditions, the unit-commitment vs economic-dispatch distinction.' },
  { id: 'finance_lcoe', phase: 'optfin', priority: 'core', title: 'NPV, IRR &amp; LCOE',
    desc: 'Discounted cash flow, the NPV formula, IRR existence, the LCOE numerator and denominator, sensitivity to the discount rate.' },

  // PHASE V — SECTOR COUPLING & COURSE EXERCISE
  { id: 'multi_commodity', phase: 'coupling', priority: 'new', title: 'Multi-commodity systems &amp; Power-to-X',
    desc: 'L18. Sector coupling, Power-to-Gas (electrolyser + methanation), district heating interactions, PtG as a frequency/primary/secondary reserve.' },
  { id: 'course_optim_exercise', phase: 'coupling', priority: 'core', title: 'The course optimisation exercise',
    desc: 'The official Optimization.xlsx: 10 plant types, integer number of units per type, USD/kWh LCOE, CO2 cap, RES penetration. Maps directly to PW Section 8.' },
];

const PHASES = [
  { key: 'fundamentals', label: 'Energy fundamentals & indicators', grid: 'grid-fundamentals' },
  { key: 'transition', label: 'The transition imperative', grid: 'grid-transition' },
  { key: 'markets', label: 'Electricity markets', grid: 'grid-markets' },
  { key: 'optfin', label: 'Optimisation & investment', grid: 'grid-optfin' },
  { key: 'coupling', label: 'Sector coupling & course exercise', grid: 'grid-coupling' },
];

const CONTENT = {
  energy_basics: {
    title: 'Energy chain & units',
    lead: 'Before any indicator can be computed, the energy chain has to be clean in your head. Primary energy becomes secondary, secondary becomes final, final becomes useful. TPES, TFC, and net electricity sit on this chain at specific points.',
    body: `
      <h3>The energy chain</h3>
      <p>Energy moves through four stages from source to service:</p>
      <ol>
        <li><strong>Primary energy</strong> &mdash; energy in its naturally occurring form: crude oil, raw natural gas, coal in the ground, the kinetic energy of falling water, sunlight on a panel, uranium ore. Counted at extraction or harvest.</li>
        <li><strong>Secondary energy</strong> &mdash; the output of a transformation process: refined petroleum products, electricity, district heat, hydrogen. Always less than the primary input because conversion has losses.</li>
        <li><strong>Final energy</strong> &mdash; energy delivered to the consumer, ready to be used. This is what shows up on an electricity bill or at the petrol pump.</li>
        <li><strong>Useful energy</strong> &mdash; the work or heat that actually serves a purpose, after end-use conversion (an electric motor turning a shaft, a furnace heating a room). End-use efficiency lives here.</li>
      </ol>

      <h3>TPES and TFC</h3>
      <p>Two aggregates anchor every country balance.</p>
      <div class="formula-block"><div class="label">Total Primary Energy Supply (TPES)</div>$$\\mathrm{TPES} = \\mathrm{Production} + \\mathrm{Imports} - \\mathrm{Exports} + \\mathrm{Stock~changes} - \\mathrm{Bunkers}$$</div>
      <p>TPES is the energy <em>available</em> to the economy in a year, measured at the primary stage. Eurostat now calls this "gross available energy" (GAE) under the same definition.</p>
      <div class="formula-block"><div class="label">Total Final Consumption (TFC)</div>$$\\mathrm{TFC} = \\mathrm{Energy~consumed~by~end~users~by~sector~and~commodity}$$</div>
      <p>TFC is the sum of energy actually delivered to industry, transport, residential, services, agriculture and forestry. The gap between TPES and TFC is the conversion and transmission losses plus the energy sector's own consumption plus non-energy use.</p>

      <h3>Units to convert without thinking</h3>
      <table class="calc-table">
        <thead><tr><th>From</th><th>To</th><th>Factor</th></tr></thead>
        <tbody>
          <tr><td>1 Mtoe</td><td>TJ</td><td>41,868</td></tr>
          <tr><td>1 Mtoe</td><td>GJ</td><td>41,868,000</td></tr>
          <tr><td>1 toe</td><td>GJ</td><td>41.868</td></tr>
          <tr><td>1 MWh</td><td>GJ</td><td>3.6</td></tr>
          <tr><td>1 TWh</td><td>Mtoe</td><td>0.0859845 (= 3.6/41.868)</td></tr>
          <tr><td>1 bcm natural gas</td><td>Mtoe (approx)</td><td>0.86</td></tr>
          <tr><td>1 barrel of oil</td><td>GJ</td><td>~6.1</td></tr>
        </tbody>
      </table>

      <div class="key-box">
        <div class="label">What to have automatic</div>
        <ul>
          <li>1 Mtoe = 41,868 TJ. If you see a Eurostat TJ figure, divide by ~41,868 to get Mtoe.</li>
          <li>TPES is at the <em>primary</em> stage, TFC at the <em>final</em>. The difference is conversion losses, energy-sector own use, non-energy use, and statistical adjustments.</li>
          <li>Electricity enters TPES as the primary source that produced it (hydro, wind, coal, gas) or as a net import. Net electricity in TPES is negative for an electricity exporter like Norway.</li>
        </ul>
      </div>
    `
  },

  history: {
    title: 'Energy history & transitions',
    lead: 'Every major historical transition replaced an older fuel by adding a new one on top: biomass plus coal plus oil plus gas plus renewables. We are now living the fifth transition.',
    body: `
      <h3>Four transitions, one underway</h3>
      <p>Pre-industrial humans burned <strong>biomass</strong> (wood, dung, crop residue) and used animal traction. The first transition, starting around 1750 in Britain, added <strong>coal</strong> and the steam engine, enabling the First Industrial Revolution. The second transition, from roughly 1880, added <strong>oil</strong> and electricity, powering the Second Industrial Revolution. The third, from the 1950s onward, added <strong>natural gas</strong> and nuclear. Each transition layered a new dominant source on top of the previous ones without fully replacing them; biomass is still 8&ndash;10&nbsp;% of global TPES today.</p>

      <p>The transition now underway is different in two ways. First, it is <em>policy-driven</em> rather than purely cost-driven; renewables had to be made competitive through carbon pricing, subsidies, and learning-curve subsidies before falling decisively below fossil costs in the 2010s. Second, it requires <em>substitution</em>, not just addition: the 2050 net-zero target is incompatible with continued growth of fossil consumption.</p>

      <h3>What the past tells us about the present</h3>
      <p>Historical transitions took 50&ndash;80 years from first commercial use to majority share. Coal took roughly 70 years to overtake biomass. Oil took 60 years to overtake coal in the OECD. By comparison, the EU's Fit for 55 package and the 2050 net-zero target compress the substitution to 30 years from a 2020 baseline.</p>
      <div class="key-box">
        <div class="label">Long-run pattern</div>
        <ul>
          <li>Energy density of the dominant fuel has risen at every transition: wood &rarr; coal &rarr; oil &rarr; gas. Renewables interrupt the trend by being lower-density (per unit land), which is why grid integration and storage matter so much.</li>
          <li>Per-capita energy use rose with each transition; the current transition is the first where decoupling per-capita TPES from GDP growth is an explicit policy goal.</li>
          <li>Energy carriers shifted: solids &rarr; liquids &rarr; gases &rarr; electrons. The current transition is the electrification frontier.</li>
        </ul>
      </div>
    `
  },

  indicators_pw1: {
    title: 'GDP & the PW1 indicators',
    lead: 'PW1 makes a sharp distinction between absolute values and indicators. Indicators are ratios that let you compare two countries fairly. Six of them appear in every project, and you have to derive each one.',
    body: `
      <h3>GDP, three flavours</h3>
      <p>GDP at <strong>market price</strong> is the sum of value added across productive sectors plus indirect taxes (VAT, excise) less subsidies on products. GDP at <strong>basic price</strong> excludes taxes on products. GDP at <strong>factor cost</strong> excludes all taxes and includes all subsidies.</p>
      <div class="formula-block">$$\\mathrm{GDP}_{\\mathrm{market}} = \\sum_{\\mathrm{sectors}} \\mathrm{VA} + \\mathrm{Taxes}_{\\mathrm{products}} - \\mathrm{Subsidies}_{\\mathrm{products}}$$</div>

      <h3>Nominal, real, PPP</h3>
      <p><strong>Nominal</strong> GDP values output at the prices of the current year. <strong>Real</strong> GDP values output at the prices of a fixed base year, removing inflation. The link is the price index:</p>
      <div class="formula-block"><div class="label">Real vs nominal</div>$$\\mathrm{Real~GDP} = \\frac{\\mathrm{Nominal~GDP}}{\\mathrm{Price~index}_y} \\cdot 100$$</div>
      <p><strong>PPP</strong> (Purchasing Power Parity) GDP adjusts for cross-country price differences. The same basket of goods costs different amounts in different countries; PPP corrects for this. <em>Use PPP for cross-country comparisons</em>; never compare nominal-USD GDPs of countries with very different price levels.</p>

      <h3>The six PW1 indicators</h3>
      <table class="calc-table">
        <thead><tr><th>Indicator</th><th>Formula</th><th>Unit</th></tr></thead>
        <tbody>
          <tr><td>GDP per capita</td><td>$\\mathrm{GDP} / \\mathrm{Population}$</td><td>USD/cap or Int\$/cap (PPP)</td></tr>
          <tr><td>TPES per capita</td><td>$\\mathrm{TPES} / \\mathrm{Population}$</td><td>toe/cap</td></tr>
          <tr><td>Energy intensity</td><td>$\\mathrm{TPES} / \\mathrm{GDP_{PPP}}$</td><td>toe/M Int\$ PPP</td></tr>
          <tr><td>CO₂ per capita</td><td>$\\mathrm{CO_2} / \\mathrm{Population}$</td><td>t CO₂/cap</td></tr>
          <tr><td>Carbon intensity of energy</td><td>$\\mathrm{CO_2} / \\mathrm{TPES}$</td><td>t CO₂/toe</td></tr>
          <tr><td>Carbon intensity of GDP</td><td>$\\mathrm{CO_2} / \\mathrm{GDP_{PPP}}$</td><td>kg CO₂/Int\$ PPP</td></tr>
        </tbody>
      </table>

      <h3>What each indicator tells you</h3>
      <p><strong>Energy intensity</strong> measures how much energy the economy needs to produce one unit of output. Falling energy intensity means the economy is becoming more energy-efficient or structurally less energy-heavy (more services, less heavy industry).</p>
      <p><strong>Carbon intensity of energy</strong> isolates the cleanness of the energy mix. A country can have high energy intensity but low carbon intensity (Sweden, with energy-intensive industry but nuclear-and-hydro electricity); or the reverse.</p>
      <p><strong>Carbon intensity of GDP</strong> is the product of the two: $\\mathrm{CO_2}/\\mathrm{GDP} = (\\mathrm{CO_2}/\\mathrm{TPES}) \\cdot (\\mathrm{TPES}/\\mathrm{GDP})$. This decomposition is the Kaya identity in disguise.</p>

      <div class="key-box">
        <div class="label">The bubble chart in PW1 (slide 16)</div>
        <ul>
          <li>X-axis: energy intensity (TPES / GDP-PPP).</li>
          <li>Y-axis: TPES per capita.</li>
          <li>Bubble area: absolute TPES.</li>
          <li>Two arrows: 1990 vs latest year, to show the trajectory.</li>
        </ul>
        <p>This is the canonical visualisation. Reproduce it for your country and comparators in PW Section 2.</p>
      </div>
    `
  },

  trilemma: {
    title: 'The energy trilemma',
    lead: 'Three competing goals: secure supply, affordable energy, sustainability. You cannot maximise all three simultaneously, so every energy decision is a trade-off along this triangle.',
    body: `
      <h3>The three corners</h3>
      <p><strong>Security</strong> means reliable, uninterrupted supply: enough capacity, diverse sources, resilient infrastructure, controllable imports. <strong>Affordability</strong> means energy that consumers and industries can pay for: low prices for households, competitive prices for industry, predictable tariffs. <strong>Sustainability</strong> means low environmental impact: low GHG emissions, low local pollution, low resource depletion.</p>

      <div class="diagram-wrap">
        <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
          <polygon points="300,60 540,300 60,300" fill="none" stroke="#2a6b3a" stroke-width="2.5"/>
          <circle cx="300" cy="60" r="40" fill="#2a6b3a" fill-opacity="0.15"/>
          <text x="300" y="60" font-size="13" font-weight="600" fill="#1a1612" text-anchor="middle" dominant-baseline="middle" font-family="'Fraunces',serif">Sustainability</text>
          <circle cx="60" cy="300" r="40" fill="#a8431e" fill-opacity="0.15"/>
          <text x="60" y="300" font-size="13" font-weight="600" fill="#1a1612" text-anchor="middle" dominant-baseline="middle" font-family="'Fraunces',serif">Security</text>
          <circle cx="540" cy="300" r="40" fill="#7a7164" fill-opacity="0.18"/>
          <text x="540" y="300" font-size="13" font-weight="600" fill="#1a1612" text-anchor="middle" dominant-baseline="middle" font-family="'Fraunces',serif">Affordability</text>
          <text x="300" y="200" font-size="14" fill="#4a4239" text-anchor="middle" font-style="italic" font-family="'Fraunces',serif">Pick the trade-off</text>
        </svg>
        <div class="diagram-caption">The trilemma. Every policy choice can be located inside the triangle by how it weights the three corners.</div>
      </div>

      <h3>The five dimensions of energy (L2)</h3>
      <p>Bompard's L2 frames the same idea more granularly. Energy has five dimensions:</p>
      <ul>
        <li><strong>Physical</strong> &mdash; the laws of thermodynamics, conversion efficiencies, intermittency, storage limits.</li>
        <li><strong>Economic</strong> &mdash; prices, costs, markets, externalities.</li>
        <li><strong>Environmental</strong> &mdash; GHG emissions, local pollutants, water use, land use.</li>
        <li><strong>Geopolitical</strong> &mdash; supply concentration, import dependency, transit risk.</li>
        <li><strong>Social</strong> &mdash; energy poverty, distributional impacts of tariffs and taxes, just transition concerns.</li>
      </ul>

      <h3>Where the transition tightens the trilemma</h3>
      <p>Renewable electrification raises sustainability and (after build-out) reduces fuel-import dependency, but raises affordability tension in the transition phase because it requires large up-front capex. Phasing out coal raises sustainability but may raise security (loss of dispatchable capacity) and affordability (replacement cost) in the short run. Nuclear maintains security and sustainability but faces affordability and acceptance constraints. Gas-to-renewables is the European pivot for 2025&ndash;2035: trades fuel-import security for build-out security.</p>

      <div class="key-box">
        <div class="label">The recognition test</div>
        <p>Given any policy &mdash; CO2 tax, capacity market, EV mandate, hydrogen subsidy, grid expansion &mdash; you should be able to say which corner of the trilemma it strengthens, which it weakens, and which it leaves untouched.</p>
      </div>
    `
  },

  transition_drivers: {
    title: 'Why the transition is happening now',
    lead: 'Climate science fixes the budget. EU policy is the binding constraint for Norway and the rest of Europe. The Fit for 55 package and the 2050 net-zero target are the operational endpoints.',
    body: `
      <h3>The climate budget</h3>
      <p>The IPCC defines a remaining carbon budget consistent with 1.5&deg;C and 2&deg;C warming. As of the AR6 report, the remaining budget for a 50&nbsp;% chance of staying below 1.5&deg;C from 2020 is around 500 GtCO2; at the current 40 GtCO2 per year of fossil emissions, this budget runs out around 2032&ndash;2035. Every year of delayed action shrinks the post-2030 budget and forces faster cuts.</p>

      <h3>Decarbonisation pathways</h3>
      <p>Decarbonisation has three main levers:</p>
      <ul>
        <li><strong>Energy efficiency</strong> &mdash; reducing the energy intensity of the economy. Cheap but limited (rebound effects, structural floor).</li>
        <li><strong>Electrification of end uses</strong> &mdash; replacing fossil combustion in transport, buildings, and industry with electricity from a clean grid. The dominant policy lever.</li>
        <li><strong>Decarbonisation of electricity</strong> &mdash; renewables, nuclear, CCS on the residual thermal capacity. Has to run faster than electrification, otherwise electrification just shifts emissions upstream.</li>
      </ul>

      <h3>The EU policy stack</h3>
      <p>Norway is bound to EU climate policy through the EEA Agreement. The key instruments are:</p>
      <ul>
        <li><strong>EU ETS</strong> &mdash; carbon market for power, energy-intensive industry, aviation and maritime. Cap declines over time; price has averaged 60&ndash;100 EUR/tCO2 since 2022.</li>
        <li><strong>Effort Sharing Regulation (ESR)</strong> &mdash; binding national targets for sectors outside the ETS (buildings, transport, agriculture, waste).</li>
        <li><strong>Fit for 55</strong> &mdash; legislative package targeting a 55&nbsp;% GHG cut by 2030 (vs 1990), with sectoral measures: revised ETS, CBAM, ReFuelEU, FuelEU Maritime, AFIR.</li>
        <li><strong>European Climate Law (2021)</strong> &mdash; legally binds the EU to climate neutrality by 2050.</li>
      </ul>

      <div class="key-box">
        <div class="label">For the project work</div>
        <p>When you write PW Section 5 (national plans), tie the country's national targets back to the EU framework. For Norway, the Climate Change Act 2017 (amended 2021) sets the 2030 50&ndash;55&nbsp;% target and the 2050 climate-neutrality target, aligned with the EU baseline. Norway is also linked to the EU ETS.</p>
      </div>
    `
  },

  geopolitics: {
    title: 'Geopolitics & the Shannon index',
    lead: 'Energy security is not the same as low import dependency. Diversification matters, and the Shannon index gives you a single number that says how diversified your imports are. PW1 requires this for Section 4 of the project work.',
    body: `
      <h3>Import dependency rate</h3>
      <p>Eurostat defines the import dependency rate as:</p>
      <div class="formula-block"><div class="label">Import dependency rate</div>$$\\mathrm{IDR} = \\frac{\\mathrm{Imports} - \\mathrm{Exports} + \\mathrm{Stock~changes}}{\\mathrm{Gross~available~energy}} \\cdot 100\\%$$</div>
      <p>A net importer has IDR > 0; a net exporter has IDR < 0. The EU27 average is around 60&nbsp;%; Germany is around 70&nbsp;%; Norway is around &minus;655&nbsp;%. The IDR captures the <em>quantity</em> of dependence but not the <em>concentration</em> of suppliers.</p>

      <h3>Shannon diversification index</h3>
      <p>Two countries with the same IDR can have very different risk profiles. A country importing 100&nbsp;% from one supplier is far more exposed than one importing 25&nbsp;% from each of four suppliers. The Shannon index quantifies this:</p>
      <div class="formula-block"><div class="label">Shannon index</div>$$H = -\\sum_{i=1}^{n} p_i \\ln(p_i)$$</div>
      <p>where $p_i$ is the share of supplier (or buyer) country $i$ in total imports (or exports) of the commodity. Higher $H$ means more diversification.</p>
      <p>The maximum value is $H_{\\max} = \\ln(n)$, reached when all $n$ partners have equal shares. The <strong>normalised</strong> index $H / H_{\\max} \\in [0, 1]$ is what you report; it is independent of the number of partners and lets you compare commodities.</p>

      <div class="key-box">
        <div class="label">Worked example</div>
        <p>Country imports gas from 3 suppliers with shares 60&nbsp;%, 30&nbsp;%, 10&nbsp;%.</p>
        <p>$H = -[0.6 \\ln(0.6) + 0.3 \\ln(0.3) + 0.1 \\ln(0.1)]$<br>
        $= -[0.6(-0.511) + 0.3(-1.204) + 0.1(-2.303)] = 0.898$<br>
        $H_{\\max} = \\ln(3) = 1.099$<br>
        $H/H_{\\max} = 0.817$, so moderately diversified.</p>
      </div>

      <h3>Country risk via the World Bank WGI</h3>
      <p>Shannon is necessary but not sufficient. A perfectly diversified import basket sourced from politically unstable countries is still risky. The World Bank Worldwide Governance Indicators (WGI) give a 0&ndash;100 percentile rank on six dimensions: Voice and Accountability, Political Stability, Government Effectiveness, Regulatory Quality, Rule of Law, Control of Corruption. Western European democracies score 80&ndash;99; lower-governance suppliers score below 50.</p>

      <h3>Supply routes</h3>
      <p>Beyond country diversification, route diversification matters. A single pipeline corridor carrying multiple-country gas creates a chokepoint. PW Section 4 should discuss both the partner-country mix and the route map.</p>
    `
  },

  electricity_commodity: {
    title: 'Electricity as a commodity',
    lead: 'Electricity is not just another good. Three peculiarities define every market design and every operational decision: it cannot be stored at scale, supply and demand must balance instantaneously, and the grid is the market.',
    body: `
      <h3>The three peculiarities</h3>
      <p><strong>1. Non-storability.</strong> Electricity, once generated, must be consumed within a fraction of a second. Storage exists (pumped hydro, batteries), but it is small relative to the system. Every other commodity can be inventoried for months; electricity cannot. This forces real-time balancing.</p>

      <p><strong>2. Instantaneous balance.</strong> Generation must equal consumption (plus network losses) at every instant. A 1&nbsp;% mismatch threatens frequency stability and triggers automatic load shedding or generator tripping. The TSO (transmission system operator) is responsible for keeping the balance.</p>

      <p><strong>3. The network IS the market.</strong> Electricity flows according to physical laws (Kirchhoff), not contractual paths. Selling 1 MWh from plant A to consumer B does not mean an electron travels from A to B; it means the system as a whole is balanced by A's injection and B's withdrawal. Locational pricing and congestion management exist because the network's physics constrain trade.</p>

      <h3>Derived demand</h3>
      <p>Consumers do not want electricity; they want light, heat, motion, cold storage, data processing. Electricity demand is therefore <em>derived</em> from the demand for these services. In the short run, demand is highly inelastic (price doubles, demand falls 1&ndash;5&nbsp;%); in the long run, electrification or substitution dominates.</p>

      <h3>The merit order curve</h3>
      <p>The supply curve of an electricity market is the merit order: plants ranked by short-run marginal cost from cheapest to most expensive. At any given demand level, the price is set by the marginal accepted unit. Renewables enter at the bottom (near-zero marginal cost), then nuclear, then coal/gas, then peakers.</p>

      <div class="diagram-wrap">
        <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
          <line x1="50" y1="240" x2="560" y2="240" stroke="#1a1612" stroke-width="1.5"/>
          <line x1="50" y1="240" x2="50" y2="20" stroke="#1a1612" stroke-width="1.5"/>
          <text x="305" y="265" font-size="12" fill="#4a4239" text-anchor="middle" font-family="'DM Sans',sans-serif">Quantity (GW)</text>
          <text x="15" y="130" font-size="12" fill="#4a4239" text-anchor="middle" transform="rotate(-90 15 130)" font-family="'DM Sans',sans-serif">Marginal cost (EUR/MWh)</text>
          <rect x="60" y="220" width="80" height="20" fill="#2a6b3a"/>
          <rect x="140" y="200" width="60" height="40" fill="#4a8b58"/>
          <rect x="200" y="150" width="80" height="90" fill="#7a7164"/>
          <rect x="280" y="100" width="100" height="140" fill="#a8431e"/>
          <rect x="380" y="60" width="80" height="180" fill="#9d2a2a"/>
          <text x="100" y="235" font-size="10" fill="white" text-anchor="middle">RES</text>
          <text x="170" y="225" font-size="10" fill="white" text-anchor="middle">Nuclear</text>
          <text x="240" y="200" font-size="10" fill="white" text-anchor="middle">Coal</text>
          <text x="330" y="180" font-size="10" fill="white" text-anchor="middle">CCGT</text>
          <text x="420" y="160" font-size="10" fill="white" text-anchor="middle">Peakers</text>
          <line x1="320" y1="20" x2="320" y2="240" stroke="#a13a2e" stroke-width="2" stroke-dasharray="4,4"/>
          <text x="320" y="15" font-size="11" fill="#a13a2e" text-anchor="middle" font-weight="600">Demand</text>
          <circle cx="320" cy="100" r="5" fill="#a13a2e"/>
          <text x="350" y="98" font-size="11" fill="#a13a2e" font-weight="600">Clearing price</text>
        </svg>
        <div class="diagram-caption">Merit order: the supply curve. The price clears where demand meets the cheapest stack of plants that can satisfy it.</div>
      </div>

      <div class="key-box">
        <div class="label">For the project</div>
        <p>In PW Section 7 (power system) you describe the country's plant inventory by type, capacity factor, and indicative LCOE. Each plant type sits at a different point in the merit order, and the country-specific shape of the merit order explains why prices behave the way they do (and why Norway's hydro-dominated stack rarely sets the marginal price in summer but often does in winter).</p>
      </div>
    `
  },

  market_equilibrium: {
    title: 'Supply, demand, equilibrium',
    lead: 'A single market clears at the price where the marginal cost of the last needed plant equals the marginal willingness to pay. Both curves shift constantly because demand follows weather and time of day, and supply follows wind and solar.',
    body: `
      <h3>The textbook picture</h3>
      <p>Supply curve $S(p)$ is upward-sloping: higher prices bring more capacity online. Demand curve $D(p)$ is downward-sloping: higher prices reduce consumption (though weakly in the short run). Equilibrium is the price $p^\\star$ where $S(p^\\star) = D(p^\\star)$.</p>
      <div class="formula-block"><div class="label">Market equilibrium</div>$$p^\\star: \\quad S(p^\\star) = D(p^\\star), \\qquad q^\\star = S(p^\\star) = D(p^\\star)$$</div>

      <h3>What clears the market</h3>
      <p>In electricity, the supply curve is the merit order (Section above). The clearing price is set by the <strong>marginal accepted bid</strong> &mdash; the most expensive plant that has to run to meet demand. All accepted plants are paid this price under uniform pricing (the dominant European design); plants are paid their own bid under pay-as-bid.</p>

      <h3>Producer and consumer surplus</h3>
      <p>The vertical gap between the clearing price and the supply curve is <strong>producer surplus</strong> &mdash; revenue minus marginal cost, integrated over the accepted quantity. The gap between the demand curve and the price is <strong>consumer surplus</strong> &mdash; willingness to pay minus price paid. Total surplus is maximised at the competitive equilibrium.</p>

      <h3>Why electricity markets clear differently</h3>
      <p>Three mechanisms break the simple textbook picture in electricity:</p>
      <ul>
        <li><strong>Zero marginal cost of RES.</strong> Wind and solar have ~0 short-run marginal cost. When their share rises, the merit order flattens at the bottom, the clearing price drops, and price volatility increases.</li>
        <li><strong>Inelastic short-run demand.</strong> Demand curve is nearly vertical on the day. So small supply shocks (cold snap, wind drop) cause large price spikes.</li>
        <li><strong>Time-coupled constraints.</strong> Start-up costs, ramp limits, minimum-run times, hydro reservoir constraints couple decisions across hours. A pure single-period clearing is an approximation; real markets use day-ahead optimisation over 24 coupled hours.</li>
      </ul>

      <div class="key-box">
        <div class="label">For the exam</div>
        <p>Be ready to draw a merit-order graph and identify the clearing price, the producer surplus area, and the consumer surplus area. Also be ready to shift the curves: more wind capacity shifts $S$ right (price falls); a heat wave shifts $D$ right (price rises).</p>
      </div>
    `
  },

  market_power_hhi: {
    title: 'Market power & the HHI',
    lead: 'A market with one dominant supplier behaves nothing like a competitive market. Concentration measures and pivotal supplier tests are how regulators decide whether to intervene.',
    body: `
      <h3>Why market power matters in electricity</h3>
      <p>The combination of inelastic demand, non-storability, and limited transmission means that a generator with even a moderate share can profitably withhold capacity, raising prices well above marginal cost. The classic California 2000&ndash;2001 crisis illustrated this: Enron and other generators withheld capacity to drive up prices.</p>

      <h3>The Herfindahl-Hirschman Index</h3>
      <p>The HHI is the sum of squared market shares (in percent):</p>
      <div class="formula-block"><div class="label">HHI</div>$$\\mathrm{HHI} = \\sum_{i=1}^{n} s_i^2, \\qquad s_i \\in [0, 100]$$</div>
      <p>Range: 0 (perfect competition, atomistic shares) to 10,000 (monopoly, $s_1 = 100$). Standard antitrust thresholds:</p>
      <ul>
        <li>HHI < 1,500: unconcentrated.</li>
        <li>1,500 &le; HHI < 2,500: moderately concentrated.</li>
        <li>HHI &ge; 2,500: highly concentrated.</li>
      </ul>

      <div class="key-box">
        <div class="label">Worked example</div>
        <p>Three generators with shares 50, 30, 20: HHI = 2500 + 900 + 400 = 3800. Highly concentrated.</p>
        <p>Five generators with shares 30, 25, 20, 15, 10: HHI = 900 + 625 + 400 + 225 + 100 = 2250. Moderately concentrated.</p>
      </div>

      <h3>The pivotal supplier test</h3>
      <p>HHI is a static measure. The <strong>pivotal supplier test</strong> is more operational: a supplier is pivotal if removing its capacity leaves the system unable to meet demand. A pivotal supplier can set the price almost regardless of marginal cost. Regulators use this for real-time monitoring.</p>

      <h3>The reference market</h3>
      <p>Market power assessments depend on defining the <strong>reference market</strong>: which geographical area and which time horizon. A generator may be small EU-wide but pivotal in a small bidding zone or during a single peak hour. Italy's market is split into zones precisely because the geographical reference defines the competitive landscape.</p>
    `
  },

  market_classification: {
    title: 'Classification of electricity markets',
    lead: 'Electricity is traded in a sequence of markets running on different timescales. Day-ahead, intraday, balancing, ancillary, capacity. Each one solves a different problem.',
    body: `
      <h3>The timescale ladder</h3>
      <p>Trades happen at progressively shorter notice as delivery approaches:</p>
      <table class="calc-table">
        <thead><tr><th>Market</th><th>Timescale</th><th>Function</th></tr></thead>
        <tbody>
          <tr><td>Futures / forwards</td><td>Months to years ahead</td><td>Risk hedging, financial position-taking</td></tr>
          <tr><td>Day-ahead</td><td>Hours before delivery (~noon previous day)</td><td>Main physical market, dispatch baseline</td></tr>
          <tr><td>Intraday</td><td>Minutes to hours before delivery</td><td>Adjust for forecast updates (wind, solar, load)</td></tr>
          <tr><td>Balancing</td><td>Real time, &plusmn; the hour</td><td>Restore system balance (TSO procures reserves)</td></tr>
          <tr><td>Ancillary services</td><td>Continuous</td><td>Frequency response, voltage support, black start</td></tr>
          <tr><td>Capacity</td><td>Years ahead</td><td>Pay for capacity availability, not energy delivered</td></tr>
        </tbody>
      </table>

      <h3>Day-ahead in detail</h3>
      <p>Most volume clears in the day-ahead market. Generators submit bids and consumers submit demand curves for each of the 24 hours of the next day. A market operator (NEMO in Europe) clears all 24 hourly auctions simultaneously, finding the price that maximises social welfare subject to network constraints. European day-ahead markets are coupled across borders via the SDAC (Single Day-Ahead Coupling) algorithm.</p>

      <h3>Balancing markets</h3>
      <p>Even after day-ahead and intraday, deviations remain. The TSO buys upward reserves (extra generation or load reduction if the system is short) and downward reserves (less generation or more load if the system is long). Balancing prices are typically more volatile than day-ahead, reflecting scarcity in real time.</p>

      <h3>Capacity markets</h3>
      <p>Energy-only markets reward MWh produced. They struggle to incentivise the capacity needed for rare peak hours (the "missing money problem"). Capacity markets pay generators for being available (MW) regardless of whether they generate. France, UK, Italy, Belgium have capacity markets; Germany and the Nordic countries currently do not.</p>

      <div class="key-box">
        <div class="label">The recognition test</div>
        <p>Read a market design description and within ten seconds: which timescale? What is the product (MWh, MW, MVAr)? Who clears (NEMO, TSO, regulator)?</p>
      </div>
    `
  },

  bidding_clearing: {
    title: 'Bidding & market clearing',
    lead: 'Two questions: what is the bid, and how is the price set. The answers define the auction. The marginal accepted bid usually sets the price, but pay-as-bid changes that.',
    body: `
      <h3>What is a bid</h3>
      <p>A simple bid is a single price-quantity pair: "I will produce 100 MWh if the price is at least 45 EUR/MWh." A block bid is an all-or-nothing pair: "I produce 100 MWh for all 24 hours, or none." Complex orders bundle technical constraints (minimum run time, ramping limits) into the bid.</p>

      <h3>Uniform vs pay-as-bid pricing</h3>
      <p><strong>Uniform price</strong> (also called marginal pricing): all accepted bids are paid the price of the marginal accepted bid. This is the dominant European design. Pro: efficient (bidders bid true marginal cost). Con: politically uncomfortable when low-cost RES are paid the same as a marginal gas plant.</p>

      <p><strong>Pay-as-bid</strong>: each accepted bidder is paid their own bid. Pro: appears to eliminate inframarginal rents. Con: bidders shade their bids upward toward the expected clearing price, so the efficiency case for pay-as-bid is theoretically weaker.</p>

      <h3>The clearing algorithm</h3>
      <p>For a simple single-period auction with bids $(p_i, q_i)$:</p>
      <ol>
        <li>Sort supply bids in ascending price order.</li>
        <li>Sort demand bids in descending price order.</li>
        <li>Walk up the supply curve. Accept supply bids one by one and accumulate quantity.</li>
        <li>Walk down the demand curve. Accept demand bids one by one and accumulate quantity.</li>
        <li>The clearing price is where the cumulative supply and cumulative demand intersect.</li>
      </ol>

      <div class="formula-block"><div class="label">Clearing condition</div>$$\\sum_{i: \\text{accepted supply}} q_i^s = \\sum_{j: \\text{accepted demand}} q_j^d$$</div>

      <h3>What complicates real markets</h3>
      <p>Block bids cause non-convexities (the all-or-nothing condition is integer). Cross-border coupling adds transmission constraints. Reserve co-optimisation forces some capacity to be set aside for balancing. The actual European day-ahead algorithm (EUPHEMIA) is a mixed-integer linear program solving all of this jointly across all 24 hours and all bidding zones.</p>

      <div class="key-box">
        <div class="label">For the exam</div>
        <p>You may be asked to clear a small 3&ndash;5 bid auction by hand. The trick is to sort cleanly, accumulate quantity, and identify the marginal accepted bid as the price.</p>
      </div>

      <h3>Worked example (E2 exercise 2.1)</h3>
      <div class="key-box">
        <div class="label">E2 - pool clearing without network constraints</div>
        <p>One-bus system. Two generators and two loads with offer/bid pairs (quantity, price):</p>
        <ul>
          <li>G1: (125, 15), (150, 25). Two blocks of supply.</li>
          <li>G2: (80, 20), (180, 30). Two blocks of supply.</li>
          <li>D1: (150, 50). Block of demand.</li>
          <li>D2: (170, 28). Block of demand.</li>
        </ul>
        <p>Stack supply ascending in price: 125 @ 15, 80 @ 20, 150 @ 25, 180 @ 30. Stack demand descending in price: 150 @ 50, 170 @ 28.</p>
        <p>Walk up supply (cheapest first) and walk down demand (highest WTP first) until they intersect. Cumulative supply 205 MW at price 20; cumulative demand 320 MW at price 28. Move up to price 25: cumulative supply 355 MW (all 125 + 80 + 150). At that point demand at WTP &ge; 25 still includes both D1 (150) and D2 (170) = 320 MW. The clearing happens where they cross.</p>
        <p>Marginal cleared quantity (MCQ) = min of cumulative supply at the marginal price and cumulative demand at the same price. Clearing price &lambda; sits between 25 (supply marginal) and 28 (demand marginal); MCQ ~ 320 MW.</p>
        <p>Social surplus S_s = sum of producer surplus S_G (revenue minus marginal cost on accepted supply) plus consumer surplus S_D (WTP minus price on accepted demand).</p>
      </div>
    `
  },

  network_clearing: {
    title: 'Network constraints & LMP',
    lead: 'A copper-plate market ignores transmission. Real grids have limits, and when they bind, prices diverge across locations. Locational marginal prices are the cleanest way to price this divergence.',
    body: `
      <h3>Why locational pricing</h3>
      <p>If the grid is unconstrained, a single price clears everywhere. If a line is congested, generation cheaper than the constrained area cannot reach buyers there, and a more expensive local generator has to run. Locational marginal prices (LMPs) reflect this: the price at node $i$ is the marginal cost of meeting one more MWh of demand at $i$, given all network constraints.</p>

      <div class="formula-block"><div class="label">LMP decomposition</div>$$\\mathrm{LMP}_i = \\lambda + \\mu_i^{\\mathrm{congestion}} + \\mu_i^{\\mathrm{losses}}$$</div>
      <p>$\\lambda$ is the system-wide energy price (the dual of the energy balance constraint). $\\mu_i^{\\mathrm{congestion}}$ is the congestion component (dual of the line-flow constraints), nonzero only on congested lines. $\\mu_i^{\\mathrm{losses}}$ is the loss component, usually small.</p>

      <h3>Nodal vs zonal pricing</h3>
      <p>The US (PJM, MISO, ERCOT) uses <strong>nodal pricing</strong>: every grid node has its own LMP, possibly thousands per market. Europe uses <strong>zonal pricing</strong>: a country or a region is one price zone, with transmission constraints captured between zones but not within. Nodal is more efficient in theory but information-heavy; zonal is the European political compromise.</p>

      <h3>DC power flow</h3>
      <p>Real power flow is nonlinear (AC). For market clearing, the standard approximation is DC power flow, which linearises around a 1.0 per-unit voltage and small angle differences:</p>
      <div class="formula-block"><div class="label">DC power flow</div>$$P_{ij} = \\frac{1}{x_{ij}} (\\theta_i - \\theta_j)$$</div>
      <p>where $P_{ij}$ is the active power flow on line $i$-$j$, $x_{ij}$ is the line reactance, and $\\theta_i$ is the voltage angle at bus $i$. This is the model used inside the EUPHEMIA-style optimisation.</p>

      <h3>Congestion rents</h3>
      <p>When a line is congested, the difference in LMPs between the two ends times the flow on the line is the congestion rent. It is collected by the TSO and (in Europe) typically reinvested in grid expansion or refunded.</p>

      <h3>Worked example (E4 exercise 4.1)</h3>
      <div class="key-box">
        <div class="label">E4 - 3-bus system, market price formation</div>
        <p>Three buses A, B, C with two generators and two loads. Line impedances equal, losses neglected. Four cases:</p>
        <ul>
          <li><strong>Case a:</strong> 150 MW at C, no load at B, no congestion. Single system price, equal across all three buses.</li>
          <li><strong>Case b:</strong> 150 MW at C, 75 MW at B, no congestion. Still a single price.</li>
          <li><strong>Case c:</strong> 210 MW at C, 90 MW at B, no congestion declared a priori &mdash; check whether line limits bind.</li>
          <li><strong>Case d:</strong> If case c violates a line limit, re-dispatch by raising the upstream generator and lowering the downstream one until the flow is back within limits; LMPs at the two ends of the constrained line diverge.</li>
        </ul>
        <p>The exercise asks you to fill load-payment and generation-credit tables. Load payment at bus i = LMP_i x load_i; generation credit at bus i = LMP_i x generation_i. The difference between total load payments and total generation credits equals the congestion rent collected by the TSO.</p>
      </div>

      <h3>Worked example (E3 exercise)</h3>
      <div class="key-box">
        <div class="label">E3 - optimisation with network constraints</div>
        <p>The E3 exercise progresses from a one-bus system (no network) through a two-bus system with a line flow limit f12_max = 50 MW, to a three-bus system with three lines and generators offering at their marginal cost. The pattern is always: solve the unconstrained dispatch first, then impose line flow limits as additional constraints in the LP. Where a limit binds, the per-bus LMPs diverge.</p>
        <p>For the three-bus system with marginal-cost offers C1m = 20 + 0.2 p1, C2m = 40 + 0.15 p2, C3m = 15 + 0.1 p3 and demands d1 = 200, d2 = 400, d3 = 0, with a binding constraint F23max = 150 MW, the LP is small enough to solve by hand using KKT. The dual variable on the congested line is the LMP differential.</p>
      </div>
    `
  },

  optimization_concepts: {
    title: 'LP, KKT and the power dispatch problem',
    lead: 'The power-system optimisation in PW Section 8 is a linear program. You should be able to write the standard form, identify the dual variables, and state the KKT conditions in 30 seconds.',
    body: `
      <h3>Linear programming, standard form</h3>
      <div class="formula-block"><div class="label">LP standard form</div>$$\\begin{aligned} \\min_{x} \\quad & c^\\top x \\\\ \\text{s.t.} \\quad & A x = b \\\\ & x \\geq 0 \\end{aligned}$$</div>
      <p>$c \\in \\mathbb{R}^n$ are costs, $A \\in \\mathbb{R}^{m \\times n}$ is the constraint matrix, $b \\in \\mathbb{R}^m$ is the right-hand side. The feasible set is the polyhedron $\\{x \\geq 0 : Ax = b\\}$, and the optimum (if finite) is attained at a vertex.</p>

      <h3>The economic dispatch as an LP</h3>
      <p>Variables: $x_i$ = generation by plant $i$ (MWh). Cost: $c_i$ = marginal cost of plant $i$. Demand: $D$ = total electricity demand. Capacity: $\\overline{x}_i$ = maximum output of plant $i$.</p>
      <div class="formula-block"><div class="label">Economic dispatch</div>$$\\begin{aligned} \\min_{x} \\quad & \\sum_i c_i x_i \\\\ \\text{s.t.} \\quad & \\sum_i x_i = D \\quad (\\lambda) \\\\ & 0 \\leq x_i \\leq \\overline{x}_i \\quad (\\mu_i) \\end{aligned}$$</div>
      <p>The dual variable $\\lambda$ of the demand constraint is the system marginal cost &mdash; the clearing price. The dual $\\mu_i$ of the capacity constraint is the scarcity rent on plant $i$.</p>

      <h3>KKT conditions</h3>
      <p>For a convex problem, the KKT conditions are necessary and sufficient for optimality:</p>
      <ol>
        <li><strong>Stationarity</strong>: $\\nabla_x L = 0$. For LP, this becomes $c_i - \\lambda + \\mu_i = 0$ for active plants.</li>
        <li><strong>Primal feasibility</strong>: all constraints satisfied ($\\sum x_i = D$, $0 \\le x_i \\le \\overline{x}_i$).</li>
        <li><strong>Dual feasibility</strong>: multipliers on inequality constraints are non-negative ($\\mu_i \\geq 0$).</li>
        <li><strong>Complementary slackness</strong>: $\\mu_i (\\overline{x}_i - x_i) = 0$. Either capacity is binding ($x_i = \\overline{x}_i$) or its dual is zero.</li>
      </ol>

      <h3>What complementary slackness tells you</h3>
      <p>For a plant at full output ($x_i = \\overline{x}_i$), the dual $\\mu_i$ can be positive: the plant earns inframarginal rent. For a plant operating below capacity ($x_i < \\overline{x}_i$), $\\mu_i = 0$: the plant is paid exactly its marginal cost. Plants set to zero ($x_i = 0$) have $c_i \\geq \\lambda$: they were too expensive to run.</p>

      <h3>Unit commitment vs economic dispatch</h3>
      <p><strong>Economic dispatch</strong> is the LP above with continuous $x_i$. <strong>Unit commitment</strong> adds integer on/off variables and start-up costs. Unit commitment is a mixed-integer linear program (MILP), much harder than LP, and is what real-day-ahead markets solve.</p>

      <div class="key-box">
        <div class="label">For PW Section 8</div>
        <p>Your project work optimisation is the simple LP above, with CO2 caps added as a linear constraint $\\sum_i \\mathrm{CO2}_i \\cdot x_i \\leq C$. Solver in Excel uses the simplex method by default; pick Simplex LP in the Solver dialog.</p>
      </div>
    `
  },

  finance_lcoe: {
    title: 'NPV, IRR and LCOE',
    lead: 'A power plant is an investment. NPV says whether to build, IRR says at what return, LCOE says how to compare it to other technologies on the same basis.',
    body: `
      <h3>Net Present Value</h3>
      <p>A project produces cash flows $\\mathrm{CF}_t$ in years $t = 0, 1, 2, \\dots, T$. Future cash flows are worth less than current ones because money has a time value (discount rate $r$).</p>
      <div class="formula-block"><div class="label">NPV</div>$$\\mathrm{NPV} = \\sum_{t=0}^{T} \\frac{\\mathrm{CF}_t}{(1 + r)^t}$$</div>
      <p>Decision rule: accept the project if $\\mathrm{NPV} > 0$. Reject if $\\mathrm{NPV} < 0$. Tie-break by IRR or other criteria.</p>

      <h3>Internal Rate of Return</h3>
      <p>IRR is the discount rate that makes NPV zero:</p>
      <div class="formula-block"><div class="label">IRR</div>$$0 = \\sum_{t=0}^{T} \\frac{\\mathrm{CF}_t}{(1 + \\mathrm{IRR})^t}$$</div>
      <p>Decision rule: accept if IRR > hurdle rate. IRR has known pitfalls: it can be non-unique (cash flows change sign more than once), and it does not scale with project size, so it should not be used alone for ranking mutually exclusive projects.</p>

      <h3>Levelised Cost of Electricity</h3>
      <p>LCOE makes generation technologies comparable by computing the average price per MWh that exactly recovers all lifetime costs at a given discount rate:</p>
      <div class="formula-block"><div class="label">LCOE</div>$$\\mathrm{LCOE} = \\frac{\\sum_{t=0}^{T} (\\mathrm{Capex}_t + \\mathrm{O\\&M}_t + \\mathrm{Fuel}_t + \\mathrm{Carbon}_t) / (1 + r)^t}{\\sum_{t=0}^{T} E_t / (1 + r)^t}$$</div>
      <p>$E_t$ is electricity produced in year $t$ (MWh). The numerator is the discounted lifetime cost; the denominator is the discounted lifetime energy. Units: EUR/MWh.</p>

      <h3>Sensitivities</h3>
      <p>LCOE is highly sensitive to:</p>
      <ul>
        <li><strong>Discount rate $r$</strong>. A capital-intensive technology (nuclear, offshore wind) has its LCOE rise sharply with $r$. A fuel-cost-heavy technology (CCGT) is less sensitive to $r$ but very sensitive to gas price.</li>
        <li><strong>Capacity factor</strong>. LCOE scales inversely with capacity factor (denominator is energy produced). A 30&nbsp;% CF wind turbine has roughly 1.5&times; the LCOE of an identical 45&nbsp;% CF wind turbine.</li>
        <li><strong>Lifetime $T$</strong>. Extending lifetime spreads upfront capex over more energy; LCOE falls.</li>
      </ul>

      <div class="key-box">
        <div class="label">Indicative 2024 LCOE ranges (EUR/MWh)</div>
        <ul>
          <li>Hydro reservoir (existing): 30&ndash;45</li>
          <li>Onshore wind (new, good site): 40&ndash;60</li>
          <li>Utility solar PV: 30&ndash;55</li>
          <li>Offshore wind, fixed-bottom: 60&ndash;90</li>
          <li>Offshore wind, floating: 100&ndash;150</li>
          <li>CCGT (no CCS, gas at 30 EUR/MWh thermal): 70&ndash;100</li>
          <li>Nuclear (new): 90&ndash;130</li>
        </ul>
      </div>

      <h3>What LCOE does not capture</h3>
      <p>LCOE treats all MWh as equivalent. But a MWh of solar at noon is not worth the same as a MWh of dispatchable power at peak. <strong>System LCOE</strong> and <strong>value-adjusted LCOE</strong> attempt to correct for this. In practice, LCOE is a screening metric, not a full economic decision tool.</p>

      <h3>Worked exercise (E5)</h3>
      <div class="key-box">
        <div class="label">E5 - basic financial analysis</div>
        <p><strong>Compounding.</strong> 100&nbsp;EUR at the start of 2021, interest rate 8.6&nbsp;%, value at start of 2031: $100 \\cdot (1.086)^{10} \\approx 228.5$&nbsp;EUR.</p>
        <p><strong>Annuity (mortgage).</strong> House of 200,000&nbsp;EUR with 50,000 down, 150,000 remaining, 20-year annuity at 11&nbsp;%: $A = P \\cdot \\frac{r(1+r)^n}{(1+r)^n - 1} = 150{,}000 \\cdot \\frac{0.11 \\cdot (1.11)^{20}}{(1.11)^{20} - 1} \\approx 18{,}830$&nbsp;EUR/year.</p>
        <p><strong>Real vs nominal.</strong> 24,000&nbsp;EUR/year salary 2021-2027 (7 years). At nominal 6.64&nbsp;% interest, the future value at end of 2027 is the annuity FV $\\approx 24{,}000 \\cdot \\frac{(1.0664)^7 - 1}{0.0664} \\approx 207{,}300$&nbsp;EUR. Adjusting for 7.5&nbsp;% inflation, real purchasing power $\\approx 207{,}300 / (1.075)^7 \\approx 125{,}200$&nbsp;EUR.</p>
      </div>

      <div class="key-box">
        <div class="label">E5 - power project: CCGT vs turbo gas</div>
        <p>For two competing projects with capex, opex, working hours, electricity price, interest rate, and lifetime, the recipe is:</p>
        <ol>
          <li>Build the yearly net cash flow: $\\mathrm{CF}_t = (P_{\\mathrm{elec}} - C_{\\mathrm{prod}}) \\cdot H \\cdot P_{\\mathrm{cap}} - \\mathrm{OPEX}$, with $\\mathrm{CF}_0 = -\\mathrm{CAPEX}$.</li>
          <li>NPV = $\\sum_{t=0}^{T} \\mathrm{CF}_t / (1+r)^t$.</li>
          <li>IRR is the $r$ solving NPV($r$) = 0; use the IRR() function in Excel.</li>
          <li>Profitability index PI = (NPV + initial outlay) / initial outlay; PI > 1 means the project creates value beyond recovery of capex.</li>
        </ol>
        <p>For comparing mutually exclusive projects of different scale, rank by NPV, not IRR. PI is a useful tiebreaker when capital is constrained.</p>
      </div>
    `
  },

  multi_commodity: {
    title: 'Multi-commodity systems & Power-to-X',
    lead: 'The energy transition is not just about cleaning the electricity sector. Heat, gas, hydrogen and mobility have to be coupled to the power system to absorb variable renewables. L18 introduces the sector-coupling logic and the Power-to-X family that makes it work.',
    body: `
      <h3>Why sector coupling now</h3>
      <p>Renewable electricity is increasingly cheap but variable. Heating, industrial heat, and heavy transport still run on fossil fuels. The bridge is <strong>electrification of end uses</strong> (heat pumps, EVs, electric arc furnaces) plus <strong>conversion of surplus electricity into other carriers</strong> (hydrogen, synthetic methane, district heat). The unified term is <strong>sector coupling</strong>.</p>

      <h3>Power-to-X, the family</h3>
      <p>"Power-to-X" labels any process that takes electricity in and produces another energy carrier out:</p>
      <ul>
        <li><strong>Power-to-Heat</strong> &mdash; heat pumps, resistive heaters, electric boilers. The simplest and most efficient PtX, with COP of 3-5 for modern heat pumps.</li>
        <li><strong>Power-to-Gas (PtG)</strong> &mdash; electrolysis of water produces hydrogen; an optional methanation step combines hydrogen with CO2 to produce synthetic natural gas.</li>
        <li><strong>Power-to-Liquid</strong> &mdash; further synthesis to methanol, ammonia, e-kerosene.</li>
        <li><strong>Power-to-Chemicals</strong> &mdash; electrolytic hydrogen fed into the existing chemical sector (ammonia for fertilisers, steel reduction).</li>
      </ul>

      <h3>Power-to-Gas in detail</h3>
      <p>The PtG chain has two stages. <strong>Electrolysis</strong>: $2 H_2O + \\mathrm{electricity} \\rightarrow 2 H_2 + O_2$, with efficiency 60-80&nbsp;% (LHV) depending on technology (alkaline, PEM, solid-oxide). <strong>Methanation</strong> (Sabatier reaction): $CO_2 + 4 H_2 \\rightarrow CH_4 + 2 H_2O$, with efficiency around 80&nbsp;%. The round-trip electricity-to-methane efficiency lands in the 40-60&nbsp;% range; round-trip electricity-to-electricity via gas turbine is 20-30&nbsp;%.</p>

      <div class="formula-block"><div class="label">PtG round-trip efficiency</div>$$\\eta_{\\mathrm{PtG\\to elec}} = \\eta_{\\mathrm{electrolysis}} \\cdot \\eta_{\\mathrm{methanation}} \\cdot \\eta_{\\mathrm{gas\\ turbine}}$$</div>

      <p>The losses look prohibitive until you remember that the input electricity is surplus renewable energy that would otherwise be curtailed (price zero or negative). The economics depend on capturing those low-price hours.</p>

      <h3>PtG in the electricity infrastructure</h3>
      <p>An electrolyser is a controllable load. It can therefore play several roles in the power system:</p>
      <ul>
        <li><strong>Fast frequency reserve</strong> &mdash; respond within seconds to frequency deviations by ramping up or down (PEM electrolysers can ramp from 0 to 100&nbsp;% in under a minute).</li>
        <li><strong>Primary reserve</strong> &mdash; automatic response to frequency changes, droop-controlled.</li>
        <li><strong>Secondary reserve</strong> &mdash; activated by the TSO within minutes.</li>
        <li><strong>Service arbitrage</strong> &mdash; the same electrolyser can stack multiple revenues (energy market + ancillary services + hydrogen sales).</li>
      </ul>

      <h3>District heating coupling</h3>
      <p>District heating networks are the other major coupling point. Combined heat and power (CHP) plants jointly produce electricity and heat at high overall efficiency (85-90&nbsp;% on LHV). Modern district heating with heat pumps, thermal storage, and solar collectors can absorb electricity surplus and shift heat demand across hours and seasons.</p>

      <div class="key-box">
        <div class="label">The recognition test for L18</div>
        <ul>
          <li>Power-to-X means electricity in, some other carrier out. The "X" is the variable.</li>
          <li>Electrolysis splits water into H2 and O2; methanation combines H2 with CO2 into CH4. Each step has losses; the combined round-trip back to electricity is ~25&nbsp;%.</li>
          <li>The case for PtG is not round-trip efficiency, but absorbing curtailed RES at near-zero opportunity cost and providing reserve services.</li>
          <li>Sector coupling broadens the set of decision variables in the optimisation: not just power generation, but power-to-heat, power-to-hydrogen, and the storage between them.</li>
        </ul>
      </div>
    `
  },

  course_optim_exercise: {
    title: 'The course optimisation exercise',
    lead: 'The official Optimization.xlsx that comes with the course is the literal model of what PW Section 8 expects. Ten plant types, integer numbers of units, USD/kWh LCOE, and a CO2 cap. Solving it once by hand teaches the structure.',
    body: `
      <h3>Problem setup</h3>
      <p>Decision variable: $n_i$ = integer number of units of plant type $i$ (positive integer). Each unit has fixed capacity $P_i$ (MW), availability factor $\\mathrm{AF}_i$, LCOE $c_i$ (USD/kWh), and emission factor $f_i$ (tCO2/MWh).</p>

      <h3>Plant inventory</h3>
      <table class="calc-table">
        <thead><tr><th>Plant</th><th>Typology</th><th>Capacity (MW)</th><th>AF</th><th>LCOE (USD/kWh)</th><th>CO2 (tCO2/MWh)</th></tr></thead>
        <tbody>
          <tr><td>Nuclear</td><td>EPR-1600</td><td>1600</td><td>0.85</td><td>0.0611</td><td>0</td></tr>
          <tr><td>Coal</td><td>Black PCC</td><td>800</td><td>0.85</td><td>0.0793</td><td>0.9</td></tr>
          <tr><td>Coal</td><td>Black IGCC</td><td>550</td><td>0.85</td><td>0.0749</td><td>0.9</td></tr>
          <tr><td>Natural Gas</td><td>CCGT (large)</td><td>800</td><td>0.85</td><td>0.0869</td><td>0.33</td></tr>
          <tr><td>Natural Gas</td><td>CCGT</td><td>400</td><td>0.85</td><td>0.0766</td><td>0.33</td></tr>
          <tr><td>RES</td><td>Onshore Wind</td><td>50</td><td>0.22</td><td>0.1455</td><td>0</td></tr>
          <tr><td>RES</td><td>Offshore Wind</td><td>120</td><td>0.34</td><td>0.1437</td><td>0</td></tr>
          <tr><td>RES</td><td>Solar PV</td><td>6</td><td>0.16</td><td>0.4104</td><td>0</td></tr>
          <tr><td>RES</td><td>Large Hydro</td><td>1000</td><td>0.55</td><td>0.0730</td><td>0</td></tr>
          <tr><td>RES</td><td>Small Hydro</td><td>2</td><td>0.59</td><td>0.0486</td><td>0</td></tr>
        </tbody>
      </table>

      <h3>Derived quantities</h3>
      <p>Annual production per type: $E_i = P_i \\cdot \\mathrm{AF}_i \\cdot 8760 \\cdot n_i / 10^6$ in TWh per year. (The /10^6 converts MWh to TWh.)</p>
      <p>Annual cost per type: $C_i = c_i \\cdot E_i \\cdot 10^9 / 10^9 = c_i \\cdot E_i$ in billion USD per year (since LCOE in USD/kWh times TWh equals 10^9 USD = billion USD; the units cancel cleanly).</p>
      <p>Annual CO2 per type: $\\mathrm{CO2}_i = f_i \\cdot E_i \\cdot 1000$ in kt CO2 per year (TWh times tCO2/MWh times 10^6 MWh/TWh, in kt is /1000).</p>

      <h3>Formulation</h3>
      <div class="formula-block"><div class="label">Course optimisation</div>
$$\\begin{aligned}
\\min_{n_i \\in \\mathbb{Z}_+} \\quad & \\sum_i C_i = \\sum_i c_i \\cdot P_i \\cdot \\mathrm{AF}_i \\cdot 8760 \\cdot n_i / 10^6 \\\\
\\text{s.t.} \\quad & \\sum_i E_i \\geq D_{\\min} \\quad \\text{(min demand 150 TWh/y)} \\\\
& \\sum_i f_i E_i \\cdot 1000 \\leq C^{\\mathrm{CO2}} \\quad \\text{(50,000 kt/y)} \\\\
& \\underline{n}_i \\leq n_i \\leq \\overline{n}_i \\quad \\text{(min/max units per type)} \\\\
& \\mathrm{RES~share} \\geq \\alpha \\quad \\text{(if required)} \\\\
& n_i \\in \\mathbb{Z}_+
\\end{aligned}$$</div>

      <h3>Constraint values from the workbook</h3>
      <table class="calc-table">
        <thead><tr><th>Type</th><th>Min units</th><th>Max units</th></tr></thead>
        <tbody>
          <tr><td>Nuclear EPR-1600</td><td>1</td><td>1</td></tr>
          <tr><td>Coal Black PCC</td><td>2</td><td>7</td></tr>
          <tr><td>Coal Black IGCC</td><td>2</td><td>6</td></tr>
          <tr><td>CCGT (large)</td><td>6</td><td>10</td></tr>
          <tr><td>CCGT</td><td>8</td><td>12</td></tr>
          <tr><td>Onshore Wind</td><td>15</td><td>25</td></tr>
          <tr><td>Offshore Wind</td><td>5</td><td>50</td></tr>
          <tr><td>Solar PV</td><td>10</td><td>60</td></tr>
          <tr><td>Large Hydro</td><td>2</td><td>4</td></tr>
          <tr><td>Small Hydro</td><td>40</td><td>60</td></tr>
        </tbody>
      </table>
      <p>Global constraints: minimum electricity demand 150 TWh/year; maximum CO2 emissions 50,000 kt/year. The penetration of renewables is computed but not always constrained; in country-specific runs you add a lower bound.</p>

      <h3>Solver setup (Excel)</h3>
      <ol>
        <li>Open Optimization.xlsx, sheet "Baseline".</li>
        <li>Set the changing cells to F4:F13 (the Units column).</li>
        <li>Objective: minimise H18 (Total cost, billion USD).</li>
        <li>Constraints: H17 &ge; H25 (production &ge; min demand); H19 &le; H24 (CO2 &le; cap); F4:F13 between min and max columns; F4:F13 integer.</li>
        <li>Solving method: <strong>Simplex LP</strong> if you relax the integer constraint, or <strong>GRG Nonlinear</strong> if not. For the integer formulation, use the Simplex LP option with "Make Unconstrained Variables Non-Negative" and add explicit integer constraints (cell &ge; min and &le; max plus int).</li>
      </ol>

      <h3>Connecting back to PW Section 8</h3>
      <div class="key-box">
        <div class="label">Why this matters for the project</div>
        <p>The project brief says "putting proper constraints on the number of plants able to simulate the physical reality of the system". The course exercise is exactly the integer-units formulation the brief is asking for. Use the same structure for your country: one row per plant type with the country's actual capacity, AF, LCOE, and emission factor, and one cell per type for the integer number of units to operate or build.</p>
        <p>The country-specific twist is that some plant types are constrained to zero (Norway has no nuclear; you fix n_nuclear = 0) and others have hard upper bounds set by the resource ceiling (Norway's onshore wind political ceiling, the 30 GW offshore-wind ambition by 2040).</p>
      </div>
    `
  }
};

const QUIZ = [
  // ENERGY BASICS
  { topic: 'energy_basics', type: 'numeric', q: 'Convert 1 Mtoe to TJ.', a: 41868, tol: 1,
    expl: '1 toe = 41.868 GJ, so 1 Mtoe = 10^6 toe x 41.868 GJ/toe = 41,868 TJ.' },
  { topic: 'energy_basics', type: 'mc', q: 'TPES is best described as:',
    options: ['Energy consumed by end users in a year', 'Energy available to the economy at the primary stage in a year', 'Electricity generated in a year', 'Imports minus exports of fuels'], a: 1,
    expl: 'TPES (= Production + Imports - Exports + Stock changes - Bunkers) is the energy available to the economy at the primary stage. TFC is what end users actually consume.' },
  { topic: 'energy_basics', type: 'mc', q: 'The difference between TPES and TFC is mostly:',
    options: ['Imports', 'Conversion and transmission losses, energy sector own use, non-energy use', 'CO2 emissions', 'Demand response'], a: 1,
    expl: 'TPES > TFC because of transformation losses (refineries, power plants), the energy sector own use, distribution losses, and non-energy use of feedstocks.' },
  { topic: 'energy_basics', type: 'numeric', q: 'A country has TPES of 1,200,000 TJ. What is that in Mtoe (to 2 decimals)?', a: 28.66, tol: 0.05,
    expl: '1,200,000 / 41,868 = 28.66 Mtoe.' },

  // INDICATORS PW1
  { topic: 'indicators_pw1', type: 'mc', q: 'Energy intensity is defined as:',
    options: ['CO2 per capita', 'TPES divided by population', 'TPES divided by GDP-PPP', 'GDP per unit of TPES'], a: 2,
    expl: 'Energy intensity = TPES / GDP-PPP, typically in toe per million Int$ PPP.' },
  { topic: 'indicators_pw1', type: 'numeric', q: 'Country has TPES of 29 Mtoe and GDP-PPP of 580 bn Int$. What is the energy intensity in toe per million Int$ PPP (to 1 decimal)?', a: 50.0, tol: 0.5,
    expl: '29 Mtoe / 580 bn Int$ = 29 / 580,000 toe per Int$ = 50.0 toe per million Int$ PPP.' },
  { topic: 'indicators_pw1', type: 'mc', q: 'For comparing countries with very different price levels, which GDP do you use?',
    options: ['Nominal GDP in current USD', 'GDP at factor cost', 'GDP at PPP', 'Real GDP at current base year'], a: 2,
    expl: 'PPP-adjusted GDP corrects for cross-country price differences. Nominal USD comparisons of countries with different price levels are misleading.' },
  { topic: 'indicators_pw1', type: 'numeric', q: 'Country has CO2 of 42 Mt and TPES of 28 Mtoe. Carbon intensity of energy (t CO2 per toe)?', a: 1.5, tol: 0.05,
    expl: '42 Mt / 28 Mtoe = 1.5 t CO2 per toe.' },
  { topic: 'indicators_pw1', type: 'mc', q: 'GDP at market price equals GDP at basic price plus:',
    options: ['Subsidies on production', 'Taxes on products (e.g. VAT) minus subsidies on products', 'Imports', 'Indirect taxes minus all subsidies'], a: 1,
    expl: 'Market price GDP = basic price GDP + taxes on products - subsidies on products. The reason GDP at market price is higher than at basic price in countries with high VAT.' },

  // TRILEMMA
  { topic: 'trilemma', type: 'mc', q: 'The three corners of the energy trilemma are:',
    options: ['Production, transmission, consumption', 'Security, affordability, sustainability', 'Coal, oil, gas', 'Generation, storage, demand'], a: 1,
    expl: 'Security of supply, affordability for consumers, environmental sustainability. Every policy choice trades off along these three.' },
  { topic: 'trilemma', type: 'mc', q: 'A carbon tax primarily improves which corner of the trilemma?',
    options: ['Security', 'Affordability', 'Sustainability', 'All three equally'], a: 2,
    expl: 'A CO2 tax internalises the climate externality and shifts the merit order toward lower-emission plants, improving sustainability. It raises affordability tension (prices rise) and has mixed security effects.' },
  { topic: 'trilemma', type: 'mc', q: 'Which is NOT one of the five energy dimensions in L2?',
    options: ['Physical', 'Geopolitical', 'Cultural', 'Social'], a: 2,
    expl: 'The five are physical, economic, environmental, geopolitical, social. Cultural is not on the list.' },

  // TRANSITION DRIVERS
  { topic: 'transition_drivers', type: 'mc', q: 'The EU 2050 binding climate target is:',
    options: ['50 per cent reduction in CO2 vs 1990', 'Climate neutrality (net-zero GHG)', 'Replacing all fossil fuels with hydrogen', '100 per cent renewable electricity'], a: 1,
    expl: 'The European Climate Law (2021) binds the EU to climate neutrality by 2050. Norway is aligned with this via the EEA Agreement and its own Climate Change Act.' },
  { topic: 'transition_drivers', type: 'mc', q: 'The EU ETS covers:',
    options: ['Only power generation', 'Power, energy-intensive industry, aviation, maritime', 'Transport and buildings', 'Agriculture and forestry'], a: 1,
    expl: 'The ETS covers stationary combustion above a threshold (power, refining, cement, steel, chemicals), plus aviation and (since 2024) maritime. ESR (Effort Sharing Regulation) covers the non-ETS sectors.' },
  { topic: 'transition_drivers', type: 'mc', q: 'The three decarbonisation levers in their typical importance ranking are:',
    options: ['Efficiency > electrification > clean electricity', 'Electrification > clean electricity > efficiency', 'Efficiency, electrification of end uses, decarbonisation of electricity (each large)', 'Carbon capture is the only one that matters'], a: 2,
    expl: 'All three matter; the standard framing is efficiency first to reduce demand, electrification of end uses, and decarbonisation of the electricity supply running ahead of electrification.' },

  // GEOPOLITICS
  { topic: 'geopolitics', type: 'numeric', q: 'Imports 50 Mtoe, exports 10 Mtoe, GAE 60 Mtoe (stock changes negligible). What is the import dependency rate (per cent, to nearest integer)?', a: 67, tol: 1,
    expl: 'IDR = (50 - 10) / 60 = 0.667 = 66.7 per cent. Round to 67 per cent.' },
  { topic: 'geopolitics', type: 'numeric', q: 'A country imports gas from 2 suppliers, 70 and 30 per cent. Shannon index H (to 2 decimals)?', a: 0.61, tol: 0.02,
    expl: 'H = -(0.7 ln 0.7 + 0.3 ln 0.3) = -(0.7 x -0.357 + 0.3 x -1.204) = -(-0.25 - 0.361) = 0.61.' },
  { topic: 'geopolitics', type: 'mc', q: 'The maximum value of the Shannon index for $n$ partners is:',
    options: ['$\\ln(n)$', '$n$', '1', '$n / 2$'], a: 0,
    expl: 'H_max = ln(n), reached when all partners have equal share 1/n. The normalised value H/H_max sits in [0, 1].' },
  { topic: 'geopolitics', type: 'mc', q: 'The Norwegian import dependency rate for total energy in 2023 is approximately:',
    options: ['+60 per cent', '+30 per cent', '0 per cent', '-655 per cent'], a: 3,
    expl: 'Norway exports about 6.55 times its own consumption, giving IDR ~ -655 per cent. Highly negative because it is one of Europe largest energy exporters.' },

  // ELECTRICITY COMMODITY
  { topic: 'electricity_commodity', type: 'mc', q: 'The most distinctive property of electricity as a commodity is:',
    options: ['It can be transported over long distances', 'It cannot be stored at scale and supply must equal demand instantaneously', 'It is more expensive than natural gas', 'It is purely a financial product'], a: 1,
    expl: 'Non-storability plus instantaneous balance dictates everything else: real-time clearing, ancillary services, capacity markets, the role of the TSO.' },
  { topic: 'electricity_commodity', type: 'mc', q: 'Short-run electricity demand is:',
    options: ['Highly elastic', 'Highly inelastic (price doubles, demand falls a few per cent)', 'Perfectly elastic', 'Linear in price'], a: 1,
    expl: 'Short-run demand is very inelastic because consumers cannot quickly switch. Long-run demand is more elastic via electrification and substitution.' },
  { topic: 'electricity_commodity', type: 'mc', q: 'In a merit-order graph, the marginal accepted plant is:',
    options: ['The cheapest one', 'The most expensive plant that has to run to meet demand', 'A wind turbine', 'The plant with the largest capacity'], a: 1,
    expl: 'The clearing price is set by the marginal accepted plant: the most expensive bid that is needed to satisfy demand. All accepted plants are paid this price under uniform pricing.' },

  // MARKET EQUILIBRIUM
  { topic: 'market_equilibrium', type: 'mc', q: 'When wind capacity increases, the supply curve:',
    options: ['Shifts up (higher prices)', 'Shifts right (more quantity at every price)', 'Becomes vertical', 'Disappears'], a: 1,
    expl: 'More zero-marginal-cost capacity adds to the bottom of the merit order, shifting the entire supply curve to the right. At a given demand, the clearing price falls.' },
  { topic: 'market_equilibrium', type: 'mc', q: 'Producer surplus is:',
    options: ['Revenue minus marginal cost over all accepted units', 'Total revenue', 'Profit after taxes', 'The clearing price'], a: 0,
    expl: 'Producer surplus is the area above the supply curve and below the clearing price, integrated over accepted quantity.' },

  // MARKET POWER HHI
  { topic: 'market_power_hhi', type: 'numeric', q: 'Three generators with market shares 40, 35, 25 per cent. HHI?', a: 3450, tol: 5,
    expl: 'HHI = 40^2 + 35^2 + 25^2 = 1600 + 1225 + 625 = 3450. Highly concentrated.' },
  { topic: 'market_power_hhi', type: 'mc', q: 'HHI thresholds: a market is "highly concentrated" when:',
    options: ['HHI > 1,000', 'HHI > 1,500', 'HHI > 2,500', 'HHI > 5,000'], a: 2,
    expl: 'Standard US antitrust thresholds: < 1500 unconcentrated, 1500-2500 moderate, > 2500 highly concentrated.' },
  { topic: 'market_power_hhi', type: 'mc', q: 'A "pivotal supplier" is one whose:',
    options: ['Capacity is the largest in the market', 'Capacity removal would leave the system unable to meet demand', 'Bid is always accepted', 'Marginal cost is highest'], a: 1,
    expl: 'Pivotality is the operational definition of market power: if you must use this supplier, they can set the price.' },

  // MARKET CLASSIFICATION
  { topic: 'market_classification', type: 'mc', q: 'The European day-ahead market clears at approximately:',
    options: ['One second before delivery', 'Noon the day before delivery', 'One year ahead', 'Continuously'], a: 1,
    expl: 'European day-ahead markets (NEMOs) close at noon CET and clear the 24 hourly auctions for the next day simultaneously via the SDAC algorithm.' },
  { topic: 'market_classification', type: 'mc', q: 'A capacity market pays for:',
    options: ['MWh of electricity produced', 'MW of capacity available, regardless of production', 'Frequency regulation', 'Cross-border transmission rights'], a: 1,
    expl: 'Capacity markets pay for MW availability to solve the "missing money" problem of energy-only markets. France, UK, Italy, Belgium have one; Germany and the Nordics do not.' },
  { topic: 'market_classification', type: 'mc', q: 'Which market is closest to real time and used by the TSO to balance the system?',
    options: ['Futures', 'Day-ahead', 'Balancing market', 'Capacity market'], a: 2,
    expl: 'Balancing markets clear in real time (the hour of delivery or shortly before) to procure upward or downward reserves and keep the system in balance.' },

  // BIDDING & CLEARING
  { topic: 'bidding_clearing', type: 'mc', q: 'Under uniform pricing, accepted plants are paid:',
    options: ['Their own bid', 'The price of the marginal accepted bid', 'The average of all accepted bids', 'Their average cost'], a: 1,
    expl: 'Uniform pricing pays all accepted plants the marginal price. Pay-as-bid pays each plant its own bid; bidders shade upward under that design.' },
  { topic: 'bidding_clearing', type: 'mc', q: 'Five supply bids: 30, 40, 50, 70, 90 EUR/MWh, each 1 GW. Demand is 3.5 GW. Clearing price?',
    options: ['30 EUR/MWh', '50 EUR/MWh', '70 EUR/MWh', '90 EUR/MWh'], a: 2,
    expl: 'Stack: 1+1+1 = 3 GW at 30/40/50. Need 0.5 more from the 70 EUR plant: this becomes the marginal accepted bid, setting the price at 70 EUR/MWh.' },
  { topic: 'bidding_clearing', type: 'mc', q: 'A "block bid" means:',
    options: ['A single price-quantity pair', 'All-or-nothing: accepted in every hour or none', 'A bid that includes ramping limits', 'A bid that is rejected'], a: 1,
    expl: 'A block bid spans multiple hours and is either fully accepted or fully rejected. Block bids introduce non-convexities, which is why EUPHEMIA is a MILP.' },

  // NETWORK / LMP
  { topic: 'network_clearing', type: 'mc', q: 'A locational marginal price differs across nodes because of:',
    options: ['Currency differences', 'Network congestion and (small) losses', 'Different generation owners', 'Time zones'], a: 1,
    expl: 'LMP = energy price + congestion component + loss component. The congestion component is nonzero only where transmission constraints bind.' },
  { topic: 'network_clearing', type: 'mc', q: 'The "DC power flow" approximation linearises around:',
    options: ['Zero current', 'Voltage magnitude 1.0 per unit and small angle differences', 'A specific frequency', 'Lossless lines'], a: 1,
    expl: 'DC power flow assumes V=1 pu, sin(theta) ~ theta, and ignores reactive power. Gives P_ij = (1/x_ij)(theta_i - theta_j).' },
  { topic: 'network_clearing', type: 'mc', q: 'Europe predominantly uses:',
    options: ['Nodal pricing (every node a different price)', 'Zonal pricing (one price per zone or country)', 'A single EU-wide price', 'No clearing at all'], a: 1,
    expl: 'Europe uses zonal pricing (countries or bidding zones) coupled through SDAC. The US (PJM, MISO, ERCOT) uses nodal pricing.' },

  // OPTIMIZATION
  { topic: 'optimization_concepts', type: 'mc', q: 'In the economic dispatch LP, the dual variable on the demand constraint $\\sum_i x_i = D$ is:',
    options: ['Total cost', 'The marginal cost of meeting one more MWh of demand (the clearing price)', 'Always zero', 'The number of plants'], a: 1,
    expl: 'The dual lambda of the energy balance constraint is the system marginal cost, equal to the clearing price under perfect competition.' },
  { topic: 'optimization_concepts', type: 'mc', q: 'Which is NOT one of the four KKT conditions?',
    options: ['Stationarity ($\\nabla_x L = 0$)', 'Primal feasibility', 'Strong convexity of the objective', 'Complementary slackness'], a: 2,
    expl: 'KKT: stationarity, primal feasibility, dual feasibility, complementary slackness. Strong convexity is not a KKT condition (though it guarantees uniqueness).' },
  { topic: 'optimization_concepts', type: 'mc', q: 'Unit commitment differs from economic dispatch by including:',
    options: ['Renewable plants', 'Integer on/off variables and start-up costs', 'A CO2 constraint', 'Network losses'], a: 1,
    expl: 'Economic dispatch is an LP (continuous output). Unit commitment is a MILP (integer commitment, start-up costs, minimum run times).' },
  { topic: 'optimization_concepts', type: 'numeric', q: 'Plants with marginal costs 30, 50, 80 EUR/MWh and capacities 100, 100, 100 MW. Demand = 220 MWh. Clearing price (EUR/MWh)?', a: 80, tol: 0.5,
    expl: 'Cheapest 100 MWh @ 30, next 100 MWh @ 50, last 20 MWh @ 80. Marginal accepted plant sets the price = 80 EUR/MWh.' },

  // FINANCE / LCOE
  { topic: 'finance_lcoe', type: 'numeric', q: 'A project: -100 at t=0, +60 at t=1, +70 at t=2. Discount rate 10 per cent. NPV (to 1 decimal)?', a: 12.4, tol: 0.2,
    expl: 'NPV = -100 + 60/1.1 + 70/1.21 = -100 + 54.55 + 57.85 = 12.40.' },
  { topic: 'finance_lcoe', type: 'mc', q: 'LCOE is most sensitive to changes in:',
    options: ['Project location', 'Discount rate (for capital-intensive techs) and capacity factor', 'O&M cost', 'Currency'], a: 1,
    expl: 'LCOE rises sharply with the discount rate for capital-intensive technologies (nuclear, offshore wind). It scales roughly inversely with capacity factor.' },
  { topic: 'finance_lcoe', type: 'mc', q: 'The LCOE numerator and denominator both have time horizons. Why discount both?',
    options: ['It is a regulatory requirement', 'To put future costs and future energy on the same present-value basis, so the ratio is in consistent units', 'Only the numerator should be discounted', 'Only the denominator should be discounted'], a: 1,
    expl: 'Both costs and energy are discounted at the same rate. Discounting only one side gives a number with no economic meaning. The discounted denominator is sometimes called the "discounted energy".' },
  { topic: 'finance_lcoe', type: 'numeric', q: 'A wind farm: 1000 EUR/kW capex, 25-year life, capacity factor 35 per cent, no fuel cost, O&M 25 EUR/kW/year, discount rate 5 per cent. Approximate LCOE (EUR/MWh, to nearest 5)?', a: 31, tol: 5,
    expl: 'Annualised capex factor (5%, 25y) = 0.071. Annual capex = 1000 x 0.071 = 71 EUR/kW. Total annual = 71 + 25 = 96 EUR/kW. Annual energy = 0.35 x 8760 = 3066 kWh/kW = 3.066 MWh/kW. LCOE ~ 96 / 3.066 ~ 31 EUR/MWh. (Real-world ranges are wider; this is the textbook calculation.)' },
  { topic: 'finance_lcoe', type: 'numeric', q: 'E5 Q1: 100 EUR available at start of 2021, 8.6 per cent interest. Value at start of 2031 (to nearest EUR)?', a: 229, tol: 2,
    expl: 'FV = 100 x (1.086)^10 = 100 x 2.285 = 228.5 EUR. Round to 229.' },
  { topic: 'finance_lcoe', type: 'numeric', q: 'E5 Q2: 150,000 EUR loan, 20-year annuity, 11 per cent. Annual payment (to nearest 100)?', a: 18830, tol: 200,
    expl: 'A = P r (1+r)^n / [(1+r)^n - 1] = 150000 x 0.11 x 8.062 / 7.062 ~ 18830 EUR/year.' },

  // MULTI COMMODITY (L18)
  { topic: 'multi_commodity', type: 'mc', q: 'Power-to-Gas through electrolysis plus methanation produces:',
    options: ['Electricity', 'Hydrogen, then synthetic methane (CH4) if methanation follows', 'Liquid fuels only', 'Heat only'], a: 1,
    expl: 'Electrolysis splits water into H2 and O2. The optional methanation step (Sabatier reaction) combines H2 with CO2 to make CH4 (synthetic natural gas).' },
  { topic: 'multi_commodity', type: 'mc', q: 'Typical round-trip electricity-to-electricity efficiency via Power-to-Gas-to-power is:',
    options: ['90 per cent', '60-70 per cent', '20-30 per cent', '5 per cent'], a: 2,
    expl: 'Each step has losses: electrolysis 60-80 per cent, methanation 80 per cent, gas-fired conversion back to electricity 50-60 per cent. Product is around 25 per cent.' },
  { topic: 'multi_commodity', type: 'mc', q: 'Why does PtG make sense despite low round-trip efficiency?',
    options: ['It is mandated by law', 'It absorbs surplus renewable electricity at near-zero opportunity cost and can stack reserve revenue', 'It is cheaper than batteries in all cases', 'It avoids the need for any other storage'], a: 1,
    expl: 'The economic case is not efficiency but capturing low-price hours of surplus RES and providing fast-frequency and primary reserve services on top.' },
  { topic: 'multi_commodity', type: 'mc', q: 'An electrolyser plays which role in the power system?',
    options: ['Generator only', 'Controllable load that can provide fast frequency reserve and primary reserve', 'Reactive power compensator', 'Black-start capability only'], a: 1,
    expl: 'An electrolyser is a flexible electrical load; PEM technology can ramp from 0 to 100 per cent within a minute, so it can act as fast-frequency and primary reserve.' },
  { topic: 'multi_commodity', type: 'mc', q: 'A heat pump achieves an effective COP of 4. Compared to a resistive heater (COP 1), 1 MWh of electricity delivers:',
    options: ['1 MWh of heat', '2 MWh of heat', '4 MWh of heat', '0.25 MWh of heat'], a: 2,
    expl: 'COP = useful heat / electricity input. A heat pump at COP 4 delivers 4 MWh of heat from 1 MWh of electricity.' },

  // COURSE OPTIMIZATION EXERCISE
  { topic: 'course_optim_exercise', type: 'mc', q: 'In the course Optimization.xlsx, the decision variable is:',
    options: ['Continuous TWh produced by each plant type', 'Integer number of units of each plant type', 'A binary build/not-build flag', 'The CO2 cap'], a: 1,
    expl: 'The Units column (F4:F13) is the decision variable: an integer number of units of each plant type, bounded by the min and max in rows 18-27.' },
  { topic: 'course_optim_exercise', type: 'numeric', q: 'EPR-1600 reactor: capacity 1600 MW, AF 0.85, 1 unit. Annual production (TWh, to 1 decimal)?', a: 11.9, tol: 0.1,
    expl: 'E = 1600 x 0.85 x 8760 / 10^6 = 11.91 TWh/year.' },
  { topic: 'course_optim_exercise', type: 'numeric', q: 'Coal Black PCC at 800 MW, AF 0.85, emission factor 0.9 tCO2/MWh, 5 units. CO2 emissions (kt/year, to nearest 100)?', a: 26800, tol: 500,
    expl: 'E_total = 5 x 800 x 0.85 x 8760 / 10^6 = 29.78 TWh. CO2 = 29.78 x 1000 x 0.9 = 26,805 kt/year.' },
  { topic: 'course_optim_exercise', type: 'mc', q: 'The CO2 cap in the workbook (H24) is set to:',
    options: ['5,000 kt/year', '50,000 kt/year', '500,000 kt/year', 'unlimited'], a: 1,
    expl: 'H24 = 50,000 kt/year. The constraint is total CO2 (H19) <= H24, which a binding cap forces the optimiser to limit coal and gas runs.' },
  { topic: 'course_optim_exercise', type: 'mc', q: 'Which Solver method should you choose for the integer-units problem?',
    options: ['GRG Nonlinear', 'Simplex LP (with integer constraints added)', 'Evolutionary', 'No method needed'], a: 1,
    expl: 'Although integer constraints make it a MILP, Excel Solver handles it under the Simplex LP option with explicit integer constraints (Add Constraint -> int).' }
];

const FLASHCARDS = [
  // ENERGY BASICS
  { topic: 'energy_basics', front: 'Define primary, secondary, final, useful energy.', back: 'Primary: in natural form (crude oil, raw gas, sunlight).<br>Secondary: output of a conversion (electricity, refined products).<br>Final: delivered to the consumer.<br>Useful: actual work or heat after end-use conversion.' },
  { topic: 'energy_basics', front: 'Formula for TPES (Eurostat naming: GAE).', back: 'TPES = Production + Imports - Exports + Stock changes - International bunkers. It is the energy available to the economy at the primary stage in a year.' },
  { topic: 'energy_basics', front: '1 Mtoe = ? TJ?', back: '41,868 TJ. Equivalently, 1 toe = 41.868 GJ.' },
  { topic: 'energy_basics', front: 'TPES vs TFC: what is the gap?', back: 'Transformation losses (refineries, power plants), energy sector own use, distribution losses, and non-energy use of feedstocks (chemicals, lubricants). Plus statistical adjustments.' },
  { topic: 'energy_basics', front: '1 TWh = ? Mtoe?', back: '0.0859845 Mtoe. (1 TWh = 3.6 PJ = 3600 TJ; 3600 / 41,868 = 0.0860.)' },
  { topic: 'energy_basics', front: 'Why does Norway have negative net electricity in TPES?', back: 'Eurostat counts electricity at the SIEC E7000 line as net of trade. Norway is a structural electricity exporter, so the entry is negative.' },

  // HISTORY
  { topic: 'history', front: 'Name the four historical energy transitions.', back: 'Biomass to coal (1750s, First Industrial Revolution); coal to oil and electricity (1880s, Second Industrial Revolution); oil to natural gas and nuclear (1950s); now: fossil to renewables and electrification (in progress).' },
  { topic: 'history', front: 'What is different about the current energy transition?', back: 'It is policy-driven (not purely cost-driven) and requires substitution rather than just addition. Historical transitions took 50-80 years; the EU net-zero target compresses this to ~30 years.' },
  { topic: 'history', front: 'Long-run pattern of fuel energy density across transitions?', back: 'Rising at every step: wood < coal < oil < gas. Renewables interrupt the trend (lower energy density per unit land), making grid integration and storage central problems.' },

  // INDICATORS PW1
  { topic: 'indicators_pw1', front: 'GDP at market price vs basic price vs factor cost.', back: 'Market: includes taxes on products (VAT) minus subsidies on products.<br>Basic: excludes taxes on products, includes production taxes/subsidies.<br>Factor cost: excludes all taxes, includes all subsidies. Only labour + capital remuneration.' },
  { topic: 'indicators_pw1', front: 'Real vs nominal GDP, formula.', back: 'Real GDP = Nominal GDP / Price Index_y x 100, where the price index is 100 in the base year. Real GDP removes inflation.' },
  { topic: 'indicators_pw1', front: 'What is GDP-PPP and when do you use it?', back: 'GDP at Purchasing Power Parity adjusts for cross-country price level differences. Always use PPP for cross-country comparisons of energy intensity, CO2/GDP, etc.' },
  { topic: 'indicators_pw1', front: 'The six PW1 indicators.', back: 'GDP per capita; TPES per capita; energy intensity (TPES/GDP-PPP); CO2 per capita; carbon intensity of energy (CO2/TPES); carbon intensity of GDP (CO2/GDP-PPP).' },
  { topic: 'indicators_pw1', front: 'Kaya identity in indicator language.', back: 'CO2 / GDP = (CO2 / TPES) x (TPES / GDP). Carbon intensity of GDP factors into carbon intensity of energy times energy intensity. Useful for decomposing emission drivers.' },
  { topic: 'indicators_pw1', front: 'What does the PW1 bubble chart show?', back: 'X-axis: energy intensity. Y-axis: TPES per capita. Bubble area: absolute TPES. Two snapshots (1990 vs latest) shown as arrows to indicate the trajectory.' },

  // TRILEMMA
  { topic: 'trilemma', front: 'The three corners of the energy trilemma.', back: 'Security of supply; affordability for consumers and industry; environmental sustainability. Every policy choice trades off along this triangle.' },
  { topic: 'trilemma', front: 'The five energy dimensions (Bompard L2).', back: 'Physical (thermodynamics, intermittency); economic (prices, externalities); environmental (GHG, pollution); geopolitical (supply concentration); social (energy poverty, just transition).' },
  { topic: 'trilemma', front: 'For a carbon tax, which corner of the trilemma improves and which tightens?', back: 'Improves sustainability (internalises CO2 externality). Tightens affordability (prices rise). Mixed on security (depends on what is incentivised).' },
  { topic: 'trilemma', front: 'For coal phase-out, which corner of the trilemma improves and which tightens?', back: 'Improves sustainability. Tightens security (loss of dispatchable capacity) and affordability (replacement cost) in the short run.' },

  // TRANSITION DRIVERS
  { topic: 'transition_drivers', front: 'IPCC AR6 remaining carbon budget for 1.5C.', back: 'About 500 GtCO2 from 2020 for a 50 per cent chance. At ~40 GtCO2/year of fossil emissions, the budget runs out around 2032-2035 absent rapid cuts.' },
  { topic: 'transition_drivers', front: 'EU 2030 climate target.', back: '55 per cent reduction in net GHG emissions vs 1990, set out in the European Climate Law and operationalised through the Fit for 55 package.' },
  { topic: 'transition_drivers', front: 'What is the EU ETS and what does it cover?', back: 'EU Emissions Trading System: a cap-and-trade market for power, energy-intensive industry, aviation, and (since 2024) maritime. Norway is included via the EEA Agreement. Price typically 60-100 EUR/tCO2 since 2022.' },
  { topic: 'transition_drivers', front: 'Three decarbonisation levers.', back: 'Energy efficiency (reduce TFC per unit of service); electrification of end uses (transport, heating, industry); decarbonisation of electricity (RES, nuclear, CCS). The third needs to run ahead of the second to avoid shifting emissions upstream.' },

  // GEOPOLITICS
  { topic: 'geopolitics', front: 'Eurostat formula for import dependency rate.', back: 'IDR = (Imports - Exports + Stock changes) / Gross Available Energy, in per cent. Positive = net importer; negative = net exporter.' },
  { topic: 'geopolitics', front: 'Shannon index formula.', back: 'H = -sum_i p_i ln(p_i), where p_i is the share of partner i. H_max = ln(n). Normalised H/H_max in [0, 1]. Higher means more diversified.' },
  { topic: 'geopolitics', front: 'Two partners with shares 50-50: Shannon and normalised value?', back: 'H = -2 x 0.5 x ln(0.5) = -2 x 0.5 x (-0.693) = 0.693. H_max = ln(2) = 0.693. Normalised = 1.0 (perfect diversification across 2).' },
  { topic: 'geopolitics', front: 'Why is Shannon not enough on its own?', back: 'A perfectly diversified import basket sourced from politically unstable countries is still risky. You need to weight partners by country risk, typically via the World Bank WGI percentile ranks.' },
  { topic: 'geopolitics', front: 'The six WGI dimensions.', back: 'Voice and Accountability; Political Stability; Government Effectiveness; Regulatory Quality; Rule of Law; Control of Corruption. Percentile ranks 0-100; OECD democracies score 80-99.' },

  // ELECTRICITY COMMODITY
  { topic: 'electricity_commodity', front: 'Three peculiarities of electricity as a commodity.', back: '1. Non-storable at scale.<br>2. Supply and demand must balance instantaneously.<br>3. The network IS the market (flows follow physical laws, not contractual paths).' },
  { topic: 'electricity_commodity', front: 'Why is electricity demand "derived"?', back: 'Consumers want light, heat, motion, cooling, data processing - not electricity itself. Demand for electricity is derived from demand for these services. This is why short-run demand is highly inelastic.' },
  { topic: 'electricity_commodity', front: 'What is the merit order?', back: 'The supply curve formed by ranking generation plants by their short-run marginal cost, cheapest first. The clearing price is set by the most expensive plant that must run to meet demand (the marginal accepted plant).' },
  { topic: 'electricity_commodity', front: 'Effect of more wind/solar on the merit order.', back: 'Adds zero-marginal-cost capacity at the bottom. Shifts the entire merit order to the right. At a given demand, the clearing price falls. Price volatility increases because the supply curve becomes steeper above the renewables.' },

  // MARKET EQUILIBRIUM
  { topic: 'market_equilibrium', front: 'Definition of market equilibrium.', back: 'The price p* and quantity q* where supply equals demand: S(p*) = D(p*). Total surplus (producer + consumer) is maximised here under perfect competition.' },
  { topic: 'market_equilibrium', front: 'Producer surplus vs consumer surplus.', back: 'Producer surplus: clearing price minus marginal cost, over accepted units. Consumer surplus: willingness to pay minus price paid, over consumed units. Geometrically, the two areas between the curves and the price line.' },
  { topic: 'market_equilibrium', front: 'How does a heat wave affect the equilibrium?', back: 'Shifts the demand curve right (higher quantity demanded at every price). Given the steep supply curve at high quantity, the clearing price rises sharply.' },

  // MARKET POWER / HHI
  { topic: 'market_power_hhi', front: 'HHI formula.', back: 'HHI = sum_i s_i^2, where s_i is the market share of firm i in per cent (0-100). Range 0-10,000. Monopoly = 10,000. Standard thresholds: < 1500 unconcentrated, 1500-2500 moderate, > 2500 highly concentrated.' },
  { topic: 'market_power_hhi', front: 'Pivotal supplier test.', back: 'A supplier is pivotal if its capacity is needed to meet demand. Without it, the system cannot clear. A pivotal supplier can set the price almost regardless of marginal cost.' },
  { topic: 'market_power_hhi', front: 'Reference market definition matters because:', back: 'A firm may be small EU-wide but pivotal in a single bidding zone or during a single peak hour. The geographical and temporal scope of the reference market changes the conclusion about market power.' },

  // MARKET CLASSIFICATION
  { topic: 'market_classification', front: 'Timescale ladder of electricity markets.', back: 'Futures (years/months) -> Day-ahead (~noon previous day) -> Intraday (minutes to hours before delivery) -> Balancing (real time) -> Ancillary services (continuous). Capacity markets sit aside, paying for MW availability years ahead.' },
  { topic: 'market_classification', front: 'What is SDAC?', back: 'Single Day-Ahead Coupling: the algorithm (EUPHEMIA) that clears all European day-ahead markets simultaneously at noon CET, respecting interconnection capacities. Solves a MILP.' },
  { topic: 'market_classification', front: 'Missing money problem and capacity markets.', back: 'Energy-only markets reward MWh delivered; they can fail to incentivise capacity needed only for rare peaks. Capacity markets pay MW availability separately, solving the missing money problem. France, UK, Italy, Belgium have one.' },
  { topic: 'market_classification', front: 'What are ancillary services?', back: 'Services beyond bulk energy: frequency response (primary/secondary/tertiary reserves), voltage support (reactive power), black-start capability, network stability. Procured by the TSO via dedicated markets.' },

  // BIDDING & CLEARING
  { topic: 'bidding_clearing', front: 'Uniform vs pay-as-bid pricing.', back: 'Uniform: all accepted bidders are paid the marginal accepted price. The European standard; bidders bid true marginal cost. Pay-as-bid: each bidder is paid their own bid; bidders shade upward toward the expected price.' },
  { topic: 'bidding_clearing', front: 'How is the clearing price set?', back: 'It is the price of the marginal accepted bid - the most expensive supply bid that has to run to meet demand. Equivalent to the intersection of the cumulative supply and cumulative demand curves.' },
  { topic: 'bidding_clearing', front: 'Block bid vs simple bid.', back: 'Simple: single price-quantity pair, accepted or rejected hour by hour. Block: all-or-nothing across multiple hours. Block bids introduce non-convexities, which is why EUPHEMIA is a MILP rather than an LP.' },

  // NETWORK / LMP
  { topic: 'network_clearing', front: 'LMP decomposition.', back: 'LMP_i = energy price (lambda) + congestion component (mu_i^cong) + loss component (mu_i^loss). The congestion component is nonzero only on or near congested lines.' },
  { topic: 'network_clearing', front: 'Nodal vs zonal pricing.', back: 'Nodal: each grid node has its own LMP (US: PJM, MISO, ERCOT). Zonal: one price per zone or country, transmission constraints captured between zones (Europe).' },
  { topic: 'network_clearing', front: 'DC power flow formula.', back: 'P_ij = (1/x_ij)(theta_i - theta_j). Linear approximation: |V| = 1 per unit, sin(theta) ~ theta, ignore reactive power. Gives a linear constraint suitable for LP/MILP market clearing.' },
  { topic: 'network_clearing', front: 'What is congestion rent?', back: 'When a line is congested, the LMP difference across it times the flow is collected by the TSO. In Europe, congestion rents are typically reinvested in grid expansion or refunded to consumers.' },

  // OPTIMIZATION
  { topic: 'optimization_concepts', front: 'LP standard form.', back: 'min c^T x s.t. Ax = b, x >= 0. The feasible set is the polyhedron {x >= 0 : Ax = b}. The optimum (if finite) is attained at a vertex; the simplex method walks the vertices.' },
  { topic: 'optimization_concepts', front: 'The four KKT conditions.', back: '1. Stationarity (grad_x L = 0).<br>2. Primal feasibility.<br>3. Dual feasibility (lambda >= 0 on inequality multipliers).<br>4. Complementary slackness (lambda_i * f_i(x) = 0).' },
  { topic: 'optimization_concepts', front: 'In economic dispatch, what is the meaning of the dual variable on the demand constraint?', back: 'It is the marginal cost of meeting one more MWh of demand - the system marginal cost. Under perfect competition, this equals the market clearing price.' },
  { topic: 'optimization_concepts', front: 'Economic dispatch vs unit commitment.', back: 'Economic dispatch: continuous output, LP. Quick. Unit commitment: integer on/off variables, start-up costs, minimum run/down times; MILP. Slower, but reflects reality of thermal plants.' },
  { topic: 'optimization_concepts', front: 'What does complementary slackness tell you operationally?', back: 'Either a plant is at full capacity (and earns inframarginal rent, dual > 0) or it is below capacity (and dual = 0, paid exactly its marginal cost). Plants not running have marginal cost above the clearing price.' },

  // FINANCE / LCOE
  { topic: 'finance_lcoe', front: 'NPV formula.', back: 'NPV = sum_{t=0}^T CF_t / (1+r)^t. Decision rule: accept the project if NPV > 0.' },
  { topic: 'finance_lcoe', front: 'IRR definition and pitfall.', back: 'IRR is the discount rate r such that NPV(r) = 0. Accept if IRR > hurdle. Pitfall: IRR can be non-unique if cash flows change sign multiple times; do not use it alone to rank mutually exclusive projects.' },
  { topic: 'finance_lcoe', front: 'LCOE formula.', back: 'LCOE = sum_t (Capex_t + OM_t + Fuel_t + Carbon_t)/(1+r)^t / sum_t E_t/(1+r)^t. Both numerator (lifetime costs) and denominator (lifetime energy) are discounted at the same rate r. Units: EUR/MWh.' },
  { topic: 'finance_lcoe', front: 'Why is LCOE sensitive to the discount rate?', back: 'Capital costs are paid upfront; energy is produced over decades. A higher discount rate inflates the present cost of capex relative to the present value of future energy, so LCOE rises - especially for capital-intensive technologies like nuclear and offshore wind.' },
  { topic: 'finance_lcoe', front: 'LCOE and capacity factor: relationship?', back: 'LCOE scales roughly inversely with capacity factor (the denominator is lifetime MWh). A 30 per cent CF wind turbine has roughly 1.5x the LCOE of an identical 45 per cent CF turbine.' },
  { topic: 'finance_lcoe', front: 'What does LCOE not capture?', back: 'It treats every MWh as equivalent. A MWh of solar at noon is worth less than a MWh of dispatchable power at peak. System LCOE and value-adjusted LCOE attempt to correct for time-of-delivery value, but pure LCOE remains a screening metric, not a full economic ranking.' },
  { topic: 'finance_lcoe', front: 'Annuity formula (E5 case).', back: 'A = P r (1+r)^n / [(1+r)^n - 1], where P is the principal, r the periodic rate, n the number of periods. Each payment covers interest + a slice of principal; the slice grows over time.' },
  { topic: 'finance_lcoe', front: 'Profitability index PI - definition and decision rule.', back: 'PI = (NPV + initial outlay) / initial outlay = PV of future cash flows / initial outlay. Accept if PI > 1. Useful as a tiebreaker when capital is constrained, or to rank projects of different scale.' },
  { topic: 'finance_lcoe', front: 'Real vs nominal interest rate (Fisher).', back: '(1 + r_nominal) = (1 + r_real)(1 + inflation). For small rates, r_real ~ r_nominal - inflation. To compare across years with different price levels, deflate cash flows or use the real rate consistently.' },

  // MULTI COMMODITY
  { topic: 'multi_commodity', front: 'What is "sector coupling"?', back: 'Integrating electricity with heat, gas, hydrogen and transport so that surplus renewable power can be absorbed and used in those sectors, and so that demand can shift across carriers. The bridge of the energy transition.' },
  { topic: 'multi_commodity', front: 'Power-to-X: what does X stand for?', back: 'Any non-electric energy carrier produced from electricity input. Common X: heat (heat pumps), hydrogen (electrolysis), gas (methanation), liquid fuels (methanol/ammonia), chemicals.' },
  { topic: 'multi_commodity', front: 'Two-step Power-to-Gas chain.', back: '1) Electrolysis: 2 H2O + electricity -> 2 H2 + O2. Efficiency 60-80 per cent LHV (alkaline, PEM, SOEC).<br>2) Methanation (Sabatier): CO2 + 4 H2 -> CH4 + 2 H2O. Efficiency around 80 per cent.<br>Combined: about 50-65 per cent power-to-methane.' },
  { topic: 'multi_commodity', front: 'Why does Power-to-Gas make economic sense despite low round-trip efficiency?', back: 'It absorbs surplus renewable electricity at near-zero opportunity cost (during curtailment), provides fast frequency/primary reserve services for additional revenue, and feeds the existing gas grid as a long-duration storage path.' },
  { topic: 'multi_commodity', front: 'PEM electrolyser ramp rate - why does it matter?', back: 'PEM can ramp from 0 to 100 per cent in under a minute. That makes the electrolyser a controllable load suitable for fast frequency response and primary reserve, stacking revenue on top of hydrogen sales.' },
  { topic: 'multi_commodity', front: 'Heat pump COP - what does it mean?', back: 'COP = useful heat output / electricity input. Modern heat pumps deliver 3-5 units of heat per unit of electricity by moving heat from a cold reservoir to a warm one. Resistive heaters have COP = 1.' },
  { topic: 'multi_commodity', front: 'How does district heating couple to the electricity system?', back: 'Via CHP plants (joint electricity + heat at 85-90 per cent overall efficiency), large heat pumps drawing from the grid, electric boilers absorbing surplus power, and thermal storage that shifts heat demand across hours or seasons.' },

  // COURSE OPTIM EXERCISE
  { topic: 'course_optim_exercise', front: 'The course Optimization.xlsx - decision variable.', back: 'Integer number of units n_i of each plant type i, bounded by min and max units per technology. Not continuous TWh, not binary flags. This matches the PW Section 8 brief "constraints on the number of plants".' },
  { topic: 'course_optim_exercise', front: 'Annual production per plant type (formula).', back: 'E_i = P_i x AF_i x 8760 x n_i / 10^6 [TWh/year]. The 8760 is hours in a year; the /10^6 converts MWh to TWh.' },
  { topic: 'course_optim_exercise', front: 'Annual CO2 per plant type (formula).', back: 'CO2_i = f_i x E_i x 1000 [kt CO2/year], where f_i is emission factor in tCO2/MWh and E_i is annual production in TWh. The factor 1000 comes from TWh -> MWh -> tCO2 -> kt.' },
  { topic: 'course_optim_exercise', front: 'Constraints in the course exercise.', back: '1) Total production >= 150 TWh/year (demand floor).<br>2) Total CO2 <= 50,000 kt/year (env cap).<br>3) Min <= units of each type <= Max (technology-specific).<br>4) RES penetration constraint optional.' },
  { topic: 'course_optim_exercise', front: 'Solver setup checklist for the course exercise.', back: 'Objective cell: H18 (Total cost). Min. Changing cells: F4:F13 (Units, integer). Constraints: H17 >= H25, H19 <= H24, F4:F13 between min and max (rows 18-27), F4:F13 = int. Solving method: Simplex LP with explicit integer constraints.' },
  { topic: 'course_optim_exercise', front: 'Connecting the course exercise to PW Section 8.', back: 'Use the same template for your country. Fix n_i = 0 for technologies the country does not have (Norway has no nuclear). Set max n_i to the resource ceiling (Norway: 30 GW offshore wind by 2040 = ~25 units of 1200 MW each, etc.). Keep LCOE and emission factors realistic for the country.' }
];

const state = {
  view: 'plan',
  currentTopic: TOPICS[0].id,
  completed: new Set(),
  quizFilter: 'all',
  quizIdx: 0,
  quizAnswered: new Map(),
  quizCorrect: 0,
  quizWrong: 0,
  flashFilter: 'all',
  flashIdx: 0,
  flashFlipped: false,
  flashAnswered: new Map(),
};

function renderPlan() {
  const grids = { fundamentals: '', transition: '', markets: '', optfin: '', coupling: '' };
  TOPICS.forEach(t => {
    const checked = state.completed.has(t.id);
    const priClass = t.priority === 'new' ? 'priority-new' : (t.priority === 'core' ? 'priority-core' : 'priority-light');
    const priLabel = t.priority === 'new' ? 'NEW' : (t.priority === 'core' ? 'CORE' : 'REVIEW');
    grids[t.phase] += `
      <div class="topic-card" data-topic="${t.id}">
        <div class="topic-card-head">
          <span class="topic-priority ${priClass}">${priLabel}</span>
          <div class="topic-checkbox ${checked ? 'checked' : ''}" data-check="${t.id}"></div>
        </div>
        <h3>${t.title}</h3>
        <div class="topic-desc">${t.desc}</div>
        <div class="topic-actions">
          <a data-read="${t.id}">&#128214; Read</a>
          <a data-quiz="${t.id}">&#127919; Quiz</a>
        </div>
      </div>`;
  });
  PHASES.forEach(p => { document.getElementById(p.grid).innerHTML = grids[p.key]; });
  document.getElementById('progress-num').textContent = `${state.completed.size}/${TOPICS.length}`;

  document.querySelectorAll('[data-check]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const id = el.dataset.check;
      if (state.completed.has(id)) state.completed.delete(id);
      else state.completed.add(id);
      renderPlan();
    });
  });
  document.querySelectorAll('[data-read]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      switchView('read');
      selectTopic(el.dataset.read);
    });
  });
  document.querySelectorAll('[data-quiz]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      switchView('quiz');
      document.getElementById('quiz-filter').value = el.dataset.quiz;
      state.quizFilter = el.dataset.quiz;
      resetQuizPosition();
      renderQuiz();
    });
  });
  document.querySelectorAll('.topic-card').forEach(el => {
    el.addEventListener('click', () => {
      switchView('read');
      selectTopic(el.dataset.topic);
    });
  });
}

function renderRead() {
  let sidebarHtml = PHASES.map(p => `
    <div class="sidebar-section">
      <div class="sidebar-label">${p.label}</div>
      ${TOPICS.filter(t => t.phase === p.key).map(t =>
        `<a class="sidebar-link ${state.currentTopic === t.id ? 'active' : ''}" data-link="${t.id}">${t.title.replace(/&amp;/g,'&')}</a>`).join('')}
    </div>`).join('');
  document.getElementById('sidebar').innerHTML = sidebarHtml;
  document.querySelectorAll('[data-link]').forEach(el => {
    el.addEventListener('click', () => selectTopic(el.dataset.link));
  });

  const c = CONTENT[state.currentTopic];
  if (!c) {
    document.getElementById('read-content').innerHTML = '<p>Pick a topic from the sidebar.</p>';
    return;
  }
  document.getElementById('read-content').innerHTML = `
    <section class="topic-section active">
      <h2>${c.title}</h2>
      <div class="lead">${c.lead}</div>
      ${c.body}
    </section>
  `;
  if (window.renderMathInElement) {
    renderMathInElement(document.getElementById('read-content'), {
      delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
      throwOnError: false
    });
  }
  document.getElementById('read-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectTopic(id) {
  state.currentTopic = id;
  renderRead();
}

function renderQuizFilter() {
  const sel = document.getElementById('quiz-filter');
  sel.innerHTML = '<option value="all">All topics</option>' +
    TOPICS.map(t => `<option value="${t.id}">${t.title.replace(/&amp;/g, '&')}</option>`).join('');
  sel.value = state.quizFilter;
}

function getQuizQuestions() {
  if (state.quizFilter === 'all') return QUIZ;
  return QUIZ.filter(q => q.topic === state.quizFilter);
}

function resetQuizPosition() { state.quizIdx = 0; }

function renderQuiz() {
  const questions = getQuizQuestions();
  const total = questions.length;
  const idx = Math.min(state.quizIdx, total - 1);
  document.getElementById('stat-correct').textContent = state.quizCorrect;
  document.getElementById('stat-wrong').textContent = state.quizWrong;
  document.getElementById('stat-total').textContent = state.quizCorrect + state.quizWrong;
  document.getElementById('stat-max').textContent = total;
  document.getElementById('progress-bar').style.width = `${total === 0 ? 0 : (idx + 1) / total * 100}%`;

  const container = document.getElementById('quiz-container');
  if (total === 0) {
    container.innerHTML = `<div class="quiz-empty"><h3>No questions for this topic yet.</h3><p>Pick "All topics" or another topic.</p></div>`;
    return;
  }

  const q = questions[idx];
  const topicTitle = (TOPICS.find(t => t.id === q.topic)?.title || '').replace(/&amp;/g, '&');
  const answered = state.quizAnswered.get(quizKey(q));

  let optionsHtml = '';
  if (q.type === 'mc') {
    optionsHtml = q.options.map((opt, i) => {
      let cls = 'quiz-option';
      if (answered) {
        if (i === q.a) cls += ' correct';
        else if (i === answered.choice) cls += ' wrong';
      }
      return `<button class="${cls}" data-choice="${i}" ${answered ? 'disabled' : ''}>
                <span class="marker">${String.fromCharCode(65+i)}</span>
                <span>${opt}</span>
              </button>`;
    }).join('');
  } else {
    optionsHtml = `
      <div class="quiz-input-wrap">
        <input type="text" class="quiz-input" id="num-input" placeholder="Enter a number..." ${answered ? 'disabled' : ''} value="${answered ? answered.choice : ''}">
        <button class="quiz-submit" id="num-submit" ${answered ? 'disabled' : ''}>Submit</button>
      </div>`;
  }

  let feedbackHtml = '';
  if (answered) {
    const correctValue = q.type === 'mc' ? `${String.fromCharCode(65 + q.a)}: ${q.options[q.a]}` : q.a;
    feedbackHtml = `
      <div class="quiz-feedback ${answered.correct ? 'correct' : 'wrong'}">
        <div class="verdict">${answered.correct ? '✓ Correct.' : '✗ Not quite.'}</div>
        <p>${q.expl}</p>
        ${!answered.correct ? `<div class="answer-box">Correct answer: ${correctValue}</div>` : ''}
      </div>`;
  }

  container.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-card-head">
        <span class="quiz-q-num">No. ${idx + 1} / ${total}</span>
        <span class="quiz-q-topic">${topicTitle}</span>
      </div>
      <div class="quiz-question"><p>${q.q}</p></div>
      <div class="quiz-options">${optionsHtml}</div>
      ${feedbackHtml}
      <div class="quiz-nav">
        <button class="quiz-nav-btn" id="prev-q" ${idx === 0 ? 'disabled' : ''}>&larr; Previous</button>
        <button class="quiz-nav-btn" id="next-q" ${idx === total - 1 ? 'disabled' : ''}>Next &rarr;</button>
      </div>
    </div>
  `;

  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
      throwOnError: false
    });
  }

  if (q.type === 'mc') {
    document.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = parseInt(btn.dataset.choice);
        const correct = choice === q.a;
        state.quizAnswered.set(quizKey(q), { choice, correct });
        if (correct) state.quizCorrect++; else state.quizWrong++;
        renderQuiz();
      });
    });
  } else {
    const input = document.getElementById('num-input');
    const submit = document.getElementById('num-submit');
    const submitFn = () => {
      const val = parseFloat(input.value.replace(',', '.'));
      if (isNaN(val)) return;
      const correct = Math.abs(val - q.a) <= q.tol;
      state.quizAnswered.set(quizKey(q), { choice: val, correct });
      if (correct) state.quizCorrect++; else state.quizWrong++;
      renderQuiz();
    };
    submit?.addEventListener('click', submitFn);
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') submitFn(); });
    input?.focus();
  }

  document.getElementById('prev-q')?.addEventListener('click', () => {
    if (state.quizIdx > 0) { state.quizIdx--; renderQuiz(); }
  });
  document.getElementById('next-q')?.addEventListener('click', () => {
    if (state.quizIdx < total - 1) { state.quizIdx++; renderQuiz(); }
  });
}

function quizKey(q) { return `${q.topic}:${q.q}`; }

function renderFlashFilter() {
  const sel = document.getElementById('flash-filter');
  if (!sel) return;
  sel.innerHTML = '<option value="all">All topics</option>' +
    TOPICS.map(t => `<option value="${t.id}">${t.title.replace(/&amp;/g, '&')}</option>`).join('');
  sel.value = state.flashFilter;
}

function getFlashCards() {
  if (state.flashFilter === 'all') return FLASHCARDS;
  return FLASHCARDS.filter(c => c.topic === state.flashFilter);
}

function flashKey(card) { return `${card.topic}:${card.front}`; }

function renderFlash() {
  const cards = getFlashCards();
  const total = cards.length;
  const idx = total === 0 ? 0 : Math.min(state.flashIdx, total - 1);

  let knowCount = 0, dontCount = 0;
  cards.forEach(c => {
    const v = state.flashAnswered.get(flashKey(c));
    if (v === 'know') knowCount++;
    else if (v === 'dontknow') dontCount++;
  });
  const remaining = total - knowCount - dontCount;
  document.getElementById('flash-know').textContent = knowCount;
  document.getElementById('flash-dontknow').textContent = dontCount;
  document.getElementById('flash-remaining').textContent = remaining;
  document.getElementById('flash-progress-bar').style.width =
    total === 0 ? '0%' : `${((knowCount + dontCount) / total) * 100}%`;

  if (total === 0) {
    document.getElementById('flash-front').textContent = 'No cards for this topic.';
    document.getElementById('flash-back').textContent = '—';
    document.getElementById('flash-num').textContent = '0/0';
    document.getElementById('flash-num-b').textContent = '0/0';
    document.getElementById('flash-topic').textContent = '—';
    document.getElementById('flash-topic-b').textContent = '—';
    return;
  }

  const card = cards[idx];
  const topicTitle = (TOPICS.find(t => t.id === card.topic)?.title || '').replace(/&amp;/g, '&');
  document.getElementById('flash-num').textContent = `No. ${idx + 1}/${total}`;
  document.getElementById('flash-num-b').textContent = `No. ${idx + 1}/${total}`;
  document.getElementById('flash-topic').textContent = topicTitle;
  document.getElementById('flash-topic-b').textContent = topicTitle;
  document.getElementById('flash-front').innerHTML = card.front;
  document.getElementById('flash-back').innerHTML = card.back;

  const cardEl = document.getElementById('flash-card');
  cardEl.classList.toggle('flipped', state.flashFlipped);

  if (window.renderMathInElement) {
    setTimeout(() => {
      try {
        renderMathInElement(document.getElementById('flash-front'), {
          delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
          throwOnError: false
        });
        renderMathInElement(document.getElementById('flash-back'), {
          delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
          throwOnError: false
        });
      } catch (e) { console.error('KaTeX render error:', e); }
    }, 0);
  }

  document.getElementById('flash-prev').disabled = idx === 0;
  document.getElementById('flash-next').disabled = idx === total - 1;

  const ans = state.flashAnswered.get(flashKey(card));
  document.getElementById('flash-yes').style.opacity = ans === 'know' ? '0.5' : '1';
  document.getElementById('flash-no').style.opacity = ans === 'dontknow' ? '0.5' : '1';
}

function switchView(name) {
  state.view = name;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${name}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === name);
  });
  if (name === 'read') renderRead();
  if (name === 'quiz') renderQuiz();
  if (name === 'flash') renderFlash();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPlan();
  renderQuizFilter();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.getElementById('quiz-filter').addEventListener('change', e => {
    state.quizFilter = e.target.value;
    resetQuizPosition();
    renderQuiz();
  });

  document.getElementById('quiz-reset').addEventListener('click', () => {
    state.quizAnswered.clear();
    state.quizCorrect = 0;
    state.quizWrong = 0;
    state.quizIdx = 0;
    renderQuiz();
  });

  renderFlashFilter();

  document.getElementById('flash-filter').addEventListener('change', e => {
    state.flashFilter = e.target.value;
    state.flashIdx = 0;
    state.flashFlipped = false;
    renderFlash();
  });

  document.getElementById('flash-card').addEventListener('click', () => {
    state.flashFlipped = !state.flashFlipped;
    document.getElementById('flash-card').classList.toggle('flipped');
  });

  document.getElementById('flash-prev').addEventListener('click', () => {
    if (state.flashIdx > 0) {
      state.flashIdx--;
      state.flashFlipped = false;
      renderFlash();
    }
  });

  document.getElementById('flash-next').addEventListener('click', () => {
    const total = getFlashCards().length;
    if (state.flashIdx < total - 1) {
      state.flashIdx++;
      state.flashFlipped = false;
      renderFlash();
    }
  });

  document.getElementById('flash-yes').addEventListener('click', e => {
    e.stopPropagation();
    const cards = getFlashCards();
    if (cards.length === 0) return;
    state.flashAnswered.set(flashKey(cards[state.flashIdx]), 'know');
    if (state.flashIdx < cards.length - 1) {
      state.flashIdx++;
      state.flashFlipped = false;
    }
    renderFlash();
  });

  document.getElementById('flash-no').addEventListener('click', e => {
    e.stopPropagation();
    const cards = getFlashCards();
    if (cards.length === 0) return;
    state.flashAnswered.set(flashKey(cards[state.flashIdx]), 'dontknow');
    if (state.flashIdx < cards.length - 1) {
      state.flashIdx++;
      state.flashFlipped = false;
    }
    renderFlash();
  });

  document.getElementById('flash-reset').addEventListener('click', () => {
    state.flashAnswered.clear();
    state.flashIdx = 0;
    state.flashFlipped = false;
    renderFlash();
  });
});
