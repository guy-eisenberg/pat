import { c, p } from '../../lib';
import type { Strategy } from '../../types';
import { Slide, Slideshow } from '../core';

interface DashbaordCardProps extends React.HTMLAttributes<HTMLDivElement> {
  strategy: Strategy | undefined;
}

const DashbaordCard: React.FC<DashbaordCardProps> = ({ strategy, ...rest }) => {
  if (!strategy)
    return (
      <a className="inline-block" href={import.meta.env.VITE_WIZARD_URL}>
        <div
          {...rest}
          className={c(
            'relative flex h-44 w-[360px] flex-col items-start justify-between overflow-hidden rounded-md bg-theme-green p-6 text-white shadow-md',
            rest.className
          )}
        >
          <div>
            <span className="mb-2 block font-light">Begin by creating a</span>
            <span className="text-2xl font-semibold">Preparation Strategy</span>
          </div>
          <button className="rounded-full bg-white px-6 py-2 text-theme-green shadow-md">
            Start
          </button>
          <img
            alt="black mortarboard"
            className="absolute bottom-8 right-16 h-36 w-36 translate-x-1/2 translate-y-1/2 -rotate-45 opacity-5"
            src={p('icons/mortarboard_black.svg')}
          />
        </div>
      </a>
    );

  return (
    <a className="inline-block" href={import.meta.env.VITE_STRATEGY_URL}>
      <Slideshow
        {...rest}
        disableScroll
        className={c(
          'h-44 w-[360px] overflow-hidden rounded-md text-white shadow-md',
          rest.className
        )}
      >
        <Slide className="relative p-6">
          <div
            className="absolute bottom-0 left-0 right-0 top-0 bg-cover"
            style={{
              backgroundImage: `url(${strategy.assessor_image})`,
              backgroundPositionX: 80,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 top-0"
            style={{
              background: strategy.assessor_image
                ? `linear-gradient(90deg, ${strategy.assessor_color} 0%, ${strategy.assessor_color} 30%, rgba(255,255,255,0) 100%)`
                : strategy.assessor_color,
            }}
          />
          <div className="relative">
            <span className="mb-4 block">You're preparing for:</span>
            <span className="text-4xl font-semibold">
              {strategy.assessor_name || strategy.focus_assessment_name}
            </span>
          </div>
        </Slide>
        <Slide
          className="relative flex flex-col p-6 text-white"
          style={{ backgroundColor: strategy.assessor_color }}
        >
          <span className="text-xl font-semibold">Preparation Strategy:</span>
          <div className="my-auto flex flex-col gap-1">
            <div className="flex gap-3">
              <img
                alt="activities icon"
                className="h-5 w-5 opacity-50"
                src={p('icons/mortarboard_black.svg')}
              />
              <span>{strategy.activities.length} Activities</span>
            </div>
            <div className="flex gap-3">
              <img
                alt="articles icon"
                className="h-5 w-5 opacity-50"
                src={p('icons/article_black.svg')}
              />
              <span>{strategy.articles.length} Articles</span>
            </div>
            <div className="flex gap-3">
              <img
                alt="targets icon"
                className="h-5 w-5 opacity-50"
                src={p('icons/target_black.svg')}
              />
              <span>{strategy.targets.length} Targets</span>
            </div>
          </div>
          <img
            alt="black mortarboard"
            className="absolute bottom-10 right-14 h-44 w-44 translate-x-1/2 translate-y-1/2 -rotate-[25deg] opacity-10"
            src={p('icons/mortarboard_black.svg')}
          />
        </Slide>
      </Slideshow>
    </a>
  );
};

export default DashbaordCard;
