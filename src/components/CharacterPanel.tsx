'use client';

import React from 'react';
import { ARTIFACTS, CLASS_INFO, resolveAbilityLoadout } from '@/lib/game/constants';
import { computeHeroBonuses } from '@/lib/game/useGameLoop';
import { Equipment, EquipmentSlot, GameState, UnitStats } from '@/lib/game/types';

interface CharacterPanelProps {
  state: GameState;
  heroStats: UnitStats;
  onEquip: (slot: EquipmentSlot, itemId: string | null) => void;
  onSell: (itemId: string) => void;
  onSellByRarity: (rarity: Equipment['rarity']) => void;
  onSellAll: () => void;
  onToggleLock: (itemId: string) => void;
  onToggleFavorite: (itemId: string) => void;
  onToggleAutoEquipUpgrades: () => void;
  onUnlockArtifact: (artifactId: string) => void;
  onToggleArtifactEquip: (artifactId: string) => void;
}

const RARITY_VALUE: Record<Equipment['rarity'], number> = {
  Common: 100,
  Rare: 500,
  Epic: 2500,
  Relic: 10000,
  Legendary: 25000,
  Godlike: 100000,
};

const RARITY_ORDER: Record<Equipment['rarity'], number> = {
  Godlike: 0,
  Legendary: 1,
  Relic: 2,
  Epic: 3,
  Rare: 4,
  Common: 5,
};

const SLOT_ORDER: EquipmentSlot[] = ['weapon', 'armor', 'helmet', 'gloves', 'boots', 'accessory'];

const SLOT_LABELS: Record<EquipmentSlot, string> = {
  weapon: 'Weapon',
  armor: 'Armor',
  helmet: 'Helmet',
  gloves: 'Gloves',
  boots: 'Boots',
  accessory: 'Accessory',
};

export const CharacterPanel: React.FC<CharacterPanelProps> = ({
  state,
  heroStats,
  onEquip,
  onSell,
  onSellByRarity,
  onSellAll,
  onToggleLock,
  onToggleFavorite,
  onToggleAutoEquipUpgrades,
  onUnlockArtifact,
  onToggleArtifactEquip,
}) => {
  if (!state.heroClass) return null;

  const heroClass = state.heroClass;
  const heroInfo = CLASS_INFO[heroClass];
  const heroBonuses = computeHeroBonuses(state.talentsOwned, heroClass);
  const abilities = resolveAbilityLoadout(heroClass, heroBonuses.specials);
  const equippedIds = new Set(Object.values(state.equippedGear).filter((itemId): itemId is string => Boolean(itemId)));
  const lockedIds = new Set(state.lockedItemIds);
  const favoriteIds = new Set(state.favoriteItemIds);

  const getItemKey = (item: Equipment) => item.instanceId || item.id;

  const getInventoryItem = (itemId: string | null | undefined) => {
    if (!itemId) return null;
    return state.inventory.find((item) => getItemKey(item) === itemId) ?? state.inventory.find((item) => item.id === itemId) ?? null;
  };

  const unequippedInventory = state.inventory
    .filter((item) => !equippedIds.has(getItemKey(item)))
    .sort((left, right) => {
      const favoriteDelta = Number(favoriteIds.has(getItemKey(right))) - Number(favoriteIds.has(getItemKey(left)));
      if (favoriteDelta !== 0) return favoriteDelta;
      const rarityDelta = RARITY_ORDER[left.rarity] - RARITY_ORDER[right.rarity];
      if (rarityDelta !== 0) return rarityDelta;
      return left.name.localeCompare(right.name);
    });

  const commonSellableCount = unequippedInventory.filter((item) => item.rarity === 'Common' && !lockedIds.has(getItemKey(item)) && !favoriteIds.has(getItemKey(item))).length;
  const rareSellableCount = unequippedInventory.filter((item) => item.rarity === 'Rare' && !lockedIds.has(getItemKey(item)) && !favoriteIds.has(getItemKey(item))).length;
  const totalSellableCount = unequippedInventory.filter((item) => !lockedIds.has(getItemKey(item)) && !favoriteIds.has(getItemKey(item))).length;

  const getRarityColor = (rarity: Equipment['rarity']) => {
    switch (rarity) {
      case 'Godlike':
        return 'border-rose-500/50 bg-rose-500/5 text-rose-500';
      case 'Legendary':
        return 'border-orange-500/50 bg-orange-500/5 text-orange-500';
      case 'Relic':
        return 'border-amber-500/50 bg-amber-500/5 text-amber-500';
      case 'Epic':
        return 'border-fuchsia-500/50 bg-fuchsia-500/5 text-fuchsia-500';
      case 'Rare':
        return 'border-sky-500/50 bg-sky-500/5 text-sky-500';
      default:
        return 'border-slate-400/50 bg-slate-400/5 text-slate-400';
    }
  };

  const formatStatValue = (key: string, value: number) => {
    if (key === 'eva' || key === 'critChance' || key === 'lifesteal') {
      return `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;
    }
    return value > 0 ? `+${value}` : String(value);
  };

  const renderItemStats = (stats: Equipment['stats'], comparisonStats?: Equipment['stats']) =>
    Object.entries(stats).map(([key, rawValue]) => {
      const value = rawValue as number;
      const equippedValue = comparisonStats ? ((comparisonStats[key as keyof Equipment['stats']] || 0) as number) : 0;
      const diff = value - equippedValue;
      const diffColor = diff > 0 ? 'text-emerald-500' : diff < 0 ? 'text-destructive' : 'text-muted-foreground';

      return (
        <span key={key} className="mr-3 flex items-center gap-1 text-[9px] font-black uppercase tracking-wide">
          <span className="text-muted-foreground">{key}</span>
          <span>{formatStatValue(key, value)}</span>
          {comparisonStats && diff !== 0 && <span className={diffColor}>({formatStatValue(key, diff)})</span>}
        </span>
      );
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 border-b-2 border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Character</h2>
          <p className="mt-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Stats, abilities, artifacts, equipment, and inventory control.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <span className="rounded-full border border-border bg-muted/20 px-3 py-1 text-primary">
            {state.artifactShards} Artifact Shards
          </span>
          <span className="rounded-full border border-border bg-muted/20 px-3 py-1 text-muted-foreground">
            {state.inventory.length} / {state.inventoryLimit} Inventory
          </span>
          <button
            onClick={onToggleAutoEquipUpgrades}
            className={`rounded-full border px-3 py-1 transition-colors ${
              state.autoEquipUpgrades
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                : 'border-border bg-muted/20 text-muted-foreground'
            }`}
          >
            Auto-Equip {state.autoEquipUpgrades ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="rounded-2xl border-2 border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-4 border-b border-border pb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-muted/20 text-5xl">
                {heroInfo.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic">{heroInfo.name}</h3>
                <div className="text-[10px] font-black uppercase tracking-widest text-primary">{heroInfo.title}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                    Level {state.heroLevel}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {state.talentPoints} Talent Points
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'HP', display: heroStats.hp.toString(), color: 'text-emerald-500' },
                { label: 'ATK', display: heroStats.atk.toString(), color: 'text-red-500' },
                { label: 'MATK', display: heroStats.matk.toString(), color: 'text-orange-500' },
                { label: 'DEF', display: heroStats.def.toString(), color: 'text-blue-500' },
                { label: 'MDEF', display: heroStats.mdef.toString(), color: 'text-cyan-500' },
                { label: 'SPD', display: heroStats.spd.toString(), color: 'text-amber-500' },
                { label: 'EVA', display: `${(heroStats.eva * 100).toFixed(1)}%`, color: 'text-violet-500' },
                { label: 'CRIT', display: `${(heroStats.critChance * 100).toFixed(1)}%`, color: 'text-pink-500' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border/50 bg-muted/20 p-3 text-center">
                  <div className="mb-1 text-[9px] font-black uppercase text-muted-foreground">{stat.label}</div>
                  <div className={`text-xl font-black ${stat.color}`}>{stat.display}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6">
            <div className="mb-4 border-b border-border pb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Abilities</h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Active skills unlocked at levels 1, 5, 12, and 25.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {abilities.map((ability) => {
                const unlocked = state.heroLevel >= ability.unlockLevel;
                return (
                  <div
                    key={ability.id}
                    className={`rounded-xl border-2 p-4 ${unlocked ? 'border-border bg-muted/10' : 'border-border/50 bg-muted/5 opacity-60'}`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-xl">
                          {ability.icon}
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{ability.slot}</div>
                          <div className="text-sm font-black uppercase tracking-tight">{ability.name}</div>
                        </div>
                      </div>
                      <div className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {unlocked ? `${ability.target} / ${ability.cooldownTicks}t` : `Lvl ${ability.unlockLevel}`}
                      </div>
                    </div>
                    <p className="text-[11px] font-bold leading-relaxed text-muted-foreground">{ability.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Artifacts</h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Equip up to {state.artifactSlots} relics at once.
                </p>
              </div>
              <span className="rounded-full border border-border bg-muted/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                {state.equippedArtifacts.length} / {state.artifactSlots} Equipped
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {ARTIFACTS.map((artifact) => {
                const owned = state.artifactsOwned.includes(artifact.id);
                const equipped = state.equippedArtifacts.includes(artifact.id);
                const canEquip = owned && (equipped || state.equippedArtifacts.length < state.artifactSlots);

                return (
                  <div key={artifact.id} className="rounded-xl border-2 border-border bg-muted/10 p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-black uppercase">{artifact.name}</div>
                        <div className={`mt-1 inline-flex rounded px-2 py-0.5 text-[8px] font-black uppercase border ${getRarityColor(artifact.rarity)}`}>
                          {artifact.rarity}
                        </div>
                      </div>
                      {equipped && (
                        <span className="rounded-full bg-primary px-2 py-1 text-[9px] font-black uppercase tracking-widest text-primary-foreground">
                          Equipped
                        </span>
                      )}
                    </div>
                    <p className="min-h-12 text-[11px] font-bold leading-relaxed text-muted-foreground">{artifact.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Cost {artifact.costShards} Shards
                      </span>
                      {!owned ? (
                        <button
                          onClick={() => onUnlockArtifact(artifact.id)}
                          disabled={state.artifactShards < artifact.costShards}
                          className="rounded-lg border border-primary/30 bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Unlock
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleArtifactEquip(artifact.id)}
                          disabled={!canEquip}
                          className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-40 ${
                            equipped
                              ? 'border border-destructive/30 bg-destructive/10 text-destructive'
                              : 'border border-primary/30 bg-primary/10 text-primary'
                          }`}
                        >
                          {equipped ? 'Unequip' : 'Equip'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border-2 border-border bg-card p-6">
            <div className="mb-4 border-b border-border pb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Equipped Gear</h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Your active loadout across all gear slots.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {SLOT_ORDER.map((slot) => {
                const item = getInventoryItem(state.equippedGear[slot]);

                return (
                  <div key={slot} className="space-y-2">
                    <div className="text-[9px] font-black uppercase tracking-widest text-primary/60">{SLOT_LABELS[slot]}</div>
                    {item ? (
                      <div className="flex items-start justify-between gap-3 rounded-xl border-2 border-border bg-muted/10 p-3">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="text-[11px] font-black uppercase">{item.name}</div>
                            <div className="mt-1 flex flex-wrap">{renderItemStats(item.stats)}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => onEquip(slot, null)}
                          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-destructive"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-border p-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Empty Slot
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6">
            <div className="mb-4 flex flex-col gap-3 border-b border-border pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Inventory</h3>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Favorites are protected from bulk selling. Locked items cannot be sold.
                  </p>
                </div>
                <span className="rounded-full border border-border bg-muted/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {unequippedInventory.length} Unequipped
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSellByRarity('Common')}
                  disabled={commonSellableCount === 0}
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sell All Commons ({commonSellableCount})
                </button>
                <button
                  onClick={() => onSellByRarity('Rare')}
                  disabled={rareSellableCount === 0}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sell All Rares ({rareSellableCount})
                </button>
                <button
                  onClick={onSellAll}
                  disabled={totalSellableCount === 0}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sell Everything ({totalSellableCount})
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {unequippedInventory.length === 0 && (
                <div className="col-span-full rounded-2xl border-2 border-dashed border-border py-12 text-center font-bold text-muted-foreground">
                  No spare loot. Clear missions and levels to fill your inventory.
                </div>
              )}

              {unequippedInventory.map((item) => {
                const itemId = getItemKey(item);
                const canEquip = !item.allowedUnits || item.allowedUnits.includes(heroClass);
                const equippedItem = getInventoryItem(state.equippedGear[item.slot]);
                const isLocked = lockedIds.has(itemId);
                const isFavorite = favoriteIds.has(itemId);

                return (
                  <div
                    key={itemId}
                    className="group flex flex-col justify-between rounded-xl border-2 border-border bg-card p-4 transition-all hover:border-primary"
                  >
                    <div>
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex items-center gap-2">
                          {isFavorite && (
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
                              Favorite
                            </span>
                          )}
                          {isLocked && (
                            <span className="rounded bg-muted px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                              Locked
                            </span>
                          )}
                          <span className={`rounded px-2 py-0.5 text-[8px] font-black uppercase border-2 ${getRarityColor(item.rarity)}`}>
                            {item.rarity}
                          </span>
                        </div>
                      </div>
                      <div className="mb-1 text-xs font-black uppercase italic">{item.name}</div>
                      <div className="mb-1 text-[9px] font-bold leading-tight text-muted-foreground">{item.description}</div>
                      {item.allowedUnits && (
                        <div className="mb-2 text-[8px] font-black uppercase tracking-widest text-primary/40">
                          {item.allowedUnits.join(' / ')}
                        </div>
                      )}
                      <div className="mt-auto flex flex-wrap border-t border-border/50 pt-2">{renderItemStats(item.stats, equippedItem?.stats)}</div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex gap-2">
                        {canEquip && (
                          <button
                            onClick={() => onEquip(item.slot, itemId)}
                            className="flex-1 rounded-lg bg-primary py-1.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground"
                          >
                            Equip
                          </button>
                        )}
                        <button
                          onClick={() => onSell(itemId)}
                          disabled={isLocked}
                          className="flex-1 rounded-lg border border-destructive/20 bg-destructive/10 py-1.5 text-[10px] font-black uppercase tracking-widest text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Sell {RARITY_VALUE[item.rarity]}c
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onToggleFavorite(itemId)}
                          className={`flex-1 rounded-lg border py-1.5 text-[10px] font-black uppercase tracking-widest ${
                            isFavorite
                              ? 'border-primary/30 bg-primary/10 text-primary'
                              : 'border-border bg-muted/20 text-muted-foreground'
                          }`}
                        >
                          {isFavorite ? 'Favorited' : 'Favorite'}
                        </button>
                        <button
                          onClick={() => onToggleLock(itemId)}
                          className={`flex-1 rounded-lg border py-1.5 text-[10px] font-black uppercase tracking-widest ${
                            isLocked
                              ? 'border-muted-foreground/30 bg-muted/30 text-foreground'
                              : 'border-border bg-muted/20 text-muted-foreground'
                          }`}
                        >
                          {isLocked ? 'Unlock' : 'Lock'}
                        </button>
                      </div>
                    </div>

                    {!canEquip && (
                      <div className="mt-2 text-center text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">
                        Incompatible class
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
