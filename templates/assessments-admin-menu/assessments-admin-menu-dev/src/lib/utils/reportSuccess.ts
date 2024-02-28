import Notiflix from 'notiflix';

function reportSuccess(message: string) {
  Notiflix.Report.success('Success', message, 'OK', {
    borderRadius: '6px',
    success: {
      svgColor: '#3fd238',
      buttonBackground: '#3fd238',
      buttonColor: '#fff',
      backOverlayColor: 'rgba(0, 0, 0, 0.6)',
    },
  });
}

export default reportSuccess;
