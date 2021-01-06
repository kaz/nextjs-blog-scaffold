import frontmatter from "front-matter";
import path from "path";
import { getMtimeFromGit } from "../git";
import { markdownToDescription, markdownToHtml } from "../markdown";
import { canonicalUrlFromSlug } from "../utils";
import Store from "./store";

type ArticleAttrs = {
	slug: string;
	title: string;
	image: string | null;
	tags: string[];
	date: Date;
	updated: Date;
};
export type Article = Omit<ArticleAttrs, "date" | "updated"> & {
	type: "article";
	date: string;
	updated: string;
	body: string;
};
export type CompiledArticle = Article & {
	description: string;
	content: string;
};

const store = new Store<Article>({
	getSourceDir() {
		if (!process.env.ARTICLES_DIR) {
			throw new Error("ARTICLES_DIR is undefined");
		}
		return process.env.ARTICLES_DIR;
	},
	getFilter() {
		return ent => ent.endsWith(".md");
	},
	getId(t) {
		return t.slug;
	},
	async parse(raw, filePath) {
		const { attributes, body } = frontmatter<Partial<ArticleAttrs>>(raw);

		if (!attributes.slug) {
			attributes.slug = path.basename(filePath, ".md");
		}
		if (!attributes.title) {
			attributes.title = attributes.slug;
		}
		if (attributes.image) {
			attributes.image = new URL(attributes.image, canonicalUrlFromSlug(attributes.slug)).toString();
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
			slug: attributes.slug,
			title: attributes.title,
			image: attributes.image || null,
			tags: attributes.tags || [],
			date: attributes.date.toISOString(),
			updated: attributes.updated.toISOString(),
			body,
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
