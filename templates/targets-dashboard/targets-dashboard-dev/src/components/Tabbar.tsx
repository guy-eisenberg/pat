import { useEffect, useRef, useState } from 'react';
import { c, p } from '../lib';

export type ActivatedTab = 'active' | 'achieved' | 'missed';

const TABS: { tab: ActivatedTab; label: React.ReactNode; icon: string }[] = [
  {
    tab: 'active',
    label: <span>Active</span>,
    icon: 'set',
  },
  {
    tab: 'achieved',
    label: <span>Achieved</span>,
    icon: 'achieved',
  },
  {
    tab: 'missed',
    label: <span>Missed</span>,
    icon: 'expired',
  },
];

interface TabbarProps extends React.HTMLAttributes<HTMLDivElement> {
  tabActivated: string;
  setTabActivated: (tab: ActivatedTab) => void;
}

const Tabbar: React.FC<TabbarProps> = ({
  tabActivated,
  setTabActivated,
  ...rest
}) => {
  const element = useRef<HTMLDivElement | null>(null);

  const [lineWidth, setLineWidth] = useState(0);
  const [lineLeft, setLineLeft] = useState(0);

  useEffect(() => {
    if (!element.current) return;

    const activatedText = element.current.querySelector('.activated');

    if (!activatedText) return;

    const left =
      activatedText.getBoundingClientRect().left -
      element.current.getBoundingClientRect().left;

    setLineWidth(activatedText.clientWidth);
    setLineLeft(left);
  }, [tabActivated]);

  return (
    <div
      {...rest}
      className={c(
        'relative overflow-hidden rounded-md border border-theme-border',
        rest.className
      )}
      ref={element}
    >
      <div className="flex">
        {TABS.map((tab, i) => (
          <button
            className={c(
              'flex items-center gap-3 py-3 px-4 font-semibold',
              tabActivated === tab.tab
                ? 'activated text-[#6b6b6b]'
                : 'text-theme-medium-gray',
              i < TABS.length - 1 && 'border-r border-theme-border'
            )}
            onClick={() => setTabActivated(tab.tab)}
            key={tab.tab}
          >
            <img
              alt="icon"
              className={c(
                'hidden h-5 w-5 md:block',
                tab.icon === 'set' && 'h-[18px] w-[18px]',
                tab.icon === 'achieved' && 'h-6 w-6'
              )}
              src={p(
                `icons/target_${tab.icon}${
                  tabActivated === tab.tab ? '_active' : ''
                }.svg`
              )}
            />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative h-[3px] w-full bg-[#dbdbdb]">
        <div
          className={c(
            'absolute h-[3px] transition-all',
            tabActivated === 'active' && 'bg-theme-dark-blue',
            tabActivated === 'achieved' && 'bg-theme-green',
            tabActivated === 'missed' && 'bg-[#f44752]'
          )}
          style={{ width: lineWidth, left: lineLeft }}
        />
      </div>
    </div>
  );
};

export default Tabbar;
