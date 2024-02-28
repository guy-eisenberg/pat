import { forwardRef } from 'react';
import { c } from '../lib';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'blue' | 'green' | 'gray';
  look?: 'rounded' | 'rect';
  overrideClick?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      color = 'blue',
      look = 'rounded',
      type,
      overrideClick = false,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        {...rest}
        className={c(
          'px-6 py-2 font-semibold transition duration-75',
          overrideClick && 'scale-95 brightness-95',
          color === 'blue' && 'bg-theme-blue text-white',
          color === 'green' && 'bg-theme-green text-white',
          color === 'gray' && 'bg-transparent text-theme-medium-gray',
          look === 'rounded' && 'rounded-full',
          look === 'rect' && 'rounded-md',
          rest.disabled
            ? 'bg-theme-light-gray text-white'
            : c(
                'hover:scale-105 active:scale-95 active:brightness-95',
                color !== 'gray' && 'hover:shadow-md'
              ),
          rest.className
        )}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

export default Button;
