import { useState } from 'react';
import { fromKg, toKg, formatKg, formatDualQuantity } from '@/utils/quantity';
import type { QuantityUnit } from '@/types';
import { SegmentedControl } from '@/components/ui';
import { cn } from '@/utils/cn';

interface Props {
  valueKg: number;
  onChange: (kg: number, unit: QuantityUnit) => void;
  moqKg: number;
  availableKg: number;
  className?: string;
}

/** Reusable KG/TON wholesale quantity input (spec §56, §65). Internally always KG. */
export function WholesaleQuantityInput({ valueKg, onChange, moqKg, availableKg, className }: Props) {
  const [unit, setUnit] = useState<QuantityUnit>(valueKg >= 1000 ? 'TON' : 'KG');

  const shown = fromKg(valueKg, unit);
  const belowMoq = valueKg > 0 && valueKg < moqKg;
  const overStock = valueKg > availableKg;

  const setFromInput = (raw: string) => {
    const n = Number(raw);
    if (Number.isNaN(n) || n < 0) return onChange(0, unit);
    onChange(toKg(n, unit), unit);
  };

  const switchUnit = (u: QuantityUnit) => {
    setUnit(u);
    onChange(valueKg, u);
  };

  return (
    <div className={className}>
      <div className="flex items-stretch gap-2">
        <input
          type="number"
          min={0}
          step={unit === 'TON' ? 0.1 : 50}
          value={shown === 0 ? '' : shown}
          onChange={(e) => setFromInput(e.target.value)}
          className="input-base w-32"
          aria-label="Quantity"
        />
        <SegmentedControl
          value={unit}
          onChange={(u) => switchUnit(u as QuantityUnit)}
          options={[
            { value: 'KG', label: 'KG' },
            { value: 'TON', label: 'TON' },
          ]}
          size="sm"
        />
      </div>

      <div className="mt-1.5 space-y-0.5 text-xs">
        {valueKg > 0 && (
          <p className="text-ink-600">
            = <span className="font-medium text-ink-800">{formatDualQuantity(valueKg)}</span>
          </p>
        )}
        <p className={cn(belowMoq ? 'text-red-600' : 'text-ink-500')}>
          Minimum order: {formatKg(moqKg)}
        </p>
        <p className={cn(overStock ? 'text-red-600' : 'text-ink-500')}>
          Available: {formatDualQuantity(availableKg)}
        </p>
      </div>

      {belowMoq && (
        <p className="mt-1 text-xs font-medium text-red-600">
          Quantity is below the minimum order quantity.
        </p>
      )}
      {overStock && (
        <p className="mt-1 text-xs font-medium text-red-600">
          Requested quantity exceeds available inventory.
        </p>
      )}
    </div>
  );
}

export const quantityIsValid = (kg: number, moqKg: number, availableKg: number): boolean =>
  kg >= moqKg && kg <= availableKg;
