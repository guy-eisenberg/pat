import { useMemo } from 'react';
import { c, getTimePreview, p } from '../../lib';
import { Strategy, Target } from '../../types';

interface TargetsTabProps {
  strategy: Strategy;
}

const TargetsTab: React.FC<TargetsTabProps> = ({ strategy }) => {
  const prepareTargets = useMemo(
    () => strategy.targets.filter((target) => target.segment === 'prepare'),
    [strategy.targets]
  );

  const weaknessTargets = useMemo(
    () => strategy.targets.filter((traget) => traget.segment === 'weakness'),
    [strategy.targets]
  );

  return (
    <>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <img
            alt="mortarboard icon"
            className="mb-1 h-7 w-7"
            src={p('icons/bulletpoint_target.svg')}
          />
          <span className="font-inter text-lg font-semibold text-[#919191]">
            <span style={{ color: strategy?.assessor_color }}>
              {prepareTargets.length} Target{prepareTargets.length > 1 && 's'}
            </span>{' '}
            for your <span className="text-[#4c4c4c]">Test Preparation</span>
          </span>
        </div>
        <div className="text-[15px] text-[#545454] md:ml-8">
          <span className="mb-6 block leading-6 md:leading-8">
            We have established Targets for you to achieve prior to your
            assessment date:
          </span>
          <div className="mb-6 flex flex-col gap-4">
            {prepareTargets.map((target) => (
              <TargetCard target={target} key={target.id} />
            ))}
          </div>
          <span className="block text-xs font-semibold md:text-sm">
            To see your Targets, go to{' '}
            <a
              href={import.meta.env.VITE_FOCUS_TARGETS_URL}
              className="font-medium"
            >
              Targets
            </a>
            .
          </span>
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <img
            alt="mortarboard icon"
            className="mb-1 h-7 w-7"
            src={p('icons/bulletpoint_target.svg')}
          />
          <span className="font-inter text-lg font-semibold text-[#919191]">
            <span style={{ color: strategy?.assessor_color }}>
              {weaknessTargets.length} Target{weaknessTargets.length > 1 && 's'}
            </span>{' '}
            to improve your <span className="text-[#4c4c4c]">Weaknesses</span>
          </span>
        </div>
        <div className="text-[15px] text-[#545454] md:ml-8">
          <span className="mb-6 block leading-6 md:leading-8">
            We have also established the following Targets for you to achieve,
            to aid in improving areas of weakness:
          </span>
          <div className="mb-6 flex flex-col gap-4">
            {weaknessTargets.map((target) => (
              <TargetCard target={target} key={target.id} />
            ))}
          </div>
          <span className="block text-xs font-semibold md:text-sm">
            To see your Targets, go to{' '}
            <a
              href={import.meta.env.VITE_FOCUS_TARGETS_URL}
              className="font-medium"
            >
              Targets
            </a>
            .
          </span>
        </div>
      </div>
    </>
  );
};

export default TargetsTab;

interface TargetCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  target: Target;
}

const TargetCard: React.FC<TargetCardProps> = ({ target, ...rest }) => {
  const label = useMemo(() => {
    const timeLabel = getTimePreview(target.end_time);

    const targetName =
      target.target_type === 'activity' ? `'${target.name}'` : target.name;

    switch (target.type) {
      case 'improvement':
        return (
          <>
            Improve {targetName} by {target.figure}%{' '}
            <span className="font-semibold text-[#666]">by {timeLabel}</span>.
          </>
        );
      case 'score':
        return (
          <>
            Achieve Score of {target.figure}% in {targetName}{' '}
            <span className="font-semibold text-[#666]">by {timeLabel}</span>.
          </>
        );
    }
  }, [target]);

  return (
    <a
      {...rest}
      href={import.meta.env.VITE_FOCUS_TARGETS_URL}
      className={c(
        'min-h-14 relative flex w-full items-center gap-2 overflow-hidden rounded-[4px] border border-theme-border bg-white py-1 pl-2 pr-4 shadow-md shadow-[#e3e3e378] hover:ring-1 hover:ring-theme-green md:w-[576px]',
        rest.className
      )}
    >
      <img
        alt="target icon"
        className="h-8 w-8"
        src={p('icons/new_target.svg')}
      />
      <span className="mt-[2px] !text-[13px] !font-normal text-[#999]">
        {label}
      </span>
      <div className="absolute bottom-0 right-0 top-0 w-1 bg-theme-dark-blue" />
    </a>
  );
};
