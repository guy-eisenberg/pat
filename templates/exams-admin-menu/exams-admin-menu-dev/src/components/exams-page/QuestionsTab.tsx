import { Link, useNavigate } from 'react-router-dom';
import { c, showInputModal, tempId } from '../../lib';
import type { Category, Question } from '../../types';
import { Button, Table } from '../common';

interface QuestionsTabProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: Category[];
  onCategoryCreate: (category: Category, parentCategory?: Category) => void;
  onCategoryEdit: (category: Category, parentCategory?: Category) => void;
  onCategoryDelete: (category: Category, parentCategory?: Category) => void;
  onQuestionDelete: (question: Question, category: Category) => void;
  selectedCategoryIndex: number | undefined;
  setSelectedCategoryIndex: (selectedCategoryIndex: number | undefined) => void;
  selectedSubcategoryIndex: number | undefined;
  setSelectedSubcategoryIndex: (
    selectedSubcategoryIndex: number | undefined
  ) => void;
  focusedCategory: Category | undefined;
  focusedSubcategory: Category | undefined;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({
  categories,
  onCategoryCreate,
  onCategoryEdit,
  onCategoryDelete,
  onQuestionDelete,
  selectedCategoryIndex,
  setSelectedCategoryIndex,
  selectedSubcategoryIndex,
  setSelectedSubcategoryIndex,
  focusedCategory,
  focusedSubcategory,
  ...rest
}) => {
  const navigate = useNavigate();

  return (
    <div {...rest} className={c('flex flex-col gap-8 p-8', rest.className)}>
      <div className="flex w-full gap-8">
        <div className="flex-1">
          <Table
            data={categories}
            className="mb-4 w-full"
            columns={['Category', 'No. of Sub-Categories']}
            renderRow={(category: Category) => [
              category.name,
              category.sub_categories.length,
            ]}
            itemName="category"
            actions={{ parameters: true, delete: true }}
            onParametersClick={(category: Category, i) =>
              showInputModal({
                title: 'Edit Category',
                description: 'Enter category name:',
                defaultValue: category.name,
                onSubmit(value) {
                  onCategoryEdit({
                    ...categories[i],
                    name: value,
                  });
                },
              })
            }
            onDelete={(_, i) => onCategoryDelete(categories[i])}
            selectedRowIndex={selectedCategoryIndex}
            onRowSelect={(i) => {
              setSelectedCategoryIndex(i);

              setSelectedSubcategoryIndex(undefined);
            }}
          />
          <Button
            look="green"
            onClick={() => {
              showInputModal({
                title: 'Create a new Category',
                description: 'Enter category name:',
                onSubmit: (name: string) => {
                  const newCategory = {
                    id: tempId(),
                    name,
                    sub_categories: [],
                    questions: [],
                  };

                  onCategoryCreate(newCategory);
                },
              });
            }}
          >
            Add New Category
          </Button>
        </div>
        {selectedCategoryIndex !== undefined && (
          <div className="flex-1">
            <Table
              className="mb-4 w-full"
              columns={['Sub-Category', 'No. of Questions']}
              data={
                selectedCategoryIndex !== undefined
                  ? categories[selectedCategoryIndex].sub_categories
                  : []
              }
              renderRow={(subCategory: Category) => [
                subCategory.name,
                subCategory.questions.length,
              ]}
              itemName="sub-category"
              actions={{ parameters: true, delete: true }}
              onParametersClick={(subCategory: Category, i) =>
                showInputModal({
                  title: 'Edit Sub-Category',
                  description: 'Enter sub-category name:',
                  defaultValue: subCategory.name,
                  onSubmit: (value) => {
                    onCategoryEdit(
                      {
                        ...categories[selectedCategoryIndex].sub_categories[i],
                        name: value,
                      },
                      categories[selectedCategoryIndex]
                    );
                  },
                })
              }
              onDelete={(_, i) =>
                onCategoryDelete(
                  categories[selectedCategoryIndex].sub_categories[i],
                  categories[selectedCategoryIndex]
                )
              }
              selectedRowIndex={selectedSubcategoryIndex}
              onRowSelect={setSelectedSubcategoryIndex}
            />
            <Button
              look="green"
              onClick={() => {
                showInputModal({
                  title: 'Create a new Sub-Category',
                  description: 'Enter sub-category name:',
                  onSubmit: (name: string) => {
                    const newSubcategory = {
                      id: tempId(),
                      name,
                      sub_categories: [],
                      questions: [],
                    };

                    onCategoryCreate(
                      newSubcategory,
                      categories[selectedCategoryIndex]
                    );
                  },
                });
              }}
            >
              Add New Sub-Category
            </Button>
          </div>
        )}
      </div>
      {selectedCategoryIndex !== undefined &&
        (focusedCategory || focusedSubcategory) && (
          <div className="w-full">
            <Table
              className="mb-4 w-full"
              columns={['Name', 'Category', 'Sub-Category']}
              data={(focusedSubcategory || focusedCategory)!.questions}
              renderRow={(question) => [
                question.body,
                focusedCategory ? focusedCategory.name : '',
                focusedSubcategory ? focusedSubcategory.name : '',
              ]}
              itemName="question"
              actions={{ parameters: true, delete: true }}
              onDelete={(_, i) => {
                const relevantCategory = (focusedSubcategory ||
                  focusedCategory)!;

                onQuestionDelete(
                  relevantCategory.questions[i],
                  relevantCategory
                );
              }}
              onParametersClick={(_, i) => {
                const relevantCategory = (focusedSubcategory ||
                  focusedCategory)!;

                navigate(`${relevantCategory.questions[i].id}`);
              }}
            />
            <Link to="new">
              <Button look="green">Add New Question</Button>
            </Link>
          </div>
        )}
    </div>
  );
};

export default QuestionsTab;
