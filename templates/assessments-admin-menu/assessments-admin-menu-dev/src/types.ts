export interface Assessment {
  id: string;
  name: string;
  activities: Activity[];
  articles: Article[];
}

export interface Activity {
  id: string;
  slug: string;
  name: string;
  image: string;
}

export interface Article {
  id: string;
  title: string;
}
