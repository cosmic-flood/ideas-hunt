import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/shadcn-button';
import { ArrowDown10Icon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Column } from '@tanstack/react-table';

export function ScoreFilter<TData, TValue>({
  column,
}: {
  column?: Column<TData, TValue>;
}) {
  function getMin() {
    return (column?.getFilterValue() as [number, number])?.[0] ?? 0;
  }

  function setMin(value: string | number) {
    console.log('setMinScore', value);
    column?.setFilterValue((old: [number, number]) => [
      Number(value),
      old?.[1],
    ]);
  }

  function getMax() {
    return (column?.getFilterValue() as [number, number])?.[1] ?? 10;
  }

  function setMax(value: string | number) {
    console.log('setMaxScore', value);
    column?.setFilterValue((old: [number, number]) => [
      old?.[0],
      Number(value),
    ]);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="h-8 border-dashed" variant="outline">
          <ArrowDown10Icon className="mr-1.5 h-3.5 w-3.5" />
          Score{' '}
          <span className="ml-1">
            is between <strong>{getMin()}</strong> and{' '}
            <strong>{getMax()}</strong>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3">
        <div className="mb-3 text-sm">Relevance Score Range</div>
        <div className="mb-1.5 flex justify-between gap-7 px-0.5">
          <Label className="flex-1" htmlFor="minScore">
            Min
          </Label>
          <Label className="flex-1" htmlFor="maxScore">
            Max
          </Label>
        </div>
        <div className="flex items-center justify-evenly gap-2">
          <DebouncedInput
            id="minScore"
            type="number"
            min={0}
            max={10}
            value={getMin()}
            onChange={setMin}
          />
          <span>-</span>
          <DebouncedInput
            id="maxScore"
            type="number"
            min={0}
            max={10}
            value={getMax()}
            onChange={setMax}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
