import frontmatter from "front-matter";
import { markdownToDescription, markdownToHtml } from "../markdown";
import Store from "./store";

type ArticleAttrs = {
	slug: string;
	title: string;
	date: Date;
	image: string | null;
	tags: string[];
};
export type Article = Omit<ArticleAttrs, "date"> & {
	type: "article";
	date: string;
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
			throw new Error("parse failed: `date` did not exist");
		}

		return {
			type: "article",
			slug: attributes.slug || attributes.date.toISOString(),
			title: attributes.title || attributes.date.toISOString(),
			date: attributes.date.toISOString(),
			image: attributes.image || null,
			tags: attributes.tags || [],
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
