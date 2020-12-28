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
