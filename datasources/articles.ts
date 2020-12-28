import { promises as fs } from "fs";
import yaml from "js-yaml";
import path from "path";

type Meta = {
	title?: string;
	date?: Date;
	tags?: string[];
};
export type Article = Required<Omit<Meta, "date">> & {
	dateStr: string;
	body: string;
};

const parseArticle = (raw: string): Article => {
	const [, rawMeta, body] = raw.split("---\n");
	const { title, date, tags } = yaml.safeLoad(rawMeta) as Meta;

	if (!title) {
		throw new Error("parse failed: `title` did not exist");
	}
	if (!date) {
		throw new Error("parse failed: `date` did not exist");
	}
	if (!tags) {
		throw new Error("parse failed: `tags` did not exist");
	}

	const dateStr = date.toISOString();
	return { title, tags, dateStr, body };
};

let cachedArticles: Article[];
export const getArticles = async (): Promise<Article[]> => {
	if (cachedArticles) {
		return cachedArticles;
	}

	const articlesDir = process.env.ARTICLES_DIR;
	if (!articlesDir) {
		throw new Error("env ARTICLES_DIR is not set");
	}

	cachedArticles = await Promise.all(
		(await fs.readdir(articlesDir))
			.filter(entry => entry.endsWith(".md"))
			.map(async entry => {
				const raw = await fs.readFile(path.join(articlesDir, entry), "utf-8");
				return parseArticle(raw);
			}),
	);

	return cachedArticles.sort((a, b) => b.dateStr.localeCompare(a.dateStr));
};
