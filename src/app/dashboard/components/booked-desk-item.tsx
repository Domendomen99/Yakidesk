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
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0]} ${names[names.length - 1][0]}.`;
  }
  return name;
}

export default function BookedDeskItem({ desk, user, isCurrentUser, onClick, className, isRootMode }: BookedDeskItemProps) {
  const tooltipContent = isRootMode
    ? `Booked by ${user?.name ?? 'someone'}. Click to override.`
    : isCurrentUser
    ? 'Booked by you. Click to cancel.'
    : `Booked by ${user?.name ?? 'someone'}`;

  const canClick = isCurrentUser || isRootMode;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={canClick ? onClick : undefined}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300 transform',
              isCurrentUser && !isRootMode
                ? 'border-primary bg-primary/20 hover:scale-105 cursor-pointer'
                : 'border-muted-foreground/30 bg-muted/20 text-muted-foreground',
              isRootMode ? 'border-destructive bg-destructive/20 hover:scale-105 cursor-pointer' : '',
              !canClick && 'cursor-not-allowed',
              'justify-center',
              className
            )}
            role="button"
            tabIndex={canClick ? 0 : -1}
            onKeyDown={(e) => {
              if (canClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onClick();
              }
            }}
          >
            <Avatar className="h-10 w-10">
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
            <span
              className={cn(
                'font-medium font-body text-sm text-center truncate w-full',
                isCurrentUser && !isRootMode ? 'text-primary' : 'text-muted-foreground',
                isRootMode ? 'text-destructive-foreground' : ''
              )}
               title={getFormattedName(user?.name) ?? ''}
            >
              {getFormattedName(user?.name)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='font-sans'>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
