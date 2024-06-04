'use client';

import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/shadcn-button';

export default function StarterDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    localStorage.setItem('initialized', 'true');
    router.push('/settings');
  };

  useEffect(() => {
    const accountInitialized = localStorage.getItem('initialized');

    if (!accountInitialized) {
      setIsOpen(true);
    }
  }, []);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Discovering Business Leads and Validating Ideas on Reddit.
          </AlertDialogTitle>
          <AlertDialogDescription>
            Reddit-Leads.com leverages AI technology to quickly identify posts
            most relevant to your business and provides immediate notifications.
            This prompt alert allows you to post high-quality comments within
            the first half hour after a post is published, boosting your
            visibility and ensuring you stay ahead of other responses. This
            strategy maximizes your exposure to potential customers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleClick}>
            Start Configuration
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
