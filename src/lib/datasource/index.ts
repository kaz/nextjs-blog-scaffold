import { Article, getArticles } from "./articles";
import { External, getExternals } from "./external";

export type Entry = Article | External;

const getEntries = async (): Promise<Entry[]> => {
	const entries = await Promise.all([getArticles(), getExternals()]);
	return entries.flat();
};

export const getEntriesByTag = async (tag?: string): Promise<Entry[]> => {
	const filterFn = tag ? ({ tags }: Entry) => tags.some(t => t == tag) : () => true;
	return (await getEntries()).filter(filterFn).sort((a, b) => b.date.localeCompare(a.date));
};

export const getTags = async (): Promise<string[]> => {
	const entries = await getEntries();
	return Array.from(new Set(entries.map(({ tags }) => tags).flat()));
};
