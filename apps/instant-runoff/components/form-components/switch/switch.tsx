import React, { ChangeEventHandler } from 'react';
import { FormComponent } from '@ranked-choice-voting/types';

type SwitchProps = {
  id: string;
  isChecked?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  label: string;
};

export function Switch(props: FormComponent<SwitchProps>) {
  const {
    id,
    isChecked,
    disabled = false,
    onChange,
    label,
    register,
    name,
  } = props;
  const additionalProps = register ? { ...register(name) } : {};
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <span className="mr-3 text-sm text-gray-900 dark:text-gray-300">
        {label}
      </span>
      <input
        id={id}
        type="checkbox"
        disabled={disabled}
        checked={isChecked}
        className="sr-only peer"
        onChange={onChange}
        {...additionalProps}
      />
      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 px-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  );
}
