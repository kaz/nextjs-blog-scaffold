import frontmatter from "front-matter";
import Store from "./store";

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
			slug: attributes.slug || attributes.date.toISOString(),
			title: attributes.title,
			date: attributes.date.toISOString(),
			tags: attributes.tags,
			body,
		};
	},
});

export const getArticles = () => store.getAll();
export const getArticleBySlug = (slug: string) => store.get(slug);