import Notiflix from 'notiflix';

function showInputModal(options: {
  title: string;
  description: string;
  defaultValue?: string;
  onSubmit: (value: string) => void;
}) {
  const { title, description, defaultValue = '', onSubmit } = options;

  Notiflix.Confirm.prompt(
    title,
    description,
    defaultValue,
    'OK',
    'Cancel',
    onSubmit,
    undefined,
    {
      borderRadius: '6px',
      titleColor: '#85db21',
      cancelButtonBackground: 'transparent',
      cancelButtonColor: '#6b6b6b',
      okButtonBackground: '#85db21',
    }
  );
}

export default showInputModal;
