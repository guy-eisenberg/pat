import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Dropdown, Input, LabeledBox, Radio, TextArea } from '..';
import { api } from '../../clients';
import useLoadingScreen from '../../hooks/useLoading';
import { c, handleError, p, tempId } from '../../lib';
import type {
  Answer,
  Category,
  Question,
  QuestionInformation,
  TemplateType,
} from '../../types';

interface QuestionPageProps extends React.HTMLAttributes<HTMLDivElement> {
  examName: string;
  templateType: TemplateType;
  categories: Category[];
  parentCategory: Category;
  lastQuestionId: string;
  onQuestionSubmit: (question: Question, parentCategory: Category) => void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  examName,
  templateType,
  categories,
  parentCategory,
  lastQuestionId,
  onQuestionSubmit,
  ...rest
}) => {
  const navigate = useNavigate();
  const { id: questionId } = useParams();

  const [selectedCategoryId, setSelctedCategoryId] = useState(
    parentCategory.id
  );

  const [body, setBody] = useState('');

  const [answers, setAnswers] = useState<Answer[]>([
    {
      id: tempId(),
      body: templateType === 'horizontal-letters' ? 'A' : '',
      is_right: true,
    },
    {
      id: tempId(),
      body: templateType === 'horizontal-letters' ? 'B' : '',
      is_right: false,
    },
  ]);

  const [explanation, setExplanation] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');

  const [additionalInformationArray, setAdditionalInformationArray] = useState<
    QuestionInformation[]
  >([]);

  const [loading, setLoading] = useState(false);
  useLoadingScreen(loading);

  const flattenCategories = useMemo(() => {
    return categories.reduce(
      (arr, category) => [...arr, ...flatCategory(category)],
      [] as Category[]
    );

    function flatCategory(category: Category, arr: Category[] = []) {
      var categories: Category[] = [...arr, category];

      if (category.sub_categories)
        category.sub_categories.forEach(
          (category) => (categories = flatCategory(category, categories))
        );

      return categories;
    }
  }, [categories]);

  const onExistingQuestion =
    questionId && questionId !== 'new' && !isNaN(parseInt(questionId));

  useEffect(() => {
    if (onExistingQuestion) {
      setLoading(true);
      loadQuestion()
        .catch(handleError)
        .finally(() => setLoading(false));
    } else {
      const question = parentCategory.questions.find(
        (question) => question.id === questionId
      );

      if (question) {
        setBody(question.body);
        setAnswers(
          question.answers.map((answer) => ({
            ...answer,
            is_right: answer.is_right == true,
          }))
        );
        setExplanation(question.explanation);
        setFeaturedImage(question.featured_image || '');
        setAdditionalInformationArray(question.informations);
      }
    }
  }, [onExistingQuestion]);

  return (
    <div
      {...rest}
      className={c('flex h-full flex-col items-start', rest.className)}
    >
      <h1 className="mb-4 text-4xl">{examName}</h1>
      <h2 className="mb-8 text-2xl text-themeDarkGray">Add New Question</h2>
      <LabeledBox
        className="mb-8 w-[calc((100%-16rem)/3)]"
        label="Question Category & Sub-Category"
      >
        <p className="mb-4 text-themeDarkGray">
          Select category or sub-category:
        </p>
        <Dropdown
          className="w-full"
          options={flattenCategories.map((category) => ({
            key: category.id,
            label: category.name,
          }))}
          selected={selectedCategoryId}
          onOptionChange={setSelctedCategoryId}
        />
      </LabeledBox>
      <div className="mb-8 flex w-full gap-8">
        <LabeledBox className="w-3/5" label="Question">
          <TextArea
            className="h-96 w-full"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </LabeledBox>
        <LabeledBox className="flex-1" label="Answers">
          <div className="mb-6 flex w-full flex-col gap-2">
            <div className="flex gap-4">
              <div className="flex-1" />
              <p className="w-1/5 text-center font-semibold text-themeDarkGray">
                Correct Answer:
              </p>
            </div>
            {answers.map((answer, i) => (
              <div className="flex gap-4" key={i}>
                {answers.length > 2 && (
                  <button onClick={() => deleteAnswer(i)}>
                    <img
                      alt="delete icon"
                      src={p('icons/delete_icon_red.svg')}
                      height={24}
                      width={24}
                    />
                  </button>
                )}
                <TextArea
                  className="flex-1"
                  value={answer.body}
                  disabled={templateType === 'horizontal-letters'}
                  onChange={(e) => {
                    const newAnswers = [...answers];

                    newAnswers[i].body = e.target.value;

                    setAnswers(newAnswers);
                  }}
                />
                <div className="flex w-1/5 items-center justify-center">
                  <Radio
                    name="answer"
                    checked={answer.is_right}
                    onCheckedChange={() => {
                      const newAnswers = [...answers];
                      newAnswers.forEach((answer) => (answer.is_right = false));

                      newAnswers[i].is_right = true;

                      setAnswers(newAnswers);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {answers.length < 5 && (
            <Button look="black" onClick={addAnswer}>
              + Add New Answer
            </Button>
          )}
        </LabeledBox>
      </div>
      <LabeledBox label="Explanation" className="w-full gap-8">
        <div className="flex w-full gap-8">
          <div className="flex-1">
            <p className="mb-4 font-semibold">Explanation:</p>
            <TextArea
              className="h-80 w-full"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <p className="mb-4 font-semibold">Featured image:</p>
            <Input
              placeholder="Hyperlink (e.g. https://pilotaptitudetest.com/featured-image.png)"
              className="mb-6 w-3/4"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
            />
            <p className="mb-4 font-semibold">Additional Information:</p>
            {additionalInformationArray.length > 0 && (
              <div className="mb-8 flex flex-col gap-2">
                <div className="flex w-full gap-4">
                  <p className="flex-1 text-themeDarkGray">Type:</p>
                  <p className="flex-1 text-themeDarkGray">Name:</p>
                  <p className="flex-1 text-themeDarkGray">Hyperlink:</p>
                </div>
                {additionalInformationArray.map((info, i) => (
                  <div className="flex w-full gap-4" key={i}>
                    <button onClick={() => deleteInformation(i)}>
                      <img
                        alt="delete icon"
                        src={p('icons/delete_icon_red.svg')}
                        height={24}
                        width={24}
                      />
                    </button>
                    <Dropdown
                      className="flex-1"
                      selected={info.type}
                      options={[
                        { key: 'hyperlink', label: 'Hyperlink' },
                        {
                          key: 'image',
                          label: 'Image',
                        },
                        { key: 'pdf', label: 'PDF' },
                      ]}
                      onOptionChange={(option) => {
                        const newAdditionalInformationArray = [
                          ...additionalInformationArray,
                        ];

                        newAdditionalInformationArray[i].type = option as
                          | 'image'
                          | 'hyperlink'
                          | 'pdf';

                        setAdditionalInformationArray(
                          newAdditionalInformationArray
                        );
                      }}
                    />
                    <Input
                      className="flex-1"
                      placeholder="Name"
                      value={info.name}
                      onChange={(e) => {
                        const newAdditionalInformationArray = [
                          ...additionalInformationArray,
                        ];

                        newAdditionalInformationArray[i].name = e.target.value;

                        setAdditionalInformationArray(
                          newAdditionalInformationArray
                        );
                      }}
                    />
                    <Input
                      className="flex-1"
                      placeholder="Hyperlink (e.g. https://pilotaptitudetest.com/featured-image.png)"
                      value={info.hyperlink}
                      onChange={(e) => {
                        const newAdditionalInformationArray = [
                          ...additionalInformationArray,
                        ];

                        newAdditionalInformationArray[i].hyperlink =
                          e.target.value;

                        setAdditionalInformationArray(
                          newAdditionalInformationArray
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            {additionalInformationArray.length < 5 && (
              <Button
                look="black"
                onClick={() => {
                  if (additionalInformationArray.length < 5)
                    setAdditionalInformationArray([
                      ...additionalInformationArray,
                      {
                        id: tempId(),
                        type: 'hyperlink',
                        name: '',
                        hyperlink: '',
                      },
                    ]);
                }}
              >
                + Add Additional Information
              </Button>
            )}
          </div>
        </div>
      </LabeledBox>
      <Button
        className="mt-4"
        look="green"
        disabled={
          body.length === 0 ||
          answers.find((answer) => answer.body.length === 0) !== undefined ||
          explanation.length === 0 ||
          additionalInformationArray.reduce((flag, information) => {
            return flag || information.hyperlink.length === 0;
          }, false)
        }
        onClick={() => {
          onQuestionSubmit(
            {
              id: onExistingQuestion
                ? questionId
                : questionId && questionId !== 'new'
                ? questionId
                : tempId(),
              body,
              answers,
              informations: additionalInformationArray,
              explanation,
              featured_image: featuredImage,
            },
            flattenCategories.find(
              (category) => category.id === selectedCategoryId
            )!
          );

          navigate(-1);
        }}
      >
        Save
      </Button>
    </div>
  );

  function addAnswer() {
    if (answers.length < 5)
      setAnswers([
        ...answers,
        {
          id: tempId(),
          body:
            templateType === 'horizontal-letters'
              ? `${String.fromCharCode(65 + answers.length)}`
              : '',
          is_right: false,
        },
      ]);
  }

  async function loadQuestion() {
    try {
      const { data: question } = await api.get<Question>(
        `/get-question.php?id=${questionId}`
      );

      setBody(question.body);
      setAnswers(
        question.answers.map((answer) => ({
          ...answer,
          is_right: answer.is_right == true,
        }))
      );
      setExplanation(question.explanation);
      setFeaturedImage(question.featured_image || '');
      setAdditionalInformationArray(question.informations);
    } catch (err) {
      handleError(err);
    }
  }

  async function deleteAnswer(i: number) {
    const answer = answers[i];

    updateUI();

    if (onExistingQuestion) {
      setLoading(true);
      try {
        await api.delete(`/delete-answer.php?id=${answer.id}`);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }

    function updateUI() {
      const newAnswers = [...answers];

      newAnswers.splice(i, 1);

      if (answer.is_right) newAnswers[0].is_right = true;

      setAnswers(newAnswers);
    }
  }

  async function deleteInformation(i: number) {
    const information = additionalInformationArray[i];

    updateUI();

    if (onExistingQuestion) {
      setLoading(true);
      try {
        await api.delete(`/delete-information.php?id=${information.id}`);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }

    function updateUI() {
      const newAdditionalInformationArray = [...additionalInformationArray];

      newAdditionalInformationArray.splice(i, 1);

      setAdditionalInformationArray(newAdditionalInformationArray);
    }
  }
};

export default QuestionPage;
