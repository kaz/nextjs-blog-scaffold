import frontmatter from "front-matter";
import path from "path";
import { getMtimeFromGit } from "../git";
import { markdownToDescription, markdownToHtml } from "../markdown";
import { canonicalUrlFromSlug } from "../utils";
import Store from "./store";

type ArticleAttrs = {
	title: string;
	image: string | null;
	tags: string[];
	date: Date;
	updated: Date;
};
export type Article = Omit<ArticleAttrs, "date" | "updated"> & {
	type: "article";
	slug: string;
	body: string;
	date: string;
	updated: string;
};
export type CompiledArticle = Article & {
	description: string;
	content: string;
};

const ext = ".md";

const store = new Store<Article>({
	getSourceDir() {
		if (!process.env.ARTICLES_DIR) {
			throw new Error("ARTICLES_DIR is undefined");
		}
		return process.env.ARTICLES_DIR;
	},
	getSelector() {
		return fileName => fileName.endsWith(ext);
	},
	selectFileByKey(key) {
		return `${key}${ext}`;
	},
	async parse(raw, filePath) {
		const slug = path.basename(filePath, ext);
		const { attributes, body } = frontmatter<Partial<ArticleAttrs>>(raw);

		if (!attributes.title) {
			attributes.title = slug;
		}
		if (attributes.image) {
			attributes.image = new URL(attributes.image, canonicalUrlFromSlug(slug)).toString();
		}
		if (!attributes.date) {
			attributes.date = new Date();
		}
		if (!attributes.updated) {
			const mtime = await getMtimeFromGit(filePath);
			attributes.updated = mtime || attributes.date;
		}

		return {
			type: "article",
			slug,
			body,
			title: attributes.title,
			image: attributes.image || null,
			tags: attributes.tags || [],
			date: attributes.date.toISOString(),
			updated: attributes.updated.toISOString(),
		};
	},
});

export const getArticles = () => store.getAll();
export const getArticleBySlug = async (slug: string) => {
	const article = await store.get(slug);
	if (!article) {
		return;
	}

	const [description, content] = await Promise.all([markdownToDescription(article.body), markdownToHtml(article.body)]);
	const result: CompiledArticle = Object.assign({ description, content }, article);
	return result;
};
