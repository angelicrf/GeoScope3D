"use client";

import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GlobeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onCenter: () => void;
}

export function GlobeControls({ onZoomIn, onZoomOut, onReset, onCenter }: GlobeControlsProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 glass-panel rounded-full shadow-2xl z-20">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onZoomIn} className="rounded-full hover:bg-primary/20 hover:text-primary">
            <ZoomIn className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Zoom In</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onZoomOut} className="rounded-full hover:bg-primary/20 hover:text-primary">
            <ZoomOut className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Zoom Out</TooltipContent>
      </Tooltip>

      <div className="w-px h-6 bg-border mx-1" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onCenter} className="rounded-full hover:bg-accent/20 hover:text-accent">
            <Crosshair className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Center View</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onReset} className="rounded-full hover:bg-primary/20 hover:text-primary">
            <RotateCcw className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Reset Camera</TooltipContent>
      </Tooltip>
    </div>
  );
}