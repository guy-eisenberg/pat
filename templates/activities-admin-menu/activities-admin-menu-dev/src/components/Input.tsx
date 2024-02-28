import { c } from '../lib';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ ...rest }) => {
  return (
    <input
      {...rest}
      className={c(
        'rounded-md border border-themeLightGray p-2 transition',
        rest.disabled && '!bg-themeLightGray/30',
        rest.className
      )}
    />
  );
};

export default Input;
