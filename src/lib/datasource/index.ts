import { Article, getArticles } from "./articles";
import { External, getExternals } from "./external";

export type Entry = Article | External;

export const getEntries = async (): Promise<Entry[]> => {
	const entries = await Promise.all([getArticles(), getExternals()]);
	return entries.flat().sort((a, b) => b.date.localeCompare(a.date));
};
