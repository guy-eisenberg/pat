import { useLayoutEffect, useRef, useState } from 'react';
import { c, getDatePreview, p } from '../lib';
import { ActivatedTab, Strategy } from '../types';
import Button from './Button';

interface TabbarProps extends React.HTMLAttributes<HTMLDivElement> {
  strategy: Strategy | undefined;
  activatedTab: ActivatedTab;
  setActivatedTab: (tab: ActivatedTab) => void;
}

const TABS: { tab: ActivatedTab; label: React.ReactNode; icon: string }[] = [
  {
    tab: 'activities',
    label: (
      <span>
        <span className="hidden md:inline-block">Focus</span> Activities
      </span>
    ),
    icon: 'mortarboard',
  },
  {
    tab: 'acticles',
    label: (
      <span>
        <span className="hidden md:inline-block">Focus</span> Articles
      </span>
    ),
    icon: 'article',
  },
  {
    tab: 'targets',
    label: 'Targets',
    icon: 'target',
  },
];

const Tabbar: React.FC<TabbarProps> = ({
  strategy,
  activatedTab,
  setActivatedTab,
  ...rest
}) => {
  const buttonsContainer = useRef<HTMLDivElement | null>(null);
  const [lineWidth, setLineWidth] = useState(0);
  const [lineLeft, setLineLeft] = useState(0);

  useLayoutEffect(() => {
    if (!buttonsContainer.current || !strategy) return;

    const element = buttonsContainer.current.querySelector('.activated');

    if (!element) return;

    const left =
      element.getBoundingClientRect().left -
      buttonsContainer.current.getBoundingClientRect().left;

    setLineWidth(element.clientWidth);
    setLineLeft(left);
  }, [strategy, activatedTab]);

  if (!strategy) return null;

  return (
    <nav
      className={c(
        'relative flex flex-col items-start overflow-hidden border-b border-b-theme-border bg-white px-4 md:pr-12 md:pl-28 lg:pl-64',
        rest.className
      )}
      style={{
        boxShadow: 'inset 0px -4px 10px 0px rgba(0,0,0,0.03)',
      }}
    >
      <div className="absolute left-0 hidden h-full w-40 overflow-hidden md:block lg:w-64">
        <img
          alt="assessor thumbnail"
          className="left-0 h-full w-full object-cover object-left"
          src={strategy.assessor_image_prep}
          style={{
            objectPosition: '-70px',
          }}
        />
        <div
          className="absolute top-0 right-0 bottom-0 left-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(247,247,247,0) 0%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,1) 100%)',
          }}
        />
      </div>
      <Mortarboard
        className="absolute right-16 bottom-12 hidden h-[10rem] w-[10rem] translate-x-[40%] translate-y-[56%] -rotate-[30deg] opacity-20 md:block lg:opacity-60"
        fill={strategy.assessor_color}
      />
      <div className="relative flex w-full gap-6 py-6">
        <div className="flex flex-col gap-2">
          <span className="font-inter text-[28px] font-semibold text-[#34424C]">
            {strategy.first_name ? `${strategy.first_name}'s` : 'Your'} Strategy
          </span>
          <span className="!text-base font-semibold text-[#919191]">
            for assessment on{' '}
            <span className="!text-base text-[#545454]">
              {strategy.assessment_date &&
                getDatePreview(strategy.assessment_date)}
            </span>{' '}
            {strategy.assessor_name && (
              <>
                with{' '}
                <span
                  className="!text-base"
                  style={{ color: strategy.assessor_color }}
                >
                  {strategy.assessor_name}
                </span>
              </>
            )}
          </span>
        </div>
        <a href={import.meta.env.VITE_WIZARD_URL}>
          <Button
            className="absolute right-0 top-6 hidden text-sm leading-6 lg:block"
            color="green"
          >
            Create New Preparation Strategy
          </Button>
        </a>
      </div>
      <div className="relative flex w-full items-start">
        <div
          className="relative flex rounded-t-md border border-b-0 border-theme-border text-sm"
          ref={buttonsContainer}
        >
          {TABS.map((tab, i) => (
            <button
              className={c(
                'flex items-center gap-3 bg-white py-3 px-4 font-inter font-semibold text-[#919191] md:px-8',
                activatedTab === tab.tab
                  ? 'activated !text-[#555555]'
                  : 'text-theme-medium-gray',
                i < TABS.length - 1 && 'border-r border-theme-border'
              )}
              onClick={() => setActivatedTab(tab.tab)}
              key={tab.tab}
            >
              <img
                alt="icon"
                className={c(
                  'hidden h-5 w-5 md:block',
                  tab.icon === 'target' && 'mb-1 h-6 w-6'
                )}
                src={p(
                  `icons/${tab.icon}${
                    activatedTab === tab.tab ? '_active' : ''
                  }.svg`
                )}
              />
              {tab.label}
            </button>
          ))}
          <div className="absolute bottom-0 h-[3px] w-full bg-[#dbdbdb]">
            <div
              className="absolute h-[3px] transition-all"
              style={{
                width: lineWidth,
                left: lineLeft,
                backgroundColor: strategy.assessor_color,
              }}
            />
          </div>
        </div>
        <a href={import.meta.env.VITE_WIZARD_URL}>
          <Button
            color="green"
            className="absolute right-0 bottom-2 flex items-center gap-1 !py-[5px] !px-3 text-lg font-bold lg:hidden"
          >
            <img
              alt="motarboard icon"
              className="h-5 w-5"
              src={p('icons/mortarboard_white.svg')}
            />
            <span>+</span>
          </Button>
        </a>
      </div>
    </nav>
  );
};

export default Tabbar;

const Mortarboard: React.FC<React.SVGAttributes<HTMLOrSVGElement>> = ({
  fill,
  ...rest
}) => {
  return (
    <svg
      {...rest}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 50.3 28.9"
    >
      <path
        fill={fill}
        d="M36.8,16.9v4.7c0,0.6-0.4,1.2-0.9,1.5l-7.5,3.7c-0.8,0.4-1.5,0.9-2.2,1.5c-0.6,0.6-1.7,0.7-2.3,0
		c0,0,0,0,0,0c-0.7-0.6-1.5-1.2-2.4-1.5l-7.3-3.6c-0.5-0.3-0.9-0.9-0.8-1.5v-4.7l10.3,3c0.9,0.3,1.9,0.3,2.8,0L36.8,16.9z"
      />
      <path
        fill={fill}
        d="M43.5,15v10.1c-0.1,0.9-1,1.6-1.9,1.5c-0.8-0.1-1.4-0.7-1.5-1.5V16L43.5,15z"
      />
      <path
        fill={fill}
        d="M24.6,16.8L1.2,10C0.3,9.7-0.2,8.7,0.1,7.9c0,0,0,0,0,0c0.2-0.5,0.6-0.9,1.1-1.1l23.5-6.7
		C25,0,25.3,0,25.6,0.1l23.5,6.7C50,7,50.5,7.9,50.3,8.8c-0.2,0.6-0.6,1-1.2,1.2l-23.6,6.8C25.3,16.9,24.9,16.9,24.6,16.8z"
      />
    </svg>
  );
};
