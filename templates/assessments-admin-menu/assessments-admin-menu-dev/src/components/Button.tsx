import { c } from '../lib';

export type ButtonLook = 'blue' | 'green' | 'black' | 'gray' | 'red';

interface HomePageButtonProps
  extends React.PropsWithChildren,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  look: ButtonLook;
}

const Button: React.FC<HomePageButtonProps> = ({ look, children, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'rounded-md px-4 py-2 text-sm font-semibold transition',
        !rest.disabled && 'hover:brightness-95',
        look === 'blue' && !rest.disabled
          ? 'bg-theme-blue text-white'
          : undefined,
        look === 'green' && !rest.disabled
          ? 'bg-theme-green text-white'
          : undefined,
        look === 'gray' && !rest.disabled ? 'text-theme-dark-gray' : undefined,
        look === 'black' && !rest.disabled
          ? 'bg-[#494949] text-white'
          : undefined,
        look === 'red' && !rest.disabled
          ? 'bg-theme-red text-white'
          : undefined,
        rest.disabled ? 'bg-theme-light-gray text-white' : undefined,
        rest.className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
