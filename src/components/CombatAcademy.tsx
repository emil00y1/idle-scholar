'use client';

import { TALENTS } from '@/lib/game/constants';
import { GameState, Talent } from '@/lib/game/types';

interface CombatAcademyProps {
  state: GameState;
  onBuyTalent: (talentId: string) => void;
}

export function CombatAcademy({ state, onBuyTalent }: CombatAcademyProps) {
  const tiers = [1, 2, 3, 4];
  const categories: Talent['category'][] = ['Offense', 'Defense', 'Utility'];

  const isTalentLocked = (talent: Talent) => {
    if (!talent.dependencies) return false;
    return !talent.dependencies.every((depId) => {
      const dep = TALENTS.find((t) => t.id === depId);
      const level = state.talentsOwned[depId] || 0;
      return dep && level >= dep.maxLevel;
    });
  };

  const getDependencyNames = (talent: Talent) => {
    if (!talent.dependencies) return '';
    return talent.dependencies
      .map((id) => TALENTS.find((t) => t.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="bg-card border-2 border-border p-8 space-y-12 animate-in fade-in duration-500 rounded-xl shadow-inner min-h-[800px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-2 border-border pb-6">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Tactical Mastery Tree</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-black mt-1">
            Master fundamental drills to unlock advanced battlefield doctrines.
          </p>
        </div>
        <div className="bg-primary/10 border-2 border-primary/20 rounded-xl px-6 py-3 text-right shadow-[4px_4px_0px_0px_rgba(234,179,8,0.1)]">
          <div className="text-xs text-primary font-black uppercase tracking-widest leading-none mb-1">Talent Points</div>
          <div className="text-3xl font-black text-primary">{state.talentPoints} TP</div>
        </div>
      </div>

      <div className="space-y-16">
        {tiers.map((tier) => (
          <div key={tier} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[2px] bg-border flex-1" />
              <div className="px-4 py-1 border-2 border-border rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground bg-muted/20">
                Tier {tier}{' '}
                {tier === 1 ? 'Fundamentals' : tier === 2 ? 'Specialized' : tier === 3 ? 'Advanced' : 'Mastery'}
              </div>
              <div className="h-[2px] bg-border flex-1" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {categories.map((category) => {
                const talents = TALENTS.filter((talent) => talent.tier === tier && talent.category === category);
                if (talents.length === 0) return <div key={category} className="hidden md:block" />;

                return (
                  <div key={category} className="space-y-4">
                    {talents.map((talent) => {
                      const level = state.talentsOwned[talent.id] || 0;
                      const isMaxed = level >= talent.maxLevel;
                      const isLocked = isTalentLocked(talent);
                      const cost = Math.floor(talent.baseCost * Math.pow(talent.costMultiplier, level));
                      const canAfford = state.talentPoints >= cost;

                      return (
                        <button
                          key={talent.id}
                          onClick={() => !isLocked && onBuyTalent(talent.id)}
                          disabled={isMaxed || isLocked || !canAfford}
                          className={`group relative flex w-full flex-col overflow-hidden rounded-xl border-2 p-5 text-left transition-all ${
                            isMaxed
                              ? 'border-emerald-500/30 bg-emerald-500/5'
                              : isLocked
                                ? 'cursor-not-allowed border-border/50 bg-muted/10 opacity-40 grayscale'
                                : canAfford
                                  ? 'cursor-pointer border-primary/30 bg-card hover:border-primary hover:shadow-[4px_4px_0px_0px_rgba(234,179,8,0.1)]'
                                  : 'cursor-not-allowed border-border bg-muted/20 opacity-70'
                          }`}
                        >
                          <div className="relative z-10 mb-3 flex items-start justify-between">
                            <div className="max-w-[75%]">
                              <h4
                                className={`text-xs font-black uppercase tracking-tighter italic md:text-sm ${
                                  isMaxed ? 'text-emerald-500' : 'text-foreground'
                                }`}
                              >
                                {talent.name}
                              </h4>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[9px] font-bold text-foreground">
                                  LVL {level} / {talent.maxLevel}
                                </span>
                              </div>
                            </div>
                            <div
                              className={`text-right text-sm font-black tracking-tighter ${
                                isMaxed
                                  ? 'text-emerald-600'
                                  : isLocked
                                    ? 'text-muted-foreground'
                                    : canAfford
                                      ? 'text-primary'
                                      : 'text-muted-foreground'
                              }`}
                            >
                              {isMaxed ? 'MAXED' : isLocked ? 'LOCKED' : `${cost} TP`}
                            </div>
                          </div>

                          <p className="relative z-10 mb-4 flex-1 text-[10px] font-medium leading-relaxed text-muted-foreground">
                            {talent.description}
                          </p>

                          {isLocked && (
                            <div className="mb-3 rounded border border-destructive/20 bg-destructive/5 p-2 text-[8px] font-black uppercase tracking-tighter text-destructive">
                              Requires: {getDependencyNames(talent)} (MAX)
                            </div>
                          )}

                          <div className="relative z-10 mt-auto h-1 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full transition-all duration-700 ease-out ${
                                isMaxed ? 'bg-emerald-500' : 'bg-primary'
                              }`}
                              style={{ width: `${(level / talent.maxLevel) * 100}%` }}
                            />
                          </div>

                          {talent.dependencies && !isLocked && (
                            <div className="absolute -left-1 -top-1 h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t-2 border-border pt-6 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
        <span>Strategic Doctrine Confirmed</span>
        <span className="animate-pulse text-primary/50">Tactical Advantage Active</span>
      </div>
    </div>
  );
}
