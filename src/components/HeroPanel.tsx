'use client';

import React, { useState } from 'react';
import { CLASS_INFO, STAT_TRAINING } from '@/lib/game/constants';
import { GameState, UnitStats } from '@/lib/game/types';
import { useSelectionScroll } from '@/lib/game/useSelectionScroll';

type TrainingPurchaseAmount = 1 | 10 | 'max';

interface HeroPanelProps {
  state: GameState;
  heroStats: UnitStats;
  onTrainStat: (statId: string, amount: TrainingPurchaseAmount) => void;
  getTrainingQuote: (statId: string, amount: TrainingPurchaseAmount) => {
    purchases: number;
    totalCost: number;
    canAfford: boolean;
  };
}

export const HeroPanel: React.FC<HeroPanelProps> = ({ state, heroStats, onTrainStat, getTrainingQuote }) => {
  const [purchaseAmount, setPurchaseAmount] = useState<TrainingPurchaseAmount>(1);
  const [selectedStatIndex, setSelectedStatIndex] = useState(0);
  const registerSelectionTarget = useSelectionScroll<HTMLDivElement>(selectedStatIndex, [STAT_TRAINING.length]);

  const purchaseOptions: { value: TrainingPurchaseAmount; label: string }[] = [
    { value: 1, label: 'x1' },
    { value: 10, label: 'x10' },
    { value: 'max', label: 'MAX' },
  ];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        e.stopImmediatePropagation();
        const currentIndex = purchaseOptions.findIndex(o => o.value === purchaseAmount);
        const nextIndex = (currentIndex - 1 + purchaseOptions.length) % purchaseOptions.length;
        setPurchaseAmount(purchaseOptions[nextIndex].value);
      } else if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        e.stopImmediatePropagation();
        const currentIndex = purchaseOptions.findIndex(o => o.value === purchaseAmount);
        const nextIndex = (currentIndex + 1) % purchaseOptions.length;
        setPurchaseAmount(purchaseOptions[nextIndex].value);
      } else if (e.key.toLowerCase() === 'w') {
        e.preventDefault();
        setSelectedStatIndex(prev => Math.max(0, prev - 1));
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setSelectedStatIndex(prev => Math.min(STAT_TRAINING.length - 1, prev + 1));
      } else if (e.code === 'Space') {
        e.preventDefault();
        const training = STAT_TRAINING[selectedStatIndex];
        const quote = getTrainingQuote(training.id, purchaseAmount);
        if (quote.canAfford) {
          onTrainStat(training.id, purchaseAmount);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [purchaseAmount, selectedStatIndex, onTrainStat, getTrainingQuote, purchaseOptions]);

  if (!state.heroClass) return null;
  const info = CLASS_INFO[state.heroClass];
  const expPct = state.heroExpToNext > 0 ? (state.heroExp / state.heroExpToNext) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b-2 border-border pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Hero Training</h2>
          <p className="mt-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Invest coins to permanently strengthen your hero. (WASD to navigate, Space to train)
          </p>
        </div>
      </div>

      <div className="rounded-xl border-2 border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-muted/20 text-5xl">
            {info.icon}
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic">{info.name}</h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-primary">{info.title}</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                LVL {state.heroLevel}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">{state.talentPoints} Talent Points</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-1 flex justify-between text-[9px] font-black uppercase text-muted-foreground">
            <span>Experience</span>
            <span>
              {state.heroExp} / {state.heroExpToNext}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border border-border/50 bg-muted">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${expPct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'HP', color: 'text-emerald-500', display: heroStats.hp.toString() },
            { label: 'ATK', color: 'text-red-500', display: heroStats.atk.toString() },
            { label: 'MATK', color: 'text-orange-500', display: heroStats.matk.toString() },
            { label: 'DEF', color: 'text-blue-500', display: heroStats.def.toString() },
            { label: 'MDEF', color: 'text-cyan-500', display: heroStats.mdef.toString() },
            { label: 'SPD', color: 'text-amber-500', display: heroStats.spd.toString() },
            { label: 'EVA', color: 'text-purple-500', display: `${(heroStats.eva * 100).toFixed(1)}%` },
            { label: 'CRIT', color: 'text-red-400', display: `${(heroStats.critChance * 100).toFixed(1)}%` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border/50 bg-muted/20 p-3 text-center">
              <div className="mb-1 text-[9px] font-black uppercase text-muted-foreground">{stat.label}</div>
              <div className={`text-xl font-black ${stat.color}`}>{stat.display}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Coin Training</h3>
          <div className="inline-flex w-fit rounded-lg border-2 border-border bg-card p-1">
            {purchaseOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setPurchaseAmount(option.value)}
                className={`rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                  purchaseAmount === option.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {STAT_TRAINING.map((training, index) => {
          const quote = getTrainingQuote(training.id, purchaseAmount);
          const count = state.statTraining[training.id] || 0;
          const purchaseLabel = purchaseAmount === 'max' ? `MAX x${quote.purchases}` : `x${purchaseAmount}`;
          const isSelected = index === selectedStatIndex;

          return (
            <div
              key={training.id}
              ref={registerSelectionTarget(index)}
              className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all ${
                isSelected ? 'border-primary ring-2 ring-primary/20 scale-[1.01] bg-card' : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{training.icon}</span>
                <div>
                  <div className="text-xs font-black uppercase">{training.label}</div>
                  <div className="text-[9px] font-bold text-muted-foreground">
                    +{training.perPurchase}
                    {training.unit || ''} per purchase (bought {count}x)
                  </div>
                </div>
              </div>

              <button
                onClick={() => onTrainStat(training.id, purchaseAmount)}
                disabled={!quote.canAfford}
                className={`rounded-lg border-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  quote.canAfford
                    ? isSelected ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-md' : 'border-primary bg-primary text-primary-foreground hover:scale-105 active:scale-95'
                    : 'cursor-not-allowed border-border bg-muted text-muted-foreground opacity-50'
                }`}
              >
                {quote.canAfford ? `${purchaseLabel} • ${quote.totalCost.toLocaleString()} coins` : `${purchaseLabel} • unavailable`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
