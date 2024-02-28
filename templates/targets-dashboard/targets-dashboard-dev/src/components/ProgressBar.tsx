import { c } from '../lib';

interface ProgressStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number;
  showLabel?: boolean;
  selected: boolean;
}

const ProgressStatus: React.FC<ProgressStatusProps> = ({
  progress,
  showLabel = true,
  selected,
  ...rest
}) => {
  const label = getProgressLabel(progress);
  const color = getProgressColor(progress);

  return (
    <div {...rest} className={c('flex items-center gap-4', rest.className)}>
      <div
        className={c(
          'h-4 w-64 rounded-full',
          selected ? 'bg-[#059fca]' : 'bg-[#efefef]'
        )}
      >
        {progress > 0 && (
          <div
            className={c(
              `box-border h-full rounded-full`,
              selected ? '!bg-[#0b8fb3]' : 'border',
              progress !== 100 && 'rounded-r-none'
            )}
            style={{
              width: `calc(100%*(${progress}/100))`,
              backgroundColor: `${color}AA`,
              borderColor: color,
            }}
          />
        )}
      </div>
      {showLabel && (
        <span style={progress > 75 ? { color, fontWeight: 500 } : undefined}>
          {label}
        </span>
      )}
    </div>
  );

  function getProgressLabel(progress: number) {
    if (progress <= 33) return 'Keep going!';
    else if (progress > 33 && progress <= 75) return 'Nearly there!';
    else if (progress > 75 && progress < 100) return "You're so close!";

    return 'Done!';
  }

  function getProgressColor(progress: number) {
    if (selected) return '#fff';

    if (progress <= 33) return '#e9de73';
    else if (progress > 33 && progress <= 75) return '#7aadeb';
    else if (progress > 75 && progress < 100) return '#97e275';

    return 'Done!';
  }
};

export default ProgressStatus;
