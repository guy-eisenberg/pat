import { c, p } from '../../lib';
import { ImprovementRate } from '../../types';

interface ImprovementRateIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  improvementRate: ImprovementRate;
}

const RATES: { rate: ImprovementRate; icon: string }[] = [
  { rate: 'fast', icon: 'rocket' },
  { rate: 'medium', icon: 'jet' },
  { rate: 'slow', icon: 'paper_aeroplane' },
];

const ImprovementRateIndicator: React.FC<ImprovementRateIndicatorProps> = ({
  improvementRate,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'flex w-16 flex-col items-center justify-between rounded-full border border-theme-border bg-[#efefef] py-2',
        rest.className
      )}
    >
      {RATES.map((rate) => {
        const active = rate.rate === improvementRate;

        return (
          <div className="relative" key={rate.rate}>
            {active && rate.rate !== 'slow' && (
              <div
                className={c(
                  'absolute left-1/2 top-[75%] h-5 w-5/6 -translate-x-1/2 bg-gradient-to-t from-transparent',
                  rate.rate === 'fast' && 'via-theme-green/30 to-theme-green',
                  rate.rate === 'medium' &&
                    'via-theme-yellow/30 to-theme-yellow'
                )}
              />
            )}
            <div
              className={c(
                'relative flex h-12 w-12 items-center justify-center',
                active && 'rounded-full border border-theme-border bg-white'
              )}
              style={{
                boxShadow: active ? '0px 0px 5px 0px #e5e3e3' : undefined,
              }}
            >
              <img
                src={p(
                  `icons/${rate.icon}_${active ? 'active' : 'inactive'}.svg`
                )}
                className="w-7"
                alt={rate.icon}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImprovementRateIndicator;
