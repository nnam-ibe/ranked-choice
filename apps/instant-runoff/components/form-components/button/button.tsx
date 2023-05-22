import React from 'react';
import { Spinner } from '../../spinner/spinner';

type ButtonProps = {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

export function Button(props: ButtonProps) {
  const {
    children,
    onClick,
    className = '',
    isDisabled = false,
    isLoading = false,
    type = 'button',
  } = props;

  const derivedClassName =
    isDisabled || isLoading
      ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed'
      : 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800';

  return (
    <button
      className={`${derivedClassName} text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center relative ${className}`}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      type={type}
    >
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      {isLoading && (
        <div className="loadingContainer absolute left-0 right-0 m-auto top-1/2 -translate-y-1/2 z-10">
          <Spinner />
        </div>
      )}
    </button>
  );
}
