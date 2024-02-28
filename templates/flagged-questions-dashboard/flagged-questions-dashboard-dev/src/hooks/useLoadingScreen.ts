import Notiflix from 'notiflix';

function useLoadingScreen(loading: boolean, error?: unknown) {
  if (error) {
    Notiflix.Report.failure('Error', error as string, 'OK');
    return;
  }

  if (loading) Notiflix.Loading.standard({ svgColor: '#00acdd' });
  else Notiflix.Loading.remove();
}

export default useLoadingScreen;
