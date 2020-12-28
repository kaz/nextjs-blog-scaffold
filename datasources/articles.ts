import crypto from "crypto";
import { promises as fs } from "fs";
import yaml from "js-yaml";
import path from "path";

type Meta = {
	slug: string;
	title: string;
	date: Date;
	tags: string[];
};
export type Article = Omit<Meta, "date"> & {
	date: string;
	body: string;
};

const parseArticle = (raw: string): Article => {
	const [, rawMeta, body] = raw.split("---\n");
	const meta = yaml.safeLoad(rawMeta) as Partial<Meta>;

	if (!meta.title) {
		throw new Error("parse failed: `title` did not exist");
	}
	if (!meta.date) {
		throw new Error("parse failed: `date` did not exist");
	}
	if (!meta.tags) {
		throw new Error("parse failed: `tags` did not exist");
	}

	return {
		slug: meta.slug || crypto.createHash("md5").update(meta.title).digest("hex"),
		title: meta.title,
		date: meta.date.toISOString(),
		tags: meta.tags,
		body,
	};
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

	return cachedArticles.sort((a, b) => b.date.localeCompare(a.date));
};
export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
	const articles = await getArticles();
	return articles.find(article => article.slug == slug);
};
