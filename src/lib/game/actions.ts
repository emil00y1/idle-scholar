'use server';

import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { GameState } from './types';

export async function getGameData() {
  const [
    classes,
    abilities,
    equipment,
    levels,
    missions,
    artifacts,
    achievements,
    consumables,
    shopItems,
  ] = await Promise.all([
    db.select().from(schema.game_classes),
    db.select().from(schema.game_abilities),
    db.select().from(schema.game_equipment),
    db.select().from(schema.game_levels),
    db.select().from(schema.game_missions),
    db.select().from(schema.game_artifacts),
    db.select().from(schema.game_achievements),
    db.select().from(schema.game_consumables),
    db.select().from(schema.game_shop_items),
  ]);

  return {
    classes,
    abilities,
    equipment,
    levels,
    missions,
    artifacts,
    achievements,
    consumables,
    shopItems,
  };
}

export async function savePlayerState(playerId: string, state: GameState) {
  await db.insert(schema.players).values({
    id: playerId,
    state: state,
    lastUpdate: new Date(),
  }).onConflictDoUpdate({
    target: schema.players.id,
    set: {
      state: state,
      lastUpdate: new Date(),
    }
  });
}

export async function loadPlayerState(playerId: string) {
  const result = await db.select().from(schema.players).where(eq(schema.players.id, playerId));
  return result[0]?.state as GameState | undefined;
}
