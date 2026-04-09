'use client';

import { useState, useEffect } from 'react';
import { useGameLoop } from '@/lib/game/useGameLoop';
import { ClassSelection } from '@/components/ClassSelection';
import { HeroPanel } from '@/components/HeroPanel';
import { CombatView } from '@/components/CombatView';
import { LevelSelection } from '@/components/LevelSelection';
import { TalentTree } from '@/components/TalentTree';
import { CharacterPanel } from '@/components/CharacterPanel';
import { Missions } from '@/components/Missions';
import { Shop } from '@/components/Shop';

export default function Home() {
  const {
    state, isInitialized, heroStats,
    CLASS_INFO, ACHIEVEMENTS, ARTIFACTS, MISSIONS, LEVELS, ABILITY_DATABASE,
    SHOP_ITEMS, EQUIPMENT_DATABASE, CONSUMABLES, TALENT_TREES,
    selectClass, allocateTalent, trainStat, getTrainingQuote,
    equipItem, sellItem, sellItemsByRarity, sellAllInventory, toggleItemLock, toggleItemFavorite, toggleAutoEquipUpgrades,
    unlockArtifact, toggleArtifactEquip, updateCombatAutomation,
    startMission, collectMission, cancelMission, buyItem, buyConsumable,
    startCombat, processCombatTick, useAbility, useConsumable, collectRewards, endCombat, hardReset,
  } = useGameLoop();

  const [activeTab, setActiveTab] = useState<'map' | 'shop' | 'missions' | 'hero' | 'character' | 'talents' | 'library'>('map');

  useEffect(() => {
    const tabs: ('map' | 'shop' | 'missions' | 'hero' | 'character' | 'talents' | 'library')[] = ['map', 'shop', 'missions', 'hero', 'character', 'talents', 'library'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (state.combat.isActive) return;
      if (e.defaultPrevented) return;

      const currentIndex = tabs.indexOf(activeTab);
      
      if (e.key.toLowerCase() === 'a') {
        const nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[nextIndex]);
      } else if (e.key.toLowerCase() === 'd') {
        const nextIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, state.combat.isActive]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Qi';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Qa';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  if (!isInitialized) return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-black uppercase tracking-[0.5em] animate-pulse">Initializing...</div>;

  // Class selection screen
  if (!state.heroClass) {
    return (
      <main className="min-h-screen font-sans selection:bg-primary selection:text-primary-foreground bg-background text-foreground">
        <ClassSelection onSelect={selectClass} classInfo={CLASS_INFO} />
      </main>
    );
  }

  const info = CLASS_INFO[state.heroClass];

  return (
    <main className="min-h-screen font-sans selection:bg-primary selection:text-primary-foreground bg-background text-foreground">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card border-b-2 border-border shadow-md px-4 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tighter uppercase text-card-foreground flex items-center gap-2">
              <span className="text-primary">{info.icon}</span> IDLE SCHOLAR <span className="text-[10px] text-muted-foreground ml-1 font-bold">v2.0</span>
            </h1>
          </div>

          <div className="flex items-center gap-6 md:gap-12 flex-1 justify-center md:justify-end">
            <div className="text-center md:text-right">
              <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Treasury</div>
              <div className="text-2xl font-black text-primary flex items-center gap-1 justify-center md:justify-end">
                {formatNumber(state.coins)} <span className="text-sm opacity-50">©</span>
              </div>
            </div>
            <div className="text-center md:text-right border-l-2 border-border pl-6 md:pl-12">
              <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Hero Level</div>
              <div className="text-xl font-black text-emerald-500 leading-tight">
                {state.heroLevel} <span className="text-xs opacity-70 italic font-medium uppercase">{info.name}</span>
              </div>
              <div className="mt-1 h-1 w-24 ml-auto bg-muted rounded-full overflow-hidden border border-border/50">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${(state.heroExp / state.heroExpToNext) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-center md:text-right border-l-2 border-border pl-6 md:pl-12">
              <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Talent Pts</div>
              <div className="text-xl font-black text-purple-500">{state.talentPoints}</div>
            </div>
            <div className="text-center md:text-right border-l-2 border-border pl-6 md:pl-12">
              <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Shards</div>
              <div className="text-xl font-black text-fuchsia-500">{formatNumber(state.artifactShards)}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto p-2 md:p-4">
        {state.combat.isActive ? (
          <CombatView
            combat={state.combat}
            autoRepeatEnabled={state.combatAutomation.autoRepeat}
            stopOnInventoryFull={state.combatAutomation.stopOnInventoryFull}
            inventoryCount={state.inventory.length}
            inventoryLimit={state.inventoryLimit}
            onProcessTick={processCombatTick}
            onUseAbility={useAbility}
            onUseConsumable={useConsumable}
            onCollectRewards={collectRewards}
            onEndCombat={endCombat}
            onToggleAutoRepeat={() => updateCombatAutomation({ autoRepeat: !state.combatAutomation.autoRepeat })}
            onToggleStopOnInventoryFull={() => updateCombatAutomation({ stopOnInventoryFull: !state.combatAutomation.stopOnInventoryFull })}
            consumables={CONSUMABLES}
          />
        ) : (
          <div className="grid lg:grid-cols-[1fr_340px] gap-4 md:gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              <nav className="flex flex-wrap gap-2 border-b-2 border-border pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {[
                  { id: 'map', label: 'War Map', icon: '🗺️' },
                  { id: 'shop', label: 'Shop', icon: '💰' },
                  { id: 'missions', label: 'Missions', icon: '📋' },
                  { id: 'hero', label: 'Training', icon: '⛺' },
                  { id: 'character', label: 'Character', icon: '🛡️' },
                  { id: 'talents', label: 'Talents', icon: '🌳' },
                  { id: 'library', label: 'Records', icon: '🏆' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-6 py-2 font-black text-[10px] uppercase tracking-widest transition-all rounded-sm border-2 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                        : 'text-muted-foreground hover:text-foreground border-transparent'
                    }`}
                  >
                    <span>{tab.icon}</span> {tab.label}
                    {tab.id === 'missions' && state.activeMissions.filter(m => m.endsAt <= Date.now()).length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </button>
                ))}
              </nav>

              <div className="min-h-[600px]">
                {activeTab === 'map' && (
                  <LevelSelection
                    unlockedLevels={state.unlockedLevels}
                    completedLevels={state.completedLevels}
                    autoRepeatEnabled={state.combatAutomation.autoRepeat}
                    stopOnInventoryFull={state.combatAutomation.stopOnInventoryFull}
                    inventoryCount={state.inventory.length}
                    inventoryLimit={state.inventoryLimit}
                    onStartCombat={startCombat}
                    onToggleAutoRepeat={() => updateCombatAutomation({ autoRepeat: !state.combatAutomation.autoRepeat })}
                    onToggleStopOnInventoryFull={() => updateCombatAutomation({ stopOnInventoryFull: !state.combatAutomation.stopOnInventoryFull })}
                    levels={LEVELS}
                  />
                )}
                {activeTab === 'shop' && (
                  <Shop 
                    state={state} 
                    onBuyItem={buyItem} 
                    onBuyConsumable={buyConsumable} 
                    shopItems={SHOP_ITEMS}
                    equipmentDatabase={EQUIPMENT_DATABASE}
                    consumables={CONSUMABLES}
                  />
                )}
                {activeTab === 'missions' && (
                  <Missions
                    state={state}
                    onStartMission={startMission}
                    onCollectMission={collectMission}
                    onCancelMission={cancelMission}
                    missions={MISSIONS}
                  />
                )}
                {activeTab === 'hero' && heroStats && (
                  <HeroPanel
                    state={state}
                    heroStats={heroStats}
                    onTrainStat={trainStat}
                    getTrainingQuote={getTrainingQuote}
                    classInfo={CLASS_INFO}
                  />
                )}
                {activeTab === 'character' && heroStats && (
                  <CharacterPanel
                    state={state}
                    heroStats={heroStats}
                    onEquip={equipItem}
                    onSell={sellItem}
                    onSellByRarity={sellItemsByRarity}
                    onSellAll={sellAllInventory}
                    onToggleLock={toggleItemLock}
                    onToggleFavorite={toggleItemFavorite}
                    onToggleAutoEquipUpgrades={toggleAutoEquipUpgrades}
                    onUnlockArtifact={unlockArtifact}
                    onToggleArtifactEquip={toggleArtifactEquip}
                    classInfo={CLASS_INFO}
                    artifactDatabase={ARTIFACTS}
                    abilityDatabase={ABILITY_DATABASE}
                  />
                )}
                {activeTab === 'talents' && (
                  <div className="-mx-2 md:-mx-4">
                    <TalentTree state={state} onAllocate={allocateTalent} talentTrees={TALENT_TREES} />
                  </div>
                )}
                {activeTab === 'library' && (
                  <div className="space-y-8 bg-card border-2 border-border p-8 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-black uppercase italic border-b-2 border-border pb-4">War Records</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 border-2 border-border rounded-lg bg-muted/20">
                        <div className="text-[9px] font-black uppercase text-muted-foreground mb-1">Campaign Time</div>
                        <div className="text-lg font-black">{formatTime(state.stats.totalPlayTime)}</div>
                      </div>
                      <div className="p-4 border-2 border-border rounded-lg bg-muted/20">
                        <div className="text-[9px] font-black uppercase text-muted-foreground mb-1">Lifetime Loot</div>
                        <div className="text-lg font-black text-primary">{formatNumber(state.totalCoinsEarned)}</div>
                      </div>
                      <div className="p-4 border-2 border-border rounded-lg bg-muted/20">
                        <div className="text-[9px] font-black uppercase text-muted-foreground mb-1">Enemies Slain</div>
                        <div className="text-lg font-black text-destructive">{state.stats.totalEnemiesDefeated}</div>
                      </div>
                      <div className="p-4 border-2 border-border rounded-lg bg-muted/20">
                        <div className="text-[9px] font-black uppercase text-muted-foreground mb-1">Regions Cleared</div>
                        <div className="text-lg font-black text-emerald-500">{state.completedLevels.length}</div>
                      </div>
                    </div>

                    {state.artifactsOwned.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground">Ancient Relics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {state.artifactsOwned.map(id => {
                            const art = ARTIFACTS.find(a => a.id === id);
                            return (
                              <div key={id} className="p-4 border-2 border-border rounded-lg bg-muted/20">
                                <div className="font-black text-sm uppercase mb-1">{art?.name}</div>
                                <p className="text-xs text-muted-foreground font-bold italic">{art?.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              {/* Hero Summary */}
              <section className="bg-card border-2 border-border p-6 rounded-2xl shadow-sm">
                <h2 className="font-black text-card-foreground uppercase tracking-widest text-[10px] italic mb-4 border-b border-border pb-2">Hero Status</h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{info.icon}</span>
                  <div>
                    <div className="font-black uppercase italic">{info.name}</div>
                    <div className="text-[10px] text-primary font-black">Level {state.heroLevel}</div>
                  </div>
                </div>

                {heroStats && (
                  <div className="space-y-2">
                    {[
                      { label: 'HP',   color: 'bg-emerald-500', barPct: Math.min(100, heroStats.hp / 10),    display: heroStats.hp.toString() },
                      { label: 'ATK',  color: 'bg-red-500',     barPct: Math.min(100, heroStats.atk / 5),   display: heroStats.atk.toString() },
                      { label: 'MATK', color: 'bg-orange-500',  barPct: Math.min(100, heroStats.matk / 5),  display: heroStats.matk.toString() },
                      { label: 'DEF',  color: 'bg-blue-500',    barPct: Math.min(100, heroStats.def / 5),   display: heroStats.def.toString() },
                      { label: 'MDEF', color: 'bg-cyan-500',    barPct: Math.min(100, heroStats.mdef / 5),  display: heroStats.mdef.toString() },
                      { label: 'SPD',  color: 'bg-amber-500',   barPct: Math.min(100, heroStats.spd / 3),   display: heroStats.spd.toString() },
                      { label: 'EVA',  color: 'bg-purple-500',  barPct: Math.min(100, heroStats.eva * 100), display: (heroStats.eva * 100).toFixed(1) + '%' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-muted-foreground w-8">{s.label}</span>
                        <div className="flex-1 mx-2 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.barPct}%` }} />
                        </div>
                        <span className="text-xs font-black w-14 text-right">{s.display}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* XP */}
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground mb-1">
                    <span>EXP</span>
                    <span>{state.heroExp} / {state.heroExpToNext}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all" style={{ width: `${(state.heroExp / state.heroExpToNext) * 100}%` }} />
                  </div>
                </div>
              </section>

              {/* Achievements */}
              <section className="bg-card border-2 border-border p-6 rounded-2xl shadow-sm">
                <h2 className="font-black text-card-foreground mb-6 uppercase tracking-widest text-[10px] italic border-b-2 border-border pb-3">Achievements</h2>
                <div className="grid grid-cols-4 gap-3">
                  {ACHIEVEMENTS.map(ach => {
                    const earned = state.earnedAchievements.includes(ach.id);
                    const rewardLabel = [
                      ach.rewards?.coins ? `${formatNumber(ach.rewards.coins)}c` : null,
                      ach.rewards?.talentPoints ? `${ach.rewards.talentPoints} TP` : null,
                      ach.rewards?.artifactShards ? `${ach.rewards.artifactShards} Shards` : null,
                    ].filter(Boolean).join(' / ');

                    return (
                      <div
                        key={ach.id}
                        title={`${ach.name}: ${ach.description}${rewardLabel ? ` Reward: ${rewardLabel}` : ''}`}
                        className={`aspect-square border-2 border-border rounded-lg flex items-center justify-center text-xl bg-muted/20 ${earned ? '' : 'opacity-30 grayscale'}`}
                      >
                        {ach.icon}
                      </div>
                    );
                  })}
                </div>
              </section>

              <button
                onClick={hardReset}
                className="w-full py-3 text-[10px] font-black text-muted-foreground hover:text-destructive transition-colors uppercase border-2 border-border hover:border-destructive/30 rounded-xl tracking-widest bg-muted/10"
              >
                Reset Progress
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
