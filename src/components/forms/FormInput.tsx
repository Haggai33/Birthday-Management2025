import React from 'react';
import { UseFormRegister, RegisterOptions, FieldError } from 'react-hook-form';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  register: UseFormRegister<any>;
  validation?: RegisterOptions;
  error?: FieldError;
  disabled?: boolean;
}

export function FormInput({
  id,
  label,
  type = 'text',
  register,
  validation = {},
  error,
  disabled = false,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(id, validation)}
        disabled={disabled}
        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}