'use client';

import React from 'react';
import { LEVELS } from '@/lib/game/constants';
import { useSelectionScroll } from '@/lib/game/useSelectionScroll';

interface LevelSelectionProps {
  unlockedLevels: string[];
  completedLevels: string[];
  autoRepeatEnabled: boolean;
  stopOnInventoryFull: boolean;
  inventoryCount: number;
  inventoryLimit: number;
  onStartCombat: (levelId: string) => void;
  onToggleAutoRepeat: () => void;
  onToggleStopOnInventoryFull: () => void;
}

export const LevelSelection: React.FC<LevelSelectionProps> = ({
  unlockedLevels,
  completedLevels,
  autoRepeatEnabled,
  stopOnInventoryFull,
  inventoryCount,
  inventoryLimit,
  onStartCombat,
  onToggleAutoRepeat,
  onToggleStopOnInventoryFull,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const displayedLevels = LEVELS
    .filter((level) => unlockedLevels.includes(level.id))
    .sort((a, b) => b.difficulty - a.difficulty);
  const registerSelectionTarget = useSelectionScroll<HTMLDivElement>(selectedIndex, [displayedLevels.length]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      
      if (e.key.toLowerCase() === 'w') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(displayedLevels.length - 1, prev + 1));
      } else if (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'd') {
        // We don't handle A/D here, so we DON'T call preventDefault
        // This allows A/D to bubble up to the global tab switcher
      } else if (e.code === 'Space') {
        e.preventDefault();
        const level = displayedLevels[selectedIndex];
        if (level) onStartCombat(level.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayedLevels, selectedIndex, onStartCombat]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b-2 border-border pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase italic">War Map</h2>
          <p className="mt-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Configure farming before deploying. (W/S to navigate, Space to deploy)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <button
            onClick={onToggleAutoRepeat}
            className={`rounded-full border px-3 py-1 transition-colors ${
              autoRepeatEnabled
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                : 'border-border bg-muted/20 text-muted-foreground'
            }`}
          >
            Auto Repeat {autoRepeatEnabled ? 'On' : 'Off'}
          </button>
          <button
            onClick={onToggleStopOnInventoryFull}
            className={`rounded-full border px-3 py-1 transition-colors ${
              stopOnInventoryFull
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                : 'border-border bg-muted/20 text-muted-foreground'
            }`}
          >
            Stop At Full {stopOnInventoryFull ? 'On' : 'Off'}
          </button>
          <span className="rounded-full border border-border bg-muted/20 px-3 py-1 text-muted-foreground">
            Inventory {inventoryCount}/{inventoryLimit}
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {displayedLevels.map((level, index) => {
          const isCompleted = completedLevels.includes(level.id);
          const levelNumber = parseInt(level.id.replace('lvl', ''), 10);
          const shardReward = !isCompleted && levelNumber % 5 === 0 ? (levelNumber / 5) * 2 : 0;
          const isSelected = index === selectedIndex;

          return (
            <div
              key={level.id}
              ref={registerSelectionTarget(index)}
              className={`relative overflow-hidden rounded-xl border-2 p-6 shadow-sm transition-all ${
                isSelected ? 'border-primary ring-2 ring-primary/20 scale-[1.01]' : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="flex items-center gap-3 text-xl font-black uppercase italic">
                    {level.name}
                    {isCompleted && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-emerald-500">
                        Conquered
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-muted-foreground">{level.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Difficulty</div>
                  <div className="mt-1 text-lg font-black text-primary">{level.difficulty}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Coins</div>
                    <div className="text-lg font-black text-primary">{isCompleted ? Math.floor(level.rewardCoins * 0.15) : Math.floor(level.rewardCoins * 0.4)}c</div>
                  </div>
                  <div>
                    <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">XP</div>
                    <div className="text-lg font-black text-emerald-500">{isCompleted ? Math.floor(level.rewardExp * 0.15) : Math.floor(level.rewardExp * 0.4)}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Shards</div>
                    <div className="text-lg font-black text-fuchsia-500">{shardReward > 0 ? shardReward : '-'}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Enemies</div>
                    <div className="mt-1 flex -space-x-2">
                      {level.enemies.map((enemy, index) => (
                        <div
                          key={index}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-lg"
                          title={enemy.name}
                        >
                          {enemy.icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onStartCombat(level.id)}
                  className={`rounded-lg px-8 py-3 text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95 ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  Deploy Hero
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
