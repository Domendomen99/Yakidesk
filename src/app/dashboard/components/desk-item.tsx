import { Armchair } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Desk } from '@/lib/types';

interface DeskItemProps {
  desk: Desk;
  isBooked: boolean;
  onClick: () => void;
}

export default function DeskItem({ desk, isBooked, onClick }: DeskItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105',
              isBooked
                ? 'border-muted-foreground/30 bg-muted/20 text-muted-foreground cursor-not-allowed'
                : 'border-border hover:border-primary hover:bg-accent/10 cursor-pointer'
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
            <Armchair
              className={cn(
                'h-12 w-12 transition-colors',
                isBooked ? 'text-muted-foreground/50' : 'text-primary'
              )}
            />
            <span
              className={cn(
                'font-medium font-body',
                 isBooked ? 'text-muted-foreground' : 'text-foreground'
              )}
            >
              {desk.label}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='font-sans'>{isBooked ? `Booked for selected slot` : `Click to see booking options`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
