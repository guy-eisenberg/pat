import React, { useMemo, useState } from 'react';
import { api } from './client';
import { Button, ExamQuestionsList } from './components';
import useQuery from './hooks/useQuery';
import './index.css';
import { Category, Exam } from './types';

const App: React.FC = () => {
  const { data, invalidate } = useQuery(fetchData, undefined);

  const [selectedQuestionsIds, setSelectedQuestionsIds] = useState<string[]>(
    []
  );

  const { exams, flagged_questions_ids } = data || {};

  const filteredExams: Exam[] = useMemo(() => {
    if (!exams || !flagged_questions_ids) return [];

    return exams.map((exam) => {
      const newExam = { ...exam };

      newExam.categories = newExam.categories
        .map(filterCategoryQuestions)
        .filter(categoryHasContent);

      return newExam;
    }, []);

    function filterCategoryQuestions(category: Category): Category {
      const newCategory = { ...category };

      newCategory.questions = newCategory.questions.filter((question) =>
        flagged_questions_ids!.includes(question.id)
      );

      newCategory.sub_categories = newCategory.sub_categories
        .map(filterCategoryQuestions)
        .filter(categoryHasContent);

      return newCategory;
    }

    function categoryHasContent(category: Category): boolean {
      return (
        category.questions.length > 0 ||
        category.sub_categories.reduce(
          (flag, subCategory) => flag || categoryHasContent(subCategory),
          false
        )
      );
    }
  }, [exams, flagged_questions_ids]);

  if (!exams || !flagged_questions_ids) return null;

  return (
    <>
      <div className="mb-6 flex flex-col items-start gap-6 rounded-[5px] md:flex-row md:overflow-x-auto md:border md:border-theme-light-gray md:bg-[#f3f3f3] md:p-8">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <ExamQuestionsList
              className="w-full shrink-0 md:max-w-md"
              exam={exam}
              selectedQuestionsIds={selectedQuestionsIds}
              setSelectedQuestionsIds={setSelectedQuestionsIds}
              key={exam.id}
            />
          ))
        ) : (
          <p className="text-theme-medium-gray">
            You haven't added any Flagged Questions yet.
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-sm xs:gap-4 md:text-base">
        <Button
          color="green"
          className="text-xs xs:text-sm"
          disabled={selectedQuestionsIds.length === 0}
          onClick={() => {
            window.open(
              `${
                import.meta.env.VITE_EXAMS_CLIENT_URL
              }/#/custom?questions=${selectedQuestionsIds}`,
              '_blank',
              'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=' +
                window.screen.width +
                ',height=' +
                window.screen.height +
                ''
            );
          }}
        >
          Launch Exam{' '}
          {selectedQuestionsIds.length > 0 && (
            <span className="hidden md:inline-block">
              with {selectedQuestionsIds.length} Selected Questions
            </span>
          )}
        </Button>
        <Button
          color="gray"
          className="text-xs xs:text-sm"
          onClick={() =>
            _unflagQuestions(selectedQuestionsIds).then(invalidate)
          }
        >
          Remove{' '}
          <span className="hidden md:inline-block">
            {selectedQuestionsIds.length}
          </span>{' '}
          Selected Questions
        </Button>
      </div>
    </>
  );

  async function _unflagQuestions(ids: string[]) {
    try {
      return await api.post(`/unflag-questions.php?ids=${ids}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async function fetchData() {
    try {
      const { data } = await api.get<{
        exams: Exam[];
        flagged_questions_ids: string[];
      }>('/get-user-flagged-questions-exams.php');

      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

export default App;
