'use client';

import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/lib/types';
import { Check, X } from 'lucide-react';

interface UserManagementDialogProps {
  users: UserProfile[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdate: (userId: string, status: 'approved' | 'rejected') => void;
}

function getInitials(name: string | undefined | null) {
  if (!name) return '??';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export default function UserManagementDialog({
  users,
  isOpen,
  onOpenChange,
  onUserUpdate,
}: UserManagementDialogProps) {
  const pendingUsers = useMemo(() => {
    return users.filter((user) => user.status === 'pending');
  }, [users]);

  const UserItem = ({ user }: { user: UserProfile }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{user.name}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
          onClick={() => onUserUpdate(user.id, 'approved')}
          aria-label="Approve user"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onUserUpdate(user.id, 'rejected')}
          aria-label="Reject user"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">User Management</DialogTitle>
          <DialogDescription>Approve or reject new user requests.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {pendingUsers.length > 0 ? (
            <div className="space-y-2">
              {pendingUsers.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No pending user requests.
            </p>
          )}
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
