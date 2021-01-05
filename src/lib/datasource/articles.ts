import crypto from "crypto";
import frontmatter from "front-matter";
import { promises as fs } from "fs";
import path from "path";

type Attributes = {
	slug: string;
	title: string;
	date: Date;
	tags: string[];
};
export type Article = Omit<Attributes, "date"> & {
	date: string;
	body: string;
};

const articlesDir = "./articles";
const cache = new Map<string, Article>();

export const getArticles = async (): Promise<Article[]> => {
	if (cache.size) {
		return Array.from(cache.values());
	}
	return Promise.all((await fs.readdir(articlesDir)).filter(entry => entry.endsWith(".md")).map(readArticle));
};
export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
	if (!cache.size) {
		await getArticles();
	}
	return cache.get(slug);
};

const readArticle = async (filePath: string): Promise<Article> => {
	const raw = await fs.readFile(path.join(articlesDir, filePath), "utf-8");
	const article = parseArticle(raw);
	cache.set(article.slug, article);
	return article;
};
const parseArticle = (raw: string): Article => {
	const { attributes, body } = frontmatter<Partial<Attributes>>(raw);

	if (!attributes.title) {
		throw new Error("parse failed: `title` did not exist");
	}
	if (!attributes.date) {
		throw new Error("parse failed: `date` did not exist");
	}
	if (!attributes.tags) {
		throw new Error("parse failed: `tags` did not exist");
	}

	return {
		slug: attributes.slug || crypto.createHash("md5").update(attributes.title).digest("hex"),
		title: attributes.title,
		date: attributes.date.toISOString(),
		tags: attributes.tags,
		body,
	};
};
