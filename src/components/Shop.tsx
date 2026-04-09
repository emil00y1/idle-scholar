'use client';

import React, { useState, useEffect } from 'react';
import { SHOP_ITEMS, EQUIPMENT_DATABASE, CONSUMABLES } from '@/lib/game/constants';
import { GameState, Equipment, Consumable } from '@/lib/game/types';
import { useSelectionScroll } from '@/lib/game/useSelectionScroll';

type ShopItem = {
  equipmentId: string;
  price: number;
};

interface ShopProps {
  state: GameState;
  onBuyItem: (equipmentId: string, price: number) => void;
  onBuyConsumable: (consumableId: string) => void;
  shopItems: ShopItem[];
  equipmentDatabase: Equipment[];
  consumables: Consumable[];
}

export const Shop: React.FC<ShopProps> = ({ state, onBuyItem, onBuyConsumable, shopItems, equipmentDatabase, consumables }) => {
  const [activeShopTab, setActiveShopTab] = useState<'armory' | 'consumables'>('armory');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [purchaseAnimationId, setPurchaseAnimationId] = useState<string | null>(null);

  const rarityWeights: Record<string, number> = {
    'Godlike': 6,
    'Legendary': 5,
    'Relic': 4,
    'Epic': 3,
    'Rare': 2,
    'Common': 1,
  };

  const armoryItems = (shopItems || []).map(item => {
    const base = (equipmentDatabase || []).find(e => e.id === item.equipmentId);
    return { ...item, equipment: base };
  }).filter(entry => {
    if (!entry.equipment) return false;
    // Only show items usable by the current class
    if (state.heroClass && entry.equipment.allowedUnits && !entry.equipment.allowedUnits.includes(state.heroClass)) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const weightA = rarityWeights[a.equipment?.rarity || 'Common'];
    const weightB = rarityWeights[b.equipment?.rarity || 'Common'];
    if (weightA !== weightB) return weightB - weightA;
    return a.price - b.price;
  }) as { equipmentId: string; price: number; equipment: Equipment }[];

  const currentItems = activeShopTab === 'armory' ? armoryItems : (consumables || []);
  const registerSelectionTarget = useSelectionScroll<HTMLDivElement>(selectedIndex, [currentItems.length, activeShopTab]);

  const handleBuy = (id: string, price: number, isEquipment: boolean) => {
    if (isEquipment) {
      onBuyItem(id, price);
    } else {
      onBuyConsumable(id);
    }
    setPurchaseAnimationId(id);
    setTimeout(() => setPurchaseAnimationId(null), 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setActiveShopTab('armory');
        setSelectedIndex(0);
      } else if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setActiveShopTab('consumables');
        setSelectedIndex(0);
      } else if (e.key.toLowerCase() === 'w') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(currentItems.length - 1, prev + 1));
      } else if (e.code === 'Space') {
        e.preventDefault();
        const item = currentItems[selectedIndex];
        if (item) {
          if ('equipment' in item) {
            if (state.coins >= item.price && state.inventory.length < state.inventoryLimit) {
              handleBuy(item.equipmentId, item.price, true);
            }
          } else {
            if (state.coins >= item.price) {
              handleBuy(item.id, item.price, false);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, activeShopTab, currentItems, state.coins, state.inventory.length, state.inventoryLimit, onBuyItem, onBuyConsumable]);

  const formatNumber = (num: number) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b-2 border-border pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase italic">Royal Armory</h2>
          <p className="mt-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Legendary gear and powerful potions. (A/D: Tabs, W/S: Navigate, Space: Buy)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveShopTab('armory'); setSelectedIndex(0); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 transition-all ${
              activeShopTab === 'armory' ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-muted/20 text-muted-foreground'
            }`}
          >
            Armory
          </button>
          <button
            onClick={() => { setActiveShopTab('consumables'); setSelectedIndex(0); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 transition-all ${
              activeShopTab === 'consumables' ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-muted/20 text-muted-foreground'
            }`}
          >
            Consumables
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {currentItems.map((item, index) => {
          const isSelected = index === selectedIndex;
          const canAfford = state.coins >= item.price;
          const equipment = 'equipment' in item ? item.equipment : null;
          const baseItem: Equipment | Consumable = equipment ?? (item as Consumable);
          const equipmentId = 'equipment' in item ? item.equipmentId : null;
          const isEquipment = Boolean(equipment);
          const inventoryFull = isEquipment && state.inventory.length >= state.inventoryLimit;

          return (
            <div
              key={`${baseItem.id}-${index}`}
              ref={registerSelectionTarget(index)}
              className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all relative overflow-hidden ${
                isSelected ? 'border-primary ring-2 ring-primary/20 scale-[1.01] bg-card' : 'border-border bg-card hover:border-primary/30'
              } ${purchaseAnimationId === baseItem.id ? 'animate-purchase-pop z-10' : ''}`}
            >
              {purchaseAnimationId === baseItem.id && (
                <div className="absolute inset-0 bg-primary/20 animate-purchase-flash pointer-events-none" />
              )}
              <div className="flex items-center gap-4 relative z-0">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-2xl ${
                  !equipment ? 'border-emerald-500/50 bg-emerald-500/10' :
                  equipment.rarity === 'Godlike' ? 'border-fuchsia-500 bg-fuchsia-500/10' :
                  equipment.rarity === 'Legendary' ? 'border-orange-500 bg-orange-500/10' :
                  equipment.rarity === 'Epic' ? 'border-purple-500 bg-purple-500/10' :
                  equipment.rarity === 'Rare' ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-muted/20'
                }`}>
                  {baseItem.icon}
                </div>
                <div>
                  <div className={`text-sm font-black uppercase italic ${
                    !equipment ? 'text-emerald-400' :
                    equipment.rarity === 'Godlike' ? 'text-fuchsia-400' :
                    equipment.rarity === 'Legendary' ? 'text-orange-400' :
                    equipment.rarity === 'Epic' ? 'text-purple-400' :
                    equipment.rarity === 'Rare' ? 'text-blue-400' : 'text-foreground'
                  }`}>{baseItem.name}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">
                    {equipment ? `${equipment.rarity} ${equipment.slot}` : 'Consumable'}
                  </div>
                  <div className="mt-1 flex gap-2 text-[9px] font-black uppercase">
                    {equipment ? (
                      <>
                        {(equipment.stats.atk ?? 0) > 0 && <span className="text-red-400">ATK +{equipment.stats.atk}</span>}
                        {(equipment.stats.matk ?? 0) > 0 && <span className="text-orange-400">MATK +{equipment.stats.matk}</span>}
                        {(equipment.stats.hp ?? 0) > 0 && <span className="text-emerald-400">HP +{equipment.stats.hp}</span>}
                        {(equipment.stats.def ?? 0) > 0 && <span className="text-blue-400">DEF +{equipment.stats.def}</span>}
                        {(equipment.stats.spd ?? 0) > 0 && <span className="text-amber-400">SPD +{equipment.stats.spd}</span>}
                        {equipment.stats.eva !== undefined && equipment.stats.eva > 0 && <span className="text-purple-400">EVA +{(equipment.stats.eva * 100).toFixed(0)}%</span>}
                        {equipment.stats.critChance !== undefined && equipment.stats.critChance > 0 && <span className="text-red-400">CRIT +{(equipment.stats.critChance * 100).toFixed(0)}%</span>}
                      </>
                    ) : (
                      <span className="text-muted-foreground normal-case italic">{baseItem.description}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => equipment && equipmentId ? onBuyItem(equipmentId, item.price) : onBuyConsumable(baseItem.id)}
                disabled={!canAfford || inventoryFull}
                className={`rounded-lg border-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  canAfford && !inventoryFull
                    ? isSelected ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-md' : 'border-primary bg-primary text-primary-foreground hover:scale-105 active:scale-95'
                    : 'cursor-not-allowed border-border bg-muted text-muted-foreground opacity-50'
                }`}
              >
                {inventoryFull ? 'Inventory Full' : `${formatNumber(item.price)} coins`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
