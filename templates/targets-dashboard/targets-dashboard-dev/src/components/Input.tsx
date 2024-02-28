import { c } from '../lib';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ ...rest }) => {
  return (
    <div>
      <input
        {...rest}
        className={c(
          'rounded-[3px] border border-theme-border bg-[#f6f6f6] p-2 text-theme-extra-dark-gray transition',
          rest.disabled && '!bg-theme-border/30',
          rest.className
        )}
      />
    </div>
  );
};

export default Input;
