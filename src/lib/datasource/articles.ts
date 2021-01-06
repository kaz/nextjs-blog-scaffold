import frontmatter from "front-matter";
import { markdownToDescription, markdownToHtml } from "../markdown";
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
		return "./articles";
	},
	getFilter() {
		return ent => ent.endsWith(".md");
	},
	getId(t) {
		return t.slug;
	},
	async parse(raw) {
		const { attributes, body } = frontmatter<Partial<ArticleAttrs>>(raw);

		if (!attributes.date) {
			attributes.date = new Date();
		}
		if (!attributes.updated) {
			attributes.updated = attributes.date;
		}
		if (!attributes.title) {
			attributes.title = attributes.date.toISOString();
		}
		if (!attributes.slug) {
			attributes.slug = attributes.title;
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
