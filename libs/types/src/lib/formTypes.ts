import type { FieldValues, UseFormRegister } from 'react-hook-form';

export type ControllerProps = {
  register: UseFormRegister<FieldValues>;
  name: string;
};

export type NoControllerProps = { register?: never; name?: never };

export type FormComponent<T> = (T & ControllerProps) | (T & NoControllerProps);
