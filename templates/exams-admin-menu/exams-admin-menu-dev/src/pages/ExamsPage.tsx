import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../clients';
import { BackButton, Button, Table } from '../components';
import useLoadingScreen from '../hooks/useLoading';
import { reportSuccess } from '../lib';
import type { Exam } from '../types';

const ExamsPage: React.FC = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(false);
  useLoadingScreen(loading);

  useEffect(() => {
    setLoading(true);
    loadExams().finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex h-full flex-col justify-center">
      <div className="flex h-full flex-col items-start">
        <h1 className="mb-4 text-4xl">Exams</h1>
        <h2 className="mb-8 text-2xl text-themeDarkGray">Editable Exams</h2>
        <Table
          className="mb-4 w-full"
          columns={[
            'ID',
            'Name',
            'Categories',
            'Sub-Categories',
            'Available Ques.',
          ]}
          data={exams}
          renderRow={(exam: Exam) => [
            exam.id,
            exam.name,
            exam.categories.length,
            exam.categories.reduce(
              (sum, category) => sum + category.sub_categories.length,
              0
            ),
            exam.categories.reduce(
              (sum, category) =>
                (sum +=
                  category.questions.length +
                  category.sub_categories.reduce(
                    (sum, category) => (sum += category.questions.length),
                    0
                  )),
              0
            ),
          ]}
          itemName="exam"
          onQuestionsClick={(exam: Exam) =>
            navigate(`/exams/${exam.id}/questions`)
          }
          onParametersClick={(exam) => navigate(`/exams/${exam.id}/parameters`)}
          onDelete={(exam) => deleteExam(exam.id)}
        />
        <div className="flex gap-2">
          <Link to="/exams/new/parameters">
            <Button look="blue">Add New Exam</Button>
          </Link>
          <BackButton />
        </div>
      </div>
    </main>
  );

  async function deleteExam(examId: string) {
    setLoading(true);
    try {
      await api.delete(`/delete-exam.php?id=${examId}`);

      await loadExams();

      reportSuccess('Exam was successfully deleted.');
    } catch (err) {
      console.error(err);

      reportError('An error occurred. Check the console for more details.');

      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadExams() {
    const { data: exams } = await api.get<Exam[]>('/get-all-exams.php');

    setExams(exams);
  }
};

export default ExamsPage;
