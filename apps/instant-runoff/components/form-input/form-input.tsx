import React from 'react';
import type { FieldValues, UseFormRegister } from 'react-hook-form';

type InputProps = {
  errorMessage?: string;
  helperText?: string;
  id: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
};

type ControllerProps = {
  register: UseFormRegister<FieldValues>;
  name: string;
};

type NoControllerProps = { register?: never; name?: never };

type FormInputProps =
  | (InputProps & ControllerProps)
  | (InputProps & NoControllerProps);

export function FormInput(props: FormInputProps) {
  const {
    errorMessage,
    helperText,
    id,
    isInvalid = false,
    isRequired = false,
    label,
    name,
    onChange,
    placeholder,
    register,
    value,
  } = props;
  const additionalProps = register ? { ...register(name) } : {};

  const derivedClassName = isRequired ? 'required-field' : '';
  return (
    <div role="group">
      <label
        htmlFor={id}
        className={`${derivedClassName} block mb-2 text-sm font-medium text-gray-900 dark:text-white ${
          isInvalid
            ? 'text-red-600 dark:text-red-500'
            : 'text-600 dark:text-500'
        }}`}
      >
        {label}
      </label>
      <input
        id={id}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-1"
        {...additionalProps}
      />
      {isInvalid ? (
        <span className="mt-2 text-sm text-red-600 dark:text-red-500">
          {errorMessage}
        </span>
      ) : (
        <span className="mt-2 text-sm text-gray-600 dark:text-gray-600">
          {helperText}
        </span>
      )}
    </div>
  );
}
