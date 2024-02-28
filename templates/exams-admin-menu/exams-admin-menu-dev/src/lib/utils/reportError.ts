import Notiflix from 'notiflix';

function reportError(message: string) {
  Notiflix.Report.failure('Error', message, 'OK', {
    borderRadius: '6px',
    failure: {
      svgColor: '#e50b05',
      buttonBackground: '#e50b05',
      buttonColor: '#fff',
      backOverlayColor: 'rgba(0, 0, 0, 0.6)',
    },
  });
}

export default reportError;
