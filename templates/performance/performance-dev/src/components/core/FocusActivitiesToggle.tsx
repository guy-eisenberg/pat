import { c, p } from '../../lib';
import ToggleButton from './ToggleButton';

interface FocusActivitiesToggleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onlyFocus: boolean;
  setOnlyFocus: (onlyFocus: boolean) => void;
  overrideMobile?: boolean;
}

const FocusActivitiesToggle: React.FC<FocusActivitiesToggleProps> = ({
  onlyFocus,
  setOnlyFocus,
  overrideMobile = false,
  ...rest
}) => {
  return (
    <div
      className={c(
        'flex items-center gap-4 rounded-full border border-theme-border bg-[#ededed] px-4 py-1 pr-1',
        rest.className
      )}
    >
      <div className="flex items-center">
        <img
          alt="mortarboard icon"
          className="h-6 w-6"
          src={p('icons/mortarboard.svg')}
        />
        {!overrideMobile && (
          <span className="ml-4 hidden text-[13px] text-[#959595] md:inline-block">
            Show Focus Activities
          </span>
        )}
      </div>
      <ToggleButton
        className="ml-auto h-full"
        toggled={onlyFocus}
        onToggle={setOnlyFocus}
      />
    </div>
  );
};

export default FocusActivitiesToggle;
