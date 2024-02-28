import reportError from './reportError';

function handleError(err: unknown) {
  console.error(err);

  reportError('An error occurred. Check the console for more details.');

  return Promise.reject(err);
}

export default handleError;
