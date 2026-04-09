import { pgTable as pgCoreTable, text as pgText, integer as pgInteger, jsonb as pgJsonb, timestamp as pgTimestamp, doublePrecision as pgDouble, boolean as pgBoolean } from 'drizzle-orm/pg-core';

// Player state and progress
export const players = pgCoreTable('players', {
  id: pgText('id').primaryKey(),
  state: pgJsonb('state').notNull(),
  lastUpdate: pgTimestamp('last_update').defaultNow(),
});

// Game Content (Relational but with JSONB for complex nested objects to keep it simple)
export const game_classes = pgCoreTable('game_classes', {
  id: pgText('id').primaryKey(), // knight, warrior, etc.
  name: pgText('name').notNull(),
  title: pgText('title'),
  icon: pgText('icon'),
  description: pgText('description'),
  baseStats: pgJsonb('base_stats').notNull(),
  growthStats: pgJsonb('growth_stats').notNull(),
});

export const game_abilities = pgCoreTable('game_abilities', {
  id: pgText('id').primaryKey(),
  name: pgText('name').notNull(),
  description: pgText('description'),
  icon: pgText('icon'),
  slot: pgText('slot').notNull(), // 1, 2, 3, 4, 5, F
  unlockLevel: pgInteger('unlock_level').notNull(),
  target: pgText('target').notNull(), // single, aoe, self
  cooldownTicks: pgInteger('cooldown_ticks').notNull(),
});

export const game_equipment = pgCoreTable('game_equipment', {
  id: pgText('id').primaryKey(),
  name: pgText('name').notNull(),
  description: pgText('description'),
  slot: pgText('slot').notNull(), // weapon, armor, helmet, gloves, boots, accessory
  rarity: pgText('rarity').notNull(), // Common, Rare, Epic, Relic, Legendary, Godlike
  stats: pgJsonb('stats').notNull(),
  icon: pgText('icon'),
  allowedUnits: pgJsonb('allowed_units'), // Array of class IDs
});

export const game_levels = pgCoreTable('game_levels', {
  id: pgText('id').primaryKey(),
  name: pgText('name').notNull(),
  description: pgText('description'),
  difficulty: pgInteger('difficulty').notNull(),
  rewardCoins: pgInteger('reward_coins').notNull(),
  rewardExp: pgInteger('reward_exp').notNull(),
  enemies: pgJsonb('enemies').notNull(), // Array of enemy definitions
  lootTable: pgJsonb('loot_table'), // Array of { equipmentId, chance }
  requiredLevelId: pgText('required_level_id'), // Pre-requisite level
});

export const game_missions = pgCoreTable('game_missions', {
  id: pgText('id').primaryKey(),
  name: pgText('name').notNull(),
  description: pgText('description'),
  icon: pgText('icon'),
  durationSeconds: pgInteger('duration_seconds').notNull(),
  rewardType: pgText('reward_type').notNull(),
  rewards: pgJsonb('rewards').notNull(),
  requiredLevel: pgInteger('required_level').notNull(),
  category: pgText('category').notNull(),
});

export const game_artifacts = pgCoreTable('game_artifacts', {
  id: pgText('id').primaryKey(),
  name: pgText('name').notNull(),
  description: pgText('description'),
  rarity: pgText('rarity').notNull(),
  costShards: pgInteger('cost_shards').notNull(),
});

export const game_achievements = pgCoreTable('game_achievements', {
  id: pgText('id').primaryKey(),
  icon: pgText('icon'),
  name: pgText('name').notNull(),
  description: pgText('description'),
  requirement: pgJsonb('requirement').notNull(),
  rewards: pgJsonb('rewards').notNull(),
});

export const game_consumables = pgCoreTable('game_consumables', {
  id: pgText('id').primaryKey(),
  name: pgText('name').notNull(),
  description: pgText('description'),
  icon: pgText('icon'),
  price: pgInteger('price').notNull(),
  effect: pgJsonb('effect').notNull(),
});

export const game_shop_items = pgCoreTable('game_shop_items', {
  id: pgInteger('id').primaryKey().generatedAlwaysAsIdentity(),
  equipmentId: pgText('equipment_id').notNull(),
  price: pgInteger('price').notNull(),
});
