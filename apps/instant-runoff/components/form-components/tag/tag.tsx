import React from 'react';

type TagProps = { title: string; onDelete?: () => void };

export function Tag(props: TagProps) {
  const { title, onDelete } = props;
  return (
    <div className="bg-blue-500 text-white rounded py-1 px-4 inline-block ">
      <span>{title}</span>
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-1 opacity-50 hover:opacity-100"
        >
          <svg viewBox="0 0 512 512" focusable="false" className="w-5 h-5">
            <path
              fill="currentColor"
              d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
}
