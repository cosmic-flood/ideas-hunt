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
import { getScoreReason } from '@/utils/openai/server-actions';

interface ScoreReasonDialogProps {
  isOpen: boolean;
  postText: string | null;
  postTitle: string | null;
  score: number | null;
  onClose: () => void;
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function ScoreReasonDialog({
  isOpen,
  postText,
  postTitle,
  score,
  onClose,
}: ScoreReasonDialogProps) {
  const [text, setText] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    const getScoreReasonAsync = async () => {
      if (!score) {
        setText('No Score for this post');
        return;
      }

      const reason = await getScoreReason(
        `${postTitle} ${postText}`,
        score,
      );
      setText(reason);
      
      setIsLoading(false);
    };

    if (isOpen == true) {
      setIsLoading(true);
      getScoreReasonAsync();
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
              <div>
                <strong>Post: {postTitle}</strong>
              </div>
              <div className="my-10 py-6">{text}</div>
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
