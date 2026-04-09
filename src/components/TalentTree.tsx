'use client';

import React from 'react';
import { GameState, TalentNode } from '@/lib/game/types';
import { TALENT_TREES } from '@/lib/game/constants';
import { useSelectionScroll } from '@/lib/game/useSelectionScroll';

interface TalentTreeProps {
  state: GameState;
  onAllocate: (nodeId: string) => void;
}

export function TalentTree({ state, onAllocate }: TalentTreeProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  if (!state.heroClass) return null;

  const tree = TALENT_TREES[state.heroClass];
  const sortedNodes = [...tree.nodes].sort((a, b) => {
    if ((a.y ?? 0) !== (b.y ?? 0)) return (a.y ?? 0) - (b.y ?? 0);
    return (a.x ?? 0) - (b.x ?? 0);
  });
  const selectedNodeId = sortedNodes[selectedIndex]?.id;
  const registerSelectionTarget = useSelectionScroll<HTMLDivElement>(selectedNodeId, [sortedNodes.length]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key.toLowerCase() === 'w') {
        e.preventDefault();
        // Try to find a node that is roughly above
        const current = sortedNodes[selectedIndex];
        const above = sortedNodes
          .filter(n => (n.y ?? 0) < (current.y ?? 0))
          .sort((a, b) => {
            const distA = Math.abs((a.x ?? 0) - (current.x ?? 0)) + Math.abs((a.y ?? 0) - (current.y ?? 0)) * 2;
            const distB = Math.abs((b.x ?? 0) - (current.x ?? 0)) + Math.abs((b.y ?? 0) - (current.y ?? 0)) * 2;
            return distA - distB;
          })[0];
        if (above) setSelectedIndex(sortedNodes.indexOf(above));
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        const current = sortedNodes[selectedIndex];
        const below = sortedNodes
          .filter(n => (n.y ?? 0) > (current.y ?? 0))
          .sort((a, b) => {
            const distA = Math.abs((a.x ?? 0) - (current.x ?? 0)) + Math.abs((a.y ?? 0) - (current.y ?? 0)) * 2;
            const distB = Math.abs((b.x ?? 0) - (current.x ?? 0)) + Math.abs((b.y ?? 0) - (current.y ?? 0)) * 2;
            return distA - distB;
          })[0];
        if (below) setSelectedIndex(sortedNodes.indexOf(below));
      } else if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        e.stopImmediatePropagation();
        const current = sortedNodes[selectedIndex];
        const left = sortedNodes
          .filter(n => (n.x ?? 0) < (current.x ?? 0) && Math.abs((n.y ?? 0) - (current.y ?? 0)) < 10)
          .sort((a, b) => (current.x ?? 0) - (a.x ?? 0))[0];
        if (left) setSelectedIndex(sortedNodes.indexOf(left));
        else setSelectedIndex(prev => Math.max(0, prev - 1));
      } else if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        e.stopImmediatePropagation();
        const current = sortedNodes[selectedIndex];
        const right = sortedNodes
          .filter(n => (n.x ?? 0) > (current.x ?? 0) && Math.abs((n.y ?? 0) - (current.y ?? 0)) < 10)
          .sort((a, b) => (a.x ?? 0) - (current.x ?? 0))[0];
        if (right) setSelectedIndex(sortedNodes.indexOf(right));
        else setSelectedIndex(prev => Math.min(sortedNodes.length - 1, prev + 1));
      } else if (e.code === 'Space') {
        e.preventDefault();
        const node = sortedNodes[selectedIndex];
        if (node && isNodeAvailable(node)) onAllocate(node.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, sortedNodes, state.talentsOwned, state.talentPoints, onAllocate]);

  const countsTowardSpecialization = (node: TalentNode) =>
    !node.isShared && !node.isMaster && node.branch !== 'synergy' && node.branch !== 'ultimate' && node.branch !== 'mastery';

  const getSpecializedBranches = () => {
    const ownedNodeIds = Object.keys(state.talentsOwned).filter((id) => state.talentsOwned[id] > 0);
    const specializedBranches = new Set<string>();

    ownedNodeIds.forEach((id) => {
      const node = tree.nodes.find((candidate) => candidate.id === id);
      if (node && countsTowardSpecialization(node)) specializedBranches.add(node.branch);
    });

    return specializedBranches;
  };

  const specializedBranches = getSpecializedBranches();
  const specLimitReached = specializedBranches.size >= 2;
  const selectedMasterNode = tree.nodes.find((node) => node.isMaster && (state.talentsOwned[node.id] || 0) > 0);
  const investedPoints = tree.nodes.reduce((total, node) => {
    const rank = state.talentsOwned[node.id] || 0;
    return total + rank * (node.pointCost ?? 1);
  }, 0);

  const isNodeAvailable = (node: TalentNode) => {
    const rank = state.talentsOwned[node.id] || 0;
    const pointCost = node.pointCost ?? 1;

    if (rank >= node.maxRank) return false;
    if (state.talentPoints < pointCost) return false;

    if (node.isMaster && rank === 0 && selectedMasterNode && selectedMasterNode.id !== node.id) {
      return false;
    }

    if (countsTowardSpecialization(node) && !specializedBranches.has(node.branch) && specLimitReached) {
      return false;
    }

    if (node.requires) {
      for (const requirement of node.requires) {
        if ((state.talentsOwned[requirement.id] || 0) < requirement.minRank) return false;
      }
    }

    return true;
  };

  const isNodeLocked = (node: TalentNode) => {
    const rank = state.talentsOwned[node.id] || 0;

    if (node.isMaster && rank === 0 && selectedMasterNode && selectedMasterNode.id !== node.id) {
      return true;
    }

    if (countsTowardSpecialization(node) && !specializedBranches.has(node.branch) && specLimitReached) {
      return true;
    }

    if (!node.requires) return false;

    for (const requirement of node.requires) {
      if ((state.talentsOwned[requirement.id] || 0) < requirement.minRank) return true;
    }

    return false;
  };

  const getMissingRequirements = (node: TalentNode) => {
    if (!node.requires) return [];

    return node.requires.flatMap((requirement) => {
      const currentRank = state.talentsOwned[requirement.id] || 0;
      if (currentRank >= requirement.minRank) return [];

      const requirementNode = tree.nodes.find((candidate) => candidate.id === requirement.id);
      return [{
        id: requirement.id,
        name: requirementNode?.name ?? requirement.id,
        currentRank,
        minRank: requirement.minRank,
      }];
    });
  };

  const renderNode = (node: TalentNode) => {
    const rank = state.talentsOwned[node.id] || 0;
    const pointCost = node.pointCost ?? 1;
    const maxed = rank >= node.maxRank;
    const locked = isNodeLocked(node);
    const available = isNodeAvailable(node);
    const isSpecLocked = countsTowardSpecialization(node) && !specializedBranches.has(node.branch) && specLimitReached;
    const isMasterLocked = !!(node.isMaster && rank === 0 && selectedMasterNode && selectedMasterNode.id !== node.id);
    const missingRequirements = getMissingRequirements(node);
    const x = node.x ?? 50;
    const y = node.y ?? 50;

    const isSelected = sortedNodes[selectedIndex]?.id === node.id;

    return (
      <div
        key={node.id}
        ref={registerSelectionTarget(node.id)}
        className={`absolute z-10 transition-transform ${isSelected ? 'scale-110 z-30' : ''}`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          width: node.isMaster ? '156px' : '140px',
        }}
      >
        <button
          onClick={() => available && onAllocate(node.id)}
          disabled={!available}
          className={`w-full overflow-visible rounded-xl border-2 p-2 text-left shadow-lg transition-all relative group ${
            isSelected
              ? 'ring-4 ring-primary ring-offset-4 ring-offset-background border-primary scale-105'
              : ''
          } ${
            maxed
              ? 'border-emerald-500/60 bg-emerald-500/10'
              : isMasterLocked
                ? 'border-fuchsia-500/20 bg-fuchsia-500/5 opacity-50 cursor-not-allowed grayscale'
                : isSpecLocked
                  ? 'border-destructive/20 bg-destructive/5 opacity-40 cursor-not-allowed grayscale'
                  : locked
                    ? 'border-border/30 bg-muted/5 opacity-40 cursor-not-allowed grayscale'
                    : available
                      ? `${node.isMaster ? 'border-fuchsia-500/50 hover:border-fuchsia-400 shadow-fuchsia-500/20' : 'border-primary/50 hover:border-primary shadow-primary/20'} bg-card cursor-pointer`
                      : 'border-border bg-muted/10 opacity-60 cursor-not-allowed'
          } hover:z-50 hover:scale-110 hover:shadow-2xl`}
        >
          <div className={`absolute bottom-full left-1/2 z-50 mb-3 w-64 origin-bottom -translate-x-1/2 scale-90 rounded-xl border-2 bg-popover p-4 opacity-0 shadow-2xl transition-all pointer-events-none group-hover:scale-100 group-hover:opacity-100 ${isSelected ? 'opacity-100 scale-100 translate-y-0' : ''} ${node.isMaster ? 'border-fuchsia-500' : 'border-primary'}`}>
            <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
              <span className="text-2xl">{node.icon}</span>
              <div>
                <h4 className="text-xs font-black uppercase italic tracking-tighter text-primary">
                  {node.name}
                </h4>
                <div className="flex gap-2 text-[8px] font-black uppercase text-muted-foreground">
                  <span>Rank {rank}/{node.maxRank}</span>
                  <span className="text-primary/60">•</span>
                  <span>{node.isMaster ? 'mastery' : node.branch}</span>
                  {pointCost > 1 && (
                    <>
                      <span className="text-primary/60">•</span>
                      <span>{pointCost} pts</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[10px] font-bold leading-relaxed text-popover-foreground">
              {node.description}
            </p>

            {!available && locked && !isSpecLocked && !isMasterLocked && (
              <div className="mt-2 border-t border-border pt-2">
                <p className="text-[8px] font-black uppercase text-destructive">Requirements Not Met</p>
                {missingRequirements.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {missingRequirements.map((requirement) => (
                      <div
                        key={`${node.id}-${requirement.id}`}
                        className="flex items-center justify-between gap-2 text-[8px] font-black uppercase text-muted-foreground"
                      >
                        <span className="truncate">{requirement.name}</span>
                        <span className="shrink-0 text-destructive">
                          {requirement.currentRank}/{requirement.minRank}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isSpecLocked && (
              <div className="mt-2 border-t border-border pt-2">
                <p className="text-[8px] font-black uppercase text-destructive">Specialization Locked</p>
              </div>
            )}

            {isMasterLocked && (
              <div className="mt-2 border-t border-border pt-2">
                <p className="text-[8px] font-black uppercase text-fuchsia-400">Master Node Already Chosen</p>
              </div>
            )}

            <div className={`absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent ${node.isMaster ? 'border-t-fuchsia-500' : 'border-t-primary'}`} />
          </div>

          <div className="mb-1 flex items-start justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{node.icon}</span>
              <div>
                <h4 className={`text-[9px] font-black uppercase italic leading-tight tracking-tighter ${maxed ? 'text-emerald-500' : ''}`}>
                  {node.name}
                </h4>
                <div className="flex items-center gap-1 text-[8px] font-bold leading-none text-muted-foreground">
                  <span>{rank}/{node.maxRank}</span>
                  {pointCost > 1 && <span className="text-fuchsia-400">{pointCost} TP</span>}
                </div>
              </div>
            </div>
            {available && (
              <span className={`text-[8px] font-black uppercase animate-pulse ${node.isMaster ? 'text-fuchsia-400' : 'text-primary'}`}>
                UP
              </span>
            )}
          </div>

          <p className="mb-1 h-[18px] line-clamp-2 text-[7px] font-bold leading-tight text-muted-foreground opacity-100 transition-opacity group-hover:opacity-0">
            {node.description}
          </p>

          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all duration-500 ${maxed ? 'bg-emerald-500' : node.isMaster ? 'bg-fuchsia-400' : 'bg-primary'}`}
              style={{ width: `${(rank / node.maxRank) * 100}%` }}
            />
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="flex min-h-[1050px] flex-col space-y-4 rounded-xl border-2 border-border bg-card p-4 shadow-inner md:p-6">
      <div className="flex shrink-0 flex-col items-start justify-between gap-4 border-b-2 border-border pb-4 sm:flex-row sm:items-end">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">{tree.title} Tree</h3>
          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Unlock intertwined paths. Max 2 Specializations and 1 Master Node. (WASD to navigate, Space to allocate)
          </p>
        </div>
        <div className="rounded-xl border-2 border-primary/20 bg-primary/10 px-4 py-2 text-right">
          <div className="mb-1 text-[10px] font-black uppercase tracking-widest leading-none text-primary">Points</div>
          <div className="text-2xl font-black text-primary">{state.talentPoints}</div>
        </div>
      </div>

      <div className="scrollbar-hide relative min-h-[950px] flex-1 overflow-auto rounded-2xl border-2 border-border/50 bg-muted/5 p-2">
        <div className="relative mx-auto h-[1800px] w-[1000px] origin-top scale-90">
          <svg className="absolute inset-0 z-0 h-full w-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="currentColor" className="text-border/40" />
              </marker>
            </defs>
            {tree.nodes.map((node) => {
              if (!node.requires) return null;

              return node.requires.map((requirement) => {
                const parent = tree.nodes.find((candidate) => candidate.id === requirement.id);
                if (!parent) return null;

                const x1 = parent.x ?? 50;
                const y1 = parent.y ?? 50;
                const x2 = node.x ?? 50;
                const y2 = node.y ?? 50;
                const isSatisfied = (state.talentsOwned[parent.id] || 0) >= requirement.minRank;

                return (
                  <line
                    key={`${node.id}-${parent.id}`}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={isSatisfied ? '#eab308' : '#334155'}
                    strokeWidth={isSatisfied ? '2' : '1.5'}
                    strokeDasharray={isSatisfied ? '' : '4 2'}
                    opacity={isSatisfied ? '0.4' : '0.2'}
                    className="transition-all duration-1000"
                  />
                );
              });
            })}
          </svg>

          {tree.nodes.map(renderNode)}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t-2 border-border pt-6 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
        <span>Invested: {investedPoints}</span>
        <div className="flex gap-4">
          {tree.branches.map((branch) => (
            <div key={branch.id} className="flex items-center gap-1">
              <span className={specializedBranches.has(branch.id) ? 'text-emerald-500' : 'opacity-30'}>{branch.icon}</span>
              <span className={specializedBranches.has(branch.id) ? 'text-emerald-500' : 'opacity-30'}>{branch.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
