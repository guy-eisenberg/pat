import { c } from '../../lib';
import { ProgressBar } from '../core';

interface ImprovementProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  stages: number[] | null;
  progressBarClassName?: string;
}

const ImprovementProgress: React.FC<ImprovementProgressProps> = ({
  stages,
  progressBarClassName,
  ...rest
}) => {
  return (
    <div {...rest} className={c('flex flex-col', rest.className)}>
      <span className="text-sm text-theme-dark-gray">Progress</span>
      {stages !== null && stages[2] > stages[1] && stages[1] > stages[0] ? (
        <ProgressBar stages={stages} className={progressBarClassName} />
      ) : (
        <span className="my-auto self-center text-lg text-theme-light-gray">
          Insufficient Data
        </span>
      )}
    </div>
  );
};

export default ImprovementProgress;
