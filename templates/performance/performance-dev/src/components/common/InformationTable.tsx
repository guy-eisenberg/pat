import { c, getFloatString } from '../../lib';
import ImprovementGraph from './ImprovementGraph';

interface InformationTableProps extends React.HTMLAttributes<HTMLDivElement> {
  scores: number[] | null;
  overallImprovement: number | null;
  improvementRate: number | null;
  time: number | null;
  runs: number | null;
  labelFontSize?: number | string;
  fontSize?: number | string;
  smallFontSize?: number | string;
  wrap?: boolean;
}

const InformationTable: React.FC<InformationTableProps> = ({
  scores,
  overallImprovement,
  improvementRate,
  time,
  runs,
  labelFontSize,
  fontSize,
  smallFontSize,
  wrap = false,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'grid grid-rows-2',
        wrap ? 'xl:grid-cols-2' : 'grid-cols-2',
        rest.className
      )}
    >
      <div
        className={c(
          'flex items-end gap-2 border-b border-theme-border p-4',
          wrap ? 'xl:border-r' : 'border-r'
        )}
      >
        <div className="flex h-full flex-1 flex-col justify-between gap-3">
          <span
            className="text-sm text-theme-dark-gray"
            style={{ fontSize: labelFontSize }}
          >
            Improvement
          </span>
          {overallImprovement !== null ? (
            <span className="whitespace-nowrap text-theme-dark-gray">
              <span style={{ fontSize }}>
                {getFloatString(overallImprovement)}
              </span>{' '}
              <span
                className="ml-1 text-xs text-theme-light-gray"
                style={{ fontSize: smallFontSize }}
              >
                %
              </span>
            </span>
          ) : (
            <span className="text-lg text-theme-light-gray">No Data</span>
          )}
        </div>
        {scores !== null && overallImprovement !== null && (
          <ImprovementGraph
            className="flex-1"
            height="60%"
            improvementRate={overallImprovement}
          />
        )}
      </div>
      <div className="flex flex-col justify-between gap-2 border-b border-theme-border p-4">
        <span
          className="text-sm text-theme-dark-gray"
          style={{ fontSize: labelFontSize }}
        >
          Improvement Rate
        </span>
        {improvementRate !== null ? (
          <span className=" whitespace-nowrap text-theme-dark-gray">
            <span style={{ fontSize }}>{getFloatString(improvementRate)}</span>{' '}
            <span
              className="ml-1 text-xs text-theme-light-gray"
              style={{ fontSize: smallFontSize }}
            >
              % per day
            </span>
          </span>
        ) : (
          <span className="text-lg text-theme-light-gray">No Data</span>
        )}
      </div>
      <div
        className={c(
          'flex flex-col justify-between gap-2 border-theme-border p-4',
          wrap ? 'border-b xl:border-b-0 xl:border-r' : 'border-b-0 border-r'
        )}
      >
        <span
          className="text-sm text-theme-dark-gray"
          style={{ fontSize: labelFontSize }}
        >
          Time
        </span>
        {time !== null ? (
          <span className="whitespace-nowrap text-theme-dark-gray">
            <span>
              <span style={{ fontSize }}>{Math.floor(time / 3600)}</span>{' '}
              <span
                className="ml-1 text-xs text-theme-light-gray"
                style={{ fontSize: smallFontSize }}
              >
                hours
              </span>
            </span>
            <span className="ml-2">
              <span style={{ fontSize }}>{Math.floor((time % 3600) / 60)}</span>{' '}
              <span
                className="ml-1 text-xs text-theme-light-gray"
                style={{ fontSize: smallFontSize }}
              >
                mins
              </span>
            </span>
          </span>
        ) : (
          <span className="text-lg text-theme-light-gray">No Data</span>
        )}
      </div>
      <div className="flex flex-col justify-between gap-2 p-4">
        <span
          className="text-sm text-theme-dark-gray"
          style={{ fontSize: labelFontSize }}
        >
          Runs
        </span>
        {runs !== null ? (
          <span>
            <span className="text-theme-dark-gray" style={{ fontSize }}>
              {runs}
            </span>
            <span
              className="ml-2 text-xs text-theme-light-gray"
              style={{ fontSize: smallFontSize }}
            >
              runs
            </span>
          </span>
        ) : (
          <span className="text-lg text-theme-light-gray">No Data</span>
        )}
      </div>
    </div>
  );
};

export default InformationTable;
