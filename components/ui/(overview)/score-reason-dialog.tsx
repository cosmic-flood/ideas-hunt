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
import OpenAI from 'openai';
import { getScoreReason } from '@/utils/reddit/openai';

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

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  baseURL: 'https://api.opendevelop.tech/v1',
});

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
      if(!score)
        setText("No Score for this post");
      const reason = await getScoreReason(
        openai,
        `${postTitle} ${postText}`,
        `${postTitle} ${postText}`,
        score ?? 0
      );
      setText(reason);
      setIsLoading(false);
    }

    if (isOpen == true) {
      setIsLoading(true);
      // const delay = 3000;
      getScoreReasonAsync();
      // sleep(delay).then(() => {
      //   setIsLoading(false);
      // });
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