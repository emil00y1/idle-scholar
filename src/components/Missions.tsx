'use client';

import { useState, useEffect } from 'react';
import { GameState } from '@/lib/game/types';
import { Mission } from '@/lib/game/types';
import { MISSIONS, scaleMissionRewards } from '@/lib/game/constants';
import { useSelectionScroll } from '@/lib/game/useSelectionScroll';

interface MissionsProps {
  state: GameState;
  onStartMission: (missionId: string) => void;
  onCollectMission: (missionId: string) => void;
  onCancelMission: (missionId: string) => void;
  missions: Mission[];
}

const CATEGORY_INFO = {
  patrol: { label: 'Patrols', icon: '🏘️', color: 'text-emerald-400', desc: '1-5 min' },
  expedition: { label: 'Expeditions', icon: '🧭', color: 'text-blue-400', desc: '5-15 min' },
  raid: { label: 'Raids', icon: '⚔️', color: 'text-orange-400', desc: '15-30 min' },
  quest: { label: 'Quests', icon: '📜', color: 'text-purple-400', desc: '30-60 min' },
  dungeon: { label: 'Dungeons', icon: '🕳️', color: 'text-red-400', desc: '1-2 hours' },
} as const;

const REWARD_BADGES: Record<string, { label: string; color: string }> = {
  exp_focus: { label: 'EXP', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  coin_focus: { label: 'COINS', color: 'bg-primary/20 text-primary border-primary/30' },
  balanced: { label: 'BALANCED', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  rare_loot: { label: 'LOOT', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  talent_point: { label: 'TALENT', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  artifact_shard: { label: 'ARTIFACT', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
};

function formatDuration(seconds: number) {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  return `${seconds}s`;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return 'READY!';
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatNumber(num: number) {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function Missions({ state, onStartMission, onCollectMission, onCancelMission, missions }: MissionsProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORY_INFO>('patrol');
  const [selectedSection, setSelectedSection] = useState<'active' | 'board'>(state.activeMissions.length > 0 ? 'active' : 'board');
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const [selectedActiveIndex, setSelectedActiveIndex] = useState(0);
  const [now, setNow] = useState(Date.now());

  const categories = Object.keys(CATEGORY_INFO) as (keyof typeof CATEGORY_INFO)[];
  const currentMissions = (missions || []).filter(m => m.category === activeCategory);

  // Active missions with completion status
  const activeMissionsData = state.activeMissions.map(am => {
    const mission = (missions || []).find(m => m.id === am.missionId)!;
    const remaining = am.endsAt - now;
    const elapsed = now - am.startedAt;
    const total = am.endsAt - am.startedAt;
    const progress = Math.min(1, elapsed / total);
    const isComplete = remaining <= 0;
    return { ...am, mission, remaining, progress, isComplete };
  });

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key.toLowerCase() === 'a') {
        if (selectedSection === 'board') {
          e.preventDefault();
          e.stopImmediatePropagation();
          const currentIndex = categories.indexOf(activeCategory);
          const nextIndex = (currentIndex - 1 + categories.length) % categories.length;
          setActiveCategory(categories[nextIndex]);
          setSelectedMissionIndex(0);
        }
      } else if (e.key.toLowerCase() === 'd') {
        if (selectedSection === 'board') {
          e.preventDefault();
          e.stopImmediatePropagation();
          const currentIndex = categories.indexOf(activeCategory);
          const nextIndex = (currentIndex + 1) % categories.length;
          setActiveCategory(categories[nextIndex]);
          setSelectedMissionIndex(0);
        }
      } else if (e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (selectedSection === 'active') {
          if (selectedActiveIndex > 0) {
            setSelectedActiveIndex(prev => prev - 1);
          }
        } else {
          if (selectedMissionIndex > 0) {
            setSelectedMissionIndex(prev => prev - 1);
          } else if (activeMissionsData.length > 0) {
            setSelectedSection('active');
            setSelectedActiveIndex(activeMissionsData.length - 1);
          }
        }
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (selectedSection === 'active') {
          if (selectedActiveIndex < activeMissionsData.length - 1) {
            setSelectedActiveIndex(prev => prev + 1);
          } else {
            setSelectedSection('board');
            setSelectedMissionIndex(0);
          }
        } else {
          setSelectedMissionIndex(prev => Math.min(currentMissions.length - 1, prev + 1));
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        
        if (selectedSection === 'active') {
          const am = activeMissionsData[selectedActiveIndex];
          if (am && am.isComplete) {
            onCollectMission(am.missionId);
          }
        } else {
          const mission = currentMissions[selectedMissionIndex];
          const isActive = state.activeMissions.some(am => am.missionId === mission.id);
          const isLocked = state.heroLevel < mission.requiredLevel;
          const cooldownEnd = state.missionCooldowns[mission.id];
          const isOnCooldown = cooldownEnd ? now < cooldownEnd : false;
          const slotsFull = state.activeMissions.length >= state.missionSlots;

          if (mission && !isActive && !isLocked && !isOnCooldown && !slotsFull) {
            onStartMission(mission.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategory, categories, currentMissions, selectedMissionIndex, selectedActiveIndex, selectedSection, state, now, onStartMission, onCollectMission, activeMissionsData]);

  // Reset selectedActiveIndex if active missions change
  useEffect(() => {
    if (activeMissionsData.length === 0) {
      setSelectedSection('board');
      setSelectedActiveIndex(0);
    } else if (selectedActiveIndex >= activeMissionsData.length) {
      setSelectedActiveIndex(Math.max(0, activeMissionsData.length - 1));
    }
  }, [activeMissionsData.length]);

  const slotsUsed = state.activeMissions.length;
  const slotsMax = state.missionSlots;

  const readyCount = activeMissionsData.filter(m => m.isComplete).length;
  const selectedTargetKey = selectedSection === 'active'
    ? `active-${selectedActiveIndex}`
    : `board-${selectedMissionIndex}`;
  const registerSelectionTarget = useSelectionScroll<HTMLDivElement>(selectedTargetKey, [
    activeCategory,
    activeMissionsData.length,
    currentMissions.length,
    selectedSection,
  ]);

  return (
    <div className="space-y-6">
      {/* Active Missions Panel */}
      <div className="bg-card border-2 border-border p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-black uppercase italic tracking-tight">
            Active Missions
            {readyCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-[10px] bg-emerald-500 text-white rounded-full animate-pulse">
                {readyCount} READY
              </span>
            )}
          </h2>
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Slots: {slotsUsed}/{slotsMax}
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">W/S to navigate, Space to collect rewards.</p>

        {activeMissionsData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="text-sm font-bold">No active missions</p>
            <p className="text-xs">Deploy your hero on missions below to earn rewards while you wait!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeMissionsData.map((am, index) => {
              const isSelected = selectedSection === 'active' && index === selectedActiveIndex;
              return (
                <div
                  key={am.missionId}
                  ref={registerSelectionTarget(`active-${index}`)}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    isSelected ? 'border-primary ring-2 ring-primary/20 scale-[1.01]' : 'border-border'
                  } ${
                    am.isComplete
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'bg-muted/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{am.mission.icon}</span>
                      <div>
                        <div className="font-black text-sm uppercase">{am.mission.name}</div>
                        <div className="text-[10px] text-muted-foreground font-bold">
                          {CATEGORY_INFO[am.mission.category].label}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {am.isComplete ? (
                        <button
                          onClick={() => onCollectMission(am.missionId)}
                          className={`px-4 py-1.5 text-white text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
                            isSelected ? 'bg-emerald-600 ring-2 ring-emerald-400 scale-105' : 'bg-emerald-500 hover:bg-emerald-600 animate-pulse'
                          }`}
                        >
                          Collect!
                        </button>
                      ) : (
                        <>
                          <span className="text-sm font-black tabular-nums text-primary">
                            {formatCountdown(am.remaining)}
                          </span>
                          <button
                            onClick={() => onCancelMission(am.missionId)}
                            className="px-2 py-1 text-[9px] font-black uppercase text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        am.isComplete ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{ width: `${am.progress * 100}%` }}
                    />
                  </div>
                  {am.isComplete && (() => {
                    const scaled = scaleMissionRewards(am.mission, state.heroLevel);
                    return (
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold">
                        {scaled.coins > 0 && (
                          <span className="text-primary">{formatNumber(scaled.coins)} coins</span>
                        )}
                        {scaled.exp > 0 && (
                          <span className="text-purple-400">{formatNumber(scaled.exp)} exp</span>
                        )}
                        {scaled.talentPoints && (
                          <span className="text-cyan-400">+{scaled.talentPoints} TP</span>
                        )}
                        {scaled.lootTable && scaled.lootTable.length > 0 && (
                          <span className="text-orange-400">+ Loot!</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mission Browser */}
      <div className="bg-card border-2 border-border p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-black uppercase italic tracking-tight mb-1">Mission Board</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">A/D to switch categories, W/S to navigate, Space to deploy.</p>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-border pb-4">
          {categories.map(cat => {
            const info = CATEGORY_INFO[cat];
            const isSelectedTab = activeCategory === cat;
            const available = (missions || []).filter(
              m => m.category === cat && state.heroLevel >= m.requiredLevel
            ).length;
            const total = (missions || []).filter(m => m.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedMissionIndex(0); }}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm border-2 flex items-center gap-1.5 transition-all ${
                  isSelectedTab
                    ? 'bg-foreground text-background border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]'
                    : 'text-muted-foreground hover:text-foreground border-transparent'
                }`}
              >
                <span>{info.icon}</span>
                {info.label}
                <span className="opacity-50">({available}/{total})</span>
              </button>
            );
          })}
        </div>

        {/* Category Header */}
        <div className="mb-4">
          <div className={`text-[10px] font-black uppercase tracking-widest ${CATEGORY_INFO[activeCategory].color}`}>
            {CATEGORY_INFO[activeCategory].icon} {CATEGORY_INFO[activeCategory].label} — {CATEGORY_INFO[activeCategory].desc}
          </div>
        </div>

        {/* Mission List */}
        <div className="grid gap-3">
          {currentMissions.map((mission, index) => {
            const isLocked = state.heroLevel < mission.requiredLevel;
            const isActive = state.activeMissions.some(am => am.missionId === mission.id);
            const isCompleted = state.completedMissionIds.includes(mission.id);
            const cooldownEnd = state.missionCooldowns[mission.id];
            const isOnCooldown = cooldownEnd ? now < cooldownEnd : false;
            const cooldownRemaining = isOnCooldown ? cooldownEnd - now : 0;
            const slotsFull = slotsUsed >= slotsMax;
            const badge = REWARD_BADGES[mission.rewardType];
            const scaled = scaleMissionRewards(mission, state.heroLevel);
            const isSelected = index === selectedMissionIndex;

            return (
              <div
                key={mission.id}
                ref={registerSelectionTarget(`board-${index}`)}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isSelected ? 'border-primary ring-2 ring-primary/20 scale-[1.01]' : 'border-border'
                } ${
                  isLocked
                    ? 'bg-muted/5 opacity-50'
                    : isActive
                    ? 'bg-primary/5'
                    : 'bg-muted/10 hover:border-border/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{mission.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm uppercase">{mission.name}</span>
                        <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase border rounded ${badge.color}`}>
                          {badge.label}
                        </span>
                        {isCompleted && (
                          <span className="text-[8px] font-black text-emerald-500 uppercase">Cleared</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">{mission.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] font-bold">
                        <span className="text-muted-foreground">
                          ⏱ {formatDuration(mission.durationSeconds)}
                        </span>
                        {scaled.coins > 0 && (
                          <span className="text-primary">{formatNumber(scaled.coins)} coins</span>
                        )}
                        {scaled.exp > 0 && (
                          <span className="text-purple-400">{formatNumber(scaled.exp)} exp</span>
                        )}
                        {scaled.talentPoints && (
                          <span className="text-cyan-400">+{scaled.talentPoints} TP</span>
                        )}
                        {scaled.lootTable && scaled.lootTable.length > 0 && (
                          <span className="text-orange-400">+ Loot</span>
                        )}
                        {isLocked && (
                          <span className="text-destructive">Req. Lv.{mission.requiredLevel}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isLocked ? (
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase text-muted-foreground border-2 border-border rounded-md">
                        🔒 Lv.{mission.requiredLevel}
                      </div>
                    ) : isActive ? (
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase text-primary border-2 border-primary/30 rounded-md">
                        In Progress
                      </div>
                    ) : isOnCooldown ? (
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase text-muted-foreground border-2 border-border rounded-md tabular-nums">
                        ⏳ {formatCountdown(cooldownRemaining)}
                      </div>
                    ) : (
                      <button
                        onClick={() => onStartMission(mission.id)}
                        disabled={slotsFull}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md border-2 transition-all ${
                          slotsFull
                            ? 'border-border text-muted-foreground cursor-not-allowed'
                            : 'border-foreground bg-foreground text-background hover:opacity-80'
                        }`}
                      >
                        {slotsFull ? 'No Slots' : 'Deploy'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
