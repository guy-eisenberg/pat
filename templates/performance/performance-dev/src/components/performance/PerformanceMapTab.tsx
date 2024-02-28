import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { c, p } from '../../lib';
import type {
  ActivityPerformance,
  PerformanceType,
  SkillPefromance,
} from '../../types';
import { FocusActivitiesToggle, HorizontalRadio, ScorePie } from '../core';

interface PerformanceMapTabProps {
  activities: ActivityPerformance[];
  skills: SkillPefromance[];
  goToDaybydayTab: (filterKey: string) => void;
}

const PerformanceMapTab: React.FC<PerformanceMapTabProps> = ({
  activities,
  skills,
  goToDaybydayTab,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftBarRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLSpanElement>(null);

  const [showType, setShowType] = useState<PerformanceType>('activity');
  const [onlyFocus, setOnlyFocus] = useState(false);

  const [mapTop, setMapTop] = useState(0);
  const [mapBottom, setMapBottom] = useState(0);

  const [colWidth, setColWidth] = useState(0);
  const [colHeight, setColHeight] = useState(0);

  useLayoutEffect(() => {
    if (containerRef.current) {
      if (filterBarRef.current) {
        const mapTop = filterBarRef.current.getBoundingClientRect().top + 8;

        setMapTop(mapTop);
      }

      if (bottomTextRef.current) {
        const mapBottom =
          containerRef.current.getBoundingClientRect().bottom -
          bottomTextRef.current.getBoundingClientRect().bottom +
          bottomTextRef.current.clientHeight +
          8;

        setMapBottom(mapBottom);
      }
    }
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setColWidth(containerRef.current.clientWidth / 3);
      setColHeight(containerRef.current.clientHeight);
    }
  }, [mapTop, mapBottom]);

  const filteredData = useMemo(() => {
    if (showType === 'skill') return skills;
    else return activities.filter((activity) => !onlyFocus || activity.focus);
  }, [activities, skills, showType, onlyFocus]);

  const { lowMedianItems, averageMedianItems, highMedianItems } =
    useMemo(() => {
      return {
        lowMedianItems: filteredData
          .filter((i) => i.median === 'below')
          .sort((i1, i2) => (i1.score || 0) - (i2.score || 0))
          .map((i) => {
            var top = '0%';
            if (i.improvement_rate_speed === 'medium') top = '33%';
            else if (i.improvement_rate_speed === 'fast') top = '66%';

            return {
              ...i,
              top,
            };
          }),
        averageMedianItems: filteredData
          .filter((i) => i.median === 'average')
          .sort((i1, i2) => (i1.score || 0) - (i2.score || 0))
          .map((i) => {
            var top = '0%';
            if (i.improvement_rate_speed === 'medium') top = '33%';
            else if (i.improvement_rate_speed === 'fast') top = '66%';

            return {
              ...i,
              top,
            };
          }),
        highMedianItems: filteredData
          .filter((i) => i.median === 'above')
          .sort((i1, i2) => (i1.score || 0) - (i2.score || 0))
          .map((i) => {
            var top = '0%';
            if (i.improvement_rate_speed === 'medium') top = '33%';
            else if (i.improvement_rate_speed === 'fast') top = '66%';

            return {
              ...i,
              top,
            };
          }),
      };
    }, [filteredData]);

  return (
    <div className="relative flex flex-1" ref={scrollRef}>
      <div
        className="sticky left-0 z-10 flex min-h-[1000px] shrink-0 flex-col md:md:min-h-[unset]"
        ref={leftBarRef}
      >
        <div className="flex flex-1 shrink-0 items-center border-b border-r border-theme-border bg-white px-2 shadow-md md:px-8">
          <img
            alt="rocket"
            src={p('icons/rocket_inactive.svg')}
            className="h-10 w-10 md:h-16 md:w-16"
          />
        </div>
        <div className="flex flex-1 shrink-0 items-center border-b border-r border-theme-border bg-white px-2 shadow-md md:px-8">
          <img
            alt="jet"
            src={p('icons/jet_inactive.svg')}
            className="h-10 w-10 md:h-16 md:w-16"
          />
        </div>
        <div className="flex flex-1 shrink-0 items-center border-b border-r border-theme-border bg-white px-2 shadow-md md:px-8">
          <img
            alt="paper aeroplane"
            src={p('icons/paper_aeroplane_inactive.svg')}
            className="h-10 w-10 md:h-16 md:w-16"
          />
        </div>
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="relative grid h-full min-h-[1000px] min-w-[1100px] grid-cols-3 grid-rows-3 overflow-x-auto md:min-h-[unset]">
          <div className="flex-1 bg-[#fef0ee]" />
          <div className="flex-1 bg-[#fdfcec]" />
          <div className="flex-1 bg-[#f4fcec]" />
          <div className="flex-1 bg-[#fce9e8]" />
          <div className="flex-1 bg-[#fdfae5]" />
          <div className="flex-1 bg-[#f0fae5]" />
          <div className="relative flex-1 bg-[#fbe2df]">
            <span
              className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-theme-border bg-white px-4 py-2 text-center text-xs font-semibold text-[#e7665b] shadow-md md:text-lg"
              ref={bottomTextRef}
            >
              Below Average
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#f3b2ab]" />
          </div>
          <div className="relative flex-1 bg-[#fcf9db]">
            <span className="text-centerwhitespace-nowrap absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-theme-border bg-white px-4 py-2 text-xs  font-semibold text-[#efdc46] shadow-md md:text-lg">
              Average
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#f7ed9f]" />
          </div>
          <div className="relative flex-1 bg-[#ebf9db]">
            <span className="text-centerwhitespace-nowrap absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-theme-border bg-white px-4 py-2 text-xs  font-semibold text-[#7ce027] shadow-md md:text-lg">
              Above Average
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#95de43]" />
          </div>

          <div
            className="absolute left-0 right-0 flex items-start justify-start"
            style={{ top: mapTop, bottom: mapBottom }}
            ref={containerRef}
          >
            <div className="relative h-full flex-1">
              {lowMedianItems.map((item, scoreIndex) => {
                const left =
                  (colWidth / (lowMedianItems.length + 1)) * (scoreIndex + 1);

                const minTop = (() => {
                  switch (item.improvement_rate_speed) {
                    case 'slow':
                      return 0;
                    case 'medium':
                      return colHeight / 3;
                    case 'fast':
                      return (colHeight / 3) * 2;
                  }
                })();

                const similarIRItems = lowMedianItems.filter(
                  (i) =>
                    i.improvement_rate_speed === item.improvement_rate_speed
                );
                const irIndex = similarIRItems.findIndex(
                  (i) => i.id === item.id
                );

                const top =
                  (colHeight / 3 / (similarIRItems.length + 1)) * (irIndex + 1);

                return (
                  <ItemCard
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left, top: minTop + top }}
                    type={showType}
                    performance={item}
                    goToDaybydayTab={goToDaybydayTab}
                    key={item.id}
                  />
                );
              })}
            </div>
            <div className="relative h-full flex-1">
              {averageMedianItems.map((item, scoreIndex) => {
                const left =
                  (colWidth / (averageMedianItems.length + 1)) *
                  (scoreIndex + 1);

                const minTop = (() => {
                  switch (item.improvement_rate_speed) {
                    case 'slow':
                      return 0;
                    case 'medium':
                      return colHeight / 3;
                    case 'fast':
                      return (colHeight / 3) * 2;
                  }
                })();

                const similarIRItems = averageMedianItems.filter(
                  (i) =>
                    i.improvement_rate_speed === item.improvement_rate_speed
                );
                const irIndex = similarIRItems.findIndex(
                  (i) => i.id === item.id
                );

                const top =
                  (colHeight / 3 / (similarIRItems.length + 1)) * (irIndex + 1);

                return (
                  <ItemCard
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left, top: minTop + top }}
                    type={showType}
                    goToDaybydayTab={goToDaybydayTab}
                    performance={item}
                    key={item.id}
                  />
                );
              })}
            </div>
            <div className="relative h-full flex-1">
              {highMedianItems.map((item, scoreIndex) => {
                const left =
                  (colWidth / (highMedianItems.length + 1)) * (scoreIndex + 1);

                const minTop = (() => {
                  switch (item.improvement_rate_speed) {
                    case 'slow':
                      return 0;
                    case 'medium':
                      return colHeight / 3;
                    case 'fast':
                      return (colHeight / 3) * 2;
                  }
                })();

                const similarIRItems = highMedianItems.filter(
                  (i) =>
                    i.improvement_rate_speed === item.improvement_rate_speed
                );
                const irIndex = similarIRItems.findIndex(
                  (i) => i.id === item.id
                );

                const top =
                  (colHeight / 3 / (similarIRItems.length + 1)) * (irIndex + 1);

                return (
                  <ItemCard
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left, top: minTop + top }}
                    performance={item}
                    goToDaybydayTab={goToDaybydayTab}
                    type={showType}
                    key={item.id}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        className={c(
          'fixed left-16 mt-2 flex justify-between gap-6 rounded-full border border-theme-border bg-white p-1 text-sm shadow-sm md:absolute md:left-40 md:right-[unset] md:top-4 md:p-2',
          showType === 'activity' && 'right-2'
        )}
        ref={filterBarRef}
      >
        <HorizontalRadio
          className="[&_.select-option]:!px-3 [&_.select-option]:!py-2"
          options={[
            { key: 'activity', label: 'Activity' },
            { key: 'skill', label: 'Skill' },
          ]}
          selectedOption={showType}
          onOptionChange={(type) => setShowType(type as PerformanceType)}
        />
        {showType === 'activity' && (
          <FocusActivitiesToggle
            onlyFocus={onlyFocus}
            setOnlyFocus={setOnlyFocus}
          />
        )}
      </div>
    </div>
  );
};

export default PerformanceMapTab;

interface ItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  performance: ActivityPerformance | SkillPefromance;
  type: 'activity' | 'skill';
  goToDaybydayTab: (filterKey: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  type,
  performance,
  goToDaybydayTab,
  ...rest
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (elementRef.current) setWidth(elementRef.current.clientWidth);
  }, []);

  const arrowsColor = (() => {
    switch (performance.median) {
      case 'below':
        return 'red';
      case 'average':
        return 'yellow';
      case 'above':
        return 'green';
      default:
        return 'yellow';
    }
  })();

  return (
    <div
      {...rest}
      className={c(
        'flex min-w-max cursor-pointer items-center gap-2 rounded-md bg-white px-2 py-1 shadow-md',
        rest.className
      )}
      style={{ ...rest.style, marginLeft: width / 4 }}
      onClick={() =>
        goToDaybydayTab(`${type}-${performance.id}-${performance.name}`)
      }
      ref={elementRef}
    >
      <span className="text-sm font-medium text-theme-medium-gray">
        {performance.name}
      </span>
      <ScorePie
        className="h-10 w-10"
        showPlane={false}
        precentage={false}
        fontSize={10}
        innerRadius="75%"
        score={performance.score || 0}
        median={performance.median}
      />
      {performance.increased_improvement && (
        <MovingArrows
          className="absolute left-[calc(100%+4px)]"
          direction="vertical"
          color={arrowsColor}
        />
      )}
      {performance.increased_score && (
        <MovingArrows
          className="absolute bottom-[calc(100%+4px)] right-0"
          direction="horizontal"
          color={arrowsColor}
        />
      )}
    </div>
  );
};

interface MovingArrowsProps extends React.HTMLAttributes<HTMLDivElement> {
  color: 'red' | 'yellow' | 'green';
  direction: 'vertical' | 'horizontal';
}

const MovingArrows: React.FC<MovingArrowsProps> = ({
  color,
  direction,
  ...rest
}) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => {
        if (tick < 2) return tick + 1;

        return 0;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  if (direction === 'vertical')
    return (
      <div className={c('flex w-2 flex-col gap-[1px]', rest.className)}>
        {[null, null, null].map((_, i) => {
          const opacity = 1 / (Math.abs(2 - i - tick) + 1);

          return (
            <img
              alt="arrow"
              className="h-2 w-2"
              style={{ opacity }}
              src={p(`icons/arrow_${color}.svg`)}
              key={i}
            />
          );
        })}
      </div>
    );
  else
    return (
      <div className={c('flex h-2 gap-[1px]', rest.className)}>
        {[null, null, null].map((_, i) => {
          const opacity = 1 / (Math.abs(i - tick) + 1);

          return (
            <img
              alt="arrow"
              className="h-2 w-2 rotate-90"
              style={{ opacity }}
              src={p(`icons/arrow_${color}.svg`)}
              key={i}
            />
          );
        })}
      </div>
    );
};
