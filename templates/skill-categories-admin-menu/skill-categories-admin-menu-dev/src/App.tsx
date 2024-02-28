import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteSkillCategory,
  getSkillCategories,
  postSkillCategory,
} from './api';
import { Button, Table } from './components';
import { useLoadingScreen } from './hooks';
import { showInputModal, tempId } from './lib';
import { SkillCategory } from './types';

function App() {
  const client = useQueryClient();

  const {
    isLoading: getSkillCategoriesLoading,
    data: skillCategories,
    isError: getSkillCategoriesError,
  } = useQuery(['skill-categories'], getSkillCategories);

  const {
    mutate: mutateSkillCategories,
    isLoading: mutateSkillCategoriesLoading,
    isError: mutateSkillCategoriesError,
  } = useMutation(
    (data: { skillCategory: SkillCategory; method: 'post' | 'delete' }) => {
      const { skillCategory, method } = data;

      switch (method) {
        case 'post':
          return postSkillCategory(skillCategory);
        case 'delete':
          return deleteSkillCategory(skillCategory.id);
      }
    },
    {
      onSuccess: () => client.invalidateQueries(['skill-categories']),
    }
  );

  useLoadingScreen(
    getSkillCategoriesLoading ||
      mutateSkillCategoriesLoading ||
      getSkillCategoriesError ||
      mutateSkillCategoriesError
  );

  return (
    <div>
      <h1 className="mb-6 text-4xl">Skill Categories</h1>
      <Table
        className="mb-4"
        columns={['ID', 'Skill Category']}
        itemName="skill category"
        data={skillCategories ? skillCategories : []}
        renderRow={(skill: SkillCategory) => [skill.id, skill.name]}
        onParametersClick={(skill: SkillCategory, i) => {
          showInputModal({
            title: 'Edit Skill Category',
            description: 'Enter skill category name:',
            defaultValue: skill.name as string,
            onSubmit(value) {
              if (!skillCategories) return;

              mutateSkillCategories({
                skillCategory: {
                  ...skillCategories[i],
                  name: value,
                },
                method: 'post',
              });
            },
          });
        }}
        onDelete={(_, i) => {
          if (!skillCategories) return;

          mutateSkillCategories({
            skillCategory: skillCategories[i],
            method: 'delete',
          });
        }}
      />
      <Button
        look="blue"
        onClick={() => {
          showInputModal({
            title: 'Create New Skill Category',
            description: 'Enter skill category name:',
            onSubmit(value) {
              mutateSkillCategories({
                skillCategory: {
                  id: tempId(),
                  name: value,
                },
                method: 'post',
              });
            },
          });
        }}
      >
        Add New Skill Category
      </Button>
    </div>
  );
}

export default App;
