import { c } from '../../lib';

interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  toggled,
  onToggle,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={c(
        'border-themeLightGray relative h-7 w-[72px] rounded-[500px] border transition hover:brightness-95 md:h-9',
        toggled ? 'bg-[#3793d1] text-white' : 'bg-[#adadad] text-white',
        rest.className
      )}
      onClick={() => onToggle(!toggled)}
    >
      <span
        className={c(
          'absolute top-1/2 left-2 -translate-y-1/2 text-xs transition-all',
          toggled ? undefined : 'translate-x-7'
        )}
      >
        {toggled ? 'ON' : 'OFF'}
      </span>
      <div
        className={c(
          'absolute top-1/2 right-1 h-5 w-5 -translate-y-1/2 rounded-[500px] transition-all md:h-6 md:w-6',
          toggled
            ? 'bg-white'
            : '-translate-x-[42px] bg-white md:-translate-x-[38px]'
        )}
      />
    </button>
  );
};

export default ToggleButton;
