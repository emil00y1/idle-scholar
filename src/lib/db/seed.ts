import { db } from './index';
import * as schema from './schema';
import { 
  CLASS_INFO, ABILITY_DATABASE, EQUIPMENT_DATABASE, 
  LEVELS, MISSIONS, ARTIFACTS, ACHIEVEMENTS, 
  CONSUMABLES, SHOP_ITEMS 
} from '../game/constants';

async function seed() {
  console.log('Seeding database...');

  // Seed classes
  console.log('Seeding classes...');
  for (const [id, info] of Object.entries(CLASS_INFO)) {
    await db.insert(schema.game_classes).values({
      id: id,
      name: info.name,
      title: info.title,
      icon: info.icon,
      description: info.description,
      baseStats: info.baseStats,
      growthStats: info.growthStats,
    }).onConflictDoUpdate({
      target: schema.game_classes.id,
      set: {
        name: info.name,
        title: info.title,
        icon: info.icon,
        description: info.description,
        baseStats: info.baseStats,
        growthStats: info.growthStats,
      }
    });
  }

  // Seed abilities
  console.log('Seeding abilities...');
  for (const [id, ability] of Object.entries(ABILITY_DATABASE)) {
    await db.insert(schema.game_abilities).values({
      id: id,
      name: ability.name,
      description: ability.description,
      icon: ability.icon,
      slot: ability.slot.toString(),
      unlockLevel: ability.unlockLevel,
      target: ability.target,
      cooldownTicks: ability.cooldownTicks,
    }).onConflictDoUpdate({
      target: schema.game_abilities.id,
      set: {
        name: ability.name,
        description: ability.description,
        icon: ability.icon,
        slot: ability.slot.toString(),
        unlockLevel: ability.unlockLevel,
        target: ability.target,
        cooldownTicks: ability.cooldownTicks,
      }
    });
  }

  // Seed equipment
  console.log('Seeding equipment...');
  for (const item of EQUIPMENT_DATABASE) {
    await db.insert(schema.game_equipment).values({
      id: item.id,
      name: item.name,
      description: item.description,
      slot: item.slot,
      rarity: item.rarity,
      stats: item.stats,
      icon: item.icon,
      allowedUnits: item.allowedUnits,
    }).onConflictDoUpdate({
      target: schema.game_equipment.id,
      set: {
        name: item.name,
        description: item.description,
        slot: item.slot,
        rarity: item.rarity,
        stats: item.stats,
        icon: item.icon,
        allowedUnits: item.allowedUnits,
      }
    });
  }

  // Seed levels
  console.log('Seeding levels...');
  for (const level of LEVELS) {
    await db.insert(schema.game_levels).values({
      id: level.id,
      name: level.name,
      description: level.description,
      difficulty: level.difficulty,
      rewardCoins: level.rewardCoins,
      rewardExp: level.rewardExp,
      enemies: level.enemies,
      lootTable: level.lootTable,
      requiredLevelId: level.requiredLevelId,
    }).onConflictDoUpdate({
      target: schema.game_levels.id,
      set: {
        name: level.name,
        description: level.description,
        difficulty: level.difficulty,
        rewardCoins: level.rewardCoins,
        rewardExp: level.rewardExp,
        enemies: level.enemies,
        lootTable: level.lootTable,
        requiredLevelId: level.requiredLevelId,
      }
    });
  }

  // Seed missions
  console.log('Seeding missions...');
  for (const mission of MISSIONS) {
    await db.insert(schema.game_missions).values({
      id: mission.id,
      name: mission.name,
      description: mission.description,
      icon: mission.icon,
      durationSeconds: mission.durationSeconds,
      rewardType: mission.rewardType,
      rewards: mission.rewards,
      requiredLevel: mission.requiredLevel,
      category: mission.category,
    }).onConflictDoUpdate({
      target: schema.game_missions.id,
      set: {
        name: mission.name,
        description: mission.description,
        icon: mission.icon,
        durationSeconds: mission.durationSeconds,
        rewardType: mission.rewardType,
        rewards: mission.rewards,
        requiredLevel: mission.requiredLevel,
        category: mission.category,
      }
    });
  }

  // Seed artifacts
  console.log('Seeding artifacts...');
  for (const art of ARTIFACTS) {
    await db.insert(schema.game_artifacts).values({
      id: art.id,
      name: art.name,
      description: art.description,
      rarity: art.rarity,
      costShards: art.costShards,
    }).onConflictDoUpdate({
      target: schema.game_artifacts.id,
      set: {
        name: art.name,
        description: art.description,
        rarity: art.rarity,
        costShards: art.costShards,
      }
    });
  }

  // Seed achievements
  console.log('Seeding achievements...');
  for (const ach of ACHIEVEMENTS) {
    await db.insert(schema.game_achievements).values({
      id: ach.id,
      icon: ach.icon,
      name: ach.name,
      description: ach.description,
      requirement: ach.requirement,
      rewards: ach.rewards,
    }).onConflictDoUpdate({
      target: schema.game_achievements.id,
      set: {
        icon: ach.icon,
        name: ach.name,
        description: ach.description,
        requirement: ach.requirement,
        rewards: ach.rewards,
      }
    });
  }

  // Seed consumables
  console.log('Seeding consumables...');
  for (const cons of CONSUMABLES) {
    await db.insert(schema.game_consumables).values({
      id: cons.id,
      name: cons.name,
      description: cons.description,
      icon: cons.icon,
      price: cons.price,
      effect: cons.effect,
    }).onConflictDoUpdate({
      target: schema.game_consumables.id,
      set: {
        name: cons.name,
        description: cons.description,
        icon: cons.icon,
        price: cons.price,
        effect: cons.effect,
      }
    });
  }

  // Seed shop items
  console.log('Seeding shop items...');
  // Clear shop items first as they are generated identity
  await db.delete(schema.game_shop_items);
  for (const item of SHOP_ITEMS) {
    await db.insert(schema.game_shop_items).values({
      equipmentId: item.equipmentId,
      price: item.price,
    });
  }

  console.log('Seeding completed!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
