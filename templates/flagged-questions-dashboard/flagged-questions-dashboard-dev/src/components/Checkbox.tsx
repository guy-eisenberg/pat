import { c, p } from '../lib';

const Checkbox: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    checked: boolean | 'half';
    onToggle: () => void;
  }
> = ({ checked = true, onToggle, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'relative h-4 w-4 rounded-sm',
        checked ? 'bg-theme-dark-blue' : 'border border-theme-light-gray bg-white',
        rest.className
      )}
      onClick={(e) => {
        if (rest.onClick) rest.onClick(e);

        onToggle();
      }}
    >
      <img
        alt="check icon"
        src={p('icons/icon_check.svg')}
        className={c(
          'absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2',
          checked === true ? 'opacity 100' : 'opacity-0'
        )}
      />
    </button>
  );
};

export default Checkbox;
