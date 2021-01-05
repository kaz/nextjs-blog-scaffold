import { Article, getArticles } from "./articles";

export type Entry = Article;

export const getEntries = async (): Promise<Entry[]> => {
	const entries = await Promise.all([getArticles()]);
	return entries.flat().sort((a, b) => b.date.localeCompare(a.date));
};
