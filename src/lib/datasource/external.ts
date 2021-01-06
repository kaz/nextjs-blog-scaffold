import yaml from "js-yaml";
import { getMetadata } from "../meta";
import Store from "./store";

type ExternalAttrs = {
	url: string;
	publisher: string;
	title: string;
	date: Date;
	image: string | null;
	tags: string[];
};
export type External = Omit<ExternalAttrs, "date" | "overwriteTagsWithOgp"> & {
	type: "external";
	date: string;
};

const store = new Store<External>({
	getSourceDir() {
		return "./articles/external";
	},
	getFilter() {
		return ent => ent.endsWith(".yml") || ent.endsWith(".yaml");
	},
	getId(t) {
		return t.url;
	},
	async parse(raw) {
		const data = yaml.load(raw);
		if (!data || typeof data != "object") {
			throw new Error("parse failed: unexpected format");
		}

		const attrs: Partial<ExternalAttrs> = data;
		if (!attrs.url) {
			throw new Error("parse failed: `url` did not exist");
		}

		const metadata = await getMetadata(attrs.url);

		const title = attrs.title || metadata.title;
		if (!title) {
			throw new Error("parse failed: cannot determine `title`");
		}

		const date = attrs.date || metadata.date;
		if (!date) {
			throw new Error("parse failed: cannot determine `date`");
		}

		return {
			type: "external",
			url: metadata.url,
			publisher: attrs.publisher || metadata.publisher || new URL(attrs.url).hostname,
			title,
			date: new Date(date).toISOString(),
			image: attrs.image || metadata.image || null,
			tags: attrs.tags || [],
		};
	},
});

export const getExternals = () => store.getAll();
