'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AbilitySlot, CombatState, UnitInstance } from '@/lib/game/types';
import { CONSUMABLES } from '@/lib/game/constants';

interface CombatViewProps {
  combat: CombatState;
  autoRepeatEnabled: boolean;
  stopOnInventoryFull: boolean;
  inventoryCount: number;
  inventoryLimit: number;
  onProcessTick: () => void;
  onUseAbility: (slot: AbilitySlot) => void;
  onUseConsumable: (consumableId: string) => void;
  onCollectRewards: () => void;
  onEndCombat: () => void;
  onToggleAutoRepeat: () => void;
  onToggleStopOnInventoryFull: () => void;
}

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'damage' | 'heal' | 'poison' | 'crit';
  unitId: string;
}

export const CombatView: React.FC<CombatViewProps> = ({
  combat,
  autoRepeatEnabled,
  stopOnInventoryFull,
  inventoryCount,
  inventoryLimit,
  onProcessTick,
  onUseAbility,
  onUseConsumable,
  onCollectRewards,
  onEndCombat,
  onToggleAutoRepeat,
  onToggleStopOnInventoryFull,
}) => {
  const [isEngaged, setIsEngaged] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const defeatProcessed = useRef(false);
  const lastProcessedTick = useRef(-1);

  // Handle floating texts from new history entries
  useEffect(() => {
    if (combat.history.length === 0) return;
    
    const latest = combat.history[0];
    // If it's a new entry (we assume history is prepended or we track last seen index)
    // Actually useGameLoop prepends history.
    // We'll check if the first entry is different from what we last saw.
    // A better way is to check the tick or just handle the latest if it just appeared.
    
    const newEntries = combat.history.slice(0, 5).filter(entry => entry.tick >= combat.tickCount - 1);
    
    // To avoid duplicates if the effect runs multiple times for same state
    // we could track processed messages or just use a simple heuristic.
    // Let's just track the last tick we processed fully.
    
    const texts: FloatingText[] = [];
    combat.history.slice(0, 10).forEach((entry, idx) => {
      // Only process entries from current or previous tick that have damage
      if (entry.damage === 0) return;
      if (entry.tick < combat.tickCount - 1) return;
      
      // Basic deduplication using message + tick + target
      const id = `${entry.tick}-${entry.targetId}-${entry.damage}-${idx}`;
      if (floatingTexts.some(ft => ft.id === id)) return;

      let type: FloatingText['type'] = 'damage';
      if (entry.damage < 0) type = 'heal';
      else if (entry.isCritical) type = 'crit';
      else if (entry.damageType === 'poison') type = 'poison';

      texts.push({
        id,
        text: Math.abs(entry.damage).toString(),
        type,
        unitId: entry.targetId,
        x: Math.random() * 40 - 20, // offset
        y: Math.random() * 20 - 10,
      });
    });

    if (texts.length > 0) {
      setFloatingTexts(prev => [...prev, ...texts].slice(-20));
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(ft => !texts.some(t => t.id === ft.id)));
      }, 1000);
    }
  }, [combat.history, combat.tickCount]);

  useEffect(() => {
    setIsEngaged(false);
    defeatProcessed.current = false;
  }, [combat.levelId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEngaged && combat.status === 'ongoing') {
      interval = setInterval(() => {
        onProcessTick();
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isEngaged, combat.status, onProcessTick]);

  useEffect(() => {
    if (!isEngaged || combat.status !== 'ongoing') return;

    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      
      if (['1', '2', '3', '4', '5'].includes(event.key)) {
        event.preventDefault();
        onUseAbility(Number(event.key) as AbilitySlot);
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        onUseAbility('F');
      } else if (event.key.toLowerCase() === 'q') {
        event.preventDefault();
        onUseConsumable('hp_potion');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEngaged, combat.status, onUseAbility, onUseConsumable]);

  useEffect(() => {
    if ((combat.status !== 'ongoing' || isEngaged) && combat.status !== 'victory') return;

    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.code !== 'Space') return;

      event.preventDefault();

      if (combat.status === 'ongoing' && !isEngaged) {
        setIsEngaged(true);
        return;
      }

      if (combat.status === 'victory') {
        onCollectRewards();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [combat.status, isEngaged, onCollectRewards]);

  useEffect(() => {
    if (combat.status !== 'defeat' || defeatProcessed.current) return;

    defeatProcessed.current = true;
    const timeout = setTimeout(() => {
      onEndCombat();
    }, 1500); // Faster defeat screen (was 3000)

    return () => clearTimeout(timeout);
  }, [combat.status, onEndCombat]);

  useEffect(() => {
    if (!autoRepeatEnabled || combat.status !== 'victory') return;

    const timeout = setTimeout(() => {
      onCollectRewards();
    }, 350);

    return () => clearTimeout(timeout);
  }, [autoRepeatEnabled, combat.status, onCollectRewards]);

  const renderUnit = (unit: UnitInstance, isHero = false) => {
    const healthPercent = Math.max(0, (unit.stats.hp / unit.maxHp) * 100);
    const isDead = unit.stats.hp <= 0;
    const readiness =
      unit.attackInterval > 0
        ? Math.min(1, (unit.attackInterval - unit.ticksUntilAttack) / unit.attackInterval)
        : 0;
    const isReady = unit.ticksUntilAttack <= 0;

    const isMagic = unit.type === 'mage' || unit.type === 'healer';
    const unitId = isHero ? 'hero' : unit.instanceId;
    const unitTexts = floatingTexts.filter(ft => ft.unitId === unitId);

    return (
      <div
        key={unit.instanceId}
        className={`relative flex flex-col rounded-2xl border-4 p-4 transition-all ${
          isHero ? 'w-full max-w-2xl bg-primary/5 border-primary/20' : 'w-full max-w-sm bg-destructive/5 border-destructive/20'
        } ${
          isDead
            ? 'opacity-30 grayscale border-border'
            : isReady
              ? 'ring-4 ring-amber-500/30 border-amber-500/50'
              : ''
        }`}
      >
        {/* Floating Texts */}
        <div className="absolute inset-0 pointer-events-none">
          {unitTexts.map(ft => (
            <div
              key={ft.id}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-float-up font-black text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${
                ft.type === 'crit' ? 'text-amber-400 text-4xl scale-125' :
                ft.type === 'heal' ? 'text-emerald-400' :
                ft.type === 'poison' ? 'text-lime-400' : 'text-red-500'
              }`}
              style={{ marginLeft: `${ft.x}px`, marginTop: `${ft.y}px` }}
            >
              {ft.type === 'heal' ? '+' : ''}{ft.text}
            </div>
          ))}
        </div>

        <div className="mb-3 flex items-end justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center rounded-2xl border-2 bg-card shadow-lg ${isHero ? 'h-24 w-24 text-6xl border-primary/30' : 'h-16 w-16 text-4xl border-destructive/30'}`}>
              <span className={isDead ? 'grayscale' : ''}>{isHero ? '👤' : unit.icon}</span>
            </div>
            <div>
              <div className={`font-black uppercase tracking-tighter italic leading-none ${isHero ? 'text-3xl text-primary' : 'text-xl text-destructive'}`}>
                {isHero ? unit.name : unit.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{unit.type}</span>
                {unit.isPoisoned && !isDead && (
                  <span className="text-xs animate-pulse bg-lime-500/20 text-lime-400 px-1.5 py-0.5 rounded border border-lime-500/30 font-black">POISONED</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Readiness</div>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted mt-1 border border-border/50">
              <div
                className={`h-full transition-all duration-150 ${isReady ? 'animate-pulse bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-amber-500/50'}`}
                style={{ width: `${readiness * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cinematic Health Bar */}
        <div className="relative mb-2">
          <div className={`h-8 w-full overflow-hidden rounded-xl border-2 bg-muted shadow-inner ${isHero ? 'border-primary/30' : 'border-destructive/30'}`}>
            <div
              className={`h-full transition-all duration-300 relative ${
                isHero 
                  ? (healthPercent > 50 ? 'bg-emerald-500' : healthPercent > 20 ? 'bg-amber-500' : 'bg-red-600')
                  : 'bg-red-600'
              }`}
              style={{ width: `${healthPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-30" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center font-black text-xs uppercase tracking-[0.2em] drop-shadow-sm">
            {Math.ceil(unit.stats.hp)} / {unit.maxHp} HP
          </div>
        </div>

        {!isHero && (
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
            <span>ATK {unit.stats.atk || unit.stats.matk}</span>
            <span>DEF {unit.stats.def}</span>
            <span>SPD {unit.attackInterval}t</span>
          </div>
        )}
      </div>
    );
  };

  const hero = combat.playerArmy[0];
  const abilities = [...combat.abilities].sort((a, b) => a.slot - b.slot);
  const logEntries = combat.history;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Cinematic Combat Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[600px] bg-gradient-to-b from-background via-muted/5 to-background rounded-3xl border-2 border-border/50 p-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Enemies Section */}
        <div className="w-full flex flex-wrap justify-center gap-4 animate-in slide-in-from-top duration-700">
          {combat.enemyArmy.map((enemy) => renderUnit(enemy))}
        </div>

        {/* VS Divider */}
        <div className="flex items-center gap-8 w-full max-w-4xl px-12">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-border to-border" />
          <div className="relative">
            <div className="text-5xl font-black italic tracking-tighter text-muted-foreground/20 absolute -top-4 -left-4 select-none">VERSUS</div>
            <div className="bg-background border-4 border-border px-8 py-2 rounded-2xl text-3xl font-black italic text-foreground relative z-10 shadow-2xl rotate-[-2deg]">VS</div>
          </div>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-border to-border" />
        </div>

        {/* Hero Section */}
        <div className="w-full flex justify-center animate-in slide-in-from-bottom duration-700">
          {hero && renderUnit(hero, true)}
        </div>

        {/* Floating Controls for Hero */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-4 bg-card/80 backdrop-blur-md p-6 rounded-3xl border-2 border-primary/20 shadow-2xl">
          {/* Abilities Row */}
            <div className="flex flex-col items-center gap-1 w-full">
              <div className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1">Abilities (1-5 + F)</div>
              <div className="flex flex-wrap justify-center gap-3">
                {abilities.map((ability) => {
                  const isReady = ability.unlocked && ability.cooldownRemaining === 0 && isEngaged && combat.status === 'ongoing';
                  const isCombo = ability.slot === 'F';
                  return (
                    <button
                      key={ability.id}
                      onClick={() => onUseAbility(ability.slot)}
                      disabled={!isReady}
                      className={`relative flex items-center justify-center rounded-xl border-2 transition-all ${
                        isCombo ? 'h-20 w-20 text-4xl border-fuchsia-500/50 bg-fuchsia-500/10' : 'h-16 w-16 text-3xl'
                      } ${
                        isReady
                          ? isCombo ? 'border-fuchsia-500 hover:border-fuchsia-400 hover:scale-110 shadow-lg shadow-fuchsia-500/20' : 'border-primary bg-primary/10 hover:border-primary hover:scale-110 shadow-md'
                          : 'border-border bg-muted/20 opacity-40'
                      }`}
                      title={ability.name}
                    >
                      <span>{ability.icon}</span>
                      {ability.cooldownRemaining > 0 && ability.unlocked && (
                        <span className={`absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 font-black text-primary ${isCombo ? 'text-xl' : 'text-base'}`}>
                          {ability.cooldownRemaining}
                        </span>
                      )}
                      {!ability.unlocked && (
                        <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/90 text-[10px] font-black text-muted-foreground uppercase">
                          Lv{ability.unlockLevel}
                        </span>
                      )}
                      <div className={`absolute -bottom-2 right-1 text-[8px] font-black uppercase bg-background px-1 rounded border border-border/50 ${isCombo ? 'text-fuchsia-400' : 'text-primary'}`}>
                        {ability.slot}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          <div className="h-[1px] w-full max-w-md bg-border/30" />

          {/* Consumables Row */}
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/70 mb-1">Consumables (Q for Potion)</div>
            <div className="flex flex-wrap justify-center gap-3">
              {CONSUMABLES.map((c) => {
                const count = combat.consumables[c.id] || 0;
                const canUse = count > 0 && combat.potionCooldownRemaining <= 0 && isEngaged && combat.status === 'ongoing';
                const isHp = c.id === 'hp_potion';

                return (
                  <div key={c.id} className="text-center">
                    <button
                      onClick={() => onUseConsumable(c.id)}
                      disabled={!canUse}
                      title={`${c.name}: ${c.description} (${count} left)`}
                      className={`relative flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl transition-all ${
                        canUse
                          ? 'border-emerald-500/50 bg-emerald-500/10 hover:border-emerald-500 hover:scale-110 shadow-lg'
                          : 'border-border bg-muted/20 opacity-40 grayscale'
                      }`}
                    >
                      <span>{c.icon}</span>
                      {combat.potionCooldownRemaining > 0 && count > 0 && (
                        <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 text-lg font-black text-emerald-500">
                          {combat.potionCooldownRemaining}
                        </span>
                      )}
                      <span className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white shadow-xl ring-2 ring-background ${count > 0 ? 'bg-emerald-500' : 'bg-muted-foreground opacity-50'}`}>
                        {count}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Footer / Status */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-lg">
          {combat.status === 'ongoing' ? (
            !isEngaged ? (
              <button
                onClick={() => setIsEngaged(true)}
                className="w-full rounded-2xl border-4 border-primary/20 bg-primary py-4 text-lg font-black uppercase tracking-[0.4em] text-primary-foreground shadow-[0_10px_30px_rgba(234,179,8,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] animate-pulse"
              >
                Commence Battle
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="w-full rounded-xl border-2 border-dashed border-border py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Combat Ensnared • Tick {combat.tickCount}
                </div>
                {autoRepeatEnabled && (
                  <button
                    onClick={onToggleAutoRepeat}
                    className="w-full rounded-xl border-2 border-amber-500/50 bg-amber-500/10 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 transition-all hover:bg-amber-500/20"
                  >
                    Stop Auto-Battle
                  </button>
                )}
              </div>
            )
          ) : combat.status === 'victory' ? (
            <button
              onClick={onCollectRewards}
              className="w-full rounded-2xl bg-emerald-500 py-4 text-center text-lg font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {autoRepeatEnabled ? 'Victory! Banking Spoils...' : 'Claim Victory Rewards'}
            </button>
          ) : (
            <div className="w-full rounded-2xl bg-destructive py-4 text-center text-lg font-black uppercase tracking-[0.2em] text-white shadow-xl">
              Defeated • Retreating
            </div>
          )}
        </div>
      </div>

      {/* Compact Battle Log */}
      <div className="bg-card rounded-3xl border-2 border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/10">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-50 italic">Combat Log</h3>
          <div className="text-[10px] font-black text-muted-foreground">{logEntries.length} entries</div>
        </div>
        <div className="h-40 overflow-y-auto p-4 scrollbar-hide flex flex-col-reverse">
          <div className="space-y-1.5">
            {logEntries.slice(0, 30).map((entry, index) => (
              <div key={index} className={`text-[11px] font-bold font-mono border-l-2 pl-3 ${
                entry.damage < 0 ? 'text-emerald-500 border-emerald-500/30' : 
                entry.isCritical ? 'text-amber-400 border-amber-400/30' : 
                'text-foreground/70 border-border/30'
              }`}>
                <span className="opacity-30 mr-2 text-[9px] font-black">T{entry.tick}</span>
                {entry.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {combat.status === 'defeat' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="text-center animate-in zoom-in duration-500">
            <div className="mb-6 text-9xl">💀</div>
            <h2 className="mb-2 text-7xl font-black uppercase italic tracking-tighter text-destructive drop-shadow-2xl">Defeat</h2>
            <p className="text-sm font-black uppercase tracking-[0.5em] text-muted-foreground">Returning to Safety</p>
          </div>
        </div>
      )}
    </div>
  );
};
