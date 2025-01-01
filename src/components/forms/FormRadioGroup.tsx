import React from 'react';
import { UseFormRegister, RegisterOptions, FieldError } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface FormRadioGroupProps {
  name: string;
  label: string;
  options: Option[];
  register: UseFormRegister<any>;
  validation?: RegisterOptions;
  error?: FieldError;
  disabled?: boolean;
}

export function FormRadioGroup({
  name,
  label,
  options,
  register,
  validation = {},
  error,
  disabled = false,
}: FormRadioGroupProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              {...register(name, validation)}
              value={option.value}
              disabled={disabled}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}