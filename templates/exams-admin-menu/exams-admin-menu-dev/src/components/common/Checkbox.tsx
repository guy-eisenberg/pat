import { c } from '../../lib';

interface CheckboxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ toggled, onToggle, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'flex h-4 w-4 shrink-0 items-center justify-center border border-themeDarkGray bg-themeLightGray transition',
        toggled ? '!bg-white' : undefined,
        rest.className
      )}
      onClick={() => onToggle(!toggled)}
    >
      <div
        className={c(
          'h-3 w-3 bg-themeBlue transition',
          toggled ? 'opacity-100' : 'opacity-0'
        )}
      />
    </button>
  );
};

export default Checkbox;
