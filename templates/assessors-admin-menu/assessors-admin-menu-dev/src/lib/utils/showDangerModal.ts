import Notiflix from 'notiflix';

function showDangerModal(options: {
  title: string;
  message: string;
  onSubmit: () => void;
}) {
  const { title, message, onSubmit } = options;

  Notiflix.Confirm.show(title, message, 'OK', 'Cancel', onSubmit, undefined, {
    borderRadius: '6px',
    titleColor: '#e50b05',
    cancelButtonBackground: 'transparent',
    cancelButtonColor: '#6b6b6b',
    okButtonBackground: '#e50b05',
  });
}

export default showDangerModal;
