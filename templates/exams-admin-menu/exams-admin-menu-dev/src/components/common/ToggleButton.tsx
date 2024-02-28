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
        'relative h-7 w-16 rounded-[500px] border border-themeLightGray',
        toggled ? 'bg-themeBlue text-white' : 'bg-white text-themeBlue'
      )}
      onClick={() => onToggle(!toggled)}
    >
      <span
        className={c(
          'absolute top-1/2 left-2 -translate-y-1/2 text-xs transition-all',
          toggled ? undefined : 'translate-x-7'
        )}
      >
        {toggled ? 'On' : 'Off'}
      </span>
      <div
        className={c(
          'absolute top-1/2 right-1 h-3/4 w-7 -translate-y-1/2 rounded-[500px] transition-all',
          toggled ? 'bg-white' : '-translate-x-[26px] bg-themeBlue'
        )}
      />
    </button>
  );
};

export default ToggleButton;
