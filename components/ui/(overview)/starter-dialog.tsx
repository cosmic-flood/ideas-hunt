'use client';

import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

export default function StarterDialog() {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    const accountInitialized = localStorage.getItem('initialized');
    if (!accountInitialized) {
      setIsOpen(true);
      localStorage.setItem('initialized', 'true');
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
          <AlertDialogAction>
            <Link href="/settings">Start Configuration</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
