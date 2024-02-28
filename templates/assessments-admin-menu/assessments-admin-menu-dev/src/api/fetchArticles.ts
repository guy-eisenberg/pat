import { api } from '../clients';
import { Article } from '../types';

async function fetchArticles() {
  try {
    const { data: articles } = await api.get<Article[]>(
      '/get-all-articles.php'
    );

    return articles;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchArticles;
