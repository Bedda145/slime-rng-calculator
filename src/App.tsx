import { useState, useMemo } from 'react';
import { useSlimes } from './hooks/useSlimes';
import { AVAILABLE_POTIONS, SLIME_REGISTRY } from './data/dropRates';
import type { Slime } from './types/game';
import type { SlimeType } from './services/wikiApi';

// Peripheral Assets
import LogoSlime from './assets/icons/logo-slime.png';
import IconClover from './assets/icons/icon-clover.png';
import IconDice from './assets/icons/icon-dice.png';
import ImgLuckBoost from './assets/icons/Luck_Boost.png';
import ImgUltraLuckBoost from './assets/icons/Ultra_Luck_Boost.png';

import { HelpCircle, Search, RotateCcw } from 'lucide-react';

function formatNumber(num: number | string): string {
  if (typeof num === 'string') return num;
  if (num >= 1e30) return `${(num / 1e30).toFixed(2).replace(/\.00$/, '')}No`;
  if (num >= 1e27) return `${(num / 1e27).toFixed(2).replace(/\.00$/, '')}Oc`;
  if (num >= 1e24) return `${(num / 1e24).toFixed(2).replace(/\.00$/, '')}Sp`;
  if (num >= 1e21) return `${(num / 1e21).toFixed(2).replace(/\.00$/, '')}Sx`;
  if (num >= 1e18) return `${(num / 1e18).toFixed(2).replace(/\.00$/, '')}Qi`;
  if (num >= 1e15) return `${(num / 1e15).toFixed(2).replace(/\.00$/, '')}Qd`;
  if (num >= 1e12) return `${(num / 1e12).toFixed(2).replace(/\.00$/, '')}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2).replace(/\.00$/, '')}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2).replace(/\.00$/, '')}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2).replace(/\.00$/, '')}K`;
  return num.toString();
}

function getTierStyle(tier: string): { bg: string; text: string; border: string; borderLeft: string } {
  const t = tier.toLowerCase();
  if (t === 'basic' || t === 'common') return { bg: 'bg-slate-900/60', text: 'text-slate-300', border: 'border-slate-800', borderLeft: 'border-l-slate-500' };
  if (t === 'uncommon') return { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-900/50', borderLeft: 'border-l-emerald-500' };
  if (t === 'rare') return { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-900/50', borderLeft: 'border-l-blue-500' };
  if (t === 'epic') return { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-900/50', borderLeft: 'border-l-purple-500' };
  if (t === 'legendary') return { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-900/50', borderLeft: 'border-l-amber-500' };
  if (t === 'mythic') return { bg: 'bg-pink-950/40', text: 'text-pink-400', border: 'border-pink-900/50', borderLeft: 'border-l-pink-400' };
  if (t === 'divine' || t === 'solar') return { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-900/50', borderLeft: 'border-l-cyan-400' };
  if (t === 'prismatic' || t === 'lunar') return { bg: 'bg-indigo-950/40', text: 'text-indigo-300', border: 'border-indigo-900/50', borderLeft: 'border-l-indigo-400' };
  if (t === 'transcendent' || t === 'nova') return { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-900/50', borderLeft: 'border-l-rose-500' };
  if (t === 'ethereal' || t === 'galactic') return { bg: 'bg-fuchsia-950/40', text: 'text-fuchsia-400', border: 'border-fuchsia-900/50', borderLeft: 'border-l-fuchsia-500' };
  return { bg: 'bg-red-950/30', text: 'text-red-400', border: 'border-red-900/40', borderLeft: 'border-l-red-500' };
}

export default function App() {
  const { slimes, loading } = useSlimes();
  
  const [baseLuck, setBaseLuck] = useState<number>(0);
  const [activePotion, setActivePotion] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  type SizeVariant = 'Base' | 'Big' | 'Huge';
  const [sizeVariant, setSizeVariant] = useState<SizeVariant>('Base');
  const [shinyOn, setShinyOn] = useState(false);
  const [invertedOn, setInvertedOn] = useState(false);

  // Fixed mutation multipliers (confirmed from in-game data)
  const SHINY_MULT = 250;
  const INVERTED_MULT = 2500;

  function getCombinedOdds(odds: typeof SLIME_REGISTRY[0]['odds']): number | string {
    // Start with size odds from registry
    const sizeOdds = sizeVariant === 'Big' ? odds.Big
      : sizeVariant === 'Huge' ? odds.Huge
      : odds.Base;

    if (typeof sizeOdds !== 'number') return sizeOdds;

    // Apply fixed mutation multipliers on top
    let result = sizeOdds;
    if (shinyOn)    result *= SHINY_MULT;
    if (invertedOn) result *= INVERTED_MULT;

    return Math.round(result);
  }

  function getImageKey(): SlimeType {
    if (sizeVariant === 'Huge') {
      if (shinyOn && invertedOn) return 'HugeShinyInverted';
      if (shinyOn)               return 'HugeShiny';
      if (invertedOn)            return 'HugeInverted';
      return 'Huge';
    }
    if (sizeVariant === 'Big') {
      if (shinyOn && invertedOn) return 'BigShinyInverted';
      if (shinyOn)               return 'BigShiny';
      if (invertedOn)            return 'BigInverted';
      return 'Big';
    }
    if (shinyOn && invertedOn)   return 'ShinyInverted';
    if (shinyOn)                 return 'Shiny';
    if (invertedOn)              return 'Inverted';
    return 'Base';
  }

  function buildTitle(slimeTitle: string): string {
    const parts: string[] = [];
    if (shinyOn)                    parts.push('Shiny');
    if (sizeVariant !== 'Base')     parts.push(sizeVariant);
    if (invertedOn)                 parts.push('Inverted');
    return parts.length ? `${parts.join(' ')} ${slimeTitle}` : slimeTitle;
  }

  const chosenPotion = AVAILABLE_POTIONS.find(p => p.id === activePotion);
  const potionBonus = chosenPotion?.luckBonus || 0;
  const totalLuck = Math.max(1, baseLuck + potionBonus);

  // Search filter — matches slime name or tier
  const filteredSlimes = useMemo(() => {
    if (!searchQuery.trim()) return slimes;
    const q = searchQuery.toLowerCase().trim();
    return slimes.filter((slime: Slime) => {
      const config = SLIME_REGISTRY.find(s => s.title.toLowerCase().trim() === slime.title.toLowerCase().trim());
      return (
        slime.title.toLowerCase().includes(q) ||
        config?.tier.toLowerCase().includes(q)
      );
    });
  }, [slimes, searchQuery]);

  function handleReset() {
    setBaseLuck(0);
    setActivePotion('');
    setSizeVariant('Base');
    setShinyOn(false);
    setInvertedOn(false);
    setSearchQuery('');
  }

  return (
    <div className="min-h-screen font-sans antialiased relative overflow-x-hidden">
      
      {/* BACKGROUND DEPT ELEMENTS */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <main className="mx-auto max-w-7xl px-4 py-8 w-full space-y-5 relative z-10">
        
        {/* BRAND NAVIGATION HEADER */}
        <header className="flex items-center gap-3.5 border-b border-slate-900/60 pb-4">
          <img src={LogoSlime} alt="Main Game Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-slate-100">
              Slime RNG Simulator
            </h1>
            <p className="text-xs font-semibold text-slate-400 tracking-wide mt-0.5">
              Live Wiki Multiplier Odds Dashboard
            </p>
          </div>
        </header>

        {/* TWO COLUMN GRID HOUSING */}
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 items-start">
          
          {/* COLUMN 1: LEFT SIDE CONTROL PANEL MODULES */}
          <div className="space-y-4">
            
            {/* CURRENT BASE INPUT COMPONENT */}
            <section className="bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-2xl space-y-4">
              <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <img src={IconClover} alt="Clover Icon" className="w-10 h-10 object-contain" /> 
                Luck Configuration
              </h2>

              <div className="space-y-1.5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200">Current In-Game Luck</span>
                  <span className="text-[11px] font-semibold text-slate-400">Type your current total luck counter shown on your screen</span>
                </div>
                
                <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden focus-within:border-emerald-500/40 transition-colors h-12">
                  <button 
                    type="button"
                    onClick={() => setBaseLuck(prev => Math.max(0, prev - 1))}
                    className="px-5 h-full text-lg font-black text-slate-400 hover:bg-slate-900 border-r border-slate-800/60 cursor-pointer select-none transition-colors"
                  >
                    −
                  </button>
                  <input 
                    type="number"
                    value={baseLuck === 0 ? '' : baseLuck}
                    onChange={(e) => setBaseLuck(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="flex-1 bg-transparent text-center text-base font-black text-white h-full outline-none px-2 focus:ring-0 border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setBaseLuck(prev => prev + 1)}
                    className="px-5 h-full text-lg font-black text-slate-400 hover:bg-slate-900 border-l border-slate-800/60 cursor-pointer select-none transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </section>

            {/* TEMPORARY BOOST POTIONS LAYOUT PANEL */}
            <section className="bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-2xl space-y-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">Temporary Boosts</span>
                <span className="text-[11px] font-semibold text-slate-400">Potions stacked into master system formulas</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setActivePotion('')}
                  className={`rounded-xl border flex flex-col items-center justify-center text-center p-1 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer ${
                    activePotion === '' 
                      ? 'bg-slate-950 border-slate-400 shadow-[0_4px_10px_rgba(255,255,255,0.06)]' 
                      : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[9px] font-black tracking-wider text-slate-600 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800 mb-1.5">
                    OFF
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">No Potion</span>
                  <span className="text-[9px] font-medium text-slate-500 mt-0.5">x1.0 Base</span>
                </button>

                {AVAILABLE_POTIONS.map((potion) => {
                  const isSelected = activePotion === potion.id;
                  const imgAsset = potion.colorTheme === 'purple' ? ImgUltraLuckBoost : ImgLuckBoost;

                  let borders = 'bg-slate-950/30 border-slate-800 hover:border-slate-700';
                  if (isSelected) {
                    if (potion.colorTheme === 'green') borders = 'border-emerald-400 bg-emerald-950/60 shadow-[0_4px_12px_rgba(52,211,153,0.25)]';
                    else borders = 'border-purple-400 bg-purple-950/60 shadow-[0_4px_12px_rgba(192,132,252,0.25)]';
                  }

                  return (
                    <button
                      key={potion.id}
                      type="button"
                      onClick={() => setActivePotion(potion.id)}
                      className={`h-22 rounded-xl border flex flex-col items-center justify-center text-center p-1 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer ${borders}`}
                    >
                      <img src={imgAsset} alt={potion.name} className="w-20 h-11 object-contain mb-1" />
                      <span className="text-[11px] font-black text-slate-200 truncate w-full px-0.5">{potion.name}</span>
                      <span className="text-[9px] font-black mt-0.5 text-white">
                        {potion.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* TOTAL LUCK SCORE — redesigned */}
            <div className="bg-gradient-to-r from-slate-900/95 via-emerald-950/30 to-slate-900/95 backdrop-blur-md border border-emerald-900/40 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={IconClover} alt="Clover" className="w-8 h-8 object-contain" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Luck</span>
                    <div className="text-2xl font-black tracking-tight leading-none bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                      {formatNumber(totalLuck)}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all cursor-pointer"
                  title="Reset everything"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2: RIGHT SIDE BALANCED OUTPUT FEED SECTION */}
          <section className="bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-2xl space-y-4 h-full flex flex-col">
            
            {/* OUTPUT CONTROL ACTIONS BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
              <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <img src={IconDice} alt="Dice Matrix Icon" className="w-7 h-7 object-contain" /> 
                Adjusted Odds Output Feed
              </h2> 

              {/* Layout Controls */}
              <div className="flex items-center gap-2 flex-wrap max-w-full">
                {/* Size — mutually exclusive */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                  {(['Base', 'Big', 'Huge'] as SizeVariant[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSizeVariant(v)}
                      className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        sizeVariant === v 
                          ? 'bg-slate-800 border border-slate-700 text-white shadow-md' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                {/* Modifiers — independent toggles */}
                <button
                  type="button"
                  onClick={() => setShinyOn(s => !s)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all border cursor-pointer ${
                    shinyOn
                      ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  ✦ Shiny
                </button>

                <button
                  type="button"
                  onClick={() => setInvertedOn(i => !i)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all border cursor-pointer ${
                    invertedOn
                      ? 'bg-violet-500/15 border-violet-400 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  ✦ Inverted
                </button>
              </div>
            </div>

            {/* SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search slimes by name or tier..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500/40 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 text-xs font-black cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-32 text-center text-slate-400 text-xs font-black tracking-wider animate-pulse flex-1 flex items-center justify-center">
                Connecting to live MediaWiki data endpoints...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 overflow-y-auto pr-2 border border-slate-950/40 p-1.5 rounded-xl bg-slate-950/30 custom-feed-scrollbar h-[600px]">
                {filteredSlimes.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 text-xs font-bold">
                    No slimes found matching "{searchQuery}"
                  </div>
                ) : (
                  filteredSlimes.map((slime: Slime) => {
                    const config = SLIME_REGISTRY.find(s => s.title.toLowerCase().trim() === slime.title.toLowerCase().trim());
                    if (!config) return null;

                    const style = getTierStyle(config.tier);
                    
                    const exactBaseOdds = getCombinedOdds(config.odds);
                    const isNumericOdds = typeof exactBaseOdds === 'number';
                    const adjustedOdds = isNumericOdds 
                      ? Math.max(1, Math.round((exactBaseOdds as number) / totalLuck)) 
                      : null;
                    const formattedTitle = buildTitle(slime.title);

                    return (
                      <div 
                        key={slime.title} 
                        className={`bg-slate-950/60 p-2.5 rounded-xl border border-slate-900/60 border-l-4 ${style.borderLeft} flex items-center justify-between shadow-sm group hover:border-slate-800 hover:scale-[1.005] transition-all duration-200`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden p-0.5">
                            {slime.imageUrls ? (
                              <img 
                                src={
                                  slime.imageUrls?.[getImageKey()]
                                  ?? slime.imageUrls?.[sizeVariant !== 'Base' ? sizeVariant : invertedOn ? 'Inverted' : shinyOn ? 'Shiny' : 'Base']
                                  ?? slime.imageUrls?.Base
                                } 
                                alt={slime.title} 
                                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-200" 
                              />
                            ) : (
                              <HelpCircle className="w-4 h-4 text-slate-800" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-slate-200 text-xs tracking-wide">{formattedTitle}</h3>
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 border rounded-md ${style.bg} ${style.text} ${style.border}`}>
                                {config.tier}
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                              Base: {isNumericOdds ? `1 / ${formatNumber(exactBaseOdds)}` : exactBaseOdds}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-emerald-400 font-mono font-black text-sm tracking-tight">
                            {isNumericOdds ? `1 / ${formatNumber(adjustedOdds!)}` : exactBaseOdds}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1 justify-end">
                            <img src={IconDice} alt="" className="w-3 h-3 object-contain opacity-60" />
                            <span className="text-slate-300 font-extrabold">{adjustedOdds ? adjustedOdds.toLocaleString() : "—"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}