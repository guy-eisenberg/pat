import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { api } from '../clients';
import {
  Button,
  CustomContentTab,
  ParametersTab,
  QuestionPage,
  QuestionsTab,
} from '../components';
import useLoadingScreen from '../hooks/useLoading';
import { c, handleError, reportSuccess, tempId } from '../lib';
import type {
  Category,
  Exam,
  ExamCustomContentType,
  Question,
  TemplateType,
} from '../types';

const ExamPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: examId, tab } = useParams();

  const [name, setName] = useState('');
  const [questionQuantity, setQuestionQuantity] = useState(3);

  const [showResults, setShowResults] = useState(true);
  // const [skillCategories, setSkillCategories] = useState<
  //   { id: string; name: string }[]
  // >([]);
  // const [selectedSkillCategories, setSelectedSkillCategories] = useState<
  //   { id: string; text: string }[]
  // >([]);
  const [templateType, setTemplateType] =
    useState<TemplateType>('vertical-text');

  const [coPilotActivated, setCoPilotActivated] = useState(true);
  const [customizationModeActivated, setCustomizationModeActivated] =
    useState(true);
  const [trainingModeActivated, setTrainingModeActivated] = useState(true);
  const [flagQuestionsActivated, setFlagQuestionsActivated] = useState(true);
  const [examBuilderActivated, setExamBuilderActivated] = useState(true);
  const [randomiseAnswerOrderActivated, setRandomiseAnswerOrderActivated] =
    useState(true);
  const [
    hideQuestionBodyPreviewActivated,
    setHideQuestionBodyPreviewActivated,
  ] = useState(false);

  const [mins, setMins] = useState(1);
  const [secs, setSecs] = useState(45);
  const [questionSecs, setQuestionSecs] = useState(15);
  const [userNavigationActivated, setUserNavigationActivated] = useState(false);

  const [minQuestions, setMinQuestions] = useState<number | null>(null);
  const [maxQuestions, setMaxQuestions] = useState<number | null>(null);

  const [markingThresholdsActivated, setMarkingThresholdsActivated] =
    useState(false);
  const [strongPass, setStrongPass] = useState('');
  const [weakPass, setWeakPass] = useState('');

  const [questionMap, setQuestionMap] = useState(false);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<
    number | undefined
  >(undefined);
  const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] = useState<
    number | undefined
  >(undefined);

  const [categories, setCategories] = useState<Category[]>([]);

  const [customContent, setCustomContent] = useState<{
    id: string;
    type: 'none' | ExamCustomContentType;
    content: {
      text: string;
      image: string;
      tabs: { tab: string; content: string }[];
    };
  }>({
    id: tempId(),
    type: 'none',
    content: {
      text: '',
      image: '',
      tabs: [],
    },
  });

  const [loading, setLoading] = useState(false);
  useLoadingScreen(loading);

  const onExistingExam = examId && examId !== 'new' && !isNaN(parseInt(examId));

  useEffect(() => {
    if (onExistingExam) {
      setLoading(true);
      loadExam(examId, true)
        .catch(handleError)
        .finally(() => setLoading(false));
    }
  }, [onExistingExam, examId]);

  useEffect(() => {
    if (categories.length === 0) setSelectedCategoryIndex(undefined);
  }, [categories]);

  useEffect(() => {
    setSelectedSubcategoryIndex(undefined);
  }, [selectedCategoryIndex]);

  const focusedCategory =
    selectedCategoryIndex !== undefined
      ? categories[selectedCategoryIndex]
      : undefined;

  const focusedSubcategory =
    selectedCategoryIndex !== undefined &&
    selectedSubcategoryIndex !== undefined
      ? categories[selectedCategoryIndex].sub_categories[
          selectedSubcategoryIndex
        ]
      : undefined;

  return (
    <main className="flex h-full flex-col justify-center pt-8">
      <div className="flex h-full flex-col">
        <Routes>
          <Route
            index
            element={
              <>
                <h1 className="mb-4 text-4xl">Exams</h1>
                <h2 className="mb-8 text-2xl text-themeDarkGray">
                  {name || 'Exam Name Here'}
                </h2>
                <div className="relative">
                  <div className="relative top-[1px] flex gap-8">
                    <Link to={`/exams/${examId}/parameters`}>
                      <button
                        className={c(
                          'rounded-t-md border border-b-0 border-themeLightGray px-8 py-4 font-semibold text-themeDarkGray',
                          tab === 'parameters'
                            ? 'bg-white'
                            : 'bg-themeLightGray'
                        )}
                      >
                        Parameters
                      </button>
                    </Link>
                    <Link to={`/exams/${examId}/questions`}>
                      <button
                        className={c(
                          'rounded-t-md border border-b-0 border-themeLightGray px-8 py-4 font-semibold text-themeDarkGray',
                          tab === 'questions' ? 'bg-white' : 'bg-themeLightGray'
                        )}
                      >
                        Questions
                      </button>
                    </Link>
                    <Link to={`/exams/${examId}/custom-content`}>
                      <button
                        className={c(
                          'rounded-t-md border border-b-0 border-themeLightGray px-8 py-4 font-semibold text-themeDarkGray',
                          tab === 'custom-content'
                            ? 'bg-white'
                            : 'bg-themeLightGray'
                        )}
                      >
                        Custom Content
                      </button>
                    </Link>
                  </div>
                  {tab === 'parameters' && (
                    <ParametersTab
                      className="rounded-md rounded-tl-none border border-themeLightGray bg-white"
                      name={name}
                      setName={setName}
                      mins={mins}
                      setMins={setMins}
                      secs={secs}
                      setSecs={setSecs}
                      questionSecs={questionSecs}
                      setQuestionSecs={setQuestionSecs}
                      userNavigationActivated={userNavigationActivated}
                      setUserNavigationActivated={setUserNavigationActivated}
                      questionQuantity={questionQuantity}
                      minQuestions={minQuestions}
                      setMinQuestions={setMinQuestions}
                      maxQuestions={maxQuestions}
                      setMaxQuestions={setMaxQuestions}
                      setQuestionQuantity={setQuestionQuantity}
                      templateType={templateType}
                      setTemplateType={setTemplateType}
                      markingThresholdsActivated={markingThresholdsActivated}
                      setMarkingThresholdsActivated={
                        setMarkingThresholdsActivated
                      }
                      strongPass={strongPass}
                      setStrongPass={setStrongPass}
                      weakPass={weakPass}
                      setWeakPass={setWeakPass}
                      showResults={showResults}
                      setShowResults={setShowResults}
                      coPilotActivated={coPilotActivated}
                      setCoPilotActivated={setCoPilotActivated}
                      customizationModeActivated={customizationModeActivated}
                      setCustomizationModeActivated={
                        setCustomizationModeActivated
                      }
                      trainingModeActivated={trainingModeActivated}
                      setTrainingModeActivated={setTrainingModeActivated}
                      flagQuestionsActivated={flagQuestionsActivated}
                      setFlagQuestionsActivated={setFlagQuestionsActivated}
                      examBuilderActivated={examBuilderActivated}
                      setExamBuilderActivated={setExamBuilderActivated}
                      randomiseAnswerOrderActivated={
                        randomiseAnswerOrderActivated
                      }
                      setRandomiseAnswerOrderActivated={
                        setRandomiseAnswerOrderActivated
                      }
                      hideQuestionBodyPreviewActivated={
                        hideQuestionBodyPreviewActivated
                      }
                      setHideQuestionBodyPreviewActivated={
                        setHideQuestionBodyPreviewActivated
                      }
                      questionMap={questionMap}
                      setQuestionMap={setQuestionMap}
                    />
                  )}
                  {tab === 'questions' && (
                    <QuestionsTab
                      className="rounded-md rounded-tl-none border border-themeLightGray bg-white"
                      categories={categories}
                      onCategoryCreate={onCategoryCreate}
                      onCategoryEdit={onCategoryEdit}
                      onCategoryDelete={onCategoryDelete}
                      onQuestionDelete={onQuestionDelete}
                      selectedCategoryIndex={selectedCategoryIndex}
                      setSelectedCategoryIndex={setSelectedCategoryIndex}
                      selectedSubcategoryIndex={selectedSubcategoryIndex}
                      setSelectedSubcategoryIndex={setSelectedSubcategoryIndex}
                      focusedCategory={focusedCategory}
                      focusedSubcategory={focusedSubcategory}
                    />
                  )}
                  {tab === 'custom-content' && (
                    <CustomContentTab
                      className="rounded-md rounded-tl-none border border-themeLightGray bg-white"
                      type={customContent ? customContent.type : 'none'}
                      setType={(type) => {
                        setCustomContent({ ...customContent, type });
                      }}
                      customContent={
                        customContent
                          ? customContent.content
                          : { text: '', image: '', tabs: [] }
                      }
                      setContent={(content) =>
                        setCustomContent({ ...customContent, content })
                      }
                    />
                  )}
                  <div className="float-right mt-4 flex gap-2">
                    <Button look="gray" onClick={() => navigate(-1)}>
                      Back
                    </Button>
                    <Button
                      look="green"
                      onClick={saveExam}
                      disabled={
                        name.length === 0 ||
                        (markingThresholdsActivated &&
                          (strongPass.length === 0 || weakPass.length === 0))
                      }
                    >
                      Save Exam
                    </Button>
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/:id"
            element={
              focusedCategory && (
                <QuestionPage
                  examName={name || 'New Exam'}
                  templateType={templateType}
                  categories={categories}
                  parentCategory={focusedSubcategory || focusedCategory}
                  onQuestionSubmit={onQuestionSubmit}
                  lastQuestionId={
                    focusedCategory.questions &&
                    focusedCategory.questions.length > 0
                      ? focusedCategory.questions[
                          focusedCategory.questions.length - 1
                        ].id
                      : '0'
                  }
                />
              )
            }
          />
        </Routes>
      </div>
    </main>
  );

  async function onQuestionDelete(question: Question, category: Category) {
    updateUI();

    if (onExistingExam) {
      setLoading(true);

      try {
        await api.delete(`/delete-question.php?id=${question.id}`);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }

    function updateUI() {
      const relevantCategory = (focusedSubcategory || focusedCategory)!;

      const deletedQuestionIndex = relevantCategory.questions.findIndex(
        (_question) => _question.id === question.id
      );

      if (deletedQuestionIndex !== -1)
        relevantCategory.questions.splice(deletedQuestionIndex, 1);

      setCategories([...categories]);
    }
  }

  async function onQuestionSubmit(question: Question, category: Category) {
    updateUI();

    if (onExistingExam) {
      setLoading(true);
      try {
        await api.post(`/post-question.php?category-id=${category.id}`, {
          question,
        });

        await loadExam(examId);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }

    function updateUI() {
      const relevantCategory = (focusedSubcategory || focusedCategory)!;

      const questionIndex = relevantCategory
        ? relevantCategory.questions.findIndex(
            (_question) => _question.id === question.id
          )
        : -1;

      if (questionIndex !== -1) {
        relevantCategory.questions[questionIndex] = question;
      } else if (focusedCategory) relevantCategory.questions.push(question);

      setCategories([...categories]);
    }
  }

  async function onCategoryDelete(
    category: Category,
    parentCategory?: Category
  ) {
    updateUI();

    if (onExistingExam) {
      setLoading(true);

      try {
        await api.delete(`/delete-category.php?id=${category.id}`);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }

    function updateUI() {
      const newCategories = [...categories];

      if (!parentCategory) {
        const deletedCategoryIndex = categories.findIndex(
          (_category) => _category.id === category.id
        );

        newCategories.splice(deletedCategoryIndex, 1);
      } else {
        const parentCategoryIndex = categories.findIndex(
          (category) => category.id === parentCategory.id
        );

        const deletedCategoryIndex = categories[
          parentCategoryIndex
        ].sub_categories.findIndex((_category) => _category.id === category.id);

        newCategories[parentCategoryIndex].sub_categories.splice(
          deletedCategoryIndex,
          1
        );
      }

      setSelectedCategoryIndex(undefined);
      setCategories(newCategories);
    }
  }

  async function onCategoryEdit(category: Category, parentCategory?: Category) {
    updateUI();

    if (onExistingExam) {
      setLoading(true);

      try {
        await api.post(`/post-category.php?exam-id=${examId}`, {
          category,
          parent_category_id: parentCategory ? parentCategory.id : null,
        });
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }

    function updateUI() {
      const newCategories = [...categories];

      if (!parentCategory) {
        const modifiedCategoryIndex = categories.findIndex(
          (_category) => _category.id === category.id
        );

        newCategories[modifiedCategoryIndex] = category;
      } else {
        const parentCategoryIndex = categories.findIndex(
          (category) => category.id === parentCategory.id
        );

        const modifiedCategoryIndex = categories[
          parentCategoryIndex
        ].sub_categories.findIndex((_category) => _category.id === category.id);

        newCategories[parentCategoryIndex].sub_categories[
          modifiedCategoryIndex
        ] = category;
      }

      setCategories(newCategories);
    }
  }

  async function onCategoryCreate(
    category: Category,
    parentCategory?: Category
  ) {
    updateUI();

    if (onExistingExam) {
      setLoading(true);
      try {
        await api.post(`/post-category.php?exam-id=${examId}`, {
          category,
          parent_category_id: parentCategory ? parentCategory.id : null,
        });

        await loadExam(examId);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }

    function updateUI() {
      if (!parentCategory) setCategories([...categories, category]);
      else {
        const newCategories = [...categories];

        const parentCategoryIndex = categories.findIndex(
          (category) => category.id === parentCategory.id
        );

        newCategories[parentCategoryIndex].sub_categories.push(category);

        setCategories(newCategories);
      }
    }
  }

  async function saveExam() {
    const duration = mins * 60 + secs;

    const exam: Exam = {
      id: onExistingExam ? examId : tempId(),
      name,
      question_quantity: questionQuantity,
      show_results: showResults,
      template_type: templateType,
      allow_copilot: coPilotActivated,
      customization_mode: customizationModeActivated,
      training_mode: trainingModeActivated,
      flag_questions: flagQuestionsActivated,
      exam_builder: examBuilderActivated,
      random_answer_order: randomiseAnswerOrderActivated,
      hide_question_body_preview: hideQuestionBodyPreviewActivated,
      duration,
      question_duration: questionSecs,
      min_questions: minQuestions,
      max_questions: maxQuestions,
      allow_user_navigation: userNavigationActivated,
      strong_pass:
        markingThresholdsActivated && strongPass.length > 0
          ? parseInt(strongPass)
          : null,
      weak_pass:
        markingThresholdsActivated && weakPass.length > 0
          ? parseInt(weakPass)
          : null,
      question_map: questionMap,
      categories,
      custom_content:
        customContent.type !== 'none'
          ? {
              id: customContent.id,
              type: customContent.type,
              content: JSON.stringify(
                customContent.content[customContent.type]
              ),
            }
          : undefined,
    };

    setLoading(true);
    try {
      const { data: examId } = await api.post('/post-exam.php', {
        exam,
      });

      if (!onExistingExam) navigate(`/exams/${examId}/${tab}`);

      reportSuccess('Exam was successfully saved.');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadExam(examId: string, overrideFieldsValues = false) {
    try {
      const { data: exam } = await api.get<Exam>(`/get-exam.php?id=${examId}`);

      if (overrideFieldsValues) {
        setName(exam.name);
        setQuestionQuantity(exam.question_quantity);
        // eslint-disable-next-line eqeqeq
        setShowResults(exam.show_results == true);
        setTemplateType(exam.template_type);
        // eslint-disable-next-line eqeqeq
        setCoPilotActivated(exam.allow_copilot == true);
        // eslint-disable-next-line eqeqeq
        setCustomizationModeActivated(exam.customization_mode == true);
        // eslint-disable-next-line eqeqeq
        setTrainingModeActivated(exam.training_mode == true);
        // eslint-disable-next-line eqeqeq
        setFlagQuestionsActivated(exam.flag_questions == true);
        // eslint-disable-next-line eqeqeq
        setExamBuilderActivated(exam.exam_builder == true);
        setMins(Math.floor(exam.duration / 60));
        setSecs(exam.duration % 60);
        setQuestionSecs(exam.question_duration * 1);

        setMinQuestions(exam.min_questions);
        setMaxQuestions(exam.max_questions);

        // eslint-disable-next-line eqeqeq
        setUserNavigationActivated(exam.allow_user_navigation == true);
        if (exam.strong_pass !== null && exam.weak_pass !== null) {
          setMarkingThresholdsActivated(true);
          setStrongPass(`${exam.strong_pass}%`);
          setWeakPass(`${exam.weak_pass}%`);
        }
        // eslint-disable-next-line eqeqeq
        setQuestionMap(exam.question_map == true);

        setCustomContent((customContent) => {
          if (!exam.custom_content) return customContent;

          return {
            ...exam.custom_content,
            content: {
              ...customContent.content,
              [exam.custom_content.type]: JSON.parse(
                exam.custom_content.content
              ),
            },
          };
        });
      }

      setCategories(exam.categories);
    } catch (err) {
      handleError(err);
    }
  }
};

export default ExamPage;
