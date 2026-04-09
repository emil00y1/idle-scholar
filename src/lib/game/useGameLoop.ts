'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, UnitType, UnitInstance, CombatTurn, EquipmentSlot, HeroBonuses, UnitStats, ActiveMission, CombatAbilityState, AbilitySlot, Equipment, Achievement, Consumable, ActiveBuff } from './types';
import { CLASS_INFO, TALENT_TREES, LEVELS, STAT_TRAINING, EQUIPMENT_DATABASE, MISSIONS, rollMissionLoot, scaleMissionRewards, ABILITY_DATABASE, resolveAbilityLoadout, ACHIEVEMENTS, ARTIFACTS, CONSUMABLES, SHOP_ITEMS } from './constants';

const SAVE_KEY = 'idle-scholar-v2-save';
const DEFAULT_INVENTORY_LIMIT = 120;
const DEFAULT_ARTIFACT_SLOTS = 2;

const INITIAL_STATE: GameState = {
  heroClass: null,
  heroLevel: 1,
  heroExp: 0,
  heroExpToNext: 100,
  coins: 0,
  totalCoinsEarned: 0,
  talentPoints: 0,
  talentsOwned: {},
  statTraining: {},
  inventory: [],
  equippedGear: { weapon: null, armor: null, helmet: null, gloves: null, boots: null, accessory: null },
  unlockedLevels: ['lvl1'],
  completedLevels: [],
  artifactShards: 0,
  artifactsOwned: [],
  equippedArtifacts: [],
  earnedAchievements: [],
  theme: 'dark',
  lockedItemIds: [],
  favoriteItemIds: [],
  autoEquipUpgrades: false,
  inventoryLimit: DEFAULT_INVENTORY_LIMIT,
  artifactSlots: DEFAULT_ARTIFACT_SLOTS,
  combatAutomation: {
    autoRepeat: false,
    stopOnInventoryFull: true,
  },
  activeMissions: [],
  completedMissionIds: [],
  missionCooldowns: {},
  missionSlots: 2,
  activeBuffs: [],
  consumables: { hp_potion: 3 },
  combat: {
    isActive: false, levelId: null, playerArmy: [], enemyArmy: [], abilities: [],
    consumables: {}, potionCooldownRemaining: 0,
    tickCount: 0, history: [], status: 'ongoing',
  },
  stats: {
    startTime: Date.now(), totalPlayTime: 0, totalCoinsSpent: 0,
    totalEnemiesDefeated: 0, highestLevelReached: 1,
  },
  lastTick: Date.now(),
};

const SELL_VALUES: Record<Equipment['rarity'], number> = {
  Common: 100,
  Rare: 500,
  Epic: 2500,
  Relic: 10000,
  Legendary: 50000,
  Godlike: 250000,
};

const ITEM_SCORE_WEIGHTS: Record<UnitType, Record<string, number>> = {
  knight: { hp: 1.2, atk: 1.1, matk: 0.1, def: 3.2, mdef: 1.8, spd: 0.5, eva: 80, critChance: 20, lifesteal: 20 },
  warrior: { hp: 1.0, atk: 2.8, matk: 0.1, def: 1.2, mdef: 0.7, spd: 1.2, eva: 60, critChance: 28, lifesteal: 42 },
  archer: { hp: 0.8, atk: 2.4, matk: 0.2, def: 0.8, mdef: 0.8, spd: 1.9, eva: 110, critChance: 34, lifesteal: 25 },
  mage: { hp: 0.7, atk: 0.1, matk: 3.1, def: 0.8, mdef: 1.3, spd: 1.3, eva: 70, critChance: 26, lifesteal: 18 },
  healer: { hp: 1.4, atk: 0.1, matk: 2.3, def: 1.5, mdef: 1.8, spd: 1.0, eva: 65, critChance: 18, lifesteal: 16 },
};

let inventoryInstanceCounter = 0;

function createItemInstanceId(baseId: string) {
  inventoryInstanceCounter += 1;
  return `${baseId}-${Date.now()}-${inventoryInstanceCounter}`;
}

function cloneEquipment(template: Equipment): Equipment {
  return {
    ...template,
    stats: { ...template.stats },
    instanceId: createItemInstanceId(template.id),
  };
}

function ensureItemInstance(item: Equipment): Equipment {
  if (item.instanceId) return { ...item, stats: { ...item.stats } };
  return {
    ...item,
    stats: { ...item.stats },
    instanceId: createItemInstanceId(item.id),
  };
}

function getInventoryItem(inventory: Equipment[], itemId: string | null | undefined) {
  if (!itemId) return null;
  return inventory.find((item) => item.instanceId === itemId) ?? inventory.find((item) => item.id === itemId) ?? null;
}

function normalizeInventoryAndGear(
  rawInventory: Equipment[] | undefined,
  rawGear: Record<EquipmentSlot, string | null> | undefined,
) {
  const inventory = (rawInventory || []).map((item) => ensureItemInstance(item));
  const equippedGear = { ...INITIAL_STATE.equippedGear };
  const usedInstanceIds = new Set<string>();

  (Object.keys(equippedGear) as EquipmentSlot[]).forEach((slot) => {
    const rawId = rawGear?.[slot];
    if (!rawId) return;

    const match =
      inventory.find((item) => item.instanceId === rawId) ??
      inventory.find((item) => item.id === rawId && item.instanceId && !usedInstanceIds.has(item.instanceId));

    if (!match?.instanceId) return;
    equippedGear[slot] = match.instanceId;
    usedInstanceIds.add(match.instanceId);
  });

  return { inventory, equippedGear };
}

function getSellValue(item: Equipment) {
  return SELL_VALUES[item.rarity] || 50;
}

function isItemUsableByClass(item: Equipment, heroClass: UnitType | null) {
  if (!heroClass) return false;
  return !item.allowedUnits || item.allowedUnits.includes(heroClass);
}

function scoreItemForClass(item: Equipment, heroClass: UnitType) {
  const weights = ITEM_SCORE_WEIGHTS[heroClass];
  return Object.entries(item.stats).reduce((score, [key, rawValue]) => {
    const value = rawValue as number;
    const weight = weights[key] ?? 0;
    return score + value * weight;
  }, 0);
}

function getAchievementProgress(snapshot: GameState, achievement: Achievement) {
  switch (achievement.requirement.type) {
    case 'kills':
      return snapshot.stats.totalEnemiesDefeated;
    case 'levels':
      return snapshot.completedLevels.length;
    case 'coins':
      return snapshot.totalCoinsEarned;
    case 'power': {
      const stats = snapshot.heroClass ? computeHeroStats(snapshot) : null;
      return stats ? stats.hp + stats.atk + stats.matk + stats.def + stats.mdef + stats.spd * 5 + stats.critChance * 1000 + stats.eva * 1000 : 0;
    }
    default:
      return 0;
  }
}

function applyAchievementRewards(snapshot: GameState): GameState {
  let nextState = snapshot;

  for (const achievement of ACHIEVEMENTS) {
    if (nextState.earnedAchievements.includes(achievement.id)) continue;
    if (getAchievementProgress(nextState, achievement) < achievement.requirement.value) continue;

    const rewards = achievement.rewards || {};
    nextState = {
      ...nextState,
      coins: nextState.coins + (rewards.coins || 0),
      totalCoinsEarned: nextState.totalCoinsEarned + (rewards.coins || 0),
      talentPoints: nextState.talentPoints + (rewards.talentPoints || 0),
      artifactShards: nextState.artifactShards + (rewards.artifactShards || 0),
      earnedAchievements: [...nextState.earnedAchievements, achievement.id],
    };
  }

  return nextState;
}

function addLootToInventory(
  snapshot: GameState,
  lootItems: Equipment[],
) {
  let inventory = [...snapshot.inventory];
  let equippedGear = { ...snapshot.equippedGear };

  for (const lootItem of lootItems) {
    if (inventory.length >= snapshot.inventoryLimit) break;
    const instance = cloneEquipment(lootItem);
    inventory.push(instance);

    if (!snapshot.heroClass || !snapshot.autoEquipUpgrades || !isItemUsableByClass(instance, snapshot.heroClass)) {
      continue;
    }

    const currentEquipped = getInventoryItem(inventory, equippedGear[instance.slot]);
    const currentScore = currentEquipped ? scoreItemForClass(currentEquipped, snapshot.heroClass) : Number.NEGATIVE_INFINITY;
    const newScore = scoreItemForClass(instance, snapshot.heroClass);

    if (newScore > currentScore + 0.01 && instance.instanceId) {
      equippedGear[instance.slot] = instance.instanceId;
    }
  }

  return { inventory, equippedGear };
}

function createCombatEncounter(snapshot: GameState, levelId: string) {
  const level = LEVELS.find((entry) => entry.id === levelId);
  if (!level || !snapshot.heroClass) return null;

  const heroStats = computeHeroStats(snapshot);
  const calcInterval = (spd: number) => Math.max(1, Math.ceil(100 / spd));
  const info = CLASS_INFO[snapshot.heroClass];
  const heroInterval = calcInterval(heroStats.spd);
  const bonuses = computeHeroBonuses(snapshot.talentsOwned, snapshot.heroClass);
  const abilities = resolveCombatAbilities(snapshot.heroClass, snapshot.heroLevel, bonuses);

  const hero: UnitInstance = {
    instanceId: 'hero',
    type: snapshot.heroClass,
    name: info.name,
    stats: { ...heroStats },
    isPlayer: true,
    maxHp: heroStats.maxHp,
    ticksUntilAttack: heroInterval,
    attackInterval: heroInterval,
  };

  const enemyArmy: UnitInstance[] = level.enemies.map((enemy, index) => {
    const interval = calcInterval(enemy.stats.spd);
    return {
      instanceId: `e-${enemy.id}-${index}`,
      type: enemy.type,
      name: enemy.name,
      stats: { ...enemy.stats, critChance: enemy.stats.critChance ?? 0, thorns: 0, lifesteal: 0, damageReduction: 0 },
      maxHp: enemy.stats.maxHp,
      isPlayer: false,
      ticksUntilAttack: interval,
      attackInterval: interval,
    };
  });

  return {
    combat: {
      ...INITIAL_STATE.combat,
      isActive: true,
      levelId,
      playerArmy: [hero],
      enemyArmy: enemyArmy.map(e => ({ ...e, isPoisoned: false })),
      abilities,
      consumables: { ...snapshot.consumables },
      history: [{
        attackerId: '',
        attackerName: 'System',
        targetId: '',
        targetName: '',
        damage: 0,
        isCritical: false,
        tick: 0,
        message: `Battle started at ${level.name}!`,
      }],
    },
    combatData: {
      bonuses,
      killCount: 0,
      attackCount: 0,
      turnCount: 0,
      undyingRageUsed: false,
      miracleUsed: false,
    } satisfies CombatData,
  };
}

// ===== HERO BONUS COMPUTATION =====

export function computeHeroBonuses(talentsOwned: Record<string, number>, heroClass: UnitType): HeroBonuses {
  const tree = TALENT_TREES[heroClass];
  const b: HeroBonuses = {
    flatAtk: 0, flatMatk: 0, flatDef: 0, flatMdef: 0, flatHp: 0, flatSpd: 0,
    pctAtk: 0, pctMatk: 0, pctDef: 0, pctMdef: 0, pctHp: 0, pctSpd: 0,
    critChance: 0, critDamage: 0, lifesteal: 0,
    damageReduction: 0, thorns: 0, evasion: 0,
    multiStrike: 0, dot: 0, regen: 0,
    specials: new Set(),
  };

  for (const node of tree.nodes) {
    const rank = talentsOwned[node.id] || 0;
    if (rank === 0) continue;
    for (const effect of node.effects) {
      switch (effect.type) {
        case 'flatStat': {
          const v = effect.value * rank;
          if (effect.stat === 'atk') b.flatAtk += v;
          else if (effect.stat === 'matk') b.flatMatk += v;
          else if (effect.stat === 'def') b.flatDef += v;
          else if (effect.stat === 'mdef') b.flatMdef += v;
          else if (effect.stat === 'hp' || effect.stat === 'maxHp') b.flatHp += v;
          else if (effect.stat === 'spd') b.flatSpd += v;
          break;
        }
        case 'percentStat': {
          const v = effect.value * rank;
          if (effect.stat === 'atk') b.pctAtk += v;
          else if (effect.stat === 'matk') b.pctMatk += v;
          else if (effect.stat === 'def') b.pctDef += v;
          else if (effect.stat === 'mdef') b.pctMdef += v;
          else if (effect.stat === 'hp' || effect.stat === 'maxHp') b.pctHp += v;
          else if (effect.stat === 'spd') b.pctSpd += v;
          break;
        }
        case 'critChance': b.critChance += effect.value * rank; break;
        case 'critDamage': b.critDamage += effect.value * rank; break;
        case 'lifesteal': b.lifesteal += effect.value * rank; break;
        case 'damageReduction': b.damageReduction += effect.value * rank; break;
        case 'thorns': b.thorns += effect.value * rank; break;
        case 'evasion': b.evasion += effect.value * rank; break;
        case 'multiStrike': b.multiStrike += effect.value * rank; break;
        case 'dot': b.dot += effect.value * rank; break;
        case 'regen': b.regen += effect.value * rank; break;
        case 'special': b.specials.add(effect.id); break;
      }
    }
  }
  return b;
}

export function computeHeroStats(state: GameState): UnitStats {
  if (!state.heroClass) return { hp: 0, maxHp: 0, atk: 0, matk: 0, def: 0, mdef: 0, spd: 0, eva: 0, critChance: 0, thorns: 0, lifesteal: 0, damageReduction: 0 };

  const info = CLASS_INFO[state.heroClass];
  const g = state.heroLevel - 1;

  let hp = info.baseStats.hp + g * info.growthStats.hp;
  let atk = info.baseStats.atk + g * info.growthStats.atk;
  let matk = info.baseStats.matk + g * info.growthStats.matk;
  let def = info.baseStats.def + g * info.growthStats.def;
  let mdef = info.baseStats.mdef + g * info.growthStats.mdef;
  let spd = info.baseStats.spd + g * info.growthStats.spd;
  let eva = info.baseStats.eva + g * info.growthStats.eva;
  let critChance = info.baseStats.critChance + g * info.growthStats.critChance;

  // Stat training
  for (const t of STAT_TRAINING) {
    const count = state.statTraining[t.id] || 0;
    if (count === 0) continue;
    const bonus = t.perPurchase * count;
    if (t.id === 'atk') atk += bonus;
    else if (t.id === 'matk') matk += bonus;
    else if (t.id === 'hp') hp += bonus;
    else if (t.id === 'def') def += bonus;
    else if (t.id === 'mdef') mdef += bonus;
    else if (t.id === 'spd') spd += bonus;
    else if (t.id === 'eva') eva += bonus / 100;
  }

  // Equipment
  for (const itemId of Object.values(state.equippedGear)) {
    if (!itemId) continue;
    const item = getInventoryItem(state.inventory, itemId);
    if (!item) continue;
    hp += item.stats.hp || 0;
    atk += item.stats.atk || 0;
    matk += item.stats.matk || 0;
    def += item.stats.def || 0;
    mdef += item.stats.mdef || 0;
    spd += item.stats.spd || 0;
    eva += item.stats.eva || 0;
    critChance += item.stats.critChance || 0;
  }

  // Talent bonuses
  const b = computeHeroBonuses(state.talentsOwned, state.heroClass);
  hp += b.flatHp; atk += b.flatAtk; matk += b.flatMatk; def += b.flatDef; mdef += b.flatMdef; spd += b.flatSpd;
  hp = Math.floor(hp * (1 + b.pctHp));
  atk = Math.floor(atk * (1 + b.pctAtk));
  matk = Math.floor(matk * (1 + b.pctMatk));
  def = Math.floor(def * (1 + b.pctDef));
  mdef = Math.floor(mdef * (1 + b.pctMdef));
  spd = Math.floor(spd * (1 + b.pctSpd));
  eva += b.evasion;
  critChance += b.critChance;

  // Artifacts
  if (state.equippedArtifacts.includes('art1')) { atk = Math.floor(atk * 1.1); matk = Math.floor(matk * 1.1); }
  if (state.equippedArtifacts.includes('art2')) def = Math.floor(def * 1.1);
  if (state.equippedArtifacts.includes('art3')) hp = Math.floor(hp * 1.15);

  // Consumable Buffs
  for (const buff of state.activeBuffs) {
    if (buff.stat === 'atk') atk = Math.floor(atk * (1 + buff.value));
    else if (buff.stat === 'matk') matk = Math.floor(matk * (1 + buff.value));
    else if (buff.stat === 'def') def = Math.floor(def * (1 + buff.value));
    else if (buff.stat === 'mdef') mdef = Math.floor(mdef * (1 + buff.value));
    else if (buff.stat === 'spd') spd = Math.floor(spd * (1 + buff.value));
    else if (buff.stat === 'hp') hp = Math.floor(hp * (1 + buff.value));
    else if (buff.stat === 'eva') eva += buff.value;
    else if (buff.stat === 'critChance') critChance += buff.value;
  }

  return { hp, maxHp: hp, atk, matk, def, mdef, spd, eva, critChance, thorns: b.thorns, lifesteal: b.lifesteal, damageReduction: b.damageReduction };
}

// ===== COMBAT DATA (tracked per-battle via ref) =====

interface CombatData {
  bonuses: HeroBonuses;
  killCount: number;
  attackCount: number;
  turnCount: number;
  undyingRageUsed: boolean;
  miracleUsed: boolean;
  nextAbilityBonus?: {
    type: 'damage' | 'crit' | 'cooldown' | 'heal';
    value: number;
  };
}

type TrainingPurchaseAmount = 1 | 10 | 'max';

function getTrainingPurchaseQuote(
  statId: string,
  amount: TrainingPurchaseAmount,
  coins: number,
  statTraining: Record<string, number>,
) {
  const training = STAT_TRAINING.find((entry) => entry.id === statId);
  if (!training) {
    return { purchases: 0, totalCost: 0, canAfford: false };
  }

  const currentCount = statTraining[statId] || 0;
  const requestedPurchases = amount === 'max' ? Number.MAX_SAFE_INTEGER : amount;
  let purchases = 0;
  let totalCost = 0;

  while (purchases < requestedPurchases) {
    const cost = Math.floor(training.baseCost * Math.pow(training.costMultiplier, currentCount + purchases));
    if (totalCost + cost > coins) break;
    totalCost += cost;
    purchases++;
  }

  const canAfford = amount === 'max' ? purchases > 0 : purchases === amount;
  return { purchases, totalCost, canAfford };
}

function resolveCombatAbilities(heroClass: UnitType, heroLevel: number, bonuses: HeroBonuses): CombatAbilityState[] {
  return resolveAbilityLoadout(heroClass, bonuses.specials).map((ability) => {
    if (!ability) return null;
    return {
      ...ability,
      unlocked: heroLevel >= ability.unlockLevel,
      cooldownRemaining: 0,
    };
  }).filter((ability): ability is CombatAbilityState => ability !== null);
}

function getAbilityCooldown(abilityId: string, bonuses: HeroBonuses) {
  const baseCooldown = ABILITY_DATABASE[abilityId]?.cooldownTicks ?? 0;
  if (abilityId === 'mage_temporal_shift' && bonuses.specials.has('time_lord')) {
    return Math.max(18, baseCooldown - 8);
  }
  if (abilityId === 'healer_sanctuary' && bonuses.specials.has('miracle')) {
    return Math.max(24, baseCooldown - 4);
  }
  return baseCooldown;
}

function calculateAbilityDamage(
  hero: UnitInstance,
  target: UnitInstance,
  bonuses: HeroBonuses,
  {
    isMagic,
    powerMultiplier,
    critBonus = 0,
    ignoreDefense = false,
    trueDamage = false,
  }: {
    isMagic: boolean;
    powerMultiplier: number;
    critBonus?: number;
    ignoreDefense?: boolean;
    trueDamage?: boolean;
  },
) {
  const attackStat = isMagic ? hero.stats.matk : hero.stats.atk;
  const scaledAttack = Math.max(1, Math.floor(attackStat * powerMultiplier));
  const targetDefense = ignoreDefense ? 0 : isMagic ? target.stats.mdef : target.stats.def;
  let damage = trueDamage
    ? scaledAttack
    : Math.max(1, Math.floor(scaledAttack * (100 / (100 + targetDefense))));

  if (bonuses.specials.has('execute') && target.stats.hp / target.maxHp < 0.2) {
    damage = Math.floor(damage * 2);
  }

  let isCritical = false;
  if (Math.random() < Math.min(hero.stats.critChance + critBonus, 0.95)) {
    isCritical = true;
    let critMultiplier = 1.5 + bonuses.critDamage;
    if (bonuses.specials.has('chaos_strike') || bonuses.specials.has('power_overwhelming')) {
      critMultiplier = Math.max(critMultiplier, 3);
    }
    if (bonuses.specials.has('kill_shot') && target.stats.hp / target.maxHp < 0.5) {
      critMultiplier *= 2;
    }
    damage = Math.floor(damage * critMultiplier);
  }

  return { damage, isCritical };
}

// ===== HOOK =====

export function useGameLoop() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  const combatRef = useRef<CombatData | null>(null);

  // --- Load ---
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { inventory, equippedGear } = normalizeInventoryAndGear(parsed.inventory, parsed.equippedGear);
        const inventoryIds = new Set(inventory.map((item) => item.instanceId).filter((id): id is string => Boolean(id)));
        const artifactsOwned = Array.isArray(parsed.artifactsOwned) ? parsed.artifactsOwned : [];
        const artifactSlots = typeof parsed.artifactSlots === 'number' ? parsed.artifactSlots : DEFAULT_ARTIFACT_SLOTS;
        const merged: GameState = {
          ...INITIAL_STATE,
          ...parsed,
          combat: INITIAL_STATE.combat,
          equippedGear,
          inventory,
          artifactShards: parsed.artifactShards || 0,
          artifactsOwned,
          equippedArtifacts: (parsed.equippedArtifacts || []).filter((artifactId: string) => artifactsOwned.includes(artifactId)).slice(0, artifactSlots),
          earnedAchievements: parsed.earnedAchievements || [],
          lockedItemIds: (parsed.lockedItemIds || []).filter((itemId: string) => inventoryIds.has(itemId)),
          favoriteItemIds: (parsed.favoriteItemIds || []).filter((itemId: string) => inventoryIds.has(itemId)),
          autoEquipUpgrades: parsed.autoEquipUpgrades || false,
          inventoryLimit: parsed.inventoryLimit || DEFAULT_INVENTORY_LIMIT,
          artifactSlots,
          combatAutomation: { ...INITIAL_STATE.combatAutomation, ...(parsed.combatAutomation || {}) },
          activeMissions: parsed.activeMissions || [],
          completedMissionIds: parsed.completedMissionIds || [],
          missionCooldowns: parsed.missionCooldowns || {},
          missionSlots: parsed.missionSlots || 2,
        };

        // Offline progress
        const lastTick = parsed.lastTick || Date.now();
        const diffSec = Math.floor((Date.now() - lastTick) / 1000);
        if (diffSec > 60 && merged.heroClass && merged.heroLevel > 0) {
          const rate = merged.heroLevel * 0.5;
          const gained = Math.floor(rate * diffSec);
          merged.coins += gained;
          merged.totalCoinsEarned += gained;
        }
        setState(applyAchievementRewards(merged));
      } catch { /* ignore corrupt saves */ }
    }
    setIsInitialized(true);
  }, []);

  // --- Save ---
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastTick: Date.now() }));
    }
  }, [state, isInitialized]);

  // --- Computed hero stats ---
  const heroStats = useMemo(() => {
    if (!state.heroClass) return null;
    return computeHeroStats(state);
  }, [state]);

  useEffect(() => {
    setState(prev => applyAchievementRewards(prev));
  }, [
    heroStats?.hp,
    heroStats?.atk,
    heroStats?.matk,
    heroStats?.def,
    heroStats?.mdef,
    heroStats?.spd,
    heroStats?.eva,
    heroStats?.critChance,
    state.stats.totalEnemiesDefeated,
    state.completedLevels.length,
    state.totalCoinsEarned,
    state.earnedAchievements.length,
  ]);

  // --- Class selection ---
  // Periodic buff cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const now = Date.now();
        const validBuffs = prev.activeBuffs.filter(b => b.expiresAt > now);
        if (validBuffs.length !== prev.activeBuffs.length) {
          return { ...prev, activeBuffs: validBuffs };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectClass = useCallback((heroClass: UnitType) => {
    setState(prev => prev.heroClass ? prev : { ...prev, heroClass });
  }, []);

  // --- Talent allocation ---
  const allocateTalent = useCallback((nodeId: string) => {
    setState(prev => {
      if (!prev.heroClass || prev.talentPoints <= 0) return prev;
      const tree = TALENT_TREES[prev.heroClass];
      const node = tree.nodes.find(n => n.id === nodeId);
      if (!node) return prev;

      const rank = prev.talentsOwned[nodeId] || 0;
      if (rank >= node.maxRank) return prev;
      const pointCost = node.pointCost ?? 1;
      if (prev.talentPoints < pointCost) return prev;
      const hasMasterNode = tree.nodes.some(candidate => candidate.isMaster && (prev.talentsOwned[candidate.id] || 0) > 0);
      if (node.isMaster && rank === 0 && hasMasterNode) return prev;

      // Specialization check: Only 2 branches allowed (excluding shared nodes)
      if (!node.isShared && !node.isMaster) {
        const countsTowardSpecialization = (branch: string) => branch !== 'synergy' && branch !== 'ultimate' && branch !== 'mastery';
        const ownedNodeIds = Object.keys(prev.talentsOwned).filter(id => prev.talentsOwned[id] > 0);
        const specializedBranches = new Set<string>();
        
        ownedNodeIds.forEach(id => {
          const n = tree.nodes.find(tn => tn.id === id);
          if (n && !n.isShared && countsTowardSpecialization(n.branch)) specializedBranches.add(n.branch);
        });

        if (countsTowardSpecialization(node.branch) && !specializedBranches.has(node.branch) && specializedBranches.size >= 2) {
          return prev; // Limit reached
        }
      }

      if (node.requires) {
        for (const r of node.requires) {
          if ((prev.talentsOwned[r.id] || 0) < r.minRank) return prev;
        }
      }
      return { ...prev, talentPoints: prev.talentPoints - pointCost, talentsOwned: { ...prev.talentsOwned, [nodeId]: rank + 1 } };
    });
  }, []);

  // --- Stat training (coins) ---
  const trainStat = useCallback((statId: string, amount: TrainingPurchaseAmount = 1) => {
    setState(prev => {
      const quote = getTrainingPurchaseQuote(statId, amount, prev.coins, prev.statTraining);
      if (!quote.canAfford || quote.purchases === 0) return prev;
      const count = prev.statTraining[statId] || 0;
      return {
        ...prev,
        coins: prev.coins - quote.totalCost,
        statTraining: { ...prev.statTraining, [statId]: count + quote.purchases },
        stats: { ...prev.stats, totalCoinsSpent: prev.stats.totalCoinsSpent + quote.totalCost },
      };
    });
  }, []);

  const getTrainingQuote = useCallback((statId: string, amount: TrainingPurchaseAmount = 1) => {
    return getTrainingPurchaseQuote(statId, amount, state.coins, state.statTraining);
  }, [state.coins, state.statTraining]);

  // --- Equipment ---
  const equipItem = useCallback((slot: EquipmentSlot, itemId: string | null) => {
    setState(prev => {
      if (itemId) {
        const item = getInventoryItem(prev.inventory, itemId);
        if (!item || item.slot !== slot) return prev;
        if (prev.heroClass && item.allowedUnits && !item.allowedUnits.includes(prev.heroClass)) return prev;
      }
      return { ...prev, equippedGear: { ...prev.equippedGear, [slot]: itemId } };
    });
  }, []);

  const sellItem = useCallback((itemId: string) => {
    setState(prev => {
      const item = getInventoryItem(prev.inventory, itemId);
      const instanceId = item?.instanceId ?? itemId;
      if (!item || prev.lockedItemIds.includes(instanceId)) return prev;
      if (Object.values(prev.equippedGear).includes(instanceId)) return prev;

      return {
        ...prev,
        coins: prev.coins + getSellValue(item),
        totalCoinsEarned: prev.totalCoinsEarned + getSellValue(item),
        inventory: prev.inventory.filter((entry) => entry.instanceId !== instanceId),
        lockedItemIds: prev.lockedItemIds.filter((entry) => entry !== instanceId),
        favoriteItemIds: prev.favoriteItemIds.filter((entry) => entry !== instanceId),
      };
    });
  }, []);

  const sellItemsByRarity = useCallback((rarity: Equipment['rarity']) => {
    setState(prev => {
      const equippedIds = new Set(Object.values(prev.equippedGear).filter((itemId): itemId is string => Boolean(itemId)));
      const lockedIds = new Set(prev.lockedItemIds);
      const favoriteIds = new Set(prev.favoriteItemIds);
      const itemsToSell = prev.inventory.filter((item) => {
        const instanceId = item.instanceId || item.id;
        return item.rarity === rarity && !equippedIds.has(instanceId) && !lockedIds.has(instanceId) && !favoriteIds.has(instanceId);
      });

      if (itemsToSell.length === 0) return prev;

      const soldIds = new Set(itemsToSell.map((item) => item.instanceId || item.id));
      const totalValue = itemsToSell.reduce((sum, item) => sum + getSellValue(item), 0);

      return {
        ...prev,
        coins: prev.coins + totalValue,
        totalCoinsEarned: prev.totalCoinsEarned + totalValue,
        inventory: prev.inventory.filter((item) => !soldIds.has(item.instanceId || item.id)),
        lockedItemIds: prev.lockedItemIds.filter((itemId) => !soldIds.has(itemId)),
        favoriteItemIds: prev.favoriteItemIds.filter((itemId) => !soldIds.has(itemId)),
      };
    });
  }, []);

  const sellAllInventory = useCallback(() => {
    setState(prev => {
      const equippedIds = new Set(Object.values(prev.equippedGear).filter((itemId): itemId is string => Boolean(itemId)));
      const lockedIds = new Set(prev.lockedItemIds);
      const favoriteIds = new Set(prev.favoriteItemIds);
      const itemsToSell = prev.inventory.filter((item) => {
        const instanceId = item.instanceId || item.id;
        return !equippedIds.has(instanceId) && !lockedIds.has(instanceId) && !favoriteIds.has(instanceId);
      });

      if (itemsToSell.length === 0) return prev;

      const soldIds = new Set(itemsToSell.map((item) => item.instanceId || item.id));
      const totalValue = itemsToSell.reduce((sum, item) => sum + getSellValue(item), 0);

      return {
        ...prev,
        coins: prev.coins + totalValue,
        totalCoinsEarned: prev.totalCoinsEarned + totalValue,
        inventory: prev.inventory.filter((item) => !soldIds.has(item.instanceId || item.id)),
        lockedItemIds: prev.lockedItemIds.filter((itemId) => !soldIds.has(itemId)),
        favoriteItemIds: prev.favoriteItemIds.filter((itemId) => !soldIds.has(itemId)),
      };
    });
  }, []);

  const toggleItemLock = useCallback((itemId: string) => {
    setState(prev => {
      if (!getInventoryItem(prev.inventory, itemId)) return prev;
      const nextLocked = prev.lockedItemIds.includes(itemId)
        ? prev.lockedItemIds.filter((entry) => entry !== itemId)
        : [...prev.lockedItemIds, itemId];

      return { ...prev, lockedItemIds: nextLocked };
    });
  }, []);

  const toggleItemFavorite = useCallback((itemId: string) => {
    setState(prev => {
      if (!getInventoryItem(prev.inventory, itemId)) return prev;
      const nextFavorites = prev.favoriteItemIds.includes(itemId)
        ? prev.favoriteItemIds.filter((entry) => entry !== itemId)
        : [...prev.favoriteItemIds, itemId];

      return { ...prev, favoriteItemIds: nextFavorites };
    });
  }, []);

  const toggleAutoEquipUpgrades = useCallback(() => {
    setState(prev => ({ ...prev, autoEquipUpgrades: !prev.autoEquipUpgrades }));
  }, []);

  const unlockArtifact = useCallback((artifactId: string) => {
    setState(prev => {
      const artifact = ARTIFACTS.find((entry) => entry.id === artifactId);
      if (!artifact || prev.artifactsOwned.includes(artifactId) || prev.artifactShards < artifact.costShards) return prev;

      return {
        ...prev,
        artifactShards: prev.artifactShards - artifact.costShards,
        artifactsOwned: [...prev.artifactsOwned, artifactId],
      };
    });
  }, []);

  const toggleArtifactEquip = useCallback((artifactId: string) => {
    setState(prev => {
      if (!prev.artifactsOwned.includes(artifactId)) return prev;
      if (prev.equippedArtifacts.includes(artifactId)) {
        return { ...prev, equippedArtifacts: prev.equippedArtifacts.filter((entry) => entry !== artifactId) };
      }
      if (prev.equippedArtifacts.length >= prev.artifactSlots) return prev;
      return { ...prev, equippedArtifacts: [...prev.equippedArtifacts, artifactId] };
    });
  }, []);

  const updateCombatAutomation = useCallback((updates: Partial<GameState['combatAutomation']>) => {
    setState(prev => ({
      ...prev,
      combatAutomation: { ...prev.combatAutomation, ...updates },
    }));
  }, []);

  // ===== MISSIONS =====

  const startMission = useCallback((missionId: string) => {
    setState(prev => {
      if (prev.activeMissions.length >= prev.missionSlots) return prev;
      if (prev.activeMissions.some(m => m.missionId === missionId)) return prev;
      const mission = MISSIONS.find(m => m.id === missionId);
      if (!mission || prev.heroLevel < mission.requiredLevel) return prev;
      const cooldownEnd = prev.missionCooldowns[missionId];
      if (cooldownEnd && Date.now() < cooldownEnd) return prev;
      const now = Date.now();
      const active: ActiveMission = {
        missionId,
        startedAt: now,
        endsAt: now + mission.durationSeconds * 1000,
      };
      return { ...prev, activeMissions: [...prev.activeMissions, active] };
    });
  }, []);

  const collectMission = useCallback((missionId: string) => {
    setState(prev => {
      const idx = prev.activeMissions.findIndex(m => m.missionId === missionId);
      if (idx === -1) return prev;
      const active = prev.activeMissions[idx];
      if (Date.now() < active.endsAt) return prev;

      const mission = MISSIONS.find(m => m.id === missionId);
      if (!mission) return prev;

      const rewards = scaleMissionRewards(mission, prev.heroLevel);
      let heroLevel = prev.heroLevel;
      let heroExp = prev.heroExp + rewards.exp;
      let heroExpToNext = prev.heroExpToNext;
      let bonusTalentPoints = 0;
      let bonusPotions = 0;

      while (heroExp >= heroExpToNext) {
        heroExp -= heroExpToNext;
        heroLevel++;
        heroExpToNext = Math.floor(heroExpToNext * 1.35);
        bonusTalentPoints++;
        if (heroLevel % 5 === 0) bonusPotions += 3;
      }

      const newActive = [...prev.activeMissions];
      newActive.splice(idx, 1);
      const lootItems = rollMissionLoot(rewards.lootTable)
        .map((equipmentId) => EQUIPMENT_DATABASE.find((item) => item.id === equipmentId))
        .filter((item): item is Equipment => Boolean(item));

      let nextState: GameState = {
        ...prev,
        coins: prev.coins + rewards.coins,
        totalCoinsEarned: prev.totalCoinsEarned + rewards.coins,
        heroLevel, heroExp, heroExpToNext,
        talentPoints: prev.talentPoints + (rewards.talentPoints || 0) + bonusTalentPoints,
        consumables: {
          ...prev.consumables,
          hp_potion: (prev.consumables['hp_potion'] || 0) + bonusPotions,
        },
        artifactShards: prev.artifactShards + (rewards.artifactShards || 0),
        activeMissions: newActive,
        completedMissionIds: [...new Set([...prev.completedMissionIds, missionId])],
        missionCooldowns: { ...prev.missionCooldowns, [missionId]: Date.now() + 2 * 60 * 60 * 1000 },
      };

      if (lootItems.length > 0) {
        const lootResult = addLootToInventory(nextState, lootItems);
        nextState = { ...nextState, inventory: lootResult.inventory, equippedGear: lootResult.equippedGear };
      }

      return applyAchievementRewards(nextState);
    });
  }, []);

  const cancelMission = useCallback((missionId: string) => {
    setState(prev => ({
      ...prev,
      activeMissions: prev.activeMissions.filter(m => m.missionId !== missionId),
    }));
  }, []);

  const buyItem = useCallback((equipmentId: string, price: number) => {
    setState(prev => {
      if (prev.coins < price) return prev;
      if (prev.inventory.length >= prev.inventoryLimit) return prev;

      const baseItem = EQUIPMENT_DATABASE.find(item => item.id === equipmentId);
      if (!baseItem) return prev;

      const instance = cloneEquipment(baseItem);
      let nextState: GameState = {
        ...prev,
        coins: prev.coins - price,
        inventory: [...prev.inventory, instance],
      };

      if (prev.heroClass && prev.autoEquipUpgrades && isItemUsableByClass(instance, prev.heroClass)) {
        const slot = instance.slot;
        const currentEquipped = getInventoryItem(prev.inventory, prev.equippedGear[slot]);
        const currentScore = currentEquipped ? scoreItemForClass(currentEquipped, prev.heroClass) : Number.NEGATIVE_INFINITY;
        const newScore = scoreItemForClass(instance, prev.heroClass);

        if (newScore > currentScore + 0.01 && instance.instanceId) {
          nextState = {
            ...nextState,
            equippedGear: { ...nextState.equippedGear, [slot]: instance.instanceId }
          };
        }
      }

      return nextState;
    });
  }, []);

  const buyConsumable = useCallback((consumableId: string) => {
    setState(prev => {
      const consumable = CONSUMABLES.find(c => c.id === consumableId);
      if (!consumable || prev.coins < consumable.price) return prev;

      const currentCount = prev.consumables[consumableId] || 0;
      return {
        ...prev,
        coins: prev.coins - consumable.price,
        consumables: {
          ...prev.consumables,
          [consumableId]: currentCount + 1,
        }
      };
    });
  }, []);

  // ===== COMBAT =====

  const startCombat = useCallback((levelId: string) => {
    const encounter = createCombatEncounter(state, levelId);
    if (!encounter) return;

    combatRef.current = encounter.combatData;
    setState(prev => ({ ...prev, combat: encounter.combat }));
  }, [state]);

  const processCombatTick = useCallback(() => {
    setState(prev => {
      if (!prev.combat.isActive || prev.combat.status !== 'ongoing') return prev;
      
      // Safety check: if combatRef is null but combat is active, try to recover it
      if (!combatRef.current) {
        const bonuses = computeHeroBonuses(prev.talentsOwned, prev.heroClass!);
        combatRef.current = {
          bonuses,
          killCount: 0,
          attackCount: 0,
          turnCount: 0,
          undyingRageUsed: false,
          miracleUsed: false,
        };
      }

      const cd = combatRef.current;
      const newPlayer = prev.combat.playerArmy.map(p => ({ ...p, stats: { ...p.stats } }));
      const newEnemy = prev.combat.enemyArmy.map(e => ({ ...e, stats: { ...e.stats } }));
      const newAbilities = prev.combat.abilities.map(ability => ({ ...ability }));
      const hero = newPlayer[0];

      // Check if already over
      if (hero.stats.hp <= 0 || newEnemy.every(e => e.stats.hp <= 0)) {
        return { ...prev, combat: { ...prev.combat, status: hero.stats.hp <= 0 ? 'defeat' : 'victory' } };
      }

      const tick = prev.combat.tickCount + 1;
      const results: CombatTurn[] = [];
      const b = cd.bonuses;

      // === SPECIAL: NECROMANCER SUMMON ===
      if (tick % 40 === 0) {
        const necromancer = newEnemy.find(e => e.id === 'necromancer' && e.stats.hp > 0);
        if (necromancer) {
          const calcInterval = (spd: number) => Math.max(1, Math.ceil(100 / spd));
          const skeletonInterval = calcInterval(15);
          for (let i = 0; i < 2; i++) {
            newEnemy.push({
              instanceId: `summon-skel-${tick}-${i}`, id: 'skeleton', type: 'warrior', name: 'Risen Skeleton', icon: '💀', maxHp: 2000,
              stats: { hp: 2000, maxHp: 2000, atk: 150, matk: 0, def: 50, mdef: 50, spd: 15, critChance: 0, thorns: 0, lifesteal: 0, damageReduction: 0 },
              isPlayer: false, ticksUntilAttack: skeletonInterval, attackInterval: skeletonInterval, isPoisoned: false,
            });
          }
          results.push({ attackerId: necromancer.instanceId, attackerName: necromancer.name, targetId: '', targetName: '', damage: 0, isCritical: false, tick, message: `${necromancer.name} raises the dead! Two skeletons join the fray!` });
        }
      }

      // === SPECIAL: IGNIS FLAME BLAST ===
      // Every 60 ticks (15s), Ignis deals 80% Max HP. 
      // If player has a 'def' buff (Defense Potion), damage is reduced by 75%.
      if (tick % 60 >= 55 && tick % 60 < 60) {
        const ignis = newEnemy.find(e => e.id === 'ignis' && e.stats.hp > 0);
        if (ignis) {
          results.push({ attackerId: ignis.instanceId, attackerName: ignis.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, tick, message: `${ignis.name} is charging a massive FLAME BLAST! (Ticks: ${60 - (tick % 60)})` });
        }
      }
      if (tick > 0 && tick % 60 === 0) {
        const ignis = newEnemy.find(e => e.id === 'ignis' && e.stats.hp > 0);
        if (ignis) {
          const hasDefBuff = prev.activeBuffs.some(b => b.stat === 'def');
          let dmg = Math.floor(hero.maxHp * 0.80);
          if (hasDefBuff) {
            dmg = Math.floor(dmg * 0.25);
            results.push({ attackerId: ignis.instanceId, attackerName: ignis.name, targetId: 'hero', targetName: hero.name, damage: dmg, isCritical: false, tick, message: `FLAME BLAST! Your defense potion absorbed most of the blast! Taken ${dmg} dmg.` });
          } else {
            results.push({ attackerId: ignis.instanceId, attackerName: ignis.name, targetId: 'hero', targetName: hero.name, damage: dmg, isCritical: true, tick, message: `FLAME BLAST! You were caught unprotected! Taken ${dmg} dmg.` });
          }
          hero.stats.hp = Math.max(0, hero.stats.hp - dmg);
        }
      }

      // === SPECIAL: XYLOS ARCANE OVERLOAD ===
      // Every 20 ticks, Xylos gains 15% MATK permanently for the fight.
      if (tick % 20 === 0) {
        const xylos = newEnemy.find(e => e.id === 'xylos' && e.stats.hp > 0);
        if (xylos) {
          xylos.stats.matk = Math.floor(xylos.stats.matk * 1.15);
          results.push({ attackerId: xylos.instanceId, attackerName: xylos.name, targetId: xylos.instanceId, targetName: xylos.name, damage: 0, isCritical: false, tick, message: `${xylos.name}'s power is overflowing! MATK increased.` });
        }
      }

      // === SPECIAL: VOID WEAVER PHASE ===
      const voidweaver = newEnemy.find(e => e.id === 'voidweaver' && e.stats.hp > 0);
      if (voidweaver) {
        const hpPct = voidweaver.stats.hp / voidweaver.maxHp;
        // Phase transition at 50%
        if (hpPct <= 0.50 && !voidweaver.isPoisoned) { // Using isPoisoned as a flag for "phase 2 started"
          voidweaver.isPoisoned = true; // Flag it
          voidweaver.stats.damageReduction = 0.90; // Near invulnerable
          const calcInterval = (spd: number) => Math.max(1, Math.ceil(100 / spd));
          const tendrilInterval = calcInterval(25);
          for (let i = 0; i < 3; i++) {
            newEnemy.push({
              instanceId: `void-tendril-${tick}-${i}`, id: 'tendril', type: 'archer', name: 'Void Tendril', icon: '🎋', maxHp: 5000,
              stats: { hp: 5000, maxHp: 5000, atk: 250, matk: 0, def: 50, mdef: 50, spd: 25, critChance: 0, thorns: 0, lifesteal: 0, damageReduction: 0 },
              isPlayer: false, ticksUntilAttack: tendrilInterval, attackInterval: tendrilInterval, isPoisoned: false,
            });
          }
          results.push({ attackerId: voidweaver.instanceId, attackerName: voidweaver.name, targetId: '', targetName: '', damage: 0, isCritical: false, tick, message: `${voidweaver.name} enters the VOID SHIELD! Defeat the tendrils to break it!` });
        }
        
        // If phase 2 is active, check if tendrils are gone
        if (voidweaver.isPoisoned && voidweaver.stats.damageReduction > 0) {
          const tendrilsAlive = newEnemy.some(e => e.id === 'tendril' && e.stats.hp > 0);
          if (!tendrilsAlive) {
            voidweaver.stats.damageReduction = 0;
            results.push({ attackerId: voidweaver.instanceId, attackerName: voidweaver.name, targetId: '', targetName: '', damage: 0, isCritical: false, tick, message: `${voidweaver.name}'s Void Shield has SHATTERED!` });
          }
        }
      }

      const push = (entry: Omit<CombatTurn, 'tick'>) => results.push({ ...entry, tick });

      // === TIME LORD SPECIAL ===
      if (b.specials.has('time_lord') && tick % 10 === 0 && hero.stats.hp > 0) {
        hero.ticksUntilAttack = 0;
        push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `TIME LORD! ${hero.name} manipulated time for an extra turn!` });
      }

      // Decrement all alive units' cooldowns
      for (const u of [...newPlayer, ...newEnemy]) {
        if (u.stats.hp > 0) u.ticksUntilAttack--;
      }
      for (const ability of newAbilities) {
        if (ability.cooldownRemaining > 0) ability.cooldownRemaining--;
      }

      let newPotionCooldown = Math.max(0, prev.combat.potionCooldownRemaining - 1);

      // === PER-TICK REGEN ===
      if (hero.stats.hp > 0 && b.regen > 0) {
        const heal = Math.floor(hero.maxHp * b.regen);
        if (heal > 0) {
          hero.stats.hp = Math.min(hero.maxHp, hero.stats.hp + heal);
          // Only log regen if it actually heals something or every few ticks to avoid spam
          if (hero.stats.hp < hero.maxHp || tick % 5 === 0) {
            push({
              attackerId: 'hero', attackerName: hero.name,
              targetId: 'hero', targetName: hero.name,
              damage: -heal, isCritical: false,
              message: `${hero.name} regenerates ${heal} HP.`
            });
          }
        }
      }

      // === HERO FIRES if ready ===
      if (hero.stats.hp > 0 && hero.ticksUntilAttack <= 0) {
        // Wind Walk doubles speed (halves interval)
        const baseInterval = hero.attackInterval;
        const effectiveInterval = b.specials.has('wind_walk') ? Math.max(1, Math.floor(baseInterval / 2)) : baseInterval;
        hero.ticksUntilAttack = effectiveInterval;
        cd.turnCount++;

        // Determine number of attacks
        let numAttacks = 1;
        if (Math.random() < b.multiStrike) numAttacks++;
        if (b.specials.has('storm_of_arrows') && Math.random() < 0.25) numAttacks = 3;
        if (b.specials.has('arrow_hell')) numAttacks = 3;
        if (b.specials.has('infinite_loop') && Math.random() < 0.20) numAttacks++;

        for (let a = 0; a < numAttacks; a++) {
          const aliveEnemies = newEnemy.filter(e => e.stats.hp > 0);
          if (aliveEnemies.length === 0) break;

          const targets = (b.specials.has('arcane_storm') && Math.random() < 0.20) || b.specials.has('arcane_singularity')
            ? aliveEnemies : [aliveEnemies[0]];

          for (const target of targets) {
            // Enemy evasion check
            if (target.stats.eva > 0 && Math.random() < Math.min(target.stats.eva, 0.75)) {
              push({ attackerId: 'hero', attackerName: hero.name, targetId: target.instanceId, targetName: target.name, damage: 0, isCritical: false, message: `${target.name} evades ${hero.name}'s attack!` });
              continue;
            }

            cd.attackCount++;
            const isMagicAttacker = hero.type === 'mage' || hero.type === 'healer';
            let heroAtk = isMagicAttacker ? hero.stats.matk : hero.stats.atk;

            if (b.specials.has('rampage')) heroAtk = Math.floor(heroAtk * (1 + cd.killCount * 0.15));
            if (b.specials.has('zealots_charge') && cd.turnCount <= 3) heroAtk = Math.floor(heroAtk * 1.3);
            const isTimeBomb = b.specials.has('time_bomb') && cd.attackCount % 3 === 0;
            if (isTimeBomb) heroAtk *= 3;

            const targetDef = isMagicAttacker ? target.stats.mdef : target.stats.def;
            let damage = Math.max(1, Math.floor(heroAtk * (100 / (100 + targetDef))));

            if (b.specials.has('execute') && target.stats.hp / target.maxHp < 0.20) damage *= 2;
            if (b.specials.has('arcane_singularity')) damage *= 2; // 200% damage

            let isCrit = false;
            if (Math.random() < Math.min(hero.stats.critChance, 0.95)) {
              isCrit = true;
              let critMult = 1.5 + b.critDamage;
              if (b.specials.has('chaos_strike') || b.specials.has('power_overwhelming')) critMult = 3.0;
              if (b.specials.has('armageddon')) critMult = 10.0;
              if (b.specials.has('kill_shot') && target.stats.hp / target.maxHp < 0.50) critMult *= 2;
              const lethalityRanks = b.specials.has('lethality') ? 3 : 0;
              if (lethalityRanks > 0) {
                const reducedDef = targetDef * (1 - lethalityRanks * 0.10);
                damage = Math.max(1, Math.floor(heroAtk * (100 / (100 + reducedDef))));
              }
              damage = Math.floor(damage * critMult);
            }

            const dotDmg = b.dot > 0 ? Math.floor(heroAtk * b.dot) : 0;
            const totalDotDmg = isCrit && b.specials.has('toxic_snipe') ? dotDmg * 3 : dotDmg;
            const totalDamage = damage + totalDotDmg;
            target.stats.hp = Math.max(0, target.stats.hp - totalDamage);

            let ls = hero.stats.lifesteal;
            if (b.specials.has('soul_eater')) ls = 1.0;
            if (b.specials.has('blood_frenzy')) ls += Math.floor((1 - hero.stats.hp / hero.maxHp) * 10) * 0.01;
            if (isCrit && b.specials.has('deaths_embrace')) ls += 0.50;
            if (ls > 0) hero.stats.hp = Math.min(hero.maxHp, hero.stats.hp + Math.floor(totalDamage * ls));

            if (target.stats.hp <= 0) {
              cd.killCount++;
              // Blood Rush: 50% chance for extra turn on kill
              if (b.specials.has('blood_rush') && Math.random() < 0.50) {
                hero.ticksUntilAttack = 0;
                push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `BLOOD RUSH! ${hero.name} gained an extra turn after the kill!` });
              }
            }

            let msg = `${hero.name} ${isCrit ? 'CRITS' : 'attacks'} ${target.name} for ${totalDamage} dmg!`;
            if (dotDmg > 0) {
              msg += ` (+${totalDotDmg} poison)`;
              target.isPoisoned = true;
            }
            if (isTimeBomb) msg += ' [TIME BOMB]';
            if (target.stats.hp <= 0) msg += ' [SLAIN]';
            push({ 
              attackerId: 'hero', 
              attackerName: hero.name, 
              targetId: target.instanceId, 
              targetName: target.name, 
              damage: totalDamage, 
              isCritical: isCrit, 
              message: msg,
              damageType: isMagicAttacker ? 'magic' : 'physical'
            });
            if (totalDotDmg > 0) {
              push({
                attackerId: 'hero',
                attackerName: hero.name,
                targetId: target.instanceId,
                targetName: target.name,
                damage: totalDotDmg,
                isCritical: false,
                message: `${target.name} takes ${totalDotDmg} poison damage.`,
                damageType: 'poison'
              });
            }
          }
        }
      }

      // === EACH ENEMY FIRES if ready ===
      for (const attacker of newEnemy) {
        if (attacker.stats.hp <= 0 || attacker.ticksUntilAttack > 0) continue;
        attacker.ticksUntilAttack = attacker.attackInterval;
        if (hero.stats.hp <= 0) break;

        // Evasion check (Cap at 75% for hero)
        if (Math.random() < Math.min(hero.stats.eva, 0.75)) {
          push({ attackerId: attacker.instanceId, attackerName: attacker.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} evades ${attacker.name}'s attack!` });
          continue;
        }

        const isMagicEnemy = attacker.type === 'mage' || attacker.type === 'healer';
        let heroDef = isMagicEnemy ? hero.stats.mdef : hero.stats.def;
        const atkStat = isMagicEnemy ? attacker.stats.matk : attacker.stats.atk;
        if (b.specials.has('unbreakable') && hero.stats.hp / hero.maxHp < 0.30) heroDef = Math.floor(heroDef * 1.5);

        let damage = Math.max(1, Math.floor(atkStat * (100 / (100 + heroDef))));

        // Invulnerable special: dmg cannot exceed 10% Max HP
        if (b.specials.has('invulnerable')) {
          damage = Math.min(damage, Math.floor(hero.maxHp * 0.10));
        }

        const drCap = 0.80; // New cap for DR
        if (hero.stats.damageReduction > 0) damage = Math.max(1, Math.floor(damage * (1 - Math.min(hero.stats.damageReduction, drCap))));

        hero.stats.hp = Math.max(0, hero.stats.hp - damage);

        if (hero.stats.thorns > 0) {
          let thornsDmg = Math.floor(damage * hero.stats.thorns);
          if (b.specials.has('eye_for_an_eye')) thornsDmg = damage; // 100% reflect
          attacker.stats.hp = Math.max(0, attacker.stats.hp - thornsDmg);
          if (attacker.stats.hp <= 0) cd.killCount++;

          if (b.specials.has('thorns_heal')) {
            hero.stats.hp = Math.min(hero.maxHp, hero.stats.hp + Math.floor(thornsDmg * 0.10));
          }
        }

        if (hero.stats.hp <= 0 && b.specials.has('undying_rage') && !cd.undyingRageUsed) {
          cd.undyingRageUsed = true;
          hero.stats.hp = Math.floor(hero.maxHp * 0.30);
          push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} refuses to die! UNDYING RAGE!` });
        }

        if (hero.stats.hp > 0 && hero.stats.hp / hero.maxHp < 0.15 && b.specials.has('miracle') && !cd.miracleUsed) {
          cd.miracleUsed = true;
          hero.stats.hp = Math.floor(hero.maxHp * 0.50);
          push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `MIRACLE! ${hero.name} restored to 50% HP!` });
        }

        let msg = `${attacker.name} hits ${hero.name} for ${damage} dmg!`;
        if (hero.stats.hp <= 0) msg += ' [HERO FALLEN]';
        push({ 
          attackerId: attacker.instanceId, 
          attackerName: attacker.name, 
          targetId: 'hero', 
          targetName: hero.name, 
          damage, 
          isCritical: false, 
          message: msg,
          damageType: isMagicEnemy ? 'magic' : 'physical'
        });
      }

      const heroDown = hero.stats.hp <= 0;
      const enemiesDown = newEnemy.every(e => e.stats.hp <= 0);
      const status: 'ongoing' | 'victory' | 'defeat' = enemiesDown ? 'victory' : heroDown ? 'defeat' : 'ongoing';

      return {
        ...prev,
        combat: {
          ...prev.combat,
          playerArmy: newPlayer, enemyArmy: newEnemy, abilities: newAbilities,
          tickCount: tick,
          potionCooldownRemaining: newPotionCooldown,
          history: [...results.reverse(), ...prev.combat.history].slice(0, 60),
          status,
        },
      };
    });
  }, []);

  const useAbility = useCallback((slot: AbilitySlot) => {
    setState(prev => {
      if (!prev.combat.isActive || prev.combat.status !== 'ongoing') return prev;
      const cd = combatRef.current;
      if (!cd) return prev;

      const newPlayer = prev.combat.playerArmy.map(player => ({ ...player, stats: { ...player.stats } }));
      const newEnemy = prev.combat.enemyArmy.map(enemy => ({ ...enemy, stats: { ...enemy.stats } }));
      const newAbilities = prev.combat.abilities.map(ability => ({ ...ability }));
      const hero = newPlayer[0];
      if (!hero || hero.stats.hp <= 0) return prev;

      const abilityIndex = newAbilities.findIndex(ability => ability.slot === slot);
      if (abilityIndex === -1) return prev;

      const ability = newAbilities[abilityIndex];
      if (!ability.unlocked || ability.cooldownRemaining > 0) return prev;

      const tick = prev.combat.tickCount;
      const results: CombatTurn[] = [];
      const bonuses = cd.bonuses;

      const push = (entry: Omit<CombatTurn, 'tick'>) => results.push({ ...entry, tick });
      const livingEnemies = () => newEnemy.filter(enemy => enemy.stats.hp > 0);
      const getPrimaryTarget = () => livingEnemies()[0] ?? null;

      const applyLifeSteal = (damage: number) => {
        let lifeSteal = bonuses.specials.has('soul_eater') ? 1 : hero.stats.lifesteal;
        if (bonuses.specials.has('blood_frenzy')) {
          lifeSteal += Math.floor((1 - hero.stats.hp / hero.maxHp) * 10) * 0.01;
        }
        if (lifeSteal <= 0) return;
        hero.stats.hp = Math.min(hero.maxHp, hero.stats.hp + Math.floor(damage * lifeSteal));
      };

      const healHero = (amount: number, sourceName: string) => {
        const healed = Math.max(0, Math.min(hero.maxHp - hero.stats.hp, Math.floor(amount)));
        if (healed <= 0) return 0;
        hero.stats.hp += healed;
        push({
          attackerId: 'hero',
          attackerName: hero.name,
          targetId: 'hero',
          targetName: hero.name,
          damage: -healed,
          isCritical: false,
          message: `${hero.name} uses ${sourceName} and restores ${healed} HP.`,
          damageType: 'heal'
        });
        return healed;
      };

      const strikeTarget = (
        target: UnitInstance,
        {
          abilityName,
          isMagic,
          powerMultiplier,
          critBonus = 0,
          ignoreDefense = false,
          trueDamage = false,
          repeat = 1,
          delayTicks = 0,
        }: {
          abilityName: string;
          isMagic: boolean;
          powerMultiplier: number;
          critBonus?: number;
          ignoreDefense?: boolean;
          trueDamage?: boolean;
          repeat?: number;
          delayTicks?: number;
        },
      ) => {
        let totalDamage = 0;
        let crits = 0;
        const wasAlive = target.stats.hp > 0;

        for (let hit = 0; hit < repeat && target.stats.hp > 0; hit++) {
          const outcome = calculateAbilityDamage(hero, target, bonuses, {
            isMagic,
            powerMultiplier,
            critBonus,
            ignoreDefense,
            trueDamage,
          });
          totalDamage += outcome.damage;
          if (outcome.isCritical) crits++;
          target.stats.hp = Math.max(0, target.stats.hp - outcome.damage);
        }

        if (delayTicks > 0 && target.stats.hp > 0) {
          target.ticksUntilAttack += delayTicks;
        }

        if (wasAlive && target.stats.hp <= 0) {
          cd.killCount++;
        }

        if (totalDamage > 0) {
          applyLifeSteal(totalDamage);
          let message = `${hero.name} uses ${abilityName} on ${target.name} for ${totalDamage} dmg!`;
          if (crits > 0) message += repeat > 1 ? ` [CRIT x${crits}]` : ' [CRIT]';
          if (delayTicks > 0 && target.stats.hp > 0) message += ' [DELAY]';
          if (target.stats.hp <= 0) message += ' [SLAIN]';
          if (trueDamage) message += ' [TRUE]';
          push({
            attackerId: 'hero',
            attackerName: hero.name,
            targetId: target.instanceId,
            targetName: target.name,
            damage: totalDamage,
            isCritical: crits > 0,
            message,
          });
        }

        return wasAlive && target.stats.hp <= 0;
      };

      let cooldown = getAbilityCooldown(ability.id, bonuses);
      let triggered = false;

      // Apply and consume combo bonus for regular abilities
      let comboMult = 1.0;
      let comboCrit = 0;
      if (slot !== 'F' && cd.nextAbilityBonus) {
        if (cd.nextAbilityBonus.type === 'damage') comboMult += cd.nextAbilityBonus.value;
        if (cd.nextAbilityBonus.type === 'heal') comboMult += cd.nextAbilityBonus.value;
        if (cd.nextAbilityBonus.type === 'crit') comboCrit += cd.nextAbilityBonus.value;
        if (cd.nextAbilityBonus.type === 'cooldown') cooldown = Math.max(1, cooldown - cd.nextAbilityBonus.value);
        cd.nextAbilityBonus = undefined; // Consume
      }

      // Enhanced strikeTarget with combo multiplier
      const strikeWithCombo = (target: UnitInstance, options: any) => {
        const originalMult = options.powerMultiplier;
        options.powerMultiplier = originalMult * comboMult;
        options.critBonus = (options.critBonus || 0) + comboCrit;
        return strikeTarget(target, options);
      };

      // Enhanced healHero with combo multiplier
      const healWithCombo = (amount: number, source: string) => {
        return healHero(amount * comboMult, source);
      };

      switch (ability.id) {
        // --- F Combo Abilities ---
        case 'knight_vanguard_strike': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 0.8 });
          cd.nextAbilityBonus = { type: 'damage', value: 0.20 };
          triggered = true;
          break;
        }
        case 'warrior_blade_rush': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 0.7 });
          cd.nextAbilityBonus = { type: 'crit', value: 0.15 };
          triggered = true;
          break;
        }
        case 'archer_quick_shot': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 0.6 });
          cd.nextAbilityBonus = { type: 'cooldown', value: 2 };
          triggered = true;
          break;
        }
        case 'mage_arcane_spark': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 0.5 });
          cd.nextAbilityBonus = { type: 'damage', value: 0.25 };
          triggered = true;
          break;
        }
        case 'healer_renew': {
          healHero(hero.stats.matk * 0.4, ability.name);
          cd.nextAbilityBonus = { type: 'heal', value: 0.30 };
          triggered = true;
          break;
        }

        // --- Standard Abilities (Updated to use combo) ---
        case 'knight_shield_bash': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeWithCombo(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 1.2, delayTicks: 10 });
          triggered = true;
          break;
        }
        case 'knight_hammerfall': {
          for (const target of livingEnemies()) {
            strikeWithCombo(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 0.75 });
          }
          triggered = true;
          break;
        }
        case 'knight_guardians_oath': {
          healWithCombo(hero.maxHp * (bonuses.specials.has('divine_touch') ? 0.2 : 0.12), ability.name);
          hero.stats.def += Math.floor(hero.stats.def * 0.1) + 15;
          hero.stats.mdef += Math.floor(hero.stats.mdef * 0.1) + 15;
          push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} fortifies with ${ability.name}.` });
          triggered = true;
          break;
        }
        case 'knight_last_bastion': {
          for (const target of livingEnemies()) {
            strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 1.3 });
          }
          healHero(hero.maxHp * 0.1, ability.name);
          triggered = true;
          break;
        }

        case 'warrior_crushing_blow': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          const powerMultiplier = target.stats.hp / target.maxHp < 0.5 ? 1.7 : 1.4;
          strikeTarget(target, {
            abilityName: ability.name,
            isMagic: false,
            powerMultiplier,
            ignoreDefense: bonuses.specials.has('power_overwhelming'),
          });
          triggered = true;
          break;
        }
        case 'warrior_whirlwind': {
          let anyKill = false;
          for (const target of livingEnemies()) {
            anyKill = strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 0.8 }) || anyKill;
          }
          if (anyKill && bonuses.specials.has('blood_rush')) {
            cooldown = 0;
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${ability.name} triggered BLOOD RUSH and instantly reset.` });
          }
          triggered = true;
          break;
        }
        case 'warrior_war_cry': {
          hero.stats.atk = Math.floor(hero.stats.atk * 1.15);
          hero.stats.spd += 14;
          hero.stats.critChance += bonuses.specials.has('power_overwhelming') ? 0.05 : 0.03;
          push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} bellows a ${ability.name}, surging with violence.` });
          triggered = true;
          break;
        }
        case 'warrior_execution_line': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          const anyKill = strikeTarget(target, {
            abilityName: ability.name,
            isMagic: false,
            powerMultiplier: target.stats.hp / target.maxHp < 0.5 ? 2.5 : 2.0,
            ignoreDefense: bonuses.specials.has('power_overwhelming') || target.stats.hp / target.maxHp < 0.35,
          });
          if (anyKill && bonuses.specials.has('blood_rush')) {
            cooldown = 0;
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${ability.name} triggered BLOOD RUSH and instantly reset.` });
          }
          triggered = true;
          break;
        }

        case 'archer_aimed_shot': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 1.3, critBonus: 0.2 });
          triggered = true;
          break;
        }
        case 'archer_volley': {
          for (const target of livingEnemies()) {
            strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 0.7 });
          }
          triggered = true;
          break;
        }
        case 'archer_smokescreen': {
          hero.stats.eva = Math.min(hero.stats.eva + 0.12, 0.75);
          hero.stats.spd += 7;
          for (const target of livingEnemies()) {
            target.ticksUntilAttack += 4;
          }
          push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} vanishes into ${ability.name}, throwing the enemy off balance.` });
          triggered = true;
          break;
        }
        case 'archer_deadeye_raid': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeTarget(target, {
            abilityName: ability.name,
            isMagic: false,
            powerMultiplier: 0.55,
            critBonus: 0.08,
            repeat: bonuses.specials.has('storm_of_arrows') ? 4 : 3,
          });
          triggered = true;
          break;
        }
        case 'archer_arrow_hell': {
          const targets = livingEnemies();
          if (targets.length === 0) return prev;
          for (let arrow = 0; arrow < 5; arrow++) {
            const target = targets[arrow % targets.length];
            if (target.stats.hp > 0) {
              strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 0.4, critBonus: 0.05 });
            }
          }
          triggered = true;
          break;
        }

        case 'mage_arcane_bolt': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 1.4, critBonus: 0.08 });
          triggered = true;
          break;
        }
        case 'mage_comet_storm': {
          for (const target of livingEnemies()) {
            strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 0.9 });
          }
          triggered = true;
          break;
        }
        case 'mage_temporal_shift': {
          hero.ticksUntilAttack = 0;
          hero.stats.spd += bonuses.specials.has('time_lord') ? 14 : 8;
          for (const targetAbility of newAbilities) {
            if (targetAbility.id !== ability.id) {
              targetAbility.cooldownRemaining = Math.max(0, targetAbility.cooldownRemaining - (bonuses.specials.has('time_lord') ? 5 : 3));
            }
          }
          push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} bends time with ${ability.name} and is ready to strike again.` });
          triggered = true;
          break;
        }
        case 'mage_absolute_zero': {
          for (const target of livingEnemies()) {
            strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 1.2, delayTicks: 7 });
          }
          triggered = true;
          break;
        }
        case 'mage_arcane_singularity': {
          for (const target of livingEnemies()) {
            strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 1.45, delayTicks: 10 });
          }
          triggered = true;
          break;
        }

        case 'healer_smite': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 1.1 });
          healHero(hero.maxHp * 0.05, ability.name);
          triggered = true;
          break;
        }
        case 'healer_consecration': {
          for (const target of livingEnemies()) {
            strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 0.65 });
          }
          healHero(hero.maxHp * 0.07, ability.name);
          triggered = true;
          break;
        }
        case 'healer_sanctuary': {
          healHero(hero.maxHp * (bonuses.specials.has('miracle') ? 0.23 : 0.16), ability.name);
          hero.stats.def += 20;
          hero.stats.mdef += 25;
          push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} raises ${ability.name}, gaining a holy ward.` });
          triggered = true;
          break;
        }
        case 'healer_final_rite': {
          for (const target of livingEnemies()) {
            strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 0.95 });
          }
          healHero(hero.maxHp * 0.08, ability.name);
          triggered = true;
          break;
        }
        case 'healer_holy_retribution': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 1.4, trueDamage: true });
          healHero(hero.maxHp * 0.07, ability.name);
          triggered = true;
          break;
        }

        // === MASTERY ABILITIES (Level 10) ===
        case 'knight_bastion_call': {
          if (bonuses.specials.has('mastery_knight_juggernaut')) {
            hero.stats.def = Math.floor(hero.stats.def * 1.3);
            hero.stats.mdef = Math.floor(hero.stats.mdef * 1.3);
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} enters Juggernaut Stance, gaining massive defenses.` });
          }
          if (bonuses.specials.has('mastery_knight_retribution')) {
            hero.stats.atk += 60;
            hero.stats.thorns += 0.5;
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} enters Retribution Stance, sharpening their spikes and doubling thorns!` });
          }
          if (bonuses.specials.has('mastery_knight_holy')) {
            healHero(hero.maxHp * 0.2, ability.name);
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} enters Holy Stance, radiating healing light.` });
          }
          if (!bonuses.specials.has('mastery_knight_juggernaut') && !bonuses.specials.has('mastery_knight_retribution') && !bonuses.specials.has('mastery_knight_holy')) {
            healHero(hero.maxHp * 0.08, ability.name);
            hero.stats.def += 25;
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} calls for support, slightly mending and fortifying.` });
          }
          triggered = true;
          break;
        }

        case 'warrior_blood_surge': {
          if (bonuses.specials.has('mastery_warrior_slaughter')) {
            hero.stats.critChance += 0.15;
            hero.stats.atk = Math.floor(hero.stats.atk * 1.2);
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} surges with Slaughter, increasing Crit and Attack!` });
          }
          if (bonuses.specials.has('mastery_warrior_bloodthirst')) {
            hero.stats.hp = Math.min(hero.maxHp, hero.stats.hp + Math.floor(hero.maxHp * 0.25));
            hero.stats.def += 40;
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} surges with Bloodthirst, mending wounds and hardening skin!` });
          }
          if (bonuses.specials.has('mastery_warrior_frenzy')) {
            hero.stats.spd += 30;
            hero.ticksUntilAttack = 0;
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} surges with Frenzy, accelerating to extreme speeds!` });
          }
          if (!bonuses.specials.has('mastery_warrior_slaughter') && !bonuses.specials.has('mastery_warrior_bloodthirst') && !bonuses.specials.has('mastery_warrior_frenzy')) {
            hero.stats.atk = Math.floor(hero.stats.atk * 1.15);
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} surges with energy, gaining a small Attack boost.` });
          }
          triggered = true;
          break;
        }

        case 'archer_hunters_mark': {
          const target = getPrimaryTarget();
          if (!target) return prev;
          if (bonuses.specials.has('mastery_archer_marksmanship')) {
            strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 2.2, critBonus: 0.3 });
            push({ attackerId: 'hero', attackerName: hero.name, targetId: target.instanceId, targetName: target.name, damage: 0, isCritical: false, message: `${target.name} is marked for death by a master sniper!` });
          }
          if (bonuses.specials.has('mastery_archer_trapper')) {
            target.ticksUntilAttack += 18;
            strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 0.8 });
            push({ attackerId: 'hero', attackerName: hero.name, targetId: target.instanceId, targetName: target.name, damage: 0, isCritical: false, message: `${target.name} is ensnared by a heavy trap!` });
          }
          if (bonuses.specials.has('mastery_archer_rapidfire')) {
            for (const a of newAbilities) {
              if (a.id !== ability.id) a.cooldownRemaining = Math.max(0, a.cooldownRemaining - 6);
            }
            strikeTarget(target, { abilityName: ability.name, isMagic: false, powerMultiplier: 1.1 });
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} prepares for rapid fire, reducing all cooldowns!` });
          }
          triggered = true;
          break;
        }

        case 'mage_elemental_overload': {
          if (bonuses.specials.has('mastery_mage_pure')) {
            hero.stats.matk = Math.floor(hero.stats.matk * 1.6);
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} overloads with pure power, massively increasing MATK!` });
          }
          if (bonuses.specials.has('mastery_mage_time')) {
            for (const a of newAbilities) {
              if (a.id !== ability.id) a.cooldownRemaining = 0;
            }
            hero.ticksUntilAttack = 0;
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} overloads time, resetting all spells and readiness!` });
          }
          if (bonuses.specials.has('mastery_mage_shadow')) {
            const targets = livingEnemies();
            for (const t of targets) {
              strikeTarget(t, { abilityName: ability.name, isMagic: true, powerMultiplier: 1.2 });
            }
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} overloads with shadow, blasting all foes!` });
          }
          triggered = true;
          break;
        }

        case 'healer_divine_intervention': {
          if (bonuses.specials.has('mastery_healer_defense')) {
            hero.stats.def += 120;
            hero.stats.mdef += 120;
            healHero(hero.maxHp * 0.1, ability.name);
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `Heavenly shields descend upon ${hero.name}!` });
          }
          if (bonuses.specials.has('mastery_healer_offense')) {
            for (const target of livingEnemies()) {
              strikeTarget(target, { abilityName: ability.name, isMagic: true, powerMultiplier: 1.8, trueDamage: true });
            }
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} unleashes a holy detonation of true damage!` });
          }
          if (bonuses.specials.has('mastery_healer_sustain')) {
            hero.stats.hp = Math.min(hero.maxHp, hero.stats.hp + Math.floor(hero.maxHp * 0.4));
            hero.stats.spd += 20;
            push({ attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name, damage: 0, isCritical: false, message: `${hero.name} is filled with eternal life, restoring 40% HP!` });
          }
          triggered = true;
          break;
        }
      }

      if (!triggered) return prev;

      newAbilities[abilityIndex].cooldownRemaining = cooldown;

      const heroDown = hero.stats.hp <= 0;
      const enemiesDown = newEnemy.every(enemy => enemy.stats.hp <= 0);
      const status: 'ongoing' | 'victory' | 'defeat' = enemiesDown ? 'victory' : heroDown ? 'defeat' : 'ongoing';

      return {
        ...prev,
        combat: {
          ...prev.combat,
          playerArmy: newPlayer,
          enemyArmy: newEnemy,
          abilities: newAbilities,
          history: [...results.reverse(), ...prev.combat.history].slice(0, 60),
          status,
        },
      };
    });
  }, []);

  const useConsumable = useCallback((consumableId: string) => {
    setState(prev => {
      if (!prev.combat.isActive || prev.combat.status !== 'ongoing') return prev;
      
      const count = prev.consumables[consumableId] || 0;
      if (count <= 0 || prev.combat.potionCooldownRemaining > 0) return prev;

      const consumable = CONSUMABLES.find(c => c.id === consumableId);
      if (!consumable) return prev;

      const newPlayer = prev.combat.playerArmy.map(p => ({ ...p, stats: { ...p.stats } }));
      const hero = newPlayer[0];
      if (!hero || hero.stats.hp <= 0) return prev;

      let nextActiveBuffs = [...prev.activeBuffs];
      let historyEntry: CombatTurn | null = null;
      const tick = prev.combat.tickCount;

      if (consumable.effect.type === 'heal') {
        const healAmount = Math.floor(hero.maxHp * consumable.effect.value);
        const actualHeal = Math.min(hero.maxHp - hero.stats.hp, healAmount);
        hero.stats.hp += actualHeal;
        historyEntry = {
          attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name,
          damage: -actualHeal, isCritical: false, tick, damageType: 'heal',
          message: `${hero.name} uses ${consumable.name} and restores ${actualHeal} HP!`
        };
      } else if (consumable.effect.type === 'buff' && consumable.effect.stat) {
        // Duration potions: only 1 active at a time. Remove existing ones.
        nextActiveBuffs = nextActiveBuffs.filter(b => {
          const c = CONSUMABLES.find(con => con.id === b.type);
          return c?.effect.type !== 'buff';
        });

        nextActiveBuffs.push({
          type: consumable.id,
          stat: consumable.effect.stat,
          value: consumable.effect.value,
          expiresAt: Date.now() + (consumable.effect.durationSeconds || 0) * 1000,
        });

        historyEntry = {
          attackerId: 'hero', attackerName: hero.name, targetId: 'hero', targetName: hero.name,
          damage: 0, isCritical: false, tick,
          message: `${hero.name} uses ${consumable.name} and feels empowered!`
        };
      }

      if (!historyEntry) return prev;

      return {
        ...prev,
        consumables: { ...prev.consumables, [consumableId]: count - 1 },
        activeBuffs: nextActiveBuffs,
        combat: {
          ...prev.combat,
          playerArmy: newPlayer,
          potionCooldownRemaining: 5,
          history: [historyEntry, ...prev.combat.history].slice(0, 60),
        },
      };
    });
  }, []);

  const collectRewards = useCallback(() => {
    setState(prev => {
      if (prev.combat.status !== 'victory' || !prev.combat.levelId || !prev.heroClass) return prev;
      const level = LEVELS.find((entry) => entry.id === prev.combat.levelId);
      if (!level) return prev;

      const isFirstClear = !prev.completedLevels.includes(level.id);
      const levelNumber = parseInt(level.id.replace('lvl', ''), 10);
      const coinGain = isFirstClear ? Math.floor(level.rewardCoins * 0.40) : Math.floor(level.rewardCoins * 0.15);
      const expGain = isFirstClear ? Math.floor(level.rewardExp * 0.40) : Math.floor(level.rewardExp * 0.15);
      const artifactShardGain = isFirstClear && levelNumber % 5 === 0 ? (levelNumber / 5) * 2 : 0;
      let heroLevel = prev.heroLevel;
      let heroExp = prev.heroExp + expGain;
      let heroExpToNext = prev.heroExpToNext;
      let bonusTalentPoints = 0;
      let bonusPotions = 0;

      while (heroExp >= heroExpToNext) {
        heroExp -= heroExpToNext;
        heroLevel++;
        heroExpToNext = Math.floor(heroExpToNext * 1.35);
        bonusTalentPoints++;
        if (heroLevel % 5 === 0) bonusPotions += 3;
      }

      const newUnlocked = [...prev.unlockedLevels];
      const nextLevel = LEVELS.find((entry) => entry.requiredLevelId === level.id);
      if (nextLevel && !newUnlocked.includes(nextLevel.id)) newUnlocked.push(nextLevel.id);

      const lootItems = (level.lootTable || [])
        .filter((entry) => Math.random() < entry.chance)
        .map((entry) => EQUIPMENT_DATABASE.find((item) => item.id === entry.equipmentId))
        .filter((item): item is Equipment => Boolean(item));

      let nextState: GameState = {
        ...prev,
        coins: prev.coins + coinGain,
        totalCoinsEarned: prev.totalCoinsEarned + coinGain,
        heroLevel, heroExp, heroExpToNext,
        talentPoints: prev.talentPoints + bonusTalentPoints,
        consumables: {
          ...prev.consumables,
          hp_potion: (prev.consumables['hp_potion'] || 0) + bonusPotions,
        },
        artifactShards: prev.artifactShards + artifactShardGain,
        unlockedLevels: newUnlocked,
        completedLevels: Array.from(new Set([...prev.completedLevels, level.id])),
        stats: {
          ...prev.stats,
          totalEnemiesDefeated: prev.stats.totalEnemiesDefeated + level.enemies.length,
          highestLevelReached: Math.max(prev.stats.highestLevelReached, levelNumber),
        },
      };

      if (lootItems.length > 0) {
        const lootResult = addLootToInventory(nextState, lootItems);
        nextState = { ...nextState, inventory: lootResult.inventory, equippedGear: lootResult.equippedGear };
      }

      nextState = applyAchievementRewards(nextState);

      const inventoryFull = nextState.inventory.length >= nextState.inventoryLimit;
      const shouldAutoRepeat = nextState.combatAutomation.autoRepeat && (!nextState.combatAutomation.stopOnInventoryFull || !inventoryFull);
      if (shouldAutoRepeat) {
        const encounter = createCombatEncounter(nextState, level.id);
        if (encounter) {
          combatRef.current = encounter.combatData;
          return { ...nextState, combat: encounter.combat };
        }
      }

      combatRef.current = null;
      return { ...nextState, combat: INITIAL_STATE.combat };
    });
  }, []);

  const endCombat = useCallback(() => {
    combatRef.current = null;
    setState(prev => ({ ...prev, combat: INITIAL_STATE.combat }));
  }, []);

  // Play time tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({ ...prev, stats: { ...prev.stats, totalPlayTime: prev.stats.totalPlayTime + 1 } }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hardReset = useCallback(() => {
    if (window.confirm('Are you SURE? This will permanently delete ALL progress!')) {
      localStorage.removeItem(SAVE_KEY);
      combatRef.current = null;
      setState(INITIAL_STATE);
      window.location.reload();
    }
  }, []);

  return {
    state, isInitialized, heroStats,
    selectClass, allocateTalent, trainStat, getTrainingQuote,
    equipItem, sellItem, sellItemsByRarity, sellAllInventory, toggleItemLock, toggleItemFavorite, toggleAutoEquipUpgrades,
    unlockArtifact, toggleArtifactEquip, updateCombatAutomation,
    startMission, collectMission, cancelMission, buyItem, buyConsumable,
    startCombat, processCombatTick, useAbility, useConsumable, collectRewards, endCombat, hardReset,
  };
}
