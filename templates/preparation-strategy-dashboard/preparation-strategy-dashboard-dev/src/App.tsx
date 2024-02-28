import { useMemo, useState } from 'react';
import { fetchStrategy } from './api';
import { Tabbar } from './components';
import Button from './components/Button';
import { ActivitiesTab, ArticlesTab, TargetsTab } from './components/tabs';
import { useQuery } from './hooks';
import './index.css';
import { p } from './lib';
import { ActivatedTab } from './types';

const App: React.FC = () => {
  const { data: strategy, loading } = useQuery(fetchStrategy, undefined);

  const [activatedTab, setActivatedTab] = useState<ActivatedTab>('activities');

  const tab = useMemo(() => {
    if (!strategy) return null;

    switch (activatedTab) {
      case 'activities':
        return <ActivitiesTab strategy={strategy} />;
      case 'acticles':
        return <ArticlesTab strategy={strategy} />;
      case 'targets':
        return <TargetsTab strategy={strategy} />;
    }
  }, [strategy, activatedTab]);

  if (strategy === undefined && !loading)
    return (
      <div className="flex flex-col items-center p-12 md:p-24">
        <img
          alt="preparation strategy icon"
          className="mb-6 h-20 w-20"
          src={p('icons/copilot_bg_img.svg')}
        />
        <span className="mb-8 text-center text-4xl font-extralight text-theme-light-gray">
          You do not have a Preparation Strategy
        </span>
        <span className="mb-20 text-center text-sm text-theme-light-gray">
          Use the CoPilot Wizard to create a new Preparation Strategy:
        </span>
        <a href={import.meta.env.VITE_WIZARD_URL}>
          <Button color="green">Launch CoPilot Wizard</Button>
        </a>
      </div>
    );

  return (
    <div className="flex flex-col text-theme-extra-dark-gray">
      <Tabbar
        strategy={strategy}
        activatedTab={activatedTab}
        setActivatedTab={setActivatedTab}
      />
      <div
        className="flex flex-1 flex-col gap-16 px-4 py-10 md:px-12"
        style={{
          boxShadow: 'inset 0px 4px 10px 0px rgba(0,0,0,0.015)',
        }}
      >
        {tab}
      </div>
    </div>
  );
};

export default App;
