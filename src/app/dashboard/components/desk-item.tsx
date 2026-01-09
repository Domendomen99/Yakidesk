'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Desk } from '@/lib/types';
import { DeskIcon } from './desk-icon';

interface DeskItemProps {
  desk: Desk;
  onClick: () => void;
}

export default function DeskItem({ desk, onClick }: DeskItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 w-24 h-24 justify-center',
              'border-border hover:border-primary hover:bg-accent/10 cursor-pointer'
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }}
          >
            <DeskIcon
              className={cn(
                'h-10 w-10 transition-colors',
                'text-primary'
              )}
            />
            <span
              className={cn(
                'font-medium font-body text-sm',
                 'text-foreground'
              )}
            >
              {desk.label}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='font-sans'>Click to see booking options</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
