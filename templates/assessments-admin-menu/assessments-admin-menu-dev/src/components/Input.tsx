import { c } from '../lib';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ ...rest }) => {
  return (
    <input
      {...rest}
      className={c(
        'rounded-md border border-theme-light-gray p-2 transition',
        rest.disabled && '!bg-theme-light-gray/30',
        rest.className
      )}
    />
  );
};

export default Input;
