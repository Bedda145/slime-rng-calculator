import { useState } from 'react';
import { useSlimes } from './hooks/useSlimes';
import { AVAILABLE_POTIONS, SLIME_REGISTRY } from './data/dropRates';
import type { Slime } from './types/game';

// Peripheral Assets
import LogoSlime from './assets/icons/logo-slime.png';
import IconClover from './assets/icons/icon-clover.png';
import IconDice from './assets/icons/icon-dice.png';
import ImgLuckBoost from './assets/icons/Luck_Boost.png';
import ImgUltraLuckBoost from './assets/icons/Ultra_Luck_Boost.png';

import { HelpCircle } from 'lucide-react';

function formatNumber(num: number | string): string {
  if (typeof num === 'string') return num;
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
  
  // Fixed: Reset standard initialization baseline state from 226600 to 0
  const [baseLuck, setBaseLuck] = useState<number>(0);
  const [activePotion, setActivePotion] = useState<string>('ultra');

  // Math Conversion Matrix: Base Luck Input + Potion Bonus
  const chosenPotion = AVAILABLE_POTIONS.find(p => p.id === activePotion);
  const potionBonus = chosenPotion?.luckBonus || 0;
  
  // Guard against calculation division errors if overall parameters sit at 0
  const totalLuck = Math.max(1, baseLuck + potionBonus);

  return (
    <div className="min-h-screen px-4 py-8 font-sans antialiased relative overflow-x-hidden">
      
      {/* BACKGROUND FLOATING GRADIENT LIGHTS */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Fixed Tailwind v4 Class warning: max-w-[1300px] -> max-w-325 */}
      <div className="max-w-325 mx-auto space-y-5 relative z-10">
        
        {/* APP HEADER CONTENT */}
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

        {/* SIDE-BY-SIDE INTERFACE CONTAINER GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-5 items-start">
          
          {/* CONTROL MODULE CONSOLES */}
          <div className="space-y-4">
            
            {/* CORE LUCK FORM BLOCK */}
            <section className="bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-2xl space-y-4">
              <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <img src={IconClover} alt="Clover Vector" className="w-5 h-5 object-contain" /> 
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

            {/* POTIONS BOOSTER BLOCKS */}
            <section className="bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-2xl space-y-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">Temporary Boosts</span>
                <span className="text-[11px] font-semibold text-slate-400">Potions stacked into master system formulas</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActivePotion('')}
                  className={`h-22 rounded-xl border flex flex-col items-center justify-center text-center p-1 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer ${
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
                    if (potion.colorTheme === 'green') borders = 'border-emerald-400 shadow-[0_4px_12px_rgba(52,211,153,0.2)] bg-slate-950';
                    else borders = 'border-purple-400 shadow-[0_4px_12px_rgba(192,132,252,0.2)] bg-slate-950';
                  }

                  return (
                    <button
                      key={potion.id}
                      type="button"
                      onClick={() => setActivePotion(potion.id)}
                      className={`h-22 rounded-xl border flex flex-col items-center justify-center text-center p-1 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer ${borders}`}
                    >
                      <img src={imgAsset} alt={potion.name} className="w-7 h-7 object-contain mb-1" />
                      <span className="text-[11px] font-black text-slate-200 truncate w-full px-0.5">{potion.name}</span>
                      <span className={`text-[9px] font-black mt-0.5 ${
                        potion.colorTheme === 'green' ? 'text-emerald-400' : 'text-purple-400'
                      }`}>
                        {potion.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* TOTAL INTEGRATED CALCULATOR SCORE COMPONENT CONTAINER */}
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800/80 rounded-xl py-3 px-4 flex items-center justify-between shadow-lg h-12">
              <div className="flex items-center gap-2">
                <img src={IconClover} alt="Global Clover Indicator" className="w-5 h-5 object-contain" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Combined Luck Score</span>
              </div>
              <div className="text-xl font-black text-yellow-400 tracking-tight pr-1 leading-none h-full flex items-center">
                {formatNumber(totalLuck)}
              </div>
            </div>
          </div>

          {/* RIGHT VIEW TILES: SCROLL FEED DATA PORTAL */}
          {/* Fixed Tailwind class warning: max-h-[420px] -> max-h-105 */}
          <section className="bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-2xl space-y-3 h-full flex flex-col">
            <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <img src={IconDice} alt="Dice Matrix Icon" className="w-5 h-5 object-contain" /> 
              Adjusted Odds Output Feed
            </h2>

            {loading ? (
              <div className="py-32 text-center text-slate-400 text-xs font-black tracking-wider animate-pulse flex-1 flex items-center justify-center">
                Connecting to MediaWiki pageimage redirects dataset...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 overflow-y-auto pr-1 border border-slate-950/40 p-1.5 rounded-xl bg-slate-950/30 custom-feed-scrollbar max-h-105">
                {slimes.map((slime: Slime) => {
                  const config = SLIME_REGISTRY.find(s => s.title.toLowerCase().trim() === slime.title.toLowerCase().trim());
                  if (!config) return null;

                  const style = getTierStyle(config.tier);
                  const isNumericOdds = typeof config.baseOdds === 'number';
                  
                  const adjustedOdds = isNumericOdds 
                    ? Math.max(1, Math.round((config.baseOdds as number) / totalLuck)) 
                    : null;

                  return (
                    <div 
                      key={slime.title} 
                      className={`bg-slate-950/60 p-2.5 rounded-xl border border-slate-900/60 border-l-4 ${style.borderLeft} flex items-center justify-between shadow-sm group hover:border-slate-800 hover:scale-[1.005] transition-all duration-200`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden p-0.5">
                          {slime.imageUrl ? (
                            <img 
                              src={slime.imageUrl} 
                              alt={slime.title} 
                              className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-200" 
                            />
                          ) : (
                            <HelpCircle className="w-4 h-4 text-slate-800" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-slate-200 text-xs tracking-wide">{slime.title}</h3>
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 border rounded-md ${style.bg} ${style.text} ${style.border}`}>
                              {config.tier}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                            Base: 1 / {formatNumber(config.baseOdds)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-emerald-400 font-mono font-black text-sm tracking-tight">
                          1 / {adjustedOdds ? formatNumber(adjustedOdds) : formatNumber(config.baseOdds)}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                          Expected: <span className="text-slate-300 font-extrabold">{adjustedOdds ? adjustedOdds.toLocaleString() : "—"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}