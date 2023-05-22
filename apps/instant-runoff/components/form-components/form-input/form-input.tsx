import React from 'react';
import type { FieldValues, UseFormRegister } from 'react-hook-form';
import { Button } from '../button';

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
  rightAddon?: {
    title?: string;
    onClick?: () => void;
  };
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
    rightAddon,
  } = props;
  const additionalProps = register ? { ...register(name) } : {};

  const derivedClassName = isRequired ? 'required-field' : '';
  return (
    <div role="group">
      <label
        htmlFor={id}
        className={`${derivedClassName} block mb-2 text-sm font-medium text-gray-900 dark:text-white text-lg ${
          isInvalid
            ? 'text-red-600 dark:text-red-500'
            : 'text-600 dark:text-500'
        }}`}
      >
        {label}
      </label>
      <div className="flex flex-wrap items-stretch w-full mb-1">
        <input
          id={id}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          type="text"
          className={`flex-shrink flex-grow flex-auto w-px flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            rightAddon && 'rounded-r-none'
          }`}
          {...additionalProps}
        />
        {rightAddon && (
          <Button
            id={`${id}-right-addon`}
            onClick={rightAddon.onClick}
            className="flex -mr-px rounded-lg rounded-l-none border border-l-0 border-gray-300  px-3 whitespace-no-wrap"
          >
            {rightAddon.title}
          </Button>
        )}
      </div>
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
