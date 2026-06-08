
"use client";

import React, { useState, useRef } from 'react';
import { Globe } from '@/components/Globe/Globe';
import { GlobeControls } from '@/components/Globe/GlobeControls';
import { LocationInfo } from '@/components/Globe/LocationInfo';
import { Selection } from '@/lib/geo-data';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Globe2, Grid3X3, Compass } from 'lucide-react';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Selection | null>(null);
  
  const globeControlsRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
    center: () => void;
  } | null>(null);

  const handleSelection = (item: Selection | null) => {
    setSelectedLocation(item);
  };

  const handleClosePanel = () => {
    setSelectedLocation(null);
  };

  return (
    <TooltipProvider>
      <main className="relative w-full h-screen bg-[#232528] overflow-hidden">
        {/* Header Overlay */}
        <header className="fixed top-8 left-8 z-10 flex items-center gap-4 pointer-events-none">
          <div className="p-3 bg-primary/20 rounded-xl backdrop-blur-md border border-primary/30 pointer-events-auto shadow-xl">
            <Globe2 className="w-8 h-8 text-primary" />
          </div>
          <div className="pointer-events-auto">
            <h1 className="text-2xl font-headline font-bold text-white tracking-tight leading-none text-glow">
              GEOSCAPE <span className="text-primary">3D</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">
              Global Grid Intelligence
            </p>
          </div>
        </header>

        {/* Legend / Status Overlay */}
        <div className="fixed top-32 left-8 z-10 glass-panel p-4 rounded-2xl border-white/5 space-y-4 shadow-xl hidden md:block w-48">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sovereign Data</span>
            </div>
            <div className="flex items-center gap-3">
              <Grid3X3 className="w-3 h-3 text-accent" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Grid Cells</span>
            </div>
          </div>
          <div className="h-px bg-white/5" />
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/60">
              <span>MAPPING</span>
              <span className="text-accent">ACTIVE</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-2/3 animate-pulse" />
            </div>
          </div>
        </div>

        {/* 3D Globe Component */}
        <Globe onSelect={handleSelection} controlsRef={globeControlsRef} />

        {/* Controls Overlay */}
        <GlobeControls 
          onZoomIn={() => globeControlsRef.current?.zoomIn()}
          onZoomOut={() => globeControlsRef.current?.zoomOut()}
          onReset={() => globeControlsRef.current?.reset()}
          onCenter={() => globeControlsRef.current?.center()}
        />

        {/* Sidebar Info Panel */}
        <LocationInfo selection={selectedLocation} onClose={handleClosePanel} />

        {/* Background Visual Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent opacity-50" />
        </div>

        {/* Compass/Coords footer */}
        <div className="fixed bottom-8 right-8 z-10 glass-panel px-4 py-2 rounded-full border-white/5 flex items-center gap-4 text-muted-foreground shadow-lg">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Cell Identification Mode</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="text-[10px] font-mono uppercase tracking-widest text-primary/80">
            Resolution: 2.0°
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}
