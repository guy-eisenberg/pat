import { c } from '../../lib';

interface BooleanButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  flag: boolean;
  onToggle: (flag: boolean) => void;
}

const BooleanButton: React.FC<BooleanButtonProps> = ({ flag, onToggle }) => {
  return (
    <div className="flex overflow-hidden rounded-md border border-themeLightGray text-themeDarkGray">
      <button
        className={c(
          'w-1/2 px-8 py-2 transition',
          !flag
            ? 'border border-themeDarkBlue bg-themeBlue text-white'
            : 'border border-transparent bg-white'
        )}
        onClick={() => onToggle(false)}
      >
        No
      </button>
      <button
        className={c(
          'w-1/2 px-8 py-2 transition',
          flag
            ? 'border border-themeDarkBlue bg-themeBlue text-white'
            : 'border border-transparent bg-white'
        )}
        onClick={() => onToggle(true)}
      >
        Yes
      </button>
    </div>
  );
};

export default BooleanButton;
