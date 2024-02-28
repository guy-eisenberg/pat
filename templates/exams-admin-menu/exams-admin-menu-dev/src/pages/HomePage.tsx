import { HomePageButton } from '../components';
import { p } from '../lib';

const HomePage: React.FC = () => {
  return (
    <main className="w-full pt-8">
      <h1 className="mb-16 text-left text-4xl">Exams</h1>
      <div className="flex gap-4">
        <HomePageButton className="flex-1" to="/exams">
          <img
            alt="editable exams icon"
            src={p('icons/editable_exams.svg')}
            width={64}
            height={64}
          />
          <p>
            <b>Editable</b> Exams
          </p>
        </HomePageButton>
        <HomePageButton className="flex-1" to="/exams/new/parameters">
          <img
            alt="new exam icon"
            src={p('icons/new_exam.svg')}
            width={64}
            height={64}
          />
          <p>
            <b>New</b> Exam
          </p>
        </HomePageButton>
        <HomePageButton className="flex-1" to="">
          <img
            alt="scores icon"
            src={p('icons/scores.svg')}
            width={64}
            height={64}
          />
          <p>
            <b>Scores</b>
          </p>
        </HomePageButton>
      </div>
    </main>
  );
};

export default HomePage;
