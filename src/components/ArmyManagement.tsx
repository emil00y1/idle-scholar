'use client';

import React, { useState } from 'react';
import { UnitType, UnitTypeData } from '@/lib/game/types';
import { SPECIALIZATIONS } from '@/lib/game/constants';

interface ArmyManagementProps {
  army: Record<UnitType, UnitTypeData>;
  coins: number;
  onBuyUnit: (type: UnitType) => void;
  getUnitCost: (type: UnitType) => number;
  onPromote: (type: UnitType, specId: string) => void;
}

export const ArmyManagement: React.FC<ArmyManagementProps> = ({ army, coins, onBuyUnit, getUnitCost, onPromote }) => {
  const [promotingType, setPromotingType] = useState<UnitType | null>(null);
  const unitTypes: UnitType[] = ['knight', 'warrior', 'archer', 'mage', 'healer'];

  const getPromotionOptions = (type: UnitType, currentSpecId?: string | null) => {
    // Tier 1 Promotions (Level 10)
    if (!currentSpecId) {
      switch (type) {
        case 'knight': return ['paladin', 'death_knight'];
        case 'warrior': return ['berserker', 'paladin'];
        case 'archer': return ['ranger', 'sharpshooter'];
        case 'mage': return ['archmage'];
        case 'healer': return ['saint', 'inquisitor'];
        default: return [];
      }
    }

    // Tier 2 Promotions (Level 25)
    switch (currentSpecId) {
      case 'paladin': return ['holy_bastion'];
      case 'berserker': return ['blood_reaver'];
      case 'sharpshooter': return ['sniper'];
      case 'archmage': return ['void_weaver'];
      case 'saint': return ['high_priest'];
      default: return [];
    }
  };

  const getIcon = (type: UnitType, specId?: string | null) => {
    if (specId === 'paladin') return '👼';
    if (specId === 'death_knight') return '💀';
    if (specId === 'berserker') return '👺';
    if (specId === 'ranger') return '🏹';
    if (specId === 'sharpshooter') return '🎯';
    if (specId === 'archmage') return '☄️';
    if (specId === 'saint') return '🕊️';
    if (specId === 'inquisitor') return '⚖️';
    
    // Tier 2
    if (specId === 'holy_bastion') return '🏰';
    if (specId === 'blood_reaver') return '🩸';
    if (specId === 'sniper') return '🔭';
    if (specId === 'void_weaver') return '🌀';
    if (specId === 'high_priest') return '🔱';

    switch (type) {
      case 'knight': return '🛡️';
      case 'warrior': return '⚔️';
      case 'archer': return '🏹';
      case 'mage': return '🔮';
      case 'healer': return '✨';
      default: return '👤';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black uppercase italic border-b-2 border-border pb-4">Battalion Barracks</h2>
      <div className="grid gap-4">
        {unitTypes.map((type) => {
          const unit = army[type];
          const cost = getUnitCost(type);
          const canAfford = coins >= cost;
          const spec = unit.specializationId ? SPECIALIZATIONS[unit.specializationId] : null;
          
          // Nested Promotion Logic
          const nextOptions = getPromotionOptions(type, unit.specializationId);
          const requiredLevel = !unit.specializationId ? 10 : 25;
          const canPromote = unit.level >= requiredLevel && nextOptions.length > 0;

          return (
            <div key={type} className={`p-6 border-2 border-border bg-card rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-primary relative overflow-hidden ${canPromote ? 'ring-2 ring-amber-500/50' : ''}`}>
              {canPromote && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest -rotate-0 rounded-bl-lg animate-pulse z-20">
                  Promotion Available
                </div>
              )}
              
              <div className="flex gap-4 items-center">
                <div className="text-4xl bg-muted/20 w-16 h-16 flex items-center justify-center rounded-lg border border-border relative">
                  {getIcon(type, unit.specializationId)}
                  {spec && <span className="absolute -bottom-2 -right-2 text-xs">⭐</span>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xl uppercase italic">{spec ? spec.name : type}</h3>
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
                      LVL {unit.level}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-bold">
                    Battalion Size: <span className="text-foreground">{unit.count}</span>
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-black uppercase text-muted-foreground">
                    <span>HP: {unit.baseStats.hp + (unit.level - 1) * unit.growthStats.hp}</span>
                    <span>ATK: {unit.baseStats.atk + (unit.level - 1) * unit.growthStats.atk}</span>
                    <span>DEF: {unit.baseStats.def + (unit.level - 1) * unit.growthStats.def}</span>
                    <span>SPD: {unit.baseStats.spd + (unit.level - 1) * unit.growthStats.spd}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                <div className="w-full md:w-48 h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${(unit.exp / unit.expToNextLevel) * 100}%` }}
                  />
                </div>
                <div className="flex gap-4 items-center">
                  {canPromote && (
                    <button
                      onClick={() => setPromotingType(type)}
                      className="px-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-all shadow-lg"
                    >
                      Promote
                    </button>
                  )}
                  <button
                    onClick={() => onBuyUnit(type)}
                    disabled={!canAfford}
                    className={`px-6 py-2 rounded-lg font-black uppercase tracking-widest text-xs border-2 transition-all ${
                      canAfford 
                        ? 'bg-primary text-primary-foreground border-primary hover:scale-105 active:scale-95 shadow-lg' 
                        : 'bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Recruit ({cost} ©)
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promotion Modal */}
      {promotingType && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border-4 border-primary p-8 rounded-3xl max-w-2xl w-full shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Class Promotion: {promotingType}</h2>
            <p className="text-sm text-muted-foreground font-bold mb-8 uppercase tracking-widest">Choose a specialized path for your battalion.</p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {getPromotionOptions(promotingType).map(specId => {
                const spec = SPECIALIZATIONS[specId];
                return (
                  <button
                    key={specId}
                    onClick={() => {
                      onPromote(promotingType, specId);
                      setPromotingType(null);
                    }}
                    className="p-6 border-2 border-border rounded-2xl text-left bg-muted/20 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{getIcon(promotingType, specId)}</div>
                    <div className="font-black text-xl uppercase italic mb-1">{spec.name}</div>
                    <p className="text-xs text-muted-foreground font-bold mb-4 leading-relaxed">{spec.description}</p>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black uppercase text-primary">Initial Bonuses:</div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {Object.entries(spec.statBonus).filter(([_, v]) => v !== 0).map(([k, v]) => (
                          <span key={k} className="text-[9px] font-black">+{v} {k}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPromotingType(null)}
              className="mt-8 w-full py-3 text-xs font-black uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
