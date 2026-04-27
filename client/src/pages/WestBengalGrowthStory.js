import React, { useState } from "react";

// ── Reusable primitives ──────────────────────────────────────────────────────

const StatCard = ({ value, label, color = "text-amber-400" }) => (
  <div className="bg-[#0f2345] border border-blue-900 rounded-2xl p-5 flex flex-col items-center text-center">
    <span className={`text-3xl sm:text-4xl font-extrabold ${color}`}>{value}</span>
    <span className="text-gray-300 text-xs sm:text-sm mt-2 leading-snug">{label}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-1">{children}</h2>
);

const SectionSource = ({ children }) => (
  <p className="text-xs text-blue-300 mb-5 italic">{children}</p>
);

const HBar = ({ label, value, max, highlight = false, unit = "", lowerBetter = false }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className={`w-32 sm:w-40 text-xs sm:text-sm text-right shrink-0 ${highlight ? "text-teal-300 font-bold" : "text-gray-300"}`}>
        {label}
      </span>
      <div className="flex-1 bg-blue-950 rounded-full h-5 overflow-hidden">
        <div
          className={`h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700 ${
            highlight
              ? "bg-teal-500"
              : lowerBetter
              ? "bg-red-500"
              : "bg-slate-500"
          }`}
          style={{ width: `${pct}%` }}
        >
          <span className="text-white text-xs font-semibold">{value}{unit}</span>
        </div>
      </div>
    </div>
  );
};

const VBar = ({ label, value, max, highlight = false, unit = "" }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs sm:text-sm font-bold text-white">{value}{unit}</span>
      <div className="w-10 sm:w-14 bg-blue-950 rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: 120 }}>
        <div
          className={`w-full rounded-t-lg ${highlight ? "bg-teal-500" : "bg-slate-500"}`}
          style={{ height: `${pct}%` }}
        />
      </div>
      <span className={`text-xs text-center leading-tight mt-1 ${highlight ? "text-teal-300 font-bold" : "text-gray-400"}`}>
        {label}
      </span>
    </div>
  );
};

const Pill = ({ children, color = "bg-teal-700 text-teal-100" }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{children}</span>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-[#0a1c3a] border border-blue-900 rounded-2xl p-5 ${className}`}>{children}</div>
);

// ── Nav tabs ─────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "economy", label: "Economy" },
  { id: "employment", label: "Jobs" },
  { id: "healthcare", label: "Health" },
  { id: "social", label: "Social" },
  { id: "agriculture", label: "Agri" },
  { id: "industry", label: "Industry" },
  { id: "tech", label: "Tech" },
  { id: "logistics", label: "Logistics" },
];

// ── Main page ─────────────────────────────────────────────────────────────────

const WestBengalGrowthStory = () => {
  const [active, setActive] = useState("economy");

  const scrollTo = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#071428] text-white font-sans">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#0a1c3a] to-[#071428] px-4 py-10 sm:py-16 text-center border-b border-blue-900">
        <div className="inline-block bg-amber-400 text-[#071428] text-xs font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-widest">
          2011 – 2026 · Data-Driven Assessment
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-2">
          West Bengal
        </h1>
        <p className="text-amber-400 text-lg sm:text-2xl italic font-semibold mb-8">
          The Inclusive Growth Story
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <StatCard value="6th" label="Largest Economy in India" color="text-amber-400" />
          <StatCard value="~5×" label="Growth in Tax Revenue" color="text-green-400" />
          <StatCard value="3.6%" label="Unemployment Rate" color="text-teal-400" />
          <StatCard value="#2" label="MSME State in India" color="text-purple-400" />
        </div>
        <p className="text-blue-400 text-xs mt-6 italic">
          Sources: RBI · NSSO/PLFS · ASI · MCA · NFHS-5 · CBHI · NCRB · JLL / Knight Frank
        </p>
      </div>

      {/* ── Sticky section nav ── */}
      <div className="sticky top-0 z-20 bg-[#071428] border-b border-blue-900 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                active === s.id
                  ? "bg-amber-400 text-[#071428]"
                  : "bg-blue-900 text-gray-300 hover:bg-blue-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-16">

        {/* ══ ECONOMY ══ */}
        <section id="economy">
          <SectionTitle>Economy &amp; GSDP Growth</SectionTitle>
          <SectionSource>Source: RBI State Finances | GSDP figures in ₹ lakh crore</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <StatCard value="₹18.5 L Cr" label="GSDP 2026 (est.)" color="text-teal-400" />
            <StatCard value="4.1×" label="Growth since 2011" color="text-amber-400" />
            <StatCard value="6th" label="Largest Economy in India" color="text-purple-400" />
          </div>

          <Card>
            <p className="text-sm text-gray-400 mb-4">GSDP in ₹ Lakh Crore — State Comparison</p>
            {[
              { label: "Maharashtra", value: 42, highlight: false },
              { label: "Tamil Nadu", value: 29, highlight: false },
              { label: "Gujarat", value: 26, highlight: false },
              { label: "Karnataka", value: 25, highlight: false },
              { label: "Uttar Pradesh", value: 24, highlight: false },
              { label: "West Bengal ★", value: 19, highlight: true },
            ].map((d) => (
              <HBar key={d.label} {...d} max={45} unit=" L Cr" />
            ))}
          </Card>

          <div className="mt-6">
            <Card>
              <p className="text-sm text-gray-400 mb-5">Tax Revenue Growth (₹ Crore)</p>
              <div className="relative">
                {/* Y-axis labels */}
                <div className="flex">
                  <div className="w-20 shrink-0" />
                  <div className="flex-1">
                    {/* Timeline bar chart */}
                    <div className="flex items-end gap-2 sm:gap-4 h-36 sm:h-48">
                      {[
                        { year: "2011", value: 45000 },
                        { year: "2015", value: 68000 },
                        { year: "2018", value: 93000 },
                        { year: "2020", value: 103000 },
                        { year: "2022", value: 110000 },
                        { year: "2025", value: 200000 },
                        { year: "2026", value: 220000 },
                      ].map((d) => {
                        const pct = (d.value / 220000) * 100;
                        return (
                          <div key={d.year} className="flex flex-col items-center flex-1 gap-1">
                            <span className="text-xs text-teal-300 font-bold">
                              {d.value >= 100000
                                ? `₹${(d.value / 100000).toFixed(1)}L`
                                : `₹${Math.round(d.value / 1000)}K`}
                            </span>
                            <div className="w-full bg-blue-950 rounded-t-md overflow-hidden flex flex-col justify-end" style={{ height: 100 }}>
                              <div
                                className="w-full bg-teal-500 rounded-t-md"
                                style={{ height: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{d.year}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill color="bg-blue-900 text-blue-200">~10–11% CAGR</Pill>
                <Pill color="bg-blue-900 text-blue-200">Similar to Gujarat</Pill>
                <Pill color="bg-teal-800 text-teal-100">₹45K Cr → ₹2.2L Cr</Pill>
              </div>
            </Card>
          </div>
        </section>

        {/* ══ EMPLOYMENT ══ */}
        <section id="employment">
          <SectionTitle>Employment: Better Than National Average</SectionTitle>
          <SectionSource>Source: PLFS (Periodic Labour Force Survey) 2025 | CMIE</SectionSource>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <StatCard value="3.6%" label="WB Unemployment Rate" color="text-teal-400" />
            <StatCard value="4.8%" label="India Average" color="text-red-400" />
          </div>

          <Card>
            <p className="text-sm text-gray-400 mb-4">Unemployment Rate (%) — Lower is Better</p>
            {[
              { label: "India Avg", value: 4.8, highlight: false, lowerBetter: true },
              { label: "West Bengal ★", value: 3.6, highlight: true, lowerBetter: false },
              { label: "Karnataka", value: 2.7, highlight: false, lowerBetter: false },
              { label: "Gujarat", value: 2.3, highlight: false, lowerBetter: false },
            ].map((d) => (
              <HBar key={d.label} {...d} max={6} unit="%" />
            ))}
            <p className="text-xs text-amber-400 mt-3">← Lower is Better</p>
          </Card>

          <Card className="mt-4">
            <p className="text-sm text-gray-400 mb-2">WB vs India Average</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 text-center">
                <div className="text-4xl font-extrabold text-teal-400">3.6%</div>
                <div className="text-xs text-gray-400 mt-1">West Bengal</div>
              </div>
              <div className="text-2xl text-gray-500">vs</div>
              <div className="flex-1 text-center">
                <div className="text-4xl font-extrabold text-red-400">4.8%</div>
                <div className="text-xs text-gray-400 mt-1">India Average</div>
              </div>
            </div>
            <div className="mt-4 bg-blue-950 rounded-full h-4 overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: "75%" }} />
            </div>
            <p className="text-xs text-teal-300 mt-1 text-right">WB is 25% below national average</p>
          </Card>
        </section>

        {/* ══ HEALTHCARE ══ */}
        <section id="healthcare">
          <SectionTitle>Public Healthcare: Among India's Best</SectionTitle>
          <SectionSource>Source: CBHI | National Health Profile | Sample Registration System (SRS)</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard value="~97K" label="Govt Hospital Beds 2022" color="text-teal-400" />
            <StatCard value="+70%" label="Growth since 2011" color="text-green-400" />
            <StatCard value="Top 3" label="States in Govt Beds" color="text-amber-400" />
          </div>

          <Card className="mb-6">
            <p className="text-sm text-gray-400 mb-4">Govt Hospital Beds (thousands) — State Comparison</p>
            {[
              { label: "West Bengal ★", value: 97, highlight: true },
              { label: "Tamil Nadu", value: 77, highlight: false },
              { label: "Uttar Pradesh", value: 76, highlight: false },
              { label: "Karnataka", value: 52, highlight: false },
              { label: "Gujarat", value: 49, highlight: false },
            ].map((d) => (
              <HBar key={d.label} {...d} max={110} unit="K" />
            ))}
          </Card>

          <SectionTitle>Infant Mortality: Better Than National Avg &amp; Gujarat</SectionTitle>
          <SectionSource>Source: Sample Registration System (SRS) | RGI India</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard value="31→18" label="IMR Journey 2011→2026" color="text-teal-400" />
            <StatCard value="~42%" label="Decline in IMR" color="text-green-400" />
            <StatCard value="Better" label="Than Gujarat &amp; India Avg" color="text-amber-400" />
          </div>

          <Card>
            <p className="text-sm text-gray-400 mb-4">Infant Mortality Rate (per 1,000 live births) — Lower is Better</p>
            {[
              { label: "Gujarat", value: 25, highlight: false, lowerBetter: true },
              { label: "India Avg", value: 25, highlight: false, lowerBetter: true },
              { label: "West Bengal ★", value: 18, highlight: true, lowerBetter: false },
              { label: "Karnataka", value: 15, highlight: false, lowerBetter: false },
              { label: "Kerala (best)", value: 5, highlight: false, lowerBetter: false },
            ].map((d) => (
              <HBar key={d.label} {...d} max={30} />
            ))}
            <p className="text-xs text-amber-400 mt-3">← Lower is Better</p>
          </Card>
        </section>

        {/* ══ SOCIAL ══ */}
        <section id="social">
          <SectionTitle>Poverty Reduction: 60% Decline Since 2015</SectionTitle>
          <SectionSource>Source: NITI Aayog Multidimensional Poverty Index (MPI) | NFHS</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card className="sm:col-span-1">
              <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Poverty Journey</p>
              {[
                { year: "2015–16", value: 21, pct: 100 },
                { year: "2019–21", value: 13, pct: 62 },
                { year: "2022–23", value: 8.6, pct: 41 },
              ].map((d) => (
                <div key={d.year} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{d.year}</span>
                    <span className="text-teal-300 font-bold">{d.value}%</span>
                  </div>
                  <div className="h-3 bg-blue-950 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-amber-400 font-bold text-sm mt-3 text-center">60% Decline!</p>
            </Card>

            <Card className="sm:col-span-2">
              <p className="text-sm text-gray-400 mb-4">MPI Poverty % — State Comparison (Lower is Better)</p>
              {[
                { label: "Bihar", value: 26, highlight: false, lowerBetter: true },
                { label: "Uttar Pradesh", value: 17, highlight: false, lowerBetter: true },
                { label: "India Avg", value: 11, highlight: false, lowerBetter: true },
                { label: "Gujarat", value: 9, highlight: false, lowerBetter: false },
                { label: "West Bengal ★", value: 9, highlight: true, lowerBetter: false },
                { label: "Maharashtra", value: 6, highlight: false, lowerBetter: false },
                { label: "Kerala", value: 1, highlight: false, lowerBetter: false },
              ].map((d) => (
                <HBar key={d.label} {...d} max={28} unit="%" />
              ))}
            </Card>
          </div>

          <SectionTitle>Women's Financial Empowerment: Above National Average</SectionTitle>
          <SectionSource>Source: NFHS-5 (2019–21) | Dept of WCD, West Bengal</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard value="60.6%" label="Women Control Finances" color="text-purple-400" />
            <StatCard value="~76%" label="Bank Account Access" color="text-teal-400" />
            <StatCard value="> Avg" label="Above India 51% &amp; Gujarat 57%" color="text-amber-400" />
          </div>

          <Card className="mb-6">
            <p className="text-sm text-gray-400 mb-4">Women Controlling Finances (%) — State Comparison</p>
            {[
              { label: "West Bengal ★", value: 61, highlight: true },
              { label: "Gujarat", value: 58, highlight: false },
              { label: "India Avg", value: 51, highlight: false },
            ].map((d) => (
              <HBar key={d.label} {...d} max={70} unit="%" />
            ))}
            <div className="mt-5 space-y-2">
              {[
                "Strong household decision-making power",
                "DBT schemes directly credit women's accounts",
                "Kanyashree — national award-winning scheme",
              ].map((s) => (
                <div key={s} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-teal-400 mt-0.5">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </Card>

          <SectionTitle>Crime Rate: 56% Below National Average</SectionTitle>
          <SectionSource>Source: NCRB 'Crime in India' Report 2022</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard value="~195" label="WB Crime Rate (per lakh)" color="text-teal-400" />
            <StatCard value="~445" label="India Average (per lakh)" color="text-red-400" />
            <StatCard value="56% Lower" label="Than National Average" color="text-green-400" />
          </div>

          <Card>
            <p className="text-sm text-gray-400 mb-4">Crime Rate per Lakh Population — Lower is Safer</p>
            {[
              { label: "Kerala*", value: 1500, highlight: false, lowerBetter: true },
              { label: "India Avg", value: 445, highlight: false, lowerBetter: true },
              { label: "Maharashtra", value: 400, highlight: false, lowerBetter: true },
              { label: "Karnataka", value: 350, highlight: false, lowerBetter: true },
              { label: "Gujarat", value: 300, highlight: false, lowerBetter: true },
              { label: "West Bengal ★", value: 195, highlight: true, lowerBetter: false },
            ].map((d) => (
              <HBar key={d.label} {...d} max={1600} />
            ))}
            <p className="text-xs text-amber-400 mt-2">← Lower is Safer</p>
            <p className="text-xs text-blue-300 mt-2 italic">* Kerala's high rate reflects better crime reporting, not higher actual crime</p>
          </Card>
        </section>

        {/* ══ AGRICULTURE ══ */}
        <section id="agriculture">
          <SectionTitle>Agriculture: National Leader in Key Categories</SectionTitle>
          <SectionSource>Source: Dept of Fisheries | Agriculture Census | Horticulture Board of India</SectionSource>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { rank: "#1", sector: "Fish Production", desc: "Leading state in India's fisheries", color: "bg-teal-700 border-teal-500" },
              { rank: "#1", sector: "Vegetables", desc: "Top vegetable producing state", color: "bg-green-800 border-green-600" },
              { rank: "Top 3", sector: "Rice Production", desc: "Major contributor to food security", color: "bg-blue-800 border-blue-600" },
              { rank: "Top 5", sector: "Tea", desc: "Darjeeling — world-famous origin", color: "bg-amber-800 border-amber-600" },
            ].map((d) => (
              <div key={d.sector} className={`rounded-2xl border-2 ${d.color} p-4 sm:p-6 text-center`}>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">{d.rank}</div>
                <div className="text-sm font-bold text-white mt-1">{d.sector}</div>
                <div className="text-xs text-gray-300 mt-1 italic">{d.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ INDUSTRY ══ */}
        <section id="industry">
          <SectionTitle>MSME Powerhouse: 2nd Largest in India</SectionTitle>
          <SectionSource>Source: NSSO 73rd Round | Ministry of MSME Reports</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard value="88+ Lakh" label="MSME Units in WB" color="text-teal-400" />
            <StatCard value="~14%" label="Share of India's MSMEs" color="text-amber-400" />
            <StatCard value="540+" label="Industrial Clusters" color="text-green-400" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card>
              <p className="text-sm text-gray-400 mb-4">MSME Share of India (%)</p>
              {[
                { label: "UP (1st)", value: 18, highlight: false },
                { label: "West Bengal ★", value: 14, highlight: true },
                { label: "Tamil Nadu", value: 10, highlight: false },
                { label: "Maharashtra", value: 9, highlight: false },
              ].map((d) => (
                <HBar key={d.label} {...d} max={20} unit="%" />
              ))}
            </Card>

            <Card>
              <p className="text-sm text-gray-400 mb-4">Key MSME Sectors</p>
              <div className="space-y-3">
                {[
                  { sector: "Textiles &amp; Jute", tag: "Traditional Strength", color: "bg-teal-700" },
                  { sector: "Leather Goods", tag: "National Leader", color: "bg-amber-700" },
                  { sector: "Food Processing", tag: "Growing Fast", color: "bg-green-700" },
                  { sector: "Engineering", tag: "Haldia Belt", color: "bg-blue-700" },
                ].map((s) => (
                  <div key={s.sector} className={`flex justify-between items-center rounded-lg ${s.color} bg-opacity-40 border border-opacity-30 px-3 py-2 text-xs`}
                       dangerouslySetInnerHTML={undefined}>
                    <span className="font-semibold text-white" dangerouslySetInnerHTML={{ __html: s.sector }} />
                    <span className="text-gray-300">{s.tag}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <SectionTitle>Manufacturing: Above National Growth Rate</SectionTitle>
          <SectionSource>Source: Annual Survey of Industries (ASI) | DPIIT | WB Govt</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard value="7.3%" label="WB Industrial Growth FY25" color="text-teal-400" />
            <StatCard value="6.2%" label="India Avg Growth FY25" color="text-gray-400" />
            <StatCard value="18.8%" label="Manufacturing Workforce Share" color="text-amber-400" />
          </div>

          <Card className="mb-6">
            <p className="text-sm text-gray-400 mb-5">Manufacturing Workforce Share (%) — State Comparison</p>
            <div className="flex justify-around items-end gap-2 sm:gap-4">
              {[
                { label: "West Bengal", value: 19, highlight: true },
                { label: "Tamil Nadu", value: 17, highlight: false },
                { label: "Maharashtra", value: 12, highlight: false },
                { label: "Karnataka", value: 10, highlight: false },
              ].map((d) => (
                <VBar key={d.label} {...d} max={22} unit="%" />
              ))}
            </div>
            <div className="mt-4 space-y-2 pt-4 border-t border-blue-900">
              {[
                { name: "Steel &amp; Heavy Engg", loc: "Durgapur–Asansol belt" },
                { name: "Chemicals", loc: "Haldia Petrochemicals" },
                { name: "Jute &amp; Textiles", loc: "Global export strength" },
              ].map((k) => (
                <div key={k.name} className="flex justify-between text-xs">
                  <span className="text-white font-semibold" dangerouslySetInnerHTML={{ __html: k.name }} />
                  <span className="text-gray-400">{k.loc}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ══ TECH ══ */}
        <section id="tech">
          <SectionTitle>IT Sector: ₹8,000 Cr → ₹40,000 Cr</SectionTitle>
          <SectionSource>Source: Times of India Jan 2026 | ASSOCHAM-STPI | IT Secretary, Govt of WB | STPI Kolkata</SectionSource>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard value="₹8K Cr" label="Software Exports ~10 yrs ago" color="text-gray-400" />
            <StatCard value="₹40K Cr" label="Software Exports Now" color="text-teal-400" />
            <StatCard value="5×" label="Growth in Exports" color="text-amber-400" />
            <StatCard value="₹30K Cr" label="Investment Pipeline" color="text-purple-400" />
          </div>

          <Card className="mb-4">
            <p className="text-sm text-gray-400 mb-5">Software Exports Growth (₹ Crore)</p>
            <div className="flex items-end gap-4 sm:gap-8 h-36">
              {[
                { year: "~2010", value: 8000, label: "₹8K Cr" },
                { year: "2021–22", value: 25918, label: "₹25.9K Cr" },
                { year: "2025–26", value: 40000, label: "₹40K Cr" },
              ].map((d) => {
                const pct = (d.value / 40000) * 100;
                return (
                  <div key={d.year} className="flex flex-col items-center flex-1 gap-1">
                    <span className="text-xs text-teal-300 font-bold">{d.label}</span>
                    <div className="w-full bg-blue-950 rounded-t-lg flex flex-col justify-end" style={{ height: 100 }}>
                      <div className="w-full bg-teal-500 rounded-t-lg" style={{ height: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{d.year}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              { label: "IT Parks", value: "32 Govt + 60+ Private" },
              { label: "IT Professionals", value: "2 Lakh+" },
              { label: "Bengal Silicon Valley", value: "250-acre, 41 companies, 7,500 jobs" },
              { label: "IT Companies", value: "2,800 incl. TCS, Wipro, Accenture" },
            ].map((d) => (
              <div key={d.label} className="bg-[#0a1c3a] border border-blue-900 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{d.label}</p>
                  <p className="text-sm font-bold text-white">{d.value}</p>
                </div>
              </div>
            ))}
          </div>

          <SectionTitle>Data Centres: Fastest Growing Hub in India</SectionTitle>
          <SectionSource>Source: Colliers India Data Centre Report 2025 | CBRE</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard value="48% CAGR" label="Fastest Growth Rate" color="text-amber-400" />
            <StatCard value="31 MW" label="Current Capacity" color="text-teal-400" />
            <StatCard value="250 MW+" label="Pipeline (Hiranandani + Adani)" color="text-purple-400" />
          </div>

          <Card className="mb-6">
            <p className="text-sm text-gray-400 mb-5">Data Centre CAGR (%) — City Comparison</p>
            <div className="flex justify-around items-end gap-2">
              {[
                { label: "Kolkata (WB)", value: 48, highlight: true },
                { label: "Mumbai", value: 22, highlight: false },
                { label: "Bengaluru", value: 20, highlight: false },
                { label: "Delhi", value: 17, highlight: false },
                { label: "Chennai", value: 18, highlight: false },
              ].map((d) => (
                <VBar key={d.label} {...d} max={55} unit="%" />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-blue-900 space-y-2">
              {[
                "Only major data centre hub in Eastern India",
                "Lower land &amp; power costs vs other metros",
                "Bengal Silicon Valley initiative driving growth",
              ].map((s) => (
                <div key={s} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-amber-400">★</span>
                  <span dangerouslySetInnerHTML={{ __html: s }} />
                </div>
              ))}
            </div>
          </Card>

          <SectionTitle>GCC Leasing: 239% Surge — Kolkata on the Global Map</SectionTitle>
          <SectionSource>Source: Cushman &amp; Wakefield India Office Market Report 2025 | Times of India Feb 2026</SectionSource>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard value="239%" label="YoY Rise in GCC Leasing 2025" color="text-amber-400" />
            <StatCard value="0.51 MSF" label="GCC Space Leased in 2025" color="text-teal-400" />
            <StatCard value="30%" label="Share of Total Office Leasing" color="text-green-400" />
            <StatCard value="7" label="GCCs Leased | Avg 72K sq ft" color="text-purple-400" />
          </div>

          <Card className="mb-4">
            <p className="text-sm font-semibold text-gray-300 mb-4">GCC Share of Kolkata Office Leasing</p>
            <div className="space-y-4">
              {[
                { year: "2024", pct: 9, msf: "0.15 MSF" },
                { year: "2025", pct: 30, msf: "0.51 MSF ↑ 239%" },
              ].map((d) => (
                <div key={d.year}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-bold">{d.year}</span>
                    <span className="text-teal-300">{d.pct}% · {d.msf}</span>
                  </div>
                  <div className="h-5 bg-blue-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.year === "2025" ? "bg-amber-500" : "bg-slate-600"}`}
                      style={{ width: `${d.pct * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {[
                { driver: "Talent Base", detail: "Domain skills in IT-BPM &amp; analytics" },
                { driver: "Cost-Value", detail: "Lower cost vs Bengaluru / Hyderabad" },
                { driver: "EMEA Companies", detail: "Primary occupiers driving GCC demand" },
                { driver: "SE Asia Hub", detail: "MNCs using Kolkata as SE Asia GCC base" },
              ].map((d) => (
                <div key={d.driver} className="bg-blue-950 rounded-lg px-3 py-2 text-xs">
                  <p className="font-bold text-white">{d.driver}</p>
                  <p className="text-gray-400 mt-0.5" dangerouslySetInnerHTML={{ __html: d.detail }} />
                </div>
              ))}
            </div>
          </Card>

          <SectionTitle>Startup Ecosystem: Fast-Rising Innovation Hub</SectionTitle>
          <SectionSource>Source: DPIIT Startup India | Tracxn | Startup Genome Index 2024 | NASSCOM</SectionSource>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard value="4,600+" label="DPIIT-Recognised Startups" color="text-teal-400" />
            <StatCard value="#9" label="Startup Ecosystem Rank (India)" color="text-amber-400" />
            <StatCard value="+45.6%" label="Ecosystem Growth 2025" color="text-green-400" />
            <StatCard value="#187" label="Global Startup Rank (Rising)" color="text-purple-400" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Card>
              <p className="text-sm text-gray-400 mb-4">Startup Count — State Comparison</p>
              {[
                { label: "Karnataka", value: 17500, highlight: false },
                { label: "Uttar Pradesh", value: 17000, highlight: false },
                { label: "Maharashtra", value: 15000, highlight: false },
                { label: "Tamil Nadu", value: 10000, highlight: false },
                { label: "West Bengal ★", value: 4600, highlight: true },
              ].map((d) => (
                <HBar key={d.label} {...d} max={18000} />
              ))}
            </Card>

            <Card>
              <p className="text-sm text-gray-400 mb-4">VC Funding Comparison</p>
              {[
                { label: "Bengaluru", value: 10000, display: "$10B+/yr", highlight: false },
                { label: "Mumbai", value: 3000, display: "$3B+", highlight: false },
                { label: "Hyderabad", value: 2000, display: "$1–3B", highlight: false },
                { label: "West Bengal ★", value: 89, display: "~$89M", highlight: true },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-3 mb-2">
                  <span className={`w-28 text-xs text-right shrink-0 ${d.highlight ? "text-teal-300 font-bold" : "text-gray-300"}`}>
                    {d.label}
                  </span>
                  <div className="flex-1 bg-blue-950 rounded-full h-5 overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center justify-end pr-2 ${d.highlight ? "bg-teal-500" : "bg-slate-500"}`}
                      style={{ width: `${Math.max((d.value / 10000) * 100, 8)}%` }}
                    >
                      <span className="text-white text-xs font-semibold">{d.display}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill color="bg-teal-800 text-teal-100">Focus: AI</Pill>
                <Pill color="bg-blue-800 text-blue-100">GCCs</Pill>
                <Pill color="bg-purple-800 text-purple-100">Data Centres</Pill>
              </div>
            </Card>
          </div>

          <SectionTitle>Real Estate &amp; Office Space: Fastest Growing Market</SectionTitle>
          <SectionSource>Source: JLL India | Knight Frank | CBRE | Times of India</SectionSource>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard value="+400%" label="Investment Growth 2025 YoY" color="text-amber-400" />
            <StatCard value="2.3 MSF" label="Office Leasing — Decade High 2025" color="text-teal-400" />
            <StatCard value="+105%" label="New Residential Launches H1 2025" color="text-green-400" />
          </div>

          <Card>
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              {[
                { tag: "Most Affordable Metro", detail: "Cost advantage over Bengaluru" },
                { tag: "GCC &amp; IT Hub Emerging", detail: "Accenture, Wipro, and more setting up" },
                { tag: "Real Estate Prices", detail: "~6–16% YoY growth" },
              ].map((d) => (
                <div key={d.tag} className="bg-blue-950 rounded-xl px-4 py-3">
                  <p className="font-bold text-white text-sm" dangerouslySetInnerHTML={{ __html: d.tag }} />
                  <p className="text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: d.detail }} />
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ══ LOGISTICS ══ */}
        <section id="logistics">
          <SectionTitle>Logistics: Emerging Hub of Eastern India</SectionTitle>
          <SectionSource>Source: WB Logistics Policy 2023 | Port Trust of India | Flipkart / Amazon / Mahindra Logistics</SectionSource>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard value="300M+" label="Consumer Base Served" color="text-teal-400" />
            <StatCard value="148+" label="Industrial / Logistics Parks" color="text-amber-400" />
            <StatCard value="27,000 Ac" label="Total Logistics Zone Area" color="text-green-400" />
            <StatCard value="65.6 MT" label="Port Cargo (Kolkata + Haldia)" color="text-purple-400" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card>
              <p className="text-sm font-semibold text-gray-300 mb-3">Strategic Gateway</p>
              <ul className="space-y-2 text-xs text-gray-300">
                {[
                  "Eastern &amp; North-East India gateway",
                  "ASEAN trade route access",
                  "Multi-modal: Road + Rail + Port + Waterways",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="text-teal-400 mt-0.5">▸</span>
                    <span dangerouslySetInnerHTML={{ __html: s }} />
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-blue-900">
                <p className="text-xs font-semibold text-gray-400 mb-2">5 Key Logistics Hubs (Policy 2023)</p>
                <div className="flex flex-wrap gap-2">
                  {["Dankuni", "Durgapur", "Tajpur", "Malda", "Siliguri"].map((h) => (
                    <span key={h} className="bg-teal-800 text-teal-100 text-xs px-2 py-1 rounded-full">{h}</span>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <p className="text-sm font-semibold text-gray-300 mb-3">Recent Investments (2024–26)</p>
              <div className="space-y-3 text-xs">
                {[
                  { company: "Flipkart", detail: "Largest warehouse in India — Haringhata" },
                  { company: "Amazon", detail: "6,00,000 sq ft logistics park — Kolkata" },
                  { company: "Mahindra Logistics", detail: "4.75 lakh sq ft warehouse — Howrah" },
                ].map((d) => (
                  <div key={d.company} className="bg-blue-950 rounded-lg px-3 py-2">
                    <p className="font-bold text-white">{d.company}</p>
                    <p className="text-gray-400 mt-0.5">{d.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* ══ SUMMARY ══ */}
        <section className="bg-gradient-to-br from-[#0a1c3a] to-[#071428] border border-blue-800 rounded-3xl p-6 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">West Bengal</h2>
          <p className="text-amber-400 italic text-lg mb-8">The Inclusive Growth Model</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: "📊", label: "Economy", value: "6th Largest, ~4× Growth" },
              { icon: "💰", label: "Tax Revenue", value: "5× Growth, 10–11% CAGR" },
              { icon: "💼", label: "Employment", value: "3.6% — Better than India" },
              { icon: "🏭", label: "MSMEs", value: "#2 in India, 88L+ Units" },
              { icon: "🏥", label: "Hospitals", value: "Top 3 in Govt Beds" },
              { icon: "❤️", label: "Health", value: "IMR better than India &amp; Gujarat" },
              { icon: "👥", label: "Poverty", value: "8.6% — Below National Avg" },
              { icon: "🌾", label: "Agriculture", value: "#1 Fish &amp; Vegetables" },
              { icon: "🖥️", label: "Data Centres", value: "Fastest Growth — 48% CAGR" },
            ].map((d) => (
              <div key={d.label} className="bg-[#0a1c3a] border border-blue-900 rounded-xl p-3 text-left">
                <span className="text-xl">{d.icon}</span>
                <p className="text-xs text-amber-400 font-semibold mt-1">{d.label}</p>
                <p className="text-xs text-gray-300 mt-0.5" dangerouslySetInnerHTML={{ __html: d.value }} />
              </div>
            ))}
          </div>
          <blockquote className="text-gray-300 text-sm sm:text-base italic border-l-4 border-amber-400 pl-4 text-left max-w-2xl mx-auto">
            "Jobs for many. Healthcare for all. Opportunity growing — West Bengal is India's Inclusive Growth Story."
          </blockquote>
        </section>

      </div>
    </div>
  );
};

export default WestBengalGrowthStory;
