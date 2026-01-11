'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface RootModeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ROOT_PASSWORD = 'aaabbbccc';

export default function RootModeDialog({ isOpen, onOpenChange, onSuccess }: RootModeDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleConfirm = () => {
    if (password === ROOT_PASSWORD) {
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'The password you entered is incorrect.',
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPassword('');
      setError('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Enable Root Privileges</DialogTitle>
          <DialogDescription>
            Enter the administrator password to permanently grant root privileges to your account. This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={error ? 'border-destructive' : ''}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleConfirm();
                }
            }}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Grant Privileges
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
