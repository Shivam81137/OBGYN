"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Transplacental3D from "@/components/torch/Transplacental3D";
import FetalBrain3D from "@/components/torch/FetalBrain3D";
import DiagnosticAlgorithm from "@/components/torch/DiagnosticAlgorithm";
import { ThemeToggle } from "@/components/synapsis/ThemeToggle";
import {
  Activity,
  ShieldCheck,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Stethoscope,
  Eye,
  Brain,
  Sparkles,
  AlertTriangle,
  HeartPulse,
  Microscope,
  Search,
  ChevronRight,
  ShieldAlert,
  Zap,
  Table,
  Layers,
  X,
} from "lucide-react";

export default function TorchInfectionsPage() {
  const [selectedPathogen, setSelectedPathogen] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "pathogens" | "matrix" | "algorithm" | "flashcards">("overview");
  const [qnaTopic, setQnaTopic] = useState<string>("all");
  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(false);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  // Pathogens Dataset from Chapter 20 PDF
  const pathogensData = [
    {
      id: "toxo",
      name: "Toxoplasmosis",
      organism: "Toxoplasma gondii",
      type: "Intracellular Protozoan",
      transmission: "Ingestion of raw/undercooked meat containing tissue cysts, or cat feces containing oocysts.",
      classicTriad: "Chorioretinitis + Hydrocephalus + Diffuse Intracranial Calcifications",
      usgSigns: "Bilateral ventriculomegaly, diffuse parenchymal calcifications, hepatic calcifications, placentomegaly.",
      treatment: "<18 weeks: Spiramycin 1g TDS. ≥18 weeks or confirmed fetal infection: Pyrimethamine + Sulfadiazine + Folinic Acid.",
      keyPearls: "Intracranial calcifications are DIFFUSE & PARENCHYMAL (unlike CMV which is periventricular). Maternal infection before conception carries zero fetal risk.",
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "syphilis",
      name: "Syphilis",
      organism: "Treponema pallidum",
      type: "Spirochete",
      transmission: "Transplacental transmission during maternal spirochetemia (Primary/Secondary > Tertiary).",
      classicTriad: "Hepatosplenomegaly + Maculopapular Rash (Palmar/Plantar) + Snuffles (Rhinitis)",
      usgSigns: "Placentomegaly (>4cm thick), fetal hydrops, hepatomegaly, ascites, polyhydramnios, MCA-PSV >1.5 MoM.",
      treatment: "Benzathine Penicillin G 2.4 MU IM (1 dose for early, 3 weekly doses for late/unknown duration). Jarisch-Herxheimer reaction risk!",
      keyPearls: "Wimberger sign (bony erosion of medial proximal tibia), Saber shins, Clutton joints, Hutchinson teeth, Mulberry molars.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "rubella",
      name: "Rubella",
      organism: "Rubella Virus",
      type: "ssRNA Togavirus",
      transmission: "Respiratory droplets -> Transplacental viremia during organogenesis.",
      classicTriad: "Sensorineural Hearing Loss + Congenital Cataracts/Microphthalmia + Patent Ductus Arteriosus (PDA)",
      usgSigns: "Microcephaly, IUGR, cardiac defects (PDA, pulmonary artery stenosis), hepatosplenomegaly.",
      treatment: "No antiviral treatment. Prevention via MMR vaccine PRE-CONCEPTION. Live vaccine CONTRAINDICATED in pregnancy!",
      keyPearls: "Gregg's Triad. Blueberry muffin rash (extramedullary hematopoiesis). Highest risk in 1st trimester (<11 weeks = 90% risk).",
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: "cmv",
      name: "Cytomegalovirus (CMV)",
      organism: "Cytomegalovirus (HHV-5)",
      type: "dsDNA Herpesvirus",
      transmission: "Contact with infected body fluids (saliva, urine of toddlers), sexual, or transplacental.",
      classicTriad: "Periventricular Calcifications + Microcephaly + Sensorineural Hearing Loss",
      usgSigns: "Strictly PERIVENTRICULAR calcifications, ventriculomegaly, microcephaly, hyperechogenic bowel, periventricular pseudocysts.",
      treatment: "Neonatal: Oral Valganciclovir (16 mg/kg BD for 6 months within 4 weeks of birth) prevents hearing deterioration.",
      keyPearls: "#1 cause of congenital viral infection & non-genetic sensorineural hearing loss worldwide. 'Owl's eye' intranuclear inclusions.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "hsv",
      name: "Herpes Simplex (HSV)",
      organism: "HSV-1 & HSV-2",
      type: "dsDNA Herpesvirus",
      transmission: "Peripartum intrapartum contact during vaginal delivery through infected maternal birth canal (85%).",
      classicTriad: "Skin Vesicles + Ocular Damage (Keratoconjunctivitis) + CNS Encephalitis (SEM Disease)",
      usgSigns: "Hydranencephaly, microcephaly, intracranial calcifications, fetal hydrops (rare in utero transmission).",
      treatment: "Suppressive Oral Acyclovir 400 mg TDS from 36 weeks until delivery. Cesarean section indicated if active genital lesions at labor.",
      keyPearls: "Temporal lobe involvement on fetal brain MRI. SEM (Skin, Eye, Mouth) disease can progress to CNS/Disseminated HSV.",
      color: "from-rose-500 to-pink-600",
    },
    {
      id: "parvo",
      name: "Parvovirus B19",
      organism: "Parvovirus B19",
      type: "Non-enveloped ssDNA",
      transmission: "Respiratory droplets -> Transplacental infection of fetal erythroid progenitor cells via P antigen.",
      classicTriad: "Severe Fetal Anemia + Non-Immune Fetal Hydrops + Fetal Death",
      usgSigns: "MCA-PSV > 1.5 MoM (Peak Systolic Velocity), ascites, pericardial effusion, placentomegaly, hydrops fetalis.",
      treatment: "Intrauterine Blood Transfusion (IUT) via umbilical vein cordocentesis under USG guidance.",
      keyPearls: "Suppresses fetal erythropoiesis causing severe aplastic anemia. 'Slapped cheek' erythema infectiosum in mother.",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: "vzv",
      name: "Varicella (VZV)",
      organism: "Varicella Zoster Virus",
      type: "dsDNA Herpesvirus",
      transmission: "Respiratory droplets or direct contact with lesions -> Transplacental transmission (8–20 weeks gestation).",
      classicTriad: "Cicatricial Skin Lesions (Zig-zag scars) + Limb Hypoplasia + Chorioretinitis/Microphthalmia",
      usgSigns: "Limb hypoplasia, microcephaly, cerebral calcifications, echogenic bowel, hydrops fetalis.",
      treatment: "Maternal post-exposure: VZIG (Varicella Zoster Immune Globulin) within 10 days. Oral Acyclovir for maternal varicella.",
      keyPearls: "Congenital Varicella Syndrome occurs when maternal infection is between 8–20 weeks. Neonatal varicella is fatal if maternal onset 5 days before to 2 days after delivery.",
      color: "from-violet-500 to-purple-600",
    },
  ];

  // High-Yield Exam Recall Flashcards (Extracted from Chapter 20 PDF)
  const flashcardsData = [
    {
      topic: "CMV",
      q: "Which pathogen causes strictly PERIVENTRICULAR intracranial calcifications in the fetal brain?",
      a: "Cytomegalovirus (CMV). In contrast, Toxoplasmosis causes DIFFUSE PARENCHYMAL calcifications.",
    },
    {
      topic: "General Principles",
      q: "Why can IgM antibodies detected in umbilical cord blood confirm congenital fetal infection?",
      a: "IgM (~900 kDa pentamer) CANNOT cross the placenta. Presence in cord blood proves fetal plasma cell antibody production.",
    },
    {
      topic: "General Principles",
      q: "What is the minimum safe gestational age for performing diagnostic amniocentesis for TORCH PCR?",
      a: "18 to 20 weeks of gestation AND at least 6 to 8 weeks post-maternal infection (to allow fetal renal excretion into amniotic fluid).",
    },
    {
      topic: "Toxoplasmosis",
      q: "What is the first-line treatment for primary maternal Toxoplasmosis before 18 weeks of gestation?",
      a: "Spiramycin 1g PO TDS (concentrates in placenta to prevent transmission). If fetal infection is confirmed or ≥18w, switch to Pyrimethamine + Sulfadiazine + Folinic acid.",
    },
    {
      topic: "Syphilis",
      q: "What pathognomonic radiologic sign on infant X-ray indicates congenital syphilis?",
      a: "Wimberger sign: Focal bilateral destruction/erosion of the medial margin of the proximal tibial metaphysis.",
    },
    {
      topic: "Rubella",
      q: "What is the classic Gregg's Triad of Congenital Rubella Syndrome?",
      a: "1. Sensorineural Hearing Loss (most common)\n2. Ocular defects (Cataracts, Microphthalmia)\n3. Congenital Heart Defects (PDA, Pulmonary Artery Stenosis)",
    },
    {
      topic: "Parvovirus B19",
      q: "How does Parvovirus B19 cause Non-Immune Fetal Hydrops?",
      a: "Parvovirus targets P antigen on fetal erythroid progenitor cells, inhibiting erythropoiesis -> Severe Fetal Anemia -> High-output heart failure -> Hydrops.",
    },
    {
      topic: "HSV",
      q: "What is the recommended delivery protocol for a pregnant mother with active HSV genital lesions at labor?",
      a: "Immediate Elective Cesarean Section to prevent 85% intrapartum transmission risk. Prophylactic oral Acyclovir is given from 36w onwards.",
    },
    {
      topic: "General Principles",
      q: "Is routine TORCH serological screening indicated for Recurrent Pregnancy Loss (RPL)?",
      a: "NO. TORCH infections cause sporadic primary fetal loss, NOT recurrent habitual abortions. Screening RPL patients is strongly discouraged.",
    },
    {
      topic: "CMV",
      q: "What is the standard neonatal antiviral regimen for symptomatic congenital CMV?",
      a: "Oral Valganciclovir (16 mg/kg BD for 6 months), initiated within 4 weeks of birth to preserve hearing and neurodevelopment.",
    },
    {
      topic: "Syphilis",
      q: "What is the first-line drug for maternal syphilis during pregnancy, and what acute reaction must be monitored?",
      a: "Benzathine Penicillin G (2.4 MU IM). Monitor for Jarisch-Herxheimer reaction (fever, uterine contractions, fetal distress within 24h).",
    },
    {
      topic: "Varicella",
      q: "What is the vulnerability window for Congenital Varicella Syndrome during gestation?",
      a: "8 to 20 weeks of gestation (peaks at 13–20 weeks). Results in cicatricial skin scars, limb hypoplasia, and chorioretinitis.",
    },
    {
      topic: "Rubella",
      q: "Is MMR vaccine safe during pregnancy?",
      a: "NO! MMR is a LIVE attenuated vaccine and is CONTRAINDICATED in pregnancy. Vaccinate pre-conception and advise avoiding pregnancy for 1 month.",
    },
    {
      topic: "Parvovirus B19",
      q: "What non-invasive Doppler USG measurement quantifies fetal anemia in Parvovirus infection?",
      a: "Middle Cerebral Artery Peak Systolic Velocity (MCA-PSV) > 1.5 MoM (Multiples of Median). Indicates urgent fetal blood transfusion.",
    },
    {
      topic: "CMV",
      q: "What classic microscopic histological appearance is characteristic of CMV infected cells?",
      a: "Basophilic intranuclear inclusion bodies surrounded by a clear halo ('Owl's eye' inclusions).",
    },
    {
      topic: "Toxoplasmosis",
      q: "What is the classic Sabin Triad of Congenital Toxoplasmosis?",
      a: "1. Chorioretinitis (most common overall)\n2. Hydrocephalus\n3. Diffuse Intracranial Calcifications",
    },
    {
      topic: "Syphilis",
      q: "What early neonatal nasal sign is pathognomonic for congenital syphilis?",
      a: "'Snuffles': Copious, highly infectious mucopurulent nasal discharge containing spirochetes.",
    },
    {
      topic: "General Principles",
      q: "How does IgG Avidity Index distinguish primary from past infection in pregnancy?",
      a: "Low Avidity (<30%) = Acute primary infection within past 3 months. High Avidity (>60%) = Past infection >3 months ago (low fetal risk).",
    },
    {
      topic: "HSV",
      q: "What are the three clinical classifications of neonatal HSV infection?",
      a: "1. SEM (Skin, Eye, Mouth - 45%)\n2. CNS Disease / Encephalitis (30%)\n3. Disseminated Disease involving multiorgan failure (25%)",
    },
    {
      topic: "Rubella",
      q: "What cutaneous manifestation gives newborn babies with Congenital Rubella their characteristic skin appearance?",
      a: "'Blueberry muffin' spots due to extramedullary dermal hematopoiesis.",
    },
    {
      topic: "Varicella",
      q: "When is neonatal varicella most severe and life-threatening?",
      a: "When maternal onset of chickenpox occurs between 5 days BEFORE delivery to 2 days AFTER delivery (due to lack of maternal IgG antibody transfer).",
    },
    {
      topic: "Parvovirus B19",
      q: "What is the treatment of choice for severe hydropic fetal anemia caused by Parvovirus B19?",
      a: "Intrauterine Blood Transfusion (IUT) of packed RBCs into umbilical vein under ultrasonic guidance.",
    },
    {
      topic: "CMV",
      q: "What is the single most common cause of non-genetic sensorineural hearing loss in children?",
      a: "Congenital Cytomegalovirus (CMV) infection.",
    },
    {
      topic: "Toxoplasmosis",
      q: "Why is maternal Toxoplasmosis infection acquired BEFORE pregnancy generally safe for the fetus?",
      a: "Pre-existing maternal immunity (high IgG avidity) prevents parasitemia and placenta transmission.",
    },
  ];

  // Filtered dataset for active search/filters
  const filteredPathogens = useMemo(() => {
    return pathogensData.filter((item) => {
      const matchesSelect = selectedPathogen === "all" || item.id === selectedPathogen;
      const matchesQuery =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organism.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.classicTriad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keyPearls.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSelect && matchesQuery;
    });
  }, [selectedPathogen, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100 transition-colors duration-300 font-sans antialiased pb-20">
      
      {/* ── Ultra-Sleek Compact Header ── */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/90 dark:border-zinc-800/80 dark:bg-black/90 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-12 sm:h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center justify-center h-8 w-8 rounded-xl bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all"
              title="Back to Conceptual OBGYN"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black font-black">
                <Stethoscope className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white tracking-tight leading-none">
                  Conceptual OBGYN
                </span>
                <span className="text-[0.58rem] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Ready to revise
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/pdf/TORCH_Infections.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 text-[0.68rem] sm:text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/20 active:scale-95 transition-all"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>PDF</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-4 sm:space-y-6">
        
        {/* ── Sleek Compact Mobile-First Hero Card ── */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900/90 p-4 sm:p-7 shadow-sm transition-colors duration-300">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                <Activity className="h-3 w-3" />
                <span>FACULTY CHAPTER 20 INTEGRATION</span>
              </div>
              
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                TORCH Infections Clinical Masterclass
              </h1>

              <p className="text-[0.72rem] sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium line-clamp-2 sm:line-clamp-none">
                Clean, high-yield clinical breakdown of intrauterine TORCH pathogens, embryogenesis vulnerability windows, transplacental immunoglobulins, pathognomonic triads, and WHO protocols.
              </p>
            </div>

            {/* Direct PDF Link Pill */}
            <a
              href="/pdf/TORCH_Infections.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black px-4 py-2 text-xs font-black shadow-md hover:bg-black dark:hover:bg-cyan-300 active:scale-95 transition-all shrink-0 w-full sm:w-auto"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Open Original PDF</span>
              <ExternalLink className="h-3 w-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* ── All 5 Tabs 100% Visible Navigation Bar (Mobile 6-Col Grid -> Desktop 5-Col Grid) ── */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-6 sm:grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-zinc-100/90 border border-zinc-200/90 dark:bg-zinc-900/90 dark:border-zinc-800 shadow-sm transition-colors duration-300">
            {[
              { id: "overview", label: "1. Rules", fullLabel: "1. Foundational Rules", icon: Layers, span: "col-span-2 sm:col-span-1" },
              { id: "pathogens", label: "2. Pathogens", fullLabel: "2. Pathogen Matrix", icon: Microscope, span: "col-span-2 sm:col-span-1" },
              { id: "matrix", label: "3. Table", fullLabel: "3. Side-by-Side Table", icon: Table, span: "col-span-2 sm:col-span-1" },
              { id: "algorithm", label: "4. Diagnostic & 3D", fullLabel: "4. Diagnostic & 3D MRI", icon: Brain, span: "col-span-3 sm:col-span-1" },
              { id: "flashcards", label: "5. High-Yield Q&A", fullLabel: "5. High-Yield Exam Q&A", icon: Zap, span: "col-span-3 sm:col-span-1" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id && searchQuery === "";
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    setSearchQuery("");
                  }}
                  className={`${tab.span} flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl px-2 sm:px-3 py-2 text-[0.68rem] sm:text-xs font-bold transition-all active:scale-95 text-center ${
                    isActive
                      ? "bg-zinc-950 text-white dark:bg-cyan-500 dark:text-black font-extrabold shadow-sm"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200/60 border border-zinc-200/80 bg-white/80 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/70 dark:border-zinc-800/60 dark:bg-zinc-950/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search facts (e.g. Sabin triad, Spiramycin, Wimberger...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200/90 bg-white pl-9 pr-9 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
           SEARCH RESULTS VIEW (WHEN SEARCHING)
           ========================================================================= */}
        {searchQuery !== "" && (
          <section className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-bold">
              <span>Search Results for "{searchQuery}" ({filteredPathogens.length} found)</span>
              <button onClick={() => setSearchQuery("")} className="underline text-zinc-400">Clear</button>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs">
              {filteredPathogens.map((item) => (
                <div key={item.id} className="rounded-2xl border border-zinc-200/90 bg-white p-4 space-y-2 dark:border-zinc-800 dark:bg-zinc-900/80">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{item.name} ({item.organism})</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-[0.62rem] border border-cyan-500/30">{item.type}</span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 text-[0.72rem]"><strong>Classic Triad:</strong> {item.classicTriad}</p>
                  <p className="text-zinc-700 dark:text-zinc-300 text-[0.72rem]"><strong>Treatment:</strong> {item.treatment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
           TAB 1: FOUNDATIONAL RULES & USG INDICATIONS (MOBILE OPTIMIZED)
           ========================================================================= */}
        {activeTab === "overview" && searchQuery === "" && (
          <section className="space-y-4 animate-fadeIn">
            
            {/* T-O-R-C-H Acronym Micro-Grid (5 Columns on Mobile for Zero Scroll!) */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-3 space-y-2 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm transition-colors duration-300">
              <div className="flex items-center justify-between text-[0.65rem] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                <span>TORCH Acronym Breakdown</span>
                <span>Table 1</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[
                  { letter: "T", name: "Toxoplasma", pathogen: "T. gondii" },
                  { letter: "O", name: "Others", pathogen: "Syphilis/B19" },
                  { letter: "R", name: "Rubella", pathogen: "Rubella" },
                  { letter: "C", name: "CMV", pathogen: "HHV-5" },
                  { letter: "H", name: "Herpes", pathogen: "HSV-1/2" },
                ].map((item) => (
                  <div key={item.letter} className="p-1.5 sm:p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80">
                    <span className="text-base sm:text-xl font-black text-cyan-600 dark:text-cyan-400">{item.letter}</span>
                    <div className="text-[0.62rem] sm:text-xs font-bold text-zinc-900 dark:text-zinc-200 truncate mt-0.5">{item.name}</div>
                    <div className="text-[0.55rem] text-zinc-500 hidden sm:block">{item.pathogen}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Immunoglobulin Kinetics: Compact Side-by-Side Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-1">
                <div className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 text-xs">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>IgM (~900 kDa Pentamer)</span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 text-[0.72rem] leading-relaxed">
                  <strong>CANNOT cross placenta</strong>. Detection in neonatal blood confirms <em>active direct fetal infection</em>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>IgG (~150 kDa Monomer)</span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 text-[0.72rem] leading-relaxed">
                  <strong>CROSSES placenta via FcRn</strong>. Confers secondary maternal immunity to fetus.
                </p>
              </div>
            </div>

            {/* IgG Avidity Rule Box */}
            <div className="p-3.5 rounded-2xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900/80 space-y-2 text-xs shadow-sm">
              <div className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>3-Month Maturation & IgG Avidity Index Interpretation</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
                  <div className="font-bold text-xs">&lt;30% Avidity</div>
                  <div className="text-[0.6rem] text-zinc-600 dark:text-zinc-300 mt-0.5">Recent (&lt;3 months)</div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                  <div className="font-bold text-xs">&gt;60% Avidity</div>
                  <div className="text-[0.6rem] text-zinc-600 dark:text-zinc-300 mt-0.5">Past (&gt;3 months)</div>
                </div>
              </div>
            </div>

            {/* Critical Rules Stack */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 text-[0.72rem] text-zinc-800 dark:text-zinc-200">
                <span className="font-bold text-amber-700 dark:text-amber-400">EMBRYOGENESIS CRITICAL WINDOW: </span>
                Fetus is most vulnerable during organogenesis (<strong className="underline text-amber-800 dark:text-amber-300">Weeks 3 to 8–12 post-fertilization</strong>).
              </div>

              <div className="p-3 rounded-2xl bg-purple-500/10 border-l-4 border-purple-500 text-[0.72rem] text-zinc-800 dark:text-zinc-200">
                <span className="font-bold text-purple-700 dark:text-purple-400">AMNIOCENTESIS PCR TIMING RULE: </span>
                Amniotic fluid PCR is accurate <strong className="underline text-purple-800 dark:text-purple-300">after 18–20 weeks of gestation</strong> AND <strong className="underline text-purple-800 dark:text-purple-300">≥6–8 weeks post-maternal infection</strong>.
              </div>

              <div className="p-3 rounded-2xl bg-cyan-500/10 border-l-4 border-cyan-500 text-[0.72rem] text-zinc-800 dark:text-zinc-200">
                <span className="font-bold text-cyan-700 dark:text-cyan-400">RECURRENT PREGNANCY LOSS RULE: </span>
                TORCH screening is <strong className="underline text-cyan-800 dark:text-cyan-300">NOT recommended for recurrent pregnancy loss</strong>.
              </div>
            </div>

            {/* Mobile-Safe 3D Transplacental Simulation */}
            <div className="space-y-1.5">
              <Transplacental3D />
            </div>

            {/* USG Indications Matrix (Table 2) */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 space-y-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm transition-colors">
              <div className="flex items-center justify-between font-bold text-cyan-600 dark:text-cyan-400">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  Presumptive USG Indications (Table 2)
                </span>
              </div>

              <div className="space-y-2 text-[0.72rem]">
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80">
                  <strong className="text-purple-600 dark:text-purple-400">Cranial Signs:</strong> Ventriculomegaly, periventricular pseudocysts, intracranial calcifications, vermian hypoplasia, lissencephaly.
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80">
                  <strong className="text-amber-600 dark:text-amber-400">Extracranial Signs:</strong> SGA, hyperechogenic bowel, hepatic calcifications, ascites, hydrops, <strong>MCA-PSV &gt; 1.5 MoM</strong> (fetal anemia).
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80">
                  <strong className="text-emerald-600 dark:text-emerald-400">Placental Signs:</strong> Placentomegaly, calcifications, oligohydramnios / polyhydramnios.
                </div>
              </div>
            </div>

            {/* Section Stepper Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setActiveTab("pathogens");
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="flex items-center gap-2 rounded-xl bg-zinc-950 text-white dark:bg-cyan-500/10 dark:border dark:border-cyan-500/30 dark:text-cyan-400 px-4 py-2.5 text-xs font-black hover:bg-black dark:hover:bg-cyan-500/20 active:scale-95 transition-all w-full sm:w-auto justify-center"
              >
                <span>Continue to Section 2: Pathogen Matrix</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================================
           TAB 2: COMPREHENSIVE PATHOGEN MATRIX
           ========================================================================= */}
        {activeTab === "pathogens" && searchQuery === "" && (
          <section className="space-y-4 animate-fadeIn">
            
            {/* Filter Badges */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedPathogen("all")}
                className={`px-2.5 py-1 rounded-lg text-[0.68rem] font-bold transition-all whitespace-nowrap ${
                  selectedPathogen === "all" ? "bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black" : "bg-white text-zinc-600 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"
                }`}
              >
                All (7)
              </button>
              {pathogensData.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPathogen(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[0.68rem] font-bold transition-all whitespace-nowrap ${
                    selectedPathogen === p.id ? "bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black" : "bg-white text-zinc-600 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Pathogens Cards Stack */}
            <div className="space-y-4">
              {filteredPathogens.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-6 space-y-3 dark:border-zinc-800 dark:bg-zinc-900/80 shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} font-black text-sm text-white border shadow-inner`}>
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-zinc-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-[0.65rem] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                          {item.organism} • {item.type}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Micro Grid for Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[0.72rem]">
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
                      <div className="font-bold text-blue-600 dark:text-blue-400">Transmission & Vector</div>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">{item.transmission}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                      <div className="font-bold text-amber-700 dark:text-amber-400">Pathognomonic Triad</div>
                      <p className="text-zinc-800 dark:text-zinc-200 font-bold leading-relaxed">{item.classicTriad}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
                      <div className="font-bold text-cyan-600 dark:text-cyan-400">USG & MRI Signs</div>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">{item.usgSigns}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400">Treatment Protocol</div>
                      <p className="text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed">{item.treatment}</p>
                    </div>
                  </div>

                  {/* Exam Pearl */}
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[0.7rem] text-zinc-800 dark:text-zinc-200">
                    <span className="font-bold text-cyan-700 dark:text-cyan-400">Exam Pearl: </span>
                    {item.keyPearls}
                  </div>
                </div>
              ))}
            </div>

            {/* Section Stepper Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setActiveTab("matrix");
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="flex items-center gap-2 rounded-xl bg-zinc-950 text-white dark:bg-cyan-500/10 dark:border dark:border-cyan-500/30 dark:text-cyan-400 px-4 py-2.5 text-xs font-black hover:bg-black dark:hover:bg-cyan-500/20 active:scale-95 transition-all w-full sm:w-auto justify-center"
              >
                <span>Continue to Section 3: Side-by-Side Table</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================================
           TAB 3: SIDE-BY-SIDE PATHOGEN TABLE
           ========================================================================= */}
        {activeTab === "matrix" && searchQuery === "" && (
          <section className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <span className="font-black text-zinc-900 dark:text-white">Side-by-Side Pathogen Matrix</span>
              <span className="text-[0.65rem] font-bold">← Scroll horizontally on mobile →</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm">
              <table className="w-full text-left text-[0.72rem] text-zinc-700 dark:text-zinc-300 min-w-[650px]">
                <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 font-black uppercase tracking-wider text-[0.6rem] text-zinc-800 dark:text-zinc-200">
                  <tr>
                    <th className="p-3">Pathogen</th>
                    <th className="p-3">Genome</th>
                    <th className="p-3">Calcification</th>
                    <th className="p-3">Pathognomonic Triad</th>
                    <th className="p-3">First-Line Treatment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">Toxoplasmosis</td>
                    <td className="p-3">Protozoan</td>
                    <td className="p-3 text-amber-700 dark:text-amber-400 font-bold">Diffuse Parenchymal</td>
                    <td className="p-3">Sabin Triad</td>
                    <td className="p-3">&lt;18w: Spiramycin. &ge;18w: Pyrimethamine+Sulfadiazine</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">Syphilis</td>
                    <td className="p-3">Spirochete</td>
                    <td className="p-3">Intrahepatic</td>
                    <td className="p-3">Snuffles, Wimberger sign, Hutchinson teeth</td>
                    <td className="p-3">Benzathine Penicillin G 2.4 MU IM</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-purple-600 dark:text-purple-400">Rubella</td>
                    <td className="p-3">ssRNA Virus</td>
                    <td className="p-3">Microcephaly</td>
                    <td className="p-3">PDA + Cataracts + Hearing Loss (Gregg Triad)</td>
                    <td className="p-3">MMR Pre-conception (Contraindicated in pregnancy!)</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-cyan-600 dark:text-cyan-300">CMV</td>
                    <td className="p-3">dsDNA Virus</td>
                    <td className="p-3 text-cyan-600 dark:text-cyan-400 font-bold">Strictly PERIVENTRICULAR</td>
                    <td className="p-3">Periventricular calcification + Microcephaly + Deafness</td>
                    <td className="p-3">Neonatal Valganciclovir (within 4w of birth x 6 mos)</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-rose-600 dark:text-rose-400">HSV-1 &amp; HSV-2</td>
                    <td className="p-3">dsDNA Virus</td>
                    <td className="p-3">Hydranencephaly</td>
                    <td className="p-3">SEM vesicles + Temporal Encephalitis</td>
                    <td className="p-3">Suppressive Acyclovir 400mg TDS from 36w until delivery</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400">Parvovirus B19</td>
                    <td className="p-3">ssDNA Virus</td>
                    <td className="p-3">None</td>
                    <td className="p-3 text-amber-700 dark:text-amber-300 font-bold">Non-Immune Fetal Hydrops + MCA-PSV &gt; 1.5 MoM</td>
                    <td className="p-3">Intrauterine Fetal Blood Transfusion (IUT)</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Varicella (VZV)</td>
                    <td className="p-3">dsDNA Virus</td>
                    <td className="p-3">Cerebral</td>
                    <td className="p-3">Cicatricial Skin Scarring + Limb Hypoplasia</td>
                    <td className="p-3">Post-exposure VZIG within 10 days + Oral Acyclovir</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section Stepper Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setActiveTab("algorithm");
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="flex items-center gap-2 rounded-xl bg-zinc-950 text-white dark:bg-cyan-500/10 dark:border dark:border-cyan-500/30 dark:text-cyan-400 px-4 py-2.5 text-xs font-black hover:bg-black dark:hover:bg-cyan-500/20 active:scale-95 transition-all w-full sm:w-auto justify-center"
              >
                <span>Continue to Section 4: Diagnostic &amp; 3D MRI</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================================
           TAB 4: DIAGNOSTIC SEROLOGY & 3D MRI
           ========================================================================= */}
        {activeTab === "algorithm" && searchQuery === "" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* 3D Brain MRI Visualizer (Lg: 5 cols) */}
              <div className="lg:col-span-5 space-y-2">
                <FetalBrain3D />
                <div className="p-3 rounded-xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 text-[0.7rem] text-zinc-700 dark:text-zinc-300 shadow-sm">
                  <strong className="text-purple-600 dark:text-purple-400">Diagnostic Key: </strong>
                  Diffusely scattered calcifications indicate <em>Toxoplasmosis</em>, while strictly periventricular calcifications suggest <em>CMV</em>.
                </div>
              </div>

              {/* Interactive Diagnostic Algorithm (Lg: 7 cols) */}
              <div className="lg:col-span-7">
                <DiagnosticAlgorithm />
              </div>
            </div>

            {/* Section Stepper Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setActiveTab("flashcards");
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="flex items-center gap-2 rounded-xl bg-zinc-950 text-white dark:bg-cyan-500/10 dark:border dark:border-cyan-500/30 dark:text-cyan-400 px-4 py-2.5 text-xs font-black hover:bg-black dark:hover:bg-cyan-500/20 active:scale-95 transition-all w-full sm:w-auto justify-center"
              >
                <span>Continue to Section 5: High-Yield Exam Q&amp;A</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================================
           TAB 5: HIGH-YIELD Q&A FLASHCARDS (24 COMPREHENSIVE TEXTBOOK CARDS)
           ========================================================================= */}
        {activeTab === "flashcards" && searchQuery === "" && (
          <section className="space-y-4 animate-fadeIn">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                    High-Yield Textbook Exam Q&amp;A
                  </h2>
                  <p className="text-[0.68rem] font-medium text-zinc-500 dark:text-zinc-400">
                    24 Question &amp; Answer Flashcards extracted directly from Chapter 20 PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[0.65rem] font-extrabold text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/30">
                  24 Q&amp;A Cards
                </span>
                <button
                  onClick={() => setShowAllAnswers(!showAllAnswers)}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-[0.68rem] font-bold text-zinc-800 dark:text-zinc-200 hover:border-cyan-500/40 transition-all active:scale-95"
                >
                  <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  <span>{showAllAnswers ? "Hide All Answers" : "Reveal All Answers"}</span>
                </button>
              </div>
            </div>

            {/* Q&A Topic Filter Bar */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {["all", "General Principles", "Toxoplasmosis", "Syphilis", "Rubella", "CMV", "HSV", "Parvovirus B19", "Varicella"].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setQnaTopic(topic)}
                  className={`px-2.5 py-1 rounded-xl text-[0.68rem] font-bold transition-all whitespace-nowrap ${
                    qnaTopic === topic
                      ? "bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black font-black shadow-sm"
                      : "bg-white text-zinc-600 border border-zinc-200 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:text-zinc-200 dark:border-zinc-800/80"
                  }`}
                >
                  {topic === "all" ? "All Topics (24)" : topic}
                </button>
              ))}
            </div>

            {/* Q&A Flashcard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {flashcardsData
                .filter((card) => qnaTopic === "all" || card.topic === qnaTopic)
                .map((card, idx) => {
                  const isFlipped = showAllAnswers || flippedCard === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setFlippedCard(isFlipped && !showAllAnswers ? null : idx)}
                      className={`min-h-[160px] cursor-pointer rounded-2xl border p-4 transition-all hover:scale-[1.01] active:scale-95 flex flex-col justify-between ${
                        isFlipped
                          ? "border-cyan-500/50 bg-white dark:bg-zinc-900/95 shadow-md"
                          : "border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[0.62rem] font-bold">
                          <span className="text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            #{idx + 1} • {card.topic}
                          </span>
                          <span className="text-zinc-500 font-mono">
                            {isFlipped ? "ANSWER" : "QUESTION"}
                          </span>
                        </div>

                        <p className="text-[0.75rem] font-extrabold text-zinc-900 dark:text-white leading-snug">
                          {card.q}
                        </p>
                      </div>

                      {isFlipped ? (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[0.72rem] font-bold text-cyan-800 dark:text-cyan-300 leading-relaxed animate-fadeIn">
                          {card.a}
                        </div>
                      ) : (
                        <div className="mt-2.5 flex items-center justify-between text-[0.65rem] font-bold text-zinc-500 dark:text-zinc-400">
                          <span>Tap to reveal answer</span>
                          <ChevronRight className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Stepper Return to Section 1 */}
            <div className="pt-3 flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-[0.68rem] text-zinc-500 dark:text-zinc-400 font-bold">
                Completed 24 High-Yield Medical Q&amp;As
              </span>
              <button
                onClick={() => {
                  setActiveTab("overview");
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="flex items-center gap-1.5 rounded-xl bg-zinc-950 text-white dark:bg-cyan-500/10 dark:border dark:border-cyan-500/30 dark:text-cyan-400 px-3.5 py-2 text-xs font-black hover:bg-black dark:hover:bg-cyan-500/20 active:scale-95 transition-all"
              >
                <span>Back to Section 1: Foundational Rules</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </section>
        )}

      </main>
    </div>
  );
}
