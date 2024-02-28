import { useMemo } from 'react';
import { c, p } from '../../lib';
import { Article, Strategy } from '../../types';

interface ArticlesTabProps {
  strategy: Strategy;
}

const ArticlesTab: React.FC<ArticlesTabProps> = ({ strategy }) => {
  const prepareArticles = useMemo(
    () => strategy.articles.filter((article) => article.segment === 'prepare'),
    [strategy.articles]
  );

  const weaknessArticles = useMemo(
    () => strategy.articles.filter((article) => article.segment === 'weakness'),
    [strategy.articles]
  );

  return (
    <>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <img
            alt="mortarboard icon"
            className="mb-1 h-7 w-7"
            src={p('icons/bulletpoint_article.svg')}
          />
          <span className="font-inter text-lg font-semibold text-[#919191]">
            <span style={{ color: strategy?.assessor_color }}>
              {prepareArticles.length} Article
              {prepareArticles.length > 1 && 's'}
            </span>{' '}
            for your <span className="text-[#4c4c4c]">Test Preparation</span>
          </span>
        </div>
        <div className="text-[15px] text-[#545454] md:ml-8">
          <span className="mb-6 block leading-6 md:leading-8">
            We recommend reading the following articles to aid specifically with
            preparation for your assessment:
          </span>
          <div className="mb-6 flex flex-col gap-4">
            {prepareArticles.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold md:text-sm">
            <span className="whitespace-nowrap">
              We’ve automatically added these to your:
            </span>
            <a href={import.meta.env.VITE_FOCUS_ARTICLES_URL}>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-theme-border bg-white px-3 py-2 shadow-md shadow-[#e3e3e378] hover:ring-1 hover:ring-theme-green md:text-sm">
                <img
                  alt="mortarboard icon"
                  src={p('icons/focus_activity_active.svg')}
                  className="h-5 w-5"
                />
                <span>Focus Articles</span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <img
            alt="mortarboard icon"
            className="mb-1 h-7 w-7"
            src={p('icons/bulletpoint_article.svg')}
          />
          <span className="font-inter text-lg font-semibold text-[#919191]">
            <span style={{ color: strategy?.assessor_color }}>
              {weaknessArticles.length} Article
              {weaknessArticles.length > 1 && 's'}
            </span>{' '}
            of <span className="text-[#4c4c4c]">Further Reading</span>
          </span>
        </div>
        <div className="text-[15px] text-[#545454] md:ml-8">
          <span className="mb-6 block text-sm leading-6 md:leading-8">
            We also recommend reading the following articles to help you better
            prepare for assessment.
          </span>
          <div className="mb-6 flex flex-col gap-4">
            {weaknessArticles.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold md:text-sm">
            <span className="whitespace-nowrap">
              We’ve automatically added these to your:
            </span>
            <a href={import.meta.env.VITE_FOCUS_ARTICLES_URL}>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-theme-border bg-white px-3 py-2 shadow-md shadow-[#e3e3e378] hover:ring-1 hover:ring-theme-green md:text-sm">
                <img
                  alt="mortarboard icon"
                  src={p('icons/focus_activity_active.svg')}
                  className="h-5 w-5"
                />
                <span>Focus Articles</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlesTab;

interface ArticleCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, ...rest }) => {
  return (
    <a
      {...rest}
      href={article.href}
      className={c(
        'flex h-12 w-full items-center rounded-[4px] border border-theme-border bg-white shadow-md shadow-[#e3e3e378] hover:ring-1 hover:ring-theme-green md:w-[512px]',
        rest.className
      )}
    >
      <div className="flex h-full items-center justify-center bg-[#e0e0e0] px-3">
        <img
          alt="article icon"
          className="h-6 w-6"
          src={p('icons/article_white.svg')}
        />
      </div>
      <span className="p-3 text-sm font-medium">{article.name}</span>
    </a>
  );
};
