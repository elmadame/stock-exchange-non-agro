import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const NEWS_FILE = join(__dirname, 'newsData.json');

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

interface NewsData {
  news: NewsPost[];
}

async function readNewsData(): Promise<NewsData> {
  try {
    const data = await readFile(NEWS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Convert timestamp strings to Date objects
    parsed.news = parsed.news.map((post: any) => ({
      ...post,
      timestamp: new Date(post.timestamp),
    }));
    return parsed;
  } catch (error) {
    console.error('[News] Error reading news data:', error);
    return { news: [] };
  }
}

async function writeNewsData(data: NewsData): Promise<void> {
  try {
    await writeFile(NEWS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('[News] Error writing news data:', error);
    throw error;
  }
}

export async function getAllNews(): Promise<NewsPost[]> {
  const data = await readNewsData();
  // Sort by timestamp descending (newest first)
  return data.news.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function getRecentNews(limit: number = 5): Promise<NewsPost[]> {
  const allNews = await getAllNews();
  return allNews.slice(0, limit);
}

export async function createNewsPost(
  title: string,
  content: string,
  author: string,
  priority: 'high' | 'medium' | 'low' = 'medium'
): Promise<NewsPost> {
  const data = await readNewsData();
  
  const newPost: NewsPost = {
    id: Date.now().toString(),
    title,
    content,
    author,
    timestamp: new Date(),
    priority,
  };
  
  data.news.push(newPost);
  await writeNewsData(data);
  
  return newPost;
}

export async function updateNewsPost(
  id: string,
  updates: Partial<Omit<NewsPost, 'id' | 'timestamp'>>
): Promise<NewsPost | null> {
  const data = await readNewsData();
  const postIndex = data.news.findIndex(post => post.id === id);
  
  if (postIndex === -1) {
    return null;
  }
  
  data.news[postIndex] = {
    ...data.news[postIndex],
    ...updates,
  };
  
  await writeNewsData(data);
  return data.news[postIndex];
}

export async function deleteNewsPost(id: string): Promise<boolean> {
  const data = await readNewsData();
  const initialLength = data.news.length;
  
  data.news = data.news.filter(post => post.id !== id);
  
  if (data.news.length === initialLength) {
    return false; // Post not found
  }
  
  await writeNewsData(data);
  return true;
}
