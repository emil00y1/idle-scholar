export type UnitType = 'knight' | 'warrior' | 'archer' | 'mage' | 'healer';

export interface UnitStats {
  hp: number;
  maxHp: number;
  atk: number;
  matk: number;
  def: number;
  mdef: number;
  spd: number;
  eva: number;
  critChance: number;
  thorns: number;
  lifesteal: number;
  damageReduction: number;
}

export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'gloves' | 'boots' | 'accessory';

export interface Equipment {
  id: string;
  instanceId?: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Relic' | 'Legendary' | 'Godlike';
  stats: Partial<UnitStats> & {
    lifesteal?: number;
  };
  icon: string;
  allowedUnits?: UnitType[];
}

export interface Consumable {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  effect: {
    type: 'heal' | 'buff';
    stat?: keyof UnitStats;
    value: number;
    durationSeconds?: number;
  };
}

export interface ActiveBuff {
  type: string;
  stat: keyof UnitStats;
  value: number;
  expiresAt: number;
}

export interface EnemyStats extends Omit<UnitStats, 'critChance' | 'thorns' | 'lifesteal' | 'damageReduction'> {
  critChance?: number;
  thorns?: number;
  lifesteal?: number;
  damageReduction?: number;
}

export interface Enemy {
  id: string;
  name: string;
  type: UnitType;
  stats: EnemyStats;
  rewardCoins: number;
  rewardExp: number;
  icon: string;
}

export interface LootTableEntry {
  equipmentId: string;
  chance: number;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  enemies: Enemy[];
  requiredLevelId?: string;
  rewardCoins: number;
  rewardExp: number;
  lootTable?: LootTableEntry[];
}

export interface CombatTurn {
  attackerId: string;
  attackerName: string;
  targetId: string;
  targetName: string;
  damage: number;
  isCritical: boolean;
  message: string;
  tick: number;
  damageType?: 'poison' | 'physical' | 'magic' | 'heal';
}

export interface UnitInstance {
  instanceId: string;
  type: UnitType;
  name: string;
  stats: UnitStats;
  isPlayer: boolean;
  maxHp: number;
  ticksUntilAttack: number;
  attackInterval: number;
  isPoisoned?: boolean;
}

export type AbilitySlot = 1 | 2 | 3 | 4 | 5 | 'F';

export type AbilityTarget = 'single' | 'aoe' | 'self';

export interface CombatAbilityDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  slot: AbilitySlot;
  unlockLevel: number;
  target: AbilityTarget;
  cooldownTicks: number;
}

export interface CombatAbilityState extends CombatAbilityDefinition {
  cooldownRemaining: number;
  unlocked: boolean;
}

export interface CombatState {
  isActive: boolean;
  levelId: string | null;
  playerArmy: UnitInstance[];
  enemyArmy: UnitInstance[];
  abilities: CombatAbilityState[];
  consumables: Record<string, number>;
  potionCooldownRemaining: number;
  tickCount: number;
  history: CombatTurn[];
  status: 'ongoing' | 'victory' | 'defeat';
}

// --- Talent Tree ---

export type TalentEffect =
  | { type: 'flatStat'; stat: keyof UnitStats; value: number }
  | { type: 'percentStat'; stat: keyof UnitStats; value: number }
  | { type: 'critChance'; value: number }
  | { type: 'critDamage'; value: number }
  | { type: 'lifesteal'; value: number }
  | { type: 'damageReduction'; value: number }
  | { type: 'thorns'; value: number }
  | { type: 'evasion'; value: number }
  | { type: 'multiStrike'; value: number }
  | { type: 'dot'; value: number }
  | { type: 'regen'; value: number }
  | { type: 'special'; id: string; description: string };

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxRank: number;
  branch: string;
  tier: number;
  isShared?: boolean;
  isMaster?: boolean;
  pointCost?: number;
  effects: TalentEffect[];
  requires?: { id: string; minRank: number }[];
  x?: number; // Visual position (0-100)
  y?: number; // Visual position (0-100)
}

export interface ClassTalentTree {
  className: UnitType;
  title: string;
  branches: { id: string; name: string; icon: string; description: string }[];
  nodes: TalentNode[];
}

export interface ClassInfo {
  type: UnitType;
  name: string;
  title: string;
  description: string;
  icon: string;
  baseStats: UnitStats;
  growthStats: UnitStats;
}

export interface HeroBonuses {
  flatAtk: number;
  flatMatk: number;
  flatDef: number;
  flatMdef: number;
  flatHp: number;
  flatSpd: number;
  pctAtk: number;
  pctMatk: number;
  pctDef: number;
  pctMdef: number;
  pctHp: number;
  pctSpd: number;
  critChance: number;
  critDamage: number;
  lifesteal: number;
  damageReduction: number;
  thorns: number;
  evasion: number;
  multiStrike: number;
  dot: number;
  regen: number;
  specials: Set<string>;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Relic';
  costShards: number;
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  requirement: {
    type: 'coins' | 'levels' | 'kills' | 'power';
    value: number;
  };
  rewards?: {
    coins?: number;
    talentPoints?: number;
    artifactShards?: number;
  };
}

export interface UnitTypeData {
  type: UnitType;
  count: number;
  level: number;
  exp: number;
  expToNextLevel: number;
  baseStats: UnitStats;
  growthStats: UnitStats;
  specializationId: string | null;
}

export interface Specialization {
  id: string;
  name: string;
  description: string;
  statBonus: Partial<UnitStats>;
  growthBonus: Partial<UnitStats>;
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  category: string;
  tier: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  effect: (level: number) => number;
  dependencies?: string[];
  unit?: string;
}

// --- Missions ---

export type MissionRewardType = 'exp_focus' | 'coin_focus' | 'balanced' | 'rare_loot' | 'talent_point' | 'artifact_shard';

export interface MissionLootEntry {
  equipmentId: string;
  chance: number; // 0-1
}

export interface MissionReward {
  coins: number;
  exp: number;
  talentPoints?: number;
  artifactShards?: number;
  lootTable?: MissionLootEntry[];
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  icon: string;
  durationSeconds: number;
  rewardType: MissionRewardType;
  rewards: MissionReward;
  requiredLevel: number;
  category: 'patrol' | 'expedition' | 'raid' | 'quest' | 'dungeon';
}

export interface ActiveMission {
  missionId: string;
  startedAt: number;
  endsAt: number;
}

export interface CombatAutomationSettings {
  autoRepeat: boolean;
  stopOnInventoryFull: boolean;
}

// --- Game State ---

export interface GameState {
  heroClass: UnitType | null;
  heroLevel: number;
  heroExp: number;
  heroExpToNext: number;

  coins: number;
  totalCoinsEarned: number;

  talentPoints: number;
  talentsOwned: Record<string, number>;
  statTraining: Record<string, number>;

  inventory: Equipment[];
  equippedGear: Record<EquipmentSlot, string | null>;

  unlockedLevels: string[];
  completedLevels: string[];

  artifactShards: number;
  artifactsOwned: string[];
  equippedArtifacts: string[];
  earnedAchievements: string[];
  theme: 'dark' | 'light';

  lockedItemIds: string[];
  favoriteItemIds: string[];
  autoEquipUpgrades: boolean;
  inventoryLimit: number;
  artifactSlots: number;
  combatAutomation: CombatAutomationSettings;

  activeMissions: ActiveMission[];
  completedMissionIds: string[];
  missionCooldowns: Record<string, number>; // missionId -> timestamp when available again
  missionSlots: number;

  activeBuffs: ActiveBuff[];
  consumables: Record<string, number>;

  combat: CombatState;

  stats: {
    startTime: number;
    totalPlayTime: number;
    totalCoinsSpent: number;
    totalEnemiesDefeated: number;
    highestLevelReached: number;
  };

  lastTick: number;
}
