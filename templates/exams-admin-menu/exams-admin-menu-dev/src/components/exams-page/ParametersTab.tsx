import { c } from '../../lib';
import { TemplateType } from '../../types';
// import { SkillCategory } from '../../types';
import {
  BooleanButton,
  Checkbox,
  Dropdown,
  Input,
  LabeledBox,
  NumberInput,
  ToggleButton,
} from '../common';

interface ParametersTabProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  setName: (name: string) => void;
  // skillCategories: SkillCategory[];
  // setSkillCategories: (skillCategories: SkillCategory[]) => void;
  // selectedSkillCategories: { id: string; text: string }[];
  // setSelectedSkillCategories: (
  //   selectedSkillCategories: { id: string; text: string }[]
  // ) => void;
  mins: number;
  setMins: (mins: number) => void;
  secs: number;
  setSecs: (secs: number) => void;
  questionSecs: number;
  setQuestionSecs: (questionSecs: number) => void;
  userNavigationActivated: boolean;
  setUserNavigationActivated: (userNavigationActivated: boolean) => void;
  questionQuantity: number;
  setQuestionQuantity: (questionQuantity: number) => void;
  minQuestions: number | null;
  setMinQuestions: (questions: number | null) => void;
  maxQuestions: number | null;
  setMaxQuestions: (questions: number | null) => void;
  templateType: string;
  setTemplateType: (templateType: TemplateType) => void;
  markingThresholdsActivated: boolean;
  setMarkingThresholdsActivated: (markingThresholdsActivated: boolean) => void;
  strongPass: string;
  setStrongPass: (strongPass: string) => void;
  weakPass: string;
  setWeakPass: (weakPass: string) => void;
  showResults: boolean;
  setShowResults: (showResults: boolean) => void;
  coPilotActivated: boolean;
  setCoPilotActivated: (coPilotActivated: boolean) => void;
  customizationModeActivated: boolean;
  setCustomizationModeActivated: (customizationModeActivated: boolean) => void;
  trainingModeActivated: boolean;
  setTrainingModeActivated: (trainingModeActivated: boolean) => void;
  flagQuestionsActivated: boolean;
  setFlagQuestionsActivated: (flagQuestionsActivated: boolean) => void;
  examBuilderActivated: boolean;
  setExamBuilderActivated: (examBuilderActivated: boolean) => void;
  randomiseAnswerOrderActivated: boolean;
  setRandomiseAnswerOrderActivated: (
    randomiseAnswerOrderActivated: boolean
  ) => void;
  hideQuestionBodyPreviewActivated: boolean;
  setHideQuestionBodyPreviewActivated: (
    randomiseAnswerOrderActivated: boolean
  ) => void;
  questionMap: boolean;
  setQuestionMap: (questionMap: boolean) => void;
}

const ParametersTab: React.FC<ParametersTabProps> = ({
  name,
  setName,
  // skillCategories,
  // setSkillCategories,
  // selectedSkillCategories,
  // setSelectedSkillCategories,
  mins,
  setMins,
  secs,
  setSecs,
  questionSecs,
  setQuestionSecs,
  userNavigationActivated,
  setUserNavigationActivated,
  questionQuantity,
  setQuestionQuantity,
  minQuestions,
  setMinQuestions,
  maxQuestions,
  setMaxQuestions,
  templateType,
  setTemplateType,
  markingThresholdsActivated,
  setMarkingThresholdsActivated,
  strongPass,
  setStrongPass,
  weakPass,
  setWeakPass,
  showResults,
  setShowResults,
  coPilotActivated,
  setCoPilotActivated,
  customizationModeActivated,
  setCustomizationModeActivated,
  trainingModeActivated,
  setTrainingModeActivated,
  flagQuestionsActivated,
  setFlagQuestionsActivated,
  examBuilderActivated,
  setExamBuilderActivated,
  randomiseAnswerOrderActivated,
  setRandomiseAnswerOrderActivated,
  hideQuestionBodyPreviewActivated,
  setHideQuestionBodyPreviewActivated,
  questionMap,
  setQuestionMap,
  ...rest
}) => {
  return (
    <div {...rest} className={c('flex gap-8 p-8', rest.className)}>
      <div className="flex flex-1 flex-col gap-8">
        <LabeledBox label="Name">
          <p className="mb-4 text-sm text-themeDarkGray">
            Alphanumeric characters (A-Z, 0-9) only.
          </p>
          <Input
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </LabeledBox>
        {/* <LabeledBox label="Skill Categories">
          <p className="mb-4 text-sm text-themeDarkGray">
            Input Skill Categories, separated by comma, that this exam
            contributes to:
          </p>
          <ReactTags
            handleAddition={(category) => {
              const categoryValid =
                skillCategories
                  .map((category) => category.name)
                  .includes(category.text) &&
                !selectedSkillCategories
                  .map((category) => category.text)
                  .includes(category.text);

              if (categoryValid) {
                setSelectedSkillCategories([
                  ...selectedSkillCategories,
                  category,
                ]);
              }
            }}
            handleDelete={(i) => {
              const newSkillCategories = [...selectedSkillCategories];

              newSkillCategories.splice(i, 1);

              setSelectedSkillCategories(newSkillCategories);
            }}
            suggestions={skillCategories.map((category) => ({
              id: category.id,
              text: category.name,
            }))}
            tags={selectedSkillCategories}
            placeholder=""
            autocomplete
            minQueryLength={1}
          />
        </LabeledBox> */}
        <LabeledBox label="Timing">
          <div className="relative -left-8 w-[calc(100%+4rem)] border-b border-themeLightGray px-8 pb-4">
            <p className="mb-4 font-semibold">Exam Duration:</p>
            <div className="flex w-full justify-between gap-2">
              <div className="flex flex-1 items-center gap-2">
                <span className="text-sm text-themeDarkGray">Mins:</span>
                <Dropdown
                  className="flex-1 text-sm"
                  options={[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                  ].map((num) => ({
                    key: num,
                    label: `${num} min`,
                  }))}
                  selected={mins}
                  onOptionChange={setMins}
                />
              </div>
              <div className="flex flex-1 items-center gap-2">
                <span className="text-sm text-themeDarkGray">Secs:</span>
                <Dropdown
                  className="flex-1 text-sm"
                  options={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
                    (num) => ({
                      key: num,
                      label: `${num} secs`,
                    })
                  )}
                  selected={secs}
                  onOptionChange={setSecs}
                />
              </div>
            </div>
          </div>
          <div className="w-full pt-4">
            <p className="mb-4 font-semibold">Question Duration:</p>
            <div className="mb-6 flex w-1/2 items-center gap-2">
              <span>Secs:</span>
              <Dropdown
                className="flex-1"
                options={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
                  (num) => ({
                    key: num,
                    label: `${num} secs`,
                  })
                )}
                selected={questionSecs}
                onOptionChange={setQuestionSecs}
              />
            </div>
            <div className="flex items-baseline gap-4">
              <Checkbox
                toggled={userNavigationActivated}
                onToggle={setUserNavigationActivated}
              />
              <span className="text-themeDarkGray">
                Allow user navigation (forward and back), disables question
                duration.
              </span>
            </div>
          </div>
        </LabeledBox>
      </div>
      <div className="flex flex-1 flex-col gap-8">
        <LabeledBox label="Questions Quantity">
          <p className="mb-4 text-sm text-themeDarkGray">
            How many questions per exam?
          </p>
          <NumberInput
            className="w-1/2"
            type="number"
            min={3}
            max={50}
            value={questionQuantity}
            onInputChange={setQuestionQuantity}
          />
          <div className="mt-4 flex w-full gap-4">
            <div className="flex flex-1 items-center gap-2">
              <p className="text-sm text-themeDarkGray">Min:</p>
              <NumberInput
                className="flex-1"
                type="number"
                min={1}
                value={minQuestions || 0}
                onInputChange={setMinQuestions}
              />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <p className="text-sm text-themeDarkGray">Max:</p>
              <NumberInput
                className="flex-1"
                type="number"
                min={1}
                value={maxQuestions || 0}
                onInputChange={setMaxQuestions}
              />
            </div>
          </div>
        </LabeledBox>
        <LabeledBox label="Template Type">
          <p className="mb-4 text-sm text-themeDarkGray">
            Choose Template Type:
          </p>
          <Dropdown
            className="w-full"
            options={[
              {
                label: 'Vertical Text',
                key: 'vertical-text',
              },
              {
                label: 'Horizontal Text',
                key: 'horizontal-text',
              },
              {
                label: 'Horizontal Images',
                key: 'horizontal-images',
              },
              {
                label: 'Horizontal Letters',
                key: 'horizontal-letters',
              },
            ]}
            selected={templateType}
            onOptionChange={setTemplateType}
          />
        </LabeledBox>
        <LabeledBox label="Making Thresholds">
          <div className="flex items-center gap-4 pb-6 pt-2">
            <Checkbox
              toggled={markingThresholdsActivated}
              onToggle={setMarkingThresholdsActivated}
            />
            <span className="text-themeDarkGray">
              Utilize Marking Thresholds?
            </span>
          </div>
          <div className="relative -left-8 flex w-[calc(100%+4rem)] items-center gap-6 border-b border-t border-themeLightGray px-8 py-4">
            <span className="text-[#3fd238]">Strong Pass:</span>
            <Input
              placeholder="E.g. 85%"
              disabled={!markingThresholdsActivated}
              value={strongPass}
              onChange={(e) => setStrongPass(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 pb-2 pt-6">
            <span className="text-[#f8cc3f]">Weak Pass:</span>
            <Input
              placeholder="E.g. 85%"
              disabled={!markingThresholdsActivated}
              value={weakPass}
              onChange={(e) => setWeakPass(e.target.value)}
            />
          </div>
        </LabeledBox>
      </div>
      <div className="flex flex-1 flex-col gap-8">
        <LabeledBox label="Results">
          <p className="mb-4 text-sm text-themeDarkGray">
            Show results on completion of exam?
          </p>
          <BooleanButton flag={showResults} onToggle={setShowResults} />
        </LabeledBox>
        <LabeledBox label="Additional Modes">
          <p className="mb-4 text-sm text-themeDarkGray">
            Choose Additional Modes available for User:
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <ToggleButton
                toggled={coPilotActivated}
                onToggle={setCoPilotActivated}
              />
              <span>CoPilot Mode</span>
            </div>
            <div className="flex items-center gap-3">
              <ToggleButton
                toggled={customizationModeActivated}
                onToggle={setCustomizationModeActivated}
              />
              <span>Customization Mode</span>
            </div>
            <div className="flex items-center gap-3">
              <ToggleButton
                toggled={trainingModeActivated}
                onToggle={setTrainingModeActivated}
              />
              <span>Training Mode</span>
            </div>
            <div className="flex items-center gap-3">
              <ToggleButton
                toggled={flagQuestionsActivated}
                onToggle={setFlagQuestionsActivated}
              />
              <span>Flag Questions</span>
            </div>
            <div className="flex items-center gap-3">
              <ToggleButton
                toggled={examBuilderActivated}
                onToggle={setExamBuilderActivated}
              />
              <span>Allow Exam Builder</span>
            </div>
            <div className="flex items-center gap-3">
              <ToggleButton
                toggled={randomiseAnswerOrderActivated}
                onToggle={setRandomiseAnswerOrderActivated}
              />
              <span>Randomise Answer Order</span>
            </div>
            <div className="flex items-center gap-3">
              <ToggleButton
                toggled={hideQuestionBodyPreviewActivated}
                onToggle={setHideQuestionBodyPreviewActivated}
              />
              <span>Hide Question Body Preview</span>
            </div>
          </div>
        </LabeledBox>
        <LabeledBox label="Question Map">
          <p className="mb-4 text-sm text-themeDarkGray">
            Choose Question Map:
          </p>
          <Dropdown
            className="w-full"
            options={[
              { key: false, label: 'Disabled' },
              { key: true, label: 'Enabled' },
            ]}
            selected={questionMap}
            onOptionChange={setQuestionMap}
          />
        </LabeledBox>
      </div>
    </div>
  );
};

export default ParametersTab;
