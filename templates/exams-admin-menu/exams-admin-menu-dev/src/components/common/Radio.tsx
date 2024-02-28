import React, { useRef } from 'react';
import { c } from '../../lib';

export interface RadioProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  name: string;
  onCheckedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Radio: React.FC<RadioProps> = ({
  checked,
  onCheckedChange,
  name,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        {...rest}
        className={c(
          'flex h-5 w-5 items-center justify-center rounded-full border border-themeLightGray',
          rest.className
        )}
        onClick={() => {
          if (inputRef.current) inputRef.current.click();
        }}
      >
        <div
          className={c(
            'h-3 w-3 rounded-full bg-themeBlue transition',
            checked ? 'opacity-100' : 'opacity-0'
          )}
        />
      </button>
      <input
        className="!hidden"
        type="radio"
        name={name}
        onChange={onCheckedChange}
        hidden
        ref={inputRef}
      />
    </>
  );
};

export default Radio;
