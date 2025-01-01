// BudgetInput.tsx
import React, { useState, useEffect, useCallback } from 'react';

interface BudgetInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  roundToFive?: boolean;
  description?: string;
  error?: string;
}

export function BudgetInput({
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
  roundToFive = false,
  description,
  error,
}: BudgetInputProps) {
  // Local state for input value to handle intermediate states
  const [localValue, setLocalValue] = useState<string>(value.toString());

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  // Handle input change with validation and rounding
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      // Don't process empty or invalid values
      if (!newValue || newValue === '-') return;

      let numValue = Number(newValue);

      if (!isNaN(numValue)) {
        // Apply min/max constraints
        if (min !== undefined) numValue = Math.max(min, numValue);
        if (max !== undefined) numValue = Math.min(max, numValue);

        // Round to nearest 5 if needed
        if (roundToFive) {
          numValue = Math.round(numValue / 5) * 5;
        }

        // Only trigger onChange if value is different
        if (numValue !== value) {
          onChange(numValue);
        }
      }
    },
    [value, onChange, min, max, roundToFive]
  );

  // Handle blur event to clean up any invalid states
  const handleBlur = useCallback(() => {
    let finalValue = Number(localValue);

    // Handle invalid values
    if (isNaN(finalValue)) {
      finalValue = value;
    } else {
      // Apply constraints
      if (min !== undefined) finalValue = Math.max(min, finalValue);
      if (max !== undefined) finalValue = Math.min(max, finalValue);
      if (roundToFive) finalValue = Math.round(finalValue / 5) * 5;
    }

    // Update both local and parent state
    setLocalValue(finalValue.toString());
    if (finalValue !== value) {
      onChange(finalValue);
    }
  }, [localValue, value, onChange, min, max, roundToFive]);

  // Handle keyboard step (up/down arrows)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      const step = roundToFive ? 5 : 1;

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();

        let newValue = value + (e.key === 'ArrowUp' ? step : -step);

        // Apply constraints
        if (min !== undefined) newValue = Math.max(min, newValue);
        if (max !== undefined) newValue = Math.min(max, newValue);

        onChange(newValue);
      }
    },
    [value, onChange, min, max, disabled, roundToFive]
  );

  // Handle increment/decrement buttons
  const handleStep = useCallback(
    (increment: boolean) => {
      const step = roundToFive ? 5 : 1;
      let newValue = value + (increment ? step : -step);

      // Apply constraints
      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);

      onChange(newValue);
    },
    [value, onChange, min, max, roundToFive]
  );

  return (
    <div>
      {/* Label and round info */}
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {roundToFive && (
          <span className="text-xs text-gray-400">Rounds to ₪5</span>
        )}
      </div>

      {/* Input container */}
      <div className="relative rounded-md shadow-sm">
        {/* Currency symbol */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">₪</span>
        </div>

        {/* Input field */}
        <input
          type="number"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={roundToFive ? 5 : 1}
          disabled={disabled}
          className={`
            block w-full pl-7 pr-12 sm:text-sm rounded-md
            ${
              disabled
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }
            ${error ? 'border-red-300 text-red-900 placeholder-red-300' : ''}
          `}
        />

        {/* Step buttons */}
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            onClick={() => handleStep(false)}
            disabled={disabled || (min !== undefined && value <= min)}
            className={`
              px-2 py-1 focus:outline-none
              ${
                disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            -
          </button>
          <button
            type="button"
            onClick={() => handleStep(true)}
            disabled={disabled || (max !== undefined && value >= max)}
            className={`
              px-2 py-1 focus:outline-none
              ${
                disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            +
          </button>
        </div>
      </div>

      {/* Description and validation messages */}
      {description && !error && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {min !== undefined && max !== undefined && !error && (
        <p className="mt-1 text-xs text-gray-400">
          Range: ₪{min.toLocaleString()} - ₪{max.toLocaleString()}
        </p>
      )}
    </div>
  );
}
