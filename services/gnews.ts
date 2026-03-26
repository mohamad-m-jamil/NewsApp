const API_KEY = process.env.EXPO_PUBLIC_GNEWS_API_KEY || "";
const BASE_URL = "https://gnews.io/api/v4/top-headlines";
const SEARCH_URL = "https://gnews.io/api/v4/search";

export interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string; url: string };
  author?: string;
}

/**
 * @param limit
 * @param keyword
 */
export async function fetchNews(limit = 10, keyword = ""): Promise<Article[]> {
  try {
    const base = keyword.trim() ? SEARCH_URL : BASE_URL;
    const q = keyword.trim() ? `&q=${encodeURIComponent(keyword.trim())}` : "";
    const url = `${base}?token=${API_KEY}&lang=en&max=${limit}${q}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    return data.articles ?? [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}