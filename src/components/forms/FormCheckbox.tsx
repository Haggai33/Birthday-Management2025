import React from 'react';
import { UseFormRegister, RegisterOptions } from 'react-hook-form';

interface FormCheckboxProps {
  id: string;
  label: string;
  description?: string;
  register: UseFormRegister<any>;
  validation?: RegisterOptions;
  disabled?: boolean;
}

export function FormCheckbox({
  id,
  label,
  description,
  register,
  validation = {},
  disabled = false,
}: FormCheckboxProps) {
  return (
    <div className="relative flex items-start">
      <div className="flex h-5 items-center">
        <input
          type="checkbox"
          id={id}
          {...register(id, validation)}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
        {description && (
          <p className="text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}