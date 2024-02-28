import { useMemo, useState } from 'react';
import { c, p, removeItem } from '../lib';
import { Category, Exam } from '../types';
import Checkbox from './Checkbox';

interface ExamQuestionsListProps extends React.HTMLAttributes<HTMLDivElement> {
  exam: Exam;
  selectedQuestionsIds: string[];
  setSelectedQuestionsIds: (ids: string[]) => void;
}

const ExamQuestionsList: React.FC<ExamQuestionsListProps> = ({
  exam,
  selectedQuestionsIds,
  setSelectedQuestionsIds,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  const allQuestionIds = useMemo(() => {
    return exam.categories.reduce(
      (arr, category) => [...arr, ...flatCategoryQuestionIds(category)],
      [] as string[]
    );

    function flatCategoryQuestionIds(category: Category): string[] {
      return [
        ...category.questions.map((question) => question.id),
        ...category.sub_categories.reduce(
          (arr, category) => [...arr, ...flatCategoryQuestionIds(category)],
          [] as string[]
        ),
      ];
    }
  }, [exam]);

  const checked = useMemo(() => {
    return allQuestionIds.reduce(
      (flag, questionId) => flag && selectedQuestionsIds.includes(questionId),
      true
    );
  }, [allQuestionIds, selectedQuestionsIds]);

  return (
    <div
      {...rest}
      className={c(
        'overflow-hidden rounded-md border border-theme-light-gray',
        rest.className
      )}
    >
      <div
        className={c(
          'flex cursor-pointer items-center gap-4 border-b border-theme-light-gray bg-[#fbfbfb] py-4 px-4 font-semibold text-theme-dark-gray md:cursor-default',
          !open && 'border-none md:border-solid'
        )}
        onClick={() => setOpen(!open)}
      >
        <Checkbox
          checked={checked}
          onToggle={() => {
            var newSelectedQuestionsIds = [...selectedQuestionsIds];

            if (checked)
              newSelectedQuestionsIds = newSelectedQuestionsIds.filter(
                (questionId) => !allQuestionIds.includes(questionId)
              );
            else
              newSelectedQuestionsIds = [
                ...newSelectedQuestionsIds,
                ...allQuestionIds,
              ];

            setSelectedQuestionsIds(newSelectedQuestionsIds);
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <img
          alt="flagged questions icon"
          className="h-6 w-6"
          src={p('icons/flagged_questions_icon.svg')}
        />
        <span>{exam.name}</span>
        <img
          className={c(
            'ml-auto h-4 w-4 opacity-20 transition md:hidden',
            open ? 'rotate-[270deg]' : 'rotate-180'
          )}
          src={p('icons/icon_arrow.svg')}
          alt="arrow icon"
        />
      </div>
      <div
        className={c(
          'overflow-hidden bg-white px-4 transition-all',
          open ? 'max-h-[unset] py-1' : 'max-h-0 py-0 md:max-h-[unset] md:py-1'
        )}
      >
        {exam.categories.map((category) => (
          <CategoryQuestionsList
            className="py-2"
            category={category}
            selectedQuestionsIds={selectedQuestionsIds}
            setSelectedQuestionsIds={setSelectedQuestionsIds}
            key={category.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ExamQuestionsList;

interface CategoryQuestionsListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  category: Category;
  showLine?: boolean;
  selectedQuestionsIds: string[];
  setSelectedQuestionsIds: (ids: string[]) => void;
}

const CategoryQuestionsList: React.FC<CategoryQuestionsListProps> = ({
  category,
  showLine = true,
  selectedQuestionsIds,
  setSelectedQuestionsIds,
  ...rest
}) => {
  const allQuestionIds = useMemo(() => {
    return flatQuestionIds(category);

    function flatQuestionIds(category: Category): string[] {
      return [
        ...category.questions.map((question) => question.id),
        ...category.sub_categories.reduce(
          (arr, category) => [...arr, ...flatQuestionIds(category)],
          [] as string[]
        ),
      ];
    }
  }, [category]);

  const checked = useMemo(() => {
    return allQuestionIds.reduce(
      (flag, questionId) => flag && selectedQuestionsIds.includes(questionId),
      true
    );
  }, [allQuestionIds, selectedQuestionsIds]);

  return (
    <div {...rest} className={c('relative', rest.className)}>
      {showLine && (
        <div className="absolute top-0 bottom-0 mx-2 w-[1px] bg-theme-light-gray/50" />
      )}
      <div className="flex items-start gap-4 bg-[#fefefe] text-theme-medium-gray">
        <div className="relative flex h-6 items-center bg-white">
          <Checkbox
            checked={checked}
            onToggle={() => {
              var newSelectedQuestionsIds = [...selectedQuestionsIds];

              if (checked)
                newSelectedQuestionsIds = newSelectedQuestionsIds.filter(
                  (questionId) => !allQuestionIds.includes(questionId)
                );
              else
                newSelectedQuestionsIds = [
                  ...newSelectedQuestionsIds,
                  ...allQuestionIds,
                ];

              setSelectedQuestionsIds(newSelectedQuestionsIds);
            }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <span>{category.name}</span>
          <div className="flex flex-col gap-2">
            {category.questions.map((question) => {
              const checked = selectedQuestionsIds.includes(question.id);

              return (
                <div
                  className="flex gap-4 text-sm text-theme-extra-dark-gray"
                  key={question.id}
                >
                  <div className="flex h-5 items-center">
                    <Checkbox
                      checked={checked}
                      onToggle={() => {
                        var newSelectedQuestionsIds = [...selectedQuestionsIds];

                        if (checked)
                          newSelectedQuestionsIds = removeItem(
                            question.id,
                            selectedQuestionsIds
                          );
                        else newSelectedQuestionsIds.push(question.id);

                        setSelectedQuestionsIds(newSelectedQuestionsIds);
                      }}
                    />
                  </div>
                  <span>{question.body}</span>
                </div>
              );
            })}
            {category.sub_categories.map((subCategory) => (
              <CategoryQuestionsList
                className="py-2"
                category={subCategory}
                // showLine={false}
                selectedQuestionsIds={selectedQuestionsIds}
                setSelectedQuestionsIds={setSelectedQuestionsIds}
                key={subCategory.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
