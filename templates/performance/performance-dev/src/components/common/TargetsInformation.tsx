import { c, p } from '../../lib';

interface TargetsInformationProps extends React.HTMLAttributes<HTMLDivElement> {
  active: number;
  achieved: number;
  missed: number;
  fontSize?: number | string;
  wrap?: boolean;
}

const TargetsInformation: React.FC<TargetsInformationProps> = ({
  active,
  achieved,
  missed,
  fontSize,
  wrap = false,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'flex justify-between border-l border-l-theme-border',
        wrap
          ? 'flex-row border-l-0 border-t xl:flex-col xl:border-l xl:border-t-0'
          : 'flex-col',
        rest.className
      )}
    >
      <div
        className={c(
          'relative flex w-20 flex-1 items-center justify-center gap-3 border-b border-b-theme-border',
          wrap &&
            'border-0 border-b-0 border-r py-3 xl:flex-row xl:border-b xl:border-r-0 xl:py-0'
        )}
      >
        <img
          alt="set targets icon"
          className="mb-1 h-6 w-6"
          src={p('icons/target_set.svg')}
        />
        <span className="text-xl text-theme-dark-gray" style={{ fontSize }}>
          {active}
        </span>
        <div
          className={c(
            'absolute bg-theme-dark-blue',
            wrap
              ? 'bottom-0 left-0 right-0 h-1 xl:bottom-0 xl:left-[unset] xl:right-0 xl:top-0 xl:h-full xl:w-1'
              : 'bottom-0 right-0 top-0 h-full w-1'
          )}
        />
      </div>
      <div
        className={c(
          'relative flex w-20 flex-1 items-center justify-center gap-3 border-b border-b-theme-border',
          wrap &&
            'border-0 border-b-0 border-r py-3 xl:flex-row xl:border-b xl:border-r-0 xl:py-0'
        )}
      >
        <img
          alt="achieved targets icon"
          className="mb-1 h-6 w-6"
          src={p('icons/target_achieved.svg')}
        />
        <span className="text-xl text-theme-dark-gray" style={{ fontSize }}>
          {achieved}
        </span>
        <div
          className={c(
            'absolute bg-theme-green',
            wrap
              ? 'bottom-0 left-0 right-0 h-1 xl:bottom-0 xl:left-[unset] xl:right-0 xl:top-0 xl:h-full xl:w-1'
              : 'bottom-0 right-0 top-0 h-full w-1'
          )}
        />
      </div>
      <div
        className={c(
          'relative flex w-20 flex-1 items-center justify-center gap-3',
          wrap && 'border-0 py-3 xl:flex-row xl:py-0'
        )}
      >
        <img
          alt="missed targets icon"
          className="mb-1 h-6 w-6"
          src={p('icons/target_expired.svg')}
        />
        <span className="text-xl text-theme-dark-gray" style={{ fontSize }}>
          {missed}
        </span>
        <div
          className={c(
            'absolute bg-theme-red',
            wrap
              ? 'bottom-0 left-0 right-0 h-1 xl:bottom-0 xl:left-[unset] xl:right-0 xl:top-0 xl:h-full xl:w-1'
              : 'bottom-0 right-0 top-0 h-full w-1'
          )}
        />
      </div>
    </div>
  );
};

export default TargetsInformation;
