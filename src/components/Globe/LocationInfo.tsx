
"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Globe2, Info, Loader2, Grid3X3, Layers, MapPin, Cable, Satellite as SatelliteIcon, Signal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Selection } from '@/lib/geo-data';

interface LocationInfoProps {
  selection: Selection | null;
  onClose: () => void;
}

export function LocationInfo({ selection, onClose }: LocationInfoProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selection) {
      setInsight(null);
      return;
    }

    if ('type' in selection && selection.type === 'cell') {
      setInsight(`This cell (ID: ${selection.id}) covers a strategic geographic area defined by its specific coordinate bounds. It is part of the global grid network.`);
      return;
    }

    if ('type' in selection && selection.type === 'pop') {
      setInsight(selection.description);
      return;
    }

    if ('type' in selection && selection.type === 'gateway') {
      setInsight(`Gateway established as a localized sub-node for ${selection.parentPop}. This unit handles high-frequency packet relay and local data encryption within the regional sector.`);
      return;
    }

    if ('type' in selection && selection.type === 'satellite') {
      setInsight(`Orbital asset ${selection.name} is currently maintaining a stable altitude of ${selection.altitude.toFixed(1)}km. Status: ${selection.status.toUpperCase()}. High-speed packet routing is active.`);
      return;
    }

    const s = selection as any;
    const isCity = 'isCapital' in s;
    setInsight(
      isCity
        ? `${s.name} is shown with core geographic details and city context.`
        : `${s.name} is shown with core geographic details and country context.`
    );
  }, [selection]);

  if (!selection) return null;

  const isCell = 'type' in selection && selection.type === 'cell';
  const isPop = 'type' in selection && selection.type === 'pop';
  const isGateway = 'type' in selection && selection.type === 'gateway';
  const isSat = 'type' in selection && selection.type === 'satellite';
  const isCity = !isCell && !isPop && !isGateway && !isSat && 'isCapital' in selection;
  const data = selection as any;

  return (
    <div className="fixed top-8 right-8 w-96 glass-panel rounded-2xl shadow-2xl z-30 animate-in slide-in-from-right-8 duration-300 overflow-hidden flex flex-col max-h-[calc(100vh-4rem)] border-primary/20">
      <div className="p-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary-foreground border-primary/30 uppercase tracking-widest text-[10px] font-bold">
              {isCell ? 'Grid Network' : isPop ? 'Strategic Node' : isGateway ? 'Regional Gateway' : isSat ? 'Orbital Asset' : isCity ? 'City Details' : 'Country Details'}
            </Badge>
            <h2 className="text-3xl font-headline font-bold text-white tracking-tight leading-none mb-1">
              {isCell ? `Cell #${data.id}` : data.name}
            </h2>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
              {isCell ? (
                <><Grid3X3 className="w-3 h-3" /> Area Identification</>
              ) : isPop ? (
                <><MapPin className="w-3 h-3" /> Intelligence Core</>
              ) : isGateway ? (
                <><Cable className="w-3 h-3" /> Sub-node Relay</>
              ) : isSat ? (
                <><SatelliteIcon className="w-3 h-3" /> Low Earth Orbit</>
              ) : isCity ? (
                <><Globe2 className="w-3 h-3" /> {data.country}</>
              ) : (
                <><Layers className="w-3 h-3" /> Sovereign Territory</>
              )}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full -mt-2 -mr-2 text-muted-foreground hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              {isCell ? 'Resolution' : isGateway ? 'Parent Node' : isSat ? 'Velocity' : isPop ? 'Node Type' : isCity ? 'Status' : 'Capital'}
            </p>
            <p className="text-sm font-medium text-primary">
              {isCell ? '2.0° Grid' : isGateway ? data.parentPop : isSat ? data.orbitalVelocity : isPop ? 'Level-1 Primary' : isCity ? (data.isCapital ? 'Capital City' : 'Major City') : data.capital}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              {isCell ? 'Sector ID' : isSat ? 'Status' : isGateway ? 'Encryption' : isPop ? 'Population' : 'Population'}
            </p>
            <p className="text-sm font-medium text-white">
              {isCell ? `ID-${data.id.toString().padStart(5, '0')}` : isSat ? data.status.toUpperCase() : isGateway ? 'ACTIVE-V2' : isPop ? 'INTEGRATED' : data.population || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 pt-2">
        <div className="space-y-6">
          <Separator className="bg-white/10" />
          
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-headline font-bold uppercase tracking-wider">
                {isCell ? 'Sector Analysis' : isGateway ? 'Gateway Logs' : isSat ? 'Telemetry' : 'Location Analysis'}
              </h3>
            </div>
            
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 min-h-[100px] flex flex-col justify-center">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  <span className="text-xs">Analyzing spatial data...</span>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-slate-300">
                  {insight || 'Retrieving global positioning context...'}
                </p>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="w-4 h-4" />
              <h3 className="text-sm font-headline font-bold uppercase tracking-wider">Spatial Data</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-secondary/30 p-2 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground block">LATITUDE</span>
                <span className="text-xs font-mono">
                  {isCell ? `${data.minLat}° to ${data.maxLat}°` : `${data.lat.toFixed(4)}°`}
                </span>
              </div>
              <div className="bg-secondary/30 p-2 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground block">LONGITUDE</span>
                <span className="text-xs font-mono">
                  {isCell ? `${data.minLng}° to ${data.maxLng}°` : `${data.lng.toFixed(4)}°`}
                </span>
              </div>
            </div>
            {isSat && (
              <div className="bg-secondary/30 p-2 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground block text-center">ORBITAL ALTITUDE</span>
                <span className="text-xs font-mono block text-center text-primary">
                  {data.altitude.toFixed(2)} KM
                </span>
              </div>
            )}
          </section>
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-white/5 bg-secondary/10">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-headline font-bold uppercase tracking-widest text-xs h-10 gap-2">
          {isSat ? <><Signal className="w-4 h-4" /> Sync Uplink</> : isCell ? 'Scan Cell Data' : isGateway ? 'Initialize Gateway' : 'Access Node'}
        </Button>
      </div>
    </div>
  );
}
