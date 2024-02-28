import { c, p } from '../../lib';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  stages: number[];
  showLabels?: boolean;
  showCircles?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  stages,
  showLabels = true,
  showCircles = true,
  ...rest
}) => {
  if (stages[0] === stages[1]) stages[0] = 0;

  return (
    <div
      {...rest}
      className={c('flex w-full flex-1 items-center', rest.className)}
    >
      <div className="relative h-3 w-full rounded-full bg-[#f1f1f1]">
        {stages.map((stage, i) => {
          const width = i === 0 ? stage : stage - stages[i - 1];
          const left = i === 0 ? 0 : stages[i - 1];

          return (
            <div
              className={c(
                'absolute h-full',
                i === 0 && 'rounded-l-full bg-theme-dark-blue',
                i === 1 && 'bg-[#b8d5e8]',
                i === 1 && stages[0] === 0 && 'rounded-l-full',
                i === 2 && 'bg-[#cdecb3]',
                i === 2 && stage === 100 && 'rounded-r-full'
              )}
              style={{ width: `${width}%`, left: `${left}%` }}
              key={i}
            >
              {showLabels && (
                <div
                  className={c(
                    'absolute right-0 translate-x-1/2 font-semibold text-[#6a6a6a]',
                    i === 1 ? 'top-full mt-5' : 'bottom-full mb-5'
                  )}
                >
                  <img
                    alt="bubble"
                    className={c(
                      'mt-1 w-14 min-w-[3.5rem]',
                      i === 1 && 'mb-1 mt-0 rotate-180'
                    )}
                    style={{
                      filter:
                        i === 1
                          ? 'drop-shadow(0 -1px 1px rgb(0 0 0 / 0.0675))'
                          : 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.0675))',
                    }}
                    src={p('icons/bubble.svg')}
                  />
                  <div
                    className={c(
                      'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-baseline gap-[2px]',
                      i === 1 ? 'mt-[2px]' : '-mt-[1px]'
                    )}
                  >
                    {stage}
                    <span className="text-3xs font-light text-theme-light-gray">
                      %
                    </span>
                  </div>
                </div>
              )}
              {i === 0 || i === 2
                ? showCircles && (
                    <div
                      className={c(
                        'absolute right-0 top-1/2 z-10 h-6 w-6 -translate-y-1/2 translate-x-1/2 rounded-full border-[3px] border-white shadow-md',
                        i === 0 && 'bg-theme-dark-blue',
                        i === 2 && 'bg-theme-green'
                      )}
                    />
                  )
                : stages[1] > stages[0] && (
                    <img
                      alt="aircraft icon"
                      src={p('icons/aircraft_blue.svg')}
                      className="absolute right-0 top-1/2 z-10 h-11 min-h-[44px] w-11 min-w-[44px] -translate-y-1/2 translate-x-1/2 rotate-90"
                    />
                  )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
