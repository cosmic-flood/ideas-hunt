import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface ScoreReasonDialogProps {
  isOpen: boolean;
  postText: string | null;
  postTitle: string | null;
  onClose: () => void;
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function ScoreReasonDialog({
  isOpen,
  postText,
  postTitle,
  onClose,
}: ScoreReasonDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    if (isOpen == true) {
      setIsLoading(true);
      const delay = 3000;
      sleep(delay).then(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen]);
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(item) => item == false && onClose()}
    >
      <AlertDialogContent className="w-full max-w-[800px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Reason of the score</AlertDialogTitle>
          {isLoading == true ? (
            <div className="flex items-center space-x-4 py-6">
              <div className="space-y-2">
                <div>
                  Please wait while we analyze the reasons for the score...
                </div>
                <Skeleton className="h-4 w-[400px] bg-gray-400" />
                <Skeleton className="h-4 w-[350px] bg-gray-400" />
                <Skeleton className="h-4 w-[300px] bg-gray-400" />
                <Skeleton className="h-4 w-[250px] bg-gray-400" />
                <Skeleton className="h-4 w-[200px] bg-gray-400" />
              </div>
            </div>
          ) : (
            <div className="my-6 py-6">
              <strong>{postTitle}</strong>
              {postText}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
