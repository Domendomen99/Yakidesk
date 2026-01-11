'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Desk, UserProfile } from '@/lib/types';

interface BookedDeskItemProps {
  desk: Desk;
  user?: UserProfile;
  isCurrentUser: boolean;
  onClick: () => void;
  className?: string;
  isRootMode?: boolean;
}

function getInitials(name: string | undefined | null) {
  if (!name) return '??';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getFormattedName(name: string | undefined | null) {
  if (!name) return 'N/A';
  return name;
}

export default function BookedDeskItem({ desk, user, isCurrentUser, onClick, className, isRootMode }: BookedDeskItemProps) {
  const tooltipContent = isRootMode
    ? `Booked by ${getFormattedName(user?.name)}. Click to override.`
    : isCurrentUser
    ? 'Booked by you. Click to cancel.'
    : `Booked by ${getFormattedName(user?.name)}. Click for details.`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-300 transform cursor-pointer',
              isCurrentUser && !isRootMode
                ? 'border-primary bg-primary/20 hover:scale-105'
                : 'border-muted-foreground/30 bg-muted/20 text-muted-foreground hover:border-foreground/50',
              isRootMode ? 'border-destructive bg-destructive/20 hover:scale-105' : '',
              'justify-center',
              className
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
            <Avatar className="h-12 w-12">
              {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
              <AvatarFallback
                className={cn(
                  isCurrentUser && !isRootMode ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground text-background',
                  isRootMode ? 'bg-destructive text-destructive-foreground' : ''
                )}
              >
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='font-sans'>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
