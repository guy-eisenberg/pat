import { useMemo } from 'react';
import { fetchActivityPerformance } from '../../api';
import { useQuery } from '../../hooks';
import { c, getDatePreview } from '../../lib';
import {
  ImprovementProgress,
  ImprovementRateIndicator,
  InformationTable,
  RecentActivityGraph,
  TargetsInformation,
} from '../common';
import { ScorePie } from '../core';

const DashboardSidebar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const performance = useQuery(fetchActivityPerformance, undefined);

  const recentActivityFigures = useMemo(() => {
    if (!performance || !performance.previous_days_scores) return null;

    return performance.previous_days_scores.map((score, i) => {
      const date = new Date();

      date.setDate(date.getDate() - (i + 1));

      return {
        date,
        score,
      };
    });
  }, [performance]);

  if (!performance) return null;

  return (
    <div
      {...rest}
      className={c(
        'flex flex-col gap-8 p-4 scrollbar-none md:overflow-y-auto md:bg-[#f2f2f2]',
        rest.className
      )}
    >
      <a
        className="shrink-0 overflow-hidden rounded-md border border-[#dfdfdf] bg-white shadow-sm hover:!shadow-sm"
        href={import.meta.env.VITE_PERFORMANCE_URL}
      >
        <div className="bg-[#34424c] p-3 text-center text-white">
          {getDatePreview(new Date().getTime())}
        </div>
        <div className="flex items-center justify-around gap-3 p-4">
          <ScorePie
            className="h-[170px] w-[170px]"
            fontSize={72}
            lineHeight="82px"
            median={performance.median}
            score={performance.score}
          />
          <ImprovementRateIndicator
            className="my-2 flex shrink-0 md:hidden lg:flex"
            improvementRate={performance.improvement_rate_speed}
          />
        </div>
      </a>
      <div className="hidden shrink-0 flex-col overflow-hidden rounded-md border border-[#dfdfdf] bg-white shadow-sm md:flex md:h-64 xl:h-48 xl:flex-row">
        <ImprovementProgress
          className="flex-1 p-4 px-10"
          stages={performance.scores_segments}
          style={{ boxShadow: '5px 0px 15px 0px rgba(0,0,0,0.04)' }}
        />
        <TargetsInformation
          active={performance.targets.active}
          achieved={performance.targets.achieved}
          missed={performance.targets.missed}
          wrap
        />
      </div>
      <div className="hidden flex-1 flex-col rounded-md border border-[#dfdfdf] bg-white shadow-sm md:flex">
        <InformationTable
          className="border-b border-r-0 border-b-theme-border"
          scores={performance.all_scores}
          overallImprovement={performance.overall_improvement}
          improvementRate={performance.improvement_rate}
          time={performance.total_duration}
          runs={performance.runs}
          fontSize={26}
          smallFontSize={14}
          wrap
        />
        <RecentActivityGraph
          className="min-h-[250px] flex-1 rounded-b-md"
          figures={recentActivityFigures}
        />
      </div>
    </div>
  );
};

export default DashboardSidebar;
