import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchOverallPerformance } from './api';
import {
  PerformanceDaybydayTab,
  PerformanceMapTab,
  PerformanceOverviewTab,
} from './components';
import { useDeviceInfo, useQuery } from './hooks';
import { c, p } from './lib';

export type PerformanceTab = 'overview' | 'day-by-day' | 'map';

const Performance: React.FC = () => {
  const { orientation } = useDeviceInfo();

  const [activatedTab, setActivatedTab] = useState<PerformanceTab>('overview');

  const performance = useQuery(fetchOverallPerformance, undefined);

  useEffect(() => {
    const url = new URL(window.location.href);
    const overrideFilterKey = url.searchParams.get('filter-key');

    if (overrideFilterKey) setActivatedTab('day-by-day');
  }, []);

  const tab = useMemo(() => {
    switch (activatedTab) {
      case 'overview':
        return performance ? (
          <PerformanceOverviewTab
            performance={performance}
            goToDaybydayTab={goToDaybydayTab}
          />
        ) : null;
      case 'day-by-day':
        return <PerformanceDaybydayTab />;
      case 'map':
        return performance ? (
          <PerformanceMapTab
            activities={performance.activities}
            skills={performance.skills}
            goToDaybydayTab={goToDaybydayTab}
          />
        ) : null;
    }
  }, [activatedTab, performance]);

  return (
    <div
      className="flex h-full flex-col overflow-x-hidden overscroll-none"
      key={orientation}
    >
      <PerformanceTabbar
        className="sticky left-0 right-0 top-0 z-30"
        activatedTab={activatedTab}
        setActivatedTab={setActivatedTab}
      />
      {tab}
    </div>
  );

  function goToDaybydayTab(filterKey: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('filter-key', filterKey);
    window.history.replaceState(null, '', url);

    setActivatedTab('day-by-day');
  }
};

export default Performance;

interface PerformanceTabbarProps extends React.HTMLAttributes<HTMLDivElement> {
  activatedTab: PerformanceTab;
  setActivatedTab: (tab: PerformanceTab) => void;
}

const TABS: { key: PerformanceTab; label: string }[] = [
  {
    key: 'overview',
    label: 'Overview',
  },
  {
    key: 'day-by-day',
    label: 'Day-by-Day',
  },
  {
    key: 'map',
    label: 'Strength & Weakness Map',
  },
];

const MOBILE_TABS: { key: PerformanceTab; icon: string }[] = [
  { key: 'overview', icon: 'icons/overview' },
  { key: 'day-by-day', icon: 'icons/daybyday' },
  { key: 'map', icon: 'icons/map' },
];

const PerformanceTabbar: React.FC<PerformanceTabbarProps> = ({
  activatedTab,
  setActivatedTab,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  const [activatedWidth, setActivatedWidth] = useState(0);
  const [mobileActivatedWidth, setMobileActivatedWidth] = useState(0);
  const [activatedLeft, setActivatedLeft] = useState(0);
  const [mobileActivatedLeft, setMobileActivatedLeft] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !mobileContainerRef.current) return;

    const activatedElement = containerRef.current.querySelector('.activated');
    const mobileActivatedElement =
      mobileContainerRef.current.querySelector('.activated');

    if (!activatedElement || !mobileActivatedElement) return;

    const left =
      activatedElement.getBoundingClientRect().left -
      containerRef.current.getBoundingClientRect().left;
    const mobileLeft =
      mobileActivatedElement.getBoundingClientRect().left -
      mobileContainerRef.current.getBoundingClientRect().left;

    setActivatedWidth(activatedElement.clientWidth);
    setMobileActivatedWidth(mobileActivatedElement.clientWidth);
    setActivatedLeft(left);
    setMobileActivatedLeft(mobileLeft);
  }, [activatedTab]);

  return (
    <>
      <div
        {...rest}
        className={c('hidden justify-between md:flex', rest.className)}
        ref={containerRef}
      >
        {TABS.map((tab, i) => {
          const activated = activatedTab === tab.key;
          const last = i === TABS.length - 1;

          return (
            <button
              className={c(
                'flex-1 bg-white py-4 font-inter text-[18px] font-semibold transition hover:bg-[#f7f7f7] 2lg:text-[22px]',
                activated ? 'activated text-[#666]' : 'text-[#b7b7b7]',
                !last && 'border-r border-r-theme-border'
              )}
              onClick={() => setActivatedTab(tab.key)}
              key={tab.key}
            >
              {tab.label}
            </button>
          );
        })}
        <div className="absolute top-full h-[3px] w-full overflow-hidden bg-[#eaeaea]">
          <div
            className="absolute h-full bg-[#3793d1] transition-all"
            style={{ width: activatedWidth, left: activatedLeft }}
          />
        </div>
      </div>

      <div
        className={c(
          'flex border-b border-b-theme-border bg-white md:hidden',
          rest.className
        )}
        ref={mobileContainerRef}
      >
        {MOBILE_TABS.map((tab, i) => {
          const active = tab.key === activatedTab;
          const last = i === MOBILE_TABS.length - 1;

          return (
            <button
              className={c(
                'flex flex-1 items-center justify-center bg-white p-3',
                active && 'activated',
                !last && 'border-r border-r-theme-border'
              )}
              onClick={() => setActivatedTab(tab.key)}
              key={tab.key}
            >
              <img
                alt="overview"
                className="h-8 w-8"
                src={p(`${tab.icon}_${active ? 'active' : 'inactive'}.svg`)}
              />
            </button>
          );
        })}
        <div className="absolute top-full h-[4px] w-full bg-theme-border">
          <div
            className="absolute h-full bg-[#3793d1] transition-all"
            style={{ width: mobileActivatedWidth, left: mobileActivatedLeft }}
          />
        </div>
      </div>
    </>
  );
};
