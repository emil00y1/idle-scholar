import { UnitType, Level, Artifact, Achievement, Equipment, ClassInfo, ClassTalentTree, UnitTypeData, Specialization, Talent, Mission, MissionLootEntry, CombatAbilityDefinition, Consumable } from './types';

// ===== CLASS DEFINITIONS =====

export const CLASS_INFO: Record<UnitType, ClassInfo> = {
  knight: {
    type: 'knight', name: 'Knight', title: 'Guardian of the Realm', icon: '🛡️',
    description: 'A stalwart defender with high HP and Defense. Masters of endurance and holy wrath.',
    baseStats: { hp: 250, maxHp: 250, atk: 18, matk: 0, def: 22, mdef: 15, spd: 10, eva: 0, critChance: 0.05, thorns: 0, lifesteal: 0, damageReduction: 0 },
    growthStats: { hp: 18, maxHp: 18, atk: 3, matk: 0, def: 4, mdef: 1, spd: 1, eva: 0, critChance: 0.001, thorns: 0, lifesteal: 0, damageReduction: 0 },
  },
  warrior: {
    type: 'warrior', name: 'Warrior', title: 'Blade of Fury', icon: '⚔️',
    description: 'A relentless fighter who thrives on aggression. Crits, lifesteal, and raw damage.',
    baseStats: { hp: 200, maxHp: 200, atk: 28, matk: 0, def: 14, mdef: 8, spd: 14, eva: 0.02, critChance: 0.10, thorns: 0, lifesteal: 0, damageReduction: 0 },
    growthStats: { hp: 14, maxHp: 14, atk: 5, matk: 0, def: 2, mdef: 0.5, spd: 2, eva: 0, critChance: 0.002, thorns: 0, lifesteal: 0, damageReduction: 0 },
  },
  archer: {
    type: 'archer', name: 'Archer', title: 'Whisper of the Wild', icon: '🏹',
    description: 'A swift marksman who poisons and evades. Speed, precision, and deadly DoTs.',
    baseStats: { hp: 160, maxHp: 160, atk: 24, matk: 0, def: 10, mdef: 10, spd: 22, eva: 0.08, critChance: 0.12, thorns: 0, lifesteal: 0, damageReduction: 0 },
    growthStats: { hp: 10, maxHp: 10, atk: 4, matk: 0, def: 1, mdef: 0.5, spd: 3, eva: 0.001, critChance: 0.003, thorns: 0, lifesteal: 0, damageReduction: 0 },
  },
  mage: {
    type: 'mage', name: 'Mage', title: 'Arcane Sovereign', icon: '🔮',
    description: 'A master of arcane forces. Devastating crits, time manipulation, and raw spell power.',
    baseStats: { hp: 130, maxHp: 130, atk: 0, matk: 32, def: 8, mdef: 12, spd: 16, eva: 0.03, critChance: 0.08, thorns: 0, lifesteal: 0, damageReduction: 0 },
    growthStats: { hp: 8, maxHp: 8, atk: 0, matk: 6, def: 1, mdef: 0.5, spd: 2, eva: 0, critChance: 0.002, thorns: 0, lifesteal: 0, damageReduction: 0 },
  },
  healer: {
    type: 'healer', name: 'Cleric', title: "Light's Chosen", icon: '✨',
    description: 'A divine champion who blends healing, protection, and holy damage.',
    baseStats: { hp: 190, maxHp: 190, atk: 0, matk: 16, def: 16, mdef: 18, spd: 13, eva: 0.02, critChance: 0.05, thorns: 0, lifesteal: 0, damageReduction: 0 },
    growthStats: { hp: 12, maxHp: 12, atk: 0, matk: 3, def: 2, mdef: 1, spd: 1, eva: 0, critChance: 0.001, thorns: 0, lifesteal: 0, damageReduction: 0 },
  },
};

export const UNIT_TYPES: Record<UnitType, UnitTypeData> = {
  knight: {
    type: 'knight', count: 0, level: 1, exp: 0, expToNextLevel: 100,
    baseStats: CLASS_INFO.knight.baseStats, growthStats: CLASS_INFO.knight.growthStats,
    specializationId: null
  },
  warrior: {
    type: 'warrior', count: 0, level: 1, exp: 0, expToNextLevel: 100,
    baseStats: CLASS_INFO.warrior.baseStats, growthStats: CLASS_INFO.warrior.growthStats,
    specializationId: null
  },
  archer: {
    type: 'archer', count: 0, level: 1, exp: 0, expToNextLevel: 100,
    baseStats: CLASS_INFO.archer.baseStats, growthStats: CLASS_INFO.archer.growthStats,
    specializationId: null
  },
  mage: {
    type: 'mage', count: 0, level: 1, exp: 0, expToNextLevel: 100,
    baseStats: CLASS_INFO.mage.baseStats, growthStats: CLASS_INFO.mage.growthStats,
    specializationId: null
  },
  healer: {
    type: 'healer', count: 0, level: 1, exp: 0, expToNextLevel: 100,
    baseStats: CLASS_INFO.healer.baseStats, growthStats: CLASS_INFO.healer.growthStats,
    specializationId: null
  },
};

// ===== SPECIALIZATIONS =====

export const SPECIALIZATIONS: Record<string, Specialization> = {
  paladin: {
    id: 'paladin', name: 'Paladin', description: 'Holy warrior with enhanced defense and support.',
    statBonus: { hp: 150, maxHp: 150, atk: 10, def: 15, mdef: 20, critChance: 0.02 },
    growthBonus: { hp: 10, maxHp: 10, atk: 2, def: 3, mdef: 2, critChance: 0.0005 }
  },
  death_knight: {
    id: 'death_knight', name: 'Death Knight', description: 'Dark guardian who deals heavy damage.',
    statBonus: { hp: 200, maxHp: 200, atk: 25, def: 5, mdef: 10, spd: -2, critChance: 0.05 },
    growthBonus: { hp: 15, maxHp: 15, atk: 4, def: 1, critChance: 0.001 }
  },
  berserker: {
    id: 'berserker', name: 'Berserker', description: 'Aggressive fighter who trades defense for power.',
    statBonus: { hp: 50, maxHp: 50, atk: 40, def: -10, spd: 5, critChance: 0.08 },
    growthBonus: { hp: 5, maxHp: 5, atk: 6, def: -1, spd: 1, critChance: 0.002 }
  },
  ranger: {
    id: 'ranger', name: 'Ranger', description: 'Swift archer with high evasion and speed.',
    statBonus: { hp: 30, maxHp: 30, atk: 15, def: 2, spd: 15, eva: 0.08, critChance: 0.05 },
    growthBonus: { hp: 3, maxHp: 3, atk: 3, spd: 3, critChance: 0.001 }
  },
  sharpshooter: {
    id: 'sharpshooter', name: 'Sharpshooter', description: 'Precise marksman with devastating attack power.',
    statBonus: { hp: 10, maxHp: 10, atk: 35, spd: 5, eva: 0.05, critChance: 0.12 },
    growthBonus: { hp: 1, maxHp: 1, atk: 5, spd: 1, critChance: 0.003 }
  },
  archmage: {
    id: 'archmage', name: 'Archmage', description: 'Master of arcane arts with extreme magic power.',
    statBonus: { hp: 20, maxHp: 20, matk: 50, mdef: 10, spd: 5, critChance: 0.06 },
    growthBonus: { hp: 2, maxHp: 2, matk: 8, critChance: 0.001 }
  },
  saint: {
    id: 'saint', name: 'Saint', description: 'Ultimate healer with divine protection.',
    statBonus: { hp: 100, maxHp: 100, matk: 10, def: 10, mdef: 20, spd: 5, critChance: 0.02 },
    growthBonus: { hp: 12, maxHp: 12, matk: 2, def: 2, mdef: 2, spd: 1, critChance: 0.0005 }
  },
  inquisitor: {
    id: 'inquisitor', name: 'Inquisitor', description: 'Holy damage dealer who punishes the wicked.',
    statBonus: { hp: 50, maxHp: 50, matk: 25, def: 8, mdef: 15, spd: 2, critChance: 0.08 },
    growthBonus: { hp: 6, maxHp: 6, matk: 4, def: 1, mdef: 1, spd: 1, critChance: 0.001 }
  },
  holy_bastion: {
    id: 'holy_bastion', name: 'Holy Bastion', description: 'Unstoppable fortress of light.',
    statBonus: { hp: 500, maxHp: 500, matk: 20, def: 50, mdef: 40, spd: -5, critChance: 0.01 },
    growthBonus: { hp: 30, maxHp: 30, matk: 2, def: 8, mdef: 3, critChance: 0.0002 }
  },
  blood_reaver: {
    id: 'blood_reaver', name: 'Blood Reaver', description: 'Terrifying warrior fueled by battle.',
    statBonus: { hp: 300, maxHp: 300, atk: 80, def: 10, spd: 5, eva: 0.03, critChance: 0.10 },
    growthBonus: { hp: 20, maxHp: 20, atk: 10, def: 2, spd: 1, critChance: 0.002 }
  },
  sniper: {
    id: 'sniper', name: 'Sniper', description: 'Deadly accuracy from extreme range.',
    statBonus: { hp: 100, maxHp: 100, atk: 100, def: 5, spd: 10, eva: 0.10, critChance: 0.20 },
    growthBonus: { hp: 10, maxHp: 10, atk: 15, def: 1, spd: 2, critChance: 0.005 }
  },
  void_weaver: {
    id: 'void_weaver', name: 'Void Weaver', description: 'Bends reality with dark magic.',
    statBonus: { hp: 150, maxHp: 150, matk: 150, mdef: 20, spd: 15, eva: 0.05, critChance: 0.10 },
    growthBonus: { hp: 15, maxHp: 15, matk: 20, mdef: 2, spd: 2, critChance: 0.002 }
  },
  high_priest: {
    id: 'high_priest', name: 'High Priest', description: 'Avatar of divine grace.',
    statBonus: { hp: 400, maxHp: 400, matk: 50, def: 30, mdef: 50, spd: 10 },
    growthBonus: { hp: 35, maxHp: 35, matk: 8, def: 5, mdef: 5, spd: 2 }
  }
};

// ===== TALENTS =====

export const TALENTS: Talent[] = [
  { id: 't1', name: 'Warrior Drill', description: 'Increases all units Attack by 5% per level.', category: 'Offense', tier: 1, maxLevel: 10, baseCost: 5, costMultiplier: 1.5, effect: (lvl) => lvl * 0.05 },
  { id: 't2', name: 'Endurance Training', description: 'Increases all units HP by 5% per level.', category: 'Defense', tier: 1, maxLevel: 10, baseCost: 5, costMultiplier: 1.5, effect: (lvl) => lvl * 0.05 },
  { id: 't3', name: 'Armor Maintenance', description: 'Increases all units Defense by 5% per level.', category: 'Defense', tier: 2, maxLevel: 10, baseCost: 20, costMultiplier: 1.6, effect: (lvl) => lvl * 0.05, dependencies: ['t2'] },
  { id: 't4', name: 'Speed Drills', description: 'Increases all units Speed by 5% per level.', category: 'Utility', tier: 2, maxLevel: 10, baseCost: 20, costMultiplier: 1.6, effect: (lvl) => lvl * 0.05, dependencies: ['t1'] },
  { id: 't5', name: 'Combat Experience', description: 'Increases EXP gain by 10% per level.', category: 'Utility', tier: 3, maxLevel: 5, baseCost: 100, costMultiplier: 2.0, effect: (lvl) => lvl * 0.1, dependencies: ['t4'] },
];

// ===== BUFFS =====

export const BUFFS = [];

// ===== STAT TRAINING (coin purchases) =====

export const STAT_TRAINING = [
  { id: 'atk', label: 'Attack Training', icon: '⚔️', perPurchase: 3, baseCost: 100, costMultiplier: 1.15, unit: '' },
  { id: 'matk', label: 'Arcane Studies', icon: '🔮', perPurchase: 3, baseCost: 120, costMultiplier: 1.15, unit: '' },
  { id: 'hp', label: 'Endurance Training', icon: '❤️', perPurchase: 12, baseCost: 80, costMultiplier: 1.12, unit: '' },
  { id: 'def', label: 'Defense Training', icon: '🛡️', perPurchase: 2, baseCost: 120, costMultiplier: 1.18, unit: '' },
  { id: 'mdef', label: 'Ward Training', icon: '🔷', perPurchase: 2, baseCost: 130, costMultiplier: 1.17, unit: '' },
  { id: 'spd', label: 'Speed Training', icon: '💨', perPurchase: 2, baseCost: 150, costMultiplier: 1.2, unit: '' },
  { id: 'eva', label: 'Evasion Training', icon: '🌪️', perPurchase: 0.5, baseCost: 200, costMultiplier: 1.25, unit: '%' },
];

// ===== ABILITIES =====

export const ABILITY_DATABASE: Record<string, CombatAbilityDefinition> = {
  knight_shield_bash: {
    id: 'knight_shield_bash',
    name: 'Shield Bash',
    description: 'Single target. Heavy strike that delays the target.',
    icon: '🛡️',
    slot: 1,
    unlockLevel: 1,
    target: 'single',
    cooldownTicks: 9,
  },
  knight_hammerfall: {
    id: 'knight_hammerfall',
    name: 'Hammerfall',
    description: 'AOE. Slams every enemy with a defensive shockwave.',
    icon: '🔨',
    slot: 2,
    unlockLevel: 5,
    target: 'aoe',
    cooldownTicks: 16,
  },
  knight_guardians_oath: {
    id: 'knight_guardians_oath',
    name: "Guardian's Oath",
    description: 'Utility. Restore health and fortify defenses for the rest of the fight.',
    icon: '🕯️',
    slot: 3,
    unlockLevel: 12,
    target: 'self',
    cooldownTicks: 20,
  },
  knight_last_bastion: {
    id: 'knight_last_bastion',
    name: 'Last Bastion',
    description: 'AOE. Crush the enemy line and heal from the impact.',
    icon: '🏰',
    slot: 4,
    unlockLevel: 25,
    target: 'aoe',
    cooldownTicks: 30,
  },

  warrior_crushing_blow: {
    id: 'warrior_crushing_blow',
    name: 'Crushing Blow',
    description: 'Single target. Brutal strike that hits harder on weakened enemies.',
    icon: '🪓',
    slot: 1,
    unlockLevel: 1,
    target: 'single',
    cooldownTicks: 8,
  },
  warrior_whirlwind: {
    id: 'warrior_whirlwind',
    name: 'Whirlwind',
    description: 'AOE. Spin through the battlefield and hit everything in reach.',
    icon: '🌪️',
    slot: 2,
    unlockLevel: 5,
    target: 'aoe',
    cooldownTicks: 14,
  },
  warrior_war_cry: {
    id: 'warrior_war_cry',
    name: 'War Cry',
    description: 'Utility. Increase attack speed and power for the rest of battle.',
    icon: '📯',
    slot: 3,
    unlockLevel: 12,
    target: 'self',
    cooldownTicks: 19,
  },
  warrior_execution_line: {
    id: 'warrior_execution_line',
    name: 'Execution Line',
    description: 'Single target. Massive finisher with bonus damage to low-health foes.',
    icon: '💀',
    slot: 4,
    unlockLevel: 25,
    target: 'single',
    cooldownTicks: 27,
  },

  archer_aimed_shot: {
    id: 'archer_aimed_shot',
    name: 'Aimed Shot',
    description: 'Single target. Precision arrow with elevated crit chance.',
    icon: '🎯',
    slot: 1,
    unlockLevel: 1,
    target: 'single',
    cooldownTicks: 7,
  },
  archer_volley: {
    id: 'archer_volley',
    name: 'Volley',
    description: 'AOE. Rain arrows across the whole enemy formation.',
    icon: '🏹',
    slot: 2,
    unlockLevel: 5,
    target: 'aoe',
    cooldownTicks: 14,
  },
  archer_smokescreen: {
    id: 'archer_smokescreen',
    name: 'Smokescreen',
    description: 'Utility. Gain evasion and throw off enemy timing.',
    icon: '🌫️',
    slot: 3,
    unlockLevel: 12,
    target: 'self',
    cooldownTicks: 18,
  },
  archer_deadeye_raid: {
    id: 'archer_deadeye_raid',
    name: 'Deadeye Raid',
    description: 'Single target. Multi-hit burst that focuses one target.',
    icon: '🦅',
    slot: 4,
    unlockLevel: 25,
    target: 'single',
    cooldownTicks: 25,
  },
  archer_arrow_hell: {
    id: 'archer_arrow_hell',
    name: 'Arrow Hell',
    description: 'AOE. Replace Volley with a storm of repeated impacts.',
    icon: '🎆',
    slot: 2,
    unlockLevel: 5,
    target: 'aoe',
    cooldownTicks: 14,
  },

  mage_arcane_bolt: {
    id: 'mage_arcane_bolt',
    name: 'Arcane Bolt',
    description: 'Single target. Focused blast of raw arcane force.',
    icon: '🔮',
    slot: 1,
    unlockLevel: 1,
    target: 'single',
    cooldownTicks: 7,
  },
  mage_comet_storm: {
    id: 'mage_comet_storm',
    name: 'Comet Storm',
    description: 'AOE. Calls falling stars across the entire battlefield.',
    icon: '☄️',
    slot: 2,
    unlockLevel: 5,
    target: 'aoe',
    cooldownTicks: 15,
  },
  mage_temporal_shift: {
    id: 'mage_temporal_shift',
    name: 'Temporal Shift',
    description: 'Utility. Reset your attack timer and accelerate future casts.',
    icon: '⌛',
    slot: 3,
    unlockLevel: 12,
    target: 'self',
    cooldownTicks: 19,
  },
  mage_absolute_zero: {
    id: 'mage_absolute_zero',
    name: 'Absolute Zero',
    description: 'AOE. Massive spell that also slows every survivor.',
    icon: '❄️',
    slot: 4,
    unlockLevel: 25,
    target: 'aoe',
    cooldownTicks: 28,
  },
  mage_arcane_singularity: {
    id: 'mage_arcane_singularity',
    name: 'Arcane Singularity',
    description: 'AOE. Replace Comet Storm with a denser, harder-hitting collapse.',
    icon: '🌀',
    slot: 2,
    unlockLevel: 5,
    target: 'aoe',
    cooldownTicks: 15,
  },

  healer_smite: {
    id: 'healer_smite',
    name: 'Smite',
    description: 'Single target. Holy blast that also restores your health.',
    icon: '☀️',
    slot: 1,
    unlockLevel: 1,
    target: 'single',
    cooldownTicks: 7,
  },
  healer_consecration: {
    id: 'healer_consecration',
    name: 'Consecration',
    description: 'AOE. Holy wave that damages enemies and restores life.',
    icon: '✨',
    slot: 2,
    unlockLevel: 5,
    target: 'aoe',
    cooldownTicks: 14,
  },
  healer_sanctuary: {
    id: 'healer_sanctuary',
    name: 'Sanctuary',
    description: 'Utility. Large heal and lasting ward for the hero.',
    icon: '⛪',
    slot: 3,
    unlockLevel: 12,
    target: 'self',
    cooldownTicks: 19,
  },
  healer_final_rite: {
    id: 'healer_final_rite',
    name: 'Final Rite',
    description: 'AOE. Holy detonation that both purges foes and heals you.',
    icon: '👼',
    slot: 4,
    unlockLevel: 25,
    target: 'aoe',
    cooldownTicks: 27,
  },
  healer_holy_retribution: {
    id: 'healer_holy_retribution',
    name: 'Holy Retribution',
    description: 'Single target. Replace Smite with a true-damage holy spear.',
    icon: '⚔️',
    slot: 1,
    unlockLevel: 1,
    target: 'single',
    cooldownTicks: 7,
  },

  // === MASTERY ABILITIES (Level 10) ===
  knight_bastion_call: {
    id: 'knight_bastion_call',
    name: "Bastion's Call",
    description: 'Self. Enter a legendary stance that changes based on your talents.',
    icon: '🎺',
    slot: 5,
    unlockLevel: 10,
    target: 'self',
    cooldownTicks: 24,
  },
  warrior_blood_surge: {
    id: 'warrior_blood_surge',
    name: 'Blood Surge',
    description: 'Self. Surge with adrenaline, gaining bonuses from your talent branches.',
    icon: '🩸',
    slot: 5,
    unlockLevel: 10,
    target: 'self',
    cooldownTicks: 22,
  },
  archer_hunters_mark: {
    id: 'archer_hunters_mark',
    name: "Hunter's Mark",
    description: 'Single. Mark a foe, making them vulnerable based on your build.',
    icon: '🎯',
    slot: 5,
    unlockLevel: 10,
    target: 'single',
    cooldownTicks: 20,
  },
  mage_elemental_overload: {
    id: 'mage_elemental_overload',
    name: 'Elemental Overload',
    description: 'Self. Empower your next strike with chaotic arcane energy.',
    icon: '⚡',
    slot: 5,
    unlockLevel: 10,
    target: 'self',
    cooldownTicks: 20,
  },
  healer_divine_intervention: {
    id: 'healer_divine_intervention',
    name: 'Divine Intervention',
    description: 'Self. Call upon the heavens to shield and mend.',
    icon: '⛪',
    slot: 5,
    unlockLevel: 10,
    target: 'self',
    cooldownTicks: 22,
  },
  // --- F Combo Abilities ---
  knight_vanguard_strike: {
    id: 'knight_vanguard_strike', name: 'Vanguard Strike',
    description: 'Single target. Quick strike that increases your next ability damage by 20%.',
    icon: '⚔️', slot: 'F', unlockLevel: 1, target: 'single', cooldownTicks: 4,
  },
  warrior_blade_rush: {
    id: 'warrior_blade_rush', name: 'Blade Rush',
    description: 'Single target. Rapid dash that increases your next crit chance by 15%.',
    icon: '💨', slot: 'F', unlockLevel: 1, target: 'single', cooldownTicks: 4,
  },
  archer_quick_shot: {
    id: 'archer_quick_shot', name: 'Quick Shot',
    description: 'Single target. Instant arrow that reduces your next ability cooldown by 2 ticks.',
    icon: '🏹', slot: 'F', unlockLevel: 1, target: 'single', cooldownTicks: 4,
  },
  mage_arcane_spark: {
    id: 'mage_arcane_spark', name: 'Arcane Spark',
    description: 'Single target. Tiny blast that makes your next spell hit 25% harder.',
    icon: '✨', slot: 'F', unlockLevel: 1, target: 'single', cooldownTicks: 4,
  },
  healer_renew: {
    id: 'healer_renew', name: 'Renew',
    description: 'Self. Minor mending that increases your next heal by 30%.',
    icon: '🌿', slot: 'F', unlockLevel: 1, target: 'self', cooldownTicks: 4,
  },
};

export const CLASS_ABILITY_LOADOUTS: Record<UnitType, string[]> = {
  knight: ['knight_shield_bash', 'knight_hammerfall', 'knight_guardians_oath', 'knight_last_bastion', 'knight_bastion_call', 'knight_vanguard_strike'],
  warrior: ['warrior_crushing_blow', 'warrior_whirlwind', 'warrior_war_cry', 'warrior_execution_line', 'warrior_blood_surge', 'warrior_blade_rush'],
  archer: ['archer_aimed_shot', 'archer_volley', 'archer_smokescreen', 'archer_deadeye_raid', 'archer_hunters_mark', 'archer_quick_shot'],
  mage: ['mage_arcane_bolt', 'mage_comet_storm', 'mage_temporal_shift', 'mage_absolute_zero', 'mage_elemental_overload', 'mage_arcane_spark'],
  healer: ['healer_smite', 'healer_consecration', 'healer_sanctuary', 'healer_final_rite', 'healer_divine_intervention', 'healer_renew'],
};

export function resolveAbilityLoadout(heroClass: UnitType, specials: Set<string>) {
  const loadout = [...CLASS_ABILITY_LOADOUTS[heroClass]];

  if (specials.has('arrow_hell')) loadout[1] = 'archer_arrow_hell';
  if (specials.has('arcane_singularity')) loadout[1] = 'mage_arcane_singularity';
  if (specials.has('avatar_of_vengeance')) loadout[0] = 'healer_holy_retribution';

  return loadout.map((abilityId) => ABILITY_DATABASE[abilityId]);
}

// ===== TALENT TREES (per class) - kept for compatibility =====

export const TALENT_TREES: Record<UnitType, ClassTalentTree> = {
  knight: {
    className: 'knight',
    title: 'Guardian',
    branches: [
      { id: 'juggernaut', name: 'Juggernaut', icon: '🛡️', description: 'Pure Tank. Focused on HP and Damage Reduction.' },
      { id: 'retribution', name: 'Retribution', icon: '⚔️', description: 'Thorns Tank. Reflects damage and counter-attacks.' },
      { id: 'holy_shield', name: 'Holy Shield', icon: '✨', description: 'Sustain Tank. Focused on HP Regen and divine shields.' },
    ],
    nodes: [
      // Juggernaut
      { id: 'k_j1', name: 'Toughness', description: '+50 HP per rank', icon: '❤️', maxRank: 5, branch: 'juggernaut', tier: 1, isShared: true, x: 20, y: 10, effects: [{ type: 'flatStat', stat: 'hp', value: 50 }] },
      { id: 'k_j2', name: 'Heavy Armor', description: '+10 Defense per rank', icon: '🛡️', maxRank: 5, branch: 'juggernaut', tier: 2, x: 15, y: 25, effects: [{ type: 'flatStat', stat: 'def', value: 10 }], requires: [{ id: 'k_j1', minRank: 3 }] },
      { id: 'k_jr1', name: 'Spiked Plate', description: '+10 Defense & +2% Thorns', icon: '🛡️', maxRank: 5, branch: 'juggernaut', tier: 3, x: 30, y: 35, effects: [{ type: 'flatStat', stat: 'def', value: 10 }, { type: 'thorns', value: 0.02 }], requires: [{ id: 'k_j2', minRank: 2 }, { id: 'k_r2', minRank: 2 }] },
      { id: 'k_j3', name: 'Unbreakable', description: '+5% Damage Reduction per rank', icon: '🧱', maxRank: 3, branch: 'juggernaut', tier: 3, x: 10, y: 40, effects: [{ type: 'damageReduction', value: 0.05 }, { type: 'special', id: 'mastery_knight_juggernaut', description: "Bastion's Call: +20% DR" }], requires: [{ id: 'k_j2', minRank: 3 }] },
      // Retribution
      { id: 'k_r1', name: 'Spiked Shield', description: '+5% Thorns per rank', icon: '🌵', maxRank: 5, branch: 'retribution', tier: 1, isShared: true, x: 50, y: 10, effects: [{ type: 'thorns', value: 0.05 }] },
      { id: 'k_r2', name: 'Counter Strike', description: '+15 Attack per rank', icon: '⚔️', maxRank: 5, branch: 'retribution', tier: 2, x: 50, y: 25, effects: [{ type: 'flatStat', stat: 'atk', value: 15 }], requires: [{ id: 'k_r1', minRank: 3 }] },
      { id: 'k_rh1', name: 'Holy Retribution', description: '+5 Attack & +0.1% Regen', icon: '✨', maxRank: 5, branch: 'retribution', tier: 3, x: 65, y: 35, effects: [{ type: 'flatStat', stat: 'atk', value: 5 }, { type: 'regen', value: 0.001 }], requires: [{ id: 'k_r2', minRank: 2 }, { id: 'k_h2', minRank: 2 }] },
      { id: 'k_r3', name: 'Vengeance', description: '+20% Crit Damage per rank', icon: '💥', maxRank: 3, branch: 'retribution', tier: 3, x: 45, y: 40, effects: [{ type: 'critDamage', value: 0.2 }, { type: 'special', id: 'mastery_knight_retribution', description: "Bastion's Call: Thorns x2" }], requires: [{ id: 'k_r2', minRank: 3 }] },
      { id: 'k_r4', name: 'Jagged Edges', description: '+10% Thorns & +10 Attack', icon: '🔪', maxRank: 5, branch: 'retribution', tier: 4, x: 50, y: 55, effects: [{ type: 'thorns', value: 0.1 }, { type: 'flatStat', stat: 'atk', value: 10 }], requires: [{ id: 'k_r3', minRank: 2 }] },
      { id: 'k_r5', name: 'Bulwark of Rage', description: 'Special: Thorns heal for 10% of damage dealt', icon: '🩸', maxRank: 1, branch: 'retribution', tier: 5, x: 55, y: 70, effects: [{ type: 'special', id: 'thorns_heal', description: 'Thorns heal for 10% of damage' }], requires: [{ id: 'k_r4', minRank: 3 }] },
      { id: 'k_r6', name: 'Iron Maiden', description: '+20% Thorns & +50 Attack per rank', icon: '⛓️', maxRank: 5, branch: 'retribution', tier: 6, effects: [{ type: 'thorns', value: 0.2 }, { type: 'flatStat', stat: 'atk', value: 50 }], requires: [{ id: 'k_r5', minRank: 1 }] },
      { id: 'k_r7', name: 'Retributive Justice', description: 'Special: Eye for an Eye (Thorns deal 100% raw damage received)', icon: '⚖️', maxRank: 1, branch: 'retribution', tier: 7, effects: [{ type: 'special', id: 'eye_for_an_eye', description: 'Thorns deal 100% raw dmg' }], requires: [{ id: 'k_r6', minRank: 3 }] },

      // Holy Shield
      { id: 'k_h1', name: 'Meditation', description: '+0.2% HP Regen per rank', icon: '🧘', maxRank: 5, branch: 'holy_shield', tier: 1, isShared: true, x: 80, y: 10, effects: [{ type: 'regen', value: 0.002 }] },
      { id: 'k_h2', name: 'Divine Protection', description: '+10% Defense per rank', icon: '🛡️', maxRank: 5, branch: 'holy_shield', tier: 2, x: 85, y: 25, effects: [{ type: 'percentStat', stat: 'def', value: 0.1 }], requires: [{ id: 'k_h1', minRank: 3 }] },
      { id: 'k_hs1', name: 'Shield of Purity', description: '+15 Magic Defense & +50 HP', icon: '✨', maxRank: 5, branch: 'holy_shield', tier: 3, x: 75, y: 35, effects: [{ type: 'flatStat', stat: 'mdef', value: 15 }, { type: 'flatStat', stat: 'hp', value: 50 }], requires: [{ id: 'k_h2', minRank: 2 }, { id: 'k_j2', minRank: 2 }] },
      { id: 'k_h3', name: 'Holy Ground', description: 'Special: Miracle (Heals 50% HP at low HP)', icon: '👼', maxRank: 1, branch: 'holy_shield', tier: 3, x: 90, y: 40, effects: [{ type: 'special', id: 'miracle', description: 'Heals 50% HP at low HP' }], requires: [{ id: 'k_h2', minRank: 3 }] },
      { id: 'k_h4', name: 'Sanctified Spirit', description: '+1.5% Regen & +100 HP', icon: '✨', maxRank: 3, branch: 'holy_shield', tier: 4, x: 85, y: 55, effects: [{ type: 'regen', value: 0.015 }, { type: 'flatStat', stat: 'hp', value: 100 }, { type: 'special', id: 'mastery_knight_holy', description: "Bastion's Call: Regen +2%" }], requires: [{ id: 'k_h3', minRank: 1 }] },
      { id: 'k_h5', name: 'Aura of Light', description: '+25% Defense & All Healing +50%', icon: '☀️', maxRank: 1, branch: 'holy_shield', tier: 5, x: 80, y: 70, effects: [{ type: 'percentStat', stat: 'def', value: 0.25 }, { type: 'special', id: 'enhanced_healing', description: 'Healing +50%' }], requires: [{ id: 'k_h4', minRank: 2 }] },
      { id: 'k_h6', name: 'Saintly Presence', description: '+30% Magic Defense & +50 HP Regen per rank', icon: '👼', maxRank: 5, branch: 'holy_shield', tier: 6, effects: [{ type: 'percentStat', stat: 'mdef', value: 0.3 }, { type: 'regen', value: 0.05 }], requires: [{ id: 'k_h5', minRank: 1 }] },
      { id: 'k_h7', name: 'Holy Radiance', description: 'Special: Divine Touch (All healing received is tripled)', icon: '✨', maxRank: 1, branch: 'holy_shield', tier: 7, effects: [{ type: 'special', id: 'divine_touch', description: 'Healing received is tripled' }], requires: [{ id: 'k_h6', minRank: 3 }] },
      { id: 'k_sy1', name: 'Crownsworn Pact', description: '+20% Defense, +15% Thorns, +10% Damage Reduction', icon: '👑', maxRank: 1, branch: 'synergy', tier: 1, effects: [{ type: 'percentStat', stat: 'def', value: 0.2 }, { type: 'thorns', value: 0.15 }, { type: 'damageReduction', value: 0.1 }], requires: [{ id: 'k_j5', minRank: 1 }, { id: 'k_r5', minRank: 1 }] },
      { id: 'k_u1', name: 'Dawnwall Ascendant', description: '+35% HP, +20% Defense, +0.5% Regen, +5% Damage Reduction', icon: '🌅', maxRank: 1, branch: 'ultimate', tier: 2, effects: [{ type: 'percentStat', stat: 'hp', value: 0.35 }, { type: 'percentStat', stat: 'def', value: 0.2 }, { type: 'regen', value: 0.005 }, { type: 'damageReduction', value: 0.05 }], requires: [{ id: 'k_sy1', minRank: 1 }, { id: 'k_h5', minRank: 1 }] },


      { id: 'k_mj1', name: 'Adamant Crown', description: 'Mastery. +25% HP, +25% Defense, +12% Damage Reduction.', icon: '👑', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 10, y: 160, effects: [{ type: 'percentStat', stat: 'hp', value: 0.25 }, { type: 'percentStat', stat: 'def', value: 0.25 }, { type: 'damageReduction', value: 0.12 }], requires: [{ id: 'k_j7', minRank: 1 }] },
      { id: 'k_mjr1', name: 'Iron Verdict', description: 'Mastery. +20% Defense, +20% Attack, +20% Thorns.', icon: '⚖️', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 30, y: 145, effects: [{ type: 'percentStat', stat: 'def', value: 0.2 }, { type: 'percentStat', stat: 'atk', value: 0.2 }, { type: 'thorns', value: 0.2 }], requires: [{ id: 'k_j7', minRank: 1 }, { id: 'k_r7', minRank: 1 }] },
      { id: 'k_mr1', name: 'Crown of Thorns', description: 'Mastery. +30% Attack, +30% Thorns, +40% Crit Damage.', icon: '🌵', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 50, y: 160, effects: [{ type: 'percentStat', stat: 'atk', value: 0.3 }, { type: 'thorns', value: 0.3 }, { type: 'critDamage', value: 0.4 }], requires: [{ id: 'k_r7', minRank: 1 }] },
      { id: 'k_mrh1', name: 'Sunwall Edict', description: 'Mastery. +20% Attack, +20% Defense, +2% Regen, +12% Thorns.', icon: '☀️', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 70, y: 145, effects: [{ type: 'percentStat', stat: 'atk', value: 0.2 }, { type: 'percentStat', stat: 'def', value: 0.2 }, { type: 'regen', value: 0.02 }, { type: 'thorns', value: 0.12 }], requires: [{ id: 'k_r7', minRank: 1 }, { id: 'k_h7', minRank: 1 }] },
      { id: 'k_mh1', name: 'Radiant Keep', description: 'Mastery. +25% Defense, +25% Magic Defense, +2% Regen.', icon: '🏰', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 90, y: 160, effects: [{ type: 'percentStat', stat: 'def', value: 0.25 }, { type: 'percentStat', stat: 'mdef', value: 0.25 }, { type: 'regen', value: 0.02 }], requires: [{ id: 'k_h7', minRank: 1 }] },
    ]
  },
  warrior: {
    className: 'warrior',
    title: 'Berserker',
    branches: [
      { id: 'slaughter', name: 'Slaughter', icon: '🪓', description: 'Pure DPS. Focused on raw Attack and massive Crits.' },
      { id: 'bloodthirst', name: 'Bloodthirst', icon: '🩸', description: 'Drain DPS. Focused on Lifesteal and survivability.' },
      { id: 'frenzy', name: 'Frenzy', icon: '🌪️', description: 'Speed DPS. Focused on Speed and Multi-strikes.' },
    ],
    nodes: [
      // Slaughter
      { id: 'w_s1', name: 'Brute Force', description: '+20 Attack per rank', icon: '💪', maxRank: 5, branch: 'slaughter', tier: 1, isShared: true, x: 20, y: 10, effects: [{ type: 'flatStat', stat: 'atk', value: 20 }] },
      { id: 'w_s2', name: 'Executioner', description: '+10% Attack per rank', icon: '💀', maxRank: 5, branch: 'slaughter', tier: 2, x: 15, y: 25, effects: [{ type: 'percentStat', stat: 'atk', value: 0.1 }], requires: [{ id: 'w_s1', minRank: 3 }] },
      { id: 'w_sb1', name: 'Blood Slaughter', description: '+5 Attack & +1% Lifesteal', icon: '🪓', maxRank: 5, branch: 'slaughter', tier: 3, x: 30, y: 35, effects: [{ type: 'flatStat', stat: 'atk', value: 5 }, { type: 'lifesteal', value: 0.01 }], requires: [{ id: 'w_s2', minRank: 2 }, { id: 'w_b1', minRank: 2 }] },
      { id: 'w_s3', name: 'Decimate', description: '+30% Crit Damage per rank', icon: '💥', maxRank: 3, branch: 'slaughter', tier: 3, x: 10, y: 40, effects: [{ type: 'critDamage', value: 0.3 }, { type: 'special', id: 'mastery_warrior_slaughter', description: "Blood Surge: +50% Crit Dmg" }], requires: [{ id: 'w_s2', minRank: 3 }] },
      { id: 'w_s4', name: 'Power Overwhelming', description: '+40 Attack & +15% Crit Chance', icon: '💢', maxRank: 5, branch: 'slaughter', tier: 4, x: 15, y: 55, effects: [{ type: 'flatStat', stat: 'atk', value: 40 }, { type: 'critChance', value: 0.15 }], requires: [{ id: 'w_s3', minRank: 2 }] },
      { id: 'w_s5', name: 'God of War', description: 'Special: Crits deal 3x damage and ignore 50% DEF', icon: '👺', maxRank: 1, branch: 'slaughter', tier: 5, x: 20, y: 70, effects: [{ type: 'special', id: 'power_overwhelming', description: 'Crits deal 3x dmg' }], requires: [{ id: 'w_s4', minRank: 3 }] },

      // Bloodthirst
      { id: 'w_b1', name: 'Leech', description: '+4% Lifesteal per rank', icon: '🩸', maxRank: 5, branch: 'bloodthirst', tier: 1, isShared: true, x: 50, y: 10, effects: [{ type: 'lifesteal', value: 0.04 }] },
      { id: 'w_b2', name: 'Vampirism', description: '+100 Max HP per rank', icon: '🦇', maxRank: 5, branch: 'bloodthirst', tier: 2, x: 50, y: 25, effects: [{ type: 'flatStat', stat: 'hp', value: 100 }], requires: [{ id: 'w_b1', minRank: 3 }] },
      { id: 'w_bf1', name: 'Frenzied Thirst', description: '+2% Lifesteal & +5 Speed', icon: '🩸', maxRank: 5, branch: 'bloodthirst', tier: 3, x: 65, y: 35, effects: [{ type: 'lifesteal', value: 0.02 }, { type: 'flatStat', stat: 'spd', value: 5 }], requires: [{ id: 'w_b2', minRank: 2 }, { id: 'w_f2', minRank: 2 }] },
      { id: 'w_b3', name: 'Undying Rage', description: 'Special: Undying Rage (Refuse to die once per battle)', icon: '💢', maxRank: 1, branch: 'bloodthirst', tier: 3, x: 45, y: 40, effects: [{ type: 'special', id: 'undying_rage', description: 'Refuse to die once per battle' }], requires: [{ id: 'w_b2', minRank: 3 }] },
      { id: 'w_b4', name: 'Blood Shield', description: 'Healing exceeds max HP becomes shield (DR 10%)', icon: '🛡️', maxRank: 5, branch: 'bloodthirst', tier: 4, x: 50, y: 55, effects: [{ type: 'damageReduction', value: 0.05 }, { type: 'lifesteal', value: 0.05 }, { type: 'special', id: 'mastery_warrior_bloodthirst', description: "Blood Surge: +20% Lifesteal" }], requires: [{ id: 'w_b3', minRank: 1 }] },
      { id: 'w_b5', name: 'Death\'s Embrace', description: 'Lifesteal increased by 50% when below 30% HP', icon: '💀', maxRank: 1, branch: 'bloodthirst', tier: 5, x: 55, y: 70, effects: [{ type: 'special', id: 'blood_frenzy', description: 'Life steal +50% at low HP' }], requires: [{ id: 'w_b4', minRank: 3 }] },

      // Frenzy
      { id: 'w_f1', name: 'Adrenaline', description: '+5 Speed per rank', icon: '⚡', maxRank: 5, branch: 'frenzy', tier: 1, isShared: true, x: 80, y: 10, effects: [{ type: 'flatStat', stat: 'spd', value: 5 }] },
      { id: 'w_f2', name: 'Rapid Strikes', description: '+10% Multi-strike per rank', icon: '⚔️', maxRank: 5, branch: 'frenzy', tier: 2, x: 85, y: 25, effects: [{ type: 'multiStrike', value: 0.1 }], requires: [{ id: 'w_f1', minRank: 3 }] },
      { id: 'w_fs1', name: 'Slaughter Haste', description: '+10 Attack & +10 Speed', icon: '🌪️', maxRank: 5, branch: 'frenzy', tier: 3, x: 75, y: 35, effects: [{ type: 'flatStat', stat: 'atk', value: 10 }, { type: 'flatStat', stat: 'spd', value: 10 }], requires: [{ id: 'w_f2', minRank: 2 }, { id: 'w_s2', minRank: 2 }] },
      { id: 'w_f3', name: 'Rampage', description: 'Special: Rampage (ATK increases per kill)', icon: '👹', maxRank: 1, branch: 'frenzy', tier: 3, x: 90, y: 40, effects: [{ type: 'special', id: 'rampage', description: 'ATK increases per kill' }], requires: [{ id: 'w_f2', minRank: 3 }] },
      { id: 'w_f4', name: 'Haste', description: '+20 Speed & +10% Multi-strike', icon: '🌬️', maxRank: 5, branch: 'frenzy', tier: 4, x: 85, y: 55, effects: [{ type: 'flatStat', stat: 'spd', value: 20 }, { type: 'multiStrike', value: 0.1 }, { type: 'special', id: 'mastery_warrior_frenzy', description: "Blood Surge: +30 Speed" }], requires: [{ id: 'w_f3', minRank: 1 }] },
      { id: 'w_f5', name: 'Bladestorm', description: 'Special: Guaranteed 2 hits every turn', icon: '🌪️', maxRank: 1, branch: 'frenzy', tier: 5, x: 80, y: 70, effects: [{ type: 'multiStrike', value: 1.0 }], requires: [{ id: 'w_f4', minRank: 3 }] },

      // Deep nodes
      { id: 'w_s6', name: 'Titan\'s Grip', description: '+100 Attack & +15% Crit Chance per rank', icon: '✊', maxRank: 5, branch: 'slaughter', tier: 6, x: 15, y: 85, effects: [{ type: 'flatStat', stat: 'atk', value: 100 }, { type: 'critChance', value: 0.15 }], requires: [{ id: 'w_s5', minRank: 1 }] },
      { id: 'w_s7', name: 'World Ender', description: 'Special: World Ender (All attacks are guaranteed Crits and deal 5x damage)', icon: '🌋', maxRank: 1, branch: 'slaughter', tier: 7, x: 10, y: 100, effects: [{ type: 'special', id: 'world_ender', description: 'All attacks 5x Crits' }], requires: [{ id: 'w_s6', minRank: 3 }] },
      { id: 'w_b6', name: 'Sanguine Blade', description: '+15% Lifesteal & +500 HP per rank', icon: '🗡️', maxRank: 5, branch: 'bloodthirst', tier: 6, x: 50, y: 85, effects: [{ type: 'lifesteal', value: 0.15 }, { type: 'flatStat', stat: 'hp', value: 500 }], requires: [{ id: 'w_b5', minRank: 1 }] },
      { id: 'w_b7', name: 'Vampire Lord', description: 'Special: Soul Eater (Heal for 100% of damage dealt, even if overkill)', icon: '🧛', maxRank: 1, branch: 'bloodthirst', tier: 7, x: 55, y: 100, effects: [{ type: 'special', id: 'soul_eater', description: 'Heal 100% of dmg dealt' }], requires: [{ id: 'w_b6', minRank: 3 }] },
      { id: 'w_f6', name: 'Hyper-Speed', description: '+60 Speed & +25% Multi-strike per rank', icon: '🚀', maxRank: 5, branch: 'frenzy', tier: 6, x: 85, y: 85, effects: [{ type: 'flatStat', stat: 'spd', value: 60 }, { type: 'multiStrike', value: 0.25 }], requires: [{ id: 'w_f5', minRank: 1 }] },
      { id: 'w_f7', name: 'Killing Machine', description: 'Special: Blood Rush (Instantly gain an extra turn after every kill)', icon: '☠️', maxRank: 1, branch: 'frenzy', tier: 7, x: 90, y: 100, effects: [{ type: 'special', id: 'blood_rush', description: 'Extra turn after every kill' }], requires: [{ id: 'w_f6', minRank: 3 }] },
      { id: 'w_sy1', name: 'Butcher\'s Rhythm', description: '+20% Attack, +10% Lifesteal, +25% Crit Damage', icon: '🎼', maxRank: 1, branch: 'synergy', tier: 1, x: 35, y: 115, effects: [{ type: 'percentStat', stat: 'atk', value: 0.2 }, { type: 'lifesteal', value: 0.1 }, { type: 'critDamage', value: 0.25 }], requires: [{ id: 'w_s5', minRank: 1 }, { id: 'w_b5', minRank: 1 }] },
      { id: 'w_u1', name: 'Warpath Tyrant', description: '+35% Attack, +15% Crit Chance, +25% Multi-strike', icon: '🐺', maxRank: 1, branch: 'ultimate', tier: 2, x: 50, y: 130, effects: [{ type: 'percentStat', stat: 'atk', value: 0.35 }, { type: 'critChance', value: 0.15 }, { type: 'multiStrike', value: 0.25 }], requires: [{ id: 'w_sy1', minRank: 1 }, { id: 'w_f5', minRank: 1 }] },
      { id: 'w_ms1', name: 'Ravager Apex', description: 'Mastery. +35% Attack, +20% Crit Chance, +50% Crit Damage.', icon: '🩸', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 10, y: 160, effects: [{ type: 'percentStat', stat: 'atk', value: 0.35 }, { type: 'critChance', value: 0.2 }, { type: 'critDamage', value: 0.5 }], requires: [{ id: 'w_s7', minRank: 1 }] },
      { id: 'w_msb1', name: 'Red Dominion', description: 'Mastery. +25% Attack, +15% Lifesteal, +30% Crit Damage.', icon: '🩸', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 30, y: 145, effects: [{ type: 'percentStat', stat: 'atk', value: 0.25 }, { type: 'lifesteal', value: 0.15 }, { type: 'critDamage', value: 0.3 }], requires: [{ id: 'w_s7', minRank: 1 }, { id: 'w_b7', minRank: 1 }] },
      { id: 'w_mb1', name: 'Blood King', description: 'Mastery. +25% HP, +25% Lifesteal, +15% Damage Reduction.', icon: '🧛', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 50, y: 160, effects: [{ type: 'percentStat', stat: 'hp', value: 0.25 }, { type: 'lifesteal', value: 0.25 }, { type: 'damageReduction', value: 0.15 }], requires: [{ id: 'w_b7', minRank: 1 }] },
      { id: 'w_mbf1', name: 'Crimson Velocity', description: 'Mastery. +18% Lifesteal, +30% Multi-strike, +60 Speed.', icon: '🌪️', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 70, y: 145, effects: [{ type: 'lifesteal', value: 0.18 }, { type: 'multiStrike', value: 0.3 }, { type: 'flatStat', stat: 'spd', value: 60 }], requires: [{ id: 'w_b7', minRank: 1 }, { id: 'w_f7', minRank: 1 }] },
      { id: 'w_mf1', name: 'Storm Tyrant', description: 'Mastery. +90 Speed, +35% Multi-strike, +12% Crit Chance.', icon: '⚡', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 90, y: 160, effects: [{ type: 'flatStat', stat: 'spd', value: 90 }, { type: 'multiStrike', value: 0.35 }, { type: 'critChance', value: 0.12 }], requires: [{ id: 'w_f7', minRank: 1 }] },
    ]
  },
  archer: {
    className: 'archer',
    title: 'Ranger',
    branches: [
      { id: 'sharpshooter', name: 'Sharpshooter', icon: '🎯', description: 'Crit Sniper. High single target damage.' },
      { id: 'skirmisher', name: 'Skirmisher', icon: '🏹', description: 'Evasive Ranger. Focused on Speed and Evasion.' },
      { id: 'volley', name: 'Volley', icon: '🌪️', description: 'AOE/DoT Expert. Focused on Multi-strikes and Poison.' },
    ],
    nodes: [
      // Sharpshooter
      { id: 'a_s1', name: 'Eagle Eye', description: '+5% Crit Chance per rank', icon: '👁️', maxRank: 5, branch: 'sharpshooter', tier: 1, isShared: true, x: 20, y: 10, effects: [{ type: 'critChance', value: 0.05 }] },
      { id: 'a_s2', name: 'Deadly Aim', description: '+25% Crit Damage per rank', icon: '💥', maxRank: 5, branch: 'sharpshooter', tier: 2, x: 15, y: 25, effects: [{ type: 'critDamage', value: 0.25 }], requires: [{ id: 'a_s1', minRank: 3 }] },
      { id: 'a_sk1', name: 'Sharpshoot Footwork', description: '+5% Crit Chance & +5 Speed', icon: '🏹', maxRank: 5, branch: 'sharpshooter', tier: 3, x: 30, y: 35, effects: [{ type: 'critChance', value: 0.05 }, { type: 'flatStat', stat: 'spd', value: 5 }], requires: [{ id: 'a_s2', minRank: 2 }, { id: 'a_k2', minRank: 2 }] },
      { id: 'a_s3', name: 'Kill Shot', description: 'Special: Kill Shot (Double crit damage to low HP)', icon: '💀', maxRank: 1, branch: 'sharpshooter', tier: 3, x: 10, y: 40, effects: [{ type: 'special', id: 'kill_shot', description: 'Double crit damage to low HP' }, { type: 'special', id: 'mastery_archer_marksmanship', description: "Hunter's Mark: +30% Dmg" }], requires: [{ id: 'a_s2', minRank: 3 }] },
      { id: 'a_s4', name: 'Steady Aim', description: '+20% Crit Chance & +50 Attack', icon: '🔭', maxRank: 5, branch: 'sharpshooter', tier: 4, x: 15, y: 55, effects: [{ type: 'critChance', value: 0.2 }, { type: 'flatStat', stat: 'atk', value: 50 }], requires: [{ id: 'a_s3', minRank: 1 }] },
      { id: 'a_s5', name: 'Sniper', description: 'Special: Crits ignore 100% of Enemy Defense', icon: '🏹', maxRank: 1, branch: 'sharpshooter', tier: 5, x: 20, y: 70, effects: [{ type: 'special', id: 'lethality', description: 'Crits ignore DEF' }], requires: [{ id: 'a_s4', minRank: 3 }] },

      // Skirmisher
      { id: 'a_k1', name: 'Fleet Foot', description: '+8 Speed per rank', icon: '👟', maxRank: 5, branch: 'skirmisher', tier: 1, isShared: true, x: 50, y: 10, effects: [{ type: 'flatStat', stat: 'spd', value: 8 }] },
      { id: 'a_k2', name: 'Evasive Maneuvers', description: '+6% Evasion per rank', icon: '💨', maxRank: 5, branch: 'skirmisher', tier: 2, x: 50, y: 25, effects: [{ type: 'evasion', value: 0.06 }], requires: [{ id: 'a_k1', minRank: 3 }] },
      { id: 'a_kv1', name: 'Toxic Skirmish', description: '+3% Evasion & +2% DoT', icon: '🧪', maxRank: 5, branch: 'skirmisher', tier: 3, x: 65, y: 35, effects: [{ type: 'evasion', value: 0.03 }, { type: 'dot', value: 0.02 }], requires: [{ id: 'a_k2', minRank: 2 }, { id: 'a_v2', minRank: 2 }] },
      { id: 'a_k3', name: 'Shadow Dance', description: '+15% Evasion & +20 Speed', icon: '🌑', maxRank: 1, branch: 'skirmisher', tier: 3, x: 45, y: 40, effects: [{ type: 'evasion', value: 0.15 }, { type: 'flatStat', stat: 'spd', value: 20 }, { type: 'special', id: 'mastery_archer_trapper', description: "Hunter's Mark: 15t Delay" }], requires: [{ id: 'a_k2', minRank: 3 }] },
      { id: 'a_k4', name: 'Wind Runner', description: '+30 Speed & +10% Attack', icon: '🌬️', maxRank: 5, branch: 'skirmisher', tier: 4, x: 50, y: 55, effects: [{ type: 'flatStat', stat: 'spd', value: 30 }, { type: 'percentStat', stat: 'atk', value: 0.1 }], requires: [{ id: 'a_k3', minRank: 1 }] },
      { id: 'a_k5', name: 'Ghost Form', description: 'Special: 50% chance to dodge any attack', icon: '👻', maxRank: 1, branch: 'skirmisher', tier: 5, x: 55, y: 70, effects: [{ type: 'evasion', value: 0.5 }], requires: [{ id: 'a_k4', minRank: 3 }] },

      // Volley
      { id: 'a_v1', name: 'Poison Tips', description: '+5% DoT per rank', icon: '🧪', maxRank: 5, branch: 'volley', tier: 1, isShared: true, x: 80, y: 10, effects: [{ type: 'dot', value: 0.05 }] },
      { id: 'a_v2', name: 'Barrage', description: '+12% Multi-strike per rank', icon: '🏹', maxRank: 5, branch: 'volley', tier: 2, x: 85, y: 25, effects: [{ type: 'multiStrike', value: 0.12 }], requires: [{ id: 'a_v1', minRank: 3 }] },
      { id: 'a_vs1', name: 'Deadly Volley', description: '+5% Multi-strike & +10% Crit Damage', icon: '💥', maxRank: 5, branch: 'volley', tier: 3, x: 75, y: 35, effects: [{ type: 'multiStrike', value: 0.05 }, { type: 'critDamage', value: 0.1 }], requires: [{ id: 'a_v2', minRank: 2 }, { id: 'a_s2', minRank: 2 }] },
      { id: 'a_v3', name: 'Storm of Arrows', description: 'Special: Storm of Arrows (Chance to hit 3 times)', icon: '🌪️', maxRank: 1, branch: 'volley', tier: 3, x: 90, y: 40, effects: [{ type: 'special', id: 'storm_of_arrows', description: 'Chance to hit 3 times' }, { type: 'special', id: 'mastery_archer_rapidfire', description: "Hunter's Mark: -5t Cooldowns" }], requires: [{ id: 'a_v2', minRank: 3 }] },
      { id: 'a_v4', name: 'Rapid Fire', description: '+20% Multi-strike & +10 Speed', icon: '💨', maxRank: 5, branch: 'volley', tier: 4, x: 85, y: 55, effects: [{ type: 'multiStrike', value: 0.2 }, { type: 'flatStat', stat: 'spd', value: 10 }], requires: [{ id: 'a_v3', minRank: 1 }] },
      { id: 'a_v5', name: 'Toxic Snipe', description: 'Special: Poison deals 3x damage on Crits', icon: '☣️', maxRank: 1, branch: 'volley', tier: 5, x: 80, y: 70, effects: [{ type: 'special', id: 'toxic_snipe', description: 'Poison 3x on crit' }], requires: [{ id: 'a_v4', minRank: 3 }] },

      // Deep nodes
      { id: 'a_s6', name: 'Trueshot', description: '+100 Attack & +20% Crit Chance per rank', icon: '🎯', maxRank: 5, branch: 'sharpshooter', tier: 6, x: 15, y: 85, effects: [{ type: 'flatStat', stat: 'atk', value: 100 }, { type: 'critChance', value: 0.2 }], requires: [{ id: 'a_s5', minRank: 1 }] },
      { id: 'a_s7', name: 'God Slayer', description: 'Special: Executioner (Attacks always hit and deal bonus damage equal to 5% enemy Max HP)', icon: '🏹', maxRank: 1, branch: 'sharpshooter', tier: 7, x: 10, y: 100, effects: [{ type: 'special', id: 'execute', description: 'Always hit & 5% Max HP dmg' }], requires: [{ id: 'a_s6', minRank: 3 }] },
      { id: 'a_k6', name: 'Ethereal Form', description: '+25% Evasion & +50 Speed per rank', icon: '🌫️', maxRank: 5, branch: 'skirmisher', tier: 6, x: 50, y: 85, effects: [{ type: 'evasion', value: 0.25 }, { type: 'flatStat', stat: 'spd', value: 50 }], requires: [{ id: 'a_k5', minRank: 1 }] },
      { id: 'a_k7', name: 'Untouchable', description: 'Special: Wind Walk (Evasion is capped at 75% and Speed is doubled)', icon: '👣', maxRank: 1, branch: 'skirmisher', tier: 7, x: 55, y: 100, effects: [{ type: 'special', id: 'wind_walk', description: '75% Evasion & 2x Spd' }], requires: [{ id: 'a_k6', minRank: 3 }] },
      { id: 'a_v6', name: 'Rain of Death', description: '+30% Multi-strike & +15% DoT per rank', icon: '⛈️', maxRank: 5, branch: 'volley', tier: 6, x: 85, y: 85, effects: [{ type: 'multiStrike', value: 0.3 }, { type: 'dot', value: 0.15 }], requires: [{ id: 'a_v5', minRank: 1 }] },
      { id: 'a_v7', name: 'Arrow Hell', description: 'Special: Arrow Hell (Every attack fires 3 arrows instead of 1)', icon: '🎆', maxRank: 1, branch: 'volley', tier: 7, x: 90, y: 100, effects: [{ type: 'special', id: 'arrow_hell', description: 'Every attack fires 3 arrows' }], requires: [{ id: 'a_v6', minRank: 3 }] },

      { id: 'a_sy1', name: 'Predator\'s Instinct', description: '+15% Attack, +12% Evasion, +8% Crit Chance', icon: '🐺', maxRank: 1, branch: 'synergy', tier: 1, x: 35, y: 115, effects: [{ type: 'percentStat', stat: 'atk', value: 0.15 }, { type: 'evasion', value: 0.12 }, { type: 'critChance', value: 0.08 }], requires: [{ id: 'a_s5', minRank: 1 }, { id: 'a_k5', minRank: 1 }] },
      { id: 'a_u1', name: 'Tempest Huntmaster', description: '+25% Multi-strike, +10% DoT, +40% Crit Damage', icon: '⛈️', maxRank: 1, branch: 'ultimate', tier: 2, x: 50, y: 130, effects: [{ type: 'multiStrike', value: 0.25 }, { type: 'dot', value: 0.1 }, { type: 'critDamage', value: 0.4 }], requires: [{ id: 'a_sy1', minRank: 1 }, { id: 'a_v5', minRank: 1 }] },
      { id: 'a_ms1', name: 'Perfect Shot', description: 'Mastery. +35% Attack, +20% Crit Chance, +50% Crit Damage.', icon: '🎯', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 10, y: 160, effects: [{ type: 'percentStat', stat: 'atk', value: 0.35 }, { type: 'critChance', value: 0.2 }, { type: 'critDamage', value: 0.5 }], requires: [{ id: 'a_s7', minRank: 1 }] },
      { id: 'a_msk1', name: 'Ghost Predator', description: 'Mastery. +20% Attack, +15% Evasion, +40 Speed, +30% Crit Damage.', icon: '🐺', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 30, y: 145, effects: [{ type: 'percentStat', stat: 'atk', value: 0.2 }, { type: 'evasion', value: 0.15 }, { type: 'flatStat', stat: 'spd', value: 40 }, { type: 'critDamage', value: 0.3 }], requires: [{ id: 'a_s7', minRank: 1 }, { id: 'a_k7', minRank: 1 }] },
      { id: 'a_mk1', name: 'Wind Sovereign', description: 'Mastery. +110 Speed, +20% Evasion, +15% Crit Chance.', icon: '👣', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 50, y: 160, effects: [{ type: 'flatStat', stat: 'spd', value: 110 }, { type: 'evasion', value: 0.2 }, { type: 'critChance', value: 0.15 }], requires: [{ id: 'a_k7', minRank: 1 }] },
      { id: 'a_mkv1', name: 'Stormstalker', description: 'Mastery. +60 Speed, +15% Evasion, +30% Multi-strike, +20% DoT.', icon: '🌪️', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 70, y: 145, effects: [{ type: 'flatStat', stat: 'spd', value: 60 }, { type: 'evasion', value: 0.15 }, { type: 'multiStrike', value: 0.3 }, { type: 'dot', value: 0.2 }], requires: [{ id: 'a_k7', minRank: 1 }, { id: 'a_v7', minRank: 1 }] },
      { id: 'a_mv1', name: 'Endless Quiver', description: 'Mastery. +80 Attack, +40% Multi-strike, +25% DoT.', icon: '🎆', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 90, y: 160, effects: [{ type: 'flatStat', stat: 'atk', value: 80 }, { type: 'multiStrike', value: 0.4 }, { type: 'dot', value: 0.25 }], requires: [{ id: 'a_v7', minRank: 1 }] },
    ]
  },
  mage: {
    className: 'mage',
    title: 'Archmage',
    branches: [
      { id: 'destruction', name: 'Destruction', icon: '🔥', description: 'Burst Mage. Focused on massive damage and crit spells.' },
      { id: 'arcane', name: 'Arcane', icon: '🔮', description: 'AOE Mage. Hits multiple enemies and provides utility.' },
      { id: 'sorcery', name: 'Sorcery', icon: '⚡', description: 'Speed Mage. Focused on fast casting and extra turns.' },
    ],
    nodes: [
      // Destruction
      { id: 'm_d1', name: 'Fireball', description: '+30 Magic Attack per rank', icon: '🔥', maxRank: 5, branch: 'destruction', tier: 1, isShared: true, x: 20, y: 10, effects: [{ type: 'flatStat', stat: 'matk', value: 30 }] },
      { id: 'm_d2', name: 'Pyromaniac', description: '+15% Magic Attack per rank', icon: '☄️', maxRank: 5, branch: 'destruction', tier: 2, x: 15, y: 25, effects: [{ type: 'percentStat', stat: 'matk', value: 0.15 }], requires: [{ id: 'm_d1', minRank: 3 }] },
      { id: 'm_da1', name: 'Arcane Fire', description: '+10 Magic Attack & +10 Defense', icon: '🔥', maxRank: 5, branch: 'destruction', tier: 3, x: 30, y: 35, effects: [{ type: 'flatStat', stat: 'matk', value: 10 }, { type: 'flatStat', stat: 'def', value: 10 }], requires: [{ id: 'm_d2', minRank: 2 }, { id: 'm_a2', minRank: 2 }] },
      { id: 'm_d3', name: 'Meteor Fall', description: '+50% Crit Damage', icon: '🌠', maxRank: 1, branch: 'destruction', tier: 3, x: 10, y: 40, effects: [{ type: 'critDamage', value: 0.5 }, { type: 'special', id: 'mastery_mage_pure', description: 'Elemental Overload: x2 Multiplier' }], requires: [{ id: 'm_d2', minRank: 3 }] },
      { id: 'm_d4', name: 'Shatter', description: '+20% Crit Chance & +10% Magic Attack', icon: '❄️', maxRank: 5, branch: 'destruction', tier: 4, x: 15, y: 55, effects: [{ type: 'critChance', value: 0.2 }, { type: 'percentStat', stat: 'matk', value: 0.1 }], requires: [{ id: 'm_d3', minRank: 1 }] },
      { id: 'm_d5', name: 'Big Bang', description: 'Special: Crits deal 5x damage but reduce Speed by 50%', icon: '💥', maxRank: 1, branch: 'destruction', tier: 5, x: 20, y: 70, effects: [{ type: 'special', id: 'chaos_strike', description: 'Crits deal 5x dmg' }], requires: [{ id: 'm_d4', minRank: 3 }] },

      // Arcane
      { id: 'm_a1', name: 'Mana Flow', description: '+5 Speed per rank', icon: '💧', maxRank: 5, branch: 'arcane', tier: 1, isShared: true, x: 50, y: 10, effects: [{ type: 'flatStat', stat: 'spd', value: 5 }] },
      { id: 'm_a2', name: 'Arcane Shield', description: '+15 Defense per rank', icon: '🛡️', maxRank: 5, branch: 'arcane', tier: 2, x: 50, y: 25, effects: [{ type: 'flatStat', stat: 'def', value: 15 }], requires: [{ id: 'm_a1', minRank: 3 }] },
      { id: 'm_as1', name: 'Chrono Arcane', description: '+5 Speed & +5 Defense', icon: '🔮', maxRank: 5, branch: 'arcane', tier: 3, x: 65, y: 35, effects: [{ type: 'flatStat', stat: 'spd', value: 5 }, { type: 'flatStat', stat: 'def', value: 5 }], requires: [{ id: 'm_a2', minRank: 2 }, { id: 'm_s2', minRank: 2 }] },
      { id: 'm_a3', name: 'Arcane Storm', description: 'Special: Arcane Storm (Chance to hit all enemies)', icon: '🌪️', maxRank: 1, branch: 'arcane', tier: 3, x: 45, y: 40, effects: [{ type: 'special', id: 'arcane_storm', description: 'Chance to hit all enemies' }, { type: 'special', id: 'mastery_mage_time', description: 'Elemental Overload: Reset Spells' }], requires: [{ id: 'm_a2', minRank: 3 }] },
      { id: 'm_a4', name: 'Mana Well', description: '+100 Max HP & +20 Defense', icon: '💎', maxRank: 5, branch: 'arcane', tier: 4, x: 50, y: 55, effects: [{ type: 'flatStat', stat: 'hp', value: 100 }, { type: 'flatStat', stat: 'def', value: 20 }], requires: [{ id: 'm_a3', minRank: 1 }] },
      { id: 'm_a5', name: 'Arcane Brilliance', description: '+25% Magic Attack, Defense, HP, and Speed', icon: '✨', maxRank: 1, branch: 'arcane', tier: 5, x: 55, y: 70, effects: [{ type: 'percentStat', stat: 'matk', value: 0.25 }, { type: 'percentStat', stat: 'def', value: 0.25 }, { type: 'percentStat', stat: 'hp', value: 0.25 }, { type: 'percentStat', stat: 'spd', value: 0.25 }], requires: [{ id: 'm_a4', minRank: 3 }] },

      // Sorcery
      { id: 'm_s1', name: 'Quick Cast', description: '+10 Speed per rank', icon: '⚡', maxRank: 5, branch: 'sorcery', tier: 1, isShared: true, x: 80, y: 10, effects: [{ type: 'flatStat', stat: 'spd', value: 10 }] },
      { id: 'm_s2', name: 'Rejuvenation', description: '+0.5% Regen per rank', icon: '🌿', maxRank: 5, branch: 'sorcery', tier: 2, x: 85, y: 25, effects: [{ type: 'regen', value: 0.005 }], requires: [{ id: 'm_s1', minRank: 3 }] },
      { id: 'm_sd1', name: 'Quick Fire', description: '+5 Speed & +10 Magic Attack', icon: '⚡', maxRank: 5, branch: 'sorcery', tier: 3, x: 75, y: 35, effects: [{ type: 'flatStat', stat: 'spd', value: 5 }, { type: 'flatStat', stat: 'matk', value: 10 }], requires: [{ id: 'm_s2', minRank: 2 }, { id: 'm_d2', minRank: 2 }] },
      { id: 'm_s3', name: 'Infinite Loop', description: 'Special: Infinite Loop (Chance to take an extra turn)', icon: '🔄', maxRank: 1, branch: 'sorcery', tier: 3, x: 90, y: 40, effects: [{ type: 'special', id: 'infinite_loop', description: 'Chance to take an extra turn' }, { type: 'special', id: 'mastery_mage_shadow', description: 'Elemental Overload: Apply Heavy DoT' }], requires: [{ id: 'm_s2', minRank: 3 }] },
      { id: 'm_s4', name: 'Time Warp', description: '+30 Speed & +10% Multi-strike', icon: '⏳', maxRank: 5, branch: 'sorcery', tier: 4, x: 85, y: 55, effects: [{ type: 'flatStat', stat: 'spd', value: 30 }, { type: 'multiStrike', value: 0.1 }], requires: [{ id: 'm_s3', minRank: 1 }] },
      { id: 'm_s5', name: 'Singularity', description: 'Special: Guaranteed 2 hits every turn & +50 Speed', icon: '🕳️', maxRank: 1, branch: 'sorcery', tier: 5, x: 80, y: 70, effects: [{ type: 'multiStrike', value: 1.0 }, { type: 'flatStat', stat: 'spd', value: 50 }], requires: [{ id: 'm_s4', minRank: 3 }] },

      // Deep nodes
      { id: 'm_d6', name: 'Mana Flare', description: '+200 Magic Attack & +15% Crit Chance per rank', icon: '🔥', maxRank: 5, branch: 'destruction', tier: 6, x: 15, y: 85, effects: [{ type: 'flatStat', stat: 'matk', value: 200 }, { type: 'critChance', value: 0.15 }], requires: [{ id: 'm_d5', minRank: 1 }] },
      { id: 'm_d7', name: 'Armageddon', description: 'Special: Big Bang (Crits deal 10x damage)', icon: '☄️', maxRank: 1, branch: 'destruction', tier: 7, x: 10, y: 100, effects: [{ type: 'special', id: 'armageddon', description: 'Crits deal 10x dmg' }], requires: [{ id: 'm_d6', minRank: 3 }] },
      { id: 'm_a6', name: 'Spell Mastery', description: '+150 Defense & +150 Magic Defense & +100 Magic Attack per rank', icon: '🧙', maxRank: 5, branch: 'arcane', tier: 6, x: 50, y: 85, effects: [{ type: 'flatStat', stat: 'def', value: 150 }, { type: 'flatStat', stat: 'mdef', value: 150 }, { type: 'flatStat', stat: 'matk', value: 100 }], requires: [{ id: 'm_a5', minRank: 1 }] },
      { id: 'm_a7', name: 'Arcane Singularity', description: 'Special: Arcane Storm (All spells hit all enemies for 200% damage)', icon: '🌀', maxRank: 1, branch: 'arcane', tier: 7, x: 55, y: 100, effects: [{ type: 'special', id: 'arcane_singularity', description: 'All spells hit all enemies 200%' }], requires: [{ id: 'm_a6', minRank: 3 }] },
      { id: 'm_s6', name: 'Chrono-Shift', description: '+80 Speed & +20% Multi-strike per rank', icon: '⌛', maxRank: 5, branch: 'sorcery', tier: 6, x: 85, y: 85, effects: [{ type: 'flatStat', stat: 'spd', value: 80 }, { type: 'multiStrike', value: 0.2 }], requires: [{ id: 'm_s5', minRank: 1 }] },
      { id: 'm_s7', name: 'Time Lord', description: 'Special: Infinite Loop (Gain 1 extra turn every 10 combat ticks)', icon: '🧙', maxRank: 1, branch: 'sorcery', tier: 7, x: 90, y: 100, effects: [{ type: 'special', id: 'time_lord', description: '1 extra turn every 10 ticks' }], requires: [{ id: 'm_s6', minRank: 3 }] },
      { id: 'm_sy1', name: 'Spellstorm Nexus', description: '+20% Magic Attack, +10% Crit Chance, +10% Multi-strike', icon: '🌩️', maxRank: 1, branch: 'synergy', tier: 1, x: 35, y: 115, effects: [{ type: 'percentStat', stat: 'matk', value: 0.2 }, { type: 'critChance', value: 0.1 }, { type: 'multiStrike', value: 0.1 }], requires: [{ id: 'm_d5', minRank: 1 }, { id: 'm_a5', minRank: 1 }] },
      { id: 'm_u1', name: 'Astral Overmind', description: '+40% Magic Attack, +50% Crit Damage, +40 Speed, +20% Multi-strike', icon: '🌌', maxRank: 1, branch: 'ultimate', tier: 2, x: 50, y: 130, effects: [{ type: 'percentStat', stat: 'matk', value: 0.4 }, { type: 'critDamage', value: 0.5 }, { type: 'flatStat', stat: 'spd', value: 40 }, { type: 'multiStrike', value: 0.2 }], requires: [{ id: 'm_sy1', minRank: 1 }, { id: 'm_s5', minRank: 1 }] },
      { id: 'm_md1', name: 'Cataclysm Core', description: 'Mastery. +40% Magic Attack, +20% Crit Chance, +60% Crit Damage.', icon: '💥', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 10, y: 160, effects: [{ type: 'percentStat', stat: 'matk', value: 0.4 }, { type: 'critChance', value: 0.2 }, { type: 'critDamage', value: 0.6 }], requires: [{ id: 'm_d7', minRank: 1 }] },
      { id: 'm_mda1', name: 'Spellquake Throne', description: 'Mastery. +35% Magic Attack, +30% Crit Damage, +120 Defense, +120 Magic Defense.', icon: '🌋', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 30, y: 145, effects: [{ type: 'percentStat', stat: 'matk', value: 0.35 }, { type: 'critDamage', value: 0.3 }, { type: 'flatStat', stat: 'def', value: 120 }, { type: 'flatStat', stat: 'mdef', value: 120 }], requires: [{ id: 'm_d7', minRank: 1 }, { id: 'm_a7', minRank: 1 }] },
      { id: 'm_ma1', name: 'Void Bastion', description: 'Mastery. +25% Magic Attack, +220 Defense, +220 Magic Defense, +220 HP.', icon: '🌀', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 50, y: 160, effects: [{ type: 'percentStat', stat: 'matk', value: 0.25 }, { type: 'flatStat', stat: 'def', value: 220 }, { type: 'flatStat', stat: 'mdef', value: 220 }, { type: 'flatStat', stat: 'hp', value: 220 }], requires: [{ id: 'm_a7', minRank: 1 }] },
      { id: 'm_mas1', name: 'Chrono Tempest', description: 'Mastery. +30% Magic Attack, +90 Speed, +30% Multi-strike, +120 HP.', icon: '⏳', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 70, y: 145, effects: [{ type: 'percentStat', stat: 'matk', value: 0.3 }, { type: 'flatStat', stat: 'spd', value: 90 }, { type: 'multiStrike', value: 0.3 }, { type: 'flatStat', stat: 'hp', value: 120 }], requires: [{ id: 'm_a7', minRank: 1 }, { id: 'm_s7', minRank: 1 }] },
      { id: 'm_ms1', name: 'Epoch Crown', description: 'Mastery. +130 Speed, +35% Multi-strike, +12% Crit Chance.', icon: '⌛', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 90, y: 160, effects: [{ type: 'flatStat', stat: 'spd', value: 130 }, { type: 'multiStrike', value: 0.35 }, { type: 'critChance', value: 0.12 }], requires: [{ id: 'm_s7', minRank: 1 }] },
    ]
  },
  healer: {
    className: 'healer',
    title: 'Cleric',
    branches: [
      { id: 'sanctity', name: 'Sanctity', icon: '🕊️', description: 'Pure Sustain. Focused on massive HP pools and regeneration.' },
      { id: 'protection', name: 'Protection', icon: '🛡️', description: 'Tanky Healer. Focused on Defense and damage mitigation.' },
      { id: 'divinity', name: 'Divinity', icon: '☀️', description: 'Hybrid Offense. Turns holy power into Attack and Crits.' },
    ],
    nodes: [
      // Sanctity
      { id: 'h_s1', name: 'Holy Water', description: '+60 HP per rank', icon: '💧', maxRank: 5, branch: 'sanctity', tier: 1, isShared: true, x: 20, y: 10, effects: [{ type: 'flatStat', stat: 'hp', value: 60 }] },
      { id: 'h_s2', name: 'Blessed Spirit', description: '+0.5% Regen per rank', icon: '✨', maxRank: 5, branch: 'sanctity', tier: 2, x: 15, y: 25, effects: [{ type: 'regen', value: 0.005 }], requires: [{ id: 'h_s1', minRank: 3 }] },
      { id: 'h_sp1', name: 'Sanctified Aura', description: '+50 HP & +5 Defense', icon: '🕊️', maxRank: 5, branch: 'sanctity', tier: 3, x: 30, y: 35, effects: [{ type: 'flatStat', stat: 'hp', value: 50 }, { type: 'flatStat', stat: 'def', value: 5 }], requires: [{ id: 'h_s2', minRank: 2 }, { id: 'h_p2', minRank: 2 }] },
      { id: 'h_s3', name: 'Resurrection', description: 'Special: Miracle (Massive heal at low HP)', icon: '☥', maxRank: 1, branch: 'sanctity', tier: 3, x: 10, y: 40, effects: [{ type: 'special', id: 'miracle', description: 'Massive heal at low HP' }, { type: 'special', id: 'mastery_healer_sustain', description: 'Divine Intervention: +3% Regen' }], requires: [{ id: 'h_s2', minRank: 3 }] },
      { id: 'h_s4', name: 'Purity', description: '+20% HP & +1% Regen', icon: '🌸', maxRank: 5, branch: 'sanctity', tier: 4, x: 15, y: 55, effects: [{ type: 'percentStat', stat: 'hp', value: 0.2 }, { type: 'regen', value: 0.01 }], requires: [{ id: 'h_s3', minRank: 1 }] },
      { id: 'h_s5', name: 'Immortality', description: 'Special: HP Regen increased to 2% of Max HP per tick', icon: '♾️', maxRank: 1, branch: 'sanctity', tier: 5, x: 20, y: 70, effects: [{ type: 'regen', value: 0.02 }], requires: [{ id: 'h_s4', minRank: 3 }] },

      // Protection
      { id: 'h_p1', name: 'Divine Armor', description: '+12 Defense per rank', icon: '🛡️', maxRank: 5, branch: 'protection', tier: 1, isShared: true, x: 50, y: 10, effects: [{ type: 'flatStat', stat: 'def', value: 12 }] },
      { id: 'h_p2', name: 'Guardian Aura', description: '+8% Damage Reduction per rank', icon: '👼', maxRank: 5, branch: 'protection', tier: 2, x: 50, y: 25, effects: [{ type: 'damageReduction', value: 0.08 }], requires: [{ id: 'h_p1', minRank: 3 }] },
      { id: 'h_pd1', name: 'Defender\'s Zeal', description: '+5 Defense & +2% Crit Chance', icon: '🛡️', maxRank: 5, branch: 'protection', tier: 3, x: 65, y: 35, effects: [{ type: 'flatStat', stat: 'def', value: 5 }, { type: 'critChance', value: 0.02 }], requires: [{ id: 'h_p2', minRank: 2 }, { id: 'h_d2', minRank: 2 }] },
      { id: 'h_p3', name: 'Aegis', description: '+20% Defense & +100 HP', icon: '🛡️', maxRank: 1, branch: 'protection', tier: 3, x: 45, y: 40, effects: [{ type: 'percentStat', stat: 'def', value: 0.2 }, { type: 'flatStat', stat: 'hp', value: 100 }, { type: 'special', id: 'mastery_healer_defense', description: 'Divine Intervention: Shield Hero' }], requires: [{ id: 'h_p2', minRank: 3 }] },
      { id: 'h_p4', name: 'Iron Will', description: '+30% Defense & +15% Damage Reduction', icon: '⚓', maxRank: 5, branch: 'protection', tier: 4, x: 50, y: 55, effects: [{ type: 'percentStat', stat: 'def', value: 0.3 }, { type: 'damageReduction', value: 0.15 }], requires: [{ id: 'h_p3', minRank: 1 }] },
      { id: 'h_p5', name: 'Divine Ward', description: 'Special: 50% Damage Reduction and +200 Defense', icon: '💠', maxRank: 1, branch: 'protection', tier: 5, x: 55, y: 70, effects: [{ type: 'damageReduction', value: 0.50 }, { type: 'flatStat', stat: 'def', value: 200 }], requires: [{ id: 'h_p4', minRank: 3 }] },

      // Divinity
      { id: 'h_d1', name: 'Smite', description: '+15 Magic Attack per rank', icon: '☀️', maxRank: 5, branch: 'divinity', tier: 1, isShared: true, x: 80, y: 10, effects: [{ type: 'flatStat', stat: 'matk', value: 15 }] },
      { id: 'h_d2', name: 'Zealot', description: '+6% Crit Chance per rank', icon: '💥', maxRank: 5, branch: 'divinity', tier: 2, x: 85, y: 25, effects: [{ type: 'critChance', value: 0.06 }], requires: [{ id: 'h_d1', minRank: 3 }] },
      { id: 'h_ds1', name: 'Holy Surge', description: '+10 Magic Attack & +0.1% Regen', icon: '⚡', maxRank: 5, branch: 'divinity', tier: 3, x: 75, y: 35, effects: [{ type: 'flatStat', stat: 'matk', value: 10 }, { type: 'regen', value: 0.001 }], requires: [{ id: 'h_d2', minRank: 2 }, { id: 'h_s2', minRank: 2 }] },
      { id: 'h_d3', name: 'Wrath of God', description: '+15% Magic Attack & +40% Crit Damage', icon: '🌩️', maxRank: 1, branch: 'divinity', tier: 3, x: 90, y: 40, effects: [{ type: 'percentStat', stat: 'matk', value: 0.15 }, { type: 'critDamage', value: 0.4 }, { type: 'special', id: 'mastery_healer_offense', description: 'Divine Intervention: Holy Blast' }], requires: [{ id: 'h_d2', minRank: 3 }] },
      { id: 'h_d4', name: 'Judgement', description: '+40% Crit Damage & +20% Crit Chance', icon: '⚖️', maxRank: 5, branch: 'divinity', tier: 4, x: 85, y: 55, effects: [{ type: 'critDamage', value: 0.4 }, { type: 'critChance', value: 0.2 }], requires: [{ id: 'h_d3', minRank: 1 }] },
      { id: 'h_d5', name: 'Avatar of Vengeance', description: 'Special: Magic Attack is doubled and Speed +50', icon: '🔱', maxRank: 1, branch: 'divinity', tier: 5, x: 80, y: 70, effects: [{ type: 'percentStat', stat: 'matk', value: 1.0 }, { type: 'flatStat', stat: 'spd', value: 50 }], requires: [{ id: 'h_d4', minRank: 3 }] },

      // Deep nodes
      { id: 'h_s6', name: 'Fountain of Life', description: '+1500 HP & +1.5% HP Regen per rank', icon: '⛲', maxRank: 5, branch: 'sanctity', tier: 6, x: 15, y: 85, effects: [{ type: 'flatStat', stat: 'hp', value: 1500 }, { type: 'regen', value: 0.015 }], requires: [{ id: 'h_s5', minRank: 1 }] },
      { id: 'h_s7', name: 'Angelic Grace', description: 'Special: Immortality (HP Regen increases to 30% of Max HP every tick)', icon: '👼', maxRank: 1, branch: 'sanctity', tier: 7, x: 10, y: 100, effects: [{ type: 'regen', value: 0.03 }], requires: [{ id: 'h_s6', minRank: 3 }] },
      { id: 'h_p6', name: 'Guardian Spirit', description: '+50% Defense & +50% Magic Defense per rank', icon: '🛡️', maxRank: 5, branch: 'protection', tier: 6, x: 50, y: 85, effects: [{ type: 'percentStat', stat: 'def', value: 0.5 }, { type: 'percentStat', stat: 'mdef', value: 0.5 }], requires: [{ id: 'h_p5', minRank: 1 }] },
      { id: 'h_p7', name: 'Unbreakable Will', description: 'Special: Divine Ward (Gain permanent 80% Damage Reduction)', icon: '⛪', maxRank: 1, branch: 'protection', tier: 7, x: 55, y: 100, effects: [{ type: 'damageReduction', value: 0.80 }], requires: [{ id: 'h_p6', minRank: 3 }] },
      { id: 'h_d6', name: 'Divine Wrath', description: '+150 Magic Attack & +30% Crit Damage per rank', icon: '🔥', maxRank: 5, branch: 'divinity', tier: 6, x: 85, y: 85, effects: [{ type: 'flatStat', stat: 'matk', value: 150 }, { type: 'critDamage', value: 0.3 }], requires: [{ id: 'h_d5', minRank: 1 }] },
      { id: 'h_d7', name: 'Holy Retribution', description: 'Special: Avatar of Vengeance (Holy attacks deal True Damage)', icon: '⚔️', maxRank: 1, branch: 'divinity', tier: 7, x: 90, y: 100, effects: [{ type: 'special', id: 'avatar_of_vengeance', description: 'Holy attacks deal True Dmg' }], requires: [{ id: 'h_d6', minRank: 3 }] },
      { id: 'h_sy1', name: 'Sanctified Bulwark', description: '+20% HP, +12% Damage Reduction, +8% Regen', icon: '🕊️', maxRank: 1, branch: 'synergy', tier: 1, x: 35, y: 115, effects: [{ type: 'percentStat', stat: 'hp', value: 0.2 }, { type: 'damageReduction', value: 0.12 }, { type: 'regen', value: 0.08 }], requires: [{ id: 'h_s5', minRank: 1 }, { id: 'h_p5', minRank: 1 }] },
      { id: 'h_u1', name: 'Seraph Prime', description: '+25% Magic Attack, +20% HP, +10% Crit Chance, +20% Defense', icon: '👼', maxRank: 1, branch: 'ultimate', tier: 2, x: 50, y: 130, effects: [{ type: 'percentStat', stat: 'matk', value: 0.25 }, { type: 'percentStat', stat: 'hp', value: 0.2 }, { type: 'critChance', value: 0.1 }, { type: 'percentStat', stat: 'def', value: 0.2 }], requires: [{ id: 'h_sy1', minRank: 1 }, { id: 'h_d5', minRank: 1 }] },
      { id: 'h_ms1', name: 'Everlife Halo', description: 'Mastery. +35% HP, +3% Regen, +15% Damage Reduction.', icon: '🕊️', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 10, y: 160, effects: [{ type: 'percentStat', stat: 'hp', value: 0.35 }, { type: 'regen', value: 0.03 }, { type: 'damageReduction', value: 0.15 }], requires: [{ id: 'h_s7', minRank: 1 }] },
      { id: 'h_msp1', name: 'Saintguard Throne', description: 'Mastery. +25% HP, +25% Defense, +2% Regen, +15% Damage Reduction.', icon: '👑', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 30, y: 145, effects: [{ type: 'percentStat', stat: 'hp', value: 0.25 }, { type: 'percentStat', stat: 'def', value: 0.25 }, { type: 'regen', value: 0.02 }, { type: 'damageReduction', value: 0.15 }], requires: [{ id: 'h_s7', minRank: 1 }, { id: 'h_p7', minRank: 1 }] },
      { id: 'h_mp1', name: 'Aegis Absolute', description: 'Mastery. +40% Defense, +40% Magic Defense, +20% Damage Reduction.', icon: '🛡️', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 50, y: 160, effects: [{ type: 'percentStat', stat: 'def', value: 0.4 }, { type: 'percentStat', stat: 'mdef', value: 0.4 }, { type: 'damageReduction', value: 0.2 }], requires: [{ id: 'h_p7', minRank: 1 }] },
      { id: 'h_mpd1', name: 'Judgement Bulwark', description: 'Mastery. +30% Magic Attack, +25% Defense, +12% Damage Reduction, +10% Crit Chance.', icon: '☀️', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 70, y: 145, effects: [{ type: 'percentStat', stat: 'matk', value: 0.3 }, { type: 'percentStat', stat: 'def', value: 0.25 }, { type: 'damageReduction', value: 0.12 }, { type: 'critChance', value: 0.1 }], requires: [{ id: 'h_p7', minRank: 1 }, { id: 'h_d7', minRank: 1 }] },
      { id: 'h_md1', name: 'Solar Ascendant', description: 'Mastery. +40% Magic Attack, +20% Crit Chance, +50% Crit Damage.', icon: '🌞', maxRank: 1, branch: 'mastery', tier: 8, isMaster: true, pointCost: 5, x: 90, y: 160, effects: [{ type: 'percentStat', stat: 'matk', value: 0.4 }, { type: 'critChance', value: 0.2 }, { type: 'critDamage', value: 0.5 }], requires: [{ id: 'h_d7', minRank: 1 }] },
    ]
  },
};

// ===== EQUIPMENT DATABASE =====

export const EQUIPMENT_DATABASE: Equipment[] = [
  // --- Swords (Knight / Warrior) ---
  { id: 'w1', name: 'Rusty Sword', description: '+5 Attack', slot: 'weapon', rarity: 'Common', stats: { atk: 5 }, icon: '🗡️', allowedUnits: ['knight', 'warrior'] },
  { id: 'w2', name: 'Steel Blade', description: '+15 Attack', slot: 'weapon', rarity: 'Rare', stats: { atk: 15 }, icon: '⚔️', allowedUnits: ['knight', 'warrior'] },
  { id: 'w3', name: 'Dragon Slayer', description: '+50 Attack, +10 Speed', slot: 'weapon', rarity: 'Epic', stats: { atk: 50, spd: 10 }, icon: '🔥', allowedUnits: ['knight', 'warrior'] },
  { id: 'w_longsword', name: 'Tempered Longsword', description: '+10 Attack, +5 Defense', slot: 'weapon', rarity: 'Common', stats: { atk: 10, def: 5 }, icon: '🗡️', allowedUnits: ['knight', 'warrior'] },
  { id: 'w_claymore', name: 'Blacksteel Claymore', description: '+25 Attack, -3 Speed', slot: 'weapon', rarity: 'Rare', stats: { atk: 25, spd: -3 }, icon: '⚔️', allowedUnits: ['knight', 'warrior'] },
  { id: 'w_holy_blade', name: 'Sanctified Blade', description: '+40 Attack, +30 HP', slot: 'weapon', rarity: 'Epic', stats: { atk: 40, hp: 30 }, icon: '✝️', allowedUnits: ['knight'] },
  { id: 'w_berserker_axe', name: 'Berserker Cleaver', description: '+70 Attack, -15 Defense', slot: 'weapon', rarity: 'Epic', stats: { atk: 70, def: -15 }, icon: '🪓', allowedUnits: ['warrior'] },
  { id: 'w6', name: 'Great Axe', description: '+60 Attack, -10 Speed', slot: 'weapon', rarity: 'Epic', stats: { atk: 60, spd: -10 }, icon: '🪓', allowedUnits: ['warrior'] },
  { id: 'w_excalibur', name: 'Excalibur', description: '+120 Attack, +30 Defense, +50 HP', slot: 'weapon', rarity: 'Relic', stats: { atk: 120, def: 30, hp: 50 }, icon: '⚔️', allowedUnits: ['knight'] },
  { id: 'w_bloodthirst', name: 'Bloodthirst', description: '+150 Attack, -20 Defense', slot: 'weapon', rarity: 'Relic', stats: { atk: 150, def: -20 }, icon: '🩸', allowedUnits: ['warrior'] },
  { id: 'w_sun_hammer', name: 'Sun-Forged Hammer', description: '+45 Attack, +20 Defense, +100 HP', slot: 'weapon', rarity: 'Epic', stats: { atk: 45, def: 20, hp: 100 }, icon: '🔨', allowedUnits: ['knight'] },
  { id: 'w_shadow_blade', name: 'Shadow Dagger', description: '+25 Attack, +15 Speed, +5% Crit', slot: 'weapon', rarity: 'Rare', stats: { atk: 25, spd: 15, critChance: 0.05 }, icon: '🗡️', allowedUnits: ['warrior', 'archer'] },
  { id: 'w_obsidian_axe', name: 'Obsidian Waraxe', description: '+80 Attack, +10% Crit Damage', slot: 'weapon', rarity: 'Epic', stats: { atk: 80 }, icon: '🪓', allowedUnits: ['warrior'] },
  { id: 'w_noble_rapier', name: 'Noble Rapier', description: '+30 Attack, +10 Speed, +5% Crit', slot: 'weapon', rarity: 'Rare', stats: { atk: 30, spd: 10, critChance: 0.05 }, icon: '🤺', allowedUnits: ['knight', 'warrior'] },
  { id: 'w_mythril_claymore', name: 'Mythril Claymore', description: '+60 Attack, +20 Defense', slot: 'weapon', rarity: 'Epic', stats: { atk: 60, def: 20 }, icon: '🗡️', allowedUnits: ['knight'] },
  // --- Bows (Archer) ---
  { id: 'w_short_bow', name: 'Short Bow', description: '+6 Attack, +3 Speed, +2% Crit', slot: 'weapon', rarity: 'Common', stats: { atk: 6, spd: 3, critChance: 0.02 }, icon: '🏹', allowedUnits: ['archer'] },
  { id: 'w5', name: 'Elven Longbow', description: '+30 Attack, +15 Speed, +5% Crit', slot: 'weapon', rarity: 'Rare', stats: { atk: 30, spd: 15, critChance: 0.05 }, icon: '🏹', allowedUnits: ['archer'] },
  { id: 'w_compound_bow', name: 'Compound Bow', description: '+20 Attack, +8 Speed, +4% Crit', slot: 'weapon', rarity: 'Rare', stats: { atk: 20, spd: 8, critChance: 0.04 }, icon: '🏹', allowedUnits: ['archer'] },
  { id: 'w_windpiercer', name: 'Windpiercer', description: '+55 Attack, +25 Speed, +8% Crit', slot: 'weapon', rarity: 'Epic', stats: { atk: 55, spd: 25, critChance: 0.08 }, icon: '💨', allowedUnits: ['archer'] },
  { id: 'w_artemis', name: 'Bow of Artemis', description: '+100 Attack, +40 Speed, +15% Crit', slot: 'weapon', rarity: 'Relic', stats: { atk: 100, spd: 40, critChance: 0.15 }, icon: '🌙', allowedUnits: ['archer'] },
  { id: 'w_storm_bow', name: 'Stormreaver Bow', description: '+65 Attack, +25 Speed, +10% Multi-strike', slot: 'weapon', rarity: 'Epic', stats: { atk: 65, spd: 25 }, icon: '🌩️', allowedUnits: ['archer'] },
  { id: 'w_forest_shortbow', name: 'Oakheart Shortbow', description: '+15 Attack, +10 Speed, +50 HP', slot: 'weapon', rarity: 'Rare', stats: { atk: 15, spd: 10, hp: 50 }, icon: '🏹', allowedUnits: ['archer'] },
  // --- Staves / Wands (Mage) ---
  { id: 'w_wand', name: 'Apprentice Wand', description: '+7 Magic Attack, +1% Crit', slot: 'weapon', rarity: 'Common', stats: { matk: 7, critChance: 0.01 }, icon: '🪄', allowedUnits: ['mage'] },
  { id: 'w_crystal_staff', name: 'Crystal Staff', description: '+18 Magic Attack, +5 Speed, +3% Crit', slot: 'weapon', rarity: 'Rare', stats: { matk: 18, spd: 5, critChance: 0.03 }, icon: '🔮', allowedUnits: ['mage'] },
  { id: 'w_inferno_staff', name: 'Inferno Staff', description: '+45 Magic Attack, +10 Speed, +6% Crit', slot: 'weapon', rarity: 'Epic', stats: { matk: 45, spd: 10, critChance: 0.06 }, icon: '🔥', allowedUnits: ['mage'] },
  { id: 'w4', name: 'Void Staff', description: '+100 Magic Attack, +20 Speed, +10% Crit', slot: 'weapon', rarity: 'Relic', stats: { matk: 100, spd: 20, critChance: 0.10 }, icon: '🔮', allowedUnits: ['mage'] },
  { id: 'w_resonance_staff', name: 'Resonance Staff', description: '+30 Magic Attack, +5 Speed, +4% Crit', slot: 'weapon', rarity: 'Rare', stats: { matk: 30, spd: 5, critChance: 0.04 }, icon: '✨', allowedUnits: ['mage'] },
  { id: 'w_hex_staff', name: 'Hexblade Staff', description: '+70 Magic Attack, +10 Speed, +8% Crit', slot: 'weapon', rarity: 'Epic', stats: { matk: 70, spd: 10, critChance: 0.08 }, icon: '🪄', allowedUnits: ['mage'] },
  { id: 'w_chaos_orb', name: 'Chaos Orb', description: '+140 Magic Attack, +20 Speed, +12% Crit', slot: 'weapon', rarity: 'Relic', stats: { matk: 140, spd: 20, critChance: 0.12 }, icon: '🌀', allowedUnits: ['mage'] },
  { id: 'w_glacial_staff', name: 'Glacial Scepter', description: '+55 Magic Attack, +30 Magic Defense, +100 HP', slot: 'weapon', rarity: 'Epic', stats: { matk: 55, mdef: 30, hp: 100 }, icon: '❄️', allowedUnits: ['mage', 'healer'] },
  { id: 'w_ember_wand', name: 'Ember Wand', description: '+25 Magic Attack, +5% Crit', slot: 'weapon', rarity: 'Rare', stats: { matk: 25, critChance: 0.05 }, icon: '🔥', allowedUnits: ['mage'] },
  { id: 'w_thunder_staff', name: 'Thunderstrike Staff', description: '+40 Magic Attack, +15 Speed', slot: 'weapon', rarity: 'Rare', stats: { matk: 40, spd: 15 }, icon: '⚡', allowedUnits: ['mage'] },
  // --- Holy Weapons (Healer) ---
  { id: 'w_prayer_beads', name: 'Prayer Beads', description: '+4 Magic Attack, +10 HP', slot: 'weapon', rarity: 'Common', stats: { matk: 4, hp: 10 }, icon: '📿', allowedUnits: ['healer'] },
  { id: 'w_silver_censer', name: 'Silver Censer', description: '+12 Magic Attack, +20 HP', slot: 'weapon', rarity: 'Rare', stats: { matk: 12, hp: 20 }, icon: '🕯️', allowedUnits: ['healer'] },
  { id: 'w_divine_scepter', name: 'Divine Scepter', description: '+35 Magic Attack, +50 HP', slot: 'weapon', rarity: 'Epic', stats: { matk: 35, hp: 50 }, icon: '🏛️', allowedUnits: ['healer'] },
  { id: 'w_staff_of_eternity', name: 'Staff of Eternity', description: '+80 Magic Attack, +150 HP, +20 Defense', slot: 'weapon', rarity: 'Relic', stats: { matk: 80, hp: 150, def: 20 }, icon: '✨', allowedUnits: ['healer'] },
  { id: 'w_arcane_tome', name: 'Arcane Tome', description: '+12 Magic Attack', slot: 'weapon', rarity: 'Common', stats: { matk: 12 }, icon: '📖', allowedUnits: ['mage', 'healer'] },
  { id: 'w_moonlit_staff', name: 'Moonlit Staff', description: '+25 Magic Attack, +30 HP', slot: 'weapon', rarity: 'Rare', stats: { matk: 25, hp: 30 }, icon: '🌙', allowedUnits: ['healer'] },
  { id: 'w_seraphic_scepter', name: 'Seraphic Scepter', description: '+60 Magic Attack, +80 HP', slot: 'weapon', rarity: 'Epic', stats: { matk: 60, hp: 80 }, icon: '💫', allowedUnits: ['healer'] },
  { id: 'w_genesis_staff', name: 'Genesis Staff', description: '+120 Magic Attack, +200 HP, +20 Magic Defense', slot: 'weapon', rarity: 'Relic', stats: { matk: 120, hp: 200, mdef: 20 }, icon: '⚡', allowedUnits: ['healer'] },
  { id: 'w_life_bloom', name: 'Lifebloom Branch', description: '+40 Magic Attack, +5% HP Regen', slot: 'weapon', rarity: 'Epic', stats: { matk: 40 }, icon: '🌿', allowedUnits: ['healer'] },
  { id: 'w_oracle_staff', name: 'Oracle Staff', description: '+75 Magic Attack, +40 Magic Defense', slot: 'weapon', rarity: 'Epic', stats: { matk: 75, mdef: 40 }, icon: '🔮', allowedUnits: ['healer', 'mage'] },
  // --- Plate Armor (Knight / Warrior) ---
  { id: 'a_chain_mail', name: 'Chain Mail', description: '+8 Defense', slot: 'armor', rarity: 'Common', stats: { def: 8 }, icon: '⛓️', allowedUnits: ['knight', 'warrior'] },
  { id: 'a2', name: 'Plate Mail', description: '+20 Defense, -2 Speed', slot: 'armor', rarity: 'Rare', stats: { def: 20, spd: -2 }, icon: '🛡️', allowedUnits: ['knight', 'warrior'] },
  { id: 'a_war_plate', name: 'War Plate', description: '+15 Defense, +40 HP', slot: 'armor', rarity: 'Rare', stats: { def: 15, hp: 40 }, icon: '🛡️', allowedUnits: ['knight', 'warrior'] },
  { id: 'a3', name: 'Celestial Armor', description: '+50 Defense, +100 HP', slot: 'armor', rarity: 'Epic', stats: { def: 50, hp: 100 }, icon: '✨', allowedUnits: ['knight', 'warrior'] },
  { id: 'a_titan_guard', name: 'Titan Guard', description: '+40 Defense, +80 HP, -5 Speed', slot: 'armor', rarity: 'Epic', stats: { def: 40, hp: 80, spd: -5 }, icon: '🏔️', allowedUnits: ['knight'] },
  { id: 'a_rage_plate', name: 'Rage Plate', description: '+25 Defense, +20 Attack', slot: 'armor', rarity: 'Epic', stats: { def: 25, atk: 20 }, icon: '💢', allowedUnits: ['warrior'] },
  { id: 'a4', name: 'Obsidian Plate', description: '+100 Defense, +200 HP, -5 Speed', slot: 'armor', rarity: 'Relic', stats: { def: 100, hp: 200, spd: -5 }, icon: '🌑', allowedUnits: ['knight', 'warrior'] },
  { id: 'a_spirit_plate', name: 'Spirit Plate', description: '+40 Magic Defense, +30 Defense', slot: 'armor', rarity: 'Epic', stats: { mdef: 40, def: 30 }, icon: '🌟', allowedUnits: ['knight', 'warrior'] },
  { id: 'a_guardian_mail', name: 'Guardian Mail', description: '+25 Defense, +80 HP', slot: 'armor', rarity: 'Rare', stats: { def: 25, hp: 80 }, icon: '🛡️', allowedUnits: ['knight', 'warrior'] },
  { id: 'a_dragon_plate', name: 'Dragonbone Plate', description: '+60 Defense, +150 HP, +30 Magic Defense', slot: 'armor', rarity: 'Epic', stats: { def: 60, hp: 150, mdef: 30 }, icon: '🐲', allowedUnits: ['knight'] },
  // --- Leather Armor (Archer / Mage / Healer) ---
  { id: 'a1', name: 'Leather Vest', description: '+5 Defense', slot: 'armor', rarity: 'Common', stats: { def: 5 }, icon: '👕', allowedUnits: ['archer', 'mage', 'healer'] },
  { id: 'a_padded_leather', name: 'Padded Leather', description: '+8 Defense, +10 HP', slot: 'armor', rarity: 'Common', stats: { def: 8, hp: 10 }, icon: '👕', allowedUnits: ['archer', 'mage', 'healer'] },
  { id: 'a_ward_charm', name: 'Ward Charm', description: '+8 Magic Defense', slot: 'armor', rarity: 'Common', stats: { mdef: 8 }, icon: '🔷' },
  { id: 'a5', name: "Ranger's Cloak", description: '+10 Defense, +30 Speed', slot: 'armor', rarity: 'Rare', stats: { def: 10, spd: 30 }, icon: '🧥', allowedUnits: ['archer'] },
  { id: 'a_mage_robe', name: 'Arcane Robes', description: '+10 Defense, +15 Magic Attack', slot: 'armor', rarity: 'Rare', stats: { def: 10, matk: 15 }, icon: '🧙', allowedUnits: ['mage'] },
  { id: 'a_cleric_vestments', name: 'Cleric Vestments', description: '+12 Defense, +30 HP', slot: 'armor', rarity: 'Rare', stats: { def: 12, hp: 30 }, icon: '⛪', allowedUnits: ['healer'] },
  { id: 'a_mage_ward', name: 'Mage Ward Armor', description: '+20 Magic Defense, +8 Defense', slot: 'armor', rarity: 'Rare', stats: { mdef: 20, def: 8 }, icon: '🛡️', allowedUnits: ['mage', 'healer'] },
  { id: 'a_shadow_leather', name: 'Shadow Leather', description: '+20 Defense, +20 Speed', slot: 'armor', rarity: 'Epic', stats: { def: 20, spd: 20 }, icon: '🌑', allowedUnits: ['archer'] },
  { id: 'a_astral_robe', name: 'Astral Robe', description: '+25 Defense, +40 Magic Attack', slot: 'armor', rarity: 'Epic', stats: { def: 25, matk: 40 }, icon: '🌌', allowedUnits: ['mage'] },
  { id: 'a_holy_garb', name: 'Holy Garb', description: '+30 Defense, +80 HP', slot: 'armor', rarity: 'Epic', stats: { def: 30, hp: 80 }, icon: '🕊️', allowedUnits: ['healer'] },
  { id: 'a_veil_of_stars', name: 'Veil of Stars', description: '+50 Defense, +50 Speed', slot: 'armor', rarity: 'Relic', stats: { def: 50, spd: 50 }, icon: '🌠', allowedUnits: ['archer'] },
  { id: 'a_robe_of_the_void', name: 'Robe of the Void', description: '+40 Defense, +80 Magic Attack', slot: 'armor', rarity: 'Relic', stats: { def: 40, matk: 80 }, icon: '🔮', allowedUnits: ['mage'] },
  { id: 'a_divine_vestments', name: 'Divine Vestments', description: '+60 Defense, +200 HP', slot: 'armor', rarity: 'Relic', stats: { def: 60, hp: 200 }, icon: '👼', allowedUnits: ['healer'] },
  { id: 'a_runic_vestment', name: 'Runic Vestment', description: '+60 Magic Defense, +20 Defense, +100 HP', slot: 'armor', rarity: 'Relic', stats: { mdef: 60, def: 20, hp: 100 }, icon: '🔮', allowedUnits: ['mage', 'healer'] },
  { id: 'a_nimble_leathers', name: 'Nimble Leathers', description: '+15 Defense, +25 Speed, +4% Evasion', slot: 'armor', rarity: 'Rare', stats: { def: 15, spd: 25, eva: 0.04 }, icon: '👕', allowedUnits: ['archer', 'warrior'] },
  { id: 'a_void_robe', name: 'Void-Touched Robe', description: '+30 Magic Attack, +30 Magic Defense', slot: 'armor', rarity: 'Epic', stats: { matk: 30, mdef: 30 }, icon: '🌌', allowedUnits: ['mage', 'healer'] },
  { id: 'a_seraph_robe', name: 'Seraph Robe', description: '+150 HP, +40 Magic Defense', slot: 'armor', rarity: 'Epic', stats: { hp: 150, mdef: 40 }, icon: '🕊️', allowedUnits: ['healer'] },
  // --- Helmets ---
  { id: 'helm_iron_bascinet', name: 'Iron Bascinet', description: '+6 Defense, +25 HP', slot: 'helmet', rarity: 'Common', stats: { def: 6, hp: 25 }, icon: '⛑️', allowedUnits: ['knight', 'warrior'] },
  { id: 'helm_hunters_hood', name: "Hunter's Hood", description: '+12 Attack, +10 Speed, +3% Crit', slot: 'helmet', rarity: 'Rare', stats: { atk: 12, spd: 10, critChance: 0.03 }, icon: '🎩', allowedUnits: ['archer'] },
  { id: 'helm_runic_circlet', name: 'Runic Circlet', description: '+16 Magic Attack, +12 Magic Defense', slot: 'helmet', rarity: 'Rare', stats: { matk: 16, mdef: 12 }, icon: '🔵', allowedUnits: ['mage', 'healer'] },
  { id: 'helm_warlord_crown', name: 'Warlord Crown', description: '+20 Attack, +18 Defense, +60 HP', slot: 'helmet', rarity: 'Epic', stats: { atk: 20, def: 18, hp: 60 }, icon: '👑', allowedUnits: ['knight', 'warrior'] },
  { id: 'helm_starseer_diadem', name: 'Starseer Diadem', description: '+28 Magic Attack, +20 Magic Defense, +5% Crit', slot: 'helmet', rarity: 'Epic', stats: { matk: 28, mdef: 20, critChance: 0.05 }, icon: '🌟', allowedUnits: ['mage', 'healer'] },
  { id: 'helm_eclipse_mask', name: 'Eclipse Mask', description: '+24 Attack, +18 Speed, +6% Crit', slot: 'helmet', rarity: 'Epic', stats: { atk: 24, spd: 18, critChance: 0.06 }, icon: '🎭', allowedUnits: ['archer', 'warrior'] },
  { id: 'helm_solar_halo', name: 'Solar Halo', description: '+50 Magic Attack, +120 HP, +30 Magic Defense, +8% Crit', slot: 'helmet', rarity: 'Relic', stats: { matk: 50, hp: 120, mdef: 30, critChance: 0.08 }, icon: '🌞', allowedUnits: ['healer'] },
  { id: 'helm_void_visor', name: 'Void Visor', description: '+35 Attack, +45 Magic Attack, +20 Speed, +10% Crit', slot: 'helmet', rarity: 'Relic', stats: { atk: 35, matk: 45, spd: 20, critChance: 0.1 }, icon: '🌒', allowedUnits: ['mage', 'archer'] },
  { id: 'helm_knight_greathelm', name: 'Greatknight Helm', description: '+25 Defense, +100 HP', slot: 'helmet', rarity: 'Epic', stats: { def: 25, hp: 100 }, icon: '🪖', allowedUnits: ['knight'] },
  { id: 'helm_arcane_hood', name: 'Arcane Hood', description: '+20 Magic Attack, +15 Magic Defense', slot: 'helmet', rarity: 'Rare', stats: { matk: 20, mdef: 15 }, icon: '🧙' },
  { id: 'helm_assassin_mask', name: 'Assassin Mask', description: '+15 Attack, +10% Crit Damage', slot: 'helmet', rarity: 'Rare', stats: { atk: 15 }, icon: '🎭', allowedUnits: ['warrior', 'archer'] },
  // --- Gloves ---
  { id: 'gloves_leather_grips', name: 'Leather Grips', description: '+8 Attack, +4 Speed', slot: 'gloves', rarity: 'Common', stats: { atk: 8, spd: 4 }, icon: '🧤', allowedUnits: ['archer', 'warrior'] },
  { id: 'gloves_templar_gauntlets', name: 'Templar Gauntlets', description: '+14 Attack, +10 Defense', slot: 'gloves', rarity: 'Rare', stats: { atk: 14, def: 10 }, icon: '🧤', allowedUnits: ['knight', 'warrior'] },
  { id: 'gloves_runed_grips', name: 'Runed Grips', description: '+18 Magic Attack, +6 Speed', slot: 'gloves', rarity: 'Rare', stats: { matk: 18, spd: 6 }, icon: '✋', allowedUnits: ['mage', 'healer'] },
  { id: 'gloves_shadow_wraps', name: 'Shadow Wraps', description: '+22 Attack, +18 Speed, +5% Crit', slot: 'gloves', rarity: 'Epic', stats: { atk: 22, spd: 18, critChance: 0.05 }, icon: '🪢', allowedUnits: ['archer'] },
  { id: 'gloves_worldbreaker', name: 'Worldbreaker Gauntlets', description: '+30 Attack, +15 Defense, +4% Crit', slot: 'gloves', rarity: 'Epic', stats: { atk: 30, def: 15, critChance: 0.04 }, icon: '💪', allowedUnits: ['knight', 'warrior'] },
  { id: 'gloves_manasurge', name: 'Manasurge Gloves', description: '+40 Magic Attack, +6% Crit', slot: 'gloves', rarity: 'Epic', stats: { matk: 40, critChance: 0.06 }, icon: '✨', allowedUnits: ['mage'] },
  { id: 'gloves_seraph_hands', name: 'Seraph Hands', description: '+70 Magic Attack, +100 HP, +25 Magic Defense', slot: 'gloves', rarity: 'Relic', stats: { matk: 70, hp: 100, mdef: 25 }, icon: '🤲', allowedUnits: ['mage', 'healer'] },
  { id: 'gloves_titan_grip', name: "Titan's Grip", description: '+65 Attack, +30 Defense, +8% Crit', slot: 'gloves', rarity: 'Relic', stats: { atk: 65, def: 30, critChance: 0.08 }, icon: '✊', allowedUnits: ['knight', 'warrior'] },
  { id: 'gloves_wind_wraps', name: 'Wind-Woven Wraps', description: '+15 Speed, +5% Multi-strike', slot: 'gloves', rarity: 'Rare', stats: { spd: 15 }, icon: '🧤', allowedUnits: ['archer', 'warrior'] },
  { id: 'gloves_soul_reaper', name: 'Soulreaper Grips', description: '+40 Attack, +10% Crit Damage', slot: 'gloves', rarity: 'Epic', stats: { atk: 40 }, icon: '💀', allowedUnits: ['warrior', 'mage'] },
  { id: 'gloves_blessed_mitts', name: 'Blessed Mitts', description: '+30 Magic Attack, +50 HP', slot: 'gloves', rarity: 'Rare', stats: { matk: 30, hp: 50 }, icon: '🤲', allowedUnits: ['healer'] },
  // --- Boots ---
  { id: 'boots_marchers', name: "Marcher's Boots", description: '+20 HP, +4 Speed', slot: 'boots', rarity: 'Common', stats: { hp: 20, spd: 4 }, icon: '👢', allowedUnits: ['knight', 'warrior'] },
  { id: 'boots_pathfinder', name: 'Pathfinder Boots', description: '+16 Speed, +4% Evasion', slot: 'boots', rarity: 'Rare', stats: { spd: 16, eva: 0.04 }, icon: '🥾', allowedUnits: ['archer'] },
  { id: 'boots_sage_sandals', name: 'Sage Sandals', description: '+12 Speed, +12 Magic Attack', slot: 'boots', rarity: 'Rare', stats: { spd: 12, matk: 12 }, icon: '👡', allowedUnits: ['mage', 'healer'] },
  { id: 'boots_bulwark_greaves', name: 'Bulwark Greaves', description: '+20 Defense, +80 HP, -2 Speed', slot: 'boots', rarity: 'Epic', stats: { def: 20, hp: 80, spd: -2 }, icon: '🛡️', allowedUnits: ['knight'] },
  { id: 'boots_bloodrunner', name: 'Bloodrunner Boots', description: '+24 Attack, +20 Speed, +4% Crit', slot: 'boots', rarity: 'Epic', stats: { atk: 24, spd: 20, critChance: 0.04 }, icon: '🔥', allowedUnits: ['warrior'] },
  { id: 'boots_tempest_treads', name: 'Tempest Treads', description: '+28 Speed, +8% Evasion, +5% Crit', slot: 'boots', rarity: 'Epic', stats: { spd: 28, eva: 0.08, critChance: 0.05 }, icon: '🌪️', allowedUnits: ['archer'] },
  { id: 'boots_voidwalk', name: 'Voidwalk Sandals', description: '+60 Magic Attack, +35 Speed, +6% Evasion', slot: 'boots', rarity: 'Relic', stats: { matk: 60, spd: 35, eva: 0.06 }, icon: '🌀', allowedUnits: ['mage'] },
  { id: 'boots_sanctified_greaves', name: 'Sanctified Greaves', description: '+150 HP, +35 Magic Defense, +18 Speed', slot: 'boots', rarity: 'Relic', stats: { hp: 150, mdef: 35, spd: 18 }, icon: '✨', allowedUnits: ['healer', 'knight'] },
  { id: 'boots_heavy_treads', name: 'Heavy Iron Treads', description: '+25 Defense, -5 Speed', slot: 'boots', rarity: 'Rare', stats: { def: 25, spd: -5 }, icon: '👢', allowedUnits: ['knight', 'warrior'] },
  { id: 'boots_arcane_slippers', name: 'Arcane Slippers', description: '+25 Magic Attack, +15 Speed', slot: 'boots', rarity: 'Rare', stats: { matk: 25, spd: 15 }, icon: '👡', allowedUnits: ['mage', 'healer'] },
  { id: 'boots_swift_runners', name: 'Swift-Strike Runners', description: '+30 Speed, +5% Multi-strike', slot: 'boots', rarity: 'Epic', stats: { spd: 30 }, icon: '👟', allowedUnits: ['archer', 'warrior'] },
  // --- Accessories ---
  { id: 'acc1', name: 'Lucky Coin', description: '+2 Speed', slot: 'accessory', rarity: 'Common', stats: { spd: 2 }, icon: '🪙' },
  { id: 'acc2', name: 'Iron Ring', description: '+5 Defense, +20 HP', slot: 'accessory', rarity: 'Rare', stats: { def: 5, hp: 20 }, icon: '💍' },
  { id: 'acc3', name: 'Heart of Gaia', description: '+200 HP', slot: 'accessory', rarity: 'Relic', stats: { hp: 200 }, icon: '🌳' },
  { id: 'acc4', name: 'Berserker Badge', description: '+25 Attack', slot: 'accessory', rarity: 'Rare', stats: { atk: 25 }, icon: '🎖️', allowedUnits: ['knight', 'warrior'] },
  { id: 'acc5', name: 'Phoenix Feather', description: '+50 HP, +10 Speed', slot: 'accessory', rarity: 'Epic', stats: { hp: 50, spd: 10 }, icon: '🪶' },
  { id: 'acc_shield_charm', name: 'Shield Charm', description: '+10 Defense, +30 HP', slot: 'accessory', rarity: 'Common', stats: { def: 10, hp: 30 }, icon: '🛡️', allowedUnits: ['knight', 'warrior'] },
  { id: 'acc_quiver', name: "Archer's Quiver", description: '+10 Attack, +8 Speed', slot: 'accessory', rarity: 'Common', stats: { atk: 10, spd: 8 }, icon: '🎯', allowedUnits: ['archer'] },
  { id: 'acc_mana_gem', name: 'Mana Gem', description: '+15 Magic Attack, +5 Speed', slot: 'accessory', rarity: 'Rare', stats: { matk: 15, spd: 5 }, icon: '💎', allowedUnits: ['mage', 'healer'] },
  { id: 'acc_war_horn', name: 'War Horn', description: '+15 Attack, +15 Defense', slot: 'accessory', rarity: 'Rare', stats: { atk: 15, def: 15 }, icon: '📯', allowedUnits: ['knight', 'warrior'] },
  { id: 'acc_swift_boots', name: 'Swift Boots', description: '+20 Speed', slot: 'accessory', rarity: 'Rare', stats: { spd: 20 }, icon: '👢' },
  { id: 'acc_ward_amulet', name: 'Ward Amulet', description: '+18 Magic Defense', slot: 'accessory', rarity: 'Rare', stats: { mdef: 18 }, icon: '🔵' },
  { id: 'acc_shadow_veil', name: 'Shadow Veil', description: '+8% Evasion, +10 Speed, +3% Crit', slot: 'accessory', rarity: 'Rare', stats: { eva: 0.08, spd: 10, critChance: 0.03 }, icon: '👁️', allowedUnits: ['archer'] },
  { id: 'acc_eagle_eye', name: 'Eagle Eye Amulet', description: '+30 Attack, +15 Speed, +6% Crit', slot: 'accessory', rarity: 'Epic', stats: { atk: 30, spd: 15, critChance: 0.06 }, icon: '🦅', allowedUnits: ['archer'] },
  { id: 'acc_arcane_focus', name: 'Arcane Focus', description: '+40 Magic Attack, +5% Crit', slot: 'accessory', rarity: 'Epic', stats: { matk: 40, critChance: 0.05 }, icon: '🔷', allowedUnits: ['mage'] },
  { id: 'acc_holy_symbol', name: 'Holy Symbol', description: '+20 Magic Attack, +60 HP, +2% Crit', slot: 'accessory', rarity: 'Epic', stats: { matk: 20, hp: 60, critChance: 0.02 }, icon: '☀️', allowedUnits: ['healer'] },
  { id: 'acc_spellbreaker', name: 'Spellbreaker Brooch', description: '+40 Magic Defense, +4% Crit', slot: 'accessory', rarity: 'Epic', stats: { mdef: 40, critChance: 0.04 }, icon: '💠', allowedUnits: ['knight', 'warrior'] },
  { id: 'acc_ghost_steps', name: 'Ghost Steps', description: '+12% Evasion, +15 Speed, +5% Crit', slot: 'accessory', rarity: 'Epic', stats: { eva: 0.12, spd: 15, critChance: 0.05 }, icon: '👻', allowedUnits: ['archer', 'warrior'] },
  { id: 'acc_crown_of_valor', name: 'Crown of Valor', description: '+30 Defense, +100 HP, +3% Crit', slot: 'accessory', rarity: 'Relic', stats: { def: 30, hp: 100, critChance: 0.03 }, icon: '👑', allowedUnits: ['knight'] },
  { id: 'acc_fang_necklace', name: 'Fang Necklace', description: '+60 Attack, +20 Speed, +10% Crit', slot: 'accessory', rarity: 'Relic', stats: { atk: 60, spd: 20, critChance: 0.10 }, icon: '🦷', allowedUnits: ['warrior'] },
  { id: 'acc_moonstone', name: 'Moonstone Pendant', description: '+50 Attack, +30 Speed, +12% Crit', slot: 'accessory', rarity: 'Relic', stats: { atk: 50, spd: 30, critChance: 0.12 }, icon: '🌙', allowedUnits: ['archer'] },
  { id: 'acc_orb_of_infinity', name: 'Orb of Infinity', description: '+80 Magic Attack, +10 Speed, +15% Crit', slot: 'accessory', rarity: 'Relic', stats: { matk: 80, spd: 10, critChance: 0.15 }, icon: '🔮', allowedUnits: ['mage'] },
  { id: 'acc_ankh', name: 'Ankh of Resurrection', description: '+40 Magic Attack, +150 HP, +5% Crit', slot: 'accessory', rarity: 'Relic', stats: { matk: 40, hp: 150, critChance: 0.05 }, icon: '☥', allowedUnits: ['healer'] },
  { id: 'acc_mirror_shard', name: 'Mirror Shard', description: '+60 Magic Defense, +20 Defense, +8% Crit', slot: 'accessory', rarity: 'Relic', stats: { mdef: 60, def: 20, critChance: 0.08 }, icon: '🪞' },
  { id: 'acc_vampire_fang', name: 'Vampire Fang', description: '+10% Lifesteal', slot: 'accessory', rarity: 'Rare', stats: { lifesteal: 0.10 }, icon: '🧛' },
  { id: 'acc_golden_idol', name: 'Golden Idol', description: '+50% Gold Find (Placeholder Effect)', slot: 'accessory', rarity: 'Epic', stats: { }, icon: '🗿' },
  { id: 'acc_dragon_eye', name: 'Dragon Eye', description: '+40 Attack, +40 Magic Attack', slot: 'accessory', rarity: 'Epic', stats: { atk: 40, matk: 40 }, icon: '👁️' },
  { id: 'acc_runic_stone', name: 'Runic Stone', description: '+20 Magic Defense, +50 HP', slot: 'accessory', rarity: 'Rare', stats: { mdef: 20, hp: 50 }, icon: '🪨' },
  // --- Mission Loot ---
  // Rare
  { id: 'ml_ember_ring', name: 'Ember Ring', description: '+12 Attack, +5 Speed, +2% Crit', slot: 'accessory', rarity: 'Rare', stats: { atk: 12, spd: 5, critChance: 0.02 }, icon: '🔥' },
  { id: 'ml_frost_pendant', name: 'Frost Pendant', description: '+15 Magic Defense, +10 HP', slot: 'accessory', rarity: 'Rare', stats: { mdef: 15, hp: 10 }, icon: '❄️' },
  { id: 'ml_scouts_cloak', name: "Scout's Cloak", description: '+8 Defense, +12 Speed', slot: 'armor', rarity: 'Rare', stats: { def: 8, spd: 12 }, icon: '🧥' },
  { id: 'ml_iron_gauntlets', name: 'Iron Gauntlets', description: '+10 Attack, +8 Defense', slot: 'accessory', rarity: 'Rare', stats: { atk: 10, def: 8 }, icon: '🧤', allowedUnits: ['knight', 'warrior'] },
  { id: 'ml_jade_amulet', name: 'Jade Amulet', description: '+18 Magic Attack, +10 HP', slot: 'accessory', rarity: 'Rare', stats: { matk: 18, hp: 10 }, icon: '💚', allowedUnits: ['mage', 'healer'] },
  { id: 'ml_brigand_blade', name: 'Brigand Blade', description: '+20 Attack, +5 Speed', slot: 'weapon', rarity: 'Rare', stats: { atk: 20, spd: 5 }, icon: '🗡️', allowedUnits: ['knight', 'warrior'] },
  { id: 'ml_venom_bow', name: 'Venom Bow', description: '+18 Attack, +10 Speed, +3% Crit', slot: 'weapon', rarity: 'Rare', stats: { atk: 18, spd: 10, critChance: 0.03 }, icon: '🏹', allowedUnits: ['archer'] },
  { id: 'ml_bone_wand', name: 'Bone Wand', description: '+20 Magic Attack, +2% Crit', slot: 'weapon', rarity: 'Rare', stats: { matk: 20, critChance: 0.02 }, icon: '🦴', allowedUnits: ['mage', 'healer'] },
  { id: 'ml_graveknuckle_wraps', name: 'Graveknuckle Wraps', description: '+16 Attack, +8 Speed, +3% Crit', slot: 'gloves', rarity: 'Rare', stats: { atk: 16, spd: 8, critChance: 0.03 }, icon: '🪦', allowedUnits: ['warrior', 'archer'] },
  // Epic
  { id: 'ml_volcanic_blade', name: 'Volcanic Blade', description: '+55 Attack, +15 Speed, +5% Crit', slot: 'weapon', rarity: 'Epic', stats: { atk: 55, spd: 15, critChance: 0.05 }, icon: '🌋', allowedUnits: ['knight', 'warrior'] },
  { id: 'ml_serpent_bow', name: 'Serpent Bow', description: '+45 Attack, +20 Speed, +7% Crit', slot: 'weapon', rarity: 'Epic', stats: { atk: 45, spd: 20, critChance: 0.07 }, icon: '🐍', allowedUnits: ['archer'] },
  { id: 'ml_abyssal_staff', name: 'Abyssal Staff', description: '+55 Magic Attack, +12 Speed, +6% Crit', slot: 'weapon', rarity: 'Epic', stats: { matk: 55, spd: 12, critChance: 0.06 }, icon: '🌊', allowedUnits: ['mage'] },
  { id: 'ml_radiant_mace', name: 'Radiant Mace', description: '+45 Magic Attack, +60 HP', slot: 'weapon', rarity: 'Epic', stats: { matk: 45, hp: 60 }, icon: '☀️', allowedUnits: ['healer'] },
  { id: 'ml_dragon_scale', name: 'Dragon Scale Mail', description: '+40 Defense, +60 HP, +15 Magic Defense', slot: 'armor', rarity: 'Epic', stats: { def: 40, hp: 60, mdef: 15 }, icon: '🐲', allowedUnits: ['knight', 'warrior'] },
  { id: 'ml_phantom_cloak', name: 'Phantom Cloak', description: '+20 Defense, +25 Speed, +5% Evasion', slot: 'armor', rarity: 'Epic', stats: { def: 20, spd: 25, eva: 0.05 }, icon: '👻', allowedUnits: ['archer'] },
  { id: 'ml_starweave_robe', name: 'Starweave Robe', description: '+25 Defense, +35 Magic Attack, +20 Magic Defense', slot: 'armor', rarity: 'Epic', stats: { def: 25, matk: 35, mdef: 20 }, icon: '🌟', allowedUnits: ['mage', 'healer'] },
  { id: 'ml_demon_heart', name: 'Demon Heart', description: '+35 Attack, +8% Crit, +30 HP', slot: 'accessory', rarity: 'Epic', stats: { atk: 35, critChance: 0.08, hp: 30 }, icon: '👹' },
  { id: 'ml_starfall_shard', name: 'Starfall Shard', description: '+30 Magic Attack, +15 Speed, +6% Crit', slot: 'accessory', rarity: 'Epic', stats: { matk: 30, spd: 15, critChance: 0.06 }, icon: '🌠' },
  { id: 'ml_titans_belt', name: "Titan's Belt", description: '+25 Defense, +100 HP', slot: 'accessory', rarity: 'Epic', stats: { def: 25, hp: 100 }, icon: '🗿', allowedUnits: ['knight', 'warrior'] },
  { id: 'ml_warlord_helm', name: 'Warlord Helm', description: '+26 Attack, +26 Defense, +80 HP', slot: 'helmet', rarity: 'Epic', stats: { atk: 26, def: 26, hp: 80 }, icon: '🪖', allowedUnits: ['knight', 'warrior'] },
  { id: 'ml_nightglass_hood', name: 'Nightglass Hood', description: '+18 Attack, +24 Magic Attack, +20 Speed, +6% Crit', slot: 'helmet', rarity: 'Epic', stats: { atk: 18, matk: 24, spd: 20, critChance: 0.06 }, icon: '🌑', allowedUnits: ['archer', 'mage'] },
  { id: 'ml_comet_greaves', name: 'Comet Greaves', description: '+30 Speed, +25 Magic Attack, +5% Evasion', slot: 'boots', rarity: 'Epic', stats: { spd: 30, matk: 25, eva: 0.05 }, icon: '☄️', allowedUnits: ['archer', 'mage', 'healer'] },
  // Relic
  { id: 'ml_godslayer', name: 'Godslayer', description: '+180 Attack, +30 Speed, +15% Crit', slot: 'weapon', rarity: 'Relic', stats: { atk: 180, spd: 30, critChance: 0.15 }, icon: '⚡', allowedUnits: ['warrior'] },
  { id: 'ml_aegis_of_dawn', name: 'Aegis of Dawn', description: '+130 Defense, +250 HP, +50 Magic Defense', slot: 'armor', rarity: 'Relic', stats: { def: 130, hp: 250, mdef: 50 }, icon: '🌅', allowedUnits: ['knight'] },
  { id: 'ml_celestial_bow', name: 'Celestial Bow', description: '+130 Attack, +50 Speed, +18% Crit', slot: 'weapon', rarity: 'Relic', stats: { atk: 130, spd: 50, critChance: 0.18 }, icon: '✨', allowedUnits: ['archer'] },
  { id: 'ml_void_orb', name: 'Void Orb', description: '+160 Magic Attack, +25 Speed, +14% Crit', slot: 'weapon', rarity: 'Relic', stats: { matk: 160, spd: 25, critChance: 0.14 }, icon: '🌑', allowedUnits: ['mage'] },
  { id: 'ml_divine_chalice', name: 'Divine Chalice', description: '+100 Magic Attack, +200 HP, +30 Defense', slot: 'weapon', rarity: 'Relic', stats: { matk: 100, hp: 200, def: 30 }, icon: '🏆', allowedUnits: ['healer'] },
  { id: 'ml_crown_of_ages', name: 'Crown of Ages', description: '+50 Defense, +50 Magic Defense, +150 HP, +10% Crit', slot: 'accessory', rarity: 'Relic', stats: { def: 50, mdef: 50, hp: 150, critChance: 0.10 }, icon: '👑' },
  { id: 'ml_eternity_band', name: 'Eternity Band', description: '+40 Attack, +40 Magic Attack, +40 Speed', slot: 'accessory', rarity: 'Relic', stats: { atk: 40, matk: 40, spd: 40 }, icon: '💍' },
  { id: 'ml_hammer_of_creation', name: 'Hammer of Creation', description: '+200 Attack, +50 Defense, -10 Speed', slot: 'weapon', rarity: 'Relic', stats: { atk: 200, def: 50, spd: -10 }, icon: '🔨', allowedUnits: ['knight', 'warrior'] },
  { id: 'ml_voidweave_mantle', name: 'Voidweave Mantle', description: '+50 Defense, +80 Magic Defense, +30 Magic Attack', slot: 'armor', rarity: 'Relic', stats: { def: 50, mdef: 80, matk: 30 }, icon: '🌀', allowedUnits: ['mage', 'healer'] },
  { id: 'ml_shadowstep_boots', name: 'Shadowstep Boots', description: '+40 Speed, +10% Evasion, +8% Crit', slot: 'accessory', rarity: 'Relic', stats: { spd: 40, eva: 0.10, critChance: 0.08 }, icon: '🥾', allowedUnits: ['archer', 'warrior'] },
  { id: 'ml_halo_circlet', name: 'Halo Circlet', description: '+85 Magic Attack, +180 HP, +40 Magic Defense, +10% Crit', slot: 'helmet', rarity: 'Relic', stats: { matk: 85, hp: 180, mdef: 40, critChance: 0.1 }, icon: '🌤️', allowedUnits: ['healer'] },
  { id: 'ml_planar_treads', name: 'Planar Treads', description: '+30 Attack, +50 Magic Attack, +45 Speed, +8% Evasion', slot: 'boots', rarity: 'Relic', stats: { atk: 30, matk: 50, spd: 45, eva: 0.08 }, icon: '🌌', allowedUnits: ['mage', 'archer'] },
  { id: 'ml_sentinel_gauntlets', name: 'Sentinel Gauntlets', description: '+40 Attack, +60 Defense, +120 HP', slot: 'gloves', rarity: 'Relic', stats: { atk: 40, def: 60, hp: 120 }, icon: '🛡️', allowedUnits: ['knight', 'warrior'] },
  // --- New Shop Items ---
  { id: 'w_rusty_axe', name: 'Rusty Axe', description: '+7 Attack, -1 Speed', slot: 'weapon', rarity: 'Common', stats: { atk: 7, spd: -1 }, icon: '🪓', allowedUnits: ['warrior', 'knight'] },
  { id: 'w_wooden_staff', name: 'Wooden Staff', description: '+6 Magic Attack', slot: 'weapon', rarity: 'Common', stats: { matk: 6 }, icon: '🦯', allowedUnits: ['mage', 'healer'] },
  { id: 'a_tattered_cape', name: 'Tattered Cape', description: '+3 Speed, +2% Evasion', slot: 'armor', rarity: 'Common', stats: { spd: 3, eva: 0.02 }, icon: '🧣' },
  { id: 'acc_bead_necklace', name: 'Bead Necklace', description: '+15 HP', slot: 'accessory', rarity: 'Common', stats: { hp: 15 }, icon: '📿' },
  
  { id: 'w_broadsword', name: 'Broadsword', description: '+22 Attack', slot: 'weapon', rarity: 'Rare', stats: { atk: 22 }, icon: '🗡️', allowedUnits: ['knight', 'warrior'] },
  { id: 'w_recurve_bow', name: 'Recurve Bow', description: '+18 Attack, +12 Speed', slot: 'weapon', rarity: 'Rare', stats: { atk: 18, spd: 12 }, icon: '🏹', allowedUnits: ['archer'] },
  { id: 'w_sage_wand', name: 'Sage Wand', description: '+24 Magic Attack', slot: 'weapon', rarity: 'Rare', stats: { matk: 24 }, icon: '🪄', allowedUnits: ['mage', 'healer'] },
  { id: 'a_reinforced_leather', name: 'Reinforced Leather', description: '+12 Defense, +25 HP', slot: 'armor', rarity: 'Rare', stats: { def: 12, hp: 25 }, icon: '👕', allowedUnits: ['archer', 'warrior', 'healer'] },
  { id: 'helm_steel_cap', name: 'Steel Cap', description: '+10 Defense', slot: 'helmet', rarity: 'Rare', stats: { def: 10 }, icon: '🪖' },
  
  { id: 'w_giant_slayer', name: 'Giant Slayer', description: '+65 Attack, +100 HP', slot: 'weapon', rarity: 'Epic', stats: { atk: 65, hp: 100 }, icon: '⚔️', allowedUnits: ['warrior', 'knight'] },
  { id: 'w_eagle_bow', name: 'Eagle Eye Bow', description: '+50 Attack, +20 Speed, +8% Crit', slot: 'weapon', rarity: 'Epic', stats: { atk: 50, spd: 20, critChance: 0.08 }, icon: '🦅', allowedUnits: ['archer'] },
  { id: 'w_arcane_staff', name: 'Grand Arcane Staff', description: '+75 Magic Attack, +5% Crit', slot: 'weapon', rarity: 'Epic', stats: { matk: 75, critChance: 0.05 }, icon: '🔮', allowedUnits: ['mage'] },
  { id: 'a_knight_plate', name: "Knight's Heavy Plate", description: '+45 Defense, -4 Speed', slot: 'armor', rarity: 'Epic', stats: { def: 45, spd: -4 }, icon: '🛡️', allowedUnits: ['knight'] },
  { id: 'acc_dragon_claw', name: 'Dragon Claw', description: '+40 Attack, +5% Crit Damage', slot: 'accessory', rarity: 'Epic', stats: { atk: 40 }, icon: '🐾' },

  { id: 'w_gungnir', name: 'Gungnir', description: '+140 Attack, +10% Crit, Always Hits', slot: 'weapon', rarity: 'Relic', stats: { atk: 140, critChance: 0.10 }, icon: '🔱', allowedUnits: ['knight', 'warrior'] },
  { id: 'w_fail_naught', name: 'Fail-naught', description: '+120 Attack, +60 Speed', slot: 'weapon', rarity: 'Relic', stats: { atk: 120, spd: 60 }, icon: '🏹', allowedUnits: ['archer'] },
  { id: 'w_mjolnir', name: 'Mjolnir', description: '+180 Attack, +40 Defense, +100 HP', slot: 'weapon', rarity: 'Relic', stats: { atk: 180, def: 40, hp: 100 }, icon: '🔨', allowedUnits: ['warrior', 'knight'] },
  { id: 'a_aegis_plate', name: 'Aegis Plate', description: '+120 Defense, +15% Damage Reduction', slot: 'armor', rarity: 'Relic', stats: { def: 120, damageReduction: 0.15 }, icon: '🛡️', allowedUnits: ['knight'] },
  { id: 'acc_eye_of_odin', name: 'Eye of Odin', description: '+100 Magic Attack, +10% Crit', slot: 'accessory', rarity: 'Relic', stats: { matk: 100, critChance: 0.10 }, icon: '👁️', allowedUnits: ['mage', 'healer'] },

  // Legendary
  { id: 'leg_sword_stars', name: 'Star-Forged Blade', description: '+250 Attack, +50 Speed, +15% Crit', slot: 'weapon', rarity: 'Legendary', stats: { atk: 250, spd: 50, critChance: 0.15 }, icon: '✨', allowedUnits: ['knight', 'warrior'] },
  { id: 'leg_bow_light', name: 'Sun-Piercer Bow', description: '+220 Attack, +80 Speed, +20% Crit', slot: 'weapon', rarity: 'Legendary', stats: { atk: 220, spd: 80, critChance: 0.20 }, icon: '☀️', allowedUnits: ['archer'] },
  { id: 'leg_staff_eternity', name: 'Staff of the Cosmos', description: '+300 Magic Attack, +40 Speed, +15% Crit', slot: 'weapon', rarity: 'Legendary', stats: { matk: 300, spd: 40, critChance: 0.15 }, icon: '🌌', allowedUnits: ['mage'] },
  { id: 'leg_armor_titan', name: 'Titanium Bulwark', description: '+200 Defense, +500 HP, +20% DR', slot: 'armor', rarity: 'Legendary', stats: { def: 200, hp: 500, damageReduction: 0.20 }, icon: '🏔️', allowedUnits: ['knight'] },
  { id: 'leg_acc_phoenix', name: 'Eternal Phoenix Emblem', description: '+100 Attack, +100 Magic Attack, +5% HP Regen', slot: 'accessory', rarity: 'Legendary', stats: { atk: 100, matk: 100 }, icon: '🔥' },

  // Godlike
  { id: 'god_weapon_chaos', name: 'Chaos Breaker', description: '+600 Attack, +100 Speed, +25% Crit', slot: 'weapon', rarity: 'Godlike', stats: { atk: 600, spd: 100, critChance: 0.25 }, icon: '🌀', allowedUnits: ['warrior', 'knight'] },
  { id: 'god_weapon_heaven', name: 'Heavenly Harp', description: '+500 Magic Attack, +1000 HP, +50 Defense', slot: 'weapon', rarity: 'Godlike', stats: { matk: 500, hp: 1000, def: 50 }, icon: '🎻', allowedUnits: ['healer'] },
  { id: 'god_armor_void', name: 'Void Manifest Armor', description: '+400 Defense, +400 M.Defense, +30% DR', slot: 'armor', rarity: 'Godlike', stats: { def: 400, mdef: 400, damageReduction: 0.30 }, icon: '🌑' },
  { id: 'god_acc_infinity', name: 'Gauntlet of Infinity', description: '+200 to All Stats, +20% Crit, +20% Evasion', slot: 'accessory', rarity: 'Godlike', stats: { atk: 200, matk: 200, def: 200, mdef: 200, hp: 200, spd: 200, critChance: 0.20, eva: 0.20 }, icon: '🌌' },
];

// ===== LEVELS =====

export const LEVELS: Level[] = [
  // --- REGION 1: THE OUTSKIRTS ---
  {
    id: 'lvl1', name: 'Goblin Outpost', description: 'Goblins harassing the village.', difficulty: 1, rewardCoins: 100, rewardExp: 100,
    enemies: [
      { id: 'e1', name: 'Goblin Scout', type: 'warrior', stats: { hp: 80, maxHp: 80, atk: 12, matk: 0, def: 4, mdef: 2, spd: 8, eva: 0 }, rewardCoins: 5, rewardExp: 5, icon: '👺' },
      { id: 'e2', name: 'Goblin Scout', type: 'warrior', stats: { hp: 80, maxHp: 80, atk: 12, matk: 0, def: 4, mdef: 2, spd: 8, eva: 0 }, rewardCoins: 5, rewardExp: 5, icon: '👺' }
    ],
    lootTable: [{ equipmentId: 'w1', chance: 0.2 }, { equipmentId: 'w_longsword', chance: 0.15 }, { equipmentId: 'a1', chance: 0.2 }, { equipmentId: 'a_chain_mail', chance: 0.15 }, { equipmentId: 'w_short_bow', chance: 0.15 }, { equipmentId: 'w_wand', chance: 0.1 }, { equipmentId: 'w_prayer_beads', chance: 0.1 }, { equipmentId: 'w_arcane_tome', chance: 0.1 }]
  },
  {
    id: 'lvl2', name: 'Forest Ambush', description: 'Bandit blockade.', difficulty: 2, requiredLevelId: 'lvl1', rewardCoins: 140, rewardExp: 140,
    enemies: [
      { id: 'e3', name: 'Bandit Thug', type: 'warrior', stats: { hp: 120, maxHp: 120, atk: 18, matk: 0, def: 6, mdef: 3, spd: 9, eva: 0 }, rewardCoins: 10, rewardExp: 10, icon: '🥷' },
      { id: 'e4', name: 'Bandit Archer', type: 'archer', stats: { hp: 90, maxHp: 90, atk: 22, matk: 0, def: 3, mdef: 3, spd: 14, eva: 0.05 }, rewardCoins: 10, rewardExp: 10, icon: '🏹' }
    ],
    lootTable: [{ equipmentId: 'w_longsword', chance: 0.15 }, { equipmentId: 'w_short_bow', chance: 0.15 }, { equipmentId: 'a_padded_leather', chance: 0.15 }, { equipmentId: 'acc1', chance: 0.1 }, { equipmentId: 'acc_quiver', chance: 0.1 }]
  },
  {
    id: 'lvl3', name: 'Slime Pit', description: 'Toxic slime infestation.', difficulty: 3, requiredLevelId: 'lvl2', rewardCoins: 195, rewardExp: 195,
    enemies: [
      { id: 'e5', name: 'Green Slime', type: 'knight', stats: { hp: 200, maxHp: 200, atk: 14, matk: 0, def: 12, mdef: 10, spd: 5, eva: 0 }, rewardCoins: 10, rewardExp: 10, icon: '🧪' },
      { id: 'e6', name: 'Blue Slime', type: 'mage', stats: { hp: 140, maxHp: 140, atk: 0, matk: 28, def: 6, mdef: 8, spd: 7, eva: 0 }, rewardCoins: 15, rewardExp: 15, icon: '💧' }
    ],
    lootTable: [{ equipmentId: 'w2', chance: 0.15 }, { equipmentId: 'w_crystal_staff', chance: 0.1 }, { equipmentId: 'a2', chance: 0.1 }, { equipmentId: 'a_mage_robe', chance: 0.1 }, { equipmentId: 'w_silver_censer', chance: 0.1 }, { equipmentId: 'a_ward_charm', chance: 0.15 }]
  },
  {
    id: 'lvl4', name: 'Orc Warband', description: 'Elite squad of orcs.', difficulty: 5, requiredLevelId: 'lvl3', rewardCoins: 275, rewardExp: 275,
    enemies: [
      { id: 'e8', name: 'Orc Warrior', type: 'warrior', stats: { hp: 350, maxHp: 350, atk: 35, matk: 0, def: 16, mdef: 8, spd: 8, eva: 0 }, rewardCoins: 20, rewardExp: 20, icon: '👹' },
      { id: 'e10', name: 'Orc Shaman', type: 'healer', stats: { hp: 250, maxHp: 250, atk: 0, matk: 15, def: 12, mdef: 18, spd: 10, eva: 0 }, rewardCoins: 15, rewardExp: 15, icon: '🧙' }
    ],
    lootTable: [{ equipmentId: 'w_claymore', chance: 0.15 }, { equipmentId: 'w_compound_bow', chance: 0.1 }, { equipmentId: 'a_war_plate', chance: 0.15 }, { equipmentId: 'a_cleric_vestments', chance: 0.1 }, { equipmentId: 'acc2', chance: 0.1 }, { equipmentId: 'acc_mana_gem', chance: 0.08 }, { equipmentId: 'acc_ward_amulet', chance: 0.1 }]
  },
  {
    id: 'lvl5', name: "Goblin King's Den", description: 'The boss of the outskirts.', difficulty: 7, requiredLevelId: 'lvl4', rewardCoins: 385, rewardExp: 385,
    enemies: [
      { id: 'e11', name: 'Goblin Guard', type: 'knight', stats: { hp: 400, maxHp: 400, atk: 28, matk: 0, def: 24, mdef: 12, spd: 6, eva: 0 }, rewardCoins: 15, rewardExp: 15, icon: '🛡️' },
      { id: 'e12', name: 'The Goblin King', type: 'warrior', stats: { hp: 1200, maxHp: 1200, atk: 65, matk: 0, def: 35, mdef: 15, spd: 10, eva: 0 }, rewardCoins: 25, rewardExp: 25, icon: '👑' },
      { id: 'e13', name: 'Goblin Guard', type: 'knight', stats: { hp: 400, maxHp: 400, atk: 28, matk: 0, def: 24, mdef: 12, spd: 6, eva: 0 }, rewardCoins: 15, rewardExp: 15, icon: '🛡️' }
    ],
    lootTable: [{ equipmentId: 'w3', chance: 0.1 }, { equipmentId: 'w_berserker_axe', chance: 0.08 }, { equipmentId: 'a3', chance: 0.08 }, { equipmentId: 'acc4', chance: 0.15 }, { equipmentId: 'acc_war_horn', chance: 0.1 }, { equipmentId: 'w_divine_scepter', chance: 0.05 }]
  },

  // --- REGION 2: WHISPERING WOODS ---
  {
    id: 'lvl6', name: 'Spider Nest', description: 'Agile spiders wait in the web.', difficulty: 9, requiredLevelId: 'lvl5', rewardCoins: 540, rewardExp: 540,
    enemies: [
      { id: 'e14', name: 'Giant Spider', type: 'archer', stats: { hp: 500, maxHp: 500, atk: 50, matk: 0, def: 14, mdef: 8, spd: 30, eva: 0.1 }, rewardCoins: 35, rewardExp: 35, icon: '🕷️' },
      { id: 'e14b', name: 'Giant Spider', type: 'archer', stats: { hp: 500, maxHp: 500, atk: 50, matk: 0, def: 14, mdef: 8, spd: 30, eva: 0.1 }, rewardCoins: 35, rewardExp: 35, icon: '🕷️' }
    ],
    lootTable: [{ equipmentId: 'w5', chance: 0.15 }, { equipmentId: 'w_windpiercer', chance: 0.08 }, { equipmentId: 'a5', chance: 0.15 }, { equipmentId: 'a_shadow_leather', chance: 0.08 }, { equipmentId: 'acc_eagle_eye', chance: 0.06 }, { equipmentId: 'acc_shadow_veil', chance: 0.08 }]
  },
  {
    id: 'lvl7', name: 'Ancient Treant', description: 'The forest itself comes alive.', difficulty: 11, requiredLevelId: 'lvl6', rewardCoins: 755, rewardExp: 755,
    enemies: [
      { id: 'e16', name: 'Treant', type: 'knight', stats: { hp: 2500, maxHp: 2500, atk: 40, matk: 0, def: 70, mdef: 30, spd: 4, eva: 0 }, rewardCoins: 100, rewardExp: 100, icon: '🌳' }
    ],
    lootTable: [{ equipmentId: 'acc3', chance: 0.05 }, { equipmentId: 'a_titan_guard', chance: 0.1 }, { equipmentId: 'a_holy_garb', chance: 0.1 }, { equipmentId: 'acc_holy_symbol', chance: 0.08 }, { equipmentId: 'a_mage_ward', chance: 0.08 }]
  },
  {
    id: 'lvl8', name: 'Elven Renegades', description: 'Swift elven warriors.', difficulty: 13, requiredLevelId: 'lvl7', rewardCoins: 1055, rewardExp: 1055,
    enemies: [
      { id: 'e17', name: 'Elf Bladedancer', type: 'warrior', stats: { hp: 1000, maxHp: 1000, atk: 85, matk: 0, def: 25, mdef: 15, spd: 45, eva: 0.08 }, rewardCoins: 70, rewardExp: 70, icon: '🧝' },
      { id: 'e18', name: 'Elf Ranger', type: 'archer', stats: { hp: 750, maxHp: 750, atk: 95, matk: 0, def: 15, mdef: 15, spd: 55, eva: 0.12 }, rewardCoins: 70, rewardExp: 70, icon: '🏹' }
    ],
    lootTable: [{ equipmentId: 'w_holy_blade', chance: 0.1 }, { equipmentId: 'w_inferno_staff', chance: 0.08 }, { equipmentId: 'a_astral_robe', chance: 0.1 }, { equipmentId: 'a_rage_plate', chance: 0.08 }, { equipmentId: 'acc_swift_boots', chance: 0.1 }, { equipmentId: 'acc_arcane_focus', chance: 0.06 }, { equipmentId: 'acc_ghost_steps', chance: 0.06 }]
  },
  {
    id: 'lvl9', name: 'Corrupted Fountain', description: 'Arcane shadows emanate from the water.', difficulty: 15, requiredLevelId: 'lvl8', rewardCoins: 1480, rewardExp: 1480,
    enemies: [
      { id: 'e19', name: 'Shadow Mage', type: 'mage', stats: { hp: 1200, maxHp: 1200, atk: 0, matk: 140, def: 35, mdef: 60, spd: 35, eva: 0.05 }, rewardCoins: 100, rewardExp: 100, icon: '🌑' },
      { id: 'e20', name: 'Shadow Mage', type: 'mage', stats: { hp: 1200, maxHp: 1200, atk: 0, matk: 140, def: 35, mdef: 60, spd: 35, eva: 0.05 }, rewardCoins: 100, rewardExp: 100, icon: '🌑' }
    ],
    lootTable: [{ equipmentId: 'w4', chance: 0.05 }, { equipmentId: 'a_robe_of_the_void', chance: 0.03 }, { equipmentId: 'acc5', chance: 0.1 }, { equipmentId: 'acc_orb_of_infinity', chance: 0.03 }, { equipmentId: 'acc_spellbreaker', chance: 0.06 }]
  },
  {
    id: 'lvl10', name: 'Forest Dragon', description: 'The guardian of the Whispering Woods.', difficulty: 18, requiredLevelId: 'lvl9', rewardCoins: 2070, rewardExp: 2070,
    enemies: [
      { id: 'e21', name: 'Elder Treant', type: 'knight', stats: { hp: 3500, maxHp: 3500, atk: 60, matk: 0, def: 110, mdef: 50, spd: 6, eva: 0 }, rewardCoins: 100, rewardExp: 100, icon: '🌲' },
      { id: 'e22', name: 'Jade Dragon', type: 'mage', stats: { hp: 12000, maxHp: 12000, atk: 0, matk: 240, def: 90, mdef: 120, spd: 45, eva: 0.05 }, rewardCoins: 200, rewardExp: 200, icon: '🐲' }
    ],
    lootTable: [{ equipmentId: 'w_excalibur', chance: 0.04 }, { equipmentId: 'w_artemis', chance: 0.04 }, { equipmentId: 'w_staff_of_eternity', chance: 0.04 }, { equipmentId: 'a4', chance: 0.06 }, { equipmentId: 'a_veil_of_stars', chance: 0.04 }, { equipmentId: 'a_divine_vestments', chance: 0.04 }, { equipmentId: 'acc3', chance: 0.05 }]
  },

  // --- REGION 3: FROZEN TUNDRA ---
  {
    id: 'lvl11', name: 'Frost Golems', description: 'Ice giants made of living snow.', difficulty: 22, requiredLevelId: 'lvl10', rewardCoins: 2900, rewardExp: 2900,
    enemies: [
      { id: 'e23', name: 'Frost Golem', type: 'knight', stats: { hp: 6000, maxHp: 6000, atk: 120, matk: 0, def: 170, mdef: 80, spd: 12, eva: 0 }, rewardCoins: 200, rewardExp: 200, icon: '🧊' },
      { id: 'e24', name: 'Frost Golem', type: 'knight', stats: { hp: 6000, maxHp: 6000, atk: 120, matk: 0, def: 170, mdef: 80, spd: 12, eva: 0 }, rewardCoins: 200, rewardExp: 200, icon: '🧊' }
    ],
    lootTable: [{ equipmentId: 'a4', chance: 0.05 }, { equipmentId: 'acc_crown_of_valor', chance: 0.03 }, { equipmentId: 'w_bloodthirst', chance: 0.03 }, { equipmentId: 'a_spirit_plate', chance: 0.06 }]
  },
  {
    id: 'lvl12', name: 'Yeti Pack', description: 'Brutal beasts of the north.', difficulty: 26, requiredLevelId: 'lvl11', rewardCoins: 4060, rewardExp: 4060,
    enemies: [
      { id: 'e25', name: 'Alpha Yeti', type: 'warrior', stats: { hp: 10000, maxHp: 10000, atk: 300, matk: 0, def: 100, mdef: 50, spd: 35, eva: 0.03 }, rewardCoins: 400, rewardExp: 400, icon: '🦍' },
      { id: 'e26', name: 'Yeti Cub', type: 'warrior', stats: { hp: 3000, maxHp: 3000, atk: 120, matk: 0, def: 50, mdef: 25, spd: 55, eva: 0.05 }, rewardCoins: 100, rewardExp: 100, icon: '🐾' }
    ],
    lootTable: [{ equipmentId: 'w6', chance: 0.15 }, { equipmentId: 'w_bloodthirst', chance: 0.05 }, { equipmentId: 'acc_fang_necklace', chance: 0.04 }, { equipmentId: 'acc_moonstone', chance: 0.04 }, { equipmentId: 'acc_ankh', chance: 0.04 }]
  },
  {
    id: 'lvl13', name: "Frost Witch's Lair", description: 'An ice sorceress corrupts the tundra.', difficulty: 30, requiredLevelId: 'lvl12', rewardCoins: 5685, rewardExp: 5685,
    enemies: [
      { id: 'e27', name: 'Ice Revenant', type: 'knight', stats: { hp: 12000, maxHp: 12000, atk: 200, matk: 0, def: 200, mdef: 100, spd: 18, eva: 0 }, rewardCoins: 350, rewardExp: 350, icon: '💀' },
      { id: 'e28', name: 'Frost Witch', type: 'mage', stats: { hp: 8000, maxHp: 8000, atk: 0, matk: 350, def: 60, mdef: 200, spd: 40, eva: 0.08 }, rewardCoins: 400, rewardExp: 400, icon: '🧊' }
    ],
    lootTable: [{ equipmentId: 'w_hex_staff', chance: 0.08 }, { equipmentId: 'w_resonance_staff', chance: 0.1 }, { equipmentId: 'a_mage_ward', chance: 0.1 }, { equipmentId: 'acc_orb_of_infinity', chance: 0.04 }, { equipmentId: 'a_runic_vestment', chance: 0.03 }]
  },
  {
    id: 'lvl14', name: 'Crystal Caverns', description: 'An ancient dragon slumbers in the ice.', difficulty: 34, requiredLevelId: 'lvl13', rewardCoins: 7960, rewardExp: 7960,
    enemies: [
      { id: 'e29', name: 'Glacial Wyrm', type: 'knight', stats: { hp: 25000, maxHp: 25000, atk: 280, matk: 0, def: 350, mdef: 150, spd: 15, eva: 0 }, rewardCoins: 1000, rewardExp: 1000, icon: '🐉' }
    ],
    lootTable: [{ equipmentId: 'w_chaos_orb', chance: 0.04 }, { equipmentId: 'a_runic_vestment', chance: 0.04 }, { equipmentId: 'acc_mirror_shard', chance: 0.03 }, { equipmentId: 'a_spirit_plate', chance: 0.05 }, { equipmentId: 'w_genesis_staff', chance: 0.03 }]
  },

  // --- REGION 4: VOLCANIC WASTES ---
  {
    id: 'lvl15', name: 'Volcanic Vanguard', description: 'Fire imps guard the entrance to the wastes.', difficulty: 40, requiredLevelId: 'lvl14', rewardCoins: 11140, rewardExp: 11140,
    enemies: [
      { id: 'e30', name: 'Fire Imp', type: 'archer', stats: { hp: 5000, maxHp: 5000, atk: 280, matk: 0, def: 80, mdef: 60, spd: 70, eva: 0.12 }, rewardCoins: 450, rewardExp: 450, icon: '😈' },
      { id: 'e31', name: 'Fire Imp', type: 'archer', stats: { hp: 5000, maxHp: 5000, atk: 280, matk: 0, def: 80, mdef: 60, spd: 70, eva: 0.12 }, rewardCoins: 450, rewardExp: 450, icon: '😈' },
      { id: 'e32', name: 'Lava Hound', type: 'warrior', stats: { hp: 8000, maxHp: 8000, atk: 350, matk: 0, def: 100, mdef: 70, spd: 45, eva: 0.05 }, rewardCoins: 600, rewardExp: 600, icon: '🔥' }
    ],
    lootTable: [{ equipmentId: 'w_windpiercer', chance: 0.08 }, { equipmentId: 'a_shadow_leather', chance: 0.1 }, { equipmentId: 'acc_ghost_steps', chance: 0.05 }, { equipmentId: 'acc_eagle_eye', chance: 0.06 }]
  },
  {
    id: 'lvl16', name: 'Lava Troll Bridge', description: 'Massive trolls patrol the molten bridges.', difficulty: 46, requiredLevelId: 'lvl15', rewardCoins: 15600, rewardExp: 15600,
    enemies: [
      { id: 'e33', name: 'Lava Troll', type: 'warrior', stats: { hp: 30000, maxHp: 30000, atk: 450, matk: 0, def: 160, mdef: 80, spd: 25, eva: 0 }, rewardCoins: 1000, rewardExp: 1000, icon: '👹' },
      { id: 'e34', name: 'Lava Troll', type: 'warrior', stats: { hp: 30000, maxHp: 30000, atk: 450, matk: 0, def: 160, mdef: 80, spd: 25, eva: 0 }, rewardCoins: 1000, rewardExp: 1000, icon: '👹' }
    ],
    lootTable: [{ equipmentId: 'w_berserker_axe', chance: 0.08 }, { equipmentId: 'w6', chance: 0.1 }, { equipmentId: 'a_rage_plate', chance: 0.08 }, { equipmentId: 'acc_fang_necklace', chance: 0.05 }, { equipmentId: 'acc_spellbreaker', chance: 0.06 }]
  },
  {
    id: 'lvl17', name: 'The Fire Drake', description: 'A winged terror of flame and fury.', difficulty: 52, requiredLevelId: 'lvl16', rewardCoins: 21840, rewardExp: 21840,
    enemies: [
      { id: 'e35', name: 'Ember Wyvern', type: 'archer', stats: { hp: 15000, maxHp: 15000, atk: 350, matk: 0, def: 120, mdef: 150, spd: 65, eva: 0.1 }, rewardCoins: 1200, rewardExp: 1200, icon: '🦅' },
      { id: 'e36', name: 'Magma Drake', type: 'mage', stats: { hp: 40000, maxHp: 40000, atk: 0, matk: 600, def: 100, mdef: 300, spd: 50, eva: 0 }, rewardCoins: 1500, rewardExp: 1500, icon: '🐉' }
    ],
    lootTable: [{ equipmentId: 'w_chaos_orb', chance: 0.05 }, { equipmentId: 'w_excalibur', chance: 0.03 }, { equipmentId: 'a_veil_of_stars', chance: 0.04 }, { equipmentId: 'acc_mirror_shard', chance: 0.04 }, { equipmentId: 'w_genesis_staff', chance: 0.04 }]
  },

  // --- REGION 5: SHADOW REALM ---
  {
    id: 'lvl18', name: 'Shadow Labyrinth', description: 'An endless maze of shadow and despair.', difficulty: 58, requiredLevelId: 'lvl17', rewardCoins: 30570, rewardExp: 30570,
    enemies: [
      { id: 'e37', name: 'Shadow Stalker', type: 'archer', stats: { hp: 20000, maxHp: 20000, atk: 500, matk: 0, def: 150, mdef: 200, spd: 80, eva: 0.2 }, rewardCoins: 2000, rewardExp: 2000, icon: '🌑' },
      { id: 'e38', name: 'Void Shade', type: 'mage', stats: { hp: 25000, maxHp: 25000, atk: 0, matk: 700, def: 100, mdef: 350, spd: 55, eva: 0.05 }, rewardCoins: 2000, rewardExp: 2000, icon: '👤' }
    ],
    lootTable: [{ equipmentId: 'w_artemis', chance: 0.05 }, { equipmentId: 'a_robe_of_the_void', chance: 0.04 }, { equipmentId: 'acc_moonstone', chance: 0.05 }, { equipmentId: 'acc_ghost_steps', chance: 0.06 }, { equipmentId: 'a_runic_vestment', chance: 0.04 }]
  },
  {
    id: 'lvl19', name: 'Void Warden', description: 'Ancient guardians sealed away for eternity.', difficulty: 65, requiredLevelId: 'lvl18', rewardCoins: 42800, rewardExp: 42800,
    enemies: [
      { id: 'e39', name: 'Ancient Golem', type: 'knight', stats: { hp: 80000, maxHp: 80000, atk: 600, matk: 0, def: 500, mdef: 200, spd: 20, eva: 0 }, rewardCoins: 2500, rewardExp: 2500, icon: '🗿' },
      { id: 'e40', name: 'Void Specter', type: 'mage', stats: { hp: 30000, maxHp: 30000, atk: 0, matk: 900, def: 80, mdef: 450, spd: 70, eva: 0.1 }, rewardCoins: 2500, rewardExp: 2500, icon: '👻' }
    ],
    lootTable: [{ equipmentId: 'w_bloodthirst', chance: 0.05 }, { equipmentId: 'a4', chance: 0.04 }, { equipmentId: 'acc_crown_of_valor', chance: 0.04 }, { equipmentId: 'acc_mirror_shard', chance: 0.05 }, { equipmentId: 'w_chaos_orb', chance: 0.04 }]
  },
  {
    id: 'lvl20', name: 'The Abyssal Throne', description: 'The Abyssal Lord awaits at the edge of reality.', difficulty: 75, requiredLevelId: 'lvl19', rewardCoins: 60000, rewardExp: 60000,
    enemies: [
      { id: 'e41', name: 'Abyssal Herald', type: 'warrior', stats: { hp: 50000, maxHp: 50000, atk: 900, matk: 0, def: 400, mdef: 300, spd: 60, eva: 0.1 }, rewardCoins: 3000, rewardExp: 3000, icon: '⚔️' },
      { id: 'e42', name: 'The Abyssal Lord', type: 'mage', stats: { hp: 200000, maxHp: 200000, atk: 0, matk: 1500, def: 200, mdef: 800, spd: 80, eva: 0.15 }, rewardCoins: 5000, rewardExp: 5000, icon: '🌌' }
    ],
    lootTable: [{ equipmentId: 'w_excalibur', chance: 0.05 }, { equipmentId: 'w_chaos_orb', chance: 0.05 }, { equipmentId: 'w_genesis_staff', chance: 0.05 }, { equipmentId: 'acc_mirror_shard', chance: 0.05 }, { equipmentId: 'a_runic_vestment', chance: 0.05 }]
  },
  {
    id: 'lvl_necromancer', name: 'Cursed Catacombs', description: 'Malakor the Necromancer raises an endless army of the dead.', difficulty: 45, requiredLevelId: 'lvl15', rewardCoins: 15000, rewardExp: 15000,
    enemies: [
      { id: 'necromancer', name: 'Malakor the Necromancer', type: 'mage', stats: { hp: 45000, maxHp: 45000, atk: 0, matk: 400, def: 150, mdef: 300, spd: 30, eva: 0.05 }, rewardCoins: 5000, rewardExp: 5000, icon: '💀' }
    ],
    lootTable: [{ equipmentId: 'ml_void_orb', chance: 0.1 }, { equipmentId: 'w_hex_staff', chance: 0.15 }, { equipmentId: 'a_runic_vestment', chance: 0.15 }, { equipmentId: 'acc_mirror_shard', chance: 0.1 }]
  },
  {
    id: 'boss_ignis', name: 'Molten Core', description: 'Ignis charges a massive Flame Blast. Use Defense Potions or high mitigation!', difficulty: 30, requiredLevelId: 'lvl10', rewardCoins: 8000, rewardExp: 8000,
    enemies: [
      { id: 'ignis', name: 'Ignis the Firelord', type: 'warrior', stats: { hp: 25000, maxHp: 25000, atk: 350, matk: 0, def: 100, mdef: 100, spd: 20, eva: 0 }, rewardCoins: 2000, rewardExp: 2000, icon: '🔥' }
    ],
    lootTable: [{ equipmentId: 'ml_volcanic_blade', chance: 0.2 }, { equipmentId: 'ml_ember_ring', chance: 0.2 }, { equipmentId: 'a_rage_plate', chance: 0.15 }]
  },
  {
    id: 'boss_xylos', name: 'Arcane Observatory', description: 'Archmage Xylos gains power over time. A true DPS race.', difficulty: 60, requiredLevelId: 'lvl15', rewardCoins: 25000, rewardExp: 25000,
    enemies: [
      { id: 'xylos', name: 'Archmage Xylos', type: 'mage', stats: { hp: 80000, maxHp: 80000, atk: 0, matk: 600, def: 200, mdef: 400, spd: 40, eva: 0.1 }, rewardCoins: 8000, rewardExp: 8000, icon: '🧙‍♂️' }
    ],
    lootTable: [{ equipmentId: 'leg_staff_eternity', chance: 0.05 }, { equipmentId: 'acc_eye_of_odin', chance: 0.1 }, { equipmentId: 'ml_starweave_robe', chance: 0.15 }]
  },
  {
    id: 'boss_voidweaver', name: 'The Void Engine', description: 'At 50% HP, the Weaver shields itself and summons Void Tendrils.', difficulty: 85, requiredLevelId: 'lvl20', rewardCoins: 100000, rewardExp: 100000,
    enemies: [
      { id: 'voidweaver', name: 'The Void Weaver', type: 'mage', stats: { hp: 300000, maxHp: 300000, atk: 0, matk: 1200, def: 500, mdef: 800, spd: 50, eva: 0.15 }, rewardCoins: 25000, rewardExp: 25000, icon: '👾' }
    ],
    lootTable: [{ equipmentId: 'god_armor_void', chance: 0.02 }, { equipmentId: 'ml_void_orb', chance: 0.1 }, { equipmentId: 'ml_voidweave_mantle', chance: 0.1 }]
  },
];

// ===== ARTIFACTS & ACHIEVEMENTS =====

export const ARTIFACTS: Artifact[] = [
  { id: 'art1', name: 'Ancient Blade', description: 'Increases Attack and Magic Attack by 10%.', rarity: 'Rare', costShards: 6 },
  { id: 'art2', name: 'Eternal Shield', description: 'Increases Defense by 10%.', rarity: 'Epic', costShards: 12 },
  { id: 'art3', name: 'Pendant of Life', description: 'Increases HP by 15%.', rarity: 'Relic', costShards: 20 }
];

export const CONSUMABLES: Consumable[] = [
  { 
    id: 'hp_potion', name: 'Health Potion', description: 'Restores 25% of your maximum health.', 
    icon: '🧪', price: 150, 
    effect: { type: 'heal', value: 0.25 } 
  },
  { 
    id: 'dmg_potion', name: 'Damage Potion', description: 'Increases Attack and Magic Attack by 20% for 30 seconds.', 
    icon: '🧪', price: 500, 
    effect: { type: 'buff', stat: 'atk', value: 0.2, durationSeconds: 30 } 
  },
  { 
    id: 'spd_potion', name: 'Speed Potion', description: 'Increases Speed by 30% for 30 seconds.', 
    icon: '🧪', price: 400, 
    effect: { type: 'buff', stat: 'spd', value: 0.3, durationSeconds: 30 } 
  },
  { 
    id: 'def_potion', name: 'Defense Potion', description: 'Increases Defense and M.Defense by 25% for 30 seconds.', 
    icon: '🧪', price: 450, 
    effect: { type: 'buff', stat: 'def', value: 0.25, durationSeconds: 30 } 
  },
];

export const SHOP_ITEMS: { equipmentId: string; price: number }[] = [
  // Common
  { equipmentId: 'w1', price: 100 },
  { equipmentId: 'w_longsword', price: 250 },
  { equipmentId: 'w_short_bow', price: 250 },
  { equipmentId: 'w_wand', price: 250 },
  { equipmentId: 'w_prayer_beads', price: 250 },
  { equipmentId: 'w_rusty_axe', price: 150 },
  { equipmentId: 'w_wooden_staff', price: 150 },
  { equipmentId: 'a1', price: 100 },
  { equipmentId: 'a_padded_leather', price: 200 },
  { equipmentId: 'a_tattered_cape', price: 120 },
  { equipmentId: 'acc1', price: 150 },
  { equipmentId: 'acc_bead_necklace', price: 100 },

  // Rare
  { equipmentId: 'w2', price: 800 },
  { equipmentId: 'w_claymore', price: 1500 },
  { equipmentId: 'w_broadsword', price: 1200 },
  { equipmentId: 'w_recurve_bow', price: 1400 },
  { equipmentId: 'w_sage_wand', price: 1600 },
  { equipmentId: 'a2', price: 900 },
  { equipmentId: 'a_war_plate', price: 1200 },
  { equipmentId: 'a_reinforced_leather', price: 1100 },
  { equipmentId: 'helm_steel_cap', price: 600 },
  { equipmentId: 'acc2', price: 1000 },
  { equipmentId: 'acc_quiver', price: 800 },

  // Epic
  { equipmentId: 'w3', price: 5000 },
  { equipmentId: 'w_giant_slayer', price: 6500 },
  { equipmentId: 'w_eagle_bow', price: 7000 },
  { equipmentId: 'w_arcane_staff', price: 7500 },
  { equipmentId: 'a3', price: 4500 },
  { equipmentId: 'a_knight_plate', price: 5500 },
  { equipmentId: 'acc5', price: 3500 },
  { equipmentId: 'acc_dragon_claw', price: 4000 },

  // Relic
  { equipmentId: 'w_excalibur', price: 35000 },
  { equipmentId: 'w_artemis', price: 35000 },
  { equipmentId: 'w_staff_of_eternity', price: 35000 },
  { equipmentId: 'w_gungnir', price: 40000 },
  { equipmentId: 'w_mjolnir', price: 45000 },
  { equipmentId: 'a4', price: 25000 },
  { equipmentId: 'a_aegis_plate', price: 30000 },
  { equipmentId: 'acc_eye_of_odin', price: 20000 },

  // Legendary
  { equipmentId: 'leg_sword_stars', price: 120000 },
  { equipmentId: 'leg_bow_light', price: 120000 },
  { equipmentId: 'leg_staff_eternity', price: 120000 },
  { equipmentId: 'leg_armor_titan', price: 100000 },
  { equipmentId: 'leg_acc_phoenix', price: 80000 },

  // Godlike
  { equipmentId: 'god_weapon_chaos', price: 500000 },
  { equipmentId: 'god_weapon_heaven', price: 500000 },
  { equipmentId: 'god_armor_void', price: 450000 },
  { equipmentId: 'god_acc_infinity', price: 750000 },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach1', icon: '🩸', name: 'First Blood', description: 'Defeat your first enemy.', requirement: { type: 'kills', value: 1 }, rewards: { coins: 250 } },
  { id: 'ach2', icon: '⚔️', name: 'Slayer', description: 'Defeat 100 enemies.', requirement: { type: 'kills', value: 100 }, rewards: { coins: 2000, artifactShards: 1 } },
  { id: 'ach3', icon: '💀', name: 'Mass Slaughter', description: 'Defeat 500 enemies.', requirement: { type: 'kills', value: 500 }, rewards: { coins: 7500, talentPoints: 1 } },
  { id: 'ach4', icon: '🔥', name: 'Warchief', description: 'Defeat 1,000 enemies.', requirement: { type: 'kills', value: 1000 }, rewards: { coins: 15000, artifactShards: 2 } },
  { id: 'ach5', icon: '💥', name: 'Annihilator', description: 'Defeat 5,000 enemies.', requirement: { type: 'kills', value: 5000 }, rewards: { coins: 100000, talentPoints: 2 } },
  { id: 'ach6', icon: '🌟', name: 'Shadow Slayer', description: 'Defeat 10,000 enemies.', requirement: { type: 'kills', value: 10000 }, rewards: { coins: 250000, artifactShards: 4 } },
  { id: 'ach7', icon: '🗺️', name: 'Explorer', description: 'Complete 5 different levels.', requirement: { type: 'levels', value: 5 }, rewards: { coins: 5000, artifactShards: 1 } },
  { id: 'ach8', icon: '🏆', name: 'Conqueror', description: 'Complete 10 different levels.', requirement: { type: 'levels', value: 10 }, rewards: { coins: 15000, talentPoints: 1 } },
  { id: 'ach9', icon: '🌍', name: 'Realm Walker', description: 'Complete 15 different levels.', requirement: { type: 'levels', value: 15 }, rewards: { coins: 30000, artifactShards: 2 } },
  { id: 'ach10', icon: '🌌', name: "World's End", description: 'Complete all 20 levels.', requirement: { type: 'levels', value: 20 }, rewards: { coins: 75000, talentPoints: 2, artifactShards: 4 } },
  { id: 'ach11', icon: '💰', name: 'First Fortune', description: 'Earn 10,000 coins total.', requirement: { type: 'coins', value: 10000 }, rewards: { coins: 5000 } },
  { id: 'ach12', icon: '💎', name: 'Rich', description: 'Earn 100,000 coins total.', requirement: { type: 'coins', value: 100000 }, rewards: { coins: 25000, artifactShards: 1 } },
  { id: 'ach13', icon: '👑', name: 'Millionaire', description: 'Earn 1,000,000 coins total.', requirement: { type: 'coins', value: 1000000 }, rewards: { coins: 150000, talentPoints: 1 } },
  { id: 'ach14', icon: '💸', name: 'Wealthy Scholar', description: 'Earn 10,000,000 coins total.', requirement: { type: 'coins', value: 10000000 }, rewards: { coins: 1500000, artifactShards: 2 } },
  { id: 'ach15', icon: '🏰', name: 'Billionaire', description: 'Earn 1,000,000,000 coins total.', requirement: { type: 'coins', value: 1000000000 }, rewards: { coins: 10000000, talentPoints: 2 } },
  { id: 'ach16', icon: '🏦', name: 'Treasury Lord', description: 'Earn 1,000,000,000,000 coins total.', requirement: { type: 'coins', value: 1000000000000 }, rewards: { coins: 250000000, artifactShards: 5 } },
];

// ===== MISSIONS =====

/** Scale mission rewards exponentially to match the 1.2x/level exp curve. */
export function scaleMissionRewards(mission: Mission, heroLevel: number) {
  const levelDiff = Math.max(0, heroLevel - mission.requiredLevel);
  const multiplier = Math.pow(1.15, levelDiff);
  return {
    coins: Math.floor(mission.rewards.coins * multiplier),
    exp: Math.floor(mission.rewards.exp * multiplier),
    talentPoints: mission.rewards.talentPoints,
    artifactShards: mission.rewards.artifactShards,
    lootTable: mission.rewards.lootTable,
  };
}

export function rollMissionLoot(lootTable?: MissionLootEntry[]) {
  if (!lootTable?.length) return [];

  const drops: string[] = [];
  for (const entry of lootTable) {
    if (Math.random() < entry.chance) {
      drops.push(entry.equipmentId);
    }
  }

  return drops;
}

export const MISSIONS: Mission[] = [
  // === PATROLS (short, 1-5 min) — small loot chance ===
  { id: 'patrol_village', name: 'Village Patrol', description: 'Scout the nearby village for threats. Quick and easy.', icon: '🏘️', durationSeconds: 60, rewardType: 'exp_focus', rewards: { coins: 50, exp: 120, lootTable: [{ equipmentId: 'acc1', chance: 0.08 }, { equipmentId: 'ml_ember_ring', chance: 0.04 }] }, requiredLevel: 1, category: 'patrol' },
  { id: 'patrol_roads', name: 'Road Watch', description: 'Guard the trade roads from bandits.', icon: '🛤️', durationSeconds: 90, rewardType: 'coin_focus', rewards: { coins: 200, exp: 60, lootTable: [{ equipmentId: 'ml_brigand_blade', chance: 0.06 }, { equipmentId: 'ml_iron_gauntlets', chance: 0.05 }] }, requiredLevel: 1, category: 'patrol' },
  { id: 'patrol_forest', name: 'Forest Sweep', description: 'Clear out critters from the woodland paths.', icon: '🌲', durationSeconds: 120, rewardType: 'balanced', rewards: { coins: 150, exp: 150, lootTable: [{ equipmentId: 'ml_scouts_cloak', chance: 0.06 }, { equipmentId: 'ml_venom_bow', chance: 0.04 }] }, requiredLevel: 2, category: 'patrol' },
  { id: 'patrol_graveyard', name: 'Graveyard Watch', description: 'Keep the restless dead in their graves.', icon: '🪦', durationSeconds: 150, rewardType: 'exp_focus', rewards: { coins: 80, exp: 250, lootTable: [{ equipmentId: 'ml_bone_wand', chance: 0.06 }, { equipmentId: 'ml_frost_pendant', chance: 0.05 }] }, requiredLevel: 3, category: 'patrol' },
  { id: 'patrol_border', name: 'Border Garrison', description: 'Man the border outpost and repel skirmishers.', icon: '🚩', durationSeconds: 180, rewardType: 'balanced', rewards: { coins: 250, exp: 250, lootTable: [{ equipmentId: 'ml_iron_gauntlets', chance: 0.08 }, { equipmentId: 'acc_shield_charm', chance: 0.06 }] }, requiredLevel: 4, category: 'patrol' },
  { id: 'patrol_harbor', name: 'Harbor Duty', description: 'Inspect incoming ships for contraband.', icon: '⚓', durationSeconds: 120, rewardType: 'coin_focus', rewards: { coins: 350, exp: 80, lootTable: [{ equipmentId: 'ml_jade_amulet', chance: 0.05 }, { equipmentId: 'acc_swift_boots', chance: 0.04 }] }, requiredLevel: 3, category: 'patrol' },
  { id: 'patrol_sewers', name: 'Sewer Crawl', description: 'Investigate strange noises in the city sewers.', icon: '🐀', durationSeconds: 200, rewardType: 'exp_focus', rewards: { coins: 100, exp: 350, lootTable: [{ equipmentId: 'ml_frost_pendant', chance: 0.08 }, { equipmentId: 'ml_ember_ring', chance: 0.06 }] }, requiredLevel: 5, category: 'patrol' },

  // === EXPEDITIONS (5-15 min) — moderate loot chance ===
  { id: 'exp_ruins', name: 'Ruined Temple', description: 'Explore an ancient temple overrun by dark creatures.', icon: '🏛️', durationSeconds: 300, rewardType: 'balanced', rewards: { coins: 500, exp: 500, lootTable: [{ equipmentId: 'ml_bone_wand', chance: 0.12 }, { equipmentId: 'ml_jade_amulet', chance: 0.10 }, { equipmentId: 'acc_ward_amulet', chance: 0.08 }] }, requiredLevel: 3, category: 'expedition' },
  { id: 'exp_mines', name: 'Abandoned Mines', description: 'Delve into the old mines. Rumored to have rich veins.', icon: '⛏️', durationSeconds: 420, rewardType: 'coin_focus', rewards: { coins: 1200, exp: 300, lootTable: [{ equipmentId: 'ml_iron_gauntlets', chance: 0.12 }, { equipmentId: 'ml_brigand_blade', chance: 0.10 }, { equipmentId: 'ml_volcanic_blade', chance: 0.04 }] }, requiredLevel: 4, category: 'expedition' },
  { id: 'exp_swamp', name: 'Swamp Expedition', description: 'Navigate the treacherous marshlands. Tough but rewarding.', icon: '🐊', durationSeconds: 480, rewardType: 'exp_focus', rewards: { coins: 400, exp: 900, lootTable: [{ equipmentId: 'ml_venom_bow', chance: 0.12 }, { equipmentId: 'ml_serpent_bow', chance: 0.05 }, { equipmentId: 'ml_phantom_cloak', chance: 0.04 }] }, requiredLevel: 5, category: 'expedition' },
  { id: 'exp_mountain', name: 'Mountain Pass', description: 'Cross the frozen mountain pass and clear the yeti threat.', icon: '🏔️', durationSeconds: 600, rewardType: 'balanced', rewards: { coins: 800, exp: 800, lootTable: [{ equipmentId: 'ml_frost_pendant', chance: 0.15 }, { equipmentId: 'ml_titans_belt', chance: 0.05 }, { equipmentId: 'ml_dragon_scale', chance: 0.04 }] }, requiredLevel: 6, category: 'expedition' },
  { id: 'exp_desert', name: 'Desert Crossing', description: 'Brave the scorching sands in search of a lost caravan.', icon: '🏜️', durationSeconds: 540, rewardType: 'coin_focus', rewards: { coins: 1800, exp: 400, lootTable: [{ equipmentId: 'ml_ember_ring', chance: 0.15 }, { equipmentId: 'ml_starfall_shard', chance: 0.06 }, { equipmentId: 'acc_eagle_eye', chance: 0.05 }] }, requiredLevel: 7, category: 'expedition' },
  { id: 'exp_catacombs', name: 'Catacombs Descent', description: 'Venture into the catacombs beneath the old cathedral.', icon: '💀', durationSeconds: 720, rewardType: 'exp_focus', rewards: { coins: 500, exp: 1500, lootTable: [{ equipmentId: 'ml_bone_wand', chance: 0.15 }, { equipmentId: 'ml_abyssal_staff', chance: 0.06 }, { equipmentId: 'ml_starweave_robe', chance: 0.05 }] }, requiredLevel: 8, category: 'expedition' },
  { id: 'exp_coastline', name: 'Coastal Raid', description: 'Repel pirates assaulting the eastern coastline.', icon: '🏴‍☠️', durationSeconds: 600, rewardType: 'coin_focus', rewards: { coins: 2000, exp: 600, lootTable: [{ equipmentId: 'ml_brigand_blade', chance: 0.12 }, { equipmentId: 'ml_scouts_cloak', chance: 0.10 }, { equipmentId: 'acc_ghost_steps', chance: 0.05 }] }, requiredLevel: 7, category: 'expedition' },
  { id: 'exp_volcano', name: 'Volcanic Foothills', description: 'Collect rare minerals from the volcanic terrain.', icon: '🌋', durationSeconds: 900, rewardType: 'rare_loot', rewards: { coins: 1000, exp: 1000, lootTable: [{ equipmentId: 'ml_volcanic_blade', chance: 0.15 }, { equipmentId: 'ml_ember_ring', chance: 0.20 }, { equipmentId: 'ml_demon_heart', chance: 0.08 }] }, requiredLevel: 9, category: 'expedition' },

  // === RAIDS (15-30 min) — good loot chance ===
  { id: 'raid_bandit', name: 'Bandit Stronghold', description: "Assault the bandit king's fortress. Heavy resistance expected.", icon: '🏰', durationSeconds: 900, rewardType: 'coin_focus', rewards: { coins: 3500, exp: 1000, lootTable: [{ equipmentId: 'ml_brigand_blade', chance: 0.20 }, { equipmentId: 'ml_iron_gauntlets', chance: 0.15 }, { equipmentId: 'ml_volcanic_blade', chance: 0.08 }, { equipmentId: 'ml_dragon_scale', chance: 0.05 }] }, requiredLevel: 5, category: 'raid' },
  { id: 'raid_dragon_nest', name: "Dragon's Nest", description: "Raid a young dragon's hoard. Extreme danger, extreme reward.", icon: '🐉', durationSeconds: 1200, rewardType: 'rare_loot', rewards: { coins: 5000, exp: 2000, lootTable: [{ equipmentId: 'ml_dragon_scale', chance: 0.20 }, { equipmentId: 'ml_volcanic_blade', chance: 0.15 }, { equipmentId: 'ml_demon_heart', chance: 0.12 }, { equipmentId: 'ml_godslayer', chance: 0.03 }] }, requiredLevel: 8, category: 'raid' },
  { id: 'raid_undead', name: 'Undead Citadel', description: "Storm the lich's citadel. Legions of undead await.", icon: '🧟', durationSeconds: 1500, rewardType: 'exp_focus', rewards: { coins: 2000, exp: 5000, lootTable: [{ equipmentId: 'ml_bone_wand', chance: 0.20 }, { equipmentId: 'ml_abyssal_staff', chance: 0.12 }, { equipmentId: 'ml_starweave_robe', chance: 0.08 }, { equipmentId: 'ml_void_orb', chance: 0.03 }] }, requiredLevel: 10, category: 'raid' },
  { id: 'raid_demon', name: 'Demon Gate', description: 'Close a demonic portal before the invasion spreads.', icon: '👹', durationSeconds: 1800, rewardType: 'balanced', rewards: { coins: 4000, exp: 4000, lootTable: [{ equipmentId: 'ml_demon_heart', chance: 0.20 }, { equipmentId: 'ml_phantom_cloak', chance: 0.10 }, { equipmentId: 'ml_eternity_band', chance: 0.04 }] }, requiredLevel: 12, category: 'raid' },
  { id: 'raid_titan', name: "Titan's Fall", description: 'Challenge a sleeping titan. Only the bravest survive.', icon: '🗿', durationSeconds: 1500, rewardType: 'rare_loot', rewards: { coins: 6000, exp: 3000, lootTable: [{ equipmentId: 'ml_titans_belt', chance: 0.25 }, { equipmentId: 'ml_dragon_scale', chance: 0.15 }, { equipmentId: 'ml_aegis_of_dawn', chance: 0.05 }, { equipmentId: 'ml_hammer_of_creation', chance: 0.04 }] }, requiredLevel: 14, category: 'raid' },
  { id: 'raid_shadow', name: 'Shadow Realm Incursion', description: 'Enter the shadow realm and face your darkest fears.', icon: '🌑', durationSeconds: 1200, rewardType: 'talent_point', rewards: { coins: 1500, exp: 1500, talentPoints: 1, lootTable: [{ equipmentId: 'ml_phantom_cloak', chance: 0.15 }, { equipmentId: 'ml_starfall_shard', chance: 0.12 }, { equipmentId: 'ml_shadowstep_boots', chance: 0.04 }] }, requiredLevel: 10, category: 'raid' },

  // === QUESTS (30-60 min) — high loot chance, multiple rolls ===
  { id: 'quest_holy_grail', name: 'The Holy Grail', description: 'Embark on a legendary quest for the Holy Grail.', icon: '🏆', durationSeconds: 2400, rewardType: 'rare_loot', rewards: { coins: 8000, exp: 5000, lootTable: [{ equipmentId: 'ml_divine_chalice', chance: 0.10 }, { equipmentId: 'ml_crown_of_ages', chance: 0.08 }, { equipmentId: 'ml_radiant_mace', chance: 0.15 }, { equipmentId: 'ml_starweave_robe', chance: 0.12 }] }, requiredLevel: 12, category: 'quest' },
  { id: 'quest_kings_errand', name: "King's Errand", description: 'Deliver a secret message across hostile territory.', icon: '👑', durationSeconds: 1800, rewardType: 'coin_focus', rewards: { coins: 12000, exp: 2000, lootTable: [{ equipmentId: 'ml_brigand_blade', chance: 0.20 }, { equipmentId: 'ml_scouts_cloak', chance: 0.15 }, { equipmentId: 'ml_eternity_band', chance: 0.05 }] }, requiredLevel: 8, category: 'quest' },
  { id: 'quest_ancient_tome', name: 'The Ancient Tome', description: "Recover a tome of forbidden knowledge from a wizard's tower.", icon: '📜', durationSeconds: 2100, rewardType: 'exp_focus', rewards: { coins: 3000, exp: 10000, lootTable: [{ equipmentId: 'ml_abyssal_staff', chance: 0.18 }, { equipmentId: 'ml_starweave_robe', chance: 0.12 }, { equipmentId: 'ml_void_orb', chance: 0.06 }] }, requiredLevel: 10, category: 'quest' },
  { id: 'quest_war_council', name: 'War Council', description: 'Unite the five kingdoms against a common threat.', icon: '⚜️', durationSeconds: 3000, rewardType: 'talent_point', rewards: { coins: 5000, exp: 5000, talentPoints: 2, lootTable: [{ equipmentId: 'ml_crown_of_ages', chance: 0.10 }, { equipmentId: 'ml_aegis_of_dawn', chance: 0.06 }, { equipmentId: 'ml_hammer_of_creation', chance: 0.05 }] }, requiredLevel: 15, category: 'quest' },
  { id: 'quest_world_tree', name: 'World Tree Pilgrimage', description: 'Journey to the World Tree and receive its blessing.', icon: '🌳', durationSeconds: 2700, rewardType: 'balanced', rewards: { coins: 7000, exp: 7000, lootTable: [{ equipmentId: 'ml_radiant_mace', chance: 0.15 }, { equipmentId: 'ml_starfall_shard', chance: 0.15 }, { equipmentId: 'ml_divine_chalice', chance: 0.06 }, { equipmentId: 'ml_voidweave_mantle', chance: 0.05 }] }, requiredLevel: 13, category: 'quest' },
  { id: 'quest_starfall', name: 'Starfall Harvest', description: 'Collect fallen star fragments before they fade.', icon: '🌠', durationSeconds: 1800, rewardType: 'rare_loot', rewards: { coins: 4000, exp: 4000, lootTable: [{ equipmentId: 'ml_starfall_shard', chance: 0.25 }, { equipmentId: 'ml_starweave_robe', chance: 0.15 }, { equipmentId: 'ml_celestial_bow', chance: 0.05 }, { equipmentId: 'ml_shadowstep_boots', chance: 0.06 }] }, requiredLevel: 9, category: 'quest' },

  // === DUNGEONS (1-2 hours) — best loot, many rolls ===
  { id: 'dung_abyss', name: 'The Abyss', description: 'Descend into the bottomless abyss. No one has returned... yet.', icon: '🕳️', durationSeconds: 3600, rewardType: 'rare_loot', rewards: { coins: 20000, exp: 15000, lootTable: [{ equipmentId: 'ml_godslayer', chance: 0.10 }, { equipmentId: 'ml_void_orb', chance: 0.12 }, { equipmentId: 'ml_shadowstep_boots', chance: 0.10 }, { equipmentId: 'ml_demon_heart', chance: 0.20 }, { equipmentId: 'ml_eternity_band', chance: 0.08 }] }, requiredLevel: 15, category: 'dungeon' },
  { id: 'dung_crystal', name: 'Crystal Caverns', description: 'Mine the legendary crystal caverns. Riches beyond imagination.', icon: '💎', durationSeconds: 4500, rewardType: 'coin_focus', rewards: { coins: 50000, exp: 8000, lootTable: [{ equipmentId: 'ml_crown_of_ages', chance: 0.12 }, { equipmentId: 'ml_eternity_band', chance: 0.10 }, { equipmentId: 'ml_starfall_shard', chance: 0.25 }, { equipmentId: 'ml_titans_belt', chance: 0.15 }] }, requiredLevel: 16, category: 'dungeon' },
  { id: 'dung_void', name: 'Void Rift', description: 'Seal the void rift before reality unravels.', icon: '🌀', durationSeconds: 5400, rewardType: 'talent_point', rewards: { coins: 15000, exp: 15000, talentPoints: 3, lootTable: [{ equipmentId: 'ml_void_orb', chance: 0.15 }, { equipmentId: 'ml_voidweave_mantle', chance: 0.12 }, { equipmentId: 'ml_abyssal_staff', chance: 0.20 }, { equipmentId: 'ml_eternity_band', chance: 0.10 }] }, requiredLevel: 18, category: 'dungeon' },
  { id: 'dung_god_trial', name: 'Trial of the Gods', description: 'Face the ultimate trial. Only the chosen may pass.', icon: '⚡', durationSeconds: 7200, rewardType: 'rare_loot', rewards: { coins: 30000, exp: 30000, talentPoints: 2, lootTable: [{ equipmentId: 'ml_crown_of_ages', chance: 0.18 }, { equipmentId: 'ml_godslayer', chance: 0.12 }, { equipmentId: 'ml_celestial_bow', chance: 0.12 }, { equipmentId: 'ml_divine_chalice', chance: 0.12 }, { equipmentId: 'ml_aegis_of_dawn', chance: 0.10 }, { equipmentId: 'ml_hammer_of_creation', chance: 0.10 }] }, requiredLevel: 20, category: 'dungeon' },
  { id: 'dung_eternal', name: 'Eternal Labyrinth', description: 'Navigate the ever-shifting labyrinth. Time itself bends.', icon: '🔮', durationSeconds: 5400, rewardType: 'exp_focus', rewards: { coins: 10000, exp: 40000, lootTable: [{ equipmentId: 'ml_void_orb', chance: 0.12 }, { equipmentId: 'ml_phantom_cloak', chance: 0.15 }, { equipmentId: 'ml_starweave_robe', chance: 0.15 }, { equipmentId: 'ml_shadowstep_boots', chance: 0.10 }] }, requiredLevel: 17, category: 'dungeon' },
  { id: 'dung_forge', name: 'Celestial Forge', description: 'Enter the forge of the gods and craft your destiny.', icon: '🔨', durationSeconds: 6000, rewardType: 'rare_loot', rewards: { coins: 25000, exp: 20000, lootTable: [{ equipmentId: 'ml_hammer_of_creation', chance: 0.15 }, { equipmentId: 'ml_aegis_of_dawn', chance: 0.12 }, { equipmentId: 'ml_godslayer', chance: 0.10 }, { equipmentId: 'ml_eternity_band', chance: 0.12 }, { equipmentId: 'ml_crown_of_ages', chance: 0.10 }] }, requiredLevel: 19, category: 'dungeon' },
];
