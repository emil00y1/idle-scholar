'use client';

import React from 'react';
import { UnitType } from '@/lib/game/types';
import { CLASS_INFO } from '@/lib/game/constants';

interface ClassSelectionProps {
  onSelect: (heroClass: UnitType) => void;
}

export const ClassSelection: React.FC<ClassSelectionProps> = ({ onSelect }) => {
  const classes: UnitType[] = ['knight', 'warrior', 'archer', 'mage', 'healer'];
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      
      if (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'w') {
        e.stopImmediatePropagation();
        setSelectedIndex(prev => (prev - 1 + classes.length) % classes.length);
      } else if (e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 's') {
        e.stopImmediatePropagation();
        setSelectedIndex(prev => (prev + 1) % classes.length);
      } else if (e.code === 'Space') {
        e.preventDefault();
        onSelect(classes[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelect, classes]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Choose Your Path</h1>
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Select a class to begin your journey. (WASD to navigate, Space to select)</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((type, index) => {
            const info = CLASS_INFO[type];
            const recommended = type === 'knight';
            const isSelected = index === selectedIndex;
            return (
              <button
                key={type}
                onClick={() => onSelect(type)}
                className={`relative p-6 border-2 rounded-2xl text-left transition-all group hover:border-primary hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(234,179,8,0.15)] bg-card ${
                  isSelected ? 'border-primary ring-4 ring-primary/20 scale-[1.05]' : 'border-border opacity-80'
                } ${recommended && !isSelected ? 'border-primary/30' : ''}`}
              >
                {recommended && (
                  <div className={`absolute -top-3 left-4 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    Recommended
                  </div>
                )}
                <div className={`text-5xl mb-4 transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>{info.icon}</div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">{info.name}</h3>
                <div className="text-[10px] text-primary font-black uppercase tracking-widest mb-3">{info.title}</div>
                <p className="text-xs text-muted-foreground font-bold leading-relaxed mb-4">{info.description}</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-black uppercase text-muted-foreground border-t border-border pt-3">
                  <span>HP: {info.baseStats.hp}</span>
                  <span>ATK: {info.baseStats.atk}</span>
                  <span>DEF: {info.baseStats.def}</span>
                  <span>SPD: {info.baseStats.spd}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
